import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { useContext, useState } from "react";
import { TEdicaoAvaliacao, TEdicaoPergunta } from "../../types/TAvaliacao";
import Input from "../../components/Input";
import { TSelectItem } from "../../types/TSelect";
import Select from "../../components/Select";
import Button from "../../components/Button";
import { SessionContext } from "../../sessionContext";
import { TipoAlerta } from "../../types/TAlert";

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
    const valorInicialPergunta = {
        descricao: '',
        peso: 0,
        tipo: '',
        alternativas: '',
        respostaCorreta: ''
    } as TEdicaoPergunta;

    const [avaliacao, setAvaliacao] = useState({} as TEdicaoAvaliacao);
    const [pergunta, setPergunta] = useState(valorInicialPergunta);
    const [perguntas, setPerguntas] = useState([] as TEdicaoPergunta[]);
    const { id: idAvaliacao } = useParams();
    const navigator = useNavigate();
    const contexto = useContext(SessionContext);

    const gravar = async (event: any) => {

    };

    const adcionarPergunta = async (event: any) => {
        event.preventDefault();

        const perguntaValida = validarPergunta();

        if (!perguntaValida) {
            return;
        }

        setPerguntas([...perguntas, pergunta]);
        setPergunta(valorInicialPergunta);
    };

    const validarPergunta = () => {
        let perguntaValida = true;

        if (!pergunta.descricao || pergunta.descricao.trim().length === 0) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: 'O campo descricao da pergunta é obrigatório',
            });
            perguntaValida = false;
        }

        if (!pergunta.peso) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: 'O campo peso da pergunta é obrigatório',
            });
            perguntaValida = false;
        }

        if (!pergunta.tipo) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: 'O campo tipo da pergunta é obrigatório',
            });
            perguntaValida = false;
        }

        return perguntaValida;
    };

    return (
        <>
            <Header />
            <div className="container-fluid" style={{ paddingLeft: '0', height: '700px', overflowY: 'scroll' }}>
                <div>
                    <p className="fw-semibold h5 mb-4">{idAvaliacao && idAvaliacao !== 'null' ? 'Edição de avalição' : 'Cadastro de avaliação'}</p>
                    <form id="formEdicao" noValidate onSubmit={(e) => { gravar(e); }}>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <div style={{ width: '65%' }}>
                                <fieldset className="border p-2" style={{ backgroundColor: 'white', borderRadius: 10 }}>
                                    <legend className="float-none w-auto" style={{ fontSize: '1.15rem', fontWeight: '600' }}>Dados básicos</legend>
                                    <div style={{ padding: 5 }}>
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
                                    <legend className="float-none w-auto" style={{ fontSize: '1.15rem', fontWeight: '600' }}    >Perguntas</legend>
                                    <div style={{ padding: 5 }}>
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
                                                placeholder="Informe o peso"
                                                titulo="Preencha com um valor de 0.25 a 10"
                                                valor={pergunta.peso ? pergunta.peso.toString() : ''}
                                                onChange={(e: any) => { setPergunta({ ...pergunta, peso: parseInt(e.target.value, 10) }); }}
                                                obrigatorio={true}
                                            />
                                            <div className="invalid-feedback">
                                                É obrigatório informar o peso de 0.25 a 10
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
                                                        É obrigatório informar o peso de 0.25 a 10
                                                    </div>
                                                </div>
                                                <div className='form-group'>
                                                    <label className="fw-semibold">Resposta correta</label>
                                                    <Input
                                                        placeholder="Informe a resposta correta"
                                                        titulo="Preencha com o resposta correta entre as alternativas informadas"
                                                        valor={pergunta.respostaCorreta ? pergunta.respostaCorreta.toString() : ''}
                                                        onChange={(e: any) => { setPergunta({ ...pergunta, respostaCorreta: e.target.value }); }}
                                                        obrigatorio={true}
                                                    />
                                                    <div className="invalid-feedback">
                                                        É obrigatório informar o peso de 0.25 a 10
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className="d-flex align-items-center justify-content-center" style={{ marginBottom: 10}}>
                                            <Button tipo="button" class="primary" onClick={adcionarPergunta}>Adcionar</Button>
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
                                                            <td></td>
                                                            <td>{pergunta.id}</td>
                                                            <td>{pergunta.descricao}</td>
                                                            <td>{pergunta.tipo}</td>
                                                            <td>{pergunta.peso}</td>
                                                            <td>{pergunta.alternativas}</td>
                                                            <td>{pergunta.respostaCorreta}</td>
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
                                    >Gravar</Button>
                                    <Button
                                        tipo="button"
                                        class="secondary"
                                        onClick={() => { navigator('/avaliacoes') }}
                                        titulo="Clique para voltar para tela anterior">
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