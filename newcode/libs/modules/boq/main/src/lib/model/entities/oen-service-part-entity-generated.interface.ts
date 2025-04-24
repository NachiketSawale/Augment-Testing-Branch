/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenPriceDefinitionEntity } from './oen-price-definition-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOenServicePartEntityGenerated extends IEntityBase {

/*
 * Description
 */
  Description: string;

/*
 * Id
 */
  Id: number;

/*
 * Nr
 */
  Nr: number;

/*
 * OenLvHeaderFk
 */
  OenLvHeaderFk: number;

/*
 * OenPriceDefinitions
 */
  OenPriceDefinitions?: IOenPriceDefinitionEntity[] | null;
}
