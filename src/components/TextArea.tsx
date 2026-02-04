import { TTextAreaProps } from "../types/TComponentProps";

const TextArea = ({ valor, tamanhoMaximo, onChange, obrigatorio, style } : TTextAreaProps) => {
    return (
        <textarea 
            value={valor} 
            onChange={(e) => onChange(e)}
            maxLength={tamanhoMaximo} 
            className="form-control"
            style={{ minHeight: '175px', ...style}}
            required={obrigatorio}/>
    )
};

export default TextArea