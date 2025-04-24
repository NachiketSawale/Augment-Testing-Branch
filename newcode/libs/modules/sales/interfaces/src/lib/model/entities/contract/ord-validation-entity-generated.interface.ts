/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IOrdValidationEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * Message
   */
  Message?: string | null;

  /**
   * MessageFk
   */
  MessageFk: number;

  /**
   * MessageseverityFk
   */
  MessageseverityFk: number;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk: number;

  /**
   * Parameter1
   */
  Parameter1?: string | null;

  /**
   * Parameter2
   */
  Parameter2?: string | null;

  /**
   * Parameter3
   */
  Parameter3?: string | null;

  /**
   * Reference
   */
  Reference?: number | null;
}
