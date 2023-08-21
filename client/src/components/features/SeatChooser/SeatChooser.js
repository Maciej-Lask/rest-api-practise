import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Progress, Alert } from 'reactstrap';
import {
  getSeats,
  loadSeatsRequest,
  getRequests,
} from '../../../redux/seatsRedux';
import './SeatChooser.scss';

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const dispatch = useDispatch();
  const seats = useSelector(getSeats);
  const requests = useSelector(getRequests);

  // Function to load seats and set an interval to reload every two minutes
  const loadSeatsAndSetInterval = () => {
    dispatch(loadSeatsRequest());
  };

  useEffect(() => {
    loadSeatsAndSetInterval(); // Initial load of seats

    // Load seats again if chosenSeat and chosenDay change
    if (chosenSeat && chosenDay) {
      loadSeatsAndSetInterval();
    }
    // Set an interval to load seats every two minutes (120,000 milliseconds)
    const intervalId = setInterval(() => {
      loadSeatsAndSetInterval();
    }, 120000);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };

  }, [dispatch, chosenDay, chosenSeat]);

  const isTaken = (seatId) => {
    return seats.some((item) => item.seat === seatId && item.day === chosenDay);
  };

  const prepareSeat = (seatId) => {
    if (seatId === chosenSeat)
      return (
        <Button key={seatId} className="seats__seat" color="primary">
          {seatId}
        </Button>
      );
    else if (isTaken(seatId))
      return (
        <Button key={seatId} className="seats__seat" disabled color="secondary">
          {seatId}
        </Button>
      );
    else
      return (
        <Button
          key={seatId}
          color="primary"
          className="seats__seat"
          outline
          onClick={(e) => updateSeat(e, seatId)}
        >
          {seatId}
        </Button>
      );
  };

  return (
    <div>
      <h3>Pick a seat</h3>
      <small id="pickHelp" className="form-text text-muted ml-2">
        <Button color="secondary" /> – seat is already taken
      </small>
      <small id="pickHelpTwo" className="form-text text-muted ml-2 mb-4">
        <Button outline color="primary" /> – it's empty
      </small>
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].success && (
        <div className="seats">
          {[...Array(50)].map((x, i) => prepareSeat(i + 1))}
        </div>
      )}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending && (
        <Progress animated color="primary" value={50} />
      )}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error && (
        <Alert color="warning">Couldn't load seats...</Alert>
      )}
    </div>
  );
};

export default SeatChooser;
