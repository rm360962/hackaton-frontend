import { ReactNode } from "react";
import { TPostagem } from "./TPostagem";

export type TEditModalProps = {
    postagem: TPostagem,
    visivel: boolean,
    setVisivel: Function,
    gravar: Function,
    children: ReactNode,
};