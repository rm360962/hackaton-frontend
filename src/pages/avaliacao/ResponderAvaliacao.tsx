import Header from "../../components/Header";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";
import { TAvaliacao } from "../../types/TAvaliacao";
import { AvaliacaoService } from "../../service/avaliacao.service";
import { SessionContext } from "../../sessionContext";
import { TipoAlerta } from "../../types/TComponentProps";

const ResponderAvaliacao = () => {
    const [carregando, setCarregando] = useState(false);
    const [respostas, setRespostas] = useState<Record<number, any>>({});
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [mensagemFinalizacao, setMensagemFinalizacao] = useState('');
    const [avaliacao, setAvaliacao] = useState({} as TAvaliacao);
    const [avaliacaoUsuario, setAvaliacaoUsuario] = useState({});
    const { id, preVisualizar } = useParams();
    const mensagemFinalizacaoPadrao = 'Confirma a finalização da avaliação?';
    const avaliacaoService = new AvaliacaoService();
    const contexto = useContext(SessionContext);
    const navegador = useNavigate();

    useEffect(() => {
        console.log(id, preVisualizar);
        if (preVisualizar == null || preVisualizar === 'false') {
            return;
        }

        if (id) {
            buscarAvaliacao(+id);
        }
    }, []);

    const buscarAvaliacaoUsuario = async () => {

    };

    const buscarAvaliacao = async (id: number) => {
        const { erro, avaliacao } = await avaliacaoService.buscarAvaliacaoPorId(id);

        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        setAvaliacao(avaliacao);
    };

    const construirPerguntaPorIndice = (pergunta: any, indice: number) => {
        const perguntaIndice = `${++indice}. ${pergunta.descricao}`;
        return (
            <div>
                <hr />
                <p className="fw-semibold h6">{perguntaIndice}</p>
            </div>
        );
    };

    const construirOpcoes = (pergunta: any) => {
        if (pergunta.tipo.id === 1) {
            return (
                <TextArea
                    key={pergunta.id}
                    valor={respostas[pergunta.id] || ''}
                    onChange={(e: any) => { atualizarResposta(pergunta.id, e.target.value) }}
                    obrigatorio={false} />
            );
        }

        return pergunta.itens.map((opcao: string, id: number) => (
            <div key={`${pergunta.id}-${id}`} className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name={`pergunta-${pergunta.id}`}
                    checked={respostas[pergunta.id] === id}
                    onChange={() => atualizarResposta(pergunta.id, id)}
                />
                <label className="form-check-label">
                    {opcao}
                </label>
            </div>
        ));
    };

    const atualizarResposta = (perguntaId: number, valor: any) => {
        setRespostas(prev => ({
            ...prev,
            [perguntaId]: valor
        }));
    };

    const confirmaFinalizacaoAvaliacao = (event: any) => {
        event.preventDefault();

        setMensagemFinalizacao(mensagemFinalizacao);

        const quantidadePerguntas = avaliacao.perguntas.length;
        const quantidadeResposta = Object.keys(respostas).length;

        if (quantidadePerguntas > quantidadeResposta) {
            setMensagemFinalizacao('Ainda existem perguntas a serem respondidas, confirma a finalização da avaliação?');
        }

        setMostrarConfirmacao(true);
    };

    const finalizarAvaliacao = async () => {

    };

    return (
        <>
            <Header />
            <div className="conteiner-fluid" style={{ height: '700px', overflowY: 'scroll', paddingTop: 15 }}>
                <div className="d-flex align-itens-center justify-content-center">
                    <div className="bg-white p-3 rounded shadow-lg" style={{ width: '80%' }}>
                        <form noValidate onSubmit={confirmaFinalizacaoAvaliacao}>
                            <div className="fw-semibold h4" style={{ textAlign: 'center', letterSpacing: '0.5px', backgroundColor: 'white', borderRadius: 10 }}>
                                {avaliacao.nome}
                            </div>
                            <div>
                                {avaliacao?.perguntas?.map((pergunta, index) => {
                                    return (
                                        <Fragment key={pergunta.id}>
                                            {construirPerguntaPorIndice(pergunta, index)}
                                            <div style={{ padding: 10 }}>
                                                {construirOpcoes(pergunta)}
                                            </div>
                                        </Fragment>
                                    );
                                })}
                            </div>
                            <div className="d-flex f-column align-itens-center justify-content-center">
                                {(preVisualizar == null || preVisualizar === 'false') && (
                                    <Button
                                        tipo="submit"
                                        class="primary"
                                        carregando={carregando}
                                        style={{ marginRight: '10px' }}>
                                        Finalizar
                                    </Button>
                                )}
                                <Button
                                    tipo="button"
                                    class="secondary"
                                    desabilitado={carregando}
                                    onClick={() => { navegador('/avaliacoes') }}>
                                    Voltar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ConfirmModal
                titulo="Finalizar avaliação"
                pergunta={mensagemFinalizacao}
                visivel={mostrarConfirmacao}
                setVisivel={setMostrarConfirmacao}
                acao={finalizarAvaliacao}
            />
        </>
    );
};

export default ResponderAvaliacao;