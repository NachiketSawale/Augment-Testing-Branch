/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { IBasicsSharedHistoricalPriceForBoqEntity } from '../model/entities/historical-price-for-boq-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedHistoricalPriceForBoqBehavior implements IEntityContainerBehavior<IGridContainerLink<IBasicsSharedHistoricalPriceForBoqEntity>, IBasicsSharedHistoricalPriceForBoqEntity> {

	public constructor() {
	}

	public onCreate(containerLink: IGridContainerLink<IBasicsSharedHistoricalPriceForBoqEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}
}