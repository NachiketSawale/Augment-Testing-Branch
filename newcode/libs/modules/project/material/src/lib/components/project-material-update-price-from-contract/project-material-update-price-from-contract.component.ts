/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {
	ColumnDef, createLookup,
	FieldType, FieldValidationInfo, IDialog,
	IFormConfig,
	IGridConfiguration,
	IMenuItemsList, ItemType,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import {
	IUpdateMaterialPriceFromContract
} from '../../model/entities/project-material-update-material-price-from-contract.interface';
import {HttpClient} from '@angular/common/http';
import { ProjectMainDataService, ProjectSharedLookupService } from '@libs/project/shared';
import {PlatformConfigurationService} from '@libs/platform/common';
import {Subscription} from 'rxjs';
import {IUpdatePriceBasicOption} from '../../model/entities/project-material-update-price-complate.interface';
import * as _ from 'lodash';
import {
	ProjectMaterialUpdatePriceFromCatalogMainService
} from '../../services/wizard/project-material-update-price-from-catalog-main.service';
import {
	ProjectMaterialUpdatePriceFromContractDataService
} from '../../services/wizard/project-material-update-price-from-contract-data.service';
import {PageHelper} from '../../model/project-material-update-price-page.class';
import {
	IUpdateMaterialPriceFromQuoteForm
} from '../../model/entities/project-material-update-material-price-from-quote.interface';
import {ValidationResult} from '@libs/platform/data-access';

@Component({
	selector: 'project-material-update-price-from-contract',
	templateUrl: './project-material-update-price-from-contract.component.html',
	styleUrls: ['./project-material-update-price-from-contract.component.scss'],
})
export class ProjectMaterialProjectMaterialUpdatePriceFromContractComponent extends PageHelper implements OnInit, OnDestroy {

	private readonly http = inject(HttpClient);
	private readonly prjDataService = inject(ProjectMainDataService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private requestUrl: string = this.configurationService.webApiBaseUrl + 'procurement/contract/header/getContractsByPaging';
	private readonly projUpdatePriceFromCatalogMainService = inject(ProjectMaterialUpdatePriceFromCatalogMainService);
	private readonly dataService = inject(ProjectMaterialUpdatePriceFromContractDataService);
	private currentId = -1;
	private readonly uiCommonMsgBoxService = inject(UiCommonMessageBoxService);

	@Input()
	public optionItem?: IUpdatePriceBasicOption | undefined;

	private subscription!: Subscription;

    public ngOnInit() {
		this.subscription = this.projUpdatePriceFromCatalogMainService.CommonEvent.subscribe(data =>{
			if(data === 'search-loadGrid') {
				if (this.optionItem?.radioSelect === 'fromContract') {
					this.getListPage();
				}
			}
		});

		setTimeout(()=>{
			this.contractStatus.ProjectId = this.projUpdatePriceFromCatalogMainService.ProjectId;
		});

		this.initializedGrid(this.dataService.DataItems);
	}

	protected columns: ColumnDef<IUpdateMaterialPriceFromContract>[] = [
		{
			id: 'checked',
			model: 'Checked',
			type: FieldType.Boolean,
			label: {
				text: 'Selected',
				key: 'basics.common.selected'
			},
			visible: true,
			sortable: false,
			readonly: true,
		},
		{
			id: 'ProjectCode',
			model: 'ProjectFk',
			type: FieldType.Integer, // todo: need to change to lookup
			label: {
				text: 'Project Code',
				key: 'project.main.projectCode'
			},
			visible: true,
			sortable: false,
			readonly: false
		},
		{
			id: 'ProjectName',
			model: 'ProjectFk',
			type: FieldType.Integer,
			label: {
				text: 'Project Name',
				key: 'project.main.projectName'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'ContractCode',
			model: 'ContractFk',
			type: FieldType.Integer, // todo: need to change to lookup
			label: {
				text: 'Contract Code',
				key: 'project.main.contractCode'
			},
			visible: true,
			sortable: false,
			readonly: false,
			validator: info => {
				this.validateContractFk(info);
				return new ValidationResult();
			}
		},
		{
			id: 'ContractDescription',
			model: 'ContractDescription',
			type: FieldType.Description,
			label: {
				text: 'Contract Description',
				key: 'project.main.contractDescription'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'BusinessPartnerName',
			model: 'BusinessPartnerFk',
			type: FieldType.Integer, // todo: need to change to lookup
			label: {
				text: 'Business Partner Name',
				key: 'project.main.businessPartnerName'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'Status',
			model: 'StatusFk',
			type: FieldType.Integer, // todo: need to change to lookup
			label: {
				text: 'Status',
				key: 'project.main.status'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'OrderedDate',
			model: 'OrderedDate',
			type: FieldType.Date,
			label: {
				text: 'Ordered Date',
				key: 'project.main.orderedDate'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'ContractType',
			model: 'ContractTypeFk',
			type: FieldType.Integer,
			label: {
				text: 'Contract Type',
				key: 'project.main.entityContractTypeFk'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'Address',
			model: 'Address',
			type: FieldType.Description,
			label: {
				text: 'Address',
				key: 'project.main.projectAddressGroup'
			},
			visible: true,
			sortable: false,
			readonly: true
		}
	];

	private validateContractFk(info: FieldValidationInfo<IUpdateMaterialPriceFromContract>) {

		if (!info.value) {
			info.entity.BusinessPartnerFk = 0;
			info.entity.ContractDescription = '';
			info.entity.OrderedDate = null;
			info.entity.StatusFk = 0;
			info.entity.Address = '';
			info.entity.ContractTypeFk = 0;
		}

	}

	protected updatePricesFromContract!: IGridConfiguration<IUpdateMaterialPriceFromContract>;

	protected formConfig: IFormConfig<IUpdateMaterialPriceFromQuoteForm> = {
		formId: 'project.material.update.price.from.quote',
		showGrouping: false,
		addValidationAutomatically:false,
		rows:[
			{
				id: 'projectId',
				label:	this.translateService.instant('project.main.loadQuotesWithSelectedProject').text,
				model: 'ProjectId',
				type: FieldType.Lookup,
				lookupOptions:  createLookup({
					dataServiceToken: ProjectSharedLookupService,
					displayMember: 'ProjectNo',
					showClearButton: true
				})
			}
		]
	};

	protected contractStatus: IUpdateMaterialPriceFromQuoteForm = {
		ProjectId: 0,
		StatusFk:0
	};

	protected selectionChanged(selectedItems: IUpdateMaterialPriceFromContract[]){
		if(selectedItems && selectedItems.length > 0){
			this.dataService.SetSelected(selectedItems[0]);

			let valid = true;
			const selected = selectedItems[0];
			const gridDatas = this.dataService.DataItems;
			for (let i = 0; i < gridDatas.length; i++) {
				if (gridDatas[i].ContractFk === null) {
					if (selected && (gridDatas[i].Id !== selected.Id)) {
						valid = false;
					}
				}
			}

			if (!valid) {
				this.uiCommonMsgBoxService.showMsgBox(this.translateService.instant('project.main.newInsertCodeError').text, this.translateService.instant('project.main.updateMaterialPricesFromContractTitle').text, 'warning'); // jshint ignore:line
			}
		}else{
			this.dataService.SetSelected(undefined);
		}
	}

	private addNewRecord():void{
		const newEntity:IUpdateMaterialPriceFromContract = {
			Id: this.currentId--,
			Checked: false,
			ProjectFk: 0,
			ContractFk: 0,
			BusinessPartnerFk: 0,
			StatusFk: 0,
			Description: '',
			ContractTypeFk: 0,
			OrderedDate:'',
			Address: '',
			ContractDescription: '',
			ConStatusFk: 0,
			DateOrdered: '',
			ConTypeFk: 0,
			Co2Project: 0,
			OldCo2Project: 0,
			Co2Source: 0,
			OldCo2Source: 0,
			Variance:0,
			Comment: '',
			MaterialCode: '',
			NewEstimatePrice: 0
		};
		this.dataService.DataItems.push(newEntity);
		this.refreshGrid();
	}

	private deleteResord(): void{
		const selected = this.dataService.GetSelected();
		if(selected){
			this.dataService.DataItems = _.filter(this.dataService.DataItems, (item) =>{
				return item.Id != selected.Id;
			});
			this.refreshGrid();
		}
	}

	private refreshGrid():void{
		this.updatePricesFromContract = {
			...this.updatePricesFromContract,
			columns: [...this.updatePricesFromContract.columns!],
			items: [...this.dataService.DataItems]
		};
	}

	protected get tools(): IMenuItemsList<IDialog> | undefined{
		return {
			cssClass: 'tools',
			items: [
				{
					type: ItemType.Item,
					caption: {key: 'cloud.common.taskBarNewRecord', text: 'New Record'},
					iconClass: 'tlb-icons ico-rec-new',
					id:'create',
					fn: () => {
						this.addNewRecord();
					}
				},
				{
					type: ItemType.Item,
					caption: {key: 'tlb-icons ico-rec-delete', text: 'Delete Record'},
					iconClass: 'tlb-icons ico-rec-delete',
					id:'delete',
					fn: () => {
						this.deleteResord();
					},
					disabled: () => {
						return !this.dataService.GetSelected();
					}
				}
			]
		};
	}

	protected get context(): IDialog{
		return {
			close: closingButtonId => {}
		};
	}

	protected searchText: string = '';

	public override getListPage(): void{
		const postData = {
			pageNumber: this.page.number,
			pageSize: this.page.size,
			selectPrj: this.contractStatus.ProjectId ? this.contractStatus.ProjectId : null,
			projectfk: this.contractStatus.ProjectId ? this.contractStatus.ProjectId : null,
			statusfk: this.contractStatus.StatusFk ? this.contractStatus.StatusFk : null,
			pattern: this.searchText
		};
		this.http.post(this.requestUrl, postData).subscribe((response)=>{
			let datas: IUpdateMaterialPriceFromContract[] = [];
			if(response){
				if('Data' in response){
					datas = response.Data as IUpdateMaterialPriceFromContract[];
					_.forEach(datas, function (item){
						item.Checked = false;
						item.ContractFk = item.Id;
						item.ContractDescription = item.Description;
						item.StatusFk = item.ConStatusFk;
						item.OrderedDate = item.DateOrdered;
						item.ContractTypeFk = item.ConTypeFk;
					});
				}

				if('Count' in response){
					this.dataService.TotalCount = response.Count as number;
				}
			}
			this.dataService.DataItems = datas;
			this.dataService.pageNumber = this.page.number;
			this.initializedGrid(datas);
		});
	}

	private initializedGrid(items: IUpdateMaterialPriceFromContract[]){
		this.updatePricesFromContract = {
			uuid: '8a8ec7241d66414e86b76a92e0308ac3',
			columns: this.columns,
			items: items,
			skipPermissionCheck: true
		};
		this.page.number = this.dataService.pageNumber;
		this.page.totalLength = this.dataService.TotalCount;
		this.page.currentLength = items.length;
		this.page.count = Math.ceil(this.page.totalLength / this.page.size);
	}

	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
