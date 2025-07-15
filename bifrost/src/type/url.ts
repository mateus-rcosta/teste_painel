import { UTM } from "./utm";

export interface url{
    id: string;
    nome: string;
    utms: UTM;
    target: string;
    estaAtivo: boolean;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}
