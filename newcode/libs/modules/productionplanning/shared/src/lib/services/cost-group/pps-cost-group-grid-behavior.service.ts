/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsCostGroupEntity } from '../../model/cost-group/pps-cost-group.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsCostGroupGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsCostGroupEntity>, IPpsCostGroupEntity> {

	public onCreate(containerLink: IGridContainerLink<IPpsCostGroupEntity>): void {
		// Create and Delete buttons are not needed for PPS Cost Group container in PPS/Transport modules
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}

}