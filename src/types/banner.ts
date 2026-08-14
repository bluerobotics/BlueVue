export type BannerSeverity = 'error' | 'warning' | 'info' | 'success'

/** A banner's message and look, which is all a group needs to lay one out. */
export interface BannerContent {
  /** The message, which the banner is only as wide as while it is open. */
  text: string
  /** Which of the standard looks to take (default 'info'). */
  severity?: BannerSeverity
  /** An mdi class, in place of the severity's icon. */
  icon?: string
  /** Icon and text colour, in place of the severity's. */
  color?: string
  /** Fill, in place of the severity's. */
  background?: string
  /** Hairline, in place of the severity's. */
  border?: string
}
