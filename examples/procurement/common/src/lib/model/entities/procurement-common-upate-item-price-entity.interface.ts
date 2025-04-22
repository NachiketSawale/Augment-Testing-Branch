/*
 * Copyright(c) RIB Software GmbH
 */
import { IProcurementCommonHistoricalPriceForItemDto } from '../../model/dtoes';
import {IPrcItemEntity} from './prc-item-entity.interface';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { IPrcHeaderContext } from '../interfaces/prc-header-context.interface';


export interface IProcurementCommonUpdateItemPriceParam {
	catalogId?: number | null,
	isCheckQuote: boolean,
	isCheckContract: boolean,
	isCheckMaterialCatalog: boolean,
	isCheckNeutralMaterial: boolean,
	priceConditionFk: number | null,
	startDate?: Date,
	endDate?: Date,
	materialIds: number[],
	businessPartnerId?: number | null
}

export interface IProcurementCommonUpdatePriceParam {
	priceResultSet: IProcurementCommonHistoricalPriceForItemDto[];
	priceForm: IProcurementCommonUpdateItemPriceParam
}

export interface IProcurementCommonUpdatePriceDataComplete {
	basicOption: number,
	selectedItems: IPrcItemEntity[],
	itemList: IPrcItemEntity[],
	parentId: number,
	headerParentContext: IPrcHeaderContext,
	headerParentPrcHeaderEntity: IPrcHeaderEntity,
	updatePriceParam: IProcurementCommonUpdatePriceParam
}