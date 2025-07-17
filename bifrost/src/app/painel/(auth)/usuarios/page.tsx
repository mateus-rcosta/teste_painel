"use client";

import { CardUsuarioForm } from "@/componentes/CardUsuarioForm";
import { useDebounce } from "@/componentes/hooks/useDebounce";
import TabelaPainel from "@/componentes/TabelaPainel";
import { Overlay } from "@/componentes/ui/Overlay";
import Toggle from "@/componentes/ui/Toggle";
import { Usuario } from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from "react";
import FiltroPainel from "@/componentes/FiltroPainel";
import { Botao } from "@/componentes/ui/Botao";

export default function UsuarioPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cardAberto, setCardAberto] = useState<null | { modo: "editar" | "criar" | "excluir"; id?: string }>(null);
    const [showCard, setShowCard] = useState<boolean>(false);

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    const [searchField, setSearchField] = useState("nome");
    const [search, setSearch] = useState("");
    const [value, setValue] = useState("");

    const debouncedSearch = useDebounce(search, 500);

    const campos = [
        { value: "nome", label: "Nome" },
        { value: "email", label: "Email" },
    ];

    const handleSearch = (newValue: string) => {
        setValue(newValue);
        setSearch(newValue);
        setPage(1); // 🔑 Reinicia paginação ao trocar busca
    };

    const carregarUsuarios = useCallback(async (pageToLoad: number) => {
        const url = `/api/admin/usuarios?page=${pageToLoad}&searchField=${searchField}&search=${debouncedSearch}`;
        const res = await fetch(url);
        const data = await res.json();

        if (pageToLoad === 1) {
            setUsuarios(data.data);
        } else {
            setUsuarios((prev) => [...prev, ...data.data]);
        }

        setHasNext(pageToLoad < data.meta.totalPages);
    }, [debouncedSearch, searchField]);

    useEffect(() => {
        setPage(1);
        carregarUsuarios(1);
    }, [debouncedSearch, searchField, refreshKey, carregarUsuarios]);

    useEffect(() => {
        if (page !== 1) {
            carregarUsuarios(page);
        }
    }, [carregarUsuarios, page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasNext) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [hasNext]);

    async function handleConfirm(valores: unknown) {
        if (!cardAberto) return;

        try {
            if (cardAberto.modo === "criar") {
                await fetch("/api/admin/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(valores),
                    credentials: "include",
                });
            }

            if (cardAberto.modo === "editar" && cardAberto.id) {
                await fetch(`/api/admin/usuarios/${cardAberto.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(valores),
                    credentials: "include",
                });
            }

            if (cardAberto.modo === "excluir" && cardAberto.id) {
                await fetch(`/api/admin/usuarios/${cardAberto.id}`, {
                    method: "DELETE",
                    credentials: "include",
                });
            }
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setCardAberto(null);
            setShowCard(false);
            setRefreshKey((prev) => prev + 1);
        }
    }

    async function onAtivarDesativar(id: string) {
        await fetch(`/api/admin/usuarios/${id}/status`, {
            method: "PATCH",
            credentials: "include",
        });
        setRefreshKey((prev) => prev + 1);
    }

    return (
        <div className="w-full h-full flex flex-col">
            <FiltroPainel
                searchField={searchField}
                onChangeSearchField={(field) => {
                    setSearchField(field);
                    setPage(1); // reinicia paginação
                }}
                searchValue={value}
                onChangeSearchValue={handleSearch}
                campos={campos}
                textoBotaoNovo="Novo Usuário"
                onNovo={() => {
                    setCardAberto({ modo: "criar" });
                    setShowCard(true);
                }}
            />

            <TabelaPainel
                dados={usuarios}
                renderStatus={(item) => (
                    <Toggle checked={item.estaAtivo} onChange={() => onAtivarDesativar(item.id)} />
                )}
                renderConteudo={(item) => (
                    <div className="flex flex-col lg:flex-row text-sm w-full">
                        <div className="flex flex-col flex-1/2 gap-1">
                            <div className="flex flex-col">
                                <span className="font-medium text-lg">{item.nome}</span>
                                <span className="font-light text-xs wrap-break-word">
                                    {item.ehAdmin ? `Administrador` : `Usuário`}
                                </span>
                            </div>
                            <span>{item.email}</span>
                        </div>
                    </div>
                )}
                renderAcoes={(item) => (
                    <div className="flex flex-col lg:flex-row gap-2">
                        <Botao
                            texto="Editar"
                            tamanho="sm"
                            bgColor="bg-azul"
                            onClick={() => {
                                setShowCard(true);
                                setCardAberto({ modo: "editar", id: item.id });
                            }}
                        />
                        <Botao
                            texto="Excluir"
                            tamanho="sm"
                            bgColor="bg-vermelho"
                            onClick={() => {
                                setShowCard(true);
                                setCardAberto({ modo: "excluir", id: item.id });
                            }}
                        />
                    </div>
                )}
            />

            <div ref={loaderRef} className="w-full h-10" />

            <Overlay onClick={() => { setCardAberto(null); setShowCard(false); }} show={showCard} />

            {cardAberto && (
                <CardUsuarioForm
                    modo={cardAberto.modo}
                    usuarioId={cardAberto.id}
                    onClose={() => {
                        setCardAberto(null);
                        setShowCard(false);
                        setRefreshKey((prev) => prev + 1);
                    }}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
}
