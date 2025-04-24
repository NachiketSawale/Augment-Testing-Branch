// remark: current file is copied from basics-material-material-catalog-behavior.service in basics.material, 
// should be replaced by other way(like LazyInjectionToken from basics.material module) in the future

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
export class PpsMaterialCatalogBehavior implements IEntityContainerBehavior<IGridContainerLink<IMaterialCatalogEntity>, IMaterialCatalogEntity> {

	/**
	 * This method is invoked right when the container component is being created.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onCreate(containerLink: IGridContainerLink<IMaterialCatalogEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
	}
}
