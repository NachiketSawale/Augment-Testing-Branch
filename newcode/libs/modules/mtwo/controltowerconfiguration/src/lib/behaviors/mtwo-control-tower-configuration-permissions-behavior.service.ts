/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IMtwoPowerbiItemEntity } from '@libs/mtwo/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { MtwoControlTowerConfigurationPermissionsDataService } from '../services/mtwo-controltower-configuration-permissions-data.service';
import { ItemType } from '@libs/ui/common';

/**
 * Mtwo Control Tower Configuration Permissions Behavior service
 */
@Injectable({
	providedIn: 'root'
})
export class MtwoControlTowerConfigurationPermissionsBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IMtwoPowerbiItemEntity>, IMtwoPowerbiItemEntity> {
	private dataService: MtwoControlTowerConfigurationPermissionsDataService;	
	/**
	 * The constructor
	 */
	public constructor() {
		this.dataService = inject(MtwoControlTowerConfigurationPermissionsDataService);
	}
	/**
	 * This method is invoked right when the container component is being created.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onCreate(containerLink: IGridContainerLink<IMtwoPowerbiItemEntity>): void {

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.toolbarRefresh' },
				iconClass: 'tlb-icons ico-refresh',
				id: 't11',
				fn: () => {
					this.dataService.refreshAllLoaded();//check
				},
				sort: 200,
				type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.common.toolbarDelete' },
				iconClass: 'tlb-icons ico-rec-delete',
				id: 't1001',
				disabled: () => {
					return !this.dataService.canDelete();//disabledDelete
				},
				fn: () => {
					this.dataService.refreshAllLoaded();
				},
				sort: 3,
				type: ItemType.Item,
			},
		]);
	}
}