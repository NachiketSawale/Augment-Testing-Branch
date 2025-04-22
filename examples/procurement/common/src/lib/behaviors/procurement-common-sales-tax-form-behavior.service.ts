/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonSalesTaxFormBehavior<T extends object> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {

	public constructor() {
	}

	public onCreate(containerLink: IGridContainerLink<T>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}
}