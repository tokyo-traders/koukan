import { useRef, useState, useEffect } from "react";
import axios from "axios";

function LoginForm({ Login, error }) {
  const [details, setDetails] = useState({ email: "", password: "" });

  // const name = axios.get("api/all"
  //   .then((res) => {
  //     console.log(res)
  //    })
  //   .catch((err) => alert("error!")))

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "/api/user/login",
        JSON.stringify({ email: details.email, password: details.password })
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => alert("error!"));
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="form-inner">
        <h2>Login</h2>
        {/*ERROR! */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            id="email"
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            value={details.email}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="text"
            name="password"
            id="password"
            onChange={(e) =>
              setDetails({ ...details, password: e.target.value })
            }
            value={details.password}
          />
        </div>

        <input type="submit" value="LOGIN" />
      </div>
    </form>
  );
}

export default LoginForm;