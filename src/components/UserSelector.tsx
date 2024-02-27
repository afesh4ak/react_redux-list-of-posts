import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getUsers } from '../api/users';
import { actions as usersActions } from '../features/usersSlice';
import { actions as authorActions } from '../features/authorSlice';
import { actions as commentsActions } from '../features/comment/commentSlice';
import { User } from '../types/User';

export const UserSelector = () => {
  const { author } = useAppSelector(state => state.author);
  const { users } = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getUsers()
      .then(usersFromServer => {
        dispatch(usersActions.set(usersFromServer));
      });
  }, [dispatch]);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    // we save a link to remove the listener later
    const handleDocumentClick = () => {
      // we close the Dropdown on any click (inside or outside)
      // So there is not need to check if we clicked inside the list
      setExpanded(false);
    };

    document.addEventListener('click', handleDocumentClick);

    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
    // we don't want to listening for outside clicks
    // when the Dopdown is closed
  }, [expanded]);

  const handleUserClick = (user: User) => {
    dispatch(authorActions.set(user));
    dispatch(commentsActions.set([]));
    setExpanded(false);
  };

  return (
    <div
      data-cy="UserSelector"
      className={classNames('dropdown', { 'is-active': expanded })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(current => !current);
          }}
        >
          <span>
            {author?.name || 'Choose a user'}
          </span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.map(user => (
            <a
              key={user.id}
              href={`#user-${user.id}`}
              onClick={() => handleUserClick(user)}
              className={classNames('dropdown-item', {
                'is-active': user.id === author?.id,
              })}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};