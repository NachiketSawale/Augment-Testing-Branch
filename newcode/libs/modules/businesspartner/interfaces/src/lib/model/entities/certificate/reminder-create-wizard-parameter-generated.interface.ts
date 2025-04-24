/*
 * Copyright(c) RIB Software GmbH
 */

export interface IReminderCreateWizardParameterGenerated {

  /**
   * BatchDate
   */
  BatchDate: Date | string;

  /**
   * BatchId
   */
  BatchId?: string | null;

  /**
   * Email
   */
  Email: boolean;

  /**
   * Telefax
   */
  Telefax: boolean;
}
