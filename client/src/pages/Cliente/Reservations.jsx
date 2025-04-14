import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/Reservations.css';

const sampleTours = [
  {
    id: 1,
    title: "Paseo a Caballo en Senderos Naturales",
    description: "Recorre paisajes únicos a lomos de un caballo, acompañado por guías expertos. (100$ cada 15 minutos)",
    image: "/assets/img/e2.jpeg",
    price: 100
  },
  {
    id: 2,
    title: "Exploración de Cuevas Subterráneas",
    description: "Aventura guiada a través de impresionantes formaciones rocosas bajo tierra. (100$ para los niños)",
    image: "/assets/img/e1.jpeg",
    price: 300
  },
  {
    id: 3,
    title: "Paseo por el Laberinto Natural",
    description: "Descubre caminos ocultos y retos divertidos en un laberinto rodeado de vegetación.",
    image: "/assets/img/e3.jpeg",
    price: 400
  }
];

const Reservations = () => {
  const [selectedTour, setSelectedTour] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservationMessage, setReservationMessage] = useState('');

  const handleReserve = (tour) => {
    setSelectedTour(tour);
    setReservationMessage('');
  };

  const confirmReservation = () => {
    const formattedDate = selectedDate.toLocaleDateString('es-ES');
    setReservationMessage(
      `¡Reservaste ${quantity} boleto(s) para "${selectedTour.title}" el día ${formattedDate}!`
    );
    setSelectedTour(null);
    setQuantity(1);
  };

  return (
    <div className="reservations-container">
      <h2>Explora nuestras excursiones disponibles</h2>

      <div className="tours-grid">
        {sampleTours.map((tour) => (
          <div key={tour.id} className="tour-card">
            <img src={tour.image} alt={tour.title} />
            <h3>{tour.title}</h3>
            <p>{tour.description}</p>
            <p><strong>Precio:</strong> ${tour.price}</p>
            <button onClick={() => handleReserve(tour)}>Reservar</button>
          </div>
        ))}
      </div>

      {selectedTour && (
        <div className="reservation-form">
          <h3>Reservar: {selectedTour.title}</h3>

          <label>Selecciona la fecha:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona una fecha"
          />

          <label>Cantidad de boletos:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button onClick={confirmReservation}>Confirmar Reserva</button>
        </div>
      )}

      {reservationMessage && (
        <p className="reservation-message">{reservationMessage}</p>
      )}
    </div>
  );
};

export default Reservations;
