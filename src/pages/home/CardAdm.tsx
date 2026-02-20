import {
    BsClockHistory,
    BsPlayCircle,
    BsExclamationOctagon,
    BsClipboardCheck
} from 'react-icons/bs';
import { TCardAdm } from '../../types/TComponentProps';
import { useNavigate } from 'react-router-dom';

const CardAdm = ({ quantidade, tipo }: TCardAdm) => {
    const navegador = useNavigate();

    const getConfiguracaoCard = (tipo: string) => {
        switch (tipo) {
            case 'Pendente':
                return {
                    icon: <BsClockHistory size={48} />,
                    textColor: 'text-warning',
                    borderColor: 'border-warning',
                    btnClass: 'btn-outline-warning',
                    situacaoId: 0
                };
            case 'Em execução':
                return {
                    icon: <BsPlayCircle size={48} />,
                    textColor: 'text-primary',
                    borderColor: 'border-primary',
                    btnClass: 'btn-outline-primary',
                    situacaoId: 1
                };
            case 'Enviado para correção':
                return {
                    icon: <BsClipboardCheck size={48} />,
                    textColor: 'text-success',
                    borderColor: 'border-success',
                    btnClass: 'btn-outline-success',
                    situacaoId: 2
                };
            case 'Não respondido':
                return {
                    icon: <BsExclamationOctagon size={48} />,
                    textColor: 'text-danger',
                    borderColor: 'border-danger',
                    btnClass: 'btn-outline-danger',
                    situacaoId: 4
                };
            default:
                return {
                    icon: <BsClockHistory size={48} />,
                    textColor: 'text-secondary',
                    borderColor: 'border-secondary',
                    btnClass: 'btn-outline-secondary',
                    situacaoId: 0
                };
        }
    };

    const configuracao = getConfiguracaoCard(tipo);

    return (
        <>
            <div className="col-12 col-md-6 col-lg-4 mb-4">
                <div className={`card h-100 shadow-sm border-2 ${configuracao.borderColor}`}>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                        <div className={`${configuracao.textColor} mb-3`}>
                            {configuracao.icon}
                        </div>
                        <h2 className="card-title display-5 fw-bold text-dark mb-2">
                            {quantidade}
                        </h2>
                        <h6 className="card-subtitle text-muted text-uppercase fw-semibold mb-4">
                            {tipo}
                        </h6>
                        <button 
                            className={`btn w-100 mt-auto fw-bold ${configuracao.btnClass}`}
                            type="button"
                            onClick={() => navegador(`/avaliacoes/aluno?situacao=${configuracao.situacaoId}`)}>
                            Clique para ver todos
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardAdm;