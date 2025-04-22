/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BoqItemDataServiceBase } from '@libs/boq/main';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { SalesWipBoqDataService } from './sales-wip-boq.service';
import { IWipBoqCompositeEntity } from '../model/entities/wip-boq-composite-entity.interface';

@Injectable({providedIn: 'root'})
export class SalesWipBoqItemDataService extends BoqItemDataServiceBase {
	public constructor(private parentService: SalesWipBoqDataService) {
		const options = BoqItemDataServiceBase.createDataServiceOptions(parentService);
		super(options);
	}

	public override getSelectedBoqHeaderId() : number | undefined {
		return this.parentService.getSelectedEntity()?.BoqRootItem?.BoqHeaderFk ?? undefined;
	}

	public override isParentFn(parentKey: IWipBoqCompositeEntity, entity: IBoqItemEntity): boolean {
		return entity.BoqHeaderFk === parentKey.Id;
	}
}
