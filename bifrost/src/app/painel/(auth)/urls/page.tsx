"use client";

import { CardUrlForm } from "@/componentes/CardUrlForm";
import { useDebounce } from "@/componentes/hooks/useDebounce";
import TabelaPainel from "@/componentes/TabelaPainel";
import { Botao } from "@/componentes/ui/Botao";
import { Overlay } from "@/componentes/ui/Overlay";
import Toggle from "@/componentes/ui/Toggle";
import { url } from "@/type/url";
import { useEffect, useRef, useState, useCallback } from "react";
import FiltroPainel from "@/componentes/FiltroPainel";

export default function UrlPage() {
    const [urls, setUrls] = useState<url[]>([]);
    const [cardAberto, setCardAberto] = useState<null | { modo: "editar" | "criar" | "excluir"; id?: string }>(null);
    const [showCard, setShowCard] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const [searchField, setSearchField] = useState("nome");
    const [search, setSearch] = useState('');
    const [value, setValue] = useState('');

    const debouncedSearch = useDebounce(search, 500);

    const dominio = process.env.NEXT_PUBLIC_DOMINIO!;

    const carregarUrls = useCallback(async (pageToLoad: number) => {
        const params = new URLSearchParams({
            page: String(pageToLoad),
            searchField: searchField,
            searchValue: debouncedSearch
        });

        const res = await fetch(`/api/urls?${params.toString()}`);
        const data = await res.json();

        if (pageToLoad === 1) {
            setUrls(data.data);
        } else {
            setUrls((prev) => [...prev, ...data.data]);
        }

        setHasNext(pageToLoad < data.totalPages);
    }, [debouncedSearch, searchField]);

    useEffect(() => {
        carregarUrls(page);
    }, [page, refreshKey, carregarUrls]);

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
                await fetch("/api/urls", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(valores),
                    credentials: "include"
                });
            }

            if (cardAberto.modo === "editar" && cardAberto.id) {
                await fetch(`/api/urls/${cardAberto.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(valores),
                    credentials: "include"
                });
            }

            if (cardAberto.modo === "excluir" && cardAberto.id) {
                await fetch(`/api/urls/${cardAberto.id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
            }
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setCardAberto(null);
            setShowCard(false);
            setPage(1);
            setRefreshKey((prev) => prev + 1);
        }
    }

    async function onAtivarDesativar(id: string) {
        await fetch(`/api/urls/${id}/status`, {
            method: "PATCH",
            credentials: "include"
        });
        setPage(1);
    }

    return (
        <div className="w-full h-full flex flex-col">
            <FiltroPainel
                searchField={searchField}
                onChangeSearchField={(val) => {
                    setSearchField(val);
                    setPage(1);
                }}
                searchValue={value}
                onChangeSearchValue={(val) => {
                    setValue(val);
                    setSearch(val);
                }}
                campos={[
                    { value: "nome", label: "Nome" },
                    { value: "target", label: "Destino" },
                    { value: "utms.source", label: "Origem" },
                    { value: "utms.medium", label: "Meio" },
                    { value: "utms.campaign", label: "Campanha" },
                ]}
                onNovo={() => {
                    setCardAberto({ modo: "criar" });
                    setShowCard(true);
                }}
                textoBotaoNovo="Nova URL"
            />

            <TabelaPainel
                dados={urls}
                renderStatus={(item) => (
                    <Toggle
                        checked={item.estaAtivo}
                        onChange={() => onAtivarDesativar(item.id)}
                    />
                )}
                renderConteudo={(item) => (
                    <div className="flex flex-col lg:flex-row text-sm w-full">
                        <div className="flex flex-col flex-1/2 gap-1">
                            <div className="flex flex-col">
                                <span className="font-medium text-lg">{item.nome}</span>
                                <span className="font-light text-xs wrap-break-word">
                                    <a href={`${dominio}/${item.id}`}>
                                        {`${dominio}/${item.id}`}
                                    </a>
                                </span>
                            </div>
                            <span>
                                <strong className='font-medium text-sm '>Destino:</strong>
                                <a href={item.target} className='wrap-break-word'> {item.target}</a>
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 flex-1/2">
                            {item.utms?.source && <span><strong className='font-medium text-sm'>Origem:</strong> {item.utms?.source}</span>}
                            {item.utms?.medium && <span><strong className='font-medium text-sm'>Meio:</strong> {item.utms?.medium}</span>}
                            {item.utms?.campaign && <span><strong className='font-medium text-sm'>Campanha:</strong> {item.utms?.campaign}</span>}
                        </div>
                    </div>
                )}
                renderAcoes={(item) => (
                    <div className="flex flex-col lg:flex-row gap-2">
                        <Botao texto="Editar" tamanho="sm" bgColor="bg-azul" onClick={() => { setShowCard(true); setCardAberto({ modo: "editar", id: item.id }); }} />
                        <Botao texto="Excluir" tamanho="sm" bgColor="bg-vermelho" onClick={() => { setShowCard(true); setCardAberto({ modo: "excluir", id: item.id }); }} />
                    </div>
                )}
            />

            <div ref={loaderRef} className="h-10" />

            <Overlay onClick={() => { setCardAberto(null); setShowCard(false); }} show={showCard} />

            {cardAberto && (
                <CardUrlForm
                    modo={cardAberto.modo}
                    urlId={cardAberto.id}
                    onClose={() => {
                        setCardAberto(null);
                        setShowCard(false);
                        setPage(1);
                    }}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
};
