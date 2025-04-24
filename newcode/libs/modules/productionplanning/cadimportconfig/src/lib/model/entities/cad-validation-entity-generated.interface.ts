/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IClobEntity } from '@libs/cloud/interfaces';

export interface IEngCadValidationEntityGenerated extends IEntityBase {

/*
 * BasClobParamFk
 */
  BasClobParamFk?: number | null;

/*
 * ClobToSave
 */
ClobToSave?: IClobEntity | null;

/*
 * EngCadImportFk
 */
  EngCadImportFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * MessageLevel
 */
  MessageLevel?: number | null;

/*
 * RuleId
 */
  RuleId?: number | null;
}
