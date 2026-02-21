import { FormEvent, useContext, useState } from 'react';
import Input from '../../components/Input.tsx';
import Button from '../../components/Button.tsx';
import { LoginService } from '../../service/login.service.js';
import { TipoAlerta } from '../../types/TComponentProps.ts';
import { useNavigate } from "react-router-dom";
import { SessionContext } from '../../sessionContext.ts';

const Login = () => {
	const [usuario, setUsuario] = useState("");
	const [senha, setSenha] = useState("");
	const [carregando, setCarregando] = useState(false);
	const navegador = useNavigate();
	const context = useContext(SessionContext);
	const loginService = new LoginService();
	
	const logarUsuario = async (event: FormEvent) => {
		event.preventDefault();

		const form = document.getElementById('formLogin') as HTMLFormElement;

		if (!form.checkValidity()) {
			form.classList.add('was-validated')
			return;
		}

		setCarregando(true);

		const { erro, usuarioLogado, tokenJwt } = await loginService.logarUsuario({
			usuario,
			senha
		});

		setCarregando(false);

		if (erro) {
			context.adcionarAlerta({
				tipo: TipoAlerta.Erro,
				mensagem: erro,
			});
			return;
		}

		localStorage.setItem('token', tokenJwt);

		const dataAtualSegundos = Math.floor(Date.now() / 1000);
        const umaHoraSegundos = 7200;

		context.setSessao?.({
			usuarioLogado: usuarioLogado,
			token: tokenJwt,
			expiracao: dataAtualSegundos + umaHoraSegundos
		});

		navegador('/')
	};

	return (
		<div className='conteiner d-flex justify-content-center align-items-center h-100'>
			<div className='row border rounded-3 p-4 bg-white'>
				<div className='d-flex justify-content-center mb-3' >
					<p className='h4 font-weight-bold'>Educa</p>
				</div>
				<form id="formLogin" noValidate onSubmit={(e) => logarUsuario(e)}>
					<div className='form-group mb-1'>
						<label className='fw-semibold'>Usuário </label>
						<Input
							placeholder="Informe o usuário"
							titulo="Informe o usuário para acesso ao sistema"
							valor={usuario}
							onChange={(e : any) => setUsuario(e.target.value)}
							obrigatorio={true}
						/>
						<div className="invalid-feedback">
							O usuário é obrigatório.
						</div>
					</div>
					<div className='form-group mb-3'>
						<label className='fw-semibold'>Senha </label>
						<Input
							placeholder="Informe a senha"
							titulo="Informe a senha"
							tipo="password"
							valor={senha}
							onChange={(e : any) => setSenha(e.target.value)}
							obrigatorio={true}
						/>
						<div className="invalid-feedback">
							A senha deve ser informada.
						</div>
					</div>
					<div className='d-flex justify-content-center'>
						<Button 
							titulo="Precione para entrar no sistema"
							class="primary" 
							carregando={carregando}>Entrar</Button>
					</div>
				</form>
			</div>
		</div>
	)
};

export default Login;