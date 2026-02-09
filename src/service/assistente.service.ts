import { TEdicaoPergunta, TGeracaoPergunta } from "../types/TAvaliacao";
import { useContext } from "react";
import { conexaoApi } from "../axios";
import { SessionContext } from "../sessionContext";

export class AssitenteService {
    private contexto = useContext(SessionContext);

    gerarPerguntas = async (dados: TGeracaoPergunta): Promise<{ erro: string | null, perguntas: TEdicaoPergunta[] }> => {
        try {
            const resposta = await conexaoApi({
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
};