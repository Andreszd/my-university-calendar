import PropTypes from "prop-types";
import classNames from "classnames";

import "./Button.css";

const Button = ({ type, children }) => {
  return (
    <button
      className={classNames("button", {
        [`button--${type}`]: type,
      })}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
};

Button.defaultProps = {
  type: "primary",
};
export default Button;