
import { useState } from "react";
import { TConfirmDialogProps } from "../types/TConfirmModal";
import Button from "./Button";

const ConfirmModal = ({ visivel, setVisivel, titulo, pergunta, acao } : TConfirmDialogProps) => {
    const [carregando, setCarregando] = useState(false);

    const handleConfim = async (event: Event) => {
        event.preventDefault();
        setCarregando(true);
        await acao();
        setCarregando(false);
        setVisivel(false);
    };

    return (
        <>
            {visivel && <div className="modal-backdrop fade show"></div>}
            <div
                className={`modal fade ${visivel ? 'show' : ''}`}
                style={{ display: visivel ? 'block' : 'none' }}
                id="confirmDialog"
                role="dialog"
                aria-labelledby="confirmDialogTitle"
                aria-hidden={!visivel}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">{titulo}</h5>
                            <button type="button" className="btn-close" onClick={() => setVisivel(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {pergunta}
                        </div>
                        <div className="modal-footer">
                            <Button 
                                tipo="button" 
                                titulo="Clique para voltar" 
                                desabilitado={carregando}
                                style={{ minWidth: '50px' }}
                                class="secondary"
                                onClick={(e : any) => { setVisivel(false); }}>
                                Não
                            </Button>
                            <Button 
                                tipo="button" 
                                titulo="Clique para confirmar a remoção" 
                                carregando={carregando}
                                style={{ minWidth: '50px' }}
                                class="primary"
                                onClick={(e : any) => { handleConfim(e)}}>
                                Sim
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;