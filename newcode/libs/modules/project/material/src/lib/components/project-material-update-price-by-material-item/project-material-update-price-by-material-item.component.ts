/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ColumnDef, createLookup, FieldType, IGridConfiguration} from '@libs/ui/common';
import {
	IUpdateMaterialPriceByItemEntity
} from '../../model/entities/project-material-update-material-price-by-item.interface';
import {
	IProjectMaterialUpdateMaterialPriceByItemPriceList, IProjectMaterialUpdateMaterialPriceByItemPriceListMap
} from '../../model/entities/project-material-update-material-price-by-item-price-list.interface';
import {PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
import {ProjectMainDataService} from '@libs/project/shared';
import {BasicsSharedCurrencyLookupService, BasicsSharedUomLookupService} from '@libs/basics/shared';
import {IBasicsUomEntity} from '@libs/basics/interfaces';
import {
	ProjectMaterialUpdatePriceByMaterialItemDataService
} from '../../services/wizard/project-material-update-price-by-material-item-data.service';
import {Subscription} from 'rxjs';
import {
	ProjectMaterialUpdatePriceFromCatalogMainService
} from '../../services/wizard/project-material-update-price-from-catalog-main.service';
import {
	ProjectMaterialUpdatePriceByMaterialItemListDataService
} from '../../services/wizard/project-material-update-price-by-material-item-list-data.service';
import {
	ProjectMaterialUpdatePriceByMaterialItemValidateService
} from '../../services/wizard/project-material-update-price-by-material-item-validate.service';
import {
	ProjectMaterialUpdatePriceByMaterialItemListValidateService
} from '../../services/wizard/project-material-update-price-by-material-item-list-validate.service';
import {PageHelper} from '../../model/project-material-update-price-page.class';

@Component({
	selector: 'project-material-update-price-by-material-item',
	templateUrl: './project-material-update-price-by-material-item.component.html',
	styleUrls: ['./project-material-update-price-by-material-item.component.scss'],
})
export class ProjectMaterialProjectMaterialUpdatePriceByMaterialItemComponent extends PageHelper implements OnInit, OnDestroy {
	private readonly http = inject(HttpClient);
	private readonly prjDataService = inject(ProjectMainDataService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private requestUrl: string = this.configurationService.webApiBaseUrl + 'project/material/getprojectmaterialsf4updatepricesfromcatalog';
	private readonly itemDataService = inject(ProjectMaterialUpdatePriceByMaterialItemDataService);
	private readonly itemListDataService = inject(ProjectMaterialUpdatePriceByMaterialItemListDataService);
	private subscription!: Subscription;
	private subscription1!: Subscription;
	private readonly projUpdatePriceFromCatalogMainService = inject(ProjectMaterialUpdatePriceFromCatalogMainService);
	private readonly validateService = inject(ProjectMaterialUpdatePriceByMaterialItemValidateService);
	private readonly validateListService = inject(ProjectMaterialUpdatePriceByMaterialItemListValidateService);

	
	private columns: ColumnDef<IUpdateMaterialPriceByItemEntity>[] = [
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
			readonly: false,
			validator: info => {
				return this.validateService.validateChecked(info);
			}
		},
		{
			id: 'jobCode',
			model: 'JobCode',
			type: FieldType.Code,
			label: {
				text: 'Code_123',
				key: 'project.main.updatePriceFromCatalogWizard.jobCatalogCode'
			},
			visible: true,
			sortable: false,
			readonly: true,
		},
		{
			id: 'upJobCatalogDesc',
			model: 'JobDescription',
			type: FieldType.Translation,
			label: {
				text: 'Job / Catalog Description',
				key: 'project.main.updatePriceFromCatalogWizard.jobCatalogDesc'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'upCatalogCode',
			model: 'CatalogCode',
			type: FieldType.Code,
			label: {
				text: 'Catalog Code',
				key: 'project.main.updatePriceFromCatalogWizard.catalogCode'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'upCatalogDesc',
			model: 'CatalogDescription',
			type: FieldType.Translation,
			label: {
				text: 'Catalog Description',
				key: 'project.main.updatePriceFromCatalogWizard.catalogDesc'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upMaterialCode',
			model: 'MaterialCode',
			type: FieldType.Code,
			label: {
				text: 'Material Code',
				key: 'project.main.materialCode'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upMaterialDescription',
			model: 'MaterialDescription',
			type: FieldType.Translation,
			label: {
				text: 'Material Description',
				key: 'project.main.materialDescription'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upMaterialPriceVersionFk',
			model: 'MaterialPriceVersionFk',
			type: FieldType.Integer, // todo: need to change to lookup
			label: {
				text: 'Price Version',
				key: 'project.main.updatePriceFromCatalogWizard.priceList.materialPriceVersion'
			},
			visible: true,
			sortable: false,
			readonly: false
		},
		{
			id:'upBasPriceListFk',
			model: 'MaterialPriceVersionFk',
			type: FieldType.Integer, // todo: need to change to lookup
			label: {
				text: 'Price List',
				key: 'project.main.updatePriceFromCatalogWizard.priceList.priceList'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upUomFk',
			model: 'Uom',
			type: FieldType.Lookup,
			lookupOptions: createLookup<IUpdateMaterialPriceByItemEntity, IBasicsUomEntity>({
				dataServiceToken: BasicsSharedUomLookupService
			}),
			label: {
				text: 'UoM',
				key: 'project.main.uoM'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upCurPrjEstimatePrice',
			model: 'CurPrjEstimatePrice',
			type: FieldType.Money,
			label: {
				text: 'Cur. PRJ. Est. Price',
				key: 'project.main.currentPrjEstimatePrice'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upNewPrjEstimatePrice',
			model: 'NewPrjEstimatePrice',
			type: FieldType.Money,
			label: {
				text: 'New PRJ. Est. Price',
				key: 'project.main.newPrjEstimatePrice'
			},
			visible: true,
			sortable: false,
			readonly: false,
			validator: info => {
				return this.validateService.validateNewPrjEstimatePrice(info);
			}
		},
		{
			id:'upCurPrjDayworkRate',
			model: 'CurPrjDayworkRate',
			type: FieldType.Money,
			label: {
				text: 'Cur. PRJ.DW/T+M Rate',
				key: 'project.main.currentPrjDayworkRate'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upNewPrjDayworkRate',
			model: 'NewPrjDayworkRate',
			type: FieldType.Money,
			label: {
				text: 'New PRJ.DW/T+M Rate',
				key: 'project.main.newPrjDayworkRate'
			},
			visible: true,
			sortable: false,
			readonly: false
		},
		{
			id:'upVariance',
			model: 'Variance',
			type: FieldType.Decimal,
			label: {
				text: 'Variance',
				key: 'project.main.variance'
			},
			cssClass: 'text-right',
			visible: true,
			sortable: false,
			readonly: false
			// TODO: add function to support decimalPlaces
		},
		{
			id:'upMaterialEstimatePrice',
			model: 'MaterialEstimatePrice',
			type: FieldType.Money,
			label: {
				text: 'Catalog Est. Price',
				key: 'project.main.newPrjDayworkRate'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upMaterialDayworkRate',
			model: 'MaterialDayworkRate',
			type: FieldType.Money,
			label: {
				text: 'Material PRJ.DW/T+M Rate',
				key: 'project.main.materialDayworkRate'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upMaterialFactorHour',
			model: 'MaterialFactorHour',
			type: FieldType.Factor,
			label: {
				text: 'Material Factor Hour',
				key: 'project.main.materialFactorHour'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upCurPrjFactorHour',
			model: 'CurPrjFactorHour',
			type: FieldType.Factor,
			label: {
				text: 'Cur. PRJ. Factor Hour',
				key: 'project.main.currentPrjFactorHour'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upNewPrjFactorHour',
			model: 'NewPrjFactorHour',
			type: FieldType.Factor,
			label: {
				text: 'New PRJ. Factor Hour',
				key: 'project.main.newPrjFactorHour'
			},
			visible: true,
			sortable: false,
			readonly: false
		},
		{
			id:'upCurrencyFk',
			model: 'CurrencyFk',
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCurrencyLookupService,
				showDescription: true,
				descriptionMember: 'Currency'
			}),
			label: {
				text: 'Currency',
				key: 'cloud.common.entityCurrency'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upSource',
			model: 'Source',
			type: FieldType.Description,
			label: {
				text: 'Source',
				key: 'project.main.source'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upComment',
			model: 'CommentText',
			type: FieldType.Description,
			label: {
				text: 'Comment',
				key: 'project.main.comment'
			},
			visible: true,
			sortable: false,
			readonly: false
		},
		{
			id:'upCurPriceUnit',
			model: 'CurPriceUnit',
			type: FieldType.Money,
			label: {
				text: 'Cur. Price Unit',
				key: 'project.main.currentPriceUnit'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upNewPriceUnit',
			model: 'NewPriceUnit',
			type: FieldType.Money,
			label: {
				text: 'New Price Unit',
				key: 'project.main.newPriceUnit'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upCurPriceUnitFactor',
			model: 'CurFactorPriceUnit',
			type: FieldType.Money,
			label: {
				text: 'Cur.P.U.Factor',
				key: 'project.main.currentPriceUnit'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'upNewPriceUnitFactor',
			model: 'NewFactorPriceUnit',
			type: FieldType.Money,
			label: {
				text: 'New P.U.Factorr',
				key: 'project.main.newPriceUnitFactor'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'Co2Project',
			model: 'Co2Project',
			type: FieldType.Money,
			label: {
				text: 'CO2/kg (Project)',
				key: 'basics.material.record.entityCo2Project'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'Co2Source',
			model: 'Co2Source',
			type: FieldType.Money,
			label: {
				text: 'CO2/kg (Source)',
				key: 'basics.material.record.entityCo2Source'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'co2SourceFk',
			model: 'Co2SourceFk',
			type: FieldType.Integer, // todo: need to change to lookup
			label: {
				text: 'CO2/kg (Source Name)',
				key: 'basics.material.record.entityBasCo2SourceFk'
			},
			visible: true,
			sortable: false,
			readonly: true
		}
	];

	private priceColumns: ColumnDef<IProjectMaterialUpdateMaterialPriceByItemPriceList>[] = [
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
			readonly: false,
			validator: info => {
				return this.validateListService.validateChecked(info);
			}
		},
		{
			id:'priceVersion',
			model: 'PriceVersion',
			type: FieldType.Translation,
			label: {
				text: 'Version',
				key: 'project.main.priceVersion'
			},
			visible: true,
			sortable: false,
			readonly: false
		},
		{
			id:'priceList',
			model: 'PriceList',
			type: FieldType.Translation,
			label: {
				text: 'Price List',
				key: 'project.main.priceListTypePriceList'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'currencyFk',
			model: 'CurrencyFk',
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCurrencyLookupService,
				showDescription: true,
				descriptionMember: 'Currency'
			}),
			label: {
				text: 'Currency',
				key: 'cloud.common.entityCurrency'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'estimatePrice',
			model: 'EstimatePrice',
			type: FieldType.Money,
			label: {
				text: 'Estimate Price',
				key: 'project.main.estimatePrice'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'dayworkRate',
			model: 'DayworkRate',
			type: FieldType.Money,
			label: {
				text: 'DW/T+M Rate',
				key: 'project.main.priceListDayworkRate'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'validFrom',
			model: 'ValidFrom',
			type: FieldType.Date,
			label: {
				text: 'Valid From',
				key: 'project.main.validFrom'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'validTo',
			model: 'ValidTo',
			type: FieldType.Date,
			label: {
				text: 'Valid From',
				key: 'project.main.validTo'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'weighting',
			model: 'Weighting',
			type: FieldType.Integer,
			label: {
				text: 'Weighting',
				key: 'project.main.weighting'
			},
			visible: true,
			sortable: false,
			readonly: false,
			validator: info => {
				return this.validateListService.validateWeighting(info);
			}
		},
		{
			id:'factorHour',
			model: 'FactorHour',
			type: FieldType.Factor,
			label: {
				text: 'Factor Hour',
				key: 'project.main.factorHour'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'Co2Project',
			model: 'Co2Project',
			type: FieldType.Money,
			label: {
				text: 'CO2/kg (Project)',
				key: 'basics.material.record.entityCo2Project'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'Co2Source',
			model: 'Co2Source',
			type: FieldType.Money,
			label: {
				text: 'CO2/kg (Source)',
				key: 'basics.material.record.entityCo2Source'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id:'co2SourceFk',
			model: 'Co2SourceFk',
			type: FieldType.Integer, // todo: need to change to lookup
			label: {
				text: 'CO2/kg (Source Name)',
				key: 'basics.material.record.entityBasCo2SourceFk'
			},
			visible: true,
			sortable: false,
			readonly: true
		}
	];

	protected materialConfig!: IGridConfiguration<IUpdateMaterialPriceByItemEntity>;

	protected priceListConfig!: IGridConfiguration<IProjectMaterialUpdateMaterialPriceByItemPriceList>;

	private initializeGrid(items: IUpdateMaterialPriceByItemEntity[]){

		this.itemDataService.PriceByItemList = items;

		this.materialConfig = {
			uuid: 'ce5ae346f4c74fba98d776f756537eec',
			columns: this.columns,
			idProperty: 'Id',
			items: items,
			skipPermissionCheck: true
		};

		this.priceListConfig = {
			uuid: 'e7ce20703b104c4c90de96144a910ad2',
			columns: this.priceColumns,
			idProperty: 'Id',
			items: items.length > 0 ? items[0].PriceList : [],
			skipPermissionCheck: true
		};
	}


	public ngOnInit(): void {
		this.initializeGrid([]);

		this.subscription = this.projUpdatePriceFromCatalogMainService.CommonEvent.subscribe(data =>{
			if(data === 'material-item-grid-refresh'){
				this.materialConfig = {
					...this.materialConfig,
					columns: [...this.materialConfig.columns!],
					items: [...this.itemDataService.PriceByItemList]
				};
			}else if(data === 'material-item-list-grid-refresh'){
				this.priceListConfig = {
					...this.priceListConfig,
					columns: [...this.priceListConfig.columns!],
					items: [...this.itemListDataService.PriceByItemPriceList]
				};
			}
		});

		this.subscription1 = this.projUpdatePriceFromCatalogMainService.CommonEvent.subscribe(data =>{
			if(data === 'load-material-item') {
				this.getListPage();
			}
		});
	}

	public override getListPage(): void {
		const project = this.prjDataService.getSelectedEntity();
		if(!project){
			return;
		}
		const url = this.requestUrl + '?projectId=' + project.Id + '&estHeaderFk=null&pageSize='+this.page.size+'&pageIndex='+this.page.number;

		this.http.get(url).subscribe((response) => {
			let materials: IUpdateMaterialPriceByItemEntity[] = [];

			if(response){
				if('ProjectMaterials' in response){
					materials = response.ProjectMaterials as IUpdateMaterialPriceByItemEntity[];
					_.forEach(materials, function (item){
						item.Checked = false;
					});
				}
				if('PrjMaterial2PriceListMap' in response){
					const map = response.PrjMaterial2PriceListMap as IProjectMaterialUpdateMaterialPriceByItemPriceListMap;
					this.itemListDataService.LocalCache = map;
					for(const key in map){
						if(key in map){
							const parent = _.find(materials, function (m){
								return m.Id.toString() === key;
							});
							if(parent){
								parent.PriceList = [];
								const prices = map[key];
								_.forEach(prices, function (price){
									price.Checked = false;
									parent.PriceList.push(price);
								});
								if(parent.PriceList.length > 0){
									parent.PriceList[0].Checked = true;
								}
							}
						}
					}
				}

				_.forEach(materials,function(item){
					//item.PriceList = priceList[item.Id] as IProjectMaterialUpdateMaterialPriceByItemPriceList[];
				});

				if('RecordsFound' in response){
					this.page.totalLength = response.RecordsFound as number;
				}
				if('RecordsRetrieved' in response){
					this.page.currentLength = response.RecordsRetrieved as number;
				}
				this.page.count = Math.ceil(this.page.totalLength / this.page.size);
			}

			this.initializeGrid(materials);
		});
	}

	protected selectionChanged(selectedItems: IUpdateMaterialPriceByItemEntity[]){
		if(selectedItems && selectedItems.length > 0){
			this.itemDataService.setSelectedItem(selectedItems[0]);
			this.projUpdatePriceFromCatalogMainService.PrjMaterialId = selectedItems[0].Id;

			this.priceListConfig = {
				uuid: 'e7ce20703b104c4c90de96144a910ad2',
				columns: this.priceColumns,
				idProperty: 'Id',
				items: selectedItems[0].PriceList,
				skipPermissionCheck: true
			};
		}
	}

	public ngOnDestroy() {
		this.subscription.unsubscribe();
		this.subscription1.unsubscribe();
	}
}
