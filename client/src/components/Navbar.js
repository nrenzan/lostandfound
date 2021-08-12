import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';

const NavBar = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/createpost">Post Found Item</Link>
        </li>,
        <li>
          <button
            className="btn waves-effect waves-light #64b5f6 red darken-1"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: 'CLEAR' });
              history.push('/login');
            }}
          >
            Log Out
          </button>
        </li>
      ];
    } else {
      return [
        <li>
          <Link to="/login">Login</Link>
        </li>,
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper black">
        <Link to={state ? '/' : '/login'} className="brand-logo left">
          Lost And Found KU
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
