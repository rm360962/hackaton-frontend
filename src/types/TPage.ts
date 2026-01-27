import { TSession } from "./TSession";

export type TPageProps = {
    sessao: TSession,
    setSessao?: Function,
    adcionarAlerta: Function,
};