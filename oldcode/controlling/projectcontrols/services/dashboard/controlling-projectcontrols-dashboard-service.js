(function (angular) {
	/* global _, globals  */

	'use strict';
	let moduleName = 'controlling.projectcontrols';

	let module = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name basicsIndexDetailService
	 * @function
	 *
	 * @description
	 * basicsIndexDetailService is the data service for all index detail related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	module.factory('controllingProjectcontrolsDashboardService', ['platformDataServiceFactory', '$http', 'moment', 'ProjectcontrolsMessenger', 'platformGridAPI',
		'cloudDesktopSidebarService', 'controllingProjectcontrolsDashboardStructureService', 'controllingProjectControlsConfigService',
		'controllingProjectcontrolsProjectMainListDataService','cloudCommonGridService', 'controllingProjectcontrolsDashboardProcessor',
		'platformContextService', 'platformLanguageService', '$injector', '$timeout',
		function (platformDataServiceFactory, $http, moment, ProjectcontrolsMessenger, platformGridAPI, cloudDesktopSidebarService, dashboardStructureService,
			controllingProjectControlsConfigService, controllingProjectcontrolsProjectMainListDataService,cloudCommonGridService, controllingProjectcontrolsDashboardProcessor,
			platformContextService, platformLanguageService, $injector, $timeout) {

			let service ={};
			
			let _stagingActualsValueList = [];
			let _needToReload = false;
			let _needToLoad = false;
			let _groupingstate = [];
			let _projectSelected = null;
			let _sacItemIdCount = 0;
			let _controllingCostCodeUUid='c3ff22726eda437b84bb9a124d8085c9';
			let historyVersions = {
				showEmptyData : true,
				projectId: -1,
				projectCode: 'Structure Code',
				projectDescription: '',
				ribHistoryId: -1,
				ribPrjHistroyKey: -1,
				historyDescription: 'Version',
				histroyEntities: [],
				period: '',
				datePeriod: '',
				periods: []
			};

			let onCostAnalysisLoaded = new ProjectcontrolsMessenger();
			let onHistoryVersionChanged = new ProjectcontrolsMessenger();
			let onGroupingConfigChanged = new ProjectcontrolsMessenger();			
			let _culture = platformContextService.culture();
			let _cultureInfo = platformLanguageService.getLanguageInfo(_culture);
			let _PeriodCostAnalysisList = null;

			let dashboardOption = {
				hierarchicalNodeItem: {
					module: module,
					serviceName: 'controllingProjectcontrolsDashboardService',
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/projectcontrols/dashboard/',
						endRead: 'compositecostanalysis',
						initReadData: function initReadData(readData) {
							let projectSelected = service.getProjectInfo();
							if(!_projectSelected || _projectSelected.Id !== projectSelected.Id){
								historyVersions.ribHistoryId = -1;
								historyVersions.ribPrjHistroyKey = -1;
								historyVersions.projectCode = projectSelected.ProjectNo;
								historyVersions.projectName = projectSelected.ProjectName;
								_projectSelected = projectSelected;
							}
							_needToReload = false;
							_needToLoad = false;
							historyVersions.projectId = projectSelected.Id;
							let request = generateRequest(_groupingstate, '773618e488874716a5ed278aa3663865');
							if(request && _.size(request.groupingColumns) > 0){
								service.forceReloadAfterFirstInit = null;
							}
							angular.extend(readData, request);
							return readData;
						},
						usePostForRead: true
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'controlling/projectcontrols/dashboard/',
						endUpdate: 'update'
					},
					entitySelection: {
						supportsMultiSelection: false
					},
					setCellFocus: true,
					presenter: {
						tree: {
							parentProp: 'ParentFk',
							childProp: 'Children',
							incorporateDataRead: function incorporateDataRead(readData, data) {
								service.clearCostAnalysisCacheForCuCostCode();
								_PeriodCostAnalysisList = null;
								_groupingStructureList = [];
								_stagingActualsValueList = angular.isArray(readData.stagingActualsValues) ? readData.stagingActualsValues : [];
								_sacItemIdCount = _.isArray(_stagingActualsValueList) && _stagingActualsValueList.length > 0 ? _.max(_.map(_stagingActualsValueList, 'Id')) : 0;
								if(readData.HistoryInfo){
									buildHistoryVersion(readData.HistoryInfo);
									onHistoryVersionChanged.fire(historyVersions);
								}
								data.handleReadSucceeded(readData.CostAnalysis, data);

								$timeout(function() {
									if(angular.isArray(readData.CostAnalysis) && readData.CostAnalysis.length > 0){
										// clean the selected entity info first, then reset the selected entity.
										data.selectedItem = null;
										data.getService().setSelected(readData.CostAnalysis[0]);
									}

									onGroupingConfigChanged.fire(readData.PrjClassifications || []);
									onCostAnalysisLoaded.fire(readData.CostAnalysisByPeriod || []);
								}, 100);

								loadGroupingStructureInfos();
							}
						}
					},
					actions:{

					},
					dataProcessor: [controllingProjectcontrolsDashboardProcessor],
					entityRole: {
						node: {
							codeField: 'Code',
							itemName: 'GroupingItem',
							moduleName: 'controlling.projectcontrols',
							parentService: controllingProjectcontrolsProjectMainListDataService
						}
					}
				}
			};

			let container = platformDataServiceFactory.createNewComplete(dashboardOption);
			service = container.service;
			let data = container.data;

			let _containerItems = [];
			let _selectedItems = [];
			
			let _groupingStructureList = [];
			

			let _groupingStructureFieldMapping = {
				REL_CO : 'MdcControllingunitFk',
				REL_ACTIVITY : 'PsdActivityFk',
				REL_COSTCODE : 'MdcCostCodeFk',
				REL_COSTCODE_CO : 'MdcContrCostCodeFk',
				REL_BOQ : 'BoqItemFk',
				REL_PACKAGE : 'PrcPackageFk'
			};

			function renderFilterOptions(item){
				if(!item || !_groupingstate || _groupingstate.length < 1){
					return;
				}

				let colorOptions = _groupingstate[item.StructureLevel - 1] ? _groupingstate[item.StructureLevel - 1].colorOptions : null;
				if(colorOptions && colorOptions.enabled){
					item.$$indColor = colorOptions.color;
				}else{
					item.$$indColor = null;
				}
			}

			function checkValueByCulture(value){
				if(!_.isNumber(value) && (!_.isString(value) || value === '')){
					return {
						value: 0,
						valueDetail: '0'
					};
				}

				let result = {
					value: value,
					valueDetail: value
				};

				if (_cultureInfo && _cultureInfo.numeric) {
					let numberDecimal = _cultureInfo.numeric.decimal;

					if (_.isNumber(value)){
						value = _.toString(value);
					}

					if (_.isString(value)) {
						if (value.indexOf(numberDecimal) !== -1) {
							result.value = value.replace(numberDecimal, '.');
						}

						let inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
						if (value.indexOf(numberDecimal) === -1 && value.indexOf(inverseNumberDecimal) !== -1) {
							result.valueDetail = value.replace('.', ',');
						}
					}
				}

				return result;
			}

			function getHistoryVersions(){
				return historyVersions;
			}

			function getVersions(){
				return historyVersions.histroyEntities;
			}

			function setSelectVersion(selectedItem){
				historyVersions.ribPrjHistroyKey = selectedItem.id;
				historyVersions.ribHistoryId = selectedItem.caption;
			}

			function getPeriods(){
				return historyVersions.periods;
			}

			function setSelectPeriod(value){
				historyVersions.period = value.id;
				historyVersions.datePeriod = value.description;
			}

			function isValidated(){
				return historyVersions.projectId <= 0 || historyVersions.ribPrjHistroyKey <= 0 || historyVersions.period === '' || historyVersions.datePeriod === '';
			}

			function showEmptyData(){
				return historyVersions.showEmptyData;
			}

			function toggleShowEmptyData(){
				historyVersions.showEmptyData = !historyVersions.showEmptyData;
				return historyVersions.showEmptyData;
			}

			function buildHistoryVersion(data){
				historyVersions.histroyEntities = formatterHistory(data.HistoryEntities);
				historyVersions.periods = formatterPeriod(data.TimeintervalEntities);
				historyVersions.ribHistoryId = data.LastHistoryEntity ? data.LastHistoryEntity.RibHistoryId : -1;
				historyVersions.ribPrjHistroyKey = data.LastHistoryEntity ? data.LastHistoryEntity.Id : -1;
				historyVersions.period = data.LastTimeinterval ? moment(data.LastTimeinterval.RelDate).format('L') : '';
				historyVersions.datePeriod = data.LastTimeinterval ? moment(data.LastTimeinterval.RelDate).format('YYYY-MM-DD') : '';

			}

			function formatterHistory(items){
				return _.map(_.orderBy(items, ['RibHistoryId']), function (historyItem) {
					return {
						value: historyItem.RibHistoryId,
						description: historyItem.HistoryDescription,
						ribPrjHistroyKey: historyItem.Id
					};
				});
			}

			function formatterPeriod(items){
				return _.map(items, function (periodItem) {
					return {
						value: moment(periodItem.RelDate).format('L'),
						description: moment(periodItem.RelDate).format('YYYY-MM-DD')
					};
				});
			}

			function loadPeriods(callbackFunc){
				historyVersions.period = '';
				historyVersions.periods = [];
				let historySelected = _.find(historyVersions.histroyEntities, {value: historyVersions.ribHistoryId});
				if (historySelected) {
					historyVersions.ribPrjHistroyKey = historySelected.ribPrjHistroyKey;
				}
				if (historyVersions.ribHistoryId > 0) {
					let requestInfo = {
						ProjectId: historyVersions.projectId,
						HistoryNo: historyVersions.ribHistoryId,
						HistoryId: historyVersions.ribPrjHistroyKey
					};
					$http.post(globals.webApiBaseUrl + 'controlling/BisDpTimeinterval/list', requestInfo).then(function (response) {
						if(response.data.timeIntervalList){
							historyVersions.periods = formatterPeriod(response.data.timeIntervalList);
							let lastPR = _.isArray(historyVersions.periods) && historyVersions.periods.length > 0 ? historyVersions.periods[historyVersions.periods.length-1] : null;
							if(!!lastPR){
								service.setSelectPeriod({id: lastPR.value, description: lastPR.description});
							}

							if(callbackFunc){
								callbackFunc(historyVersions);
							}
						}
						if(response.data.prjClassfications){
							onGroupingConfigChanged.fire(response.data.prjClassfications);
						}
					});
				}
			}

			function generateRequest(state, uuid){
				let historyVersions = getHistoryVersions();
				const groupingColumns = dashboardStructureService.getGroupingColumns(state);
				const packageGroupingColumn = _.find(groupingColumns, {groupColumnId: 'REL_PACKAGE'});

				const request = {
					module: moduleName,
					projectId: historyVersions.projectId,
					ProjectNo: historyVersions.projectCode,
					ProjectName: historyVersions.projectName,
					ribHistoryId: historyVersions.ribPrjHistroyKey,
					period: historyVersions.datePeriod,
					showEmptyData: historyVersions.showEmptyData,
					PackageDescriptionType: !!packageGroupingColumn ? packageGroupingColumn.showBP + packageGroupingColumn.showPackageDesc : 1,
					groupingColumns: groupingColumns,
					outputColumns: [],
					reportPeriodColumns:[],
					filterRequest: cloudDesktopSidebarService.getFilterRequestParams() // added Filter from Sidebar as well
				};

				let ignoreColumns = ['indicator', 'tree', 'code', 'itemCount'];

				function createOutPutColumn(column, columnDef){
					return {
						outputColumnName: column.$field || column.field,
						aggregateFunction: column.aggregates,
						sortingBy: 0,
						propDefInfo: columnDef && columnDef.propDefInfo ? {
							type: columnDef.propDefInfo.type,
							id: columnDef.propDefInfo.item.Id,
							code: columnDef.propDefInfo.item.Code,
							basContrColumnTypeFk: columnDef.propDefInfo.item.BasContrColumnTypeFk
						} : null
					}
				}

				let visibleColumns = [];
				let columnDefs = controllingProjectControlsConfigService.getColumns();
				let barChartConfigs = getBarChartConfigurations();

				// dashboard container
				if(platformGridAPI.columns.configuration(uuid)){
					visibleColumns = visibleColumns.concat(platformGridAPI.columns.configuration(uuid).visible);
				}

				// controlling cost code container
				if(platformGridAPI.columns.configuration(_controllingCostCodeUUid)){
					visibleColumns = visibleColumns.concat(platformGridAPI.columns.configuration(_controllingCostCodeUUid).visible);
				}

				// bar chart container
				if(_.isArray(barChartConfigs.groupingStructure) && barChartConfigs.groupingStructure.length > 0){
					_.forEach(barChartConfigs.groupingStructure, function(configItem){
						visibleColumns.push({
							field: configItem.code,
							aggregates: configItem.type
						})
					});
				}

				// line chart container
				if(_.isArray(barChartConfigs.reportPeriod) && barChartConfigs.reportPeriod.length > 0){
					_.forEach(barChartConfigs.reportPeriod, function (configItem){
						visibleColumns.push({
							field: configItem.code,
							aggregates: configItem.type
						})

						request.reportPeriodColumns.push({
							outputColumnName: configItem.id,
							aggregateFunction: null,
							sortingBy: 0,
							propDefInfo: {
								type: configItem.type,
								id: configItem.id,
								code: configItem.code
							}
						});
					});
				}

				_.forEach(visibleColumns, function (column) {
					if (column && (ignoreColumns.indexOf(column.id) < 0)) {
						let columnDef = _.find(columnDefs, {id: column.$field || column.field});
						request.outputColumns.push(createOutPutColumn(column, columnDef));
					}
				});

				return request;
			}

			function reload(){
				historyVersions.ribHistoryId = -1;
				historyVersions.ribPrjHistroyKey = -1;
				service.load();
			}

			function loadGroupingStructureInfos(){
				let groupingColumns = dashboardStructureService.getGroupingColumns(_groupingstate);
				groupingColumns = dashboardStructureService.getMergedAllGroupingColumns(groupingColumns);
				if(!_.isArray(groupingColumns) || groupingColumns.length < 1){
					return;
				}
				_.forEach(groupingColumns, function(group){
					// if the dept of structure is null or 0, should get all dept of the structure for structure info(boq, activity, etc)
					group.depth = group.depth && group.depth > 0 ? group.depth : 8;
				});

				const request = {
					module: moduleName,
					projectId: historyVersions.projectId,
					ribHistoryId: historyVersions.ribPrjHistroyKey,
					period: historyVersions.datePeriod,
					groupingColumns: groupingColumns,
					showEmptyData: historyVersions.showEmptyData,
					outputColumns: [],
					reportPeriodColumns:[]
				};

				$http.post(globals.webApiBaseUrl + 'controlling/projectcontrols/dashboard/getgroupingstructureinfos', request).then(function (response) {
					if(!response || !response.data){
						return;
					}

					let groupingStructureAnalysis = _.isArray(response.data.costAnalysis) && response.data.costAnalysis.length > 0 ? response.data.costAnalysis : [];
					let groupingStructureInfos = _.isArray(response.data.structureInfo) && response.data.structureInfo.length > 0 ? response.data.structureInfo : [];

					service.flatten(groupingStructureAnalysis, _groupingStructureList, 'Children');

					for(var level = 1; level <= groupingStructureInfos.length; level++){
						let groupingStructure = groupingStructureInfos[level - 1];
						if(Object.prototype.hasOwnProperty.call(groupingStructure, 'GroupColumnId')){
							let groupingStructureField = _groupingStructureFieldMapping[groupingStructure.GroupColumnId];
							let structureInfos = groupingStructure.GroupingStructureInfos;
							let info = null;

							_.forEach(_groupingStructureList, function(item){
								if(item.StructureLevel < level){
									item[groupingStructureField] = null;
								}else{
									info = _.find(structureInfos, {StructureId: item['StructureLevel' + level + 'Id']});
									item[groupingStructureField] = info ? info.StructureSourceId : -1;
								}
							});
						}
					}

					onGroupingStructureInfoLoaded.fire();
				});
			}

			let onGroupingStructureInfoLoaded = new ProjectcontrolsMessenger();
			function registerGroupingStructureInfoLoaded(func){
				onGroupingStructureInfoLoaded.register(func);
			}

			function unregisterGroupingStructureInfoLoaded(func){
				onGroupingStructureInfoLoaded.unregister(func);
			}

			let onConfigurationChanged = new ProjectcontrolsMessenger();

			function registerConfigurationChanged(func){
				onConfigurationChanged.register(func);
			}

			function unregisterConfigurationChanged(func){
				onConfigurationChanged.unregister(func);
			}

			function getBarChartConfigurations(itemSelected){
				let retValue = {
					reportPeriod : [],
					groupingStructure : []
				};
				let configs = onConfigurationChanged.fire(itemSelected);
				if(_.isArray(configs) && configs.length > 0){
					_.forEach(configs, function(item){
						if(item.categoryType === 1){
							retValue.reportPeriod = retValue.reportPeriod.concat(item.series);
						}else{
							retValue.groupingStructure = retValue.groupingStructure.concat(item.series);
						}
					});
				}
				return retValue;
			}


			function registerCostAnalysisLoaded(func){
				onCostAnalysisLoaded.register(func);
			}

			function unregisterCostAnalysisLoaded(func){
				onCostAnalysisLoaded.unregister(func);
			}

			function getGroupItems() {
				return _containerItems;
			}

			function setGroupItems(items){
				if(_.isArray(items)){
					_containerItems = items;
				}
			}

			function selectedItems(items) {
				if (items) {
					_selectedItems = items;
				} else {
					return _selectedItems;
				}
			}

			function clearSelectedItems() {
				_selectedItems = [];
			}

			function removeMarkers() {
				const list = _.filter(_containerItems, {'IsMarked': true});
				list.forEach(function (item) {
					_.set(item, 'IsMarked', false);
				});
			}

			function getGroupingstate(){
				return _groupingstate;
			}

			function cleanGroupingstate(){
				_groupingstate = [];
			}

			function addGroupingItem(cid, column){
				let index = _.findIndex(_groupingstate, {id: cid});
				if(index < 0){
					_groupingstate.push({
						id: cid,
						levels: 0,
						depth: column && column.grouping && column.grouping.maxLevels || 1,
						grouping: column.metadata.groupId,
						metadata: column.metadata
					});
				}
			}

			function removeGroupingItem(cid){
				let index = _.findIndex(_groupingstate, {id: cid});

				if (index >= 0) {
					_groupingstate.splice(index, 1);
				}
			}


			function registerHistoryVersionChanged(func){
				onHistoryVersionChanged.register(func);
			}

			function unregisterHistoryVersionChanged(func){
				onHistoryVersionChanged.unregister(func);
			}
			

			function registerGroupingConfigChanged(func){
				onGroupingConfigChanged.register(func);
			}

			function unregisterGroupingConfigChanged(func){
				onGroupingConfigChanged.unregister(func);
			}

			let onHistoryVersionListUpdated = new ProjectcontrolsMessenger();

			function registerHistoryVersionListUpdated(func){
				onHistoryVersionListUpdated.register(func);
			}

			function unregisterHistoryVersionListUpdated(func){
				onHistoryVersionListUpdated.unregister(func);
			}

			function getProjectInfo(){
				return controllingProjectcontrolsProjectMainListDataService.getSelected();
			}

			function getGroupingColumns(){
				return dashboardStructureService.getGroupingColumns(_groupingstate);
			}

			function getAllGroupingColumns(){
				let groupingColumns = dashboardStructureService.getGroupingColumns(_groupingstate);
				groupingColumns = dashboardStructureService.getMergedAllGroupingColumns(groupingColumns);
				return groupingColumns;
			}
			
			
			function getTreeList(currentItem) {
				let treeList = [];
				if(currentItem.Children) {
					cloudCommonGridService.flatten(currentItem.Children, treeList, 'Children');
				}
				return treeList;
			}

			function getGroupingStructureList(){
				return _groupingStructureList;
			}

			function flatten(input, output, childProp) {
				var i;
				for (i = 0; i < input.length; i++) {
					output.push(input[i]);
					if (input[i][childProp] && input[i][childProp].length > 0) {
						flatten(input[i][childProp], output, childProp);
					}
				}
				return output;
			}

			function getRIBHistoryId(){
				return historyVersions.ribPrjHistroyKey;
			}

			let gridId = '';
			function setGridId(value) {
				gridId = value;
			}

			function existGrid() {
				if (!gridId) {
					return false;
				}

				return platformGridAPI.grids.exist(gridId);
			}

			function afterVersionDeleted(deletedVersion, isLastVersion){
				let selectedVersion = getHistoryVersions();
				if(!deletedVersion || !selectedVersion){
					return false;
				}

				if(selectedVersion.ribPrjHistroyKey === deletedVersion.Id){
					_needToReload = isLastVersion;
					_needToLoad = !isLastVersion;

					if(!existGrid()){
						return;
					}

					if(isLastVersion){
						reload();
					}else {
						service.load();
					}
				}else{
					let index = _.findIndex(selectedVersion.histroyEntities, {ribPrjHistroyKey: deletedVersion.Id});
					if (index >= 0) {
						selectedVersion.histroyEntities.splice(index, 1);
					}

					onHistoryVersionListUpdated.fire();
				}
			}

			function generateSACItem(relCoFk, relConccFk, period, basContrColumnId){
				let item = {
					Id: ++_sacItemIdCount,
					Period: period,
					RelCoFk: relCoFk,
					RelConccFk: relConccFk,
					Value: 0,
					MdcContrFormulaPropDefFk: basContrColumnId
				};
				_stagingActualsValueList.push(item);

				return item;
			}

			function getSACValueList(selectedItem, basContrColumnId){
				let result = [];

				if(selectedItem && selectedItem.EditableInfo){
					result = _.filter(_stagingActualsValueList, function(value){
						return selectedItem.EditableInfo.ControllingUnitFk === value.RelCoFk
							&& selectedItem.EditableInfo.ControllingUnitCostCodeFk === value.RelConccFk
							&& basContrColumnId === value.MdcContrFormulaPropDefFk;
					});

					let periods = service.getPeriods();
					_.forEach(periods, function(period){
						if(!_.find(result, {'Period': period.description})){
							let newSacItem = generateSACItem(selectedItem.EditableInfo.ControllingUnitFk, selectedItem.EditableInfo.ControllingUnitCostCodeFk, period.description, basContrColumnId);
							result.push(newSacItem);
						}
					});
				}else{
					result = _stagingActualsValueList;
				}

				return _.sortBy(result, ['Period']);
			}

			function forceLoadService(){
				if(_needToLoad || _needToReload){
					if(_needToLoad){
						service.load();
					}else if(_needToReload){
						reload();
					}
				}
			}

			function getGroupColumnForExtendControlCostCode(){
				let  groupingColumns =angular.copy(service.getGroupingColumns());
				groupingColumns.push({
					id:4,
					groupColumnId: 'REL_COSTCODE_CO',
					groupType: 3,
					depth: 8,
					dateOption: null,
					sortingBy: 0
				});
				
				return groupingColumns;
			}
			
			function clearCostAnalysisCacheForCuCostCode(){
				let groupingColumns = service.getGroupColumnForExtendControlCostCode();
				let groupColumnIdString = _.map(groupingColumns,'groupColumnId').toString();
				$injector.get('basicsLookupdataLookupDescriptorService').removeData(groupColumnIdString);
			}
			
			function loadDashBorad(IsForPeriods) {
				
				let projectSelected = service.getProjectInfo();
				if (!_projectSelected || _projectSelected.Id !== projectSelected.Id) {
					historyVersions.ribHistoryId = -1;
					historyVersions.ribPrjHistroyKey = -1;
					historyVersions.projectCode = projectSelected.ProjectNo;
					historyVersions.projectName = projectSelected.ProjectName;
					_projectSelected = projectSelected;
				}
				historyVersions.projectId = projectSelected.Id;
				
				let requestInfo = generateRequest(angular.copy(_groupingstate), '773618e488874716a5ed278aa3663865');
				let _groupingstateTemp = {
					id: 4,
					groupColumnId: 'REL_COSTCODE_CO',
					groupType: 3,
					depth: 8,
					dateOption: null,
					sortingBy: 0
				};

				if(IsForPeriods){
					requestInfo.IsForPeriods = true;
					requestInfo.outputColumns = requestInfo.reportPeriodColumns;
				}else{
					requestInfo.groupingColumns.push(_groupingstateTemp);
				}

				return $http.post(globals.webApiBaseUrl + 'controlling/projectcontrols/dashboard/compositecostanalysis', requestInfo).then(function (response) {
					let costAnalysis = [];
					if (response && response.data && response.data.CostAnalysis) {
						costAnalysis = response.data.CostAnalysis;
					}
					return costAnalysis;
				});
				
			}
			
			function markSACItemAsModified(dashboardItem, sacItem, field, fieldConfig){
				if(!dashboardItem || !dashboardItem.EditableInfo){
					return;
				}

				let basContrColumnId = fieldConfig ? fieldConfig.basContrColumnId : -1;

				if(!sacItem){
					sacItem = _.find(_stagingActualsValueList, function(value){
						return dashboardItem.EditableInfo.ControllingUnitFk === value.RelCoFk
							&& dashboardItem.EditableInfo.ControllingUnitCostCodeFk === value.RelConccFk
							&& value.Period === historyVersions.datePeriod
							&& value.MdcContrFormulaPropDefFk === basContrColumnId;
					});
				}

				if(!sacItem){
					sacItem = generateSACItem(dashboardItem.EditableInfo.ControllingUnitFk, dashboardItem.EditableInfo.ControllingUnitCostCodeFk, historyVersions.datePeriod, basContrColumnId);
				}

				if(sacItem){
					if(field){
						sacItem.Value = dashboardItem[field + '_IN_RP'];
					}

					sacItem.isModified = true;
					service.markItemAsModified(dashboardItem);
				}
			}

			function getModifiedSACValue(){
				return _.filter(_stagingActualsValueList, {isModified: true});
			}

			function forceReloadAfterFirstInit() {
				if(_projectSelected){
					reload();
				}
			}

			function getGroupingStructureFieldMapping(){
				return _groupingStructureFieldMapping;
			}

			function setPeriodCostAnalysisList(list){
				_PeriodCostAnalysisList = list;
			}

			function getPeriodCostAnalysisList(){
				return _PeriodCostAnalysisList;
			}

			function getSelectedGroupingStructure(selectedDashboardItem){
				if(!selectedDashboardItem){
					selectedDashboardItem = service.getSelected();
				}
				if(!selectedDashboardItem){
					selectedDashboardItem = service.getSelectedEntities()[0];
				}

				if(selectedDashboardItem){
					let groupingStructureList = service.getGroupingStructureList();
					let selectedGroupingStructure = _.find(groupingStructureList, function (d) {
						for (let i = 1; i <= selectedDashboardItem.StructureLevel; i++) {
							if (d['StructureLevel' + i + 'Id'] !== selectedDashboardItem['StructureLevel' + i + 'Id'] || selectedDashboardItem.StructureIdId!== d.StructureIdId  || selectedDashboardItem.StructureLevel!== d.StructureLevel ) {
								return false;
							}
						}
						return true;
					});

					return selectedGroupingStructure
				}

				return null;
			}

			function getSelectedGroupingStructureList(selectedItem){
				let selectedGroupingStructure = getSelectedGroupingStructure(selectedItem);
				let selectedGroupingStructureList = [];

				if(selectedGroupingStructure){
					if (selectedGroupingStructure && selectedGroupingStructure.Children && selectedGroupingStructure.Children.length) {
						cloudCommonGridService.flatten([selectedGroupingStructure], selectedGroupingStructureList, 'Children');
					}
					if(selectedGroupingStructure) {
						selectedGroupingStructureList.push(selectedGroupingStructure);
					}
				}

				return selectedGroupingStructureList;
			}

			angular.extend(service,{
				getVersions : getVersions,
				setSelectVersion : setSelectVersion,
				getPeriods : getPeriods,
				setSelectPeriod : setSelectPeriod,
				isValidated : isValidated,
				showEmptyData : showEmptyData,
				toggleShowEmptyData : toggleShowEmptyData,
				loadPeriods : loadPeriods,
				getGroupItems: getGroupItems,
				setGroupItems: setGroupItems,
				selectedItems: selectedItems,
				clearSelectedItems: clearSelectedItems,
				removeMarkers: removeMarkers,
				getGroupingstate : getGroupingstate,
				addGroupingItem: addGroupingItem,
				removeGroupingItem : removeGroupingItem,
				getHistoryVersions: getHistoryVersions,
				reload: reload,
				registerConfigurationChanged:registerConfigurationChanged,
				unregisterConfigurationChanged:unregisterConfigurationChanged,
				registerCostAnalysisLoaded: registerCostAnalysisLoaded,
				unregisterCostAnalysisLoaded: unregisterCostAnalysisLoaded,
				registerHistoryVersionChanged : registerHistoryVersionChanged,
				unregisterHistoryVersionChanged: unregisterHistoryVersionChanged,
				registerGroupingConfigChanged: registerGroupingConfigChanged,
				unregisterGroupingConfigChanged: unregisterGroupingConfigChanged,
				getProjectInfo:getProjectInfo,
				getGroupingColumns:getGroupingColumns,
				cleanGroupingstate:cleanGroupingstate,
				getTreeList:getTreeList,
				flatten: flatten,
				getGroupingStructureList:getGroupingStructureList,
				getRIBHistoryId: getRIBHistoryId,
				existGrid: existGrid,
				setGridId: setGridId,
				afterVersionDeleted: afterVersionDeleted,
				registerHistoryVersionListUpdated: registerHistoryVersionListUpdated,
				unregisterHistoryVersionListUpdated: unregisterHistoryVersionListUpdated,
				getSACValueList: getSACValueList,
				forceLoadService: forceLoadService,
				markSACItemAsModified: markSACItemAsModified,
				checkValueByCulture: checkValueByCulture,
				getModifiedSACValue: getModifiedSACValue,
				getAllGroupingColumns:getAllGroupingColumns,
				loadDashBorad:loadDashBorad,
				clearCostAnalysisCacheForCuCostCode :clearCostAnalysisCacheForCuCostCode,
				getGroupColumnForExtendControlCostCode:getGroupColumnForExtendControlCostCode,
				forceReloadAfterFirstInit: forceReloadAfterFirstInit,
				getGroupingStructureFieldMapping: getGroupingStructureFieldMapping,
				getPeriodCostAnalysisList: getPeriodCostAnalysisList,
				setPeriodCostAnalysisList: setPeriodCostAnalysisList,
				getSelectedGroupingStructure: getSelectedGroupingStructure,
				getSelectedGroupingStructureList: getSelectedGroupingStructureList,
				registerGroupingStructureInfoLoaded: registerGroupingStructureInfoLoaded,
				unregisterGroupingStructureInfoLoaded: unregisterGroupingStructureInfoLoaded
			});

			angular.extend(data,{
				renderFilterOptions : renderFilterOptions
			});

			return service;
		}]);
})(angular);
