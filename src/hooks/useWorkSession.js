import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import useClipboard from './useClipboard';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const useWorkSession = () => {
  const [startTime, setStartTime] = useLocalStorage('StartWork', null);
  const [pauseTime, setPauseTime] = useLocalStorage('PauseWork', null);
  const [isSessionActive, setIsSessionActive] = useLocalStorage('SessionActive', false);
  const [totalHoursWorked, setTotalHoursWorked] = useLocalStorage('TotalHoursWorked', 0);
  const { copyToClipboard } = useClipboard();

  const startSession = () => {
    const timestamp = dayjs().toISOString();
    setIsSessionActive(true);
    setStartTime(timestamp);
    copyToClipboard(`Inicio Jornada ${dayjs(timestamp).format('h:mma')}`);
  };

  const pauseSession = () => {
    const timestamp = dayjs().toISOString();
    const hoursWorked = calculateHours(startTime, timestamp);
    setIsSessionActive(false);
    setPauseTime(timestamp);
    setTotalHoursWorked((prev) => prev + hoursWorked);
    copyToClipboard(`Pausa Jornada ${dayjs(timestamp).format('h:mma')}`);
  };

  const resumeSession = () => {
    const timestamp = dayjs().toISOString();
    setStartTime(timestamp);
    setIsSessionActive(true);
    copyToClipboard(`Reanudación Jornada ${dayjs(timestamp).format('h:mma')}`);
  };

  const endSession = (todos) => {
    const timestamp = dayjs().toISOString();
    const taskList = todos.map((todo, index) => `>${todo.task}`).join('\n\n');
    const clipboardText = `Fin Jornada ${dayjs(timestamp).format('h:mma')}\n\n${taskList}`;
    const hoursWorked = calculateHours(startTime, timestamp);
    copyToClipboard(clipboardText);
    setIsSessionActive(false);
    setStartTime(null);
    setTotalHoursWorked((prev) => prev + hoursWorked);
  };

const calculateHours = (start, end) => {
  if (!start || !end) return 0;
  
  const startMoment = dayjs(start);
  const endMoment = dayjs(end);

  const diffInSeconds = endMoment.diff(startMoment, 'seconds');
  const diffInMinutes = endMoment.diff(startMoment, 'minutes');
  const durationInHours = dayjs.duration(diffInSeconds, 'seconds').asHours();

  console.log(`Diferencia en segundos: ${diffInSeconds}s`);
  console.log(`Diferencia en minutos: ${diffInMinutes}m`);
  console.log(`Duración en horas: ${durationInHours}h`);

  return durationInHours;
};

  return {
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    totalHoursWorked,
    isSessionActive,
  };
};

export default useWorkSession;
