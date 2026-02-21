import Header from "../../components/Header";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import ConfirmModal from "../../components/ConfirmModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";
import { TAvaliacao } from "../../types/TAvaliacao";
import { AvaliacaoService } from "../../service/avaliacao.service";
import { SessionContext } from "../../sessionContext";
import { TipoAlerta } from "../../types/TComponentProps";
import { TAvaliacaoAluno, TRespostaPergunta } from "../../types/TAvaliacaoUsuario";
import { AvaliacaoAlunoService } from "../../service/avaliacaoUsuario.service";

const ResponderAvaliacao = () => {
    const [acao, setAcao] = useState('responder');
    const [carregando, setCarregando] = useState(false);
    const [respostas, setRespostas] = useState<Record<number, any>>({});
    const [correcoes, setCorrecoes] = useState<Record<number, boolean>>({});
    const [quantidadeCorrecao, setQuantidadeCorrecao] = useState(0);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [mensagemFinalizacao, setMensagemFinalizacao] = useState('');
    const [avaliacao, setAvaliacao] = useState({} as TAvaliacao);
    const [avaliacaoAluno, setAvaliacaoAluno] = useState({} as TAvaliacaoAluno);
    const { id } = useParams();
    const mensagemFinalizacaoPadrao = 'Confirma a finalização da avaliação?';
    const avaliacaoService = new AvaliacaoService();
    const avaliacaoAlunoService = new AvaliacaoAlunoService();
    const contexto = useContext(SessionContext);
    const navegador = useNavigate();
    const local = useLocation();

    useEffect(() => {
        const caminho = local.pathname.split('/');
        const acao = caminho.pop();

        if (!id || !acao) return;
        console.log(acao);

        setAcao(acao);

        if (acao === 'responder' || acao === 'corrigir') {
            buscarDados(+id, acao);
            return;
        }

        buscarAvaliacao(+id);
    }, []);

    const buscarDados = async (id: number, acao: string) => {
        const { erro, avaliacaoAluno } = await avaliacaoAlunoService.buscarAvaliacaoAlunoPorId(id);

        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        if(acao === 'responder' && avaliacaoAluno.situacao.id !== 1) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: 'A avaliação já foi respondida',
            });

            navegador('/avaliacoes/aluno');
        }

        await buscarAvaliacao(avaliacaoAluno.avaliacao.id);

        if(acao ==='corrigir') preecherRespostas(avaliacaoAluno.respostas);

        setAvaliacaoAluno(avaliacaoAluno);
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

        const quantidadeDescritiva = avaliacao.perguntas.filter(pergunta => pergunta.tipo.id === 1);

        setQuantidadeCorrecao(quantidadeDescritiva.length);
        setAvaliacao(avaliacao);
    };

    const preecherRespostas = (respostasAluno: TRespostaPergunta[] | null) => {
        if (!respostasAluno || respostasAluno.length === 0) return;

        const respostas: Record<number, any> = {};
        respostasAluno.forEach((resposta) => {
            respostas[resposta.perguntaId] = resposta.valor;
        })
        setRespostas(respostas);
    };

    const construirPerguntaPorIndice = (pergunta: any, indice: number) => {
        const perguntaIndice = `${++indice}. ${pergunta.descricao}`;
        return (
            <div>
                <hr />
                <div className="d-flex justify-content-between">
                    <div>
                        <p className="fw-semibold h6">{perguntaIndice}</p>
                    </div>
                    {(acao === 'corrigir' && pergunta.tipo.id === 1) && (
                        <div className="d-flex">
                            <div style={{ paddingRight: 10}}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={`resposta-${pergunta.id}`}
                                    checked={correcoes[pergunta.id] === true}
                                    onChange={() => atualizarCorrecoes(pergunta.id, true)}
                                />
                                <label className="form-check-label h6" style={{ fontWeight: 'bold', padding: 5}}>
                                    Certo
                                </label>
                            </div>
                            <div>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={`resposta-${pergunta.id}`}
                                    checked={correcoes[pergunta.id] === false}
                                    onChange={() => atualizarCorrecoes(pergunta.id, false)}
                                    disabled={acao === 'corrigir'}
                                />
                                <label className="form-check-label h6" style={{ fontWeight: 'bold', padding: 5}}>
                                    Errado
                                </label>
                            </div>
                        </div>

                    )}
                </div>
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

    const atualizarCorrecoes = (perguntaId: number, valor: any) => {
        setCorrecoes(prev => ({
            ...prev,
            [perguntaId]: valor
        }));
    };

    const confirmaFinalizacaoAvaliacao = (event: any) => {
        event.preventDefault();

        if (acao === 'responder') {
            setMensagemFinalizacao(mensagemFinalizacaoPadrao);

            const quantidadePerguntas = avaliacao.perguntas.length;
            const quantidadeResposta = Object.keys(respostas).length;

            if (quantidadePerguntas > quantidadeResposta) {
                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: 'Você deve responder todas as perguntas para finalizar a avaliação'
                });
                return;
            }
        } else {
            setMensagemFinalizacao('A avaliação do aluno será finalizada, confirma os dados de correção?');

            const quantidadeCorrigida = Object.keys(correcoes).length;

            if (quantidadeCorrecao > quantidadeCorrigida) {
                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: 'Ainda faltam perguntas a serem corrigidas',
                });

                return;
            }
        }

        setMostrarConfirmacao(true);
    };

    const finalizarAvaliacao = async () => {
        setCarregando(true);

        try {
            const respostasPergunta = Object.entries(respostas).map(([chave, valor]) => {
                const objeto = {
                    perguntaId: +chave,
                    valor
                } as TRespostaPergunta

                const correta = correcoes[+chave];

                if (correta != null) {
                    objeto.correta = correta
                }

                return objeto;
            });

            const requisicao = {
                id: avaliacaoAluno.id,
                avaliacaoId: avaliacaoAluno.avaliacao.id,
                respostas: respostasPergunta
            };

            const respostaEnviada = await avaliacaoAlunoService.enviarRespostas(requisicao);

            if (!respostaEnviada) {
                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: 'Erro ao enviar as respostas, contate o professor responsável'
                });
                return;
            }

            navegador('/avaliacoes/aluno');
        } finally {
            setCarregando(false);
        }
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
                                {(acao === 'responder' || acao === 'corrigir') && (
                                    <Button
                                        tipo="submit"
                                        class="primary"
                                        carregando={carregando}
                                        style={{ marginRight: '10px' }}>
                                        {acao === 'responder' ? 'Finalizar' : 'Finalizar correção'}
                                    </Button>
                                )}
                                <Button
                                    tipo="button"
                                    class="secondary"
                                    desabilitado={carregando}
                                    onClick={() => { 
                                        if(acao !== 'responder') { 
                                            navegador('/avaliacoes'); 
                                        } else {
                                            navegador('/avaliacoes/aluno'); 
                                        }}}>
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