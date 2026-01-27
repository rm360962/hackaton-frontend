import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { SessionContext } from '../sessionContext';
import { TRotaProtegidaProps } from '../types/TSession';

const ProtectedRoute = ({ children, permissoes } : TRotaProtegidaProps) => {
  const context = useContext(SessionContext);
  
  if (!context.sessao.token) {
    return <Navigate to="/login" replace />;
  }

  let permissaoAcesso = true;

  for(const permissao of permissoes) {
    const possuiPermissao = context.usuarioPossuiPermissao(permissao);

    if(!possuiPermissao) {
      permissaoAcesso = false;
    }
  }

  if(!permissaoAcesso) {
    return <Navigate to="/401" replace />
  }

  return children;
};

export default ProtectedRoute;
