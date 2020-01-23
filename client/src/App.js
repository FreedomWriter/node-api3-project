import React from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { getUsers } from "./store/actions/users.actions";

function App() {
  const dispatch = useDispatch();
  dispatch(getUsers());
  return (
    <>
      <div>
        <h1>Hello from App.js</h1>
      </div>
    </>
  );
}

export default App;
