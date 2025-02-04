import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import "./Dashboard.css";
import { getTotalExpenses } from "../api/expenses";
import { CURRENCY_SYMBOLS } from "../constants";
import { getTotalIncomes } from "../api/income";

export const Dashboard = () => {
  const { user } = useAuth();
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const fetchTotalExpenses = async () => {
      try {
        const data = await getTotalExpenses(user.id);
        setTotalExpense(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchTotalIncomes = async () => {
      try {
        const data = await getTotalIncomes(user.id);
        setTotalIncome(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchTotalExpenses();
    fetchTotalIncomes();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome {user.fullName}</h1>
      </header>

      <div className="summary">
        <div className="card income">
          <h2>Total Incomes</h2>
          <p>
            {totalIncome}
            {CURRENCY_SYMBOLS.ILS}
          </p>
        </div>

        <div className="card expenses">
          <h2>Total Expenses</h2>
          <p>
            {totalExpense}
            {CURRENCY_SYMBOLS.ILS}
          </p>
        </div>

        <div className="card balance">
          <h2>Balance</h2>
          <p>$200</p>
        </div>
      </div>
    </div>
  );
};
