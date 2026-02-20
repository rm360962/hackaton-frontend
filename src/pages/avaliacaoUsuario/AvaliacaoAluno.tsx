import { useContext, useEffect, useState } from "react";
import { TAvaliacaoAluno, TBuscaAvaliacaoAluno } from "../../types/TAvaliacaoUsuario";
import { AvaliacaoAlunoService } from "../../service/avaliacaoUsuario.service";
import { SessionContext } from "../../sessionContext";
import { useNavigate } from "react-router-dom";
import { TipoAlerta, TSelectItem } from "../../types/TComponentProps";
import { useSearchParams } from 'react-router-dom';
import ConfirmModal from "../../components/ConfirmModal";
import Header from "../../components/Header";
import SearchFilter from "../../components/SearchFilter";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { BsClipboardCheck, BsPencilSquare, BsTrash3 } from "react-icons/bs";
import { UsuarioService } from "../../service/usuario.service";
import { AvaliacaoService } from "../../service/avaliacao.service";
import { TUsuario } from "../../types/TUsuario";
import Select from "../../components/Select";
import { converterEnumeradoSelectItem } from "../../util/funcoesGenericas";
import { SituacaoAvaliacaoAluno } from "../../enums/situacaoAvaliacao.enum";
import CardAluno from "../home/CardAluno";

