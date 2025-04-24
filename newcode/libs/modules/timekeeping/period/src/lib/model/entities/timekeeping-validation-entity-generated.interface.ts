/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ITimekeepingValidationEntityGenerated extends IEntityBase {

/*
 * ErrorMessageFk
 */
  ErrorMessageFk: number;

/*
 * Id
 */
  Id: number;

/*
 * IsTransaction
 */
  IsTransaction: number;

/*
 * Message
 */
  Message?: string | null;

/*
 * MessageSeverityFk
 */
  MessageSeverityFk?: number | null;

/*
 * Parameter1
 */
  Parameter1?: string | null;

/*
 * Parameter2
 */
  Parameter2?: string | null;

/*
 * Parameter3
 */
  Parameter3?: string | null;

/*
 * PeriodFk
 */
  PeriodFk: number;

/*
 * RecordingFk
 */
  RecordingFk: number;
}
