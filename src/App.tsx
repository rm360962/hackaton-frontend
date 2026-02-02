import Login from "./pages/login/Login.tsx";
import Home from "./pages/Home.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Alert from "./components/Alert.tsx";
import imagemFundo from './assets/bg-ia-generated.png';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { TAlertProps } from "./types/TAlert.ts";
import { TSession } from "./types/TSession.ts";
import { SessionContext } from "./sessionContext.ts";
import Usuario from "./pages/usuario/Usuario.tsx";
import EditarUsuario from "./pages/usuario/EditarUsuario.tsx";
import PaginaNaoEncontrada from "./pages/status/404.tsx";
import AcessoNaoPermitido from "./pages/status/401.tsx";
import Avaliacao from "./pages/avaliacao/Avaliacao.tsx";
import EditarAvaliacao from "./pages/avaliacao/EditarAvaliacao.tsx";

function App() {
  const [sessao, setSessao] = useState({} as TSession);
  const [alertas, setAlertas] = useState([] as TAlertProps[]);
  const [carregando, setCarregando] = useState(true);

  const style = {
    backgroundImage: `url(${imagemFundo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    padding: '0',
  };

  useEffect(() => {
    try {
      const tokenJwt = localStorage.getItem('token');

      if (tokenJwt == null || tokenJwt.length === 0) {
        return;
      }

      const payload = JSON.parse(atob(tokenJwt.split('.')[1]));
      const expiracao = payload.exp;
      const dataAtualSegundos = Date.now() / 1000;

      if (dataAtualSegundos < expiracao) {
        setSessao({
          usuarioLogado: {
            ...payload
          },
          token: tokenJwt,
          expiracao: expiracao,
        });
      }
    } catch (erro) {
      console.log("Erro ao decodificar o token:", erro);
    } finally {
      setCarregando(false);
    }
  }, []);

  const adcionarAlerta = (alerta: TAlertProps) => {
    alerta.id = Date.now().toString();
    setAlertas((prevAlertas) => [
      ...prevAlertas,
      alerta
    ]);
  };

  const removerAlerta = (alertaRemocao: TAlertProps) => {
    setAlertas((prevAlertas) => {
      const indiceAlerta = prevAlertas.findIndex((item) => item.id === alertaRemocao.id);
      const ultimoIndice = indiceAlerta === prevAlertas.length - 1;

      return ultimoIndice ? [] : prevAlertas;
    });
  };

  const usuarioPossuiPermissao = (permissao: string) => {
    const permissaoUsuario = sessao.usuarioLogado.categoria.permissoes.find(elemento => elemento === permissao);
    return permissaoUsuario != null;
  };

  if (carregando) {
    return (<></>)
  }
  
  return (
    <SessionContext.Provider value={{ sessao: sessao, setSessao: setSessao, adcionarAlerta: adcionarAlerta, usuarioPossuiPermissao: usuarioPossuiPermissao }}>
      <div className="container-fluid vh-100" style={style}>
        <div style={{ position: "absolute", top: 0, right: 0, padding: '10px', zIndex: '1051' }}>
          {alertas.map((item: TAlertProps, i: number) => {
            return (
              <Alert key={item.id} id={item.id} tipo={item.tipo} mensagem={item.mensagem} removerAlerta={removerAlerta} />
            )
          })}
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <Login />}
            />
             <Route path="/" element={
              <ProtectedRoute permissoes={['buscar_postagem']}>
                <Home />
              </ProtectedRoute>
             }
            />
            <Route path="/avaliacoes" element={
              <ProtectedRoute permissoes={['buscar_postagem']}>
                <Avaliacao />
              </ProtectedRoute>
             }
            />
            <Route path="/avaliacoes/editar/:id" element={
              <ProtectedRoute permissoes={['buscar_postagem']}>
                <EditarAvaliacao />
              </ProtectedRoute>
             }
            />
            <Route path="/usuarios" element={
              <ProtectedRoute permissoes={['buscar_usuario']}>
                <Usuario />
              </ProtectedRoute>}
            />
            <Route path="/usuarios/editar/:id" element={
              <ProtectedRoute permissoes={['cadastrar_usuario', 'editar_usuario']}>
                <EditarUsuario />
              </ProtectedRoute>}
            />
            <Route path="*" element={<PaginaNaoEncontrada />} />
            <Route path="/401" element={<AcessoNaoPermitido />} />
          </Routes>
        </BrowserRouter>
      </div>
    </SessionContext.Provider>
  );
};

export default App;
