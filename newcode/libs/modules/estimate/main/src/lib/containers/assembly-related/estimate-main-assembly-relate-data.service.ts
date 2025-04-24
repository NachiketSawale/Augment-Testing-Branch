/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { MainDataDto } from '@libs/basics/shared';
import { IFilterResult, ISearchResult } from '@libs/platform/common';
import { IBoqWic2assemblyEntity } from '@libs/boq/interfaces';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { EstimateMainBoqDataService } from '../boq/estimate-main-boq-data.service';
import { head, set } from 'lodash';
import { EstimateMainAssemblyStructureDataService } from '../assembly-structure/estimate-main-assembly-structure-data.service';
import { EstRelateAssemblyFilter } from './enums/estimate-main-assembly-relate-filter-key.enum';

@Injectable({ providedIn: 'root' })
export class EstimateMainAssemblyRelateDataService extends DataServiceFlatRoot<IBoqWic2assemblyEntity, never> {
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly assemblyStructureDataService = inject(EstimateMainAssemblyStructureDataService);
	private readonly estimateMainBoqDataService = inject(EstimateMainBoqDataService);
	//TODO depend on estimateMainWicBoqService
	private readonly estimateMainWicBoqService = inject(EstimateMainBoqDataService);

	private _filter = EstRelateAssemblyFilter.ByBoq;

	/**
	 * get current tool bar active value
	 * equal the old 'getCurrentFilterType' function
	 * @constructor
	 */
	public get FilterKey() {
		return this._filter;
	}

	public constructor() {
		const options: IDataServiceOptions<IBoqWic2assemblyEntity> = {
			apiUrl: 'boq/main/wic2assembly',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IBoqWic2assemblyEntity>>{
				role: ServiceRole.Root,
				itemName: 'boqMainWic2Assembly'
			},
		};
		super(options);
	}

	protected override provideLoadByFilterPayload(): object {
		const requestParams = {
			UseMasterDataFilter: true,
			ProjectId: this.estimateMainContextService.getSelectedProjectId(),
			FilterType: this._filter,
			PageSize: 30,
			PageNumber: 0,
			filter: ''
		};
		switch (this._filter) {
			case EstRelateAssemblyFilter.ByBoq:
			case EstRelateAssemblyFilter.ByWicBoq:
				this.setBoqFilter(requestParams);
				this.activateStrLayout();
				break;
			case EstRelateAssemblyFilter.ByAssemblyCat:
				this.setAssemblyCatFilter(requestParams);
				this.deactivateStrLayout();
				break;
			default:
				break;
		}
		return requestParams;
	}

	private setBoqFilter(params: object) {
		const isBoq = this._filter === EstRelateAssemblyFilter.ByBoq;
		const selectBoqs = isBoq ? this.estimateMainBoqDataService.getSelection() : this.estimateMainWicBoqService.getSelection();
		if (selectBoqs.length > 0) {
			set(params, 'BoqHeaderFk', head(selectBoqs)?.BoqHeaderFk);
			const boqIds = isBoq
				? selectBoqs.map((e) =>
					//TODO depend on boqMainCommonService.isTextElement(boq)
					this.isTextElement(e) ? e.BoqItemFk : e.Id
				)
				: selectBoqs.map((e) => e.Id);
			set(params, 'BoqItemFks', boqIds);
		}
	}

	private setAssemblyCatFilter(params: object) {
		const selectAssemblyCat = this.assemblyStructureDataService.getSelection();
		const assembliesSourceCatalogs = selectAssemblyCat.filter((e) => e.PrjProjectFk && e.PrjProjectFk > 0 && e.EstAssemblyCatSourceFk && e.EstAssemblyCatSourceFk > 0);
		if (assembliesSourceCatalogs.length > 0) {
			set(params, 'AssemblyCatFks', selectAssemblyCat.map((e) => e.Id).concat(assembliesSourceCatalogs.map((e) => e.EstAssemblyCatSourceFk ?? 0)));
		}
	}

	private isTextElement(boq: IBoqItemEntity) {
		return true;
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IBoqWic2assemblyEntity> {
		const data = new MainDataDto<IBoqWic2assemblyEntity>(loaded);
		return {
			FilterResult: data.getValueAs<IFilterResult>('filterResponse'),
			dtos: data.getValueAs<IBoqWic2assemblyEntity[]>('dtos'),
		} as ISearchResult<IBoqWic2assemblyEntity>;
	}

	/**
	 * reload grid data
	 * @param filter
	 */
	public reLoadGrid(filter: EstRelateAssemblyFilter) {
		this._filter = filter;
		void this.refreshAll();
	}

	/**
	 * Provide external channels for updating grid data
	 * @param resList
	 */
	public updateList(resList: IBoqWic2assemblyEntity[]) {
		const loaded = {
			filterResponse: {
				ExecutionInfo: '',
				RecordsFound: resList.length,
				RecordsRetrieved: 0,
				ResultIds: resList.map((e) => e.Id)
			},
			dtos: resList,
		};
		this.onLoadByFilterSucceeded(loaded);
	}

	private activateStrLayout() {
		const fieldsToAdd = ['WorkContentInfo', 'Wic2AssemblyQuantity', 'WicEstAssembly2WicFlagFk'];
		const fieldsToRemove = ['CommentText'];

		this.updateGridLayoutColumns(fieldsToAdd, fieldsToRemove);
	}

	private deactivateStrLayout() {
		const fieldsToAdd = ['CommentText'];
		const fieldsToRemove = ['WorkContentInfo', 'Wic2AssemblyQuantity', 'WicEstAssembly2WicFlagFk'];

		this.updateGridLayoutColumns(fieldsToAdd, fieldsToRemove);
	}

	private updateGridLayoutColumns(fieldsToAdd: string[], fieldsToRemove: string[]) {
		//TODO change grid show columns
		/*let gridId = service.getGridId();
		let platformGridAPI = $injector.get('platformGridAPI');
		let estimateMainCommonUIService = $injector.get('estimateMainCommonUIService');

		let isLayoutChanged = false;

		let grid = platformGridAPI.grids.element('id', gridId);
		if (grid && grid.instance) {
			let columns = platformGridAPI.columns.configuration(gridId).current;

			// Remove fields
			let isAlreadyAdded = _.findIndex(columns, {field: _.first(fieldsToRemove)}) !== -1;
			if (isAlreadyAdded) {
				columns = _.filter(platformGridAPI.columns.configuration(gridId).current, function (column) {
					return fieldsToRemove.indexOf(column.field) === -1;
				});
				isLayoutChanged = true;
			}

			// Add fields
			isAlreadyAdded = _.findIndex(columns, {field: _.first(fieldsToAdd)}) !== -1;
			if (!isAlreadyAdded) {
				let uiService = estimateMainCommonUIService.createUiService(fieldsToAdd);
				let strCols = uiService.getStandardConfigForListView().columns;
				columns = columns.concat(strCols);
				isLayoutChanged = true;
			}

			if (isLayoutChanged) {
				platformGridAPI.columns.configuration(gridId, columns);
			}
		}*/
	}

	//TODO The business logic is not clear,
	// and it seems that it can be deleted and used for subsequent related development until redevelopment
	/*dealDoubleData:dealDoubleData,
	updateCacheList:updateCacheList,
	dealCostGroupData:dealCostGroupData,
	setDefaultFilterBtn:setDefaultFilterBtn,
	setDtosByPagination:setDtosByPagination,
	getDtosByPagination:getDtosByPagination,*/
}
