import { useContext, useEffect, useState } from "react";
import { TEdicaoAvaliacaoAluno } from "../../types/TAvaliacaoUsuario";
import { SessionContext } from "../../sessionContext";
import { useNavigate, useParams } from "react-router-dom";
import { TipoAlerta, TSelectItem } from "../../types/TComponentProps";
import { AvaliacaoAlunoService } from "../../service/avaliacaoUsuario.service";
import { UsuarioService } from "../../service/usuario.service";
import { AvaliacaoService } from "../../service/avaliacao.service";
import { ConteudoService } from "../../service/conteudo.service";
import { converterEnumeradoSelectItem } from "../../util/funcoesGenericas";
import { SituacaoAvaliacaoAluno } from "../../enums/situacaoAvaliacao.enum";
import Header from "../../components/Header";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "../../components/Select";
import ReactSelect from 'react-select';

type ReactSelectItem = {
    label: string,
    value: any,
};

const EditarAvaliacaoAluno = () => {
    const [avaliacaoAluno, setAvaliacaoAluno] = useState({} as TEdicaoAvaliacaoAluno);
    const [alunos, setAlunos] = useState([] as TSelectItem[]);
    const [multiAluno, setMultiAlunos] = useState([] as any);
    const [avaliacoes, setAvaliacoes] = useState([] as TSelectItem[]);
    const [conteudos, setConteudos] = useState([] as any);
    const [situacoes, setSituacoes] = useState(converterEnumeradoSelectItem(SituacaoAvaliacaoAluno));
    const [gravando, setGravando] = useState(false);
    const contexto = useContext(SessionContext);
    const navegador = useNavigate();
    const avaliacaoAlunoService = new AvaliacaoAlunoService();
    const avaliacaoService = new AvaliacaoService();
    const usuarioService = new UsuarioService();
    const conteudoService = new ConteudoService();

    const { id } = useParams();

    useEffect(() => {
        buscarAvaliacaoUsuario();
        buscarAlunos();
        buscarAvaliacoes();
        buscarConteudos();
    }, []);

    const gravar = async (event: any) => {
        event.preventDefault();
        const formEdicao = document.getElementById('formEdicao') as HTMLFormElement;

        if (!formEdicao.checkValidity()) {
            formEdicao.classList.add('was-validated')
            return;
        }

        setGravando(true);

        try {
            if (!avaliacaoAluno.id) {
                const { erros } = await avaliacaoAlunoService.cadastrarAvaliacaoAluno(avaliacaoAluno);

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
                    mensagem: 'Sucesso ao cadastrar as avaliações para os alunos',
                });

                navegador('/avaliacoes/aluno');
            } else {
                const erros = await avaliacaoAlunoService.editarAvaliacaoAluno(avaliacaoAluno);

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
                    mensagem: 'Avaliação aluno editada com sucesso',
                });
            }
        } finally {
            setGravando(false);
        }
    };

    const buscarAvaliacaoUsuario = async () => {
        if (!id || id === 'null') return;

        const { erro, avaliacaoAluno } = await avaliacaoAlunoService.buscarAvaliacaoAlunoPorId(+id);

        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        const camposDataLimite = avaliacaoAluno.dataLimite.split('/');
        const dataLimiteInput = `${camposDataLimite[2]}-${camposDataLimite[1]}-${camposDataLimite[0]}`;

        let dataExecucaoInput = '';
        
        if(avaliacaoAluno.dataExecucao) {
            const camposDataExecucao = avaliacaoAluno.dataExecucao.split('/');
            dataExecucaoInput = `${camposDataExecucao[2]}-${camposDataExecucao[1]}-${camposDataExecucao[0]}`;
        }

        setAvaliacaoAluno({
            id: avaliacaoAluno.id.toString(),
            avaliacaoId: avaliacaoAluno.avaliacao.id.toString(),
            conteudosId: avaliacaoAluno.conteudosId?.map((conteudo) => conteudo.toString()),
            usuarioId: avaliacaoAluno.usuario.id.toString(),
            dataExecucao: dataExecucaoInput,
            dataLimite: dataLimiteInput,
            nota: avaliacaoAluno?.nota?.toString() || '',
            situacaoId: avaliacaoAluno.situacao.id.toString()
        })
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
        const selectItemAlunos: TSelectItem[] = [];
        const multiAlunos: ReactSelectItem[] = [];

        alunos.forEach((aluno) => {
            selectItemAlunos.push({
                label: `${aluno.id} - ${aluno.nome}`,
                valor: aluno.id
            });
            multiAlunos.push({
                label: `${aluno.id} - ${aluno.nome}`,
                value: aluno.id
            });
        });

        setAlunos(selectItemAlunos);
        setMultiAlunos(multiAlunos);
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

        const selectItemAvalicao = avaliacoes.map((avaliacao) => {
            return {
                label: `${avaliacao.id} - ${avaliacao.nome}`,
                valor: avaliacao.id
            };
        });

        setAvaliacoes(selectItemAvalicao);
    };

    const buscarConteudos = async () => {
        const { erro, conteudos } = await conteudoService.buscarConteudos({
            ativo: true,
        });

        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });

            return;
        }

        const selectItemConteudos = conteudos.map((conteudo) => {
            return {
                label: `${conteudo.id} - ${conteudo.descricao}`,
                value: conteudo.id
            };
        });

        setConteudos(selectItemConteudos);
    };

    return (
        <>
            <Header />
            <div className="container-fluid" style={{ paddingLeft: '0', height: '700px', overflowY: 'scroll' }}>
                <div className="d-flex align-items-center justify-content-center">
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: 'white', padding: 15, borderRadius: '5px', width: '90%' }}>
                        <p className="fw-semibold h5 mb-4 text-center">{avaliacaoAluno.id ? 'Edição de avaliação aluno' : 'Cadastro de avaliação aluno'}</p>
                        <form id="formEdicao" noValidate onSubmit={(e) => { gravar(e); }}>
                            <div>
                                {avaliacaoAluno.id && (
                                    <div className='form-group'>
                                        <label className='fw-semibold'>Código </label>
                                        <Input
                                            placeholder=""
                                            titulo="Código da avaliação aluno"
                                            valor={avaliacaoAluno.id || ''}
                                            onChange={(e: any) => { }}
                                            obrigatorio={false}
                                            desabilitado={true}
                                            style={{ maxWidth: '350px' }}
                                        />
                                        <div className="invalid-feedback">
                                        </div>
                                    </div>
                                )}
                                <div className='form-group mb-1'>
                                    <label className='fw-semibold'>Avaliação:</label>
                                    <Select
                                        valor={avaliacaoAluno.avaliacaoId || ''}
                                        titulo="Selecione a avaliação"
                                        mensagemPadrao="Selecione a avaliação"
                                        itens={avaliacoes}
                                        onChange={(e: any) => setAvaliacaoAluno({ ...avaliacaoAluno, avaliacaoId: e.target.value })}
                                        obrigatorio={true}
                                        style={{ maxWidth: '350px' }}
                                        desabilitado={avaliacaoAluno.id != null} />
                                    <div className="invalid-feedback">
                                        É obrigatório selecionar a avaliação
                                    </div>
                                </div>
                                {avaliacaoAluno.id && (
                                    <>
                                        <div className='form-group mb-1'>
                                            <label className='fw-semibold'>Aluno:</label>
                                            <Select
                                                valor={avaliacaoAluno.usuarioId || ''}
                                                titulo="Selecione a avaliação"
                                                mensagemPadrao="Selecione a avaliação"
                                                itens={alunos}
                                                onChange={(e: any) => setAvaliacaoAluno({ ...avaliacaoAluno, usuarioId: e.target.value })}
                                                obrigatorio={true}
                                                style={{ maxWidth: '350px' }}
                                                desabilitado={avaliacaoAluno.id != null} />
                                            <div className="invalid-feedback">
                                                É obrigatório selecionar o aluno
                                            </div>
                                        </div>
                                        <div className='form-group mb-1'>
                                            <label className='fw-semibold'>Data de execução:</label>
                                            <Input
                                                titulo="Selecione a data da execução da avaliação"
                                                tipo="date"
                                                valor={avaliacaoAluno.dataExecucao || ''}
                                                obrigatorio={false}
                                                onChange={(e: any) => setAvaliacaoAluno({ ...avaliacaoAluno, dataExecucao: e.target.value })}
                                                style={{ maxWidth: '350px' }} />
                                            <div className="invalid-feedback">
                                            </div>
                                        </div>
                                        <div className='form-group mb-1'>
                                            <label className='fw-semibold'>Situacao:</label>
                                            <Select
                                                valor={avaliacaoAluno.situacaoId || ''}
                                                titulo="Selecione a situação"
                                                mensagemPadrao="Selecione a situação"
                                                itens={situacoes}
                                                onChange={(e: any) => setAvaliacaoAluno({ ...avaliacaoAluno, situacaoId: e.target.value })}
                                                obrigatorio={false}
                                                style={{ maxWidth: '350px' }}
                                            />
                                            <div className="invalid-feedback">
                                            </div>
                                        </div>
                                        <div className='form-group'>
                                            <label className='fw-semibold'>Nota </label>
                                            <Input
                                                placeholder="Digite a nota do aluno"
                                                titulo="Preencha com a nota do aluno de 0 a 10"
                                                valor={avaliacaoAluno?.nota || ''}
                                                onChange={(e: any) => { setAvaliacaoAluno({ ...avaliacaoAluno, nota: e.target.value }) }}
                                                obrigatorio={false}
                                                style={{ maxWidth: '350px' }}
                                            />
                                            <div className="invalid-feedback">
                                            </div>
                                        </div>
                                    </>
                                )}

                                {!avaliacaoAluno.id && (
                                    <>
                                        <div className='form-group mb-1'>
                                            <Input
                                                placeholder=""
                                                titulo=""
                                                valor={avaliacaoAluno?.usuariosId?.toString() || ''}
                                                onChange={(e: any) => { }}
                                                obrigatorio={true}
                                                style={{ display: 'none' }}
                                            />
                                            <label className='fw-semibold'>Alunos:</label>
                                            <ReactSelect<ReactSelectItem, true>
                                                isMulti
                                                options={multiAluno}
                                                value={multiAluno.filter((option: ReactSelectItem) =>
                                                    avaliacaoAluno.usuariosId?.includes(option.value)
                                                )}
                                                onChange={(selectedOptions) => {
                                                    setAvaliacaoAluno({
                                                        ...avaliacaoAluno,
                                                        usuariosId: selectedOptions ? selectedOptions.map((item) => item.value) : [],
                                                    });
                                                }}
                                                styles={{
                                                    container: (baseStyles) => ({
                                                        ...baseStyles,
                                                        maxWidth: '350px',
                                                    }),
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        maxWidth: '350px',
                                                    }),
                                                }}
                                                placeholder="Selecione os alunos"
                                                noOptionsMessage={() => "Nenhuma opção encontrada"}
                                            />
                                            <div className="invalid-feedback">
                                                É obrigatório selecionar no mínimo um aluno
                                            </div>
                                        </div>
                                        <div className='form-group mb-1'>
                                            <Input
                                                placeholder=""
                                                titulo=""
                                                valor={avaliacaoAluno?.conteudosId?.toString() || ''}
                                                onChange={(e: any) => { }}
                                                obrigatorio={true}
                                                style={{ display: 'none' }}
                                            />
                                            <label className='fw-semibold'>Conteúdos:</label>
                                            <ReactSelect<ReactSelectItem, true>
                                                isMulti
                                                options={conteudos}
                                                value={conteudos.filter((option: ReactSelectItem) =>
                                                    avaliacaoAluno.conteudosId?.includes(option.value))}
                                                onChange={(selectedOptions) => {
                                                    setAvaliacaoAluno({
                                                        ...avaliacaoAluno,
                                                        conteudosId: selectedOptions ? selectedOptions.map((item) => item.value) : [],
                                                    });
                                                }}
                                                styles={{
                                                    container: (baseStyles) => ({
                                                        ...baseStyles,
                                                        maxWidth: '350px',
                                                    }),
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        maxWidth: '350px',
                                                    }),
                                                }}
                                                placeholder="Selecione os conteúdos"
                                                noOptionsMessage={() => "Nenhuma opção encontrada"}
                                            />
                                            <div className="invalid-feedback">
                                                É obrigatório selecionar no mínimo um conteúdo
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className='form-group mb-1'>
                                    <label className='fw-semibold'>Data limite:</label>
                                    <Input
                                        titulo="Selecione a data limite para realização da avaliação"
                                        tipo="date"
                                        valor={avaliacaoAluno.dataLimite || ''}
                                        obrigatorio={false}
                                        onChange={(e: any) => setAvaliacaoAluno({ ...avaliacaoAluno, dataLimite: e.target.value })}
                                        style={{ maxWidth: '350px' }} />
                                    <div className="invalid-feedback">
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center mt-3">
                                <Button
                                    tipo="submit"
                                    class="primary"
                                    carregando={gravando}
                                    style={{ marginRight: 10 }}>
                                    Gravar
                                </Button>

                                <Button
                                    tipo="button"
                                    class="secondary"
                                    desabilitado={gravando}
                                    onClick={() => { navegador('/avaliacoes/aluno') }}>
                                    Voltar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
};

export default EditarAvaliacaoAluno;