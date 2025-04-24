/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BoqItemDataServiceBase } from '@libs/boq/main';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { ProcurementQuoteBoqDataService } from './procurement-quote-boq.service';

@Injectable({providedIn: 'root'})
export class ProcurementQuoteBoqItemDataService extends BoqItemDataServiceBase {
	public constructor(private readonly parentService: ProcurementQuoteBoqDataService) {
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
