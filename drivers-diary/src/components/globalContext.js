import { createContext } from "react";

const globalContext = createContext();
const GlobalProvider = globalContext.Provider;
const loadContext = createContext();
const LoadProvider = loadContext.Provider;

const expenseContext = createContext();
const ExpenseProvider = expenseContext.Provider;
const backendURL = "http://54.82.18.179:4000";

export {
  GlobalProvider,
  globalContext,
  backendURL,
  LoadProvider,
  loadContext,
  expenseContext,
  ExpenseProvider,
};
