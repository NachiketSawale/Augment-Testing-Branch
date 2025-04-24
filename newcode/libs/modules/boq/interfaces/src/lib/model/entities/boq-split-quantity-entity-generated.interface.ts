/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqSplitQuantity2CostGroupEntity } from './boq-split-quantity-2cost-group-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IBoqItemEntity } from './boq-item-entity.interface';

export interface IBoqSplitQuantityEntityGenerated extends IEntityBase {

	/*
	 * BQPreviousQuantity
	 */
	BQPreviousQuantity?: number | null;

	/*
	 * BQQuantityTotal
	 */
	BQQuantityTotal?: number | null;

	/*
	 * BilledQuantity
	 */
	BilledQuantity?: number | null;

	/*
	 * BoqBillToFk
	 */
	BoqBillToFk?: number | null;

	/*
	 * BoqHeaderFk
	 */
	BoqHeaderFk: number;

	/*
	 * BoqItemEntity
	 */
	BoqItemEntity?: IBoqItemEntity | null;

	/*
	 * BoqItemFk
	 */
	BoqItemFk: number;

	/*
	 * BoqSplitQuantity2CostGroupEntities
	 */
	BoqSplitQuantity2CostGroupEntities?: IBoqSplitQuantity2CostGroupEntity[] | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * DeliveryDate
	 */
	DeliveryDate?: string | null;

	/*
	 * IQPreviousQuantity
	 */
	IQPreviousQuantity?: number | null;

	/*
	 * IQQuantityTotal
	 */
	IQQuantityTotal?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InstalledQuantity
	 */
	InstalledQuantity?: number | null;

	/*
	 * MdcControllingUnitFk
	 */
	MdcControllingUnitFk?: number | null;

	/*
	 * OrdQuantity
	 */
	OrdQuantity?: number | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * PrjLocationFk
	 */
	PrjLocationFk?: number | null;

	/*
	 * Quantity
	 */
	Quantity: number;

	/*
	 * QuantityAdj
	 */
	QuantityAdj: number;

	/*
	 * SplitNo
	 */
	SplitNo?: number | null;
}