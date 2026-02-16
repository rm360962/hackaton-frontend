import { useContext } from "react";
import { SessionContext } from "../sessionContext";
import { TAvaliacaoAluno, TBuscaAvaliacaoAluno, TEdicaoAvaliacaoAluno } from "../types/TAvaliacaoUsuario";
import { clienteAxios } from "../axios";
import { TRespostaErroApi } from "../types/TRespostaErroApi";

export class AvaliacaoAlunoService {

    private contexto = useContext(SessionContext);

    buscarAvaliacoesUsuario = async (filtros: TBuscaAvaliacaoAluno): Promise<{ erro: string | null, avaliacoesAluno: TAvaliacaoAluno[] }> => {
        const params: { [key: string]: any } = {};
        for (const [chave, valor] of Object.entries(filtros)) {
            if (valor !== null && valor !== undefined && valor !== '') {
                params[chave] = valor;
            }
        }

        try {
            const resposta = await clienteAxios({
                method: 'get',
                url: '/avaliacoes/aluno',
                params: params,
                headers: {
                    token: this.contexto.sessao.token
                }
            });

            return {
                erro: resposta.status === 200 ? null : 'Erro na busca das avaliações aluno',
                avaliacoesAluno: resposta.status === 200 ? resposta?.data : [],
            };
        } catch (erro) {
            console.log('Erro na busca das avaliacoes aluno', erro);
            return {
                erro: 'Erro na busca das avaliações aluno',
                avaliacoesAluno: [] as TAvaliacaoAluno[],
            };
        }
    };

    buscarAvaliacaoAlunoPorId = async (id: number): Promise<{ erro: string | null, avaliacaoAluno: TAvaliacaoAluno }> => {
        try {
            const resposta = await clienteAxios({
                method: 'get',
                url: `/avaliacoes/aluno/${id}`,
                headers: {
                    token: this.contexto.sessao.token,
                },
            });

            return {
                erro: resposta.status === 200 ? null : 'Erro na busca da avaliacão aluno',
                avaliacaoAluno: resposta.status === 200 ? resposta.data : {}
            };
        } catch (erro) {
            console.log('Erro ao busca a avaliacao aluno', erro);
            return {
                erro: 'Erro na busca da avaliacão aluno',
                avaliacaoAluno: {} as TAvaliacaoAluno
            };
        }
    };

    cadastrarAvaliacaoAluno = async (avaliacaoAluno: TEdicaoAvaliacaoAluno): Promise<{ erros: TRespostaErroApi[] | null }> => {
        try {
            const resposta = await clienteAxios({
                method: 'post',
                url: '/avaliacoes/aluno',
                data: avaliacaoAluno,
                headers: {
                    token: this.contexto.sessao.token,
                },
                validateStatus: (status: number) => [201, 422, 400].includes(status),
            });

            if (resposta.status === 201) {
                return {
                    erros: null
                };
            } else {
                return {
                    erros: resposta.data.erros,
                };
            }
        } catch (erro) {
            console.log('Erro no cadastro da avaliação aluno', erro);
            return {
                erros: [
                    {
                        mensagem: 'Erro ao cadastrar a avaliação aluno',
                    }
                ],
            }
        }
    };

    editarAvaliacaoAluno = async (avaliacaoAluno: TEdicaoAvaliacaoAluno): Promise<TRespostaErroApi[] | null> => {
        try {
            const resposta = await clienteAxios({
                method: 'put',
                url: `/avaliacoes/aluno/${avaliacaoAluno.id}`,
                data: avaliacaoAluno,
                headers: {
                    token: this.contexto.sessao.token,
                },
                validateStatus: (status: number) => [200, 422].includes(status),
            });

            if (resposta.status === 200) {
                return null;
            } else {
                return resposta.data.erros;
            }
        } catch (erro) {
            console.log('Erro ao editar a avaliação aluno', erro);
            return [
                {
                    mensagem: 'Erro ao editar a avaliação aluno'
                }
            ];
        }
    };

    removerAvaliacaoAluno = async (id: number): Promise<boolean> => {
        try {
            const resposta = await clienteAxios({
                method: 'delete',
                url: `/avaliacoes/aluno/${id}`,
                headers: {
                    token: this.contexto.sessao.token
                },
            });

            return resposta.status === 200;
        } catch (erro) {
            console.log('Erro na exclusão da avaliação aluno', erro);
            return false;
        }
    };
}