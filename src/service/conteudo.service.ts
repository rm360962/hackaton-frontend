import { useContext } from "react";
import { conexaoApi } from "../axios";
import { TBuscaConteudo, TEdicaoConteudo, TConteudo } from "../types/TConteudo";
import { SessionContext } from "../sessionContext";
import { TRespostaErroApi } from "../types/TRespostaErroApi";

export class ConteudoService {
    private context = useContext(SessionContext);

    buscarConteudos = async (dados: TBuscaConteudo) => {
        const params: { [key: string]: any } = {};
        for (const [chave, valor] of Object.entries(dados)) {
            if (valor !== null && valor !== undefined && valor !== '') {
                params[chave] = valor;
            }
        }

        try {
            const resposta = await conexaoApi({
                method: 'get',
                url: '/conteudo',
                params: params,
                headers: {
                    token: this.context.sessao.token
                }
            });

            return {
                erro: resposta.status === 200 ? null : 'Erro na busca dos conteudos',
                conteudos: resposta.status === 200 ? resposta?.data : [],
            };
        } catch (erro) {
            console.log('Erro na busca dos conteudos', erro);
            return {
                erro: 'Erro ao buscar as postagens',
                conteudos: [],
            };
        }
    };

    buscarConteudoPorId = async (id: number): Promise<{ erro: string | null, conteudo: TConteudo }> => {
        try {
            const resposta = await conexaoApi({
                method: 'get',
                url: `/conteudo/${id}`,
                headers: {
                    token: this.context.sessao.token,
                },
            });

            return {
                erro: resposta.status === 200 ? null : 'Erro ao buscar a conteudo',
                conteudo: resposta.status === 200 ? resposta.data : {}
            };
        } catch (erro) {
            console.log('Erro buscar a conteudo por id', erro);
            return {
                erro: 'Erro ao buscar a conteudo',
                conteudo: {} as TConteudo
            };
        }
    };

    cadastrarConteudo = async (conteudo: TEdicaoConteudo): Promise<{ erros: TRespostaErroApi[] | null, conteudo: TEdicaoConteudo }> => {
        try {
            const resposta = await conexaoApi({
                method: 'post',
                url: '/conteudo',
                data: conteudo,
                headers: {
                    token: this.context.sessao.token,
                },
                validateStatus: (status: number) => [201, 422].includes(status),
            });

            if (resposta.status === 201) {
                conteudo.id = resposta.data.id;
                return {
                    conteudo: conteudo,
                    erros: null,
                };
            } else {
                return {
                    conteudo: {} as TEdicaoConteudo,
                    erros: resposta.data.erros,
                };
            }
        } catch (erro) {
            console.log('Erro no cadastro da conteudo', erro);
            return {
                conteudo: {} as TEdicaoConteudo,
                erros: [
                    {
                        mensagem: 'Erro ao cadastrar a conteudo',
                    }
                ],
            }
        }
    };

    editarConteudo = async (conteudo: TEdicaoConteudo): Promise<TRespostaErroApi[] | null> => {
        try {
            const resposta = await conexaoApi({
                method: 'put',
                url: `/conteudo/${conteudo.id}`,
                data: conteudo,
                headers: {
                    token: this.context.sessao.token,
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

    removerConteudo = async (id: number) : Promise<boolean> => {
        try {
            const resposta = await conexaoApi({
                method: 'delete',
                url: `/conteudo/${id}`,
                headers: {
                    token: this.context.sessao.token
                },
            });

            return resposta.status === 200;
        } catch (erro) {
            console.log('Erro na exclusao da conteudo', erro);
            return false;
        }
    };

}