import { useContext, useEffect, useState } from 'react';
import { FaGlasses, FaHourglassHalf, FaTrophy } from 'react-icons/fa';
import { AvaliacaoAlunoService } from '../../service/avaliacaoUsuario.service.ts';
import { SessionContext } from '../../sessionContext.ts';
import { TipoAlerta } from '../../types/TComponentProps.ts';
import Header from '../../components/Header.tsx';
import CardAluno from './CardAluno.tsx';
import Button from '../../components/Button.tsx';
import { useNavigate } from 'react-router-dom';

const HomeAluno = () => {
    const [pendentes, setPendentes] = useState([]);
    const [avaliadas, setAvaliadas] = useState([]);
    const [avaliacaoPendente, setAvaliacaoPendente] = useState([]);
    const avaliacaoAlunoService = new AvaliacaoAlunoService();
    const contexto = useContext(SessionContext);
    const navegador = useNavigate();

    useEffect(() => {
        buscarDadosPaginaInicial();
    }, []);

    const buscarDadosPaginaInicial = async () => {
        const { erro, avaliacoes } = await avaliacaoAlunoService.buscarResumoAvaliacoesAluno(contexto.sessao.usuarioLogado.id);

        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        setPendentes(avaliacoes.pendentes);
        setAvaliacaoPendente(avaliacoes.emAvaliacao);
        setAvaliadas(avaliacoes.avaliadas);
    };

    return (
        <>
            <div className="d-flex align-items-center justify-content-center">
                <div style={{ width: '80%', backgroundColor: 'white', padding: 15 }}>
                    <fieldset className="border p-2">
                        <legend className="float-none w-auto" style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '1px' }}>
                            Avaliações pendentes
                        </legend>
                        <div>
                            {pendentes && pendentes?.length === 0 && (
                                <div className="text-center py-1">
                                    <div className="mb-3 text-secondary" style={{ opacity: 0.5 }}>
                                        <FaTrophy size={70} />
                                    </div>

                                    <h4 className="fw-bold text-dark">Tudo limpo por aqui!</h4>
                                    <p className="text-muted">
                                        Você não tem nenhuma atividade pendente.
                                    </p>
                                </div>
                            )}
                            <div className="row">
                                {pendentes && pendentes?.length > 0 && (
                                    pendentes.map((pendente: any, index: number) => {
                                        return (
                                            <CardAluno
                                                key={index}
                                                id={pendente.id}
                                                nome={pendente.nome}
                                                dataLimite={pendente.dataLimite}
                                                dataExecucao={pendente.dataExecucao}
                                                situacao={pendente.situacao}
                                                nota={pendente.nota} />
                                        )
                                    })
                                )}
                            </div>
                            <div className="d-flex justify-content-end">
                                <Button
                                    tipo="button"
                                    titulo="Clique para ver todas as pendentes"
                                    onClick={() => { navegador(`/avaliacoes/aluno?situacaoId=0`) }}
                                    class='primary'>
                                    Ver todas
                                </Button>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="border p-2">
                        <legend className="float-none w-auto" style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '1px' }}>
                            Avaliadas
                        </legend>
                        <div>
                            {avaliadas && avaliadas?.length === 0 && (
                                <div className="text-center py-1">
                                    <div className="mb-3 text-secondary" style={{ opacity: 0.5 }}>
                                        <FaHourglassHalf size={70} />
                                    </div>

                                    <h4 className="fw-bold text-dark">Ainda sem notas por aqui</h4>
                                    <p className="text-muted">
                                        Assim que houver uma nota registrada ela aparecera aqui
                                    </p>
                                </div>
                            )}
                            <div className="row">
                                {avaliadas && avaliadas?.length > 0 && (
                                    avaliadas.map((avaliada: any, index: number) => {
                                        return (
                                            <CardAluno
                                                key={index}
                                                id={avaliada.id}
                                                nome={avaliada.nome}
                                                dataLimite={avaliada.dataLimite}
                                                dataExecucao={avaliada.dataExecucao}
                                                situacao={avaliada.situacao}
                                                nota={avaliada.nota} />
                                        )
                                    })
                                )}
                            </div>
                            <div className="d-flex justify-content-end">
                                <Button
                                    tipo="button"
                                    onClick={() => { navegador(`/avaliacoes/aluno?situacaoId=3`) }}
                                    titulo="Clique para ver todas as avaliadas"
                                    class='primary'>
                                    Ver todas
                                </Button>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="border p-2">
                        <legend className="float-none w-auto" style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '1px' }}>
                            Em correção
                        </legend>
                        <div>
                            {avaliacaoPendente && avaliacaoPendente?.length === 0 && (
                                <div className="text-center py-1">
                                    <div className="mb-3 text-secondary" style={{ opacity: 0.5 }}>
                                        <FaGlasses size={70} />
                                    </div>

                                    <h4 className="fw-bold text-dark">Nenhum correção por aqui</h4>
                                    <p className="text-muted">
                                        Quando houver correções a serem feitas aparecerão aqui
                                    </p>
                                </div>
                            )}
                            <div className="row">
                                {avaliacaoPendente && avaliacaoPendente?.length > 0 && (
                                    avaliacaoPendente.map((avaliacao: any, index: number) => {
                                        return (
                                            <CardAluno
                                                key={index}
                                                id={avaliacao.id}
                                                nome={avaliacao.nome}
                                                dataLimite={avaliacao.dataLimite}
                                                dataExecucao={avaliacao.dataExecucao}
                                                situacao={avaliacao.situacao}
                                                nota={avaliacao.nota} />
                                        )
                                    })
                                )}
                            </div>
                            <div className="d-flex justify-content-end">
                                <Button
                                    tipo="button"
                                    onClick={() => { navegador(`/avaliacoes/aluno?situacao=2`) }}
                                    titulo="Clique para ver todas as em avaliação"
                                    class='primary'>
                                    Ver todas
                                </Button>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </>
    )
};

export default HomeAluno;