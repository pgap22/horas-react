import React from 'react';

export default function TodoItem({ todo, onDelete }) {
  return (
    <li className="flex justify-between items-center bg-gray-100 p-2 rounded">
      <span>{todo.task}</span>
      <span className="text-sm text-gray-500">{new Date(todo.timestamp).toLocaleString()}</span>
      <button onClick={() => onDelete(todo.id)} className="text-red-500">Eliminar</button>
    </li>
  );
}
