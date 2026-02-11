import { Link } from 'react-router-dom';

const AcessoNaoPermitido = () => {
	return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h1 className="display-1 fw-bold">401</h1>
                <p className="lead">
                    Você não possui permissão para acesso a página
                </p>
                <Link to="/" className="btn btn-primary">Voltar para o início</Link>
            </div>
        </div>
    );
};

export default AcessoNaoPermitido;
