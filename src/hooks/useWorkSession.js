import { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import useClipboard from './useClipboard';

const useWorkSession = () => {
  const [startTime, setStartTime] = useLocalStorage('StartWork', null);
  const [pauseTime, setPauseTime] = useLocalStorage('PauseWork', null);
  const [totalHoursWorked, setTotalHoursWorked] = useLocalStorage('TotalHoursWorked', 0);
  const { copyToClipboard } = useClipboard();

  const startSession = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStartTime(timestamp);
    copyToClipboard(`Inicio Jornada ${timestamp}`);
  };

  const pauseSession = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hoursWorked = calculateHours(startTime, timestamp);
    setPauseTime(timestamp);
    setTotalHoursWorked((prev) => prev + hoursWorked);
    copyToClipboard(`Pausa Jornada ${timestamp}`);
  };

  const resumeSession = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStartTime(timestamp);
    copyToClipboard(`Reanudación Jornada ${timestamp}`);
  };

  const endSession = (todos) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const taskList = todos.map((todo, index) => `>${todo.task}`).join('\n\n');
    const clipboardText = `Fin Jornada ${timestamp}\n\n${taskList}`;
    copyToClipboard(clipboardText);

    setStartTime(null);
    setTotalHoursWorked(0);
  };

  const calculateHours = (start, end) => {
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    return (endHours - startHours) + (endMinutes - startMinutes) / 60;
  };

  return { startSession, pauseSession, resumeSession, endSession, totalHoursWorked, isSessionActive: !!startTime };
};

export default useWorkSession;
