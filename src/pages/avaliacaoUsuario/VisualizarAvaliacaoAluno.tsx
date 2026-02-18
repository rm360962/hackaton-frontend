import { useContext, useEffect, useState } from "react";
import { TAvaliacaoAluno, TEdicaoAvaliacaoAluno } from "../../types/TAvaliacaoUsuario";
import { TConteudo } from "../../types/TConteudo";
import { useNavigate, useParams } from "react-router-dom";
import { AvaliacaoAlunoService } from "../../service/avaliacaoUsuario.service";
import { SessionContext } from "../../sessionContext";
import { ConteudoService } from "../../service/conteudo.service";
import { TipoAlerta } from "../../types/TComponentProps";
import Header from "../../components/Header";
import CardConteudo from "../conteudo/CardConteudo";
import Button from "../../components/Button";
import ConfirmModal from "../../components/ConfirmModal";

const VisualizarAvaliacaoAluno = () => {
    const [avaliacaoAluno, setAvaliacaoUsuario] = useState({} as TAvaliacaoAluno);
    const [conteudos, setConteudos] = useState([] as TConteudo[]);
    const [iniciar, setIniciar] = useState(false);
    const { id } = useParams();
    const navegador = useNavigate();
    const contexto = useContext(SessionContext);
    const avaliacaoAlunoService = new AvaliacaoAlunoService();
    const conteudoService = new ConteudoService();
    const situacaoCor = ['bg-warning', 'bg-primary', 'bg-info', 'bg-success', 'bg-danger', 'bg-dark', 'bg-warning'];

    useEffect(() => {
        buscarDados();
    }, []);

    const buscarDados = async () => {
        if (!id || id === 'null') return;

        const { erro, avaliacaoAluno } = await avaliacaoAlunoService.buscarAvaliacaoAlunoPorId(+id);

        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        const { erro: erroBuscaConteudo, conteudos } = await conteudoService.buscarConteudos({
            ids: avaliacaoAluno.conteudosId,
        });

        if (erroBuscaConteudo) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erroBuscaConteudo
            });
            return;
        }

        setAvaliacaoUsuario(avaliacaoAluno);
        setConteudos(conteudos);
    };

    const iniciarAvaliacao = async () => {
        const erros = await avaliacaoAlunoService.editarAvaliacaoAluno({
            id: '1',
            situacaoId: '1'
        } as TEdicaoAvaliacaoAluno);

        if (erros) {
            for (const erro of erros) {
                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: erro.mensagem
                });
            }
            return;
        }

        navegador(`/avaliacoes/responder/${avaliacaoAluno.id}/false`);
    };

    return (
        <>
            <Header />
            <div className="container-fluid" style={{ paddingLeft: '0', height: '700px', overflowY: 'scroll' }}>
                <div className="d-flex align-items-center justify-content-center">
                    <div style={{ width: '80%', borderRadius: 10, backgroundColor: 'white', padding: 15, minHeight: '600px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                        <fieldset className="border p-2">
                            <legend className="float-none w-auto" style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '1px' }}>Conteúdos</legend>
                            {conteudos.map(conteudo => (
                                <div key={conteudo.id} className="col-12 col-md-3 col-lg-4 p-2 d-flex align-items-center justify-content-center ">
                                    <CardConteudo
                                        conteudo={conteudo}
                                    />
                                </div>
                            ))}
                        </fieldset>
                        <div>
                            <fieldset className="border p-2">
                                <legend className="float-none w-auto" style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '1px' }}>Avaliação</legend>
                                <div className="d-flex align-items-center justify-content-center">
                                    <div className="row" style={{ width: '100%' }}>
                                        <div className="col-12 col-md-3 mb-2 mb-md-0">
                                            <strong>Nome:</strong> <span className="d-block d-md-inline">{avaliacaoAluno?.avaliacao?.nome}</span>
                                        </div>

                                        <div className="col-12 col-md-2 mb-2 mb-md-0">
                                            <strong>Tipo:</strong> <span className="d-block d-md-inline">{avaliacaoAluno?.avaliacao?.tipo}</span>
                                        </div>

                                        <div className="col-12 col-md-3 mb-2 mb-md-0">
                                            <strong>Situação:</strong> <span className={`badge ms-1 ${situacaoCor[avaliacaoAluno?.situacao?.id] || 'bg-sucess'}`}>{avaliacaoAluno?.situacao?.nome}</span>
                                        </div>


                                        {avaliacaoAluno.nota && (
                                            <div className="col-12 col-md-2 mb-2 mb-md-0">
                                                <strong>Nota:</strong> <span className="d-block d-md-inline">{avaliacaoAluno?.nota}</span>
                                            </div>
                                        )}

                                        {[0, 1].includes(avaliacaoAluno?.situacao?.id) && (
                                            <>
                                                <div className="col-12 col-md-2 mb-2 mb-md-0">
                                                    <strong>Data limite:</strong> <span className="d-block d-md-inline">{avaliacaoAluno?.dataLimite}</span>
                                                </div>
                                                <div className="col-12 col-md-2 text-md-end">
                                                    <Button tipo="button" class="primary" onClick={() => { setIniciar(true); }}>
                                                        Responder
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal titulo="Iniciar avaliação"
                pergunta="Você terá 1 hora para poder respoder a avaliação, deseja mesmo iniciar?"
                visivel={iniciar}
                setVisivel={setIniciar}
                acao={iniciarAvaliacao} />
        </>
    )
};

export default VisualizarAvaliacaoAluno;