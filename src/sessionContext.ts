import { createContext } from "react";
import { TSession } from './types/TSession';
import { TAlertProps } from './types/TAlert';

export const SessionContext = createContext({
    sessao: {} as TSession,
    setSessao: ((sessao : TSession) => {}),
    adcionarAlerta: ((alerta : TAlertProps) => {}),
    usuarioPossuiPermissao: ((permissao : string) : boolean => { return false; })
});