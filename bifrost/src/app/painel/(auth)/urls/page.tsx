"use client";

import { CardUrlForm } from "@/componentes/CardUrlForm";
import TabelaPainel from "@/componentes/TabelaPainel";
import { Botao } from "@/componentes/ui/Botao";
import { Overlay } from "@/componentes/ui/Overlay";
import Toggle from "@/componentes/ui/Toggle";
import { url } from "@/type/url";
import { useEffect, useState } from "react";



export default function UrlPage() {
    const [urls, setUrls] = useState<url[]>([]);
    const [cardAberto, setCardAberto] = useState<null | { modo: "editar" | "criar" | "excluir"; id?: string }>(null);
    const [showCard, setShowCard] = useState<boolean>(false);

    async function carregarUrls() {
        const res = await fetch("/api/urls");
        const data = await res.json();
        setUrls(data.data);
    }

    useEffect(() => {
        carregarUrls();
    }, []);

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
            setShowCard(false)
            carregarUrls();
        }
    }

    async function onAtivarDesativar(id: string) {
        await fetch(`/api/urls/${id}/status`, {
            method: "PATCH",
            credentials: "include"
        });
        await carregarUrls();
    }

    return (
        <div className="w-full h-full ">
            <div className="flex justify-end mb-4">
                <Botao texto="Nova URL" bgColor="bg-verde" onClick={() => { setCardAberto({ modo: "criar" }); setShowCard(true) }} />
            </div>

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
                                <span className="font-light text-xs wrap-break-word"><a href={`https://r.londrinet.com/r/${item.id}`}>{`https://r.londrinet.com/r/${item.id}`}</a></span>
                            </div>
                            <span><strong className='font-medium text-sm '>Destino:</strong><a href={item.target} className='wrap-break-word'> {item.target}</a></span>
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
                        <Botao texto="Editar" tamanho="sm" bgColor="bg-azul" onClick={() => { setShowCard(true); setCardAberto({ modo: "editar", id: item.id }) }} />
                        <Botao texto="Excluir" tamanho="sm" bgColor="bg-vermelho" onClick={() => { setShowCard(true); setCardAberto({ modo: "excluir", id: item.id }) }} />
                    </div>
                )}
            />
            <Overlay onClick={() => { setCardAberto(null); setShowCard(false) }} show={showCard} />

            {cardAberto && (
                <CardUrlForm
                    modo={cardAberto.modo}
                    urlId={cardAberto.id}
                    onClose={() => {
                        setCardAberto(null);
                        setShowCard(false)
                        carregarUrls();
                    }}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
}