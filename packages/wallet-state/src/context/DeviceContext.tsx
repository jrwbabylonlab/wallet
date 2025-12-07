import React, { useContext } from 'react'

export interface DeviceContextType {
  isMobile: boolean
  isIOS: boolean
  isAndroid: boolean
  isExtensionInExpandView: boolean
  isExtensionInSideBar: boolean
  isExtension: boolean
  isMobileScreenSize: boolean
  isDesktopScreenSize: boolean
  platform: string
  hasBottomButton: boolean
}

const initContext = {
  isMobile: false,
  isIOS: false,
  isAndroid: false,
  isExtension: false,
  isExtensionInExpandView: false,
  isExtensionInSideBar: false,
  isMobileScreenSize: false,
  isDesktopScreenSize: false,
  platform: 'unknown',
  hasBottomButton: false,
}

export const DeviceContext = React.createContext<DeviceContextType>(initContext)

export function useDevice() {
  const ctx = useContext(DeviceContext)
  return ctx
}
