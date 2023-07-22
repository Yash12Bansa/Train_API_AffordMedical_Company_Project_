import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

const url = 'http://127.0.0.1:3001'; // Replace with your backend API URL

const Listoftrain = () => {
  const [train, settrain] = useState([]);

  useEffect(() => {
    trainfetchscore();
  }, []);

  const trainfetchscore = async () => {
    try {
      const response = await axios.get(`${url}/train`);
      settrain(response.data);
    } catch (e) {
      console.error('Error fetching train data:', e.message);
    }
  };

  return (
    <div>
      <h2>Whole Trains</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Train Name:</TableCell>
            <TableCell>Number of Train:</TableCell>
            <TableCell>Time of Departure:</TableCell>
            <TableCell>Available_Seat (Sleeper):</TableCell>
            <TableCell>Available_Seat (AC):</TableCell>
            <TableCell>Amount Pay (Sleeper):</TableCell>
            <TableCell>Amount Pay (AC):</TableCell>
            <TableCell>Delayed By (Minutes)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {train.map((train) => (
            <TableRow key={train.trainNumber}>
              <TableCell>{train.trainName}</TableCell>
              <TableCell>{train.trainNumber}</TableCell>
              <TableCell>{`${train.departureTime.Hours}:${train.departureTime.Minutes}:${train.departureTime.Seconds}`}</TableCell>
              <TableCell>{train.seatsAvailable.sleeper}</TableCell>
              <TableCell>{train.seatsAvailable.AC}</TableCell>
              <TableCell>{train.price.sleeper}</TableCell>
              <TableCell>{train.price.AC}</TableCell>
              <TableCell>{train.delayedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Listoftrain />
    </div>
  );
};

export default App;
