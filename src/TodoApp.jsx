// TodoApp.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocalStorage } from 'usehooks-ts';
import useWorkSession from './hooks/useWorkSession';
import TodoItem from './TodoItem';

export default function TodoApp() {
  const { register, handleSubmit, reset } = useForm();
  const [todos, setTodos] = useLocalStorage('todos', []);
  const { startSession, pauseSession, resumeSession, endSession, totalHoursWorked, isSessionActive } = useWorkSession();

  const addTodo = ({ task }) => {
    const newTodo = { task, timestamp: new Date().toISOString(), id: Date.now() };
    setTodos([...todos, newTodo]);
    reset();
  };

  const deleteTodo = (id) => setTodos(todos.filter((todo) => todo.id !== id));
  const clearTodos = () => setTodos([]);

  const handleEndSession = () => {
    endSession(todos);  // Pasamos las tareas al finalizar la jornada
    clearTodos();
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>

      <button className="bg-green-500 text-white px-4 py-2" onClick={startSession}>Iniciar Jornada</button>
      <button className="bg-yellow-500 text-white px-4 py-2" onClick={pauseSession} disabled={!isSessionActive}>Pausar</button>
      <button className="bg-blue-500 text-white px-4 py-2" onClick={resumeSession} disabled={isSessionActive}>Reanudar</button>
      <button className="bg-red-500 text-white px-4 py-2" onClick={handleEndSession}>Finalizar Jornada</button>

      <form onSubmit={handleSubmit(addTodo)} className="flex space-x-2 mt-4">
        <input
          {...register('task', { required: true })}
          className="border p-2 w-full"
          placeholder="Escribe una tarea..."
          disabled={!isSessionActive}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2" disabled={!isSessionActive}>
          Agregar
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} />
        ))}
      </ul>

      <p className="mt-4">Total Horas Trabajadas: {totalHoursWorked.toFixed(2)} hrs</p>
    </div>
  );
}
