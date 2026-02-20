import iconeLogout from '../assets/logout.svg';
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../sessionContext";
import { TSession } from "../types/TSession";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const [tempoSessaoRestante, setTempoSessaoRestante] = useState(0);
    const [permissaoAdminstrativa, setPermissaoAdminstrativa] = useState(false);
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const contexto = useContext(SessionContext);
    const navigator = useNavigate();

    const deslogarUsuario = () => {
        localStorage.removeItem('token');
        contexto.sessao = {} as TSession;
        navigator('/login');
    };

    useEffect(() => {
        const nomeCategoria = contexto.sessao.usuarioLogado.categoria.nome;

        setPermissaoAdminstrativa(nomeCategoria === 'Professor' || nomeCategoria === 'Administrador');

        const atualizarTimer = () => {
            const tempoRestanteMs = (contexto.sessao.expiracao * 1000) - Date.now();

            tempoRestanteMs <= 0 ? deslogarUsuario() : setTempoSessaoRestante(tempoRestanteMs);
        };

        atualizarTimer();

        const intervalId = setInterval(atualizarTimer, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);


    const minutos = Math.floor((Math.max(0, tempoSessaoRestante) / 1000 / 60) % 60).toString().padStart(2, '0');
    const segundos = Math.floor((Math.max(0, tempoSessaoRestante) / 1000) % 60).toString().padStart(2, '0');

    return (
        <nav className="navbar navbar-expand-md" style={{ backgroundColor: 'lightblue', paddingBottom: '0', paddingTop: '0', marginBottom: '15px' }}>
            <Link to="/postagens" className="navbar-brand p-2" style={{ letterSpacing: '1.5px', fontWeight: '600' }}>Blog Educa</Link>
            <button
                className="navbar-toggler ms-1"
                type="button"
                data-toggle="collapse"
                data-target="#menu"
                aria-controls="menu"
                aria-expanded={mostrarMenu}
                onClick={() => { setMostrarMenu(!mostrarMenu); }}>
                <span className="navbar-toggler-icon"></span>
            </button>

            <div id="menu" className={`collapse navbar-collapse ${mostrarMenu ? 'show' : ''}`}>
                <ul className="navbar-nav me-auto">
                    <li className="nav-item active">
                        <Link to="/" className="nav-link">Página inicial</Link>
                    </li>
                    {permissaoAdminstrativa && (
                        <>
                            <li className="nav-item">
                                <Link to="/usuarios" className="nav-link">Usuários</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/avaliacoes" className="nav-link">Avaliações</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/conteudos" className="nav-link">Conteúdos</Link>
                            </li>
                        </>
                    )}
                    <li className="nav-item">
                        <Link to="/avaliacoes/aluno" className="nav-link">{permissaoAdminstrativa ? 'Avaliações alunos' : 'Minhas avaliações'}</Link>
                    </li>
                </ul>
                <span className="navbar-text d-flex">
                    <div style={{ fontSize: '14px' }}>
                        <p style={{ marginBottom: '0', fontWeight: '700' }}>Olá, {contexto.sessao?.usuarioLogado.nome}.</p>
                        <p style={{ marginBottom: '0', fontWeight: '700' }}>Sua sessão expira em {minutos}:{segundos}</p>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center ps-4 pe-2">
                        <img src={iconeLogout}
                            style={{ width: '25px', height: '25px', cursor: 'pointer', paddingLeft: '5px' }}
                            title="Clique para sair do sistema" onClick={() => { deslogarUsuario(); }} />
                    </div>
                </span>
            </div>
        </nav>
    )
};

export default Header;