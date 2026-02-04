import { useNavigate } from "react-router-dom";
import { useState, Fragment } from "react";
import Button from "../../components/Button";
import ConfirmModal from "../../components/ConfirmModal";
import Header from "../../components/Header";

const Avaliacao = () => {
    const [avaliacoes, setAvaliacoes] = useState([
        {
            id: 1,
            nome: 'Teste',
            descricao: 'Avaliação de teste',
            tipo: 'Atividade',
            ativo: true,
            perguntas: [
                {
                    id: 1,
                    descricao: 'Quem foi teste?',
                    peso: 100,
                    tipo: 'multipla escolha',
                    items: ['Teste1', 'Teste2', 'Teste3', 'Teste4'],
                    respostaCorreta: 2
                },
                {
                    id: 2,
                    descricao: 'Qual a nota?',
                    peso: 50,
                    tipo: 'descritiva',
                    items: [],
                    respostaCorreta: 0
                }
            ],
            dataInclusao: '01/01/2026',
            usuarioInclusao: 'Sistema',
            dataAlteracao: '01/01/2026',
            usuarioAlteracao: null
        }
    ]);

    const [remover, setRemover] = useState(false);
    const [idRemocao, setIdRemocao] = useState<number | null>(null);
    const [linhaExpandida, setLinhaExpandida] = useState<number | null>(null);

    const navigator = useNavigate();

    const confirmarRemocao = async (id: number) => {
        setIdRemocao(id);
        setRemover(true);
    };

    const removerAvaliacao = async () => {
        console.log('Removendo avaliacao');
    };

    const editarAvaliacao = async (id: number) => {

    };

    const expandirLinha = (id: number) => {
        if (linhaExpandida === id) {
            setLinhaExpandida(null);
        } else {
            setLinhaExpandida(id);
        }
    };

    return (
        <>
            <Header />
            <div className="d-flex">
                <div className="container-fluid" style={{ paddingLeft: '0', height: '700px', overflowY: 'scroll' }}>
                    <div className='d-flex align-items-center justify-content-between mb-2'>
                        <p className="ps-4 h5 fw-semibold" style={{ letterSpacing: '1px', marginBottom: '0' }}>&#128195; Avaliações cadastradas</p>
                        <Button
                            tipo="button"
                            titulo="Clique para cadastrar uma nova avaliação"
                            class="primary"
                            onClick={() => { navigator(`/avaliacoes/editar/null`) }}
                        >
                            Nova avaliação
                        </Button>
                    </div>
                    <div className="ps-4 table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Ações</th>
                                    <th>Perguntas</th>
                                    <th>Código</th>
                                    <th>Nome</th>
                                    <th>Descricao</th>
                                    <th>Tipo</th>
                                    <th>Data inclusão</th>
                                    <th>Usuario inclusão</th>
                                    <th>Data alteração</th>
                                    <th>Usuário alteração</th>
                                </tr>
                            </thead>
                            <tbody>
                                {avaliacoes.map((avaliacao) => {
                                    return (
                                        <Fragment key={avaliacao.id}>
                                            <tr>
                                                <td>
                                                    {avaliacao.ativo && (
                                                        <button
                                                            style={{ border: 'none', backgroundColor: 'white', fontSize: '19px', padding: '0' }}
                                                            title="Clique para editar a avaliação"
                                                            onClick={(e) => { editarAvaliacao(avaliacao.id) }}
                                                        >
                                                            &#128221;
                                                        </button>
                                                    )}
                                                    {avaliacao.ativo && (
                                                        <button
                                                            style={{ border: 'none', backgroundColor: 'white', fontSize: '19px', padding: '0' }}
                                                            title="Clique para inativar a avaliação"
                                                            onClick={() => { confirmarRemocao(avaliacao.id) }}
                                                        >
                                                            &#10060;
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className={`btn btn-sm ${linhaExpandida === avaliacao.id ? 'btn-secondary' : 'btn-info'}`}
                                                        onClick={() => expandirLinha(avaliacao.id)}
                                                    >
                                                        {linhaExpandida === avaliacao.id ? 'Ocultar' : 'Ver Perguntas'}
                                                    </button>
                                                </td>
                                                <td>{avaliacao.id}</td>
                                                <td>{avaliacao.nome}</td>
                                                <td>{avaliacao.descricao}</td>
                                                <td>{avaliacao.tipo}</td>
                                                <td>{avaliacao.dataInclusao}</td>
                                                <td>{avaliacao.usuarioInclusao}</td>
                                                <td>{avaliacao.dataAlteracao}</td>
                                                <td>{avaliacao.usuarioAlteracao}</td>
                                            </tr>
                                            {linhaExpandida === avaliacao.id && (
                                                <tr>
                                                    <td colSpan={10} className="bg-light p-4">
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <td>Ações</td>
                                                                    <th>Código</th>
                                                                    <th>Descrição</th>
                                                                    <th>Tipo</th>
                                                                    <th>Peso</th>
                                                                    <th>Opções</th>
                                                                    <th>Resposta Correta</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {avaliacao.perguntas && avaliacao.perguntas.length > 0 ? (
                                                                    avaliacao.perguntas.map((pergunta) => (
                                                                        <tr key={pergunta.id}>
                                                                            <td>
                                                                                <button
                                                                                    style={{ border: 'none', backgroundColor: 'white', fontSize: '19px', padding: '0' }}
                                                                                    title="Clique para inativar a avaliação"
                                                                                    onClick={() => { confirmarRemocao(avaliacao.id) }}
                                                                                >
                                                                                    &#10060;
                                                                                </button>
                                                                            </td>
                                                                            <td>{pergunta.id}</td>
                                                                            <td>{pergunta.descricao}</td>
                                                                            <td>{pergunta.tipo}</td>
                                                                            <td>{pergunta.peso}</td>
                                                                            <td>
                                                                                {pergunta.items && pergunta.items.length > 0
                                                                                    ? pergunta.items.join(', ')
                                                                                    : '-'}
                                                                            </td>
                                                                            <td>{pergunta.items ? pergunta.items[pergunta.respostaCorreta] : null}</td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan={5} className="text-center">Nenhuma pergunta cadastrada.</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <ConfirmModal
                    visivel={remover}
                    setVisivel={setRemover}
                    titulo="Inativar usuário"
                    pergunta="Confirma a inativação do usuário?"
                    acao={removerAvaliacao} />
            </div>
        </>
    )
};

export default Avaliacao;