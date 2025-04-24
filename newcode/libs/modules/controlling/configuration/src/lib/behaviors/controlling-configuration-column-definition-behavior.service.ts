/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IMdcContrColumnPropDefEntity } from '../model/entities/mdc-contr-column-prop-def-entity.interface';
import {
	ControllingConfigurationColumnDefinitionDataService
} from '../services/controlling-configuration-column-definition-data.service';

@Injectable({
	providedIn: 'root'
})
export class ControllingConfigurationColumnDefinitionBehavior implements IEntityContainerBehavior<IGridContainerLink<IMdcContrColumnPropDefEntity>, IMdcContrColumnPropDefEntity> {

	private readonly dataService = inject(ControllingConfigurationColumnDefinitionDataService);
	public onCreate(containerLink: IGridContainerLink<IMdcContrColumnPropDefEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
		this.dataService.refreshAllLoaded();
	}
}