import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import usersReducer from "./usersReducer";
import postsReducer from "./postsReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["usersReducer", "postsReducer"]
};

const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer
});

export default persistReducer(persistConfig, rootReducer);
