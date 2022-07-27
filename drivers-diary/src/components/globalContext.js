import { createContext } from "react";

const globalContext = createContext();
const GlobalProvider = globalContext.Provider;
const loadContext = createContext();
const LoadProvider = loadContext.Provider;

const expenseContext = createContext();
const ExpenseProvider = expenseContext.Provider;
const backendURL = "http://localhost:3002";

export {
  GlobalProvider,
  globalContext,
  backendURL,
  LoadProvider,
  loadContext,
  expenseContext,
  ExpenseProvider,
};
