import { TSelectItem } from "../types/TComponentProps";

export const converterEnumeradoSelectItem = (enumerado: any): TSelectItem[] => {
    return Object.entries(enumerado)
        .filter(([chave]) => isNaN(Number(chave)))
        .map(([chave, valor]) => {
            return {
                label: chave,
                valor: valor 
            };
        });
};
