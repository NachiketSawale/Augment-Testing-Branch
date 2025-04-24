/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { isString, isNumber, clone, forEach, isArray, find, orderBy, filter, findIndex, sortBy, map, size } from 'lodash';
import { IControllingProjectcontrolsCostAnalysisEntity, IGroupingItemEditableInfo } from '../../model/entities/controlling-projectcontrols-cost-analysis-entity.class';
import { PlatformConfigurationService, PlatformDateService, PlatformLanguageService, ServiceLocator } from '@libs/platform/common';
import { IFormatteredHistory, IFormatteredPeriod, IGroupingstate, IGroupingStructureInfoResponse, IGroupingType, ITimeIntervalListRequest, ITimeIntervalListResponse, IValueDetail } from '../../model/entities/dashboard-container-entity-models';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IBisDpTimeintervalEntity, IBisPrjHistoryEntity, IBisPrjHistoryInfoEntity } from '@libs/controlling/structure';
import { IContrGroupColumn, ICostAnalysisComposite, ICostAnalysisRequest } from '../../model/controlling-projectcontrols-cost-analysis-request.interface';
import { ControllingProjectControlsProjectDataService } from '../controlling-projectcontrols-project-main-data.service';
import { ControllingProjectcontrolsDashboardStructureDataService } from './controlling-projectcontrols-dashboard-structure-data.service';
import { ControllingCommonProjectComplete, IControllingCommonBisPrjHistoryEntity, IControllingCommonProjectEntity } from '@libs/controlling/common';
import { IMdcContrSacValueEntity } from '@libs/controlling/configuration';
import { DataServiceHierarchicalNode, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ControllingProjectcontrolsCostAnalysisComplete } from '../../model/controlling-projectcontrols-cost-analysis-complete.class';

@Injectable({
	providedIn: 'root',
})
export class ControllingProjectcontrolsDashboardDataService extends DataServiceHierarchicalNode<
	IControllingProjectcontrolsCostAnalysisEntity,
	ControllingProjectcontrolsCostAnalysisComplete,
	IControllingCommonProjectEntity,
	ControllingCommonProjectComplete
