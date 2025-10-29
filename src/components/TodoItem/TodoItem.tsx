/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isBusy?: boolean;
  onDelete?: (id: number) => Promise<void>;
  isUpdating?: boolean;
  onUpdate?: (id: number, data: Partial<Omit<Todo, 'id'>>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isBusy,
  onDelete,
  isUpdating,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = async (event?: React.FormEvent) => {
    event?.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      if (!trimmedTitle) {
        await onDelete?.(todo.id);
      } else {
        await onUpdate?.(todo.id, { title: trimmedTitle });
      }

      setIsEditing(false);
    } catch {}
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed, editing: isEditing })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate?.(todo.id, { completed: !todo.completed })}
          disabled={isBusy || isUpdating}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSave}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleSave}
            onKeyUp={handleKeyUp}
            disabled={isUpdating}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
            disabled={isBusy || isUpdating}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isBusy || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
