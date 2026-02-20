import { useContext, useEffect, useState } from "react";
import { TBuscaUsuario, TUsuario } from "../../types/TUsuario";
import { UsuarioService } from "../../service/usuario.service";
import { SessionContext } from "../../sessionContext";
import { TipoAlerta, TSelectItem } from "../../types/TComponentProps";
import { useNavigate } from "react-router-dom";
import { TCategoriaUsuario } from "../../types/TSession";
import Header from "../../components/Header";
import Input from "../../components/Input";
import SearchFilter from "../../components/SearchFilter";
import Button from "../../components/Button";
import Select from "../../components/Select";
import ConfirmModal from "../../components/ConfirmModal";
import { BsPencilSquare, BsTrash3 } from "react-icons/bs";

const Usuario = () => {
    const usuarioBuscaInicial: TBuscaUsuario = {
        id: '',
        nome: '',
        email: '',
        login: '',
        categoriaId: '',
        ativo: '',
    };

    const [buscaUsuario, setBuscaUsuario] = useState(usuarioBuscaInicial);
    const [usuarios, setUsuarios] = useState([] as TUsuario[]);
    const [categorias, setCategorias] = useState([] as TSelectItem[]);
    const [idUsuarioRemocao, setIdUsuarioRemocao] = useState<number | null>(null);
    const [remover, setRemover] = useState(false);

    const usuarioService = new UsuarioService();
    const context = useContext(SessionContext);
    const nagivator = useNavigate();
    const SimNao: TSelectItem[] = [{
        label: 'Sim',
        valor: true
    }, {
        label: 'Não',
        valor: false
    }];

    useEffect(() => {
        buscarCategoriasUsuario();
        pesquisar();
    }, [])

    const pesquisar = async () => {
        const { erro, usuarios: resultadoBusca } =
            await usuarioService.buscarUsuarios(context.sessao.token, buscaUsuario);

        if (erro) {
            context.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        if (resultadoBusca.length === 0) {
            console.log('NADA ENCONTRADO NA PESQUISA', buscaUsuario)
            context.adcionarAlerta({
                tipo: TipoAlerta.Info,
                mensagem: 'Nenhum usuário encontrado para os filtros informados',
            });
        }

        setUsuarios(resultadoBusca);
    };

    const buscarCategoriasUsuario = async () => {
        const { erro, categorias: categoriasEncontradas } = await usuarioService.buscarCategoriasUsuario();

        if (erro) {
            context.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro,
            });
            return;
        }

        const categoriasSelectItem: TSelectItem[] = [];
        categoriasEncontradas.map((categoria: TCategoriaUsuario) => {
            categoriasSelectItem.push({
                label: categoria.nome,
                valor: categoria.id
            });
        });

        setCategorias(categoriasSelectItem);
    };

    const limparFiltros = () => {
        setBuscaUsuario(usuarioBuscaInicial);
    };

    const editarUsuario = (id: number) => {
        nagivator(`/usuarios/editar/${id}`);
    };

    const confirmarRemocao = (id: number) => {
        setIdUsuarioRemocao(id);
        setRemover(true);
    };

    const removerUsuario = async () => {
        if (idUsuarioRemocao == null) return;

        const usuarioRemovido = await usuarioService.removerUsuario(idUsuarioRemocao);

        if (!usuarioRemovido) {
            context.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: 'Erro ao inativar o usuário'
            });
            return;
        }

        context.adcionarAlerta({
            tipo: TipoAlerta.Sucesso,
            mensagem: 'Usuário removido com sucesso',
        });

        await pesquisar();
    };

    return (
        <>
            <Header />
            <div className="d-flex">
                <SearchFilter pesquisar={pesquisar} limpar={limparFiltros}>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Código</label>
                        <Input
                            titulo="Preencha com código do usuário ser buscado"
                            placeholder="Digite o código do usuário"
                            tipo="number"
                            valor={buscaUsuario.id}
                            obrigatorio={false}
                            onChange={(e: any) => { setBuscaUsuario({ ...buscaUsuario, id: e.target.value }) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Nome</label>
                        <Input
                            titulo="Preencha com o nome do usuário"
                            placeholder="Digite o nome"
                            valor={buscaUsuario.nome}
                            obrigatorio={false}
                            onChange={(e: any) => { setBuscaUsuario({ ...buscaUsuario, nome: e.target.value }) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Login</label>
                        <Input
                            titulo="Preencha com o login do usuário ser buscado"
                            placeholder="Digite o login"
                            valor={buscaUsuario.login}
                            obrigatorio={false}
                            onChange={(e: any) => { setBuscaUsuario({ ...buscaUsuario, login: e.target.value }) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>E-mail</label>
                        <Input
                            titulo="Preencha com e-mail do usuário a ser buscado"
                            placeholder="Digite o e-mail"
                            valor={buscaUsuario.email}
                            obrigatorio={false}
                            onChange={(e: any) => { setBuscaUsuario({ ...buscaUsuario, email: e.target.value }) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Categoria</label>
                        <Select
                            valor={buscaUsuario.categoriaId}
                            titulo="Selecione a categoria a ser buscada"
                            mensagemPadrao="Selecione a categoria"
                            itens={categorias}
                            onChange={(e: any) => { setBuscaUsuario({ ...buscaUsuario, categoriaId: e.target.value }) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <label className='fw-semibold'>Ativo</label>
                        <Select
                            valor={buscaUsuario.ativo || ''}
                            titulo="Selecione se usuário a ser buscado está ativo ou não"
                            mensagemPadrao="Selecione o ativo"
                            itens={SimNao}
                            onChange={(e: any) => { setBuscaUsuario({ ...buscaUsuario, ativo: e.target.value }) }} />
                    </div>
                </SearchFilter>
                <div className="container-fluid" style={{ paddingLeft: '0', height: '700px', overflowY: 'scroll' }}>
                    <div className='d-flex align-items-center justify-content-between mb-2'>
                        <p className="ps-4 h5 fw-semibold" style={{ letterSpacing: '1px', marginBottom: '0' }}>&#129489; Usuários cadastrados</p>
                        <Button
                            tipo="button"
                            titulo="Clique para cadastrar um novo usuário no sistema"
                            class="primary"
                            onClick={() => { nagivator(`/usuarios/editar/null`) }}
                        >
                            Novo usuário
                        </Button>
                    </div>
                    <div className="ps-4 table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Ações</th>
                                    <th>Código</th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Login</th>
                                    <th>Ativo</th>
                                    <th>Categoria</th>
                                    <th>Data inclusão</th>
                                    <th>Usuario inclusão</th>
                                    <th>Data alteração</th>
                                    <th>Usuário alteração</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario: TUsuario) => {
                                    return (
                                        <tr key={usuario.id}>
                                            <td>
                                                {usuario.ativo && (
                                                    <div style={{ margin: 3 }}>
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm"
                                                            title="Clique para editar o usuário"
                                                            onClick={(e) => { editarUsuario(usuario.id) }}
                                                        >
                                                            <BsPencilSquare size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                                {usuario.ativo && (
                                                    <div style={{ margin: 3 }}>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            title="Clique para inativar o usuário"
                                                            onClick={() => { confirmarRemocao(usuario.id) }}
                                                        >
                                                            <BsTrash3 size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td>{usuario.id}</td>
                                            <td>{usuario.nome}</td>
                                            <td>{usuario.email}</td>
                                            <td>{usuario.login}</td>
                                            <td>{usuario.ativo ? 'Sim' : 'Não'}</td>
                                            <td>{usuario.categoria.nome}</td>
                                            <td>{usuario.dataInclusao}</td>
                                            <td>{usuario.usuarioInclusao}</td>
                                            <td>{usuario.dataAlteracao}</td>
                                            <td>{usuario.usuarioAlteracao}</td>
                                        </tr>
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
                    acao={removerUsuario} />
            </div>
        </>
    );
};

export default Usuario;
