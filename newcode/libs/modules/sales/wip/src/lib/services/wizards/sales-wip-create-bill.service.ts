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
import { SalesWipWipsDataService } from '../sales-wip-wips-data.service';
import { ICreateBillFromWipRequestEntityGenerated } from '../../model/entities/create-bill-from-wip-request-entity.interface';
import { IWipHeaderEntity } from '../../model/entities/wip-header-entity.interface';
import { SalesWipPreviousBillLookupService } from '../../lookups/sales-wip-previous-bill-lookup.service';
import { IBillTypeEntity, SalesContractBillTypeLookupService } from '@libs/sales/contract';
import { IWipStatusEntity } from '../../model/entities/wip-status-entity.interface';
import { WipPrcConfigurationModel } from '../../model/wip-prc-configuration.model';
import { SalesWipCreateBillConfigurationLookupService } from '../../lookups/sales-wip-create-bill-configuration-lookup.service';
import { SalesWipBillCreationBillToLookupService } from '../../lookups/sales-wip-bill-creation-bill-to-lookup.service';

@Injectable({
	providedIn: 'root'
})
export class SalesWipCreateBillService {

	protected http = inject(HttpClient);
	public readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly dataService = inject(SalesWipWipsDataService);

	// Create bill wizard service
	public createBill() {
		const selections = this.dataService.getSelection()[0];

		if (!selections && selections == undefined) {
			this.messageBoxService.showInfoBox('Please select a record first', 'info', true);
			return;
		}
		this.http.get(this.configurationService.webApiBaseUrl + 'sales/wip/status/list').subscribe(result => {
			const wipStatus = (result as IWipStatusEntity[]).filter(item => item.Id === selections.WipStatusFk)[0];
			if (!wipStatus.IsAccepted) {
				this.messageBoxService.showInfoBox('sales.wip.wizardCWCreateBillWipNotOrderedInfo', 'info', true);
				return;
			}else {
				this.prepareFormData(selections);
			}
		});
	}

	public BilHeaderIds: ICreateBillFromWipRequestEntityGenerated = {
		BillNo: 'Is generated',
		Description: '',
		RubricCategoryFk: 0,
		ConfigurationId:0,
		PreviousBillFk:0,
		TypeFk: 0,
		BillTo: 0,
		wipIds:[this.dataService.getSelection()[0]]
	};

	public getRubricCategoryFromType(){
		this.http.post(this.configurationService.webApiBaseUrl + 'basics/customize/BillType/list',{}).subscribe(result => {
			const defaultData = (result as IBillTypeEntity[]).filter(items => items.IsDefault)[0];
			this.BilHeaderIds.TypeFk = defaultData.Id;
			this.BilHeaderIds.RubricCategoryFk= defaultData.RubricCategoryFk;
			this.changeConfigurationFromCategory(defaultData.RubricCategoryFk);
		});
	}

