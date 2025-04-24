import { inject } from '@angular/core';
import { IStatusChangeOptions } from '../model/interfaces/status-change-options.interface';
import { combineLatest, throwError, lastValueFrom } from 'rxjs';
import { IStatus } from '../model/interfaces/status.interface';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { IStatusChangeResult } from '../model/interfaces/status-change-result.interface';
import { IIdentificationData } from '@libs/platform/common';
import { UiCommonDialogService, ICustomDialogOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { StatusPage, BasicsSharedStatusChangeDialogComponent } from '../components/status-change-dialog/status-change-dialog.component';
import { IStatusChangeGroup } from '../model/interfaces/status-change-group.interface';
import { CHANGE_STATUS_DIALOG_OPTIONS, IChangeStatusDialogOptions } from '../model/interfaces/status-dialog-options.interface';
import { IStatusIdentifyable } from '../model/interfaces/status-identifyable-interface';
import { StatusIdentificationData } from '../model/interfaces/status-identification-data.interface';
import { IEntitySelection } from '@libs/platform/data-access';
import { HttpClient, HttpParams } from '@angular/common/http';

export abstract class BasicsSharedChangeStatusService<T extends IEntityIdentification, PT extends object, PU extends CompleteIdentification<PT>> {
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly http = inject(HttpClient);
	protected readonly httpService = inject(PlatformHttpService);
	protected readonly dialogService = inject(UiCommonDialogService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected abstract readonly statusConfiguration: IStatusChangeOptions<PT, PU>;
	protected abstract readonly dataService: IEntitySelection<T>;
	protected dataServiceCustom?: IEntitySelection<T>; // workaround to set another data service.

	protected getDataService(): IEntitySelection<T> {
		if (this.dataServiceCustom) {
			return this.dataServiceCustom;
		}
		return this.dataService;
	}

	/**
	 * get the entities which to be changed status
	 */
	public getSelecttion(): T[] {
		return this.getDataService().getSelection();
	}

	/**
	 * convert the selected entities to status identification
	 */
	public convertToStatusIdentification(selection: T[]): StatusIdentificationData[] {
		return selection.map((item) => ({ id: item.Id }));
	}

	public showNoSelectedItemsInfo() {
		this.messageBoxService.showInfoBox('cloud.common.noCurrentSelection', 'info', true);
	}

	/**
	 * Show the change status dialog
	 */
	public async showChangeStatusDialog(conf: IStatusChangeOptions<PT, PU>, statusGroup: IStatusChangeGroup[]) {
		const statusDialogOptions: IChangeStatusDialogOptions<PT, PU> = { statusChangeConf: conf, statusGroup };
		const modalOptions: ICustomDialogOptions<IStatusChangeResult, BasicsSharedStatusChangeDialogComponent> = {
			width: '30%',
			height: 'auto',
			minHeight: '600px',
			headerText: conf.title,
			buttons: [
				{
					id: 'history',
					fn: (evt, info) => info.dialog.body.onHistoryClicked(),
					isVisible: (info) => info.dialog.body.historyBtnVisible,
					caption: { key: 'history' },
				},
				{
					id: 'back',
					fn: (evt, info) => info.dialog.body.onBackBtnClicked(),
					isVisible: (info) => info.dialog.body.backBtnVisible,
					caption: { key: 'back' },
				},
				{
					id: 'next',
					fn: (evt, info) => info.dialog.body.onNextBntClicked(),
					isVisible: (info) => info.dialog.body.nextBtnVisible,
					isDisabled: (info) => info.dialog.body.nextBtnDisabled,
					caption: { key: 'next' },
				},
				{
					id: StandardDialogButtonId.Ok,
					fn: (evt, info) => {
						if (info.dialog.body.isLastGroup() && info.dialog.body.currentPage === StatusPage.result) {
							info.dialog.close(StandardDialogButtonId.Ok);
						} else {
							info.dialog.body.doChangeStatus();
						}
						return undefined;
					},
					isVisible: (info) => info.dialog.body.okBtnVisible,
					isDisabled: (info) => info.dialog.body.okBtnDisabled,
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
			resizeable: true,
			id: conf.guid,
			showCloseButton: true,
			bodyComponent: BasicsSharedStatusChangeDialogComponent,
			bodyProviders: [
				{ provide: CHANGE_STATUS_DIALOG_OPTIONS, useValue: statusDialogOptions },
				{ provide: BasicsSharedChangeStatusService, useValue: this },
			],
		};
		return await this.dialogService.show(modalOptions);
	}

	/**
	 * Fetches the status list and marks available statuses based on the provided parameters.
	 *
	 * @param {string} statusName - The name of the status to fetch.
	 * @param {number} fromStatusId - The ID of the status from which the transition starts.
	 * @param {number} [projectId] - The optional project ID to filter the statuses.
	 * @returns {Promise<IStatus[]>} - A promise that resolves to an array of status objects with availability marked.
	 * @throws {Error} - Throws an error if the status data could not be fetched.
	 */
	public async getStatus(statusName: string, fromStatusId: number, projectId?: number): Promise<IStatus[]> {
		// Combine the observables to fetch all statuses and available statuses
		const result = await lastValueFrom(combineLatest([this.getAllStatusList(statusName), this.getAvailableStatusList(statusName, fromStatusId, projectId)]));

		// Check if the result is undefined and throw an error if so
		if (!result) {
			throw new Error('Failed to fetch status data');
		}

		// Destructure the result into individual status lists
		const [res1, res2] = result;

		// Cast the results to their respective types
		const data = res1 as IStatus[];
		const availableStatus = res2 as number[];

		// Map through the data and mark the available statuses
		return data.map((d) => {
			d.isAvailable = fromStatusId === d.Id || availableStatus.findIndex((id) => id === d.Id) !== -1;
			return d;
		});
	}

	/**
	 * Fetches the available status list based on the provided parameters.
	 *
	 * @param {string} statusName - The name of the status to fetch.
	 * @param {number} fromStatusId - The ID of the status from which the transition starts.
	 * @param {number} [projectId] - The optional project ID to filter the statuses.
	 * @returns {Promise<number[]>} - A promise that resolves to an array of available status IDs.
	 */
	private async getAvailableStatusList(statusName: string, fromStatusId: number, projectId?: number): Promise<number[]> {
		let params = new HttpParams().set('statusName', statusName).set('statusFrom', fromStatusId.toString());
		if (projectId) {
			params = params.set('projectId', projectId.toString());
		}

		return await this.httpService.get<number[]>('basics/common/status/availablestatus', { params });
	}

	/**
	 * Fetches the complete status list based on the provided status name.
	 *
	 * @param {string} statusName - The name of the status to fetch.
	 * @returns {Promise<IStatus[]>} - A promise that resolves to an array of status objects.
	 */
	public async getAllStatusList(statusName: string): Promise<IStatus[]> {
		const params = new HttpParams().set('statusName', statusName);
		return await this.httpService.get<IStatus[]>('basics/common/status/list', { params });
	}

	/**
	 * Changes the status of multiple entities based on the provided configuration.
	 *
	 * @param {IStatusChangeOptions} conf - The configuration options for the status change.
	 * @param {number} fromStatusId - The ID of the current status.
	 * @param {number} toStatusId - The ID of the new status.
	 * @param {IIdentificationData[]} entityIds - The list of entity identification data.
	 * @param {string} remark - The remark or comment for the status change.
	 * @returns {Promise<IStatusChangeResult[]>} - A promise that resolves to an array of status change results.
	 * @throws {Error} - Throws an error if the entityIds array is empty.
	 */
	public async changeStatus(conf: IStatusChangeOptions<PT, PU>, fromStatusId: number, toStatusId: number, entityIds: IIdentificationData[], remark: string): Promise<IStatusChangeResult[]> {
		if (entityIds.length === 0) {
			throwError(() => {
				return 'entity should not empty';
			});
		}
		if (conf.hookExtensionOperation) {
			await conf.hookExtensionOperation(conf);
		}

		//TODO: Save the current selected entity first. And call back hook before changing the status. doAsyncValidationAndSaveBeforeChangeStatus

		return await this.httpService.post<IStatusChangeResult[]>('basics/common/status/changemultiplestatus', {
			StatusName: conf.statusName.toLowerCase(),
			DataItems: entityIds.map((e) => {
				return {
					FromStatusId: fromStatusId,
					ToStatusId: toStatusId,
					EntityId: e.id,
					StatusField: conf.statusField, //when get the current status id of the entity, use the field name get the value from entity
					EntityTypeName: conf.statusName.toLowerCase(),
					EntityPKey1: e.pKey1,
					EntityPKey2: e.pKey2,
					ProjectId: conf.projectId,
					CheckAccessRight: conf.checkAccessRight,
					HookExtensionOptions: conf.hookExtensionOptions,
					Remark: remark,
				};
			}),
		});
	}

	/**
	 * Saves a simple status change for a single entity.
	 *
	 * @param {IStatusChangeOptions} conf - The configuration options for the status change.
	 * @param {number} fromStatusId - The ID of the current status.
	 * @param {number} toStatusId - The ID of the new status.
	 * @param {IIdentificationData} entityId - The identification data of the entity.
	 * @returns {Promise<IStatusChangeResult[]>} - A promise that resolves to an array of status change results.
	 */
	public async saveSimpleStatus(conf: IStatusChangeOptions<PT, PU>, fromStatusId: number, toStatusId: number, entityId: IIdentificationData): Promise<IStatusChangeResult[]> {
		const queryPath = conf.updateUrl ?? 'basics/common/status/change';
		await this.http.post(queryPath, {
			StatusName: conf.statusName,
			StatusField: conf.statusField,
			OldStatusId: fromStatusId,
			NewStatusId: toStatusId,
			EntityId: entityId.id,
			EntityPKey1: entityId.pKey1,
			EntityPKey2: entityId.pKey2,
		});
		return [{ Result: true }] as IStatusChangeResult[];
	}

	/**
	 * start change status process
	 */
	public async startChangeStatusWizard() {
		const selectedEntities = this.getSelecttion();
		if (!selectedEntities?.length) {
			this.showNoSelectedItemsInfo();
			return false;
		}

		const isValid = await this.beforeStatusChanged();
		if(!isValid){
			return false;
		}

		const statusIdentDatas = this.convertToStatusIdentification(selectedEntities);
		const statusEntityIds = statusIdentDatas.map((id) => ({
			Id: id.id,
			StatusField: this.statusConfiguration.statusField,
			PKey1: id.pKey1,
			PKey2: id.pKey2,
		}));

		const statusIdentifyables = await this.httpService.post<IStatusIdentifyable[]>(`basics/common/status/getcurrentstatuses?statusname=${this.statusConfiguration.statusName}`, statusEntityIds);

		const groups: IStatusChangeGroup[] = [];

		statusIdentifyables.forEach((r) => {
			const fromId = r.CurrentStatusId;
			const identificationData = statusIdentDatas.find((i) => i.id === r.Id);
			if (!identificationData) {
				return;
			}

			const projectId = identificationData.projectId;
			let group = groups.find((g) => g.fromStatusId === fromId && g.projectId === projectId);
			if (!group) {
				group = {
					fromStatusId: fromId,
					entityIds: [identificationData],
					projectId: projectId,
					fromStatusName: r.Description,
				};
				groups.push(group);
			} else {
				group.entityIds.push(identificationData);
			}
		});

		const result = await this.showChangeStatusDialog(this.statusConfiguration, groups);
		if (result) {
			this.afterStatusChanged();
			return true;
		}
		return false;
	}

	/**
	 * Handles pre-status change operations.
	 *
	 * This method checks if the provided configuration option has a `rootDataService`.
	 * If it does, it calls the `save` method on the `rootDataService` to save any necessary data before changing the status.
	 * If `rootDataService` is not present, it resolves the promise immediately.
	 * This method should be implemented by subclasses to define specific pre-status change operations. such as validation before changing status
	 *
	 * @returns {Promise<boolean>} - A promise that resolves when the pre-status change operations are complete.
	 */
	public async beforeStatusChanged(): Promise<boolean> {
		await this.statusConfiguration.rootDataService?.save();
		return true;
	}


	/**
	 * Performs actions after the status change process is completed.
	 * This method should be implemented by subclasses to define specific actions
	 * such as refreshing entities or updating something.
	 */
	public afterStatusChanged(): void{
		this.statusConfiguration.rootDataService?.refreshSelected?.() ?? this.statusConfiguration.rootDataService?.refreshAll?.();
	}
}
