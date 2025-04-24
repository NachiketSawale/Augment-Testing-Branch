/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { TimekeepingTimeallocationHeaderDataService } from '../timekeeping-timeallocation-header-data.service';
import { FieldType, IFormConfig, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ITimeAllocationHeaderEntity } from '../../model/entities/time-allocation-header-entity.interface';
import { TimekeepingTimeallocationItemDataService } from '../timekeeping-timeallocation-item-data.service';
import { ITimeAllocationEntity } from '../../model/entities/time-allocation-entity.interface';


interface ApiResponseData {
	newEntities: ITimeAllocationHeaderEntity[],
	message: string;
}
interface AllocationResponseData {
	recordsCreateFor: ITimeAllocationEntity[],
	message: string;
	noAllocationDate:[];
	noDataForEmployeeAlloc:[];
}

interface ITimeAllocationRequired{
	CreateDailyResultHeaders: boolean,
	UseLogisticJob: boolean,
	CreateFrom: Date,
	CreateTo: Date,
	RunInUserContext: boolean,
	OnlyClerksOfCurrentUser: boolean
}

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeallocationCreateResultWizardService {

	private readonly translateService = inject(PlatformTranslateService);
	private readonly headerDataService = inject(TimekeepingTimeallocationHeaderDataService);
	private readonly itemDataService = inject(TimekeepingTimeallocationItemDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly http = inject(PlatformHttpService);

	public createResult(): void {
		const selectedHeaders = this.headerDataService.getSelection();

		if (!selectedHeaders || selectedHeaders.length === 0) {
			return;
		}

		const selectedHeaderIds = selectedHeaders.map((header: { Id: number }) => header.Id);
		const payload ={headerIds: selectedHeaderIds};
		this.http.post<ApiResponseData>('timekeeping/timeallocation/header/createresult', payload).then((response) => {
			let modalOptions: { showGrouping: boolean; bodyText: string; iconClass: string };

			if (response && response.newEntities && response.newEntities.length > 0) {
				modalOptions = {
					showGrouping: true,
					bodyText: this.translateService.instant('timekeeping.timeallocation.createResultSuccessful').text + response.message,
					iconClass: 'ico-info'
				};
				this.messageBoxService.showMsgBox(modalOptions);

			} else if (response && response.message) {
				modalOptions = {
					showGrouping: true,
					bodyText: response.message,
					iconClass: 'ico-error'
				};
			} else {
				modalOptions = {
					showGrouping: true,
					bodyText: this.translateService.instant('timekeeping.timeallocation.createResultFailed').text,
					iconClass: 'ico-info'
				};
			}
			this.messageBoxService.showMsgBox(modalOptions);
		});
	}

	public levelAllocatedTimes(): void {
		const selectedHeaders = this.headerDataService.getSelection();
		const header = this.headerDataService.getSelectedEntity()?.Id;
		const selectedAllocations = this.itemDataService.getSelection();

		if (!selectedHeaders || selectedHeaders.length === 0) {
			return;
		}
		const payload = {
			selectedHeaderId: header,
			selectedAllocations: selectedAllocations
		};
		this.http.post<AllocationResponseData>('timekeeping/timeallocation/item/levelallocatedtimes', payload).then((response) => {
			let modalOptions: { showGrouping: boolean; bodyText: string; iconClass: string };
			if (response && response.recordsCreateFor && response.recordsCreateFor.length > 0) {
				modalOptions = {
					showGrouping: true,
					bodyText: this.translateService.instant('timekeeping.timeallocation.levelAllocationTimesError0').text + response.recordsCreateFor.toString(),
					iconClass: 'ico-info'
				};
				this.messageBoxService.showMsgBox(modalOptions);
			}
			if (response && response.noAllocationDate && response.noAllocationDate.length > 0 ) {
				modalOptions = {
					showGrouping: true,
					bodyText: this.translateService.instant('timekeeping.timeallocation.levelAllocationTimesError2').text,
					iconClass: 'ico-error'
				};
				this.messageBoxService.showMsgBox(modalOptions);
			}
			if (response && response.noDataForEmployeeAlloc && response.noDataForEmployeeAlloc.length > 0) {
				modalOptions = {
					showGrouping: true,
					bodyText: this.translateService.instant('timekeeping.timeallocation.levelAllocationTimesError3').text,
					iconClass: 'ico-info'
				};
				this.messageBoxService.showMsgBox(modalOptions);
			}
		});
	}

	public createResultHeaders():void {

		this.formDialogService.showDialog<ITimeAllocationRequired>({
			headerText: 'timekeeping.timeallocation.createResultHeaders',
			formConfiguration: this.getFormConfiguration,
			entity: this.entityData,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
		})?.then(() => {
				this.handleOK();
		});
	}

	private getFormConfiguration: IFormConfig<ITimeAllocationRequired> = {
		formId: 'timekeeping.employee.createResourcesByEmployeesWizard',
		showGrouping: false,
		groups: [{groupId: 'baseGroup'}],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'createHeadersDaily',
				label: { key: 'timekeeping.timeallocation.createHeadersDaily' },
				type: FieldType.Boolean,
				model: 'createHeadersDaily',
				sortOrder: 1
			},
			{
				groupId: 'baseGroup',
				id: 'useLogisticJob',
				label: { key: 'timekeeping.timeallocation.useLogisticJob' },
				type: FieldType.Boolean,
				model: 'useLogisticJob',
				sortOrder: 2
			},
			{
				groupId: 'baseGroup',
				id: 'createFrom',
				label: { key: 'timekeeping.timeallocation.createFrom' },
				type: FieldType.DateUtc,
				model: 'createFrom',
				sortOrder: 3
			},
			{
				groupId: 'baseGroup',
				id: 'createTo',
				label: { key: 'timekeeping.timeallocation.createTo' },
				type: FieldType.DateUtc,
				model: 'createTo',
				sortOrder: 4
			},
			{
				groupId: 'baseGroup',
				id: 'runInUserContext',
				label: { key: 'timekeeping.timeallocation.runInUserContext' },
				type: FieldType.Boolean,
				model: 'runInUserContext',
				sortOrder: 5
			},
			{
				groupId: 'baseGroup',
				id: 'onlyCurrentUser',
				label: { key: 'timekeeping.timeallocation.onlyCurrentUser' },
				type: FieldType.Boolean,
				model: 'onlyCurrentUser',
				sortOrder: 6
			}
		]
	};

	public entityData: ITimeAllocationRequired = {
		CreateFrom: new Date(),
		CreateTo: new Date(),
		CreateDailyResultHeaders: false,
		UseLogisticJob: false,
		RunInUserContext: true,
		OnlyClerksOfCurrentUser: true
	};

	private handleOK() {
		const data = {
			CreateFrom: this.entityData.CreateFrom,
			CreateTo: this.entityData.CreateTo,
			CreateDailyResultHeaders: this.entityData.CreateDailyResultHeaders,
			UseLogisticJob: this.entityData.UseLogisticJob,
			RunInUserContext: this.entityData.RunInUserContext,
			OnlyClerksOfCurrentUser: this.entityData.OnlyClerksOfCurrentUser
		};

		this.http.post<ITimeAllocationHeaderEntity[]>('timekeeping/timeallocation/header/createresultheader', data).then(response => {
			const bodyText = response.length>0
				? 'timekeeping.timeallocation.wizardInfoOkGenerateResultHeaders'
				: 'timekeeping.timeallocation.wizardInfoNonGenerateResultHeaders';

			this.messageBoxService.showInfoBox(this.translateService.instant(bodyText).text, 'info', true);
			if (response.length>0) {
				this.headerDataService.refreshAll();
			}
		});
	}


}
