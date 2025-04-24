/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { IReportEntity } from '../model/entities/report-entity.interface';
import { BasicsReportingReportDataService } from '../services/basics-reporting-report-data.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsReportingReportBehavior implements IEntityContainerBehavior<IGridContainerLink<IReportEntity>, IReportEntity> {

	private readonly reportDataService = inject(BasicsReportingReportDataService);

	public onCreate(containerLink: IGridContainerLink<IReportEntity>) {
		const menuItems: ConcreteMenuItem[] = [
			{
				caption: 'basics.common.upload.button.downloadCaption',
				iconClass: 'tlb-icons ico-download',
				type: ItemType.Item,
				permission: '#r',
				disabled: () => {
					return !this.reportDataService.getSelectedEntity();
				},
				fn: () => {
					//TODO: Remaining functionality is dependent on basics-reporting-download-service
				}
			},
			{
				caption: 'Upload',
				iconClass: 'tlb-icons ico-upload',
				type: ItemType.FileSelect,
				permission: '#w',
				disabled: () => {
					return !this.reportDataService.getSelectedEntity();
				},
				fn: () => {
					//TODO: Remaining functionality is dependent on basics-reporting-download-service
				}
			},
		];

		containerLink.uiAddOns.toolbar.addItems(menuItems);
	}

	
}