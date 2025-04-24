/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IValidationEntityGenerated extends IEntityBase {

  /**
   * BilHeaderEntity
   */
  BilHeaderEntity?: IBilHeaderEntity | null;

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

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
}
