import { Injectable, inject } from '@angular/core';
import {PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import {FieldType, IEditorDialogResult, IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonLookupDataFactoryService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ControllingStructureGridDataService } from '../services/controlling-structure-grid-data.service';
import { HttpClient } from '@angular/common/http';
import { IControllingUnitEntity } from '../model/models';
import { map, Observable } from 'rxjs';
import { IActivityEntity } from '@libs/scheduling/interfaces';

interface ICreateActivitiesParam {
	id: number;
	description: string;
	remark: string,
	cuCode: string,
}

@Injectable({
	providedIn: 'root'
})
export class ControllingStructureCreateActivitiesWizardService {
	private readonly http = inject(HttpClient);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);
	private formDialogService = inject(UiCommonFormDialogService);
	private readonly controllingUnitDataService = inject(ControllingStructureGridDataService);
	private readonly controllingStructureMainService = inject(ControllingStructureGridDataService);
	private readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);


	public getScheduleList(prjId: number): Observable<IActivityEntity[]> {
		return this.http.get<IActivityEntity[]>(`${this.configService.webApiBaseUrl}scheduling/schedule/list?mainItemID=${prjId}`).pipe(
			map(response => {
				return response;
			})
		);
	}
	public async onStartWizard() {
		const controlUnits = this.controllingStructureMainService.getSelectedEntity();
		const prjId = controlUnits ? controlUnits.ProjectFk : 0;

		const controllinUnitEntity = this.controllingUnitDataService.getSelectedEntity();
		if (controllinUnitEntity === null) {
			 await this.messageBoxService.showMsgBox(
				  this.translateService.instant('cloud.common.noCurrentSelection').text,
				  this.translateService.instant('cloud.common.errorMessage').text,
				  'ico-error'
			 );
			 return;
		}
		// Fetch schedule values first before proceeding
		this.getScheduleList(prjId as number).subscribe(scheduleList => {
			 const scheduleValues = scheduleList.map((schedule: IActivityEntity) => ({
				  id: schedule.Id,
				  displayName: schedule.DescriptionInfo?.Description ?? { text: '' }
				}));


			 // Now that scheduleValues is populated, open the modal
			 const entity: ICreateActivitiesParam = {
				  id: 0,
				  description: '',
				  remark: '',
				  cuCode: controlUnits ? controlUnits.Code : '',
			 };
			 const modalOptions: IFormDialogConfig<ICreateActivitiesParam> = {
				  headerText: this.translateService.instant('controlling.structure.createActivities').text,
				  showOkButton: true,
				  formConfiguration: {
						showGrouping: false,
						formId: 'controlling.structure.createActivities',
						groups: [{ groupId: 'baseGroup' }],
						rows: [
							 {
								  groupId: 'baseGroup',
								  id: 'description',
								  label: { key: 'controlling.structure.selectedSchedule' },
								  type: FieldType.Select,
								  itemsSource: {
										items: scheduleValues
								  },
								  model: 'Id',
							 },
						]
				  },
				  customButtons: [],
				  entity: entity
			 };
			 this.formDialogService.showDialog(modalOptions)?.then((result: IEditorDialogResult<ICreateActivitiesParam>) => {
				  if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
						const postData = {
							 Action: 9,
							 EffectedItemId: controlUnits ? controlUnits.Id : 0,
							 ScheduleId: result.value.id
						};
						this.http.post<IControllingUnitEntity[]>(
							 `${this.configService.webApiBaseUrl}scheduling/main/activity/execute`, postData
						).subscribe(response => {
							 this.messageBoxService.showMsgBox(
								  this.translateService.instant('cloud.common.doneSuccessfully').text,
								  this.translateService.instant('controlling.structure.createActivities').text,
								  'info'
							 );
						});
				  }
			 });
		});
   }
}









