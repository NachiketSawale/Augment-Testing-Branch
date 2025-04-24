/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqSplitQuantityEntity } from './boq-split-quantity-entity.interface';

export interface IBoqSplitQuantity2CostGroupEntityGenerated extends IEntityBase {

	/*
	 * BoqHeaderFk
	 */
	BoqHeaderFk: number;

	/*
	 * BoqItemFk
	 */
	BoqItemFk: number;

	/*
	 * BoqSplitQuantityEntity
	 */
	BoqSplitQuantityEntity?: IBoqSplitQuantityEntity | null;

	/*
	 * BoqSplitQuantityFk
	 */
	BoqSplitQuantityFk: number;

	/*
	 * CostGroupCatFk
	 */
	CostGroupCatFk: number;

	/*
	 * CostGroupFk
	 */
	CostGroupFk: number;

	/*
	 * Id
	 */
	Id: number;
}