"use client";

import { createContext, useContext, useReducer } from "react";
import {
  _fetchWhitelist,
  _getProposals,
  _getVoter,
  _getWorkflowStatus,
  _setWorkflowStatus,
} from "../utils";
import { WORKFLOW_STATUS } from "../constants";

// Mise en place du reducer auth
const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

// Création des context pour state & dispatch
export const AuthStateContext = createContext();
export const AuthDispatchContext = createContext();

const initialState = {
  status: "idle",
  user: null,
  proposals: null,
  whitelist: null,
  voters: null,
  workflowStatus: null,
  error: null,
};

// Fonction appelé au moment du onClick
// export const doProposalsState = async (dispatch, user, password) => {
//   dispatch({ status: "pending" });

//   const req = await getUser(user, password);
//   console.log("login state", req);
//   if (req.user) {
//     dispatch({ proposals: , error: null, user: req.user.profile });
//     // localStorage.setItem("minecube_auth", JSON.stringify(initialState));
//   } else {
//     dispatch({ status: "rejected", error: req, user: null });
//   }
// };
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
  if (_statusId) {
    dispatch({ workflowStatus: WORKFLOW_STATUS[_statusId], error: null });
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
    const _previousStatusId = _newStatusId === 0 ? 0 : _newStatusId - 1;
    const _status = await _setWorkflowStatus(_previousStatusId, _newStatusId);
    if (!_status.ok) {
      throw new Error("Something went wrong during setting workflorw status");
    }
    dispatch({ workflowStatus: WORKFLOW_STATUS[_newStatusId], error: null });
  } catch (error) {
    dispatch({
      status: "rejected",
      error: "Something went wrong during fetching workflow status",
    });
  }
};

// export const doCreateUserState = async (dispatch, dataUser, dataProfile) => {
//   dispatch({ status: "pending" });
//   const req = await createUser(dataUser);
//   console.log("create user", req);
//   if (req?.id) {
//     const reqProfile = await updateProfileById(req?.profile?.id, {
//       name: dataProfile.name,
//       wallet_id: dataProfile.wallet_id,
//     });
//     if (reqProfile?.id) {
//       doLoginState(dispatch, dataUser.email, dataUser?.password);
//     }
//   } else {
//     dispatch({ status: "error", error: "Failed to register.", user: null });
//   }
// };

// export const doLogoutState = (dispatch) => {
//   localStorage.removeItem("minecube_auth");
//   dispatch(initialState);

//   // history.push("/");
// };

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
