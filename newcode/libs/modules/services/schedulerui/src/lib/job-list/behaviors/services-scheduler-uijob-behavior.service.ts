/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { IYesNoDialogOptions, ItemType, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';

import { ServicesSchedulerUIJobDataService } from '../services/services-scheduler-uijob-data.service';
import { PlatformConfigurationService } from '@libs/platform/common';

import { IJobEntity } from '../model/entities/job-entity.interface';
import { ISchedulerUITaskTypeLookup } from '../model/entities/scheduler-ui-task-type-lookup.interface';


@Injectable({
	providedIn: 'root'
})

/**
 * services schedulerui job behavior service.
 */
export class ServicesSchedulerUIJobBehavior implements IEntityContainerBehavior<IGridContainerLink<IJobEntity>, IJobEntity> {

	/**
	 * Used to inject ServicesSchedulerUIJob data service
	 */
	private readonly dataService: ServicesSchedulerUIJobDataService = inject(ServicesSchedulerUIJobDataService);

	/**
	 * Used to inject configuration service.
	 */
	private readonly configurationService = inject(PlatformConfigurationService);

	/**
	 * Used to inject messagebox service.
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * Used to inject http client.
	 */
	protected readonly http = inject(HttpClient);


	/**
	 * This method is invoked right when the container component
	 * is being created.
	 * @param {IGridContainerLink<IJobEntity>} containerLink 
	 * A reference to the facilities of the container
	 */
	public onCreate(containerLink: IGridContainerLink<IJobEntity>): void {

		containerLink.uiAddOns.toolbar.deleteItems(['delete']);

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'services.schedulerui.stopJob' },
				iconClass: 'tlb-icons ico-stop',
				id: 't1',
				fn: () => this.stopJob(),
				disabled: () => {
					const selected = this.dataService.getSelection()[0];
					return !selected || selected.Version === 0 || (selected.JobState !== 2 && selected.JobState !== 5);
				},
				sort: 140,
				type: ItemType.Item,
			},

			{
				id: 'copyFromJob',
				caption: { key: 'services.schedulerui.copyFromJob' },
				type: ItemType.Item,
				cssClass: 'tlb-icons ico-copy',
				//ToDo: need to implement function
				// Need implementation of dataService.createItem()
				// fn: () => this.copyFromJob(),
				disabled: () => this.checkIsDisabledCopyFromJob(),
				sort: 240
			},
			{
				id: 'deleteRecord',
				caption: { key: 'cloud.common.toolbarDelete' },
				type: ItemType.Item,
				cssClass: 'tlb-icons ico-rec-delete',
				fn: () => this.openYesNoDialogToDeleteJob(),
				disabled: () => {
					const selectedEntities = this.dataService.getSelection();
					return selectedEntities.length === 0;
				},
				sort: 1

			}
		]);
	}

	/**
	 * Used to disabled CopyFromJob tool icon.
	 * @returns {boolean} return is CopyFromJob disabled or not.
	 */
	private checkIsDisabledCopyFromJob(): boolean {
		const selectedEntities = this.dataService.getSelection();

		if (!selectedEntities[0] || selectedEntities.length !== 1 || selectedEntities[0].Version === 0) {
			return true;
		}

		const task: ISchedulerUITaskTypeLookup | undefined = this.dataService.getTask(selectedEntities[0].TaskType as string);

		if (task && task.UiCreate !== undefined && task.UiChangeable !== undefined) {
			return !task.UiCreate || !task.UiChangeable;
		}

		return true;
	}


	/**
	 * Used to stop selected jobs.
	 */
	private stopJob() {
		const selected = this.dataService.getSelection()[0];
		const params = new HttpParams().set('jobId', selected.Id as number);
		this.http.post(this.configurationService.webApiBaseUrl + 'services/scheduler/job/stopjob', {}, { params }).subscribe((response) => {
			console.log(response);
		});
	}

	/**
	 * Used to display yes no dialog when click on delete record
	 */
	private async openYesNoDialogToDeleteJob() {

		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.No,
			id: 'YesNoModal',
			headerText: 'services.schedulerui.deleteConfirmTitle',
			bodyText: 'services.schedulerui.deleteConfirm',
		};

		const result = await this.messageBoxService.showYesNoDialog(options);

		if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
			this.deleteJobs();
		}
	}


	/**
	 * Used to delete selected jobs.
	 */
	private deleteJobs() {
		const selectedEntities = this.dataService.getSelection();
		this.http.post(this.configurationService.webApiBaseUrl + 'services/schedulerui/job/deleteMultiple', selectedEntities).subscribe((data) => {
			this.dataService.refreshAll();
		});
	}

}