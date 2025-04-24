/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { TimekeepingTimeallocationHeaderDataService } from '../timekeeping-timeallocation-header-data.service';
import { createLookup, FieldType, IFormConfig, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { ITimeAllocationHeaderEntity } from '../../model/entities/time-allocation-header-entity.interface';
import { ProjectSharedLookupService } from '@libs/project/shared';


interface IResponse{
	message:string
}
interface IDispatchingResultData {
	job1fk: number| null|undefined;
	job2fk: number| null|undefined;
	rubric: number| null|undefined;
	code: string;
	desc: null;
	IsCreatePES: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeallocationCreateDispatchingRecordsWizard {

	private readonly headerDataService = inject(TimekeepingTimeallocationHeaderDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly http = inject(PlatformHttpService);


	public createDispatchingRecords():void {
		const selected = this.headerDataService.getSelectedEntity();
		if (!selected) {
			const modalOptions = {
				headerText: 'timekeeping.timeallocation.createDispatchingHeader',
				bodyText: 'timekeeping.timeallocation.selectrecord',
				iconClass: 'ico-info'
			};
			this.messageBoxService.showMsgBox(modalOptions);
			return;
		}
		let defaultrubric: number;
		this.http.post<number>('logistic/dispatching/header/getdefaultrubriccategory', {}).then(response => {
			defaultrubric = response;

			const entityData: IDispatchingResultData = {
				job1fk: selected?.JobFk,
				job2fk: selected?.JobFk,
				rubric: defaultrubric?defaultrubric:0,
				code: 'Is generated',
				desc: null,
				IsCreatePES: true,
			};

			this.formDialogService.showDialog<IDispatchingResultData>({
				headerText: 'timekeeping.timeallocation.createResultHeaders',
				formConfiguration: this.getFormConfiguration,
				entity: entityData,
				runtime: undefined,
				customButtons: [],
				topDescription: '',
			})?.then(() => {
				this.handleOk(selected,entityData);
			});
		});
	}


	private getFormConfiguration: IFormConfig<IDispatchingResultData> = {
		formId: 'timekeeping.employee.createResourcesByEmployeesWizard',
		showGrouping: false,
		groups: [{groupId: 'baseGroup'}],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'job1fk',
				label: {
					key: 'timekeeping.timeallocation.performingJob',
				},
				type: FieldType.Lookup,
				model: 'job1fk',
				required: true,
				sortOrder: 1,
				lookupOptions:  createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					descriptionMember: 'ProjectNo',
				})
			},
			{
				groupId: 'baseGroup',
				id: 'job2fk',
				label: {
					key: 'timekeeping.timeallocation.receivingJob',
				},
				type: FieldType.Lookup,
				model: 'job2fk',
				required: true,
				sortOrder: 2,
				lookupOptions:  createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					descriptionMember: 'ProjectNo',
				})
			},
			{
				groupId: 'baseGroup',
				id: 'code',
				label: { key: 'timekeeping.timeallocation.code' },
				type: FieldType.Code,
				model: 'code',
				required: true,
				readonly:true,
				sortOrder: 4
			},
			{
				groupId: 'baseGroup',
				id: 'desc',
				label: { key: 'timekeeping.timeallocation.desciption' },
				type: FieldType.Description,
				model: 'desc',
				required: false,
				sortOrder: 5
			},
			{
				groupId: 'baseGroup',
				id: 'IsCreatePES',
				label: { key: 'timekeeping.timeallocation.createpes' },
				type: FieldType.Boolean,
				model: 'IsCreatePES',
				required: false,
				sortOrder: 6
			}
		]
	};

	private handleOk(selected: ITimeAllocationHeaderEntity,entityData:IDispatchingResultData): void {
		if (!entityData.job1fk) {
			this.messageBoxService.showInfoBox('timekeeping.timeallocation.selectrecordjob', 'info', true);
			return;
		}
		if (!entityData.job2fk) {
			this.messageBoxService.showInfoBox('timekeeping.timeallocation.selectreceiveingjob', 'info', true);
			return;
		}

		const postData = {
			PKey: selected.Id,
			perfJob: entityData.job1fk,
			receivJob: entityData.job2fk,
			rubric: entityData.rubric,
			code: entityData.code,
			desc: entityData.desc,
			IsCreatePES: entityData.IsCreatePES
		};

		this.http.post<IResponse>('timekeeping/timeallocation/header/createDispatchingRecords', postData).then(response => {
			if (response && response.message) {
				this.messageBoxService.showInfoBox(response.message, 'info', true);
			}
		});
	}
}
