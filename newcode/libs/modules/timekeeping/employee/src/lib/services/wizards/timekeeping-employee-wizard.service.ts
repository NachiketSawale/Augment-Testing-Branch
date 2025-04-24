import { inject, Injectable } from '@angular/core';
import { TimekeepingEmployeeDataService } from '../timekeeping-employee-data.service';
import { PlatformTranslateService, PlatformHttpService } from '@libs/platform/common';
import { createLookup, FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IResourceByEmployeeWizardEntity } from '@libs/timekeeping/interfaces';
import { ResourceTypeLookupService } from '@libs/resource/shared';
import { BasicsSharedResResourceKindLookupService, BasicsSharedResourceGroupLookupService, BasicsSharedCostCodeLookupService, BasicsSharedUomLookupService, BasicsSharedSiteLookupService } from '@libs/basics/shared';
import { TimekeepingEmployeeSkillDataService } from '../timekeeping-employee-skill-data.service';
import { ITimekeepingEmployeeListEntityInterface } from '../../model/wizards/timekeeping-employee-list-entity.interface';
import { TimekeepingTimeSymbolLookupService } from '@libs/timekeeping/shared';
import { IResourceResponse } from '../../model/wizards/timekeeping-resource-entity.interface';


@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeWizardService {

	private arrowIcon = ' &#10148; '; //ToDo Icon not display


	private readonly http = inject(PlatformHttpService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly timekeepingEmployeeDataService: TimekeepingEmployeeDataService = inject(TimekeepingEmployeeDataService);
	private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly timekeepingEmployeeSkillDataService: TimekeepingEmployeeSkillDataService = inject(TimekeepingEmployeeSkillDataService);

	public createResources() {
		const selectedEmployees = this.timekeepingEmployeeDataService.getSelectedEntity();
		const employeesArray = Array.isArray(selectedEmployees) ? selectedEmployees : [selectedEmployees];

		// Extract Ids and filter out undefined ones
		const employeeIds: number[] = employeesArray
			.filter(employee => employee && employee.Id !== undefined)
			.map(employee => employee.Id);

		this.http.post<number>('timekeeping/employee/wizard/getdefaulttimeunit', {}).then(response => {
			if (response) {
				const isValid = this.validateEmployees(employeeIds);
				if (isValid) {
					this.initializeModalConfig(employeeIds);
				}
			}
		});
	}

	private initializeModalConfig(employeeIds: number[]) {

		this.formDialogService.showDialog<IResourceByEmployeeWizardEntity>({
			headerText: 'timekeeping.employee.CreateResource',
			formConfiguration: this.getFormConfiguration,
			entity: this.TimekeepingEmployee,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
			width: '1200px',
			maxHeight: 'max',
		})?.then((result: IEditorDialogResult<IResourceByEmployeeWizardEntity>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				this.handleOK(employeeIds, result.value);
			}
		});
	}

	private getFormConfiguration: IFormConfig<IResourceByEmployeeWizardEntity> = {
		formId: 'timekeeping.employee.createResourcesByEmployeesWizard',
		showGrouping: false,
		groups: [{groupId: 'baseGroup'}],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'group',
				label: {
					key: 'timekeeping.employee.createResourcesByEmployeesWizard.Site',
				},
				type: FieldType.Lookup,
				model: 'SiteFk',
				required: true,
				sortOrder: 1,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedSiteLookupService
				})
			},
			{
				groupId: 'baseGroup',
				id: 'resType',
				label: {key: 'timekeeping.employee.createResourcesByEmployeesWizard.resType'},
				type: FieldType.Lookup,
				model: 'ResTypeFk',
				required: true,
				sortOrder: 2,
				lookupOptions: createLookup({
					dataServiceToken: ResourceTypeLookupService
				})
			},
			{
				groupId: 'baseGroup',
				id: 'resKind',
				label: {key: 'timekeeping.employee.createResourcesByEmployeesWizard.resKind'},
				type: FieldType.Lookup,
				model: 'ResKindFk',
				required: true,
				sortOrder: 3,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedResResourceKindLookupService,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated',
				})
			},
			{
				groupId: 'baseGroup',
				id: 'resGroup',
				label: {key: 'timekeeping.employee.createResourcesByEmployeesWizard.resGroup'},
				type: FieldType.Lookup,
				model: 'ResGroupFk',
				required: true,
				sortOrder: 4,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedResourceGroupLookupService,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated',
				})
			},
			{
				groupId: 'baseGroup',
				id: 'uomTime',
				label: {key: 'timekeeping.employee.createResourcesByEmployeesWizard.uomTime'},
				type: FieldType.Lookup,
				model: 'UoMTimeFk',
				required: true,
				sortOrder: 6,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService // Todo Not able to set defaultTimeUnit
				})
			},
			{
				groupId: 'baseGroup',
				id: 'costCode',
				label: {key: 'timekeeping.employee.createResourcesByEmployeesWizard.costCode'},
				type: FieldType.Lookup,
				model: 'CostCodeFk',
				readonly: false,
				sortOrder: 5,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCostCodeLookupService,
				})

			}
		]
	};
	/**
	 * copyOptions dialog form controls data. let selected = this.dataService.getSelection();
	 */
	public TimekeepingEmployee: IResourceByEmployeeWizardEntity = {
		JobFk: 0, MaterialFk: 0, ProjectFk: 0,
		CostCodeFk: 0, ResGroupFk: 0, ResKindFk: 0, ResTypeFk: 0, SiteFk: 0, UoMTimeFk: 0
	};

	private handleOK(employeeIds: number[], dialogResource: IResourceByEmployeeWizardEntity) {
		const data = {
			SiteFk: dialogResource.SiteFk,
			ResTypeFk: dialogResource.ResTypeFk,
			ResKindFk: dialogResource.ResKindFk,
			ResGroupFk: dialogResource.ResGroupFk,
			UoMTimeFk: dialogResource.UoMTimeFk,
			CostCodeFk: dialogResource.CostCodeFk,
			EmployeeFks: [employeeIds]
		};

		this.http.post<IResourceResponse[]>('timekeeping/employee/wizard/createresourcesbyemployees', data).then(response => {
			if (response) {
				const infoString = this.informationStringForGeneratedResources(response);
				const notGeneratedInfoStringItems = this.informationStringForNotGeneratedResources(response);
				const generatedInfoString = this.translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.generatedInfo').text;
				const generalItemInfoString = `${response.length} ${generatedInfoString}<br/>`;
				const generalNotGeneratedInfoString = this.translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.genaralNotGeneratedInfo').text + '<br/>';
				const notGeneratedInfoString = notGeneratedInfoStringItems ? generalNotGeneratedInfoString + notGeneratedInfoStringItems : '';
				const bodyText = generalItemInfoString + infoString + '<br/>' + notGeneratedInfoString;
				this.messageBoxService.showInfoBox(bodyText, 'info', true);
			} else {
				this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.noGeneratedAtAllInfo').text, 'info', true);
			}
			//ToDO For now we are not able to set default value setDefaultResourceKind remaining
		});
	}

	private validateEmployees(resources: number[]): boolean {
		if (resources.length > 0) {
			return true;
		}
		this.messageBoxService.showInfoBox('noCurrentSelection', 'info', true);
		return false;
	}

	private informationStringForGeneratedResources(dataResourceResults: IResourceResponse[]): string {
		return dataResourceResults.map(resourceItem => `${this.arrowIcon}${resourceItem.Code}`).join('<br/>');
	}

	private informationStringForNotGeneratedResources(dataResourceResults: IResourceResponse[]): string {
		const selectedEmployees = this.timekeepingEmployeeDataService.getSelection();
		let infoString = '';
		selectedEmployees.forEach(employee => {
			let isGenerated = false;
			dataResourceResults.forEach(resource => {
				if (employee.Code === resource.Code) {
					isGenerated = true;
				}
			});
			if (!isGenerated) {
				infoString += this.arrowIcon + employee.Code + '<br/>';
			}
		});
		return infoString;
	}

	public generatePlannedAbsences() {
		this.formDialogService.showDialog<ITimekeepingEmployeeListEntityInterface>({
			headerText: 'timekeeping.employee.CreateResource',
			formConfiguration: this.getPlannedAbsenceFormConfiguration,
			entity: this.GeneratePlannedAbsenceForm,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
			width: '1200px',
			maxHeight: 'max',
		})?.then((result: IEditorDialogResult<ITimekeepingEmployeeListEntityInterface>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				this.generatePlannedAbsencesHandleOK(result.value);
			}
		});
	}

	private getPlannedAbsenceFormConfiguration: IFormConfig<ITimekeepingEmployeeListEntityInterface> = {
		formId: 'timekeeping.employee.createResourcesByEmployeesWizard',
		showGrouping: false,
		groups: [{groupId: 'baseGroup'}],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'timesymbolfk',
				label: {
					key: 'timekeeping.employee.entityTimesymbolFk',
				},
				type: FieldType.Lookup,
				model: 'TimesymbolFk',
				required: true,
				sortOrder: 1,
				lookupOptions: createLookup({
					dataServiceToken: TimekeepingTimeSymbolLookupService,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated'
				})
			}
		]
	};
	/**
	 * copyOptions dialog form controls data. let selected = this.dataService.getSelection();
	 */
	public GeneratePlannedAbsenceForm: ITimekeepingEmployeeListEntityInterface = {
		EmployeeFk: 0, LogMsg: '', SkillId: [], TimesymbolFk: 0
	};

	private generatePlannedAbsencesHandleOK(result: ITimekeepingEmployeeListEntityInterface) {
		const getEmpFk = this.timekeepingEmployeeSkillDataService.getSelectedEntity()?.EmployeeFk;
		const getSkillIds = this.timekeepingEmployeeSkillDataService.getSelection();
		const skillIds = getSkillIds.map(skill => skill.Id);

		if (!result) {
			this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.noTimesymbolSelected').text, 'info', true);
		} else {
			const data = {
				timesymbolFk: result.TimesymbolFk,
				employeeFk: getEmpFk,
				skillId: skillIds,
			};

			this.http.post<ITimekeepingEmployeeListEntityInterface>('timekeeping/employee/generateplannedabsences', data).then(response => {
				if (response) {
					if (response.LogMsg) {
						this.messageBoxService.showInfoBox(response.LogMsg, 'info', true);
					} else {
						this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.generatedInfo').text, 'info', true);
					}
				} else {
					this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.noGeneratedAtAllInfo').text, 'info', true);
				}
			}).catch(error => {
			console.error('Error during the post request', error);
			this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.requestError.').text, 'error', true);
		});
		}

	}
}



