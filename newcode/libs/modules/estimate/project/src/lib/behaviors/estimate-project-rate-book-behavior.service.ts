/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {EstimateProjectRateBookDataService} from '../services/estimate-project-rate-book-data.service';
import {ItemType} from '@libs/ui/common';
import {IRateBookEntity} from '@libs/project/interfaces';
import {ProjectMainDataService} from '@libs/project/shared';

// TODO: will be done in the future
@Injectable({
	providedIn: 'root'
})
export class EstimateProjectRateBookBehavior implements IEntityContainerBehavior<IGridContainerLink<IRateBookEntity>, IRateBookEntity> {
	private dataService: EstimateProjectRateBookDataService;
	private readonly projectMainService: ProjectMainDataService = inject(ProjectMainDataService);
	private isEditable: boolean = false;

	public constructor() {
		this.dataService = inject(EstimateProjectRateBookDataService);
	}

	private setToolsEditable(isEditable?: boolean) {
		const project = this.projectMainService.getSelectedEntity();
		if(!isEditable) {
			// check project's prjcontentfk and prjcontenttypefk
			this.isEditable = !!(project && !project.PrjContentTypeFk && project.PrjContentFk);
		} else{
			this.isEditable = isEditable;
		}

		return this.isEditable;
	}

	public onCreate(containerLink: IGridContainerLink<IRateBookEntity>): void {
		this.setToolsEditable(undefined);

		containerLink.uiAddOns.toolbar.addItemsAtId([
			{
				caption: { key : 'project.main.configPerProject', text : 'Customize Configuration'},
				hideItem: false,
				iconClass: 'tlb-icons ico-wildcard-2',
				id: 't6',
				fn: () => {
					// TODO:
				},
				disabled: () => {
					return this.isEditable;
				},
				sort: 4,
				type: ItemType.Item
			}
		], EntityContainerCommand.Settings);
	}
}