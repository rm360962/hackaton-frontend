import { useContext, useEffect, useState } from "react";
import { TEdicaoUsuario } from "../../types/TUsuario";
import { useNavigate, useParams } from "react-router-dom";
import { UsuarioService } from "../../service/usuario.service";
import { SessionContext } from "../../sessionContext";
import { TipoAlerta, TSelectItem } from "../../types/TComponentProps";
import { TCategoriaUsuario } from "../../types/TSession";
import Button from "../../components/Button";
import Header from "../../components/Header"
import Input from "../../components/Input";
import Select from "../../components/Select";

const EditarUsuario = () => {
    const [usuario, setUsuario] = useState({} as TEdicaoUsuario);
    const [categorias, setCategorias] = useState([] as TSelectItem[]);
    const [alterarSenha, setAlterarSenha] = useState(false);
    const context = useContext(SessionContext);
    const usuarioService = new UsuarioService();
    const navigator = useNavigate();
    const { id: idUsuario } = useParams();

    const buscarUsuario = async () => {
        if (idUsuario && idUsuario !== 'null') {
            const { erro, usuario: usuarioEncontrado } = await usuarioService
                .buscarUsuarioPorId(context.sessao.token, +idUsuario);

            if (erro) {
                context.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: erro,
                });
                return;
            }

            setUsuario({
                id: usuarioEncontrado.id,
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                login: usuarioEncontrado.login,
                categoriaId: usuarioEncontrado.categoria.id
            });
        }
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

    useEffect(() => {
        buscarUsuario();
        buscarCategoriasUsuario();
    }, []);

    const gravar = async (event: any) => {
        event.preventDefault();

        const form = document.getElementById('formEdicao') as HTMLFormElement;

        if (!form.checkValidity()) {
            form.classList.add('was-validated')
            return;
        }

        if (usuario.id) {
            const erros = await usuarioService.editarUsuario(usuario);

            if (erros) {
                for (const erro of erros) {
                    context.adcionarAlerta({
                        tipo: TipoAlerta.Erro,
                        mensagem: erro.mensagem
                    });
                }
                return;
            }

            context.adcionarAlerta({
                tipo: TipoAlerta.Sucesso,
                mensagem: 'Usuário editado com sucesso',
            });
        } else {
            const { usuario: usuarioCadastrado, erros } =
                await usuarioService.cadastrarUsuario(usuario);

            if (erros) {
                for (const erro of erros) {
                    context.adcionarAlerta({
                        tipo: TipoAlerta.Erro,
                        mensagem: erro.mensagem
                    });
                }
                return;
            }

            setUsuario(usuarioCadastrado);

            context.adcionarAlerta({
                tipo: TipoAlerta.Sucesso,
                mensagem: 'Usuário cadastrado com sucesso',
            });
        }
    };

    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="d-flex align-items-center justify-content-center">
                    <div>
                        <p className="fw-semibold h5 mb-4">{usuario.id ? 'Edição de usuário' : 'Cadastro de usuário'}</p>
                        <form id="formEdicao" noValidate onSubmit={(e) => { gravar(e); }}>
                            <div>
                                {usuario.id && (
                                    <div className='form-group'>
                                        <label className="fw-semibold">Código </label>
                                        <Input
                                            placeholder=""
                                            titulo="Código vínculado ao usuário"
                                            valor={usuario.id ? usuario.id.toString() : ''}
                                            onChange={(e: any) => { }}
                                            obrigatorio={true}
                                            desabilitado={true}
                                        />
                                        <div className="invalid-feedback">
                                            O usuário é obrigatório.
                                        </div>
                                    </div>
                                )}
                                <div className='form-group'>
                                    <label className="fw-semibold">Nome </label>
                                    <Input
                                        placeholder="Informe o nome"
                                        titulo="Preencha com nome do usuário"
                                        valor={usuario.nome}
                                        onChange={(e: any) => { setUsuario({ ...usuario, nome: e.target.value }); }}
                                        obrigatorio={true}
                                    />
                                    <div className="invalid-feedback">
                                        O nome é obrigatório.
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label className="fw-semibold">E-mail </label>
                                    <Input
                                        placeholder="Informe o e-mail"
                                        titulo="Preencha com o e-mail do usuário"
                                        valor={usuario.email}
                                        onChange={(e: any) => { setUsuario({ ...usuario, email: e.target.value }); }}
                                        obrigatorio={true}
                                    />
                                    <div className="invalid-feedback">
                                        O e-mail é obrigatório.
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label className="fw-semibold">Login </label>
                                    <Input
                                        placeholder="Informe o login de acesso"
                                        titulo="Preencha com o login do usuário"
                                        valor={usuario.login}
                                        onChange={(e: any) => { setUsuario({ ...usuario, login: e.target.value }); }}
                                        obrigatorio={true}
                                    />
                                    <div className="invalid-feedback">
                                        O login é obrigatório.
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className='fw-semibold'>Categoria</label>
                                    <Select
                                        valor={usuario.categoriaId ? usuario.categoriaId.toString() : ''}
                                        titulo="Selecione a categoria do usuário"
                                        mensagemPadrao="Selecione a categoria"
                                        itens={categorias}
                                        onChange={(e: any) => { setUsuario({ ...usuario, categoriaId: parseInt(e.target.value, 10) }); }}
                                        obrigatorio={true} />
                                    <div className="invalid-feedback">
                                        A seleção da categoria é obrigatória
                                    </div>
                                </div>
                                 {usuario.id && (
                                    <div className="form-group mb-3">
                                        <input className="form-check-input" 
                                        type="checkbox" 
                                        id="flexCheckDefault"
                                        title="Clique para alterar a senha do usuário"
                                        onChange={() => setAlterarSenha(!alterarSenha)}
                                        style={{ marginRight: '10px'}}
                                         />
                                        <label className="fw-semibold">Alterar senha</label>
                                    </div>
                                )}
                                {(usuario.id == null || alterarSenha) && (
                                    <div className='form-group'>
                                        <label className="fw-semibold">Senha </label>
                                        <Input
                                            placeholder="Informe a senha do usuário"
                                            titulo="Preencha com a senha"
                                            tipo="password"
                                            valor={usuario.senha || ''}
                                            onChange={(e: any) => { setUsuario({ ...usuario, senha: e.target.value }); }}
                                            obrigatorio={true}
                                        />
                                        <div className="invalid-feedback">
                                            A senha deve ser informada.
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="d-flex align-items-center justify-content-between mt-2">
                                <Button tipo="submit" class="primary">Gravar</Button>
                                <Button
                                    tipo="button"
                                    class="secondary"
                                    onClick={() => { navigator('/usuarios') }}>
                                    Voltar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditarUsuario;