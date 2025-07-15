import { validarUuid } from "./validar"
import { verificaAdmin } from '@/service/usuarioService';

export const ehAdmin = async (id: string): Promise<boolean> => {
    // Validação de UUID
    if (!validarUuid(id)) {
        return false;
    }

    return await verificaAdmin(id);
};