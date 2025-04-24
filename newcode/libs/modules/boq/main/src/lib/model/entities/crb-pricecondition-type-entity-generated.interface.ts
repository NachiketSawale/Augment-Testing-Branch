/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICrbPriceconditionEntity } from './crb-pricecondition-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICrbPriceconditionTypeEntityGenerated extends IEntityBase {

/*
 * CrbPriceconditions
 */
  CrbPriceconditions?: ICrbPriceconditionEntity[] | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DescriptionTr
 */
  DescriptionTr?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsGeneralstype
 */
  IsGeneralstype: boolean;
}
