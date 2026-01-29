import CarouselCards from '../components/CardCarousel.tsx';
import Header from '../components/Header.tsx';

const Home = () => {
	const noticias = [
        { titulo: 'Notícia 1', conteudo: 'Resumo da notícia 1...' },
        { titulo: 'Notícia 2', conteudo: 'Resumo da notícia 2...' },
        { titulo: 'Notícia 3', conteudo: 'Resumo da notícia 3...' },
        { titulo: 'Notícia 4', conteudo: 'Resumo da notícia 4...' },
        { titulo: 'Notícia 5', conteudo: 'Resumo da notícia 5...' },
        { titulo: 'Notícia 6', conteudo: 'Resumo da notícia 6...' },
    ];
	const planosDeEstudo = [
        { titulo: 'Matematica basica', conteudo: 'Conteudo do primeiro bimestre' },
        { titulo: 'Programação I', conteudo: 'Introdução a programação' },
    ];

	const planoDeEstudoFinalizados = [
		{ titulo: 'Programação básica', conteudo: 'Conteudo do primeiro bimestre' },
	];
	return (
		<>
			<Header />
			<div style={{ backgroundColor: 'white', margin: 10}}>
				<fieldset className="border p-2" style={{ margin: 10 }}>
					<legend className="float-none w-auto p-2" style={{ color: 'black', fontSize: 18 }}>Noticias</legend>
					<CarouselCards id="primeiro" items={noticias}></CarouselCards>
				</fieldset>
			</div>

			<div style={{ backgroundColor: 'white' }}>
				<fieldset className="border p-2" style={{ margin: 10 }}>
					<legend className="float-none w-auto p-2" style={{ color: 'black', fontSize: 18 }}>Planos de estudo</legend>
					<CarouselCards id="primeiro" items={planosDeEstudo}></CarouselCards>
				</fieldset>
			</div>

			<div style={{ backgroundColor: 'white' }}>
				<fieldset className="border p-2" style={{ margin: 10 }}>
					<legend className="float-none w-auto p-2" style={{ color: 'black', fontSize: 18 }}>Plano de estudo finalizados</legend>
					<CarouselCards id="primeiro" items={planoDeEstudoFinalizados}></CarouselCards>
				</fieldset>
			</div>
		</>
	)
};

export default Home;