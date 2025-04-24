/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BoqItemDataServiceBase } from '@libs/boq/main';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { ProcurementContractBoqDataService } from './procurement-contract-boq.service';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';

@Injectable({providedIn: 'root'})
export class ProcurementContractBoqItemDataService extends BoqItemDataServiceBase {
	public constructor(private parentService: ProcurementContractBoqDataService) {
		const options = BoqItemDataServiceBase.createDataServiceOptions(parentService);
		super(options);
	}

	public override getSelectedBoqHeaderId() : number | undefined {
		return this.parentService.getSelectedEntity()?.BoqRootItem?.BoqHeaderFk ?? undefined;
	}

	public override isParentFn(parentKey: IPrcBoqExtendedEntity, entity: IBoqItemEntity): boolean {
		return entity.BoqHeaderFk === parentKey.Id;
	}
}
