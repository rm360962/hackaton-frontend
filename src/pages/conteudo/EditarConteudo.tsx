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
import Select from "../../components/Select";
import { tiposOperacao } from "../../util/tiposOperacao";
import { AssitenteService } from "../../service/assistente.service";

const EditarConteudo = () => {
    const valorInicialConteudo = {
        titulo: '',
        descricao: '',
        texto: ''
    } as TEdicaoConteudo;
    const [conteudo, setConteudo] = useState(valorInicialConteudo);
    const [carregando, setCarregando] = useState(false);
    const [tipoAdicaoConteudo, setTipoAdicaoConteudo] = useState<string | null>('0');
    const [assuntoGeracao, setAssuntoGeracao] = useState('');

    const conteudoService = new ConteudoService();
    const assistenteService = new AssitenteService();
    const contexto = useContext(SessionContext);
    const navigator = useNavigate();
    const { id: idConteudo } = useParams();

    const buscarConteudo = async () => {
        if (idConteudo && idConteudo !== 'null') {
            const { erro, conteudo } = await conteudoService.buscarConteudoPorId(+idConteudo);

            if (erro) {
                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: erro,
                });
                return;
            }
            
            setConteudo({
                id: conteudo.id,
                titulo: conteudo.titulo,
                descricao: conteudo.descricao,
                texto: conteudo.texto,
            });
        }
    };

    useEffect(() => {
        buscarConteudo();
    }, []);

    const gravar = async (event: any) => {
        event.preventDefault();

        const form = document.getElementById('formEdicao') as HTMLFormElement;

        if (!form.checkValidity()) {
            form.classList.add('was-validated')
            return;
        }

        const conteudoValido = validarConteudo();

        if (!conteudoValido) {
            return;
        }

        setCarregando(true);

        try {
            if (conteudo.id) {
                const erros = await conteudoService.editarConteudo(conteudo);

                if (erros) {
                    for (const erro of erros) {
                        contexto.adcionarAlerta({
                            tipo: TipoAlerta.Erro,
                            mensagem: erro.mensagem
                        });
                    }
                    return;
                }

                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Sucesso,
                    mensagem: 'Conteúdo editado com sucesso',
                });
            } else {
                const { conteudo: conteudoCadastrado, erros } =
                    await conteudoService.cadastrarConteudo(conteudo);

                if (erros) {
                    for (const erro of erros) {
                        contexto.adcionarAlerta({
                            tipo: TipoAlerta.Erro,
                            mensagem: erro.mensagem
                        });
                    }
                    return;
                }

                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Sucesso,
                    mensagem: 'Conteúdo cadastrado com sucesso',
                });

                setConteudo(conteudoCadastrado);
            }
        } finally {
            setCarregando(false);
        }
    };

    const validarConteudo = () => {
        let conteudoValido = true;
        if (!conteudo.descricao || conteudo.descricao.trim().length === 0) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: 'A descrição é obrigatória'
            });
            conteudoValido = false;
        }

        return conteudoValido;
    };

    const tipoAdicaoConteudoChanged = (valor: string) => {
        setTipoAdicaoConteudo(valor);
        setConteudo(valorInicialConteudo);
        setAssuntoGeracao('');
        const form = document.getElementById('formEdicao') as HTMLFormElement;
        form.classList.remove('was-validated')
    };

    const gerarConteudo = async () => {
        const geracaoValida = validarGeracaoConteudo();

        if (!geracaoValida) {
            const form = document.getElementById('formEdicao') as HTMLFormElement;
            form.classList.add('was-validated')
            return;
        }

        setCarregando(true);

        try {
            const { erro, conteudo } = await assistenteService.gerarConteudo(assuntoGeracao);
            console.log(conteudo);
            if (erro) {
                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: erro,
                });
                return;
            }

            setTipoAdicaoConteudo('1');
            setConteudo(conteudo);
        } finally {
            setCarregando(false);
        }
    };

    const validarGeracaoConteudo = () => {
        let geracaoValida = true;

        if (!assuntoGeracao || assuntoGeracao.trim().length === 0) {
            geracaoValida = false;
        }

        return geracaoValida;
    }

    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="d-flex align-items-center justify-content-center">
                    <div style={{ backgroundColor: 'white', padding: 15, borderRadius: '5px', width: '90%' }}>
                        <p className="fw-semibold h5 mb-4 text-center">{conteudo.id ? 'Edição de conteúdo' : 'Cadastro de conteúdo'}</p>
                        <form id="formEdicao" noValidate onSubmit={(e) => { gravar(e); }}>
                            <div>
                                {!conteudo.id && (
                                    <div className='form-group'>
                                        <label className='fw-semibold'>Tipo da inclusão </label>
                                        <Select
                                            valor={tipoAdicaoConteudo || ''}
                                            titulo="Selecione tipo da inclusão"
                                            mensagemPadrao="Selecione a operação"
                                            itens={tiposOperacao}
                                            onChange={(e: any) => { tipoAdicaoConteudoChanged(e.target.value); }}
                                            obrigatorio={false}
                                            style={{ maxWidth: '350px' }} />
                                        <div className="invalid-feedback">
                                        </div>
                                    </div>
                                )}
                                {(!conteudo.id && tipoAdicaoConteudo === '0') && (
                                    <div className='form-group'>
                                        <label className='fw-semibold'>Assunto </label>
                                        <Input
                                            placeholder="Digite o assunto para geração do conteúdo"
                                            titulo="Código do conteúdo"
                                            valor={assuntoGeracao}
                                            onChange={(e: any) => setAssuntoGeracao(e.target.value)}
                                            obrigatorio={true}
                                            style={{ maxWidth: '350px' }}
                                        />
                                        <div className="invalid-feedback">
                                            O campo assunto é obrigatório
                                        </div>
                                    </div>
                                )}
                                {(conteudo.id || (!tipoAdicaoConteudo || tipoAdicaoConteudo === '1')) && (
                                    <>
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
                                                    style={{ maxWidth: '350px' }}
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
                                                style={{ maxWidth: '350px' }}
                                            />
                                            <div className="invalid-feedback">
                                                O título é obrigatório
                                            </div>
                                        </div>
                                        <div className='form-group mb-1'>
                                            <label className='fw-semibold'>Descrição:</label>
                                            <Input
                                                placeholder="Informe a descrição do conteúdo"
                                                titulo="Informe uma breve descrição do conteúdo"
                                                valor={conteudo.descricao}
                                                onChange={(e: any) => setConteudo({ ...conteudo, descricao: e.target.value })}
                                                obrigatorio={true}
                                                style={{ maxWidth: '350px' }}
                                                maxLength={80}
                                            />
                                            <div className="invalid-feedback">
                                                O título é obrigatório
                                            </div>
                                        </div>
                                        <div className='form-group mb-1'>
                                            <label className='fw-semibold'>Texto:</label>
                                            <MDEditor
                                                value={conteudo.texto}
                                                onChange={(texto) => { setConteudo({ ...conteudo, texto: texto || '' }) }}
                                                data-color-mode="light" />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="d-flex align-items-center justify-content-center mt-3">
                                {(conteudo?.id || tipoAdicaoConteudo === '1') && (
                                    <Button
                                        tipo="submit"
                                        class="primary"
                                        carregando={carregando}
                                        style={{ marginRight: 10 }}>
                                        Gravar
                                    </Button>
                                )}
                                {!conteudo?.id && tipoAdicaoConteudo === '0' && (
                                    <Button
                                        tipo="button"
                                        class="primary"
                                        carregando={carregando}
                                        style={{ marginRight: 10 }}
                                        onClick={gerarConteudo}>
                                        Gerar
                                    </Button>
                                )}
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