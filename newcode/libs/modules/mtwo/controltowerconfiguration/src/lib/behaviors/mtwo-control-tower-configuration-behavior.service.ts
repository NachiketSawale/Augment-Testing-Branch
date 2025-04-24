/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { MtwoControlTowerConfigurationDataService } from '../services/mtwo-control-tower-configuration-data.service';
import { ItemType } from '@libs/ui/common';
import { IMtwoPowerbiEntity } from '@libs/mtwo/interfaces';

@Injectable({
	providedIn: 'root'
})
/**
 * MTWO control tower configuration Behavior service
 */
export class MtwoControlTowerConfigurationBehavior implements IEntityContainerBehavior<IGridContainerLink<IMtwoPowerbiEntity>, IMtwoPowerbiEntity> {
	private dataService: MtwoControlTowerConfigurationDataService;	
	/**
	 * The constructor
	 */
	public constructor() {
		this.dataService = inject(MtwoControlTowerConfigurationDataService);
	}
	/**
	 * This method is invoked right when the container component is being created.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onCreate(containerLink: IGridContainerLink<IMtwoPowerbiEntity>): void {

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'mtwo.controltowerconfiguration.Refresh' },
				hideItem: false,
				iconClass: 'control-icons ico-crefo3',
				id: 't2002',
				disabled: () => {
					return !this.dataService.hasSelection();
				},
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 2002,
				type: ItemType.Item,
			},
			{
				caption: { key: 'mtwo.controltowerconfiguration.availableFeatures' },
				hideItem: false,
				iconClass: 'control-icons ico-question',
				id: 't2003',
				disabled: () => {
					return !this.dataService.hasSelection();
				},
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 2003,
				type: ItemType.Item,
			},
		]);
	}

}