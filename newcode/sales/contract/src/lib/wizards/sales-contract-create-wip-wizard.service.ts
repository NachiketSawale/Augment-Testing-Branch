/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	FormRow,
	IEditorDialogResult,
	IFormConfig,
	IFormDialogConfig, IGridConfiguration, UiCommonFormDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import {
	BasicsSharedRubricCategoryByRubricAndCompanyLookupService, BasicsSharedRubricLookupService,
	Rubric
} from '@libs/basics/shared';
import { IOrdHeaderEntity, IOrdStatusEntity } from '@libs/sales/interfaces';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';
import { salesContractCreateWipRequestModel } from '../model/sales-contract-create-wip-request.model';
import { OrdPrcConfigModel } from '../model/ord-prc-configuration.model';
import { SalesContractCreateWipConfigurationLookupService } from '../lookup-services/sales-contract-create-wip-configuraton-lookup.service';
import { OrdStatusLookupService } from '../lookup-services/sales-contract-status-lookup.service';
import { SalesContractPreviousWipLookupService } from '../lookup-services/sales-contract-previous-wip-lookup.service';

@Injectable({
	providedIn: 'root'
})
export class SalesContractCreateWipWizardService {

	protected http = inject(HttpClient);
	public readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly dataService = inject(SalesContractContractsDataService);
	// Create bill wizard service
	public createWip() {
		const selections = this.dataService.getSelection()[0];
		if (!selections && selections == undefined) {
			this.messageBoxService.showInfoBox('Please select a record first', 'info', true);
			return;
		}
		// this.prepareFormData(selections);
		this.http.get(this.configurationService.webApiBaseUrl + 'sales/contract/status/list').subscribe(result => {
			const ordStatus = (result as IOrdStatusEntity[]).filter(item => item.Id === selections.OrdStatusFk)[0];
			if (!ordStatus.IsFinallyBilled && !ordStatus.IsOrdered) {
				this.messageBoxService.showInfoBox('sales.contract.wizardCWCreateBillNotOrderedWarning', 'info', true);
				return;
			}

			if (ordStatus.IsFinallyBilled) {
				this.messageBoxService.showInfoBox('sales.contract.wizardCWCreateBillContractFinallyBilled', 'info', true);
				return;
			}
			this.prepareFormData(selections);
		});
	}

