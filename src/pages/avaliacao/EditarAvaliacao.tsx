import { useNavigate, useParams } from "react-router-dom";
import { TSelectItem, TipoAlerta } from "../../types/TComponentProps";
import { useContext, useEffect, useState } from "react";
import { TEdicaoAvaliacao, TEdicaoPergunta, TGeracaoPergunta } from "../../types/TAvaliacao";
import { SessionContext } from "../../sessionContext";
import { AvaliacaoService } from "../../service/avaliacao.service";
import { AssitenteService } from "../../service/assistente.service";
import { tiposOperacao } from "../../util/tiposOperacao";
import Header from "../../components/Header";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";

const EditarAvaliacao = () => {
    const tiposAvaliacao: TSelectItem[] = [
        {
            label: 'Atividade',
            valor: 0
        },
        {
            label: 'Prova',
            valor: 1
        }
    ];

    const tiposPergunta: TSelectItem[] = [
        {
            label: 'Multipla escolha',
            valor: 0
        },
        {
            label: 'Descritiva',
            valor: 1
        }
    ];
    
    const valorInicialAvaliacao = {
        id: '',
        nome: '',
        descricao: '',
        tipo: ''
    } as TEdicaoAvaliacao;

    const valorInicialPergunta = {
        descricao: '',
        valor: 0,
        tipo: '',
        alternativas: '',
        respostaCorretaLabel: ''
    } as TEdicaoPergunta;

    const valorInicialGeracaoPergunta = {
        assunto: '',
        qtdDescritiva: 0,
        qtdMuliplaEscolha: 10
    } as TGeracaoPergunta

    const { id: idAvaliacao } = useParams();
    const [avaliacao, setAvaliacao] = useState(valorInicialAvaliacao);
    const [pergunta, setPergunta] = useState(valorInicialPergunta);
    const [perguntas, setPerguntas] = useState([] as TEdicaoPergunta[]);
    const [idAux, setIdAux] = useState(idAvaliacao);
    const [tipoAdicaoPergunta, setTipoAdicaoPergunta] = useState<string | null>('0');
    const [geraPergunta, setGeraPergunta] = useState(valorInicialGeracaoPergunta);
    const [gravando, setGravando] = useState(false);
    const [gerando, setGerando] = useState(false);
    const avaliacaoService = new AvaliacaoService();
    const assistenteService = new AssitenteService();
    const navigator = useNavigate();
    const contexto = useContext(SessionContext);

    useEffect(() => {
        buscarAvaliacao(idAvaliacao);
    }, []);

    const buscarAvaliacao = async (id: string | undefined) => {
        if (id == null || id === 'null') return;

        const { erro, avaliacao } = await avaliacaoService.buscarAvaliacaoPorId(+id);

        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        setAvaliacao({
            id: avaliacao.id.toString(),
            nome: avaliacao.nome,
            descricao: avaliacao.descricao,
            tipo: avaliacao.tipo.id.toString(),
        });

        const perguntas: TEdicaoPergunta[] = avaliacao.perguntas.map((pergunta) => {
            return {
                id: pergunta.id,
                descricao: pergunta.descricao,
                valor: pergunta.valor,
                tipo: pergunta.tipo.id.toString(),
                alternativas: pergunta.tipo.id === 0 ? pergunta.itens.join(',') : '',
                respostaCorreta: pergunta.tipo.id === 0 ? pergunta.itens[pergunta.respostaCorreta] : ''
            };
        });

        setPerguntas(perguntas);
    };

    const gravar = async (event: any) => {
        setGravando(true);

        try {
            event.preventDefault();

            const dadosAvaliacao = document.getElementById('dadosAvaliacao') as HTMLFormElement;
            const avaliacaoValida = validarGravacao();

            if (!avaliacaoValida) {
                dadosAvaliacao.classList.add('was-validated');
                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: 'Existem campos inválidos'
                });
                return;
            }

            avaliacao.perguntas = perguntas;

            if (avaliacao.id) {
                const erros = await avaliacaoService.editarAvaliacao(avaliacao);

                if (erros) {
                    for (const erro of erros) {
                        contexto.adcionarAlerta({
                            tipo: TipoAlerta.Erro,
                            mensagem: erro
                        });
                    }
                    return;
                }

                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Sucesso,
                    mensagem: 'Avaliação editada com sucesso',
                });

                buscarAvaliacao(avaliacao.id);
            } else {
                const { erros, avaliacao: avaliacaoCadastrada } = await avaliacaoService.cadastrarAvaliacao(avaliacao);

                if (erros) {
                    for (const erro of erros) {
                        contexto.adcionarAlerta({
                            tipo: TipoAlerta.Erro,
                            mensagem: erro
                        });
                    }
                    return;
                }

                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Sucesso,
                    mensagem: 'Avaliação cadastrada com sucesso',
                });

                setIdAux(avaliacaoCadastrada.id);
                buscarAvaliacao(avaliacaoCadastrada.id);
            }
        } finally {
            setGravando(false);
        }
    };

    const adcionarPergunta = async (event: any) => {
        event.preventDefault();

        const dadosPergunta = document.getElementById('dadosPergunta') as HTMLElement;
        const perguntaValida = validarPergunta();

        if (!perguntaValida) {
            dadosPergunta.classList.add('was-validated');
            return;
        }
        if (tipoAdicaoPergunta && tipoAdicaoPergunta === '0') {
            setGerando(true);

            const { erro, perguntas } = await assistenteService.gerarPerguntas(geraPergunta);

            setGerando(false);

            if (erro) {
                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: erro,
                });
            } else {
                setPerguntas(perguntas);
            }

            return;
        }

        if (pergunta.alternativas) {
            const alternativasArray = pergunta.alternativas.split(',');
            const indiceRespostaCorreta = alternativasArray.findIndex(alternativa => alternativa === pergunta.respostaCorretaLabel);
            setPergunta({ ...pergunta, respostaCorreta: indiceRespostaCorreta.toString() });
        }

        setPerguntas([...perguntas, pergunta]);
        setPergunta(valorInicialPergunta);
    };

    const validarPergunta = () => {
        let perguntaValida = true;

        if (tipoAdicaoPergunta === '0') {
            if (!geraPergunta.assunto && geraPergunta.assunto.length === 0) {
                perguntaValida = false;
            }

            if (geraPergunta.qtdDescritiva == null || geraPergunta.qtdMuliplaEscolha == null) {
                perguntaValida = false;
            }
        } else {
            if (!pergunta.descricao && pergunta.descricao.length === 0) {
                perguntaValida = false;
            }

            if (!pergunta.valor) {
                perguntaValida = false;
            }

            if (!pergunta.tipo) {
                perguntaValida = false;
            }

            if (pergunta.tipo === '0' &&
                ((!pergunta.alternativas || pergunta.alternativas.length === 0) ||
                    (!pergunta.respostaCorreta || pergunta.respostaCorreta.length === 0))) {
                perguntaValida = false;
            }
        }

        return perguntaValida;
    };

    const validarGravacao = () => {
        let gravacaoValida = true;

        if (!avaliacao.nome && avaliacao.nome.length > 0) {
            gravacaoValida = false;
        }

        if (!avaliacao.descricao && avaliacao.descricao.length > 0) {
            gravacaoValida = false;
        }

        if (!avaliacao.tipo) {
            gravacaoValida = false;
        }

        if (!perguntas || perguntas.length === 0) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: 'É obrigatório cadastrar pelo menos uma pergunta',
            });
            gravacaoValida = false;
        }

        return gravacaoValida;
    };

    const removerPergunta = async (id: number | null, indice: number) => {
        if (id == null) {
            const perguntasNovo = perguntas.filter((_, i) => { i !== indice });
            setPerguntas(perguntasNovo);
        } else {
            const perguntaRemovida = avaliacaoService.removerPergunta(id);

            if (!perguntaRemovida) {
                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: 'Erro ao remover a pergunta',
                });
                return;
            }

            buscarAvaliacao(idAux);

            contexto.adcionarAlerta({
                tipo: TipoAlerta.Sucesso,
                mensagem: 'Pergunta removida com sucesso',
            });
        }
    };

    const tipoAdicaoPerguntaChanged = (tipoAdicaoPergunta: string) => {
        const dadosPergunta = document.getElementById('dadosPergunta') as HTMLFormElement;
        dadosPergunta.classList.remove('was-validated');
        setTipoAdicaoPergunta(tipoAdicaoPergunta);
        setPergunta(valorInicialPergunta);
        setGeraPergunta(valorInicialGeracaoPergunta);
    };

    return (
        <>
            <Header />
            <div className="container-fluid" style={{ paddingLeft: '0', height: '700px', overflowY: 'scroll' }}>
                <div>
                    <p className="fw-semibold h5" style={{ textAlign: 'center' }}>{avaliacao.id ? 'Edição de avalição' : 'Cadastro de avaliação'}</p>
                    <form id="formEdicao" noValidate onSubmit={(e) => { gravar(e); }}>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <div style={{ width: '65%' }}>
                                <fieldset className="border p-2" style={{ backgroundColor: 'white', borderRadius: 10 }}>
                                    <legend className="float-none w-auto" style={{ fontSize: '1.15rem', fontWeight: '600' }}>Dados básicos</legend>
                                    <div id="dadosAvaliacao" style={{ padding: 5 }}>
                                        {avaliacao.id && (
                                            <div className='form-group'>
                                                <label className="fw-semibold">Código </label>
                                                <Input
                                                    placeholder=""
                                                    titulo="Código vínculado a avaliação"
                                                    valor={avaliacao.id ? avaliacao.id.toString() : ''}
                                                    onChange={(e: any) => { }}
                                                    obrigatorio={true}
                                                    desabilitado={true}
                                                />
                                                <div className="invalid-feedback">
                                                </div>
                                            </div>
                                        )}
                                        <div className='form-group'>
                                            <label className="fw-semibold">Nome </label>
                                            <Input
                                                placeholder="Informe o nome"
                                                titulo="Preencha com nome da avaliação"
                                                valor={avaliacao.nome}
                                                onChange={(e: any) => { setAvaliacao({ ...avaliacao, nome: e.target.value }); }}
                                                obrigatorio={true}
                                            />
                                            <div className="invalid-feedback">
                                                O nome é obrigatório.
                                            </div>
                                        </div>
                                        <div className='form-group'>
                                            <label className="fw-semibold">Descrição </label>
                                            <Input
                                                placeholder="Informe a descrição"
                                                titulo="Preencha com a descrição da avaliação"
                                                valor={avaliacao.descricao}
                                                onChange={(e: any) => { setAvaliacao({ ...avaliacao, descricao: e.target.value }); }}
                                                obrigatorio={true}
                                            />
                                            <div className="invalid-feedback">
                                                A descrição da avaliação é obrigatória.
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className='fw-semibold'>Tipo</label>
                                            <Select
                                                valor={avaliacao.tipo ? avaliacao.tipo.toString() : ''}
                                                titulo="Selecione o tipo da avaliação"
                                                mensagemPadrao="Selecione o tipo da avaliação"
                                                itens={tiposAvaliacao}
                                                onChange={(e: any) => { setAvaliacao({ ...avaliacao, tipo: e.target.value }); }}
                                                obrigatorio={true} />
                                            <div className="invalid-feedback">
                                                A seleção do tipo da avaliação é obrigatória
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="border p-2" style={{ backgroundColor: 'white', borderRadius: 10 }}>
                                    <legend className="float-none w-auto" style={{ fontSize: '1.15rem', fontWeight: '600' }}>
                                        Perguntas
                                    </legend>
                                    <div id="dadosPergunta" style={{ padding: 5 }}>
                                        <div className='form-group'>
                                            <label className='fw-semibold'>Tipo da inclusão </label>
                                            <Select
                                                valor={tipoAdicaoPergunta || ''}
                                                titulo="Selecione tipo da inclusão"
                                                mensagemPadrao="Selecione a operação"
                                                itens={tiposOperacao}
                                                onChange={(e: any) => { tipoAdicaoPerguntaChanged(e.target.value); }}
                                                obrigatorio={false} />
                                            <div className="invalid-feedback">
                                            </div>
                                        </div>
                                        {(tipoAdicaoPergunta && tipoAdicaoPergunta === '0') && (
                                            <>
                                                <div className='form-group'>
                                                    <label className="fw-semibold">Assunto </label>
                                                    <Input
                                                        placeholder="Informe o assunto para geração das perguntas"
                                                        titulo="Preencha com o assunto que o assitente usará para gerar as perguntas"
                                                        valor={geraPergunta.assunto}
                                                        onChange={(e: any) => { setGeraPergunta({ ...geraPergunta, assunto: e.target.value }); }}
                                                        obrigatorio={true}
                                                    />
                                                    <div className="invalid-feedback">
                                                        O campo assunto é obrigatório
                                                    </div>
                                                </div>
                                                <div className='form-group'>
                                                    <label className="fw-semibold">Quantidade descritiva </label>
                                                    <Input
                                                        placeholder="Informe a quantidade descritiva"
                                                        titulo="Preencha com a quantidade de perguntas descritivas a ser gerado"
                                                        valor={geraPergunta.qtdDescritiva != null ? geraPergunta.qtdDescritiva.toString() : ''}
                                                        onChange={(e: any) => { setGeraPergunta({ ...geraPergunta, qtdDescritiva: e.target.value }); }}
                                                        obrigatorio={true}
                                                    />
                                                    <div className="invalid-feedback">
                                                        O campo quantidade descritiva é obrigatório
                                                    </div>
                                                </div>
                                                <div className='form-group'>
                                                    <label className="fw-semibold">Quantidade multipla escolha </label>
                                                    <Input
                                                        placeholder="Informe a quantidade multipla escolha"
                                                        titulo="Preencha com a quantidade de perguntas multipla escolha a ser gerado"
                                                        valor={geraPergunta.qtdMuliplaEscolha ? geraPergunta.qtdMuliplaEscolha.toString() : ''}
                                                        onChange={(e: any) => { setGeraPergunta({ ...geraPergunta, qtdMuliplaEscolha: e.target.value }); }}
                                                        obrigatorio={true}
                                                    />
                                                    <div className="invalid-feedback">
                                                        O campo quantidade multipla escolha é obrigatório
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {(!tipoAdicaoPergunta || tipoAdicaoPergunta === '1') && (
                                            <>
                                                <div className='form-group'>
                                                    <label className="fw-semibold">Descrição </label>
                                                    <Input
                                                        placeholder="Informe a descrição"
                                                        titulo="Preencha com a descrição da pergunta"
                                                        valor={pergunta.descricao}
                                                        onChange={(e: any) => { setPergunta({ ...pergunta, descricao: e.target.value }); }}
                                                        obrigatorio={true}
                                                    />
                                                    <div className="invalid-feedback">
                                                        A descrição da pergunta é obrigatória
                                                    </div>
                                                </div>
                                                <div className='form-group'>
                                                    <label className="fw-semibold">Peso </label>
                                                    <Input
                                                        placeholder="Informe o valor"
                                                        titulo="Preencha com um valor de 0.25 a 10"
                                                        valor={pergunta.valor ? pergunta.valor.toString() : ''}
                                                        onChange={(e: any) => { setPergunta({ ...pergunta, valor: parseInt(e.target.value, 10) }); }}
                                                        obrigatorio={true}
                                                    />
                                                    <div className="invalid-feedback">
                                                        É obrigatório informar o valor de 0.25 a 10
                                                    </div>
                                                </div>
                                                <div className='form-group'>
                                                    <label className='fw-semibold'>Tipo </label>
                                                    <Select
                                                        valor={pergunta.tipo ? pergunta.tipo.toString() : ''}
                                                        titulo="Selecione o tipo da avaliação"
                                                        mensagemPadrao="Selecione o tipo da avaliação"
                                                        itens={tiposPergunta}
                                                        onChange={(e: any) => { setPergunta({ ...pergunta, tipo: e.target.value }); }}
                                                        obrigatorio={true} />
                                                    <div className="invalid-feedback">
                                                        A seleção do tipo da avaliação é obrigatória
                                                    </div>
                                                </div>
                                                {pergunta.tipo && pergunta.tipo === '0' && (
                                                    <>
                                                        <div className='form-group'>
                                                            <label className="fw-semibold">Alternativas </label>
                                                            <Input
                                                                placeholder="Informe as alternativas (Separadas por vírgula)"
                                                                titulo="Preencha com as alternativas. Ex: teste1, teste2, teste3, teste4"
                                                                valor={pergunta.alternativas ? pergunta.alternativas.toString() : ''}
                                                                onChange={(e: any) => { setPergunta({ ...pergunta, alternativas: e.target.value }); }}
                                                                obrigatorio={true}
                                                            />
                                                            <div className="invalid-feedback">
                                                                É obrigatório as alternativas
                                                            </div>
                                                        </div>
                                                        <div className='form-group'>
                                                            <label className="fw-semibold">Resposta correta</label>
                                                            <Input
                                                                placeholder="Informe a resposta correta"
                                                                titulo="Preencha com o resposta correta entre as alternativas informadas"
                                                                valor={pergunta.respostaCorretaLabel || ''}
                                                                onChange={(e: any) => { setPergunta({ ...pergunta, respostaCorretaLabel: e.target.value }); }}
                                                                obrigatorio={true}
                                                            />
                                                            <div className="invalid-feedback">
                                                                É obrigatório informar a resposta correta
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        <div className="d-flex align-items-center justify-content-center" style={{ marginBottom: 10 }}>
                                            <Button tipo="button" class="primary" onClick={adcionarPergunta} carregando={gerando}>
                                                {!tipoAdicaoPergunta || tipoAdicaoPergunta === '1' ? 'Adcionar' : 'Gerar'}
                                            </Button>
                                        </div>

                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th colSpan={7} className="text-center bg-light">
                                                        <p className="fw-bold h6 mb-0">Perguntas cadastradas</p>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th>Ações</th>
                                                    <th>Código</th>
                                                    <th>Descrição</th>
                                                    <th>Tipo</th>
                                                    <th>Peso</th>
                                                    <th>Alternativas</th>
                                                    <th>Resposta correta</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {perguntas.map((pergunta, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{
                                                                <button
                                                                    type="button"
                                                                    style={{ border: 'none', backgroundColor: 'white', fontSize: '19px', padding: '0' }}
                                                                    title="Clique para inativar a avaliação"
                                                                    onClick={() => { removerPergunta(pergunta.id || null, index); }}
                                                                >
                                                                    &#10060;
                                                                </button>
                                                            }</td>
                                                            <td>{pergunta.id}</td>
                                                            <td>{pergunta.descricao}</td>
                                                            <td>{tiposPergunta.find(tipo => tipo.valor == pergunta.tipo)?.label}</td>
                                                            <td>{pergunta.valor}</td>
                                                            <td>{pergunta.alternativas}</td>
                                                            <td>{pergunta.respostaCorretaLabel}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                                <div className="d-flex align-items-center justify-content-center" style={{ margin: 10 }}>
                                    <Button
                                        tipo="submit"
                                        class="primary"
                                        style={{ marginRight: 10 }}
                                        titulo="Clique para gravar as informações acima"
                                        carregando={gravando}
                                        desabilitado={gerando}
                                    >Gravar</Button>
                                    <Button
                                        tipo="button"
                                        class="secondary"
                                        onClick={() => { navigator('/avaliacoes') }}
                                        titulo="Clique para voltar para tela anterior"
                                        desabilitado={gravando || gerando}
                                    >
                                        Voltar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditarAvaliacao;