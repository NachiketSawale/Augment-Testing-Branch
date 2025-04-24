/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { EstimateProjectDataService } from '../services/estimate-project-data.service';
import { PlatformConfigurationService, PlatformModuleNavigationService } from '@libs/platform/common';
import { ItemType } from '@libs/ui/common';
import { isEmpty } from 'lodash';
import { EstimateProjectCreateVersionDialogService } from '../services/dialog-service/estimate-project-create-version-dialog.service';
import { HttpClient } from '@angular/common/http';
import { EstimateProjectRestoreEstimateDialogService } from '../services/dialog-service/estimate-project-restore-estimate-dialog.service';
import { IEstimateCompositeEntity } from '@libs/estimate/shared';
export const ESTIMATE_PROJECT_BEHAVIOR_TOKEN = new InjectionToken<EstimateProjectBehavior>('estimateProjectBehavior');

@Injectable({
	providedIn: 'root'
})

/**
 * Behavior service for estimate project
 */
export class EstimateProjectBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstimateCompositeEntity>, IEstimateCompositeEntity> {


	private dataService: EstimateProjectDataService;
	private estimateProjectCreateVersionDialogService = inject(EstimateProjectCreateVersionDialogService);
	private estimateProjectRestoreEstimateDialogService = inject(EstimateProjectRestoreEstimateDialogService);
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);
	private readonly http = inject(HttpClient);
    private configurationService = inject(PlatformConfigurationService);
	
	public constructor() {
		this.dataService = inject(EstimateProjectDataService);
	}

	/**
	 * This method is invoked right when the container component is being created.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onCreate(containerLink: IGridContainerLink<IEstimateCompositeEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe(data => {
			containerLink.gridData = data;
		});
		this.customizeToolbar(containerLink);
		containerLink.registerSubscription(dataSub);
	}
	private customizeToolbar(containerLink: IGridContainerLink<IEstimateCompositeEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.taskBarDeepCopyRecord' },
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-paste-deep',
				id: 't5',
				disabled: () => {
					const selectedItem = this.dataService.getSelectedEntity();
					return isEmpty(selectedItem) || !!selectedItem.EstHeader.EstHeaderVersionFk;
				},
				fn: () => {
					this.dataService.createDeepCopy();
				},
				sort: 1,
				type: ItemType.Item
			},
			{
				caption: { key: 'cloud.desktop.pinningDesktopDialogHeader' },
				hideItem: false,
				iconClass: 'tlb-icons ico-pin2desktop',
				id: 't-addpinningdocument',
				fn: () => {
					// todo
				},
				sort: 130,
				type: ItemType.Item
			},
			{
				caption: {
					key: 'cloud.common.bulkEditor.title',
					text: 'Bulk Editor',
				},
				hideItem: false,
				iconClass: 'type-icons ico-construction51',
				id: 'bulkEditor',
				sort: 140,
				type: ItemType.Item,
				isSet: true
			},
			{
				caption: { key: 'estimate.project.goToEstimate' },
				hideItem: false,
				iconClass: 'tlb-icons ico-goto',
				id: 't11',
				sort: 400,
				disabled: () => {
					//todo - check !naviService.hasPermissionForModule(navigator.moduleName)
					return isEmpty(this.dataService.getSelection());
				},
				fn: () => {
					const selectedItem = this.dataService.getSelectedEntity();
					if(selectedItem){
						const moduleName = 'estimate.main';
						// todo - entityIdentifications[]
						this.platformModuleNavigationService.navigate({internalModuleName:moduleName, entityIdentifications: []});
					}
				},
				type: ItemType.Item
			},
			{
				caption: { key: 'estimate.project.createVersion' },
				hideItem: false,
				iconClass: 'tlb-icons ico-estimate-version-create',
				id: 't12',
				sort: 410,
				disabled: () => {
					const selectedItem = this.dataService.getSelectedEntity();
					//todo - check !naviService.hasPermissionForModule(navigator.moduleName)
					return isEmpty(selectedItem) || !!selectedItem.EstHeader.EstHeaderVersionFk;
				},
				fn: () => {
					const compositeItem = this.dataService.getSelectedEntity();
					const jobId = compositeItem && compositeItem.EstHeader && compositeItem.EstHeader.LgmJobFk ? compositeItem.EstHeader.LgmJobFk : 0;
					this.http.get(this.configurationService.webApiBaseUrl + 'estimate/project/isgeneratedjobcode?jobId=' + jobId).subscribe(response => {
						this.estimateProjectCreateVersionDialogService.showCreateVersionDialog(response as boolean);
					});
				},
				type: ItemType.Item
			},
			{
				caption: { key: 'estimate.project.restoreVersionEstimate' },
				hideItem: false,
				iconClass: 'tlb-icons ico-estimate-version-restore',
				id: 't13',
				sort: 420,
				disabled: () => {
					const selectedItem = this.dataService.getSelectedEntity();
					//todo - check !naviService.hasPermissionForModule(navigator.moduleName)
					return isEmpty(selectedItem) || !selectedItem.EstHeader.EstHeaderVersionFk;
				},
				fn: () => {
					const compositeItem = this.dataService.getSelectedEntity();
					const jobId = compositeItem && compositeItem.EstHeader && compositeItem.EstHeader.LgmJobFk ? compositeItem.EstHeader.LgmJobFk : 0;
					this.http.get(this.configurationService.webApiBaseUrl + 'estimate/project/isgeneratedjobcode?jobId=' + jobId).subscribe(response => {
						this.estimateProjectRestoreEstimateDialogService.showRestoreEstimateDialog(response as boolean);
					});
				},
				type: ItemType.Item
			},
			{
				caption: { key: 'estimate.project.filterVersionEstimate' },
				hideItem: false,
				iconClass: 'tlb-icons ico-filter-current-version',
				id: 't14',
				sort: 430,
				disabled: () => {
					return false;
				},
				fn: () => {
					this.dataService.toggleFilterStatus();
					const projectEntity = this.dataService.getProjectEntity();
					if(projectEntity){
						this.dataService.load({ id: 0, pKey1: projectEntity.Id});
					}
				},
				type: ItemType.Check,
				value : this.dataService.getFilterStatus()
			},
		]);
	}

}