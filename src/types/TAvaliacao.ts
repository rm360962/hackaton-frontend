import { Enumerado } from "./Generico";

export type TAvaliacao = {
    id: number,
    nome: string,
    descricao: string,
    tipo: Enumerado,
    ativo: boolean,
    dataInclusao?: string,
    usuarioInclusao: string,
    dataAlteracao?: string,
    usuarioAlteracao: string
    perguntas: TPergunta[]
};

export type TPergunta = {
    id: number,
    descricao: string,
    valor: number,
    tipo: Enumerado,
    itens: string[],
    ativo: boolean,
    dataInclusao: string,
    usuarioInclusao: string,
    dataAlteracao?: string,
    usuarioAlteracao?: string,
    respostaCorreta: number
};

export type TEdicaoAvaliacao = {
    id?: string,
    nome: string,
    descricao: string,
    tipo: string,
    perguntas?: TEdicaoPergunta[],
};

export type TEdicaoPergunta = {
    id?: number,
    descricao: string,
    valor: number,
    tipo: string,
    itens?: string[],
    alternativas?: string,
    respostaCorreta?: string
    respostaCorretaLabel?: string
};

export type TGeracaoPergunta = {
    assunto: string,
    qtdDescritiva: number,
    qtdMuliplaEscolha: number,
};

export type TBuscaAvaliacao = {
    id?: string,
    nome?: string,
    descricao?: string,
    ativo?: boolean,
    tipo?: string
};  

export type TAvaliacaoBasica = {
    id: number,
    nome: string,
    tipo: string
};