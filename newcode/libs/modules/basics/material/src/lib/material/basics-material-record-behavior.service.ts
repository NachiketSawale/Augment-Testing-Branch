/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { inject, Injectable } from '@angular/core';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { BasicsMaterialRecordDataService } from './basics-material-record-data.service';
import { BasicsMaterialMaterialGroupDataService } from '../material-group/basics-material-material-group-data.service';
import { isEmpty } from 'lodash';
import { ItemType } from '@libs/ui/common';

/**
 * Material record behavior service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialRecordBehavior implements IEntityContainerBehavior<IGridContainerLink<IMaterialEntity>, IMaterialEntity> {
	private groupDataService: BasicsMaterialMaterialGroupDataService;
	private materialRecordService: BasicsMaterialRecordDataService;

	/**
	 * The constructor
	 */
	public constructor() {
		this.groupDataService = inject(BasicsMaterialMaterialGroupDataService);
		this.materialRecordService = inject(BasicsMaterialRecordDataService);
	}
	/**
	 * This method is invoked right when the container component is being created.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onCreate(containerLink: IGridContainerLink<IMaterialEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				//TODO: framework should provide the default button.
				caption: { key: 'cloud.common.deepCopy' },
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-paste-deep',
				id: 't12',
				sort: 1001,
				disabled: () => {
					return isEmpty(this.materialRecordService.getSelection());
				},
				fn: () => {
					this.materialRecordService.deepCopy();
				},
				type: ItemType.Item
			}
		]);
	}
}