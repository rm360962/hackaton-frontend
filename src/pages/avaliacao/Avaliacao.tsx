import { useNavigate } from "react-router-dom";
import { useState, Fragment, useEffect, useContext } from "react";
import { TAvaliacao, TBuscaAvaliacao } from "../../types/TAvaliacao";
import { converterEnumeradoSelectItem } from "../../util/funcoesGenericas";
import { TipoAvaliacao } from "../../enums/tipoAvaliacao.enum";
import { AvaliacaoService } from "../../service/avaliacao.service";
import { SessionContext } from "../../sessionContext";
import { TipoAlerta } from "../../types/TComponentProps";
import Button from "../../components/Button";
import ConfirmModal from "../../components/ConfirmModal";
import Header from "../../components/Header";
import SearchFilter from "../../components/SearchFilter";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { BsEye, BsPencilSquare, BsTrash3 } from "react-icons/bs";

const Avaliacao = () => {
    const filtrosBuscaAvaliacoesInicial = {
        id: '',
        nome: '',
        descricao: '',
        tipo: ''
    } as TBuscaAvaliacao;

    const [avaliacoes, setAvaliacoes] = useState([] as TAvaliacao[]);
    const [fitrosBusca, setFiltrosBusca] = useState(filtrosBuscaAvaliacoesInicial);
    const [remover, setRemover] = useState(false);
    const [idRemocao, setIdRemocao] = useState<number | null>(null);
    const [linhaExpandida, setLinhaExpandida] = useState<number | null>(null);
    const [tiposAvaliacao, setTiposAvaliacao] = useState(converterEnumeradoSelectItem(TipoAvaliacao))
    const avaliacaoService = new AvaliacaoService();
    const contexto = useContext(SessionContext);
    const navegador = useNavigate();

    useEffect(() => {
        pesquisar(fitrosBusca);
    }, []);

    const pesquisar = async (filtros?: TBuscaAvaliacao) => {
        const { erro, avaliacoes } = await avaliacaoService.buscarAvaliacoes(filtros ? filtros : fitrosBusca);

        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        setAvaliacoes(avaliacoes);

        if (avaliacoes.length === 0) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Info,
                mensagem: 'Não foi encontrado avaliações com os filtros informados',
            });
        }
    };

    const confirmarRemocao = (id: number) => {
        setIdRemocao(id);
        setRemover(true);
    };

    const visualizarAvaliacao = (id: number) => {
        navegador(`/avaliacoes/${id}/visualizar`);
    };

    const removerAvaliacao = async () => {
        if (!idRemocao) return;

        const avaliacaoRemovida = await avaliacaoService.removerAvaliacao(idRemocao);

        if (!avaliacaoRemovida) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: 'Erro ao remover a avaliação',
            });
            return;
        }

        await pesquisar(fitrosBusca);

        contexto.adcionarAlerta({
            tipo: TipoAlerta.Sucesso,
            mensagem: 'Avaliação removida com sucesso',
        });
    };

    const editarAvaliacao = (id: number) => {
        navegador(`/avaliacoes/editar/${id}`);
    };

    const expandirLinha = (id: number) => {
        if (linhaExpandida === id) {
            setLinhaExpandida(null);
        } else {
            setLinhaExpandida(id);
        }
    };

    const limparFiltros = () => {
        setFiltrosBusca(filtrosBuscaAvaliacoesInicial);
    };

    return (
        <>
            <Header />
            <div className="d-flex">
                <SearchFilter pesquisar={pesquisar} limpar={limparFiltros}>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Código</label>
                        <Input
                            titulo="Preencha com código da avaliação a ser buscada"
                            placeholder="Digite o código da avaliação"
                            tipo="number"
                            valor={fitrosBusca.id || ''}
                            obrigatorio={false}
                            onChange={(e: any) => { setFiltrosBusca({ ...fitrosBusca, id: e.target.value }) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Nome</label>
                        <Input
                            titulo="Preencha com o nome da avaliação"
                            placeholder="Digite o código da avaliação"
                            valor={fitrosBusca.nome || ''}
                            obrigatorio={false}
                            onChange={(e: any) => { setFiltrosBusca({ ...fitrosBusca, nome: e.target.value }) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Descrição</label>
                        <Input
                            titulo="Preencha com código do usuário ser buscado"
                            placeholder="Digite o código do usuário"
                            valor={fitrosBusca.descricao || ''}
                            obrigatorio={false}
                            onChange={(e: any) => { setFiltrosBusca({ ...fitrosBusca, descricao: e.target.value }) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Tipo</label>
                        <Select
                            valor={fitrosBusca.tipo || ''}
                            titulo="Selecione o tipo da avaliação"
                            mensagemPadrao="Selecione o tipo da avaliação"
                            itens={tiposAvaliacao}
                            onChange={(e: any) => { setFiltrosBusca({ ...fitrosBusca, tipo: e.target.value }); }} />
                    </div>
                </SearchFilter>
                <div className="container-fluid" style={{ paddingLeft: '0', height: '700px', overflowY: 'scroll' }}>
                    <div className='d-flex align-items-center justify-content-between mb-2'>
                        <p className="ps-4 h5 fw-semibold" style={{ letterSpacing: '1px', marginBottom: '0' }}>&#128195; Avaliações cadastradas</p>
                        <Button
                            tipo="button"
                            titulo="Clique para cadastrar uma nova avaliação"
                            class="primary"
                            onClick={() => { navegador(`/avaliacoes/editar/null`) }}
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
                                                        <div style={{ margin: 3 }}>
                                                            <button
                                                                className="btn btn-outline-secondary btn-sm"
                                                                title="Clique para editar a avaliação"
                                                                onClick={(e) => { editarAvaliacao(avaliacao.id) }}
                                                            >
                                                                <BsPencilSquare size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {avaliacao.ativo && (
                                                        <div style={{ margin: 3 }}>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                title="Clique para inativar a avaliação"
                                                                onClick={() => { confirmarRemocao(avaliacao.id) }}
                                                            >
                                                                <BsTrash3 size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {avaliacao.ativo && (
                                                        <div style={{ margin: 3 }}>
                                                            <button
                                                                className="btn btn-outline-info btn-sm"
                                                                title="Clique para pré-visualizar a avaliação"
                                                                onClick={() => { visualizarAvaliacao(avaliacao.id) }}
                                                            >
                                                                <BsEye size={18} />
                                                            </button>
                                                        </div>
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
                                                <td>{avaliacao.tipo.nome}</td>
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
                                                                    <th>Código</th>
                                                                    <th>Descrição</th>
                                                                    <th>Tipo</th>
                                                                    <th>Peso</th>
                                                                    <th>Opções</th>
                                                                    <th>Resposta Correta</th>
                                                                    <th>Ativo</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {avaliacao.perguntas && avaliacao.perguntas.length > 0 ? (
                                                                    avaliacao.perguntas.map((pergunta) => (
                                                                        <tr key={pergunta.id}>
                                                                            <td>{pergunta.id}</td>
                                                                            <td>{pergunta.descricao}</td>
                                                                            <td>{pergunta.tipo?.nome}</td>
                                                                            <td>{pergunta.valor}</td>
                                                                            <td>
                                                                                {pergunta.itens && pergunta.itens.length > 0
                                                                                    ? pergunta.itens.join(', ')
                                                                                    : '-'}
                                                                            </td>
                                                                            <td>{pergunta.itens ? pergunta.itens[pergunta.respostaCorreta] : null}</td>
                                                                            <td>{pergunta.ativo ? 'Sim' : 'Não'}</td>
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
                    titulo="Inativar avaliação"
                    pergunta="Confirma a inativação da avaliação"
                    acao={removerAvaliacao} />
            </div>
        </>
    )
};

export default Avaliacao;