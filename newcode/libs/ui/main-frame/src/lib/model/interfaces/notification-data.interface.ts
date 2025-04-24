/**
 * Copyright(c) RIB Software GmbH
 */

// TODO: revise design!

/**
 * Represents a notification.
 */
export interface INotificationData {
  /**
   * The notification message to display.
   */
  message: string;

  /**
   * The notification type.
   */
  notification_class: string;
}