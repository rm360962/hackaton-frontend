export type TConteudo =  {
    id: number,
    titulo: string,
    descricao: string,
    usuario: TUsuarioBasico,
    dataInclusao: string,
    usuarioInclusao: string,
};

export type TUsuarioBasico = {
    id: number,
    nome: string,
};

export type TBuscaConteudo = {
    id: string,
    titulo: string,
    descricao: string,
    usuarioId: string,
    dataInclusaoInicio: string,
    dataInclusaoFim: string
};

export type TEdicaoConteudo = {
    id?: number,
    titulo: string,
    descricao: string
};

export type TTextArea = {
    valor: string,
    tamanhoMaximo?: number,
    onChange: Function,
    obrigatorio: boolean,
    style?: any
};