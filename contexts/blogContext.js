import React, { useReducer, createContext } from "react"
import _ from 'lodash'

export const BlogContext = createContext()

const initialState = {
  pages: [],
  posts: [],
  categories: [],
  headerInfo: {
    title: 'Serverless Blog',
    thumb: null
  },
  loading: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return {
        ...state,
        posts: [...action.payload]
      };
    case "REMOVE_POST":
      return {
        ...state,
        posts: [...state.posts].filter(post => (post._id != action.payload))
      };
    case "INSERT_POST":
      action.payload.category = state.categories.find(cat => cat._id == action.payload.category).name
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case "UPDATE_POST":
      state.posts[state.posts.indexOf(state.posts.find(post => post._id == action.payload._id))] = action.payload
      return {
        ...state,
        posts: [...state.posts]
      };
    case "SET_PAGES":
      return {
        ...state,
        pages: [...action.payload]
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