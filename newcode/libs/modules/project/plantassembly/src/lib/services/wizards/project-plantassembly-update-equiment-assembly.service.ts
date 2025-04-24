/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IProjectPlantAssemblyUpdateEquimentAssemblies } from '../../model/interfaces/project-plantassembly-update-equipment-assembly.interface';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root',
})

/**
 * @class ProjectPlantassemblyUpdateEuimentAssemblyService
 * @brief Service class for handling the update of equipment assemblies in a project.
 */
export class ProjectPlantassemblyUpdateEquimentAssemblyService {
	private http = inject(HttpClient);
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly projectMainDataService = inject(ProjectMainDataService);
	private GetEquipmentAssemblyCostUnitAlwaysEditable!: boolean;
	private noteText = 'project.main.updatePlantAssemblyWizard.wizardNoteText';

	private item: IProjectPlantAssemblyUpdateEquimentAssemblies = {
		UpdateCostCodes: true,
		UpdateMaterials: true,
		UpdateAssembly: true,
		UpdateMultipliersFrmPlantEstimate: false,
		SelectUpdateScope: 1,
		NoteText: this.noteText,
	};

	private getSystemOption() {
		const endPointURL: string = 'estimate/main/lineitem/GetEquipmentAssemblyCostUnitAlwaysEditableFlag';
		const http = ServiceLocator.injector.get(HttpClient);
		return http.get<boolean>(this.configService.webApiBaseUrl + endPointURL);
	}

	/**
	 * @brief Asynchronously updates the equipment assembly by showing a dialog for user input.
	 *
	 * This method opens a dialog using the `formDialogService` to gather data for updating
	 * the equipment assembly. If the user confirms the update by clicking the 'Ok' button,
	 */
	public async updateEquipmentAssembly() {
		this.getSystemOption().subscribe((response) => {
			this.GetEquipmentAssemblyCostUnitAlwaysEditable = response;
		});
		const result = this.formDialogService
			.showDialog<IProjectPlantAssemblyUpdateEquimentAssemblies>({
				headerText: { key: 'project.main.updatePlantAssemblyWizard.wizardTitle' },
				formConfiguration: this.updateEquipmentAssemblyFormConfig,
				entity: this.item,
				runtime: undefined,
				customButtons: [],
				topDescription: '',
				width: '800px',
				maxHeight: 'max',
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOk(result);
				}
			});

		return result;
	}
	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<IProjectPlantAssemblyUpdateEquimentAssemblies>) {
		const isPrjAssembly = true;
		// TODO : estimateAssembliesFilterService is not ready
		if (result && result && result.value) {
			//result.data.filters = projectPlantAssemblyFilterService.getFilterRequest();    // TODO:  projectPlantAssemblyFilterService is not ready

			if (isPrjAssembly) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const project = this.projectMainDataService.getSelection();

				// result.data.ProjectId = project ? project.Id : 0;
				//result.data.UpdateAssemblyResources = result.data.updateAssembly;
			}
		}

		this.http.post(this.configService.webApiBaseUrl + 'estimate/main/resource/updatprojectplantassemblystructure', result.value).subscribe((sucess) => {
			if (isPrjAssembly) {
				this.projectMainDataService.refreshAll();
			} else {
				//	estimateAssembliesService.refresh();   //  TODO: estimateAssembliesService not ready
			}
		});
	}

	/**
	 * Form configuration data.
	 */
	private updateEquipmentAssemblyFormConfig: IFormConfig<IProjectPlantAssemblyUpdateEquimentAssemblies> = {
		formId: 'project.main.updatePlantAssemblyWizard',
		showGrouping: true,

		groups: [
			{
				groupId: 'selectScope',
				header: { key: 'project.plantassembly.updatePlantAssemblyWizard.selectScope' },
				open: true,
				//TODO: 'attributes' are missing in the groups
			},
			{
				groupId: 'updateSetting',
				header: { key: 'project.plantassembly.updatePlantAssemblyWizard.updateSetting' },
				visible: !this.GetEquipmentAssemblyCostUnitAlwaysEditable,

				//TODO: 'attributes' are missing in the groups
			},
		],
		rows: [
			{
				groupId: 'selectScope',
				id: 'selectUpdateScope',
				label: {
					key: 'project.plantassembly.updatePlantAssemblyWizard.selectUpdateScope',
				},
				type: FieldType.Radio,
				itemsSource: {
					items: [
						{
							id: 3,
							displayName: { key: 'project.main.updatePlantAssemblyWizard.highlightedAssembly' },
						},

						{
							id: 2,
							displayName: { key: 'project.main.updatePlantAssemblyWizard.currentResultSet' },
						},
						{
							id: 1,
							displayName: { key: 'project.main.updatePlantAssemblyWizard.entireAssemblies' },
						},
					],
				},
			},

			{
				groupId: 'selectScope',
				id: 'UpdateMultipliersFrmPlantEstimate',
				label: {
					key: 'project.main.updatePlantAssemblyWizard.UpdateMultipliersFrmPlantEstimate',
				},
				type: FieldType.Boolean,
				model: 'UpdateMultipliersFrmPlantEstimate',
			},

			{
				groupId: 'updateSetting',
				id: 'updateCostCodes',
				label: {
					key: 'project.main.updatePlantAssemblyWizard.updateCostCodes',
				},
				type: FieldType.Boolean,
				model: 'updateCostCodes',
				sortOrder: 1,
			},
			{
				groupId: 'updateSetting',
				id: 'updateMaterials',
				label: {
					key: 'project.main.updatePlantAssemblyWizard.updateMaterials',
				},
				type: FieldType.Boolean,
				model: 'updateMaterials',
				sortOrder: 2,
			},

			{
				groupId: 'updateSetting',
				id: 'updateAssembly',
				label: {
					key: 'project.main.updatePlantAssemblyWizard.updateAssembly',
				},
				type: FieldType.Boolean,
				model: 'updateAssembly',
				sortOrder: 3,
			},
			{
				groupId: 'updateSetting',
				id: 'note',
				label: {
					key: 'project.main.updatePlantAssemblyWizard.noteText',
				},
				type: FieldType.Comment,
				model: 'noteText',
				sortOrder: 4,
			},
		],
	};
}
