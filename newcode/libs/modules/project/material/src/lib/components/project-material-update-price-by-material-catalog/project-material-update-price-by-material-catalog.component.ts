/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ColumnDef, FieldType, IGridConfiguration} from '@libs/ui/common';
import {
	IUpdateMaterialPriceByCatalogEntity
} from '../../model/entities/project-material-update-material-price-by-catalog.interface';
import {ProjectMainDataService} from '@libs/project/shared';
import {CollectionHelper, PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
import {
	ProjectMaterialUpdatePriceByMaterialCatalogDataService
} from '../../services/wizard/project-material-update-price-by-material-catalog-data.service';
import {Subscription} from 'rxjs';
import {
	ProjectMaterialUpdatePriceFromCatalogMainService
} from '../../services/wizard/project-material-update-price-from-catalog-main.service';
import {
	ProjectMaterialUpdatePriceByMaterialCatalogValidateService
} from '../../services/wizard/project-material-update-price-by-material-catalog-validate.service';

@Component({
	selector: 'project-material-update-price-by-material-catalog',
	templateUrl: './project-material-update-price-by-material-catalog.component.html',
	styleUrls: ['./project-material-update-price-by-material-catalog.component.scss'],
})
export class ProjectMaterialProjectMaterialUpdatePriceByMaterialCatalogComponent implements OnInit, OnDestroy {

	private readonly http = inject(HttpClient);
	private subscription!: Subscription;
	private subscription1!: Subscription;
	private readonly prjDataService = inject(ProjectMainDataService);
	private readonly catalogDataService = inject(ProjectMaterialUpdatePriceByMaterialCatalogDataService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private requestUrl: string = this.configurationService.webApiBaseUrl;
	private readonly projUpdatePriceFromCatalogMainService = inject(ProjectMaterialUpdatePriceFromCatalogMainService);
	private readonly validateService = inject(ProjectMaterialUpdatePriceByMaterialCatalogValidateService);

    public constructor() { }

	protected columns: ColumnDef<IUpdateMaterialPriceByCatalogEntity>[] = [
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
			id: 'upGroupCode',
			model: 'GroupCode',
			type: FieldType.Code,
			label: {
				text: 'Group Code',
				key: 'project.main.updatePriceFromCatalogWizard.catalogCode'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'upGroupDesc',
			model: 'GroupDescription',
			type: FieldType.Translation,
			label: {
				text: 'Group Description',
				key: 'project.main.updatePriceFromCatalogWizard.groupDesc'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'upStructureCode',
			model: 'StructureCode',
			type: FieldType.Code,
			label: {
				text: 'Structure Code',
				key: 'project.main.structureCode'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'upStructureDes',
			model: 'StructureDes',
			type: FieldType.Translation,
			label: {
				text: 'Structure Description',
				key: 'project.main.structureDescription'
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
			readonly: false,
			validator: info => {
				return this.validateService.validateNewPrjEstimatePrice(info);
			}
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
		}
	];

	protected materialCatalogConfig!: IGridConfiguration<IUpdateMaterialPriceByCatalogEntity>;

	public ngOnInit(): void {

		this.initializeGrid([]);

		this.subscription = this.projUpdatePriceFromCatalogMainService.CommonEvent.subscribe(data =>{
			if(data === 'material-catalog-grid-refresh'){
				this.materialCatalogConfig = {
					...this.materialCatalogConfig,
					columns: [...this.materialCatalogConfig.columns!],
					items: [...this.catalogDataService.PriceByCatalogList]
				};
			}
		});

		this.subscription1 = this.projUpdatePriceFromCatalogMainService.CommonEvent.subscribe(data =>{
			if(data === 'load-material-catalog') {
				this.getListPage();
			}
		});
	}

	private getListPage(): void{
		const project = this.prjDataService.getSelectedEntity();
		if(!project){
			return;
		}

		this.requestUrl += 'project/material/getprojectmaterialsf4updatepricesbycatalog';
		const url = this.requestUrl + '?projectId=' + project.Id + '&estHeaderFk=null&pageSize=10000000&pageIndex=0';
		this.http.get(url).subscribe((response)=>{
			let materialCatalogs: IUpdateMaterialPriceByCatalogEntity[] = [];
			if(response){
				if('ProjectMaterials' in response){
					materialCatalogs = response.ProjectMaterials as IUpdateMaterialPriceByCatalogEntity[];
				}
			}

			this.initializeGrid(materialCatalogs);
		});
	}

	private initializeGrid(items: IUpdateMaterialPriceByCatalogEntity[]){
		_.forEach(items, function (item){
			item.MaterialCatalogFk = undefined;
			item.Checked = false;
			if(item.Children){
				_.forEach(item.Children,function (child){
					child.Checked = false;
				});
			}
		});

		this.catalogDataService.PriceByCatalogList = items;

		this.materialCatalogConfig = {
			uuid: 'ce5ae346f4c74fba98d776f756537eee',
			columns: this.columns,
			idProperty: 'Id',
			items: items,
			treeConfiguration: {
				parent: entity => {
					if(entity.MaterialCatalogFk){
						return this.materialCatalogConfig.items?.find(item => item.Id === entity.MaterialCatalogFk) || null;
					}
					return null;
				},
				children: entity => {
					const list = CollectionHelper.Flatten(this.materialCatalogConfig.items || [], (item) => {
						return item.Children || [];
					});
					return list.reduce((result: IUpdateMaterialPriceByCatalogEntity[], item) => {
						if (entity.Id === item.MaterialCatalogFk) {
							result.push(item);
						}
						return result;
					}, []) || [];
				}
			},
			skipPermissionCheck: true
		};
	}

	public ngOnDestroy() {
		this.subscription.unsubscribe();
		this.subscription1.unsubscribe();
	}
}
