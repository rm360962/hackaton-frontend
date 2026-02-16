import { useContext, useEffect, useState } from "react";
import { TAvaliacaoAluno, TBuscaAvaliacaoAluno } from "../../types/TAvaliacaoUsuario";
import { AvaliacaoAlunoService } from "../../service/avaliacaoUsuario.service";
import { SessionContext } from "../../sessionContext";
import { useNavigate } from "react-router-dom";
import { TipoAlerta } from "../../types/TComponentProps";
import ConfirmModal from "../../components/ConfirmModal";
import Header from "../../components/Header";
import SearchFilter from "../../components/SearchFilter";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";

const AvaliacaoAluno = () => {
    const filtrosBuscaInicial = {
        id: '',
        usuarioId: '',
        avaliacaoId: '',
        situacao: ''
    } as TBuscaAvaliacaoAluno;

    const [avaliacoesAluno, setAvaliacoesAluno] = useState([] as TAvaliacaoAluno[]);
    const [filtrosBusca, setFiltrosBusca] = useState(filtrosBuscaInicial);
    const [gravando, setGravando] = useState(false);
    const [removendo, setRemovendo] = useState(false);
    const [idRemocao, setIdRemocao] = useState<number | null>(null);
    const avaliacaoAlunoService = new AvaliacaoAlunoService();
    const contexto = useContext(SessionContext);
    const navegador = useNavigate();

    useEffect(() => {
        pesquisar();
    }, []);

    const pesquisar = async () => {
        const { erro, avaliacoesAluno } = await avaliacaoAlunoService.buscarAvaliacoesUsuario(filtrosBusca);
        console.log(avaliacoesAluno);
        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });

            return;
        }

        if (avaliacoesAluno.length === 0) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Info,
                mensagem: 'Não foi encontrado avaliações usuário com os filtros informados',
            });
        }

        setAvaliacoesAluno(avaliacoesAluno);
    };

    const limparFiltros = () => {
        setFiltrosBusca(filtrosBuscaInicial);
    };

    const editarAvaliacaoAluno = (id: number | null) => {
        navegador(`/avaliacoes/aluno/editar/${id}`);
    };

    const confirmarRemocao = (id: number) => {
        setRemovendo(true);
        setIdRemocao(id);
    };

    const removerAvaliacaoAluno = async () => {
        if (!idRemocao) return;

        const removerAvaliacaoAluno = await avaliacaoAlunoService.removerAvaliacaoAluno(idRemocao);

        contexto.adcionarAlerta({
            tipo: removerAvaliacaoAluno ? TipoAlerta.Sucesso : TipoAlerta.Erro,
            mensagem: removerAvaliacaoAluno ? 'Conteúdo removido com sucesso' : 'Erro ao remover o conteúdo',
        });

        if (removerAvaliacaoAluno) {
            await pesquisar();
        }
    };

    return (
        <>
            <Header />
            <div id="pesquisa" className='d-flex'>
                <SearchFilter pesquisar={pesquisar} limpar={limparFiltros}>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Código</label>
                        <Input
                            titulo="Preencha com código do conteúdo a ser buscado"
                            placeholder="Código do conteúdo"
                            tipo="number"
                            valor={filtrosBusca.id}
                            obrigatorio={false}
                            onChange={(e: any) => { setFiltrosBusca({ ...filtrosBusca, id: e.target.value }); }} />
                    </div>

                </SearchFilter>
                <div className="container-fluid" style={{ paddingLeft: '0', height: '700px', overflowY: 'scroll' }}>
                    <div className='d-flex align-items-center justify-content-between mb-2'>
                        <p className="ps-4 h5 fw-semibold" style={{ letterSpacing: '1px', marginBottom: '0' }}>&#128209; Avaliacões aluno cadastradas</p>
                        <Button
                            tipo="button"
                            titulo="Clique para cadastrar um novo usuário no sistema"
                            class="primary"
                            onClick={() => editarAvaliacaoAluno(null)}
                        >
                            Nova avaliação aluno
                        </Button>
                    </div>
                    <div className="ps-4 table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Ações</th>
                                    <th>Código</th>
                                    <th>Usuário</th>
                                    <th>Avaliação</th>
                                    <th>Data limite</th>
                                    <th>Data execução</th>
                                    <th>Nota</th>
                                    <th>Situação</th>
                                    <th>Data inclusão</th>
                                    <th>Usuário inclusão</th>
                                    <th>Data alteração</th>
                                    <th>Usuario alteração</th>
                                </tr>
                            </thead>
                            <tbody>
                                {avaliacoesAluno?.map((avaliacaoAluno) => {
                                    return (
                                        <tr key={avaliacaoAluno.id}>
                                            <td>
                                                {avaliacaoAluno.ativo && (
                                                    <button
                                                        style={{ border: 'none', backgroundColor: 'white', fontSize: '19px', padding: '0' }}
                                                        title="Clique para editar a avaliação aluno"
                                                        onClick={(e) => { editarAvaliacaoAluno(avaliacaoAluno.id) }}
                                                    >
                                                        &#128221;
                                                    </button>
                                                )}
                                                {true && (
                                                    <button
                                                        style={{ border: 'none', backgroundColor: 'white', fontSize: '19px', padding: '0' }}
                                                        title="Clique para inativar o usuário"
                                                        onClick={() => { confirmarRemocao(avaliacaoAluno.id) }}
                                                    >
                                                        &#10060;
                                                    </button>
                                                )}
                                            </td>
                                            <td>{avaliacaoAluno.id}</td>
                                            <td>{avaliacaoAluno.usuario.id} - {avaliacaoAluno.usuario.nome}</td>
                                            <td>{avaliacaoAluno.avaliacao.id} - {avaliacaoAluno.avaliacao.nome}</td>
                                            <td>{avaliacaoAluno.dataLimite}</td>
                                            <td>{avaliacaoAluno.dataExecucao}</td>
                                            <td>{avaliacaoAluno.nota}</td>
                                            <td>{avaliacaoAluno.situacao.nome}</td>
                                            <td>{avaliacaoAluno.dataInclusao}</td>
                                            <td>{avaliacaoAluno.usuarioInclusao}</td>
                                            <td>{avaliacaoAluno.dataAlteracao}</td>
                                            <td>{avaliacaoAluno.usuarioAlteracao}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <ConfirmModal
                    titulo="Remover avaliação aluno"
                    pergunta="Confirma a remoção da avaliação vínculada ao aluno?"
                    visivel={removendo}
                    setVisivel={setRemovendo}
                    acao={removerAvaliacaoAluno}
                />
            </div>
        </>
    )
};

export default AvaliacaoAluno;