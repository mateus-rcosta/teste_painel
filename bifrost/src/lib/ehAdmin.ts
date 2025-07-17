import { verificarAdmin } from "@/service/usuarioService";
import { validarUuid } from "./validar"

export const ehAdmin = async (id: string): Promise<boolean> => {
    // Validação de UUID
    if (!validarUuid(id)) {
        return false;
    }

    return await verificarAdmin(id);
};