	public changeConfigurationFromCategory(rubricCategoryFk: number){
		this.http.get(this.configurationService.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=prcconfiguration&filtervalue=(RubricFk%3D'+Rubric.Bill+'%20AND%20RubricCategoryFk%3D'+this.BilHeaderIds.RubricCategoryFk+')',{}).subscribe(result => {
			const defaultData = (result as WipPrcConfigurationModel[]).filter(item => item.IsDefault).slice(-1)[0];
			this.BilHeaderIds.ConfigurationId= defaultData.Id;
		});
	}
	public changeRubricCategoryFromType(typeFk: number){
		this.http.post(this.configurationService.webApiBaseUrl + 'basics/customize/BillType/list',{}).subscribe(result => {
			const defaultData = (result as IBillTypeEntity[]).filter(items => items.Id === typeFk)[0];
			this.BilHeaderIds.RubricCategoryFk= defaultData.RubricCategoryFk;
		});
	}

	private prepareFormData(selections: IWipHeaderEntity) {
		this.getRubricCategoryFromType();
		const config: IFormDialogConfig<ICreateBillFromWipRequestEntityGenerated> = {
			headerText: {text: 'Create Bill from Wip'},
			formConfiguration: this.generateEditOptionRows(),
			customButtons: [],
			entity: this.BilHeaderIds
		};

		this.formDialogService.showDialog(config)?.then((result: IEditorDialogResult<ICreateBillFromWipRequestEntityGenerated>) => {
			if(result.closingButtonId === 'ok') {
				const bilHeaderEntity = result.value;
				const postData = {
					'typeId' : (bilHeaderEntity ? bilHeaderEntity.TypeFk : null),
					'configurationId' : (bilHeaderEntity ? bilHeaderEntity.ConfigurationId : null),
					'previousBillId' : (bilHeaderEntity ? bilHeaderEntity.PreviousBillFk : null),
					'description' : (bilHeaderEntity ? bilHeaderEntity.Description : null),
					'billToId': null,
					'billNo' : (bilHeaderEntity ? bilHeaderEntity.BillNo : ''),
					'wipId':[]
				};
				const queryPath = this.configurationService.webApiBaseUrl + 'sales/billing/createbillfromwip';
				this.http.post(queryPath, postData).subscribe((res) => {
					this.messageBoxService.showInfoBox('Bill created successfully!', 'info', true);
					return;
				});
			}
		});
	}
	private gridConfiguration: IGridConfiguration<IWipHeaderEntity> = {
		uuid: '678f6d77c77d46638e9f126e6c17ae90',
		columns: [
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
			{
				id: 'description',
				model: 'Description',
				sortable: true,
				label: {
					text: 'Description',
				},
				type: FieldType.Description,
				readonly: true,
				searchable: true,
				width: 150,
				visible: true,
			},
			{
				id: 'isBilled',
				model: 'IsBilled',
				sortable: true,
				label: {
					text: 'Is Billed',
				},
				type: FieldType.Boolean,
				readonly: true,
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

		],
		// items: this.getRelatedContracts()
	};
	private generateEditOptionRows(): IFormConfig<ICreateBillFromWipRequestEntityGenerated> {
		let formRows: FormRow<ICreateBillFromWipRequestEntityGenerated>[] = [];
		formRows = [
			{
				id: 'Type',
				label: {
					text: 'Type',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesContractBillTypeLookupService,
					showClearButton: false
				}),
				model: 'TypeFk',
				readonly: false,
				change: e => {
					if(e.newValue) {
						this.changeRubricCategoryFromType(e.newValue as number);
						this.changeConfigurationFromCategory(e.newValue as number);
					}
				}
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
							return { Rubric: Rubric.Bill };
						},
					},
					showClearButton: false,
					readonly: true
				}),
				change: e => {
					if(e.newValue) {
						this.changeConfigurationFromCategory(e.newValue as number);
					}
				},
				model: 'RubricCategoryFk',
				readonly: true
			},
			{
				id: 'Configuration',
				label: {
					text: 'Configuration',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesWipCreateBillConfigurationLookupService,
					showClearButton: true
				}),
				model: 'ConfigurationId'
			},
			{
				id: 'BillTo',
				label: {
					text: 'BillTo',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesWipBillCreationBillToLookupService,
					showClearButton: true
				}),
				model: 'BillToId'
			},
			{
				id: 'BillNo',
				label: {
					text: 'BillNo',
				},
				type: FieldType.Description,
				model: 'BillNo',
				readonly: true
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
				id: 'PreviousBill',
				label: {
					text: 'Previous Bill',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesWipPreviousBillLookupService,
					showClearButton: true
				}),
				model: 'PreviousBillFk'
			},
			{
				id: 'WipId',
				label: {
					text: 'Wips',
				},
				type: FieldType.Grid,
				configuration: this.gridConfiguration as IGridConfiguration<object>,
				height: 70,
				model: 'wipIds'
			},

		];
		const formConfig: IFormConfig<ICreateBillFromWipRequestEntityGenerated> = {
			formId: 'editorOption',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: formRows
		};
		return formConfig;
	}

}