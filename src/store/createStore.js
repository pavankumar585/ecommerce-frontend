import { configureStore } from "@reduxjs/toolkit";
import api from "./middleware/api";
import authReducer from "./auth";
import entitiesReducer from "./entities";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["loading"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export default function createStore() {
  let store = configureStore({
    reducer: {
      entities: entitiesReducer,
      auth: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api),
  });

  let persistor = persistStore(store);

  return { store, persistor };
}
