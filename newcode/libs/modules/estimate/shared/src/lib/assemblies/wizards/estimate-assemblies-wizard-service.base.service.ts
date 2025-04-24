/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IFieldValueChangeInfo, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompleteIdentification, PlatformConfigurationService } from '@libs/platform/common';
import { IEstimateUpdateAssembliesRequestInfo } from '@libs/estimate/interfaces';
import { get, map } from 'lodash';
import { IEntitySelection, IRootRole } from '@libs/platform/data-access';

/**
 *
 */
export abstract class EstimateAssembliesWizardServiceBaseService<T extends object, PT extends object> {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly updateAssemblyPath = this.configService.webApiBaseUrl + 'estimate/main/resource/updateestimateassemblyresources';
	private readonly updateAssemblyStructurePath = this.configService.webApiBaseUrl + 'estimate/main/resource/updatprojectassemblystructure';
	private item: IEstimateUpdateAssembliesRequestInfo = {
		updateCostCodes: true,
		updateMaterials: true,
		updateAssemblyResources: true,
		updateCostTypes: false,
		updateParameter: false,
		selectUpdateScope: 1,
		updateCostGroup: 0,
	};

	/**
	 *
	 * @param option
	 * @protected
	 */
	protected constructor(
		private option: {
			// TODO: mainService,estimateAssembliesService should required, estimateAssembliesService was not ready to.
			mainService?: IRootRole<PT, CompleteIdentification<PT>>;
			estimateAssembliesService?: IEntitySelection<T>;
			estimateAssembliesFilterService?: { getFilterRequest: () => object } | null;
			isPrjAssembly?: boolean;
		},
	) {}

	/**
	 * ProjectAssembliesUpdateWizard class for handling project assemblies update wizard functionality.
	 */
	public updateAssemblies() {
		this.formDialogService
			.showDialog<IEstimateUpdateAssembliesRequestInfo>({
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
					this.updateAssembliesOk(result.value);
				}
			});
	}

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private updateAssembliesOk(result?: IEstimateUpdateAssembliesRequestInfo) {
		if (result) {
			// TODO: projectMainService.update()
			// $injector.get('projectMainService').update().then(() => {
				this.mergeRequestData(result);
				this.http.post(this.configService.webApiBaseUrl + 'estimate/main/resource/updateestimateassemblyresources', result).subscribe((res) => {});
			// });
		}
	}

	private mergeRequestData(result?: IEstimateUpdateAssembliesRequestInfo) {
		if (result) {
			let assemblyId = 0;
			let assemblyIds: number[] = [];
			let assemblyHeaderId = 0;
			if (this.option.estimateAssembliesFilterService) {
				result.filters = this.option.estimateAssembliesFilterService.getFilterRequest();
			}
			if (this.option.estimateAssembliesService) {
				const selected = this.option.estimateAssembliesService.getSelection();
				if (selected && selected.length > 0) {
					assemblyId = get(selected[0], 'Id') as number;
					assemblyIds = map(selected, 'Id') as number[];
					assemblyHeaderId = get(selected[0], 'EstHeaderFk') as number;
				}
			}
			result.assemblyId = assemblyId;
			result.assemblyHeaderId = assemblyHeaderId;
			result.assemblyIds = assemblyIds;
			if (this.option.isPrjAssembly) {
				result.IsPrjAssembly = true;
				result.ProjectId = 0; // $injector.get('projectMainService').getSelected();
				//TODO:
				/*if(result.data.selectUpdateScope === 3){
					assembliesSelected  =  _.filter(assembliesSelected,function (d) {
						return !d.readOnlyByJob;
					});
					result.data.assemblyIds = _.map(assembliesSelected, 'Id');
				}*/
			}
		}
	}

	/**
	 * Form configuration data.
	 */
	private updateAssembliesFormConfig: IFormConfig<IEstimateUpdateAssembliesRequestInfo> = {
		formId: 'estimate.assemblies.updateAssembliesWizard',
		showGrouping: true,
		groups: [
			{
				groupId: 'selectScope',
				header: { key: 'estimate.assemblies.updateAssembliesWizard.selectScope' },
				open: true,
			},
			{
				groupId: 'updateSetting',
				header: { key: 'estimate.assemblies.updateAssembliesWizard.updateSetting' },
				open: true,
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
	private onFieldChanged(changeInfo: IFieldValueChangeInfo<IEstimateUpdateAssembliesRequestInfo>) {
		if (!changeInfo.entity.updateCostCodes && !changeInfo.entity.updateMaterials) {
			changeInfo.entity.updateCostTypes = false;
		}
	}

	/**
	 * ProjectAssembliesUpdateWizard class for handling assemblies update wizard functionality.
	 */
	public updateAssemblyStructure() {
		this.formDialogService
			.showDialog<IEstimateUpdateAssembliesRequestInfo>({
				headerText: { key: 'estimate.assemblies.updateAssemblyStructureWizard.title' },
				formConfiguration: this.updateAssembliesStructureFormConfig,
				entity: this.item,
				runtime: undefined,
				customButtons: [],
				topDescription: '',
				width: '1200px',
				maxHeight: 'max',
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.updateAssemblyStructureOk(result.value);
				}
			});
	}

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private updateAssemblyStructureOk(result?: IEstimateUpdateAssembliesRequestInfo) {
		if (result) {
			// TODO: projectMainService.update()
			// $injector.get('projectMainService').update().then(() => {
				this.mergeRequestData(result);
				this.http.post(this.configService.webApiBaseUrl + 'estimate/main/resource/updatprojectassemblystructure', result).subscribe(function () {});
			// });
		}
	}

	/**
	 * Form configuration data.
	 */
	private updateAssembliesStructureFormConfig: IFormConfig<IEstimateUpdateAssembliesRequestInfo> = {
		formId: 'estimate.assemblies.updateAssembliesWizard',
		showGrouping: true,
		groups: [
			{
				groupId: 'selectScope',
				header: { key: 'estimate.assemblies.updateAssembliesWizard.selectScope' },
				open: true,
			},

			{
				groupId: 'updateOption',
				header: { key: 'estimate.assemblies.updateAssembliesWizard.updateOption' },
				open: true,
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
				groupId: 'updateOption',
				id: 'updateCostGroup',
				label: {
					key: 'bestimate.assemblies.updateAssembliesWizard.updateCostGroup',
				},
				type: FieldType.Boolean,
				model: 'updateCostGroup',
				sortOrder: 1,
				change: this.onFieldChanged,
			},
		],
	};
}
