/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IPrcItemEntity, IPrcItemPriceConditionEntity, IPrcItemScopeEntity } from './entities';
import { PrcItemScopeComplete } from './prc-item-scope-complete.class';
import { IControllingUnitGroupSetComplete, IControllingUnitdGroupSetEntity } from '@libs/controlling/interfaces';

/**
 * The common item complete entity
 */
export class PrcCommonItemComplete extends CompleteIdentification<IPrcItemEntity> implements IControllingUnitGroupSetComplete {
	//CostGroupToDelete?: Array<MainItem2CostGroupDto>;
	//CostGroupToSave?: Array<MainItem2CostGroupDto>;
	public MainItemId?: number | null | undefined;
	public PrcItem?: IPrcItemEntity;
	//PrcItemDeliveryToDelete?: Array<PrcItemdeliveryDto>;
	//PrcItemDeliveryToSave?: Array<PrcItemdeliveryDto>;
	public PrcItemScopeToDelete?: Array<IPrcItemScopeEntity>;
	public PrcItemScopeToSave?: Array<PrcItemScopeComplete>;
	//PrcItemblobToDelete?: Array<PrcItemblobDto>;
	//PrcItemblobToSave?: Array<PrcItemblobDto>;
	public PriceConditionToDelete?: Array<IPrcItemPriceConditionEntity>;
	public PriceConditionToSave?: Array<IPrcItemPriceConditionEntity>;
	public controllingStructureGrpSetDTLToDelete?: IControllingUnitdGroupSetEntity[] | null;
	public controllingStructureGrpSetDTLToSave?: IControllingUnitdGroupSetEntity[] | null;
}