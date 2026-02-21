import { useContext, useEffect, useState } from "react";
import { TCardConteudo } from "../../types/TConteudo";
import { SessionContext } from "../../sessionContext";
import { Link } from "react-router-dom";

const CardConteudo = ({ conteudo, visualizar, remover, editar} : TCardConteudo) => {
    const context = useContext(SessionContext);
    const [edicao, setEdicao] = useState(false);

    useEffect(() => {
        const permissao = context.usuarioPossuiPermissao('editar_conteudo');
        const visualizarAcoes = permissao && (visualizar != null || remover != null || editar != null);
        setEdicao(visualizarAcoes);
    }, []);

    return (
        <div className="card" style={{ width: '20rem' }}>
            <div className="card-body">
                <h5 className="card-title">{conteudo.id} - {conteudo.titulo}</h5>
                <p className="card-text" style={{ minHeight: '4rem' }}>{conteudo.descricao.length > 80 ? `${conteudo.descricao.substring(0, 80)}...` : conteudo.descricao}</p>
                <hr />
                <p className="mb-1"><strong className="fw-semibold">Postado pelo usuário {conteudo.usuario.nome}</strong></p>
                <p className="mb-1"><strong className="fw-semibold">Data de criação </strong> {conteudo.dataInclusao.replace(' ', ' as ')}</p>
                {edicao ? (<>
                    <hr />
                    <div className="row">
                        <div className="col d-flex flex-column justify-content-center">
                            <button 
                                style={{ border: 'none', backgroundColor: 'white', fontSize: '19px', padding: '0'}}
                                title="Clique para visualizar a conteudo completa"
                                onClick={() => {if(visualizar) visualizar(conteudo.id);}}>
                                &#128269;
                            </button>
                        </div>
                        <div className="col d-flex flex-column justify-content-center">
                            <button 
                                style={{ border: 'none', backgroundColor: 'white', fontSize: '19px', padding: '0'}}
                                title="Clique para editar a conteudo"
                                onClick={() => {if(editar) editar(conteudo.id)}}>
                                    &#128221;
                            </button>
                        </div>
                        <div className="col d-flex flex-column justify-content-center">
                            <button 
                                style={{ border: 'none', backgroundColor: 'white', fontSize: '19px', padding: '0'}}
                                title="Clique para remover a conteudo"
                                onClick={() => {if(remover) remover(conteudo.id);}}>
                                    &#10060;
                            </button>
                        </div>
                    </div>
                </>) : (
                    <Link to={`/conteudos/visualizar/${conteudo.id}`} className="nav-link" style={{ color: 'blue'}}>Continuar lendo</Link>
                )}
            </div>
        </div>
    );
};

export default CardConteudo;
