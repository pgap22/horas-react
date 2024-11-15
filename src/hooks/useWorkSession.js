import { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import useClipboard from './useClipboard';

const useWorkSession = () => {
  const [startTime, setStartTime] = useLocalStorage('StartWork', null);
  const [pauseTime, setPauseTime] = useLocalStorage('PauseWork', null);
  const [isSessionActive, setIsSessionActive] = useLocalStorage('SessionActive',false);
  const [totalHoursWorked, setTotalHoursWorked] = useLocalStorage('TotalHoursWorked', 0);
  const { copyToClipboard } = useClipboard();

  const startSession = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsSessionActive(true)
    setStartTime(timestamp);
    copyToClipboard(`Inicio Jornada ${timestamp}`);
  };

  const pauseSession = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hoursWorked = calculateHours(startTime, timestamp);
    setIsSessionActive(false)
    setPauseTime(timestamp);
    setTotalHoursWorked((prev) => prev + hoursWorked);
    copyToClipboard(`Pausa Jornada ${timestamp}`);
  };

  const resumeSession = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStartTime(timestamp);
    setIsSessionActive(true)
    copyToClipboard(`Reanudación Jornada ${timestamp}`);
  };

  const endSession = (todos) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const taskList = todos.map((todo, index) => `>${todo.task}`).join('\n\n');
    const clipboardText = `Fin Jornada ${timestamp}\n\n${taskList}`;
    const hoursWorked = calculateHours(startTime, timestamp);
    copyToClipboard(clipboardText);
    setIsSessionActive(false)
    setStartTime(null);
    setTotalHoursWorked((prev) => prev + hoursWorked);
  };

  const calculateHours = (start, end) => {
    const [startHours, startMinutes] = start.slice(0,5).split(':').map(Number);
    const [endHours, endMinutes] = end.slice(0,5).split(':').map(Number);
    return (endHours - startHours) + (endMinutes - startMinutes) / 60;
  };

  return { startSession, pauseSession, resumeSession, endSession, totalHoursWorked, isSessionActive};
};

export default useWorkSession;
