"use client";

import { createContext, useContext, useReducer } from "react";
import {
  _fetchOwner,
  _fetchWhitelist,
  _getAccount,
  _getProposals,
  _getVoter,
  _getWorkflowStatus,
  _setWorkflowStatus,
} from "../utils";

import { isUser } from "../utils/tools";

// Mise en place du reducer auth
const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

// Création des context pour state & dispatch
export const AuthStateContext = createContext();
export const AuthDispatchContext = createContext();

const initialState = {
  status: "idle",
  owner: null,
  user: null,
  proposals: null,
  whitelist: null,
  voters: null,
  workflowStatus: null,
  error: null,
};

// Fonction appelé au moment du onClick

export const doWhitelistState = async (dispatch) => {
  dispatch({ status: "pending" });
  const result = await _fetchWhitelist();

  if (result) {
    dispatch({ whitelist: result, error: null });
    // localStorage.setItem("minecube_auth", JSON.stringify(initialState));
  } else {
    dispatch({
      status: "rejected",
      error: "Something went wrong during fetching whitelist",
    });
  }
};
export const doUserState = async (dispatch, _owner) => {
  dispatch({ status: "pending" });
  const _address = await _getAccount();
  const _isOwner = isUser(_owner, _address);

  if (_address) {
    const _voter = await _getVoter(_address);

    dispatch({
      user: { address: _address, voter: _voter, owner: _isOwner },
      error: null,
    });

    // localStorage.setItem("minecube_auth", JSON.stringify(initialState));
  } else {
    dispatch({
      status: "rejected",
      error: "Something went wrong during fetching whitelist",
    });
  }
};

export const doOwnerState = async (dispatch) => {
  dispatch({ status: "pending" });
  const _owner = await _fetchOwner();

  if (_owner) {
    dispatch({ owner: _owner, error: null });
    return _owner;
  } else {
    dispatch({
      status: "rejected",
      error: "Something went wrong during fetching owner",
    });
  }
};

export const doVotersState = async (dispatch, _whitelist) => {
  dispatch({ status: "pending" });
  if (_whitelist?.length > 0) {
    const _voters = [];
    for (let index = 0; index < _whitelist?.length; index++) {
      const _address = _whitelist?.[index];
      const _voter = await _getVoter(_address);
      _voters.push(_voter);
    }
    dispatch({ voters: _voters, error: null });
  } else {
    dispatch({
      status: "rejected",
      error: "Something went wrong during fetching voters",
    });
  }
};

export const doProposalsState = async (dispatch) => {
  dispatch({ status: "pending" });
  try {
    const _proposals = await _getProposals();
    dispatch({ proposals: _proposals, error: null });
    return _proposals;
  } catch (error) {
    dispatch({
      status: "rejected",
      error: "Something went wrong during fetching proposals",
    });
  }
};

export const doWorkflowStatusState = async (dispatch) => {
  dispatch({ status: "pending" });

  const _statusId = await _getWorkflowStatus();
  if (_statusId >= 0) {
    dispatch({ workflowStatus: _statusId, error: null });
  } else {
    dispatch({
      status: "rejected",
      error: "Something went wrong during fetching workflow status",
    });
  }
};

export const setWorkflowStatusState = async (dispatch, _newStatusId) => {
  dispatch({ status: "pending" });
  try {
    if (_newStatusId <= 0) {
      return;
    }
    const _previousStatusId = _newStatusId - 1;
    const _status = await _setWorkflowStatus(_previousStatusId, _newStatusId);
    await _status.wait();
  } catch (error) {
    dispatch({
      status: "rejected",
      error: "Something went wrong during fetching workflow status",
    });
  }
};

// Mise à disposition des fonctions à réutiliser dans les components
export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) throw new Error("useAuthState must be used in AuthProvider");
  return context;
};
export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (!context) throw new Error("useAuthDispatch must be used in AuthProvider");

  return context;
};

// Mise en place du Provider de l'App
export const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {props.children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