	public wipHeaderIds: salesContractCreateWipRequestModel = {
		ConfigurationId: 0,
		PreviousWipId: 0,
		ContractIds: 0,
		Description: '',
		IncludeMainContract: false,
		IsCollectiveWip: false,
		RubricCategoryId: 0,
		SideContractIds: [],
	   items: []
	};
	public suggestedPreviousWipId() {
		const mainEntity = this.dataService.getSelection()[0];
		this.http.post(this.configurationService.webApiBaseUrl + 'sales/wip/suggestpreviouswipid?mainContractId='+mainEntity.Id,{}).subscribe(result => {
			this.wipHeaderIds.PreviousWipId = result !== null? <number>result: null;
		});
	}
	public getRubricCategoryFromType(){
		this.http.get(this.configurationService.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=prcconfiguration&filtervalue=(RubricFk%3D'+Rubric.WIP+'%20)',{
		}).subscribe(result => {
				const data = (result as OrdPrcConfigModel[]).filter(items => items.IsDefault)[0];
				this.wipHeaderIds.RubricCategoryId = data.RubricCategoryFk;
				this.changeConfigurationFromCategory(data.RubricCategoryFk);
		});
	}

	public changeConfigurationFromCategory(rubricCategoryFk: number){
		this.http.get(this.configurationService.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=prcconfiguration&filtervalue=(RubricFk%3D'+Rubric.WIP+'%20AND%20RubricCategoryFk%3D'+rubricCategoryFk+')',{}).subscribe(result => {
			const defaultData = (result as OrdPrcConfigModel[]).filter(item => item.IsDefault).slice(-1)[0];
			this.wipHeaderIds.ConfigurationId= defaultData.Id;
		});
	}

	private prepareFormData(selections: IOrdHeaderEntity) {

		const mainEntity = this.dataService.getSelection()[0];
		this.getRubricCategoryFromType();
		this.getRelatedContracts();
		this.suggestedPreviousWipId();
		const config: IFormDialogConfig<salesContractCreateWipRequestModel> = {
			headerText: {text: 'Create Bill from Contract'},
			formConfiguration: this.generateEditOptionRows(),
			customButtons: [],
			entity: this.wipHeaderIds
		};

		this.formDialogService.showDialog(config)?.then((result: IEditorDialogResult<salesContractCreateWipRequestModel>) => {
			if(result.closingButtonId === 'ok') {
				const wipEntity = result.value;
				const postData = {
					'ConfigurationId' : (wipEntity ? wipEntity.ConfigurationId : ''),
					'contractId' : mainEntity.Id,
					'contractIds' : null,
					'description' : (wipEntity ? wipEntity.Description : ''),
					'includeMainContract' : (wipEntity ? wipEntity.IncludeMainContract : ''),
					'isCollectiveWip' : (wipEntity ? wipEntity.IsCollectiveWip : ''),
					'rubricCategoryId' : (wipEntity ? wipEntity.RubricCategoryId : ''),
					'sideContractIds' : []
				};
				const queryPath = this.configurationService.webApiBaseUrl + 'sales/wip/createwipfromcontracts';
				this.http.post(queryPath, postData).subscribe(() => {
					this.messageBoxService.showInfoBox('WIP created successfully!', 'info', true);
					return;
				});
			}
		});
	}

	private generateEditOptionRows(): IFormConfig<salesContractCreateWipRequestModel> {
		let formRows: FormRow<salesContractCreateWipRequestModel>[] = [];
		formRows = [
			{
				id: 'CollectiveWIP',
				label: {
					text: 'CollectiveWIP',
				},
				type: FieldType.Boolean,
				model: 'IsCollectiveWip'
			},
			{
				id: 'Category',
				label: {
					text: 'Category',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
					serverSideFilter: {
						key: 'rubric-category-by-rubric-company-lookup-filter',
						execute() {
							return { Rubric: Rubric.WIP };
						},
					},
					showClearButton: false,
					readonly: false
				}),
				change: e => {
					if(e.newValue) {
						this.changeConfigurationFromCategory(e.newValue as number);
					}
				},
				model: 'RubricCategoryId',
				readonly: true
			},
			{
				id: 'Configuration',
				label: {
					text: 'Configuration',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesContractCreateWipConfigurationLookupService,
					showClearButton: true
				}),
				model: 'ConfigurationId'
			},
			{
				id: 'previousWipId',
				model: 'previousWipId',
				label: {
					text: 'Previous WIP',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesContractPreviousWipLookupService,
				}),
				readonly: false,
			},
			{
				id: 'Description',
				label: {
					text: 'Description',
				},
				type: FieldType.Description,
				model: 'Description'
			},
			{
				id: 'Contracts',
				label: {
					text: 'Contracts',
				},
				type: FieldType.Grid,
				configuration: this.gridConfiguration as IGridConfiguration<object>,
				height: 70,
				model: 'items'
			},
		];
		const formConfig: IFormConfig<salesContractCreateWipRequestModel> = {
			formId: 'editorOption',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: formRows
		};
		return formConfig;
	}

	private gridConfiguration: IGridConfiguration<IOrdHeaderEntity> = {
		uuid: '678f6d77c77d46638e9f126e6c17ae90',
		columns: [
				{
					id: 'isMrked',
					model: 'IsMarked',
					sortable: true,
					label: {
						text: 'Is Marked',
					},
					type: FieldType.Boolean,
					readonly: false,
					searchable: false,
					tooltip: {
						text: 'Select',
					},
					width: 60,
					visible: true,
					keyboard: {
						enter: false,
						tab: false,
					},
					pinned: true,
					sortOrder: 0,
				},
				{
					id: 'ordStatus',
					model: 'OrdStatusFk',
					sortable: true,
					label: {
						text: 'Status',
					},
					type: FieldType.Lookup,
				   lookupOptions:  createLookup({
						 dataServiceToken: OrdStatusLookupService,
						 readonly: true
					}),
					readonly: true,
					searchable: true,
					width: 150,
					visible: true,
				},
				{
					id: 'rubricCategory',
					model: 'RubricCategoryFk',
					sortable: true,
					label: {
						text: 'Rubric Category',
					},
					type: FieldType.Lookup,
				   lookupOptions: createLookup({
				     dataServiceToken: BasicsSharedRubricLookupService,
				     readonly: true
					}),
					readonly: true,
					searchable: true,
					width: 150,
					visible: true,
				},
				{
					id: 'code',
					model: 'Code',
					sortable: true,
					label: {
						text: 'Code',
					},
					type: FieldType.Description,
					readonly: true,
					searchable: true,
					width: 150,
					visible: true,
				},
			],
		// items: this.getRelatedContracts()
	};

	public getRelatedContracts() {
		const mainEntity = this.dataService.getSelection()[0];
		this.http.get(this.configurationService.webApiBaseUrl + 'sales/contract/relatedcontracts?contractId='+mainEntity.Id,{}).subscribe(result => {
				this.wipHeaderIds.items = result as IOrdHeaderEntity[];
		});
	}
}