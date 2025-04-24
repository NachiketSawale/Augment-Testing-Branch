/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {
	ColumnDef, createLookup,
	FieldType, FieldValidationInfo,
	IDialog,
	IFormConfig,
	IGridConfiguration,
	IMenuItemsList,
	ItemType, UiCommonMessageBoxService,
} from '@libs/ui/common';
import {
	IUpdateMaterialPriceFromQuote,
	IUpdateMaterialPriceFromQuoteForm
} from '../../model/entities/project-material-update-material-price-from-quote.interface';
import { ProjectMainDataService, ProjectSharedLookupService } from '@libs/project/shared';
import {PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {IUpdatePriceBasicOption} from '../../model/entities/project-material-update-price-complate.interface';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';
import {
	ProjectMaterialUpdatePriceFromCatalogMainService
} from '../../services/wizard/project-material-update-price-from-catalog-main.service';
import {
	ProjectMaterialUpdatePriceFromQuoteDataService
} from '../../services/wizard/project-material-update-price-from-quote-date.service';
import {PageHelper} from '../../model/project-material-update-price-page.class';
import {ValidationResult} from '@libs/platform/data-access';

@Component({
	selector: 'project-material-update-price-from-quote',
	templateUrl: './project-material-update-price-from-quote.component.html',
	styleUrls: ['./project-material-update-price-from-quote.component.scss'],
})
export class ProjectMaterialProjectMaterialUpdatePriceFromQuoteComponent extends PageHelper implements  OnInit, OnDestroy {

	private readonly http = inject(HttpClient);
	private readonly prjDataService = inject(ProjectMainDataService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private requestUrl: string = this.configurationService.webApiBaseUrl + 'procurement/quote/header/getQuotesByPaging';
	private readonly projUpdatePriceFromCatalogMainService = inject(ProjectMaterialUpdatePriceFromCatalogMainService);
	private readonly dataService = inject(ProjectMaterialUpdatePriceFromQuoteDataService);
	private currentId = -1;
	private readonly uiCommonMsgBoxService = inject(UiCommonMessageBoxService);

	@Input()
	public optionItem?: IUpdatePriceBasicOption | undefined;

	private subscription!: Subscription;

	public ngOnInit() {
		this.subscription = this.projUpdatePriceFromCatalogMainService.CommonEvent.subscribe(data =>{
			if(data === 'search-loadGrid') {
				if (this.optionItem?.radioSelect === 'fromQuote') {
					this.getListPage();
				}
			}
		});

		setTimeout(()=>{
			this.quoteStatus.ProjectId = this.projUpdatePriceFromCatalogMainService.ProjectId;
		});

		this.initializedGrid(this.dataService.DataItems);
	}

	protected columns: ColumnDef<IUpdateMaterialPriceFromQuote>[] = [
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
			readonly: true
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
			readonly: false,
			validator: info => {
				this.validateQuoteFk(info);
				return new ValidationResult();
			}
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
			id: 'QuoteCode',
			model: 'QuoteFk',
			type: FieldType.Integer, // todo: need to change to lookup
			label: {
				text: 'Quote Code',
				key: 'project.main.quoteCode'
			},
			visible: true,
			sortable: false,
			readonly: false,
			validator: info => {
				this.validateQuoteFk(info);
				return new ValidationResult();
			}
		},
		{
			id: 'QuoteDescription',
			model: 'QuoteDescription',
			type: FieldType.Description,
			label: {
				text: 'Quote Description',
				key: 'project.main.quoteDescription'
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
			id: 'Version',
			model: 'Version',
			type: FieldType.Description,
			label: {
				text: 'Version',
				key: 'project.main.version'
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
			id: 'QuotedDate',
			model: 'QuotedDate',
			type: FieldType.Date,
			label: {
				text: 'Quoted Date',
				key: 'project.main.quotedDate'
			},
			visible: true,
			sortable: false,
			readonly: true
		}
	];

	protected validateQuoteFk(info: FieldValidationInfo<IUpdateMaterialPriceFromQuote>) {
		if (!info.value) {
			info.entity.BusinessPartnerFk = 0;
			info.entity.QuoteDescription = '';
			info.entity.QuotedDate = '';
			info.entity.StatusFk = 0;
			info.entity.Version = '';
		}
	}

	protected updatePricesFromQuote!: IGridConfiguration<IUpdateMaterialPriceFromQuote>;

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
			},
			{
				id: 'statusFk',
				label: this.translateService.instant('project.main.loadQuotesWithSelectedStatus').text,
				model: 'StatusFk',
				type: FieldType.Integer, //TODO  change to lookup type
				// lookupOptions:  createLookup( {
				// 	dataServiceToken: IBasicsSharedQuotationStatusLookupService,
				// 	showClearButton: true
				// })
			}
		]
	};

	protected quoteStatus: IUpdateMaterialPriceFromQuoteForm = {
		ProjectId: 0,
		StatusFk: 0
	};

	protected selectionChanged(selectedItems: IUpdateMaterialPriceFromQuote[]){
		if(selectedItems && selectedItems.length > 0){
			this.dataService.SetSelected(selectedItems[0]);

			let valid = true;
			const selected = selectedItems[0];
			const gridDatas = this.dataService.DataItems;
			for (let i = 0; i < gridDatas.length; i++) {
				if (gridDatas[i].QuoteFk === null) {
					if (selected && (gridDatas[i].Id !== selected.Id)) {
						valid = false;
					}
				}
			}

			if (!valid) {
				this.uiCommonMsgBoxService.showMsgBox(this.translateService.instant('project.main.newInsertCodeError').text, this.translateService.instant('project.main.updateMaterialPricesFromQuoteTitle').text, 'warning'); // jshint ignore:line
			}
		}else{
			this.dataService.SetSelected(undefined);
		}
	}

	private addNewRecord():void{
		const newEntity:IUpdateMaterialPriceFromQuote = {
			Id: this.currentId--,
			Checked: false,
			ProjectFk: 0,
			QuoteFk: 0,
			BusinessPartnerFk: 0,
			Version: '',
			StatusFk: 0,
			QuoteDescription: '',
			QuotedDate: '',
			QuoteVersion:'',
			Description:'',
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
		this.updatePricesFromQuote = {
			...this.updatePricesFromQuote,
			columns: [...this.updatePricesFromQuote.columns!],
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
			selectPrj: this.quoteStatus.ProjectId ? this.quoteStatus.ProjectId : null,
			projectfk: this.quoteStatus.ProjectId ? this.quoteStatus.ProjectId : null,
			statusfk: this.quoteStatus.StatusFk ? this.quoteStatus.StatusFk : null,
			pattern: this.searchText
		};
		this.http.post(this.requestUrl, postData).subscribe((response)=>{
			let datas: IUpdateMaterialPriceFromQuote[] = [];
			if(response){
				if('Data' in response){
					datas = response.Data as IUpdateMaterialPriceFromQuote[];
					_.forEach(datas, function (item){
						item.Checked = false;
						item.QuoteFk = item.Id;
						item.QuoteDescription = item.Description;
						item.Version = item.QuoteVersion;
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

	private initializedGrid(items: IUpdateMaterialPriceFromQuote[]){
		this.updatePricesFromQuote = {
			uuid: 'b57bf1317165451aa108e5cc4b66a995',
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
