interface PlatformEnvType {
  VERSION: string
  CHANNEL: string
  MANIFEST_VERSION: string
  PLATFORM: 'extension' | 'ios' | 'android' | 'unknown'
  UDID: string
  UDID2: string
  REVIEW_URL: string
  READY_TO_RENDER?: boolean
}

export const PlatformEnv: PlatformEnvType = {
  VERSION: '1.0.0',
  CHANNEL: 'unknown',
  MANIFEST_VERSION: 'mv3',
  PLATFORM: 'unknown',
  UDID: '',
  UDID2: '',
  REVIEW_URL: '',
  READY_TO_RENDER: false,
}
