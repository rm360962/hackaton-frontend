import { useContext } from "react";
import { clienteAxios } from "../axios";
import { SessionContext } from "../sessionContext";
import { TRespostaErroApi } from "../types/TRespostaErroApi";
import { TAvaliacao, TBuscaAvaliacao, TEdicaoAvaliacao } from "../types/TAvaliacao";

export class AvaliacaoService {
    private contexto = useContext(SessionContext);

    buscarAvaliacoes = async (filtros: TBuscaAvaliacao): Promise<{ erro: string | null, avaliacoes: TAvaliacao[] }> => {
        const params: { [key: string]: any } = {};
        for (const [chave, valor] of Object.entries(filtros)) {
            if (valor !== null && valor !== undefined && valor !== '') {
                params[chave] = valor;
            }
        }

        try {
            const resposta = await clienteAxios({
                method: 'get',
                url: '/avaliacoes',
                params: params,
                headers: {
                    token: this.contexto.sessao.token
                }
            });

            return {
                erro: resposta.status === 200 ? null : 'Erro na busca das avaliações',
                avaliacoes: resposta.status === 200 ? resposta?.data : [],
            };
        } catch (erro) {
            console.log('Erro na busca das avaliacoes', erro);
            return {
                erro: 'Erro na busca das avaliações',
                avaliacoes: [] as TAvaliacao[],
            };
        }
    };

    buscarAvaliacaoPorId = async (id: number): Promise<{ erro: string | null, avaliacao: TAvaliacao }> => {
        try {
            const resposta = await clienteAxios({
                method: 'get',
                url: `/avaliacoes/${id}`,
                headers: {
                    token: this.contexto.sessao.token,
                },
            });

            return {
                erro: resposta.status === 200 ? null : 'Erro ao busca a avaliação',
                avaliacao: resposta.status === 200 ? resposta.data : {}
            };
        } catch (erro) {
            console.log('Erro ao busca a avaliação', erro);
            return {
                erro: 'Erro ao busca a avaliação',
                avaliacao: {} as TAvaliacao
            };
        }
    };

    cadastrarAvaliacao = async (avaliacao: TEdicaoAvaliacao): Promise<{ erros: TRespostaErroApi[] | null, avaliacao: TEdicaoAvaliacao }> => {
        try {
            const resposta = await clienteAxios({
                method: 'post',
                url: '/avaliacoes',
                data: avaliacao,
                headers: {
                    token: this.contexto.sessao.token,
                },
                validateStatus: (status: number) => [201, 422].includes(status),
            });

            if (resposta.status === 201) {
                avaliacao.id = resposta.data.id;
                return {
                    avaliacao: avaliacao,
                    erros: null,
                };
            } else {
                return {
                    avaliacao: {} as TEdicaoAvaliacao,
                    erros: resposta.data.erros,
                };
            }
        } catch (erro) {
            console.log('Erro no cadastro da conteudo', erro);
            return {
                avaliacao: {} as TEdicaoAvaliacao,
                erros: [
                    {
                        mensagem: 'Erro ao cadastrar a conteudo',
                    }
                ],
            }
        }
    };

    editarAvaliacao = async (avaliacao: TEdicaoAvaliacao): Promise<TRespostaErroApi[] | null> => {
        try {
            const resposta = await clienteAxios({
                method: 'put',
                url: `/avaliacoes/${avaliacao.id}`,
                data: avaliacao,
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
            console.log('Erro ao editar a conteudo', erro);
            return [
                {
                    mensagem: 'Erro ao editar a conteudo'
                }
            ];
        }
    };

    removerAvaliacao = async (id: number) : Promise<boolean> => {
        try {
            const resposta = await clienteAxios({
                method: 'delete',
                url: `/avaliacoes/${id}`,
                headers: {
                    token: this.contexto.sessao.token
                },
            });

            return resposta.status === 200;
        } catch (erro) {
            console.log('Erro na exclusao da avaliacao', erro);
            return false;
        }
    };

    removerPergunta = async (id: number) : Promise<boolean> => {
        try {
            const resposta = await clienteAxios({
                method: 'delete',
                url: `/avaliacoes/pergunta/${id}`,
                headers: {
                    token: this.contexto.sessao.token
                },
            });

            return resposta.status === 200;
        } catch (erro) {
            console.log('Erro na exclusao da pergunta', erro);
            return false;
        }
    };
}