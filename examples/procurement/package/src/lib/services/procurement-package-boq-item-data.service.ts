/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BoqItemDataServiceBase } from '@libs/boq/main';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageBoqDataService } from './procurement-package-boq.service';

@Injectable({providedIn: 'root'})
export class ProcurementPackageBoqItemDataService extends BoqItemDataServiceBase {
	public constructor(private parentService: ProcurementPackageBoqDataService) {
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
