import React, { useRef, useState, useEffect } from "react";
import "../styles/Form.css";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";
import { CURRENCY_SYMBOLS } from "../constants";
import { Filters } from "./Filters";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loading } from "./Loading";
import { data } from "react-router";

export const Form = ({
  formTitle,
  createObject,
  updateObject,
  deleteObject,
  getObjects,
  tagOptions,
}) => {
  const [editingObject, setEditingObject] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const {
    data: objects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["form"],
    queryFn: () => getObjects(user.id),
  });

  const { mutate: createObjectMuted, isPendingCreate } = useMutation({
    mutationKey: ["create-object"],
    mutationFn: (payload) => createObject(payload),
    onSuccess: () => {
      toast.success(data.message);
      resetFields();
      queryClient.invalidateQueries({ queryKey: ["form"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: DeleteObjectMuted, isPendingDelete } = useMutation({
    mutationKey: ["delete-object"],
    mutationFn: (objectId) => deleteObject(user.id, objectId),
    onSuccess: () => {
      toast.success(data.message);
      resetFields();
      queryClient.invalidateQueries({ queryKey: ["form"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateObjectMuted, isPending: isPendingUpdate } = useMutation(
    {
      mutationKey: ["update-object"],
      mutationFn: (payload) =>
        updateObject(user.id, editingObject._id, payload),
      onSuccess: () => {
        toast.success(data.message);
        setEditingObject(null);
        resetFields();
        queryClient.invalidateQueries({ queryKey: ["form"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const tagRef = useRef(null);
  const currencyRef = useRef(null);

  const filteredObjects = objects?.filter((object) => {
    const mathSearch = object.title
      .toLowerCase()
      .includes(inputSearch.toLowerCase());
    if (selectedFilter && selectedFilter.type === "amount") {
      return (
        mathSearch &&
        object.amount >= selectedFilter.min &&
        object.amount <= selectedFilter.max
      );
    }
    return mathSearch;
  });

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

    if (editingObject) {
      updateObjectMuted({ ...payload, _id: editingObject._id });
    } else {
      createObjectMuted(payload);
    }
  };

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

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
        <button
          type="submit"
          className="form-button"
          disabled={isPendingCreate || isPendingUpdate}
        >
          {editingObject ? "Update" : "Add"} {formTitle}
        </button>
      </form>

      <Filters
        inputSearch={inputSearch}
        setInputSearch={setInputSearch}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        MAX_BOUND={objects ? Math.max(...objects.map((obj) => obj.amount)) : 0}
      />
      <div className="table-container">
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
            {filteredObjects.length || isPending ? (
              filteredObjects.map((object) => (
                <tr key={object._id}>
                  <td>{object.title}</td>
                  <td>{object.description}</td>
                  <td>
                    {object.amount}
                    {CURRENCY_SYMBOLS[object.currency]}
                  </td>
                  <td>
                    {object.exchangedAmount !== 0
                      ? object.exchangedAmount
                      : object.amount}
                  </td>
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
                        onClick={() => DeleteObjectMuted(object._id)}
                        className="delete-button"
                        disabled={isPendingDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <h1 className="not-found">Not found for "{inputSearch}"</h1>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};
