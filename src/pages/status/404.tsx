import { Link } from 'react-router-dom';

const PaginaNaoEncontrada = () => {
	return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="lead">
                    A página que você está procurando não existe.
                </p>
                <Link to="/" className="btn btn-primary">Voltar para o início</Link>
            </div>
        </div>
    );
};

export default PaginaNaoEncontrada;
