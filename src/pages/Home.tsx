import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header.tsx';
import HomeAluno from './home/HomeAluno.tsx';
import HomeAdm from './home/HomeAdm.tsx';
import { SessionContext } from '../sessionContext.ts';

const Home = () => {
	const [permissaoAdminstrativa, setPermissaoAdminstrativa] = useState(false);
	const contexto = useContext(SessionContext);

	useEffect(() => {
		const nomeCategoria = contexto.sessao.usuarioLogado.categoria.nome;
		setPermissaoAdminstrativa(nomeCategoria === 'Professor' || nomeCategoria === 'Administrador');
	}, []);
	return (
		<>
			<Header />
			<div className="container-fluid" style={{ paddingLeft: '0', height: '700px', overflowY: 'scroll' }}>
				{permissaoAdminstrativa ? <HomeAdm/> : <HomeAluno/>}
			</div>
		</>
	)
};

export default Home;