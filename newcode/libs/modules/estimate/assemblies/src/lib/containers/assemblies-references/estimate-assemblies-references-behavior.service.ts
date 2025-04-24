/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IAssemblyReferencesEntity } from '../../model/models';
import { Injectable } from '@angular/core';


/**
 * Estimate Assemblies References Behavior Service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateAssembliesReferencesBehavior implements IEntityContainerBehavior<IGridContainerLink<IAssemblyReferencesEntity>, IAssemblyReferencesEntity> {

	/**
	 * The constructor
	 */
	public constructor() {
	}
	/**
	 * This method is invoked right when the container component is being created.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onCreate(containerLink: IGridContainerLink<IAssemblyReferencesEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'grouping', 'clipboard']);
	}
}
