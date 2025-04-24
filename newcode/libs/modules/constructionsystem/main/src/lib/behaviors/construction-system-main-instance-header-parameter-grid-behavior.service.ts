/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { IInstanceHeaderParameterEntity } from '../model/entities/instance-header-parameter-entity.interface';
import { ConstructionSystemMainInstanceHeaderParameterDataService } from '../services/construction-system-main-instance-header-parameter-data.service';

export const CONSTRUCTION_SYSTEM_MAIN_INSTANCE_HEADER_PARAMETER_GRID_BEHAVIOR_TOKEN = new InjectionToken<ConstructionSystemMainInstanceHeaderParameterGridBehaviorService>('constructionSystemMainJobGridBehavior');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceHeaderParameterGridBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IInstanceHeaderParameterEntity>, IInstanceHeaderParameterEntity> {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private instanceHeaderParameterRefreshDisable = false;
	public constructor(private dataService: ConstructionSystemMainInstanceHeaderParameterDataService) {}

	public onCreate(containerLink: IGridContainerLink<IInstanceHeaderParameterEntity>) {
		this.dataService.selectionChanged$.subscribe((item) => {
			this.instanceHeaderParameterRefreshDisable = false;
		});
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 't-refresh',
				caption: { key: 'platform.formContainer.refresh' },
				sort: 1,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-refresh',
				fn: () => {
					this.refreshViewerPage();
				},
				disabled: () => {
					return this.instanceHeaderParameterRefreshDisable;
				},
			},
		]);
	}

	private async refreshViewerPage() {
		this.instanceHeaderParameterRefreshDisable = true;
		const result = await this.messageBoxService.showYesNoDialog('constructionsystem.main.confirmRefreshNew', 'constructionsystem.master.dialog.deleteOtherModuleTitle');
		if (result?.closingButtonId === StandardDialogButtonId.Yes) {
			this.dataService.refreshParameter(null, true).then(
				(response) => {
					this.dataService.refreshAfter(response);
					this.instanceHeaderParameterRefreshDisable = false;
				},
				() => {
					this.instanceHeaderParameterRefreshDisable = false;
				},
			);
		}
	}
}
