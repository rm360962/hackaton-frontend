import { ReactNode } from "react"

export type TSearchFilter = {
    children: ReactNode,
    pesquisar: Function,
    limpar: Function
};