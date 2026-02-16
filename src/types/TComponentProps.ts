import { ReactNode } from "react";

export type TButtonProps = {
    tipo?: 'submit' | 'reset' | 'button',
    titulo?: string,
    carregando?: boolean,
    desabilitado?: boolean,
    children: ReactNode,
    onClick?: Function,
    style?: any,
    class: string
};

export type TConfirmDialogProps = {
	visivel: boolean,
	setVisivel: Function,
	titulo: string,
	pergunta: string,
	acao: Function,
};

export type TInputProps = {
    tipo?: string,
    titulo: string,
    valor: string,
    placeholder?: string,
    obrigatorio: boolean,
    onChange: Function
    desabilitado?: boolean,
    style?: any,
    maxLength?: number
};

export type TSearchFilter = {
    children: ReactNode,
    pesquisar: Function,
    limpar: Function
};

export type TSelectItem = {
    valor: any,
    label: string,
};

export type TSelectProps = {
    valor: string,
    itens: TSelectItem[],
    onChange: Function,
    mensagemPadrao: string,
    titulo: string,
    obrigatorio?: boolean,
    desabilitado?: boolean,
    style?: any
};

export type TTextAreaProps = {
    valor: string,
    tamanhoMaximo?: number,
    onChange: Function,
    obrigatorio: boolean,
    style?: any
};

export enum TipoAlerta {
  Sucesso = "success",
  Erro = "danger",
  Info = "info"
}

export type TAlertProps = {
  id?: string,
  tipo: TipoAlerta,
  mensagem: string,
  removerAlerta?: Function,
};