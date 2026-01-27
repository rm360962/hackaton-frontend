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