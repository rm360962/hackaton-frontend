import { useContext, useEffect, useState } from "react"
import Button from "../../components/Button"
import { useNavigate } from "react-router-dom";
import CardAdm from "./CardAdm";
import { AvaliacaoAlunoService } from "../../service/avaliacaoUsuario.service";
import { SessionContext } from "../../sessionContext";
import { TipoAlerta } from "../../types/TComponentProps";

const HomeAdm = () => {
    const [metricas, setMetricas] = useState({} as any);
    const avaliacaoAlunoService = new AvaliacaoAlunoService();
    const contexto = useContext(SessionContext);
    const navegador = useNavigate();
    
    useEffect(() => {
        buscarMetricas();
    }, []);

    const buscarMetricas = async () => {
        const { erro, metricas } = await avaliacaoAlunoService.buscarMetricasProfessor();
        console.log(metricas);
        if (erro) {
            contexto.adcionarAlerta({
                tipo: TipoAlerta.Erro,
                mensagem: erro
            });
            return;
        }

        setMetricas(metricas);
    };

    return (
        <>
            <div className="d-flex align-items-center justify-content-center">
                <div style={{ width: '80%', backgroundColor: 'white', padding: 15 }}>
                    <fieldset className="border p-2">
                        <legend className="float-none w-auto" style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '1px' }}>
                            Acompanhamento de avaliações
                        </legend>
                        <div>
                            <div className="row">
                                <CardAdm quantidade={metricas.qtdPendentes} tipo="Pendente" />
                                <CardAdm quantidade={metricas.qtdEmExecucao} tipo="Em execução" />
                                <CardAdm quantidade={metricas.qtdEnviadoCorrecao} tipo="Enviado para correção" />
                                <CardAdm quantidade={metricas.qtdNaoRespondido} tipo="Não respondido" />
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </>
    )
}

export default HomeAdm;