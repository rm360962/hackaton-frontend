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
    obrigatorio?: boolean
};