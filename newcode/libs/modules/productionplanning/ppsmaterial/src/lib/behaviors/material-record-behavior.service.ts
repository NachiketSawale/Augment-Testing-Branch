/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
// import { IMaterialEntity } from '@libs/basics/interfaces';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IMaterialNewEntity } from '../model/models';

/**
 * Material record behavior service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsMaterialRecordBehavior implements IEntityContainerBehavior<IGridContainerLink<IMaterialNewEntity>, IMaterialNewEntity> { // IMaterialEntity
	
	/**
	 * This method is invoked right when the container component is being created.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onCreate(containerLink: IGridContainerLink<IMaterialNewEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}
}