import { useEffect, useState } from "react";
import { TAlertProps } from "../types/TComponentProps";

const Alert = (props: TAlertProps) => {
    const [visivel, setVisivel] = useState(true);
    const [opacidade, setOpacidade] = useState(1);
    const className = `alert alert-${props.tipo}`;

    useEffect(() => {
        let alertaRemovido = false;

        const alterarOpacidadeTimeout = setTimeout(() => {
            setOpacidade(0);
        }, 3400);

        const removerAlertaTimeout = setTimeout(() => {
            if (!alertaRemovido) {
                setVisivel(false);
                props.removerAlerta?.(props);
                alertaRemovido = true;
            }
        }, 4000);

        return () => {
            clearTimeout(alterarOpacidadeTimeout);
            clearTimeout(removerAlertaTimeout);
        }
    }, []);

    return (
        <>
            {visivel && (
                <div 
                    className={className} 
                    style={{  minWidth: '200px', opacity: opacidade, transition: 'opacity 0.6s' }} 
                    role="alert">
                    {props.mensagem}
                </div>
            )}
        </>
    )
};

export default Alert;