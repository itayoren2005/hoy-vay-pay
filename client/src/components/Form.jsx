import React, { useRef, useState, useEffect } from "react";
import "./Form.css";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";
import { CURRENCY_SYMBOLS } from "../constants";
import { Divide, Filter } from "lucide-react";

export const Form = ({
  formTitle,
  createObject,
  updateObject,
  deleteObject,
  getObjects,
  tagOptions,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [objects, setObjects] = useState([]);
  const [editingObject, setEditingObject] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const { user } = useAuth();

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const tagRef = useRef(null);
  const currencyRef = useRef(null);

  const filteredObjects = objects.filter((object) =>
    object.title.toLowerCase().includes(inputSearch.toLowerCase())
  );

  const resetFields = (object = null) => {
    if (!object) {
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      amountRef.current.value = "";
      tagRef.current.value = tagOptions[0];
      currencyRef.current.value = "ILS";
    } else {
      titleRef.current.value = object.title;
      descriptionRef.current.value = object.description;
      amountRef.current.value = object.amount;
      tagRef.current.value = object.tag;
      currencyRef.current.value = object.currency;
      titleRef.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: user.id,
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      amount: Number(amountRef.current.value),
      tag: tagRef.current.value,
      currency: currencyRef.current.value,
    };

    try {
      setIsPending(true);

      if (!editingObject) {
        const data = await createObject(payload);
        toast.success(data.message);
        if (data.object) {
          setObjects((prevObjects) => [...prevObjects, data.object]);
        }
      } else {
        const data = await updateObject(user.id, editingObject._id, payload);
        toast.success(data.message);
        setObjects((prevObjects) =>
          prevObjects.map((obj) =>
            obj._id === editingObject._id ? { ...obj, ...payload } : obj
          )
        );
      }

      resetFields();
      setEditingObject(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const data = await getObjects(user.id);
        setObjects(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchObjects();
  }, []);

  const handleDeleteObject = async (objectId) => {
    try {
      setIsPending(true);
      const data = await deleteObject(user.id, objectId);
      setObjects((prevObjects) =>
        prevObjects.filter((obj) => obj._id !== objectId)
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  const handleEditObject = (object) => {
    setEditingObject(object);
    resetFields(object);
  };

  return (
    <main className="form-container">
      <h1>{formTitle}</h1>
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
            {tagOptions.map((tag) => (
              <option key={tag} value={tag.value}>
                {tag}
              </option>
            ))}
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
        <button type="submit" className="form-button" disabled={isPending}>
          {editingObject ? "Update" : "Add"} {formTitle}
        </button>
      </form>

      <div className="form-filter-section">
        <input
          type="text"
          placeholder="Search..."
          value={inputSearch}
          onChange={({ target }) => setInputSearch(target.value)}
        />
        <button>
          <Filter />
        </button>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Exchanged amount</th>
            <th>Tag</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredObjects.length === 0 ? (
            <h1 className="not-found">Not found for "{inputSearch}"</h1>
          ) : (
            filteredObjects.map((object) => (
              <tr key={object._id}>
                <td>{object.title}</td>
                <td>{object.description}</td>
                <td>
                  {object.amount}
                  {CURRENCY_SYMBOLS[object.currency]}
                </td>
                <td>{object.exchangedAmount}</td>
                <td>{object.tag}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditObject(object)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteObject(object._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};
