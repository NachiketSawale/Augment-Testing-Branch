/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BoqItemDataServiceBase } from '@libs/boq/main';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { SalesContractBoqDataService } from './sales-contract-boq.service';
import { IOrdBoqCompositeEntity } from '@libs/sales/interfaces';

@Injectable({providedIn: 'root'})
export class SalesContractBoqItemDataService extends BoqItemDataServiceBase {
	public constructor(private parentService: SalesContractBoqDataService) {
		const options = BoqItemDataServiceBase.createDataServiceOptions(parentService);
		super(options);
	}

	public override getSelectedBoqHeaderId() : number | undefined {
		return this.parentService.getSelectedEntity()?.BoqRootItem?.BoqHeaderFk ?? undefined;
	}

	public override isParentFn(parentKey: IOrdBoqCompositeEntity, entity: IBoqItemEntity): boolean {
		return entity.BoqHeaderFk === parentKey.Id;
	}
}
