import React, { useReducer, createContext } from "react";

export const BlogContext = createContext();

const initialState = {
  pages: [],
  posts: [],
  categories: [],
  headerInfo: {
    title: 'Serverless Blog',
    thumb: null
  },
  activePost: null,
  activePage: null,
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return {
        ...state,
        posts: [...action.payload]
      };
    case "SET_ACTIVE_POST":
      return {
        ...state,
        activePost: action.payload,
      };
    case "SET_PAGES":
      return {
        ...state,
        pages: [...action.payload]
      };
    case "SET_ACTIVE_PAGE":
      return {
        ...state,
        activePage: action.payload,
      };
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: [...action.payload]
      };
    case "SET_HEADER_INFO":
      return {
        ...state,
        headerInfo: {
          title: action.payload.title,
          thumb: action.payload.thumb
        }
      };
    case "START_LOADING":
      return {
        loading: true
      };
    case "STOP_LOADING":
      return {
        loading: false
      };
    default:
      throw new Error();
  }
};

export const BlogContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <BlogContext.Provider value={[state, dispatch]}>
      {props.children}
    </BlogContext.Provider>
  );
};