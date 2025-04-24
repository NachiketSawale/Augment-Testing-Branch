/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFieldValueChangeInfo, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IEstimateUpdateAssemblies } from '../model/interfaces/estimate-assemblies-update-assemblies.interface';


@Injectable({ providedIn: 'root' })

/**
 * EstimateUpdateAssembliesWizardService
 * Service for updating assemblies.
 */
export class EstimateUpdateAssembliesWizardService {
	public constructor() {}

	private formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	public item: IEstimateUpdateAssemblies = {
		updateCostCodes: false,
		updateMaterials: false,
		updateAssemblyResources: false,
		updateCostTypes: false,
		updateParameter: false,
		selectUpdateScope: 1,
	};

	/**
	 * AssembliesUpdateWizard class for handling assemblies update wizard functionality.
	 */
	public updateAssemblies() {
		this.formDialogService
			.showDialog<IEstimateUpdateAssemblies>({
				headerText: { key: 'estimate.assemblies.updateAssembliesWizard.title' },
				formConfiguration: this.updateAssembliesFormConfig,
				entity: this.item,
				runtime: undefined,
				customButtons: [],
				topDescription: '',
				width: '1200px',
				maxHeight: 'max',
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOk(result);
				}
			});
	}

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<IEstimateUpdateAssemblies>) {
		// TODO : estimateAssembliesFilterService is not ready
		this.http.post(this.configService.webApiBaseUrl + 'estimate/main/resource/updateestimateassemblyresources', result).subscribe(function () {});
	}

	/**
	 * Form configuration data.
	 */
	private updateAssembliesFormConfig: IFormConfig<IEstimateUpdateAssemblies> = {
		formId: 'estimate.assemblies.updateAssembliesWizard',
		showGrouping: true,

		groups: [
			{
				groupId: 'selectScope',
				header: { key: 'estimate.assemblies.updateAssembliesWizard.selectScope' },
				open: true,
				//TODO: 'attributes' are missing in the groups
			},

			{
				groupId: 'updateSetting',
				header: { key: 'estimate.assemblies.updateAssembliesWizard.updateSetting' },
				open: true,
				//TODO: 'attributes' are missing in the groups
			},
		],
		rows: [
			{
				groupId: 'selectScope',
				id: 'selectUpdateScope',
				label: {
					key: 'estimate.assemblies.updateAssembliesWizard.selectUpdateScope',
				},
				type: FieldType.Radio,
				itemsSource: {
					items: [
						{
							id: 3,
							displayName: { key: 'estimate.assemblies.updateAssembliesWizard.highlightedAssembly' },
						},

						{
							id: 2,
							displayName: { key: 'estimate.assemblies.updateAssembliesWizard.currentResultSet' },
						},
						{
							id: 1,
							displayName: { key: 'estimate.assemblies.updateAssembliesWizard.entireAssemblies' },
						},
					],
				},
			},

			{
				groupId: 'updateSetting',
				id: 'updateCostCodes',
				label: {
					key: 'bestimate.assemblies.updateAssembliesWizard.updateCostCodes',
				},
				type: FieldType.Boolean,
				model: 'updateCostCodes',
				sortOrder: 1,
				change: this.onFieldChanged,
			},

			{
				groupId: 'updateSetting',
				id: 'updateMaterials',
				label: {
					key: 'estimate.assemblies.updateAssembliesWizard.updateMaterials',
				},
				type: FieldType.Boolean,
				model: 'updateMaterials',
				sortOrder: 2,
				change: this.onFieldChanged,
			},
			{
				groupId: 'updateSetting',
				id: 'updateAssemblyResources',
				label: {
					key: 'estimate.assemblies.updateAssembliesWizard.updateAssemblyResources',
				},
				type: FieldType.Boolean,
				model: 'updateAssemblyResources',
				sortOrder: 3,
			},
			{
				groupId: 'updateSetting',
				id: 'updateCostTypes',
				label: {
					key: 'estimate.assemblies.updateAssembliesWizard.updateCostTypes',
				},
				type: FieldType.Boolean,
				model: 'updateCostTypes',
				readonly: true,
				sortOrder: 4,
			},
			{
				groupId: 'updateSetting',
				id: 'updateParameter',
				label: {
					key: 'estimate.assemblies.updateAssembliesWizard.updateParameter',
				},
				type: FieldType.Boolean,
				model: 'updateParameter',
				sortOrder: 5,
			},
		],
	};

/**
 * Handles field changes in the context of item update.
 */
	private onFieldChanged(changeInfo: IFieldValueChangeInfo<IEstimateUpdateAssemblies>) {
		if (!changeInfo.entity.updateCostCodes && !changeInfo.entity.updateMaterials) {
			changeInfo.entity.updateCostTypes = false;
		}
	}
}
