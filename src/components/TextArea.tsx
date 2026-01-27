import { TTextArea } from "../types/TTextArea";

const TextArea = ({ valor, tamanhoMaximo, onChange, obrigatorio, style } : TTextArea) => {
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