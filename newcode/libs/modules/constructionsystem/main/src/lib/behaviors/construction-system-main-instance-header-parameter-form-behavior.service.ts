/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import { ItemType, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { IInstanceHeaderParameterEntity } from '../model/entities/instance-header-parameter-entity.interface';
import { ConstructionSystemMainInstanceHeaderParameterDataService } from '../services/construction-system-main-instance-header-parameter-data.service';

export const CONSTRUCTION_SYSTEM_MAIN_INSTANCE_HEADER_PARAMETER_FORM_BEHAVIOR_TOKEN = new InjectionToken<ConstructionSystemMainInstanceHeaderParameterFormBehaviorService>('constructionSystemMainJobGridBehavior');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceHeaderParameterFormBehaviorService implements IEntityContainerBehavior<IFormContainerLink<IInstanceHeaderParameterEntity>, IInstanceHeaderParameterEntity> {
	private instanceHeaderParameterRefreshDisable = true;
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	public constructor(private dataService: ConstructionSystemMainInstanceHeaderParameterDataService) {}
	public onCreate(containerLink: IFormContainerLink<IInstanceHeaderParameterEntity>) {
		this.dataService.selectionChanged$.subscribe((item) => {
			this.instanceHeaderParameterRefreshDisable = false;
		});
		containerLink.uiAddOns.toolbar.deleteItems(EntityContainerCommand.RecordNavigationGroup);
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 't-refresh',
				caption: { key: 'platform.formContainer.refresh' },
				sort: 201,
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
			const selectedItem = this.dataService.getSelectedEntity();
			if (!selectedItem) {
				return;
			}
			try {
				const response = await this.dataService.refreshParameter(selectedItem?.CosGlobalParamFk, true);
				this.dataService.setCosParameterTypeFkAndIslookup(response);
				this.dataService.setCosGlobalParam(response);
				const listData = this.dataService.getList();
				if (response.dtos.length === 0) {
					this.dataService.remove([selectedItem]); /// remove current selected in list
					await this.dataService.selectFirst();
					this.dataService.removeModified(listData[0]);
				} else {
					await this.dataService.select(response.dtos[0]);
					this.dataService.removeModified(response.dtos[0]);
				}
				this.instanceHeaderParameterRefreshDisable = false;
			} catch (error) {
				console.error('Error refreshing parameter:', error);
			} finally {
				this.instanceHeaderParameterRefreshDisable = false;
			}
		}
	}
}
