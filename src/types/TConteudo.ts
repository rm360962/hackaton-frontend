import { TUsuarioBasico } from "./TUsuario";

export type TConteudo =  {
    id: number,
    titulo: string,
    descricao: string,
    texto: string,
    usuario: TUsuarioBasico,
    dataInclusao: string,
    usuarioInclusao: string,
};

export type TBuscaConteudo = {
    id?: string,
    titulo?: string,
    descricao?: string,
    usuarioId?: string,
    ativo?: boolean,
    dataInclusaoInicio?: string,
    dataInclusaoFim?: string,
};

export type TEdicaoConteudo = {
    id?: number,
    titulo: string,
    descricao: string,
    texto: string
};

export type TCardConteudo = {
    conteudo: TConteudo,
    visualizar?: Function,
    remover?: Function,
    editar?: Function,
};