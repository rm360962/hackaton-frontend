import { useContext } from "react";
import { conexaoApi } from "../axios";
import { TBuscaUsuario, TEdicaoUsuario, TEdicaoUsuarioResposta, TUsuario } from "../types/TUsuario";
import { SessionContext } from "../sessionContext";
import { TCategoriaUsuario } from "../types/TSession";
import { TRespostaErroApi } from "../types/TRespostaErroApi";

export class UsuarioService {
    private context = useContext(SessionContext);

    buscarUsuarios = async (token: string, filtros: TBuscaUsuario) => {
        const params: { [key: string]: any } = {};
        for (const [chave, valor] of Object.entries(filtros)) {
            if (valor !== null && valor !== undefined && valor !== '') {
                params[chave] = valor;
            }
        }

        try {
            const resposta = await conexaoApi({
                method: 'get',
                url: '/users',
                params: params,
                headers: {
                    token: token
                },
            });

            return {
                erro: resposta.status === 200 ? null : 'Erro ao buscar os usuários',
                usuarios: resposta.status === 200 ? resposta?.data : [],
            };
        } catch (erro) {
            console.log('Erro ao buscar o usuário', erro);
            return {
                erro: 'Erro ao buscar os usuários',
                usuarios: [],
            };
        }
    };

    buscarUsuarioPorId = async (token: string, id: number): Promise<{ erro: string | null, usuario: TUsuario }> => {
        try {
            const resposta = await conexaoApi({
                method: 'get',
                url: `/users?id=${id}`,
                headers: {
                    token: token
                },
            });

            return {
                erro: resposta.status === 200 ? null : 'Erro ao buscar os usuários',
                usuario: resposta.status == 200 && resposta.data.length > 0 ? resposta?.data[0] : {}
            };
        } catch (erro) {
            console.log('Erro na busca do usuario por id', erro);
            return {
                erro: 'Erro ao buscar o usuário',
                usuario: {} as TUsuario
            };
        }
    };

    buscarCategoriasUsuario = async (): Promise<{ erro: string | null, categorias: TCategoriaUsuario[] }> => {
        try {
            const resposta = await conexaoApi({
                method: 'get',
                url: `/users/categories`,
                headers: {
                    token: this.context.sessao.token
                },
            });

            return {
                erro: resposta.status === 200 ? null : 'Erro na busca das categorias de usuário',
                categorias: resposta.status == 200 ? resposta.data : []
            };
        } catch (erro) {
            console.log('Erro na busca do usuario por id', erro);
            return {
                erro: 'Erro na busca das categorias de usuário',
                categorias: [] as TCategoriaUsuario[],
            };
        }
    };

    cadastrarUsuario = async (usuario: TEdicaoUsuario): Promise<{ erros: TRespostaErroApi[] | null, usuario: TEdicaoUsuario }> => {
        try {
            const resposta = await conexaoApi({
                method: 'post',
                url: `/users`,
                data: usuario,
                headers: {
                    token: this.context.sessao.token
                },
            });

            if (resposta.status === 201) {
                usuario.id = resposta.data.id;
                return {
                    usuario: usuario,
                    erros: null,
                };
            } else {
                return {
                    usuario: usuario,
                    erros: resposta.data.erros,
                };
            }

        } catch (erro) {
            console.log('Erro na busca do usuario por id', erro);
            return {
                usuario: usuario,
                erros: [
                    {
                        mensagem: 'Erro ao cadastrar a postagem'
                    }
                ],
            };
        }
    };

    editarUsuario = async (usuario: TEdicaoUsuario): Promise<TRespostaErroApi[] | null> => {
        try {
            const resposta = await conexaoApi({
                method: 'put',
                url: `/users/${usuario.id}`,
                data: usuario,
                headers: {
                    token: this.context.sessao.token
                },
            });

            return resposta.status === 200 ? null : resposta.data;
        } catch (erro) {
            console.log('Erro ao editar o usuario', erro);
            return [
                {
                    mensagem: 'Erro ao editar o usuário'
                }
            ]
        }
    };

    removerUsuario = async (id: number): Promise<boolean> => {
        try {
            const resposta = await conexaoApi({
                method: 'delete',
                url: `/users/${id}`,
                headers: {
                    token: this.context.sessao.token
                },
            });

            return resposta.status === 200;
        } catch (erro) {
            console.log('Erro ao remover o usuario', erro);
            return false;
        }
    };

    buscarProfessores = async () : Promise<{ erro: string | null, usuarios: TUsuario[]}> => {
        try {
            const resposta = await conexaoApi({
                method: 'get',
                url: `/users/teachers`,
                headers: {
                    token: this.context.sessao.token,
                },
            });

            return {
                erro: resposta.status === 200 ? null : 'Erro ao buscar os professores',
                usuarios: resposta.status == 200 ? resposta.data : []
            };
        } catch (erro) {
            console.log('Erro na busca do usuario por id', erro);
            return {
                erro: 'Erro ao buscar o usuário',
                usuarios: []
            };
        }
    };
};