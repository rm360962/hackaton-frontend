interface CardData {
    titulo: string;
    conteudo: string;
}

interface CarouselCardsProps {
    id: string;
    items: CardData[];
}

const CarouselCards = ({ id, items }: CarouselCardsProps) => {
    const dividirArray = (array: CardData[], size: number) => {
        const resultado = [];
        for (let i = 0; i < array.length; i += size) {
            resultado.push(array.slice(i, i + size));
        }
        return resultado;
    };

    const slides = dividirArray(items, 3);

    return (
        <div id={id} className="carousel slide" data-bs-ride="false">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div className="carousel-inner" style={{ width: '85%'}}>
                    {slides.map((grupoDeCards, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <div className="row">
                                {grupoDeCards.map((card, cardIndex) => (
                                    <div key={cardIndex} className="col-md-4 mb-3">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h5 className="card-title">{card.titulo}</h5>
                                                <p className="card-text">{card.conteudo}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {slides.length > 1 && (
                <>
                    <button 
                        className="carousel-control-prev" 
                        type="button" 
                        data-bs-target={`#${id}`} 
                        data-bs-slide="prev"
                        style={{ width: '5%', left: 0}}>
                        <span className="carousel-control-prev-icon bg-dark rounded-circle" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>
                    <button 
                        className="carousel-control-next" 
                        type="button" 
                        data-bs-target={`#${id}`} 
                        data-bs-slide="next"
                        style={{ width: '5%', right: 0}}>
                        <span className="carousel-control-next-icon bg-dark rounded-circle" aria-hidden="true"></span>
                        <span className="visually-hidden">Próximo</span>
                    </button>
                </>
            )}
        </div>
    );
};

export default CarouselCards;