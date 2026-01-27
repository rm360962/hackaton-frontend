import { TInputProps } from "../types/TInput";

const Input = (props : TInputProps) => {
	return (
		<input className='form-control' 
		type={props.tipo ?? 'text'}
		value={props.valor}
		onChange={(e) => { props.onChange(e) }}
		placeholder={props.placeholder}
		title={props.titulo} 
		required={props.obrigatorio}
		disabled={props.desabilitado}
		style={props.style}
		/>

	);
};

export default Input;