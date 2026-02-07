import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../../sessionContext.ts';
import { TipoAlerta } from '../../types/TComponentProps.ts';
import { useNavigate } from 'react-router-dom';
import { UsuarioService } from '../../service/usuario.service.ts';
import { TSelectItem } from '../../types/TComponentProps.ts';
import { TBuscaConteudo, TConteudo } from '../../types/TConteudo.ts';
import { ConteudoService } from '../../service/conteudo.service.ts';
import Header from '../../components/Header.tsx';
import Input from '../../components/Input.tsx';
import SearchFilter from '../../components/SearchFilter.tsx';
import Select from '../../components/Select.tsx';
import ConfirmModal from '../../components/ConfirmModal.tsx';
import Button from '../../components/Button.tsx';

const Conteudo = () => {
	const filtrosBuscaInicial : TBuscaConteudo = {
		id: '',
		titulo: '',
		descricao: '',
		usuarioId: '',
		dataInclusaoInicio: '',
		dataInclusaoFim: ''
	};
	
	const [filtrosBusca, setFiltrosBusca] = useState(filtrosBuscaInicial);
	const [conteudos, setConteudos] = useState([] as TConteudo[]);
	const [conteudo, setConteudo] = useState({} as TConteudo);
	const [idRemocao, setIdRemocao] = useState<number | null>(null);
	const [professores, setProfessores] = useState([] as TSelectItem[]);

	const [visualizar, setVisualizar] = useState(false);
	const [remover, setRemover] = useState(false);

	const conteudoService = new ConteudoService();
	const usuarioService = new UsuarioService();
	const context = useContext(SessionContext);
	const navigator = useNavigate();

	useEffect(() => {
		pesquisar();
		buscarProfessores();
	}, []);
	
	const pesquisar = async () => {
		const { erro, conteudos } = await conteudoService.buscarConteudos(filtrosBusca);

		if (erro) {
			context.adcionarAlerta({
				tipo: TipoAlerta.Erro,
				mensagem: erro
			});

			return;
		}
	
		if(conteudos.length === 0) {
			context.adcionarAlerta({
				tipo: TipoAlerta.Info,
				mensagem: 'Não foi encontrado conteúdo com os filtros informados'
			});
		}

		setConteudos(conteudos);
	};

	const buscarProfessores = async () => {
		const { erro, usuarios: professores } = await usuarioService.buscarProfessores();

		if (erro) {
			context.adcionarAlerta({
				tipo: TipoAlerta.Erro,
				mensagem: erro
			});

			return;
		}

		const professoresSelectItem : TSelectItem[] = [];
		professores.map((item) => {
			professoresSelectItem.push({
				label: item.nome,
				valor: item.id
			});
		});

		setProfessores(professoresSelectItem);
	};

	const limparFiltros = () => {
		setFiltrosBusca(filtrosBuscaInicial);
	};

	const confirmarRemocaoPostagem = (id: number) => {
		setIdRemocao(id);
		setRemover(true);
	};

	const removerConteudo = async () => {
		if(!idRemocao) return;

		const conteudoRemovido = await conteudoService.removerConteudo(idRemocao);

		context.adcionarAlerta({
			tipo: conteudoRemovido ? TipoAlerta.Sucesso : TipoAlerta.Erro,
			mensagem: conteudoRemovido ? 'Conteúdo removido com sucesso' : 'Erro ao remover o conteúdo',
		});

		if (conteudoRemovido) {
			await pesquisar();
		}
	};

	const visualizarConteudo = (id: number) => {
		navigator(`/conteudos/visualizar/${id}`);
	};

	const editarConteudo = (id: number) => {
		navigator(`/postagens/editar/${id}`)
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
							onChange={(e: any) => { setFiltrosBusca({ ...filtrosBusca, id: e.target.value}); }} />
					</div>
					<div className='form-group mb-3'>
						<label className='fw-semibold'>Título</label>
						<Input
							titulo="Preencha com título a ser buscado"
							placeholder="Título do conteúdo"
							valor={filtrosBusca.titulo}
							obrigatorio={false}
							onChange={(e: any) => { setFiltrosBusca({ ...filtrosBusca, titulo: e.target.value}); }} />
					</div>
					<div className='form-group mb-3'>
						<label className='fw-semibold'>Descrição</label>
						<Input
							titulo="Preencha com a descrição do conteúdo"
							placeholder="Descrição do conteúdo"
							valor={filtrosBusca.descricao}
							obrigatorio={false}
							onChange={(e: any) => { setFiltrosBusca({ ...filtrosBusca, descricao: e.target.value}); }} />
					</div>
					<div className='form-group mb-3'>
						<label className='fw-semibold'>Professor</label>
						<Select
							valor={filtrosBusca.usuarioId}
							titulo="Selecione o professor a ser buscado"
							mensagemPadrao="Selecione o professor"
							itens={professores}
							onChange={(e: any) => { setFiltrosBusca({ ...filtrosBusca, usuarioId: e.target.value}); }} />
					</div>
					<div className='form-group mb-4'>
						<label className='fw-semibold'>Período</label>
						<Input
							titulo="Selecione a data inicial da criação do conteúdo a ser buscado"
							tipo="date"
							valor={filtrosBusca.dataInclusaoInicio}
							obrigatorio={false}
							onChange={(e: any) => { setFiltrosBusca({ ...filtrosBusca, dataInclusaoInicio: e.target.value}); }} />
						<label className='fw-semibold' style={{ width: '100%', textAlign: 'center' }}>até</label>
						<Input
							titulo="Selecione a data final da criação do conteúdo a ser buscado"
							tipo="date"
							valor={filtrosBusca.dataInclusaoFim}
							obrigatorio={false}
							onChange={(e: any) => { setFiltrosBusca({ ...filtrosBusca, dataInclusaoFim: e.target.value}); }} />
					</div>
				</SearchFilter>
				<div className="container-fluid" style={{ paddingLeft: '0' , height: '700px', overflowY: 'scroll'}}>
					<div className='d-flex align-items-center justify-content-between'>
						<p className="h5 ps-4 fw-semibold" style={{ letterSpacing: '1px' }}>&#128240; Postagens encontradas</p>
						{ context.usuarioPossuiPermissao('cadastrar_conteudo') && (
							<Button tipo='button' class='primary' onClick={(e: any) => { navigator('/conteudo/editar/null')}}>Novo conteúdo</Button>
						)}
					</div>
					<div className="row g-1">
						
					</div>
				</div>
				<ConfirmModal
					titulo="Remover conteúdo"
					pergunta="Confirma a remoção do conteudo?"
					visivel={remover}
					setVisivel={setRemover}
					acao={removerConteudo}
				/>
			</div>
		</>
	)
};

export default Conteudo;