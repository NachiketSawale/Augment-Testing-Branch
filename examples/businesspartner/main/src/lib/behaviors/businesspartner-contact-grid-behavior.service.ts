/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { InsertPosition, ItemType } from '@libs/ui/common';
import { IContactEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerContactDataService } from '../services/businesspartner-contact-data.service';

@Injectable({
	providedIn: 'root',
})
export class BusinesspartnerContactGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IContactEntity>, IContactEntity> {
	private dataService = inject(BusinesspartnerContactDataService);
	public isChecked: boolean = false;
	public constructor() {
		this.dataService.getFilterBranchState().subscribe(state => {
			this.isChecked = state;
		});
}
	public onCreate(containerLink: IGridContainerLink<IContactEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				// todo wait to check
				{
					id: 'copycontact',
					caption: { key: 'cloud.common.taskBarDeepCopyRecord' },
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-copy-paste-deep',
					disabled: () => {
						const canCopy = this.dataService.canCopy();
						return !canCopy;
					},
					fn: async () => {
						// todo
						// $scope.isLoading = true;
						await this.dataService.copyPaste();
					},
					permission: 'dcf7db231fd14eb085244f685e6a1fec#c',
				},
				{
					id: 'filterByBranch',
					type: ItemType.Check,
					caption: { key: 'businesspartner.main.filterByBranch' },
					iconClass: 'tlb-icons ico-filter',
					sort: 200,
					disabled: () => this.dataService.filterBtnDisabled,
					fn: () => {
						const newState = !this.isChecked;
						this.dataService.clickBtnFilterByBranch(newState);
					},
				},
			],
			EntityContainerCommand.Settings,
			InsertPosition.Before,
		);
		// todo wait to change
		// function finishLoading() {
		// 	$scope.isLoading = false;
		// }
		//
		
		// if (dataService.finishLoadingEvent) {
		// 	dataService.finishLoadingEvent.register(finishLoading);
		// }
		
		//
		// basicsCommonInquiryHelperService.activateProvider($scope, false);
		//
		
		// });
	}
}
