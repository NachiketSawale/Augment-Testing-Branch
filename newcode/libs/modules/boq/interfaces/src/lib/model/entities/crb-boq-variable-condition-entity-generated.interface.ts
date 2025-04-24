/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICrbBoqVariableEntity } from './crb-boq-variable-entity.interface';

export interface ICrbBoqVariableConditionEntityGenerated extends IEntityBase {

/*
 * ConditionType
 */
  ConditionType: string;

/*
 * CrbBoqVariable
 */
  CrbBoqVariable?: ICrbBoqVariableEntity | null;

/*
 * CrbBoqVariableFk
 */
  CrbBoqVariableFk: number;

/*
 * Id
 */
  Id: number;

/*
 * Reference
 */
  Reference: string;
}