> {
	private contextSvc = inject(PlatformConfigurationService);
	private platformLanguageSvc = inject(PlatformLanguageService);
	private http = ServiceLocator.injector.get(HttpClient);
	private configSvc = ServiceLocator.injector.get(PlatformConfigurationService);
	private readonly dateSvc = inject(PlatformDateService);
	private projectSvc = inject(ControllingProjectControlsProjectDataService);
	private dashboardStructureSvc = inject(ControllingProjectcontrolsDashboardStructureDataService);

	private readonly moduleName = 'controlling.projectcontrols';
	private groupingstate: IGroupingstate[] = []; // _groupingstate
	private periods: IFormatteredPeriod[] = [];
	private period: string = '';
	private histroyEntities: IFormatteredHistory[] = [];
	private historyVersions = {
		ribPrjHistroyKey: 0,
		ribHistoryId: -1,
		datePeriod: '',
		projectId: 0,
		projectCode: '',
		projectName: '',
		showEmptyData: true,
	};
	private groupingStructureList: IControllingProjectcontrolsCostAnalysisEntity[] = [];
	private groupingStructureFieldMapping = {
		REL_CO: 'MdcControllingunitFk',
		REL_ACTIVITY: 'PsdActivityFk',
		REL_COSTCODE: 'MdcCostCodeFk',
		REL_COSTCODE_CO: 'MdcContrCostCodeFk',
		REL_BOQ: 'BoqItemFk',
	};
	private containerItems: IControllingProjectcontrolsCostAnalysisEntity[] = [];
	private selectedItemList: IControllingProjectcontrolsCostAnalysisEntity[] = [];
	private gridId = '';
	private needToReload = false;
	private needToLoad = false;
	private sacItemIdCount = 0;
	private stagingActualsValueList: IMdcContrSacValueEntity[] = [];
	private projectSelected: IControllingCommonProjectEntity | null = null;

	private constructor(projectSvc: ControllingProjectControlsProjectDataService) {
		const options: IDataServiceOptions<IControllingProjectcontrolsCostAnalysisEntity> = {
			apiUrl: 'controlling/projectcontrols/dashboard',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'compositecostanalysis',
				usePost: true,
				prepareParam: (ident) => {
					//todo:
					// let projectSelected = service.getProjectInfo();
					// if(!_projectSelected || _projectSelected.Id !== projectSelected.Id){
					// 	historyVersions.ribHistoryId = -1;
					// 	historyVersions.ribPrjHistroyKey = -1;
					// 	historyVersions.projectCode = projectSelected.ProjectNo;
					// 	historyVersions.projectName = projectSelected.ProjectName;
					// 	_projectSelected = projectSelected;
					// }
					// _needToReload = false;
					// _needToLoad = false;
					// historyVersions.projectId = projectSelected.Id;
					// let request = generateRequest(_groupingstate, '773618e488874716a5ed278aa3663865');
					// if(request && size(request.groupingColumns) > 0){
					// 	service.forceReloadAfterFirstInit = null;
					// }
					// angular.extend(readData, request);
					//
					const selection = this.projectSvc.getSelection()[0];
					return { mainItemId: selection.Id };
				},
			},
			roleInfo: <IDataServiceRoleOptions<IControllingProjectcontrolsCostAnalysisEntity>>{
				role: ServiceRole.Node,
				itemName: 'GroupingItem',
				parent: projectSvc,
			},
		};

		super(options);
	}

	public override childrenOf(element: IControllingProjectcontrolsCostAnalysisEntity): IControllingProjectcontrolsCostAnalysisEntity[] {
		return element.Children ?? [];
	}

	public override parentOf(element: IControllingProjectcontrolsCostAnalysisEntity): IControllingProjectcontrolsCostAnalysisEntity | null {
		if (element.ParentFk === undefined) {
			return null;
		}

		const parent = this.flatList().find((item) => item.Id === element.ParentFk);
		return parent === undefined ? null : parent;
	}

	private renderFilterOptions(item: IControllingProjectcontrolsCostAnalysisEntity) {
		if (!item || !this.groupingstate || this.groupingstate.length < 1) {
			return;
		}

		// todo:
		// const colorOptions = this.groupingstate[item.StructureLevel - 1] ? this.groupingstate[item.StructureLevel - 1].ColorOptions : null;
		// if (colorOptions && colorOptions.Enabled) {
		// 	item.indColor = colorOptions.Color;
		// } else {
		// 	item.indColor = undefined;
		// }
	}

	private checkValueByCulture(value: string | number): IValueDetail {
		if (!isNumber(value) && (!isString(value) || value === '')) {
			return {
				Value: '0',
				ValueDetail: '0',
			};
		}

		if (isNumber(value)) {
			value = value.toString();
		}

		const result: IValueDetail = {
			Value: value,
			ValueDetail: value,
		};

		const culture = this.contextSvc.savedOrDefaultUiCulture;
		const cultureInfo = this.platformLanguageSvc.getLanguageInfo(culture);

		if (cultureInfo && cultureInfo.numeric) {
			const numberDecimal = cultureInfo.numeric.decimal;

			if (isString(value)) {
				if (value.indexOf(numberDecimal) !== -1) {
					result.Value = value.replace(numberDecimal, '.');
				}

				const inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
				if (value.indexOf(numberDecimal) === -1 && value.indexOf(inverseNumberDecimal) !== -1) {
					result.ValueDetail = value.replace('.', ',');
				}
			}
		}

		return result;
	}

	private getHistoryVersions() {
		return this.historyVersions;
	}

	private getVersions() {
		return this.histroyEntities;
	}

	// todo:
	// private setSelectVersion(selectedItem) {
	// 	this.historyVersions.ribPrjHistroyKey = selectedItem.id;
	// 	this.historyVersions.ribHistoryId = selectedItem.caption;
	// }

	private getPeriods() {
		return this.periods;
	}

	private setSelectPeriod(value: IFormatteredPeriod) {
		this.period = value.Id;
		this.historyVersions.datePeriod = value.Description;
	}

	private isValidated() {
		return this.historyVersions.projectId <= 0 || this.historyVersions.ribPrjHistroyKey <= 0 || this.period === '' || this.historyVersions.datePeriod === '';
	}

	private showEmptyData() {
		return this.historyVersions.showEmptyData;
	}

	private toggleShowEmptyData() {
		this.historyVersions.showEmptyData = !this.historyVersions.showEmptyData;
		return this.historyVersions.showEmptyData;
	}

	private buildHistoryVersion(data: IBisPrjHistoryInfoEntity) {
		this.histroyEntities = this.formatterHistory(data.HistoryEntities);
		this.periods = this.formatterPeriod(data.TimeintervalEntities);
		this.historyVersions.ribHistoryId = data.LastHistoryEntity ? data.LastHistoryEntity.RibHistoryId : -1;
		this.historyVersions.ribPrjHistroyKey = data.LastHistoryEntity ? data.LastHistoryEntity.Id : -1;
		this.period = data.LastTimeinterval ? this.dateSvc.formatLocal(data.LastTimeinterval.RelDate, 'L') : '';
		this.historyVersions.datePeriod = data.LastTimeinterval ? this.dateSvc.formatLocal(data.LastTimeinterval.RelDate, 'YYYY-MM-DD') : '';
	}

	private formatterHistory(items: IBisPrjHistoryEntity[] | undefined | null): IFormatteredHistory[] {
		const result: IFormatteredHistory[] = [];
		if (items !== null && items !== undefined && items.length > 0) {
			const orderedItems = orderBy(items, ['RibHistoryId']);
			forEach(orderedItems, (historyItem) => {
				result.push({
					Value: historyItem.RibHistoryId,
					Description: historyItem.HistoryDescription !== undefined && historyItem.HistoryDescription !== null ? historyItem.HistoryDescription : '',
					RibPrjHistroyKey: historyItem.Id,
				});
			});
		}

		return result;
	}

	private formatterPeriod(items: IBisDpTimeintervalEntity[] | undefined | null): IFormatteredPeriod[] {
		const result: IFormatteredPeriod[] = [];
		if (items !== null && items !== undefined && items.length > 0) {
			forEach(items, (periodItem) => {
				result.push({
					Id: this.dateSvc.formatLocal(periodItem.RelDate, 'L'),
					Value: this.dateSvc.formatLocal(periodItem.RelDate, 'L'),
					Description: this.dateSvc.formatLocal(periodItem.RelDate, 'YYYY-MM-DD'),
				});
			});
		}

		return result;
	}

	// todo: implement the callbackFunc
	// private async loadPeriods(callbackFunc) {
	private async loadPeriods() {
		this.period = '';
		this.periods = [];
		const historySelected = find(this.histroyEntities, { RibPrjHistroyKey: this.historyVersions.ribHistoryId });
		if (historySelected) {
			this.historyVersions.ribPrjHistroyKey = historySelected.RibPrjHistroyKey;
		}
		if (this.historyVersions.ribHistoryId > 0) {
			const requestInfo: ITimeIntervalListRequest = {
				ProjectId: this.historyVersions.projectId,
				HistoryNo: this.historyVersions.ribHistoryId,
				HistoryId: this.historyVersions.ribPrjHistroyKey,
			};

			const response = (await firstValueFrom(this.http.post(this.configSvc.webApiBaseUrl + 'controlling/BisDpTimeinterval/list', requestInfo))) as ITimeIntervalListResponse;

			if (response.TimeIntervalList) {
				this.periods = this.formatterPeriod(response.TimeIntervalList);
				this.period = isArray(this.periods) && this.periods.length > 0 ? this.periods[this.periods.length - 1].Value : '';
				// todo: implement the callback function
				// if(callbackFunc){
				// 	callbackFunc(this.historyVersions);
				// }
			}
			if (response.PrjClassfications) {
				// todo: implement the callback function
				// onGroupingConfigChanged.fire(response.data.prjClassfications);
			}
		}
	}

	private generateRequest(state: IGroupingstate[], uuid: string) {
		const historyVersions = this.getHistoryVersions();

		const request: ICostAnalysisRequest = {
			Module: this.moduleName,
			ProjectId: historyVersions.projectId,
			ProjectNo: historyVersions.projectCode,
			ProjectName: historyVersions.projectName,
			RibHistoryId: historyVersions.ribPrjHistroyKey,
			Period: historyVersions.datePeriod,
			ShowEmptyData: historyVersions.showEmptyData,
			GroupingColumns: this.dashboardStructureSvc.getGroupingColumns(state),
			OutputColumns: [],
			ReportPeriodColumns: [],
			// TODO: ADD filterRequest
			// filterRequest: cloudDesktopSidebarService.getFilterRequestParams() // added Filter from Sidebar as well
			ForGroupingStructureInfo: false,
		};

		// todo: Implement controllingProjectControlsConfigService
		// const ignoreColumns = ['indicator', 'tree', 'code', 'itemCount'];

		// let columnDefs = controllingProjectControlsConfigService.getColumns();
		// if(platformGridAPI.columns.configuration(uuid)){
		// 	forEach(platformGridAPI.columns.configuration(uuid).visible, private (column) {
		// 		if (column && (ignoreColumns.indexOf(column.id) < 0)) {
		// 			// aggregates.push(column);
		// 			let columnDef = find(columnDefs, {id: column.$field || column.field});
		// 			request.outputColumns.push({
		// 				outputColumnName: column.$field || column.field,
		// 				aggregateprivate: column.aggregates,
		// 				sortingBy: 0,
		// 				propDefInfo: columnDef && columnDef.propDefInfo ? {
		// 					type: columnDef.propDefInfo.type,
		// 					id: columnDef.propDefInfo.item.Id,
		// 					code: columnDef.propDefInfo.item.Code,
		// 					basContrColumnTypeFk: columnDef.propDefInfo.item.BasContrColumnTypeFk
		// 				} : null
		// 			});
		// 		}
		// 	});
		// }

		// todo: Implement controlling costcode drill down container
		// controlling cost code container
		// let  controllingCostCodeUUid='c3ff22726eda437b84bb9a124d8085c9';
		// if(platformGridAPI.columns.configuration(controllingCostCodeUUid)){
		//
		// 	let ignoreColumns = ['indicator', 'tree', 'code', 'itemCount'];
		//
		// 	forEach(platformGridAPI.columns.configuration(controllingCostCodeUUid).visible, private (column) {
		// 		if (column && (ignoreColumns.indexOf(column.id) < 0)) {
		// 			let columnDef = find(columnDefs, {id: column.$field || column.field});
		// 			request.outputColumns.push({
		// 				outputColumnName: column.$field || column.field,
		// 				aggregateprivate: column.aggregates,
		// 				sortingBy: 0,
		// 				propDefInfo: columnDef && columnDef.propDefInfo ? {
		// 					type: columnDef.propDefInfo.type,
		// 					id: columnDef.propDefInfo.item.Id,
		// 					code: columnDef.propDefInfo.item.Code
		// 				} : null
		// 			});
		// 		}
		// 	});
		// }

		// const barChartConfigs = this.getBarChartConfigurations(null);

		// bar chart relate columns
		// if (isArray(barChartConfigs.groupingStructure) && barChartConfigs.groupingStructure.length > 0) {
		// 	forEach(barChartConfigs.groupingStructure, (configItem) => {
		// 		if (!some(request.OutputColumns, { outputColumnName: configItem.code })) {
		// 			request.OutputColumns.push({
		// 				OutputColumnName: configItem.code,
		// 				Aggregateprivate: null,
		// 				SortingBy: 0,
		// 				PropDefInfo: {
		// 					Type: 1,
		// 					Id: configItem.id,
		// 					Code: configItem.code,
		// 					BasContrColumnTypeFk: configItem.BasContrColumnTypeFk,
		// 				},
		// 			});
		// 		}
		// 	});
		// }

		// line chart relate columns
		// if (isArray(barChartConfigs.reportPeriod) && barChartConfigs.reportPeriod.length > 0) {
		// 	forEach(barChartConfigs.reportPeriod, (configItem) => {
		// 		request.ReportPeriodColumns.push({
		// 			OutputColumnName: configItem.id,
		// 			Aggregateprivate: null,
		// 			SortingBy: 0,
		// 			PropDefInfo: {
		// 				Type: 1,
		// 				Id: configItem.id,
		// 				Code: configItem.code,
		// 				BasContrColumnTypeFk: configItem.BasContrColumnTypeFk,
		// 			},
		// 		});
		// 	});
		// }

		return request;
	}

	private reload() {
		this.historyVersions.ribHistoryId = -1;
		this.historyVersions.ribPrjHistroyKey = -1;

		// todo: can be replaced with this.reload()?
		// this.load();
		this.reload();
	}

	private async loadGroupingStructureInfos() {
		let groupingColumns = this.dashboardStructureSvc.getGroupingColumns(this.groupingstate);
		groupingColumns = this.dashboardStructureSvc.getMergedAllGroupingColumns(groupingColumns);

		if (!isArray(groupingColumns) || groupingColumns.length < 1) {
			return;
		}

		forEach(groupingColumns, (group) => {
			// if the dept of structure is null or 0, should get all dept of the structure for structure info(boq, activity, etc)
			group.Depth = group.Depth && group.Depth > 0 ? group.Depth : 8;
		});

		const request = {
			module: this.moduleName,
			projectId: this.historyVersions.projectId,
			ribHistoryId: this.historyVersions.ribPrjHistroyKey,
			period: this.historyVersions.datePeriod,
			groupingColumns: groupingColumns,
			showEmptyData: this.historyVersions.showEmptyData,
			outputColumns: [],
			reportPeriodColumns: [],
		};

		const response = (await firstValueFrom(this.http.post(this.configSvc.webApiBaseUrl + 'controlling/projectcontrols/dashboard/getgroupingstructureinfos', request))) as IGroupingStructureInfoResponse;

		if (response) {
			const groupingStructureAnalysis = isArray(response.CostAnalysis) && response.CostAnalysis.length > 0 ? response.CostAnalysis : [];
			// const groupingStructureInfos = isArray(response.StructureInfo) && response.StructureInfo.length > 0 ? response.StructureInfo : [];

			this.groupingStructureList = [];
			this.flatten(groupingStructureAnalysis, this.groupingStructureList);

			// todo: how to add property dynamiclly
			// for (let level = 1; level <= groupingStructureInfos.length; level++) {
			// 	const groupingStructure = groupingStructureInfos[level - 1];
			// 	if (Object.prototype.hasOwnProperty.call(groupingStructure, 'GroupColumnId')) {
			// 		const groupingStructureField = this.groupingStructureFieldMapping[groupingStructure.GroupColumnId];
			// 		console.log(groupingStructureField);
			//
			// 		const structureInfos = groupingStructure.GroupingStructureInfos;
			// 		let info = null;
			//
			// 		forEach(this.groupingStructureList, (item) => {
			// 			info = find(structureInfos, { StructureId: item['StructureLevel' + level + 'Id'] });
			// 			if (info) {
			// 				item[groupingStructureField] = info.StructureSourceId;
			// 			}
			// 		});
			// 	}
			// }
		}
	}

	private flatten(input: IControllingProjectcontrolsCostAnalysisEntity[], output: IControllingProjectcontrolsCostAnalysisEntity[]) {
		input.forEach((entity) => {
			output.push(entity);
			if (entity.Children && entity.Children.length > 0) {
				this.flatten(entity.Children, output);
			}
		});
	}

	// todo: Implement ProjectcontrolsMessenger
	// let onConfigurationChanged = new ProjectcontrolsMessenger();

	// private registerConfigurationChanged(func){
	// 	onConfigurationChanged.register(func);
	// }
	//
	// private unregisterConfigurationChanged(func){
	// 	onConfigurationChanged.unregister(func);
	// }

	private getBarChartConfigurations(itemSelected: IControllingProjectcontrolsCostAnalysisEntity | null) {
		const retValue = {
			reportPeriod: [],
			groupingStructure: [],
		};

		// todo:
		// let configs = onConfigurationChanged.fire(itemSelected);
		// if(isArray(configs) && configs.length > 0){
		// 	forEach(configs, (item) => {
		// 		if(item.categoryType === 1){
		// 			retValue.reportPeriod = retValue.reportPeriod.concat(item.series);
		// 		}else{
		// 			retValue.groupingStructure = retValue.groupingStructure.concat(item.series);
		// 		}
		// 	});
		// }

		return retValue;
	}

	// todo: implement  ProjectcontrolsMessenger
	// 	private onCostAnalysisLoaded = new ProjectcontrolsMessenger();
	//
	// 	private registerCostAnalysisLoaded(func){
	// 		onCostAnalysisLoaded.register(func);
	// 	}
	//
	// 	private unregisterCostAnalysisLoaded(func){
	// 		onCostAnalysisLoaded.unregister(func);
	// 	}

	private getGroupItems() {
		return this.containerItems;
	}

	private setGroupItems(items: []) {
		if (isArray(items)) {
			this.containerItems = items;
		}
	}

	private selectedItems(items: IControllingProjectcontrolsCostAnalysisEntity[] | null) {
		if (items !== null) {
			this.selectedItemList = items;
		}

		return this.selectedItemList;
	}

	private clearSelectedItems() {
		this.selectedItemList = [];
	}

	private removeMarkers() {
		const list = filter(this.containerItems, { IsMarked: true });
		list.forEach((item) => {
			item.IsMarked = false;
		});
	}

	private getGroupingstate() {
		return this.groupingstate;
	}

	private cleanGroupingstate() {
		this.groupingstate = [];
	}

	private addGroupingItem(cid: string, column: IGroupingType) {
		const index = findIndex(this.groupingstate, { Id: cid });
		if (index < 0) {
			this.groupingstate.push({
				Id: cid,
				Levels: 0,
				Depth: (column && column.Grouping && column.Grouping.MaxLevels) || 1,
				Grouping: column.Metadata.GroupId,
				Metadata: column.Metadata,
			});
		}
	}

	private removeGroupingItem(cid: string) {
		const index = findIndex(this.groupingstate, { Id: cid });

		if (index >= 0) {
			this.groupingstate.splice(index, 1);
		}
	}

	// todo:
	// let onHistoryVersionChanged = new ProjectcontrolsMessenger();
	// let onHistoryVersionListUpdated = new ProjectcontrolsMessenger();
	// let onGroupingConfigChanged = new ProjectcontrolsMessenger();

	// private registerHistoryVersionChanged(func){
	// 	onHistoryVersionChanged.register(func);
	// }
	//
	// private unregisterHistoryVersionChanged(func){
	// 	onHistoryVersionChanged.unregister(func);
	// }

	// private registerGroupingConfigChanged(func){
	// 	onGroupingConfigChanged.register(func);
	// }
	//
	// private unregisterGroupingConfigChanged(func){
	// 	onGroupingConfigChanged.unregister(func);
	// }

	// private registerHistoryVersionListUpdated(func){
	// 	onHistoryVersionListUpdated.register(func);
	// }
	//
	// private unregisterHistoryVersionListUpdated(func){
	// 	onHistoryVersionListUpdated.unregister(func);
	// }

	private getProjectInfo(): IControllingCommonProjectEntity | null {
		const selection = this.projectSvc.getSelection();
		return selection.length > 0 ? selection[0] : null;
	}

	private getGroupingColumns() {
		return this.dashboardStructureSvc.getGroupingColumns(this.groupingstate);
	}

	// todo: dashboardStructureSvc
	// private getAllGroupingColumns() {
	// 	let groupingColumns = this.dashboardStructureSvc.getGroupingColumns(this.groupingstate);
	// 	groupingColumns = this.dashboardStructureSvc.getMergedAllGroupingColumns(groupingColumns);
	// 	return groupingColumns;
	// }

	private getTreeList(currentItem: IControllingProjectcontrolsCostAnalysisEntity) {
		const treeList: IControllingProjectcontrolsCostAnalysisEntity[] = [];
		this.flatten([currentItem], treeList);
		return treeList;
	}

	private getGroupingStructureList() {
		return this.groupingStructureList;
	}

	private getRIBHistoryId() {
		return this.historyVersions.ribPrjHistroyKey;
	}

	private setGridId(value: string) {
		this.gridId = value;
	}

	private existGrid() {
		if (this.gridId === '') {
			return false;
		}

		// todo:
		// return platformGridAPI.grids.exist(gridId);

		return false;
	}

	private afterVersionDeleted(deletedVersion: IControllingCommonBisPrjHistoryEntity, isLastVersion: boolean): void {
		const selectedVersion = this.getHistoryVersions();

		if (!deletedVersion || !selectedVersion) {
			return;
		}

		if (selectedVersion.ribPrjHistroyKey === deletedVersion.Id) {
			this.needToReload = isLastVersion;
			this.needToLoad = !isLastVersion;

			if (!this.existGrid()) {
				return;
			}

			if (isLastVersion) {
				this.reload();
			} else {
				this.reload();
			}
		} else {
			const index = findIndex(this.histroyEntities, { RibPrjHistroyKey: deletedVersion.Id });
			if (index >= 0) {
				this.histroyEntities.splice(index, 1);
			}
			// todo:
			// 		onHistoryVersionListUpdated.fire();
		}
	}

	private generateSACItem(relCoFk: number, relConccFk: number, period: string, basContrColumnId: number): IMdcContrSacValueEntity {
		const item = {
			Id: ++this.sacItemIdCount,
			RelCoFk: relCoFk,
			RelConccFk: relConccFk,
			MdcContrFormulaPropDefFk: basContrColumnId,
			Value: 0,
			Period: period,
		};
		this.stagingActualsValueList.push(item);

		return item;
	}

	private getSACValueList(selectedItem: IControllingProjectcontrolsCostAnalysisEntity, basContrColumnId: number) {
		let result: IMdcContrSacValueEntity[] = [];

		if (selectedItem) {
			const editableInfo = selectedItem.EditableInfo;
			if (editableInfo !== undefined) {
				result = filter(this.stagingActualsValueList, (value) => {
					return editableInfo.ControllingUnitFk === value.RelCoFk && editableInfo.ControllingUnitCostCodeFk === value.RelConccFk && basContrColumnId === value.MdcContrFormulaPropDefFk;
				});

				const periods = this.getPeriods();
				forEach(periods, (period) => {
					if (!find(result, { Period: period.Description })) {
						const newSacItem = this.generateSACItem(editableInfo.ControllingUnitFk, editableInfo.ControllingUnitCostCodeFk, period.Description, basContrColumnId);
						result.push(newSacItem);
					}
				});
			}
		} else {
			result = this.stagingActualsValueList;
		}

		return sortBy(result, ['Period']);
	}

	private forceLoadService() {
		if (this.needToLoad || this.needToReload) {
			if (this.needToLoad) {
				this.reload();
			} else if (this.needToReload) {
				this.reload();
			}
		}
	}

	private getGroupColumnForExtendControlCostCode() {
		const groupingColumns = clone(this.getGroupingColumns());
		groupingColumns.push({
			Id: 4,
			GroupColumnId: 'REL_COSTCODE_CO',
			GroupType: 3,
			Depth: 8,
			DateOption: '',
			SortingBy: 0,
		});

		return groupingColumns;
	}

	private clearCostAnalysisCacheForCuCostCode() {
		const groupingColumns = this.getGroupColumnForExtendControlCostCode();
		const groupColumnIdString = map(groupingColumns, 'groupColumnId').toString();

		// todo: basicsLookupdataLookupDescriptorService
		// $injector.get('basicsLookupdataLookupDescriptorService').removeData(groupColumnIdString);
		return groupColumnIdString;
	}

	private prepareReadData() {
		const selectedProject = this.getProjectInfo();

		if (selectedProject !== null) {
			if (this.projectSelected === null || this.projectSelected.Id !== selectedProject.Id) {
				this.historyVersions.ribHistoryId = -1;
				this.historyVersions.ribPrjHistroyKey = -1;
				this.historyVersions.projectCode = selectedProject.ProjectNo;
				this.historyVersions.projectName = selectedProject.ProjectName;
				this.projectSelected = selectedProject;
				this.historyVersions.projectId = selectedProject.Id;
			}
		}

		this.needToReload = false;
		this.needToLoad = false;

		const request = this.generateRequest(this.getGroupingstate(), '773618e488874716a5ed278aa3663865');

		if (request && size(request.GroupingColumns) > 0) {
			this.forceReloadAfterFirstInit = () => {};
		}

		return request;
	}

	public initDashboardData() {
		const request = this.prepareReadData();

		request.ProjectName = 'Controlling Test';
		request.ProjectNo = '202304171-HILARY';
		request.GroupingColumns = [
			{
				DateOption: '',
				Depth: 8,
				GroupColumnId: 'REL_CO',
				GroupType: 3,
				Id: 1,
				SortingBy: 0,
			},
		];
		request.OutputColumns = [
			{
				OutputColumnName: 'Description',
				PropDefInfo: null,
				SortingBy: 0,
			},
			{
				OutputColumnName: 'EC_AQ_in_RP',
				PropDefInfo: {
					Type: 1,
					Id: 1,
					Code: 'EC_AQ_in_RP',
				},
				SortingBy: 0,
			},
			{
				OutputColumnName: 'EC_AQ_to_RP',
				PropDefInfo: {
					Type: 1,
					Id: 2,
					Code: 'EC_AQ_to_RP',
				},
				SortingBy: 0,
			},
			{
				OutputColumnName: 'EC_AQ_Total',
				PropDefInfo: {
					Type: 1,
					Id: 3,
					Code: 'EC_AQ_Total',
				},
				SortingBy: 0,
			},
			{
				OutputColumnName: 'JUC1TEST',
				PropDefInfo: {
					Type: 2,
					Id: 1000479,
					Code: 'JUC1TEST',
				},
				SortingBy: 0,
			},
			{
				OutputColumnName: 'CHECKB1',
				PropDefInfo: {
					Type: 2,
					Id: 1000542,
					Code: 'CHECKB1',
				},
				SortingBy: 0,
			},
		];
		request.Module = '';
		request.Period = '2024-01-31';
		request.ProjectId = 1014477;
		request.ReportPeriodColumns = [];
		request.RibHistoryId = -1;
		request.ShowEmptyData = true;

		return this.http.post<ICostAnalysisComposite>(this.configSvc.webApiBaseUrl + 'controlling/projectcontrols/dashboard/compositecostanalysis', request);
	}

	private async loadDashBorad() {
		let costAnalysis: IControllingProjectcontrolsCostAnalysisEntity[] = [];

		const selectedProject = this.getProjectInfo();

		if (selectedProject !== null) {
			if (this.projectSelected === null || this.projectSelected.Id !== selectedProject.Id) {
				this.historyVersions.ribHistoryId = -1;
				this.historyVersions.ribPrjHistroyKey = -1;
				this.historyVersions.projectCode = selectedProject.ProjectNo;
				this.historyVersions.projectName = selectedProject.ProjectName;
				this.projectSelected = selectedProject;
				this.historyVersions.projectId = selectedProject.Id;
			}

			const requestInfo = this.generateRequest(clone(this.groupingstate), '773618e488874716a5ed278aa3663865');
			const _groupingstateTemp: IContrGroupColumn = {
				Id: 4,
				GroupColumnId: 'REL_COSTCODE_CO',
				GroupType: 3,
				Depth: 8,
				DateOption: '',
				SortingBy: 0,
			};

			requestInfo.GroupingColumns.push(_groupingstateTemp);
			const response = (await firstValueFrom(this.http.post(this.configSvc.webApiBaseUrl + 'controlling/projectcontrols/dashboard/compositecostanalysis', requestInfo))) as ICostAnalysisComposite;

			if (response.CostAnalysis) {
				costAnalysis = response.CostAnalysis;
			}
		}

		return costAnalysis;
	}

	private markSACItemAsModified(dashboardItem: IControllingProjectcontrolsCostAnalysisEntity, sacItem: IMdcContrSacValueEntity | undefined, field: string | null, basContrColumnId: number | null) {
		if (!dashboardItem || !dashboardItem.EditableInfo) {
			return;
		}

		basContrColumnId = basContrColumnId === null ? -1 : basContrColumnId;
		const editableInfo: IGroupingItemEditableInfo = dashboardItem.EditableInfo;

		if (!sacItem) {
			sacItem = find(this.stagingActualsValueList, (value) => {
				return editableInfo.ControllingUnitFk === value.RelCoFk && editableInfo.ControllingUnitCostCodeFk === value.RelConccFk && value.Period === this.historyVersions.datePeriod && value.MdcContrFormulaPropDefFk === basContrColumnId;
			});
		}

		if (!sacItem) {
			sacItem = this.generateSACItem(editableInfo.ControllingUnitFk, editableInfo.ControllingUnitCostCodeFk, this.historyVersions.datePeriod, basContrColumnId);
		}

		if (sacItem) {
			if (field) {
				// todo: need to dynamic column logic;
				// sacItem.Value = dashboardItem[field + '_IN_RP'];
			}

			sacItem.isModified = true;

			// todo:
			// service.markItemAsModified(dashboardItem);
		}
	}

	private getModifiedSACValue() {
		return filter(this.stagingActualsValueList, { isModified: true });
	}

	private forceReloadAfterFirstInit() {
		if (this.projectSelected) {
			this.reload();
		}
	}
}
