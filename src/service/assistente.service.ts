import { TEdicaoPergunta, TGeracaoPergunta } from "../types/TAvaliacao";
import { useContext } from "react";
import { clienteAxios } from "../axios";
import { SessionContext } from "../sessionContext";
import { TEdicaoConteudo } from "../types/TConteudo";

export class AssitenteService {
    private contexto = useContext(SessionContext);

    gerarPerguntas = async (dados: TGeracaoPergunta): Promise<{ erro: string | null, perguntas: TEdicaoPergunta[] }> => {
        try {
            const resposta = await clienteAxios({
                method: 'post',
                url: '/assitente/gerar-perguntas',
                data: dados,
                headers: {
                    token: this.contexto.sessao.token,
                },
                validateStatus: (status: number) => [200, 400].includes(status),
            });

            if (resposta.status === 200) {
                return {
                    erro: null,
                    perguntas: resposta.data.perguntas,
                };
            } else {
                return {
                    erro: resposta.data.mensagem,
                    perguntas: []
                };
            }
        } catch (erro) {
            console.log('Erro ao gerar as perguntas', erro);
            return {
                erro: 'Erro ao gerar as perguntas via assitente',
                perguntas: []
            };
        }
    };

    gerarConteudo = async (assunto: string): Promise<{ erro: string | null, conteudo: TEdicaoConteudo}> => {
        try {
            const resposta = await clienteAxios({
                method: 'post',
                url: '/assitente/gerar-conteudo',
                data: {
                    assunto
                },
                headers: {
                    token: this.contexto.sessao.token,
                },
                validateStatus: (status: number) => [200, 400].includes(status),
            });

            if (resposta.status === 200) {
                return {
                    erro: null,
                    conteudo: resposta.data,
                };
            } else {
                return {
                    erro: resposta.data.mensagem,
                    conteudo: {} as TEdicaoConteudo
                };
            }
        } catch (erro) {
            console.log('Erro na geração do conteúdo via assitente', erro);
            return {
                erro: 'Erro na geração do conteúdo via assitente',
                conteudo: {} as TEdicaoConteudo
            };
        }
    }
};