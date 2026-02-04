import { useContext, useEffect, useState } from "react";
import { TEdicaoConteudo } from "../../types/TConteudo";
import { useNavigate, useParams } from "react-router-dom";
import { SessionContext } from "../../sessionContext";
import { TipoAlerta } from "../../types/TComponentProps";
import { ConteudoService } from "../../service/conteudo.service";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Input from "../../components/Input";
import MDEditor from "@uiw/react-md-editor";

const EditarConteudo = () => {
    const [conteudo, setConteudo] = useState({} as TEdicaoConteudo);
    const [carregando, setCarregando] = useState(false);
    const conteudoService = new ConteudoService();
    const context = useContext(SessionContext);
    const navigator = useNavigate();
    const { id: idConteudo } = useParams();

    const buscarconteudo = async () => {
        if (idConteudo && idConteudo !== 'null') {
            const { erro, conteudo } = await conteudoService.buscarConteudoPorId(+idConteudo);

            if (erro) {
                context.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: erro,
                });
                return;
            }

            setConteudo({
                id: conteudo.id,
                titulo: conteudo.titulo,
                descricao: conteudo.descricao,
            });
        }
    };

    useEffect(() => {
        buscarconteudo();
    }, []);

    const gravar = async (event: any) => {
        event.preventDefault();

        const form = document.getElementById('formEdicao') as HTMLFormElement;

        if (!form.checkValidity()) {
            form.classList.add('was-validated')
            return;
        }

        setCarregando(true);

        try {
            if (conteudo.id) {
                const erros = await conteudoService.editarConteudo(conteudo);

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
                    mensagem: 'Conteúdo editado com sucesso',
                });
            } else {
                const { conteudo: conteudoCadastrado, erros } =
                    await conteudoService.cadastrarConteudo(conteudo);

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
                    mensagem: 'Conteúdo cadastrado com sucesso',
                });

                setConteudo(conteudoCadastrado);
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="d-flex align-items-center justify-content-center">
                    <div>
                        <p className="fw-semibold h5 mb-4">{conteudo.id ? 'Edição de conteúdo' : 'Cadastro de conteúdo'}</p>
                        <form id="formEdicao" noValidate onSubmit={(e) => { gravar(e); }}>
                            <div>
                                {conteudo.id && (
                                    <div className='form-group mb-1'>
                                        <label className='fw-semibold'>Código</label>
                                        <Input
                                            placeholder=""
                                            titulo="Código do conteúdo"
                                            valor={conteudo.id.toString()}
                                            onChange={(e: any) => { }}
                                            obrigatorio={true}
                                            desabilitado={true}
                                            style={{ maxWidth: '250px' }}
                                        />
                                        <div className="invalid-feedback">
                                        </div>
                                    </div>
                                )}
                                <div className='form-group mb-1'>
                                    <label className='fw-semibold'>Título</label>
                                    <Input
                                        placeholder="Informe o título do conteúdo"
                                        titulo="Informe o título do conteúdo"
                                        valor={conteudo.titulo}
                                        onChange={(e: any) => setConteudo({ ...conteudo, titulo: e.target.value })}
                                        obrigatorio={true}
                                        style={{ maxWidth: '250px' }}
                                    />
                                    <div className="invalid-feedback">
                                        O título é obrigatório
                                    </div>
                                </div>
                                <div className='form-group mb-1'>
                                    <label className='fw-semibold'>Descrição:</label>
                                    <MDEditor
                                        value={conteudo.descricao}
                                        onChange={(texto) => { setConteudo({ ...conteudo, descricao: texto || ''})}}
                                        data-color-mode="light" />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mt-2">
                                <Button
                                    tipo="submit"
                                    class="primary"
                                    carregando={carregando}>
                                    Gravar
                                </Button>
                                <Button
                                    tipo="button"
                                    class="secondary"
                                    desabilitado={carregando}
                                    onClick={() => { navigator('/conteudos') }}>
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

export default EditarConteudo;