import { ReactNode } from "react";

export type TButtonProps = {
    tipo?: 'submit' | 'reset' | 'button',
    titulo?: string,
    carregando?: boolean,
    desabilitado?: boolean,
    children: ReactNode,
    onClick?: Function,
    style?: any,
    class: string
};