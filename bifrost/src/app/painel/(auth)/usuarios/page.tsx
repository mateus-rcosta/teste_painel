"use client";

import { CardUsuarioForm } from "@/componentes/CardUsuarioForm";
import TabelaPainel from "@/componentes/TabelaPainel";
import { Botao } from "@/componentes/ui/Botao";
import { Overlay } from "@/componentes/ui/Overlay";
import Toggle from "@/componentes/ui/Toggle";
import { usuario } from "@prisma/client";
import { useEffect, useState } from "react";



export default function UrlPage() {
    const [usuarios, setUsuarios] = useState<usuario[]>([]);
    const [cardAberto, setCardAberto] = useState<null | { modo: "editar" | "criar" | "excluir"; id?: string }>(null);
    const [showCard, setShowCard] = useState<boolean>(false);

    async function carregarUsuarios() {
        const res = await fetch("/api/admin/usuarios");
        const data = await res.json();
        setUsuarios(data.data);
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    async function handleConfirm(valores: unknown) {
        if (!cardAberto) return;

        try {
            if (cardAberto.modo === "criar") {
                await fetch("/api/admin/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(valores),
                    credentials: "include"
                });
            }

            if (cardAberto.modo === "editar" && cardAberto.id) {
                await fetch(`/api/admin/usuarios/${cardAberto.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(valores),
                    credentials: "include"
                });
            }

            if (cardAberto.modo === "excluir" && cardAberto.id) {
                await fetch(`/api/admin/usuarios/${cardAberto.id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
            }
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setCardAberto(null);
            setShowCard(false)
            carregarUsuarios();
        }
    }

    async function onAtivarDesativar(id: string) {
        await fetch(`/api/admin/usuarios/${id}/status`, {
            method: "PATCH",
            credentials: "include"
        });
        await carregarUsuarios();
    }

    return (
        <div className="w-full h-full ">
            <div className="flex justify-end mb-4">
                <Botao texto="Novo Usuário" bgColor="bg-verde" onClick={() => { setCardAberto({ modo: "criar" }); setShowCard(true) }} />
            </div>

            <TabelaPainel
                dados={usuarios}
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
                                <span className="font-light text-xs wrap-break-word">{item.ehAdmin ? `Administrador` : `Usuário`}</span>                            
                            </div>
                            <span>{item.email}</span>
                        </div>
                    </div>
                )}
                renderAcoes={(item) => (
                    <div className="flex flex-col lg:flex-row gap-2">
                        <Botao texto="Editar" tamanho="sm" bgColor="bg-azul" onClick={() => { setShowCard(true); setCardAberto({ modo: "editar", id: item.id }) }} />
                        <Botao texto="Excluir" tamanho="sm" bgColor="bg-vermelho" onClick={() => { setShowCard(true); setCardAberto({ modo: "excluir", id: item.id }) }} />
                    </div>
                )}
            />
            <Overlay onClick={() => { setCardAberto(null); setShowCard(false) }} show={showCard} />

            {cardAberto && (
                <CardUsuarioForm
                    modo={cardAberto.modo}
                    usuarioId={cardAberto.id}
                    onClose={() => {
                        setCardAberto(null);
                        setShowCard(false)
                        carregarUsuarios();
                    }}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
}