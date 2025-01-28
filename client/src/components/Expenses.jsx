import React, { useRef, useState, useEffect } from "react";
import "./Expenses.css";
import { useAuth } from "./AuthProvider";
import { createExpenses, getExpenses } from "../api/expenses";
import { toast } from "react-toastify";

export const Expenses = () => {
  const [isPending, setIsPending] = useState(false);
  const [expenses, setExpenses] = useState();
  const { user } = useAuth();

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const tagRef = useRef(null);
  const currencyRef = useRef(null);

  const resetFields = () => {
    titleRef.current.value = "";
    descriptionRef.current.value = "";
    amountRef.current.value = "";
    tagRef.current.value = "food";
    currencyRef.current.value = "ILS";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const amount = amountRef.current.value;
    const tag = tagRef.current.value;
    const currency = currencyRef.current.value;

    const payload = {
      userId: user.id,
      title,
      description,
      amount: Number(amount),
      tag,
      currency,
    };

    try {
      setIsPending(true);
      const data = await createExpenses(payload);
      toast.success(data.message);
      resetFields();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };
  useEffect(() => {
    setExpenses(async () => {
      await getExpenses(user.id);
    })();
    console.log(expenses);
  }, []);

  return (
    <main className="expense-container">
      <h1>Expenses</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            ref={titleRef}
            id="title"
            placeholder="Enter the title"
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            ref={descriptionRef}
            id="description"
            placeholder="Enter the description"
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            ref={amountRef}
            inputMode="numeric"
            id="amount"
            placeholder="Enter the amount"
            required
          />
        </div>

        <div>
          <label htmlFor="tag">Tag</label>
          <select id="tag" ref={tagRef} required>
            <option value="food">Food</option>
            <option value="rent">Rent</option>
            <option value="transport">Transport</option>
            <option value="clothing">Clothing</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="currency">Currency</label>
          <select id="currency" ref={currencyRef}>
            <option value="ILS">ILS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <button type="submit" className="expense-button" disabled={isPending}>
          Add Expense
        </button>
      </form>
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Tag</th>
            <th>Currency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Groceries</td>
            <td>Weekly groceries</td>
            <td>150</td>
            <td>Food</td>
            <td>ILS</td>
            <td>
              <div className="action-buttons">
                <button className="edit-button">Edit</button>
                <button className="delete-button">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
};
