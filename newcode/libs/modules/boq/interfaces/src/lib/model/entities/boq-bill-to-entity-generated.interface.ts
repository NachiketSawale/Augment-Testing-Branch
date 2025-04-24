/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqSplitQuantityEntity } from './boq-split-quantity-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IBoqItemEntity } from './boq-item-entity.interface';

export interface IBoqBillToEntityGenerated extends IEntityBase {

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
	 * BoqSplitQuantities
	 */
	BoqSplitQuantities?: IBoqSplitQuantityEntity[] | null;

	/*
	 * BusinesspartnerFk
	 */
	BusinesspartnerFk: number;

	/*
	 * Code
	 */
	Code: string;

	/*
	 * Comment
	 */
	Comment?: string | null;

	/*
	 * CustomerFk
	 */
	CustomerFk?: number | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * PrjBillToId
	 */
	PrjBillToId: number;

	/*
	 * QuantityPortion
	 */
	QuantityPortion: number;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * SubsidiaryFk
	 */
	SubsidiaryFk?: number | null;

	/*
	 * TotalQuantity
	 */
	TotalQuantity?: number | null;
}