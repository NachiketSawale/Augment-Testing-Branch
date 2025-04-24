/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { IMaterialCatalogEntity } from '@libs/basics/shared';

/**
 * Material catalog behavior service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialMaterialCatalogBehavior implements IEntityContainerBehavior<IGridContainerLink<IMaterialCatalogEntity>, IMaterialCatalogEntity> {


	/**
	 * This method is invoked right when the container component is being created.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onCreate(containerLink: IGridContainerLink<IMaterialCatalogEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
	}
}