const AvaliacaoAluno = () => {

    const filtrosBuscaInicial = {
        id: '',
        usuarioId: '',
        avaliacaoId: '',
        situacaoId: ''
    } as TBuscaAvaliacaoAluno;

    const mensagemRemocaoPadrao = "Confirma a remoção da avaliação vínculada ao aluno?";
    const [avaliacoesAluno, setAvaliacoesAluno] = useState([] as TAvaliacaoAluno[]);
    const [filtrosBusca, setFiltrosBusca] = useState(filtrosBuscaInicial);
    const [removendo, setRemovendo] = useState(false);
    const [mensagemRemocao, setMensagemRemocao] = useState(mensagemRemocaoPadrao);
    const [idRemocao, setIdRemocao] = useState<number | null>(null);
    const [avaliacoes, setAvaliacoes] = useState([] as TSelectItem[]);
    const [alunos, setAlunos] = useState([] as TSelectItem[]);
    const [situacoes, setSituacoes] = useState(converterEnumeradoSelectItem(SituacaoAvaliacaoAluno));
    const [permissaoAdminstrativa, setPermissaoAdminstrativa] = useState(false);
    const avaliacaoAlunoService = new AvaliacaoAlunoService();
    const usuarioService = new UsuarioService();
    const avaliacaoService = new AvaliacaoService();
    const contexto = useContext(SessionContext);
    const navegador = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const categoria = contexto.sessao.usuarioLogado.categoria.nome;
        const permissao = categoria === 'Professor' || categoria === 'Administrador';
        setPermissaoAdminstrativa(permissao);
        
        buscarAlunos();
        buscarAvaliacoes();

        limparFiltros(permissao);
        
        const situacao = searchParams.get('situacao');

        let filtros = {
            ...filtrosBusca
        };

        if (situacao != null) {
            filtros.situacaoId = situacao;
        }

        pesquisar(filtros);
    }, []);

    const pesquisar = async (filtros?: TBuscaAvaliacaoAluno) => {
        const { erro, avaliacoesAluno } = await avaliacaoAlunoService.buscarAvaliacoesUsuario(filtros ? filtros : filtrosBusca);

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

    const buscarAlunos = async () => {
        const { erro, usuarios: alunos } = await usuarioService.buscarAlunos();

        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        const selectItemAlunos = alunos.map((aluno: TUsuario) => {
            return {
                label: aluno.nome,
                valor: aluno.id
            }
        })

        setAlunos(selectItemAlunos);
    };

    const buscarAvaliacoes = async () => {
        const { erro, avaliacoes } = await avaliacaoService.buscarAvaliacoes({
            ativo: true
        });

        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        const selectItemAvaliacao = avaliacoes.map((avaliacao) => {
            return {
                label: `${avaliacao.id} - ${avaliacao.nome}`,
                valor: avaliacao.id
            };
        });

        setAvaliacoes(selectItemAvaliacao);
    };


    const limparFiltros = (usuarioAdm: boolean | null) => {
        if(usuarioAdm) {
            setFiltrosBusca(filtrosBuscaInicial);
            return;
        }

        setFiltrosBusca({
            ...filtrosBusca,
            usuarioId: contexto.sessao.usuarioLogado.id.toString(),
        });
    };

    const editarAvaliacaoAluno = (id: number | null) => {
        navegador(`/avaliacoes/aluno/editar/${id}`);
    };

    const corrigirAvaliacaoAluno = (id: number) => {
        navegador(`/avaliacoes/aluno/${id}/responder`);
    };

    const confirmarRemocao = (id: number, situacaoId: number) => {
        setMensagemRemocao(mensagemRemocaoPadrao);

        if (situacaoId === 3) {
            setMensagemRemocao('O aluno já respondeu o questionario e a avaliação já foi finaliza, confirma a remoção?')
        }

        setRemovendo(true);
        setIdRemocao(id);
    };

    const removerAvaliacaoAluno = async () => {
        if (!idRemocao) return;

        const removerAvaliacaoAluno = await avaliacaoAlunoService.removerAvaliacaoAluno(idRemocao);

        contexto.adcionarAlerta({
            tipo: removerAvaliacaoAluno ? TipoAlerta.Sucesso : TipoAlerta.Erro,
            mensagem: removerAvaliacaoAluno ? 'Avaliação do aluno foi removida com sucesso' : 'Erro ao remover a avaliação do aluno',
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
                    {permissaoAdminstrativa && (
                        <div className='form-group mb-3'>
                            <label className='fw-semibold'>Aluno</label>
                            <Select
                                valor={filtrosBusca.usuarioId || ''}
                                titulo="Selecione o aluno"
                                mensagemPadrao="Selecione a avaliação"
                                itens={alunos}
                                onChange={(e: any) => { setFiltrosBusca({ ...filtrosBusca, usuarioId: e.target.value }); }}
                            />
                        </div>
                    )}
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Avaliação</label>
                        <Select
                            valor={filtrosBusca.avaliacaoId || ''}
                            titulo="Selecione a avaliação"
                            mensagemPadrao="Selecione a avaliação"
                            itens={avaliacoes}
                            onChange={(e: any) => { setFiltrosBusca({ ...filtrosBusca, avaliacaoId: e.target.value }); }}
                        />
                    </div>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Situação</label>
                        <Select
                            valor={filtrosBusca.situacaoId || ''}
                            titulo="Selecione a situação"
                            mensagemPadrao="Selecione a situação"
                            itens={situacoes}
                            onChange={(e: any) => { setFiltrosBusca({ ...filtrosBusca, situacaoId: e.target.value }); }}
                        />
                    </div>
                </SearchFilter>
                <div className="container-fluid" style={{ paddingLeft: '0', height: '700px', overflowY: 'scroll' }}>
                    {permissaoAdminstrativa ? (
                        <>
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
                                            <th>Ativo</th>
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
                                                            <div style={{ margin: 3 }}>
                                                                <button
                                                                    className="btn btn-outline-secondary btn-sm"
                                                                    title="Clique para editar a avaliação aluno"
                                                                    onClick={(e) => { editarAvaliacaoAluno(avaliacaoAluno.id) }}
                                                                >
                                                                    <BsPencilSquare size={18} />
                                                                </button>
                                                            </div>
                                                        )}
                                                        {avaliacaoAluno.ativo && (
                                                            <div style={{ margin: 3 }}>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    title="Clique para inativar o usuário"
                                                                    onClick={() => { confirmarRemocao(avaliacaoAluno.id, avaliacaoAluno.situacao.id) }}
                                                                >
                                                                    <BsTrash3 size={18} />
                                                                </button>
                                                            </div>
                                                        )}
                                                        {avaliacaoAluno.situacao.id === 2 && (
                                                            <div style={{ margin: 3 }}>
                                                                <button
                                                                    className="btn btn-outline-success btn-sm"
                                                                    title="Clique para corrigir a avaliação do aluno"
                                                                    onClick={() => { corrigirAvaliacaoAluno(avaliacaoAluno.id) }}
                                                                >
                                                                    <BsClipboardCheck size={18} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{avaliacaoAluno.id}</td>
                                                    <td>{avaliacaoAluno.usuario.id} - {avaliacaoAluno.usuario.nome}</td>
                                                    <td>{avaliacaoAluno.avaliacao.id} - {avaliacaoAluno.avaliacao.nome}</td>
                                                    <td>{avaliacaoAluno.dataLimite}</td>
                                                    <td>{avaliacaoAluno.dataExecucao}</td>
                                                    <td>{avaliacaoAluno.nota}</td>
                                                    <td>{avaliacaoAluno.situacao.nome}</td>
                                                    <td>{avaliacaoAluno.ativo}</td>
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
                        </>
                    ) : (
                        <>
                            <div className='d-flex align-items-center justify-content-between mb-2'>
                                <p className="ps-4 h5 fw-semibold" style={{ letterSpacing: '1px', marginBottom: '0' }}>&#128209; Avaliações encontradas</p>
                            </div>
                            <div className="row" style={{ padding: 10}}>
                                {avaliacoesAluno?.map((avaliacaoAluno) => {
                                    return (
                                        <CardAluno
                                            id={avaliacaoAluno.id}
                                            nome={avaliacaoAluno.avaliacao.nome}
                                            dataLimite={avaliacaoAluno.dataLimite}
                                            dataExecucao={avaliacaoAluno.dataExecucao}
                                            nota={avaliacaoAluno.nota}
                                            situacao={avaliacaoAluno.situacao.nome} />
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
                <ConfirmModal
                    titulo="Remover avaliação aluno"
                    pergunta={mensagemRemocao}
                    visivel={removendo}
                    setVisivel={setRemovendo}
                    acao={removerAvaliacaoAluno}
                />
            </div>
        </>
    )
};

export default AvaliacaoAluno;