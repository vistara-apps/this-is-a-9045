import React, { createContext, useContext, useReducer } from 'react'

const ClaimContext = createContext()

const initialState = {
  currentClaim: null,
  photos: [],
  processedPhotos: [],
  isProcessing: false,
  reports: []
}

function claimReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_CLAIM':
      return { ...state, currentClaim: action.payload }
    case 'ADD_PHOTOS':
      return { ...state, photos: [...state.photos, ...action.payload] }
    case 'START_PROCESSING':
      return { ...state, isProcessing: true }
    case 'FINISH_PROCESSING':
      return { 
        ...state, 
        isProcessing: false, 
        processedPhotos: action.payload 
      }
    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.payload] }
    case 'CLEAR_PHOTOS':
      return { ...state, photos: [], processedPhotos: [] }
    default:
      return state
  }
}

export function ClaimProvider({ children }) {
  const [state, dispatch] = useReducer(claimReducer, initialState)

  return (
    <ClaimContext.Provider value={{ state, dispatch }}>
      {children}
    </ClaimContext.Provider>
  )
}

export function useClaim() {
  const context = useContext(ClaimContext)
  if (!context) {
    throw new Error('useClaim must be used within a ClaimProvider')
  }
  return context
}