export type TAvaliacao = {
    id: number,
    nome: string,
    descricao: string,
    tipo: string,
    ativo: boolean,
    perguntas: TPergunta[]
};

export type TPergunta = {
    id: number,
    descricao: string,
    peso: number,
    tipo: number,
    items: string[],
    respostaCorreta: number
};

export type TEdicaoAvaliacao = {
    id?: number,
    nome: string,
    descricao: string,
    tipo: string,
    perguntas: TPergunta,
};

export type TEdicaoPergunta = {
    id?: number,
    descricao: string,
    peso: number,
    tipo: string,
    items?: string[],
    alternativas?: string,
    respostaCorreta?: string
};