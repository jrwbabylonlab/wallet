/* eslint-disable indent */
import React, { useContext } from 'react'

export interface ApprovalContextType {
  getApproval: () => Promise<any>
  resolveApproval: (data?: any, stay?: boolean, forceReject?: boolean) => Promise<void>
  rejectApproval: (reason?: string, stay?: boolean, isInternal?: boolean) => Promise<void>
}

const initContext = {
  getApproval: () => {
    return Promise.resolve()
  },
  resolveApproval: (data?: any, stay?: boolean, forceReject?: boolean) => {
    return Promise.resolve()
  },
  rejectApproval: (reason?: string, stay?: boolean, isInternal?: boolean) => {
    return Promise.resolve()
  },
}

export const ApprovalContext = React.createContext<ApprovalContextType>(initContext)

export function useApproval() {
  const ctx = useContext(ApprovalContext)
  return ctx
}
