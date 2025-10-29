import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  deletingIds?: Set<number>;
  onDelete?: (id: number) => Promise<void>;
  updatingIds?: Set<number>;
  onUpdate?: (id: number, data: Partial<Omit<Todo, 'id'>>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  onDelete,
  updatingIds,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const isBusy = deletingIds?.has(todo.id) ?? false;
          const isUpdating = updatingIds?.has(todo.id) ?? false;

          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                isBusy={isBusy}
                onDelete={onDelete}
                isUpdating={isUpdating}
                onUpdate={onUpdate}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
};
