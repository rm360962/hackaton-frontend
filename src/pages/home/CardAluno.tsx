import { FaClock, FaCheckCircle, FaStar, FaExclamationTriangle, FaGamepad } from 'react-icons/fa';
import { TCardAluno } from '../../types/TComponentProps';
import { useNavigate } from 'react-router-dom';

const CardAluno = ({ id, nome, dataLimite, dataExecucao, situacao, nota }: TCardAluno) => {
  const navegador = useNavigate();
  
  const getConfiguracaoCard = (status: string) => {
    switch (status) {
      case 'Pendente':
        return {
          tema: 'warning',
          icone: <FaExclamationTriangle className="mb-1" />,
          bgLight: '#fff3cd',
          borda: 'border-warning'
        };
      case 'Enviado para correção':
        return {
          tema: 'info',
          icone: <FaCheckCircle className="mb-1" />,
          bgLight: '#cff4fc',
          borda: 'border-info'
        };
      case 'Avaliado':
        return {
          tema: 'success',
          icone: <FaStar className="mb-1" />,
          bgLight: '#d1e7dd',
          borda: 'border-success'
        };
      default:
        return { tema: 'secondary', icone: <FaGamepad />, btnTexto: 'Ver', bgLight: '#fff', borda: '' };
    }
  };

  const config = getConfiguracaoCard(situacao);

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div
        className={`card h-100 shadow-sm ${config.borda}`}
        style={{
          borderWidth: '0px 0px 0px 5px',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className={`badge rounded-pill bg-${config.tema} text-dark bg-opacity-25 border border-${config.tema}`}>
              {config.icone} {situacao.toUpperCase()}
            </span>
            {situacao === 'Avaliado' && nota != null && (
              <div className="text-center bg-success text-white rounded p-1 px-2 shadow-sm">
                <small style={{ fontSize: '0.6rem', display: 'block' }}>NOTA</small>
                <span className="fw-bold h5 m-0">{nota}</span>
              </div>
            )}
          </div>
          <h5 className="card-title fw-bold text-dark mt-2">{nome}</h5>
          <div className="text-muted mb-3 small d-flex align-items-center">
            {situacao === 'Avaliado' || situacao === 'Enviado para correção' ? (
              <>
                <FaClock className="me-1" /> Executado em: <strong style={{ paddingLeft: 5 }}>{dataExecucao}</strong>
              </>
            ) : (
              <>
                <FaClock className="me-1" /> Entrega até: <strong style={{ paddingLeft: 5 }}>{dataLimite}</strong>
              </>
            )}
          </div>
          {(situacao === 'Avaliada' && nota) && (
            <div className="progress mb-3" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${(nota / 10) * 100}%` }}
              ></div>
            </div>
          )}
          <div className="mt-auto">
            <button 
              className={`btn btn-outline-${config.tema} w-100 fw-bold rounded-pill`}
              type="button"
              onClick={() => navegador(`/avaliacoes/aluno/visualizar/${id}`)}>
              Visualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CardAluno;