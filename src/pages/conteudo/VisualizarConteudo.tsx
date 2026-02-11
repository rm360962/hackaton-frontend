import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SessionContext } from "../../sessionContext";
import { TipoAlerta } from "../../types/TComponentProps";
import { ConteudoService } from "../../service/conteudo.service";
import { TConteudo } from "../../types/TConteudo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import MDEditor from "@uiw/react-md-editor";

const VisualizarConteudo = () => {
    const [conteudo, setConteudo] = useState({} as TConteudo);
    const conteudoService = new ConteudoService();
    const contexto = useContext(SessionContext);
    const navigator = useNavigate();
    const { id: idConteudo } = useParams();

    const buscarConteudo = async () => {
        if (idConteudo && idConteudo !== 'null') {
            const { erro, conteudo } = await conteudoService.buscarConteudoPorId(+idConteudo);

            if (erro) {
                contexto.adcionarAlerta({
                    tipo: TipoAlerta.Erro,
                    mensagem: erro,
                });
                return;
            }

            setConteudo(conteudo);
        }
    };

    useEffect(() => {
        buscarConteudo();
    }, []);

    return (
        <>
            <Header />
            <div className="conteiner-fluid" style={{ height: '700px', overflowY: 'scroll' }}>
                <div className="d-flex align-items-center justify-content-center flex-column">
                    <div className="p-3 w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                        <div className="w-100 d-flex justify-content-between">
                            <p className="bold" style={{ fontSize: '13px', padding: 10 }}>{conteudo.usuarioInclusao} - {conteudo.dataInclusao}</p>
                            <Button class="secondary" style={{ marginRight: 10 }} onClick={() => { navigator('/conteudos') }}>Voltar</Button>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p className="h3" style={{ letterSpacing: '1px' }}>{conteudo.titulo}</p>
                        </div>
                        <div style={{ width: '90%', padding: 15, borderRadius: '10px' }}>
                            <MDEditor.Markdown source={conteudo.texto} style={{ padding: 20 }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VisualizarConteudo;