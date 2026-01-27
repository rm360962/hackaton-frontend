import { conexaoApi } from "../axios";
import { TLoginUsuario } from "../types/TSession";

export class LoginService {

    logarUsuario = async (dados : TLoginUsuario) => {
        const { usuario, senha } = dados;
        const autenticacaoBase64 = btoa(`${usuario}:${senha}`);

        try {
            const resposta = await conexaoApi({
                method: 'get',
                url: '/users/login',
                headers: {
                    'Authorization': autenticacaoBase64,
                },
            });

            if(resposta.status === 200) {
                return {
                    erro: null,
                    tokenJwt: resposta.data?.token,
                    usuarioLogado: resposta.data?.usuario,
                };
            } else {
                return {
                    erro: resposta.data?.mensagem,
                    tokenJwt: null,
                    usuarioLogado: null
                };
            }
        } catch (erro) {
            console.log('Erro ao logar o usuário:', erro);
            return {
                erro: 'Erro ao logar o usuário',
                tokenJwt: null,
                usuarioLogado: null,
            };
        }
    };
}