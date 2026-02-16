import { Enumerado } from "./Generico";
import { TAvaliacaoBasica } from "./TAvaliacao";
import { TUsuarioBasico } from "./TUsuario";

export type TAvaliacaoAluno = {
    id: number,
    usuario: TUsuarioBasico,
    avaliacao: TAvaliacaoBasica,
    conteudosId: number[],
    dataLimite: string,
    dataExecucao: string,
    situacao: Enumerado,
    nota: number,
    ativo: boolean,
    dataInclusao: string,
    dataAlteracao: string,
    usuarioInclusao: string,
    usuarioAlteracao: string
};

export type TBuscaAvaliacaoAluno = {
    id: string,
    usuarioId: string,
    avaliacaoId: string,
    situacao: string,
};

export type TEdicaoAvaliacaoAluno = {
    id: string,
    avaliacaoId: string,
    usuarioId: string,
    usuariosId?: string[],
    conteudosId: string[],
    dataLimite: string,
    dataExecucao: string,
    nota: string,
    situacaoId: string
};