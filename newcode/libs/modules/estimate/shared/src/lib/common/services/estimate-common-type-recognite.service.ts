/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPrjMaterialEntity } from '@libs/project/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { Injectable } from '@angular/core';
import { IPrjCostCodesEntity } from '@libs/project/interfaces';
import { IEstResourceEntity } from '@libs/estimate/interfaces';

@Injectable({
	providedIn: 'root',
})
export class EstimateCommonTypeRecogniteService{
	public isResourceEntity(item: IPrjCostCodesEntity | IPrjMaterialEntity | IEstLineItemEntity | IEstResourceEntity): item is IEstResourceEntity {
		return (item as IEstResourceEntity).EstResourceTypeFk != null && (item as IEstResourceEntity).EstResourceTypeFk != undefined;
	}

	public isPrjCostCodeEntity(item: IPrjCostCodesEntity | IPrjMaterialEntity | IEstLineItemEntity | IEstResourceEntity): item is IPrjCostCodesEntity {
		return true;
	}

	public isMaterialEntity(item: IPrjCostCodesEntity | IPrjMaterialEntity | IEstLineItemEntity | IEstResourceEntity): item is IPrjMaterialEntity {
		return (item as IPrjMaterialEntity).BasMaterial != null && (item as IPrjMaterialEntity).BasMaterial != undefined;
	}

	public isAssemblyEntity(item: IPrjCostCodesEntity | IPrjMaterialEntity | IEstLineItemEntity | IEstResourceEntity): item is IEstLineItemEntity {
		return (item as IEstLineItemEntity).LineItemType != null && (item as IEstLineItemEntity).LineItemType != undefined;
	}
}