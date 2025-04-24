/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.parameter';
	/**
	 * @ngdoc service
	 * @name estimateParameterComplexInputgroupLookupService
	 * @function
	 * @description
	 * This is the data service for estimate parameter item related functionality.
	 */
	angular.module(moduleName).factory('estimateParameterComplexInputgroupLookupService',
		['$q', '$http', '$injector', 'PlatformMessenger', 'estimateParameterFormatterService', 'platformCreateUuid', 'platformGridAPI',
			'estimateParamUpdateService', 'estimateRuleCommonService', 'platformModalService', 'estimateMainService', 'estimateAssembliesService',
			'estimateMainCommonFeaturesService','$timeout','basicsLookupdataPopupService','estimateRuleParameterConstant',
			function (
				$q, $http, $injector, PlatformMessenger, estimateParameterFormatterService, platformCreateUuid, platformGridAPI,
				estimateParamUpdateService, estimateRuleCommonService, platformModalService, estimateMainService, estimateAssembliesService,
				estimateMainCommonFeaturesService,$timeout, basicsLookupdataPopupService,estimateRuleParameterConstant) {

				let service= {
					dataService : {},
					refreshRootParam : refreshRootParam,
					onCloseOverlayDialog : new PlatformMessenger()
				};
				let formatterOptions ={};
				let mainEntity= {};
				function refreshRootParam(entity, param, rootServices){
					if(entity.IsRoot || entity.IsEstHeaderRoot){
						angular.forEach(rootServices, function(serv){
							if(serv){
								let rootService = $injector.get(serv);
								let affectedRoot = _.find(rootService.getList(), {IsRoot : true});
								if(!affectedRoot){
									affectedRoot = _.find(rootService.getList(), {IsEstHeaderRoot : true});
								}
								if(affectedRoot){
									affectedRoot.Param = param;
									rootService.fireItemModified(affectedRoot);
								}
							}
						});
					}
				}

				service.gridGuid = function (){
					return '2191e2cd8adb48dc81b2150ca2cf5c53';
				};

				service.initController = function initController(scope, lookupControllerFactory, opt, popupInstance, coloumns) {
					// fix defect 85022,when delete Item record in Items container,the Line Item record disappear
					let tempHidePopup = basicsLookupdataPopupService.hidePopup;
					basicsLookupdataPopupService.hidePopup = function temp(){};

					let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
					estimateMainParameterValueLookupService.clear();

					let displayData = estimateParameterFormatterService.getItemsByParam(scope.entity, opt);
					displayData = _.sortBy(displayData, 'Code');
					let setParameterDataService = $injector.get('estimateParamDataService');
					setParameterDataService.setProjectIdNModule(opt.itemName,null);

					if(displayData.length === 0){
						let paramPromise = estimateParameterFormatterService.getItemsByParamEx(scope.entity, opt);
						$q.all([paramPromise]).then(function () {
							displayData = paramPromise.$$state.value;
							setParameterDataService.setParams(displayData);
							setParameterDataService.setParamsCache(angular.copy(displayData));

							$injector.get('estimateMainDeatailsParamListProcessor').processItems(displayData);
							$injector.get('estimateMainCommonCalculationService').resetParameterDetailValueByCulture(displayData);
							dataService.updateData(displayData);
						});
					}

					setParameterDataService.setParams(displayData);
					setParameterDataService.setParamsCache(angular.copy(displayData));
					let gridId =  service.gridGuid(); // platformCreateUuid();
					scope.displayItem=displayData;
					let gridOptions = {
						gridId: gridId,
						columns: coloumns,
						idProperty : 'Id',
						lazyInit: true,
						grouping: true,
						enableDraggableGroupBy: true
					};

					service.dataService = lookupControllerFactory.create({grid: true,dialog: true}, scope, gridOptions);

					let dataService = service.dataService;

					dataService.getList = function getList(){
						return displayData;
					};

					dataService.setformatterOptions = function setformatterOptions(opt){
						formatterOptions = opt;
					};

					dataService.getformatterOptions = function getformatterOptions(){
						return formatterOptions;
					};

					dataService.setMainEntity = function setMainEntity(entity){
						mainEntity = entity;
					};

					dataService.getMainEntity = function getMainEntity(){
						return mainEntity;
					};

					dataService.setformatterOptions(opt);
					dataService.setMainEntity(scope.entity);

					$injector.get('estimateMainDeatailsParamListProcessor').processItems(displayData);

					checkCodeConflict(displayData,true);

					dataService.updateData(displayData);
					// inputGroupService = self;
					dataService.scope = scope;
					dataService.opt = opt;

					// resize the content by interaction
					popupInstance.onResizeStop.register(function () {
						platformGridAPI.grids.resize(gridOptions.gridId);
					});

					let updateDisplayData = function updateDisplayData(displayData){
						scope.displayItem = displayData;

						// this make the user's created item whose code validation error
						scope.ngModel = _.map(displayData, 'Code');
						scope.entity.Param = scope.ngModel;
						$injector.get('estimateMainDeatailsParamListProcessor').processItems(displayData);
						dataService.updateData(displayData);

						// fix defect 93277, The lookup type parameter is not get the values from Assembly parameter.
						// handle Assembly's parameter
						// if it's from Aseembly module, item.AssignedStructureId === null
						let estimateAssembliesService = $injector.get('estimateAssembliesService');
						// handle Assembly module's parameter changes
						if(estimateAssembliesService && estimateAssembliesService.isAssemblyParameterActived)
						{
							estimateAssembliesService.fireItemModified(scope.entity);
						}
						else
						{
							let itemService = $injector.get(opt.itemServiceName);
							itemService.fireItemModified(scope.entity);
							refreshRootParam(scope.entity, scope.ngModel, opt.RootServices);
						}

					};

					dataService.gridRefresh = function () {
						let displayData = estimateParameterFormatterService.getItemsByParam(scope.entity, opt);
						updateDisplayData(displayData);
						platformGridAPI.grids.invalidate(gridId);
					};

					// refresh lookup displaydata and formatter after create and adding the data
					dataService.addData = function addData(params){
						if(! _.isArray(params)) {return;}
						angular.forEach(params, function(param){
							param.MainId = angular.copy(param.Id);
							param.Version = param.Version === -1 ? 0 : param.Version;

							$injector.get('estimateParameterComplexLookupValidationService').validateCode(param, param.Code, 'Code');
						});

						// fix defect 88659, The unnamed parameter still could be saved in Estimate
						// fix defect 93277, The lookup type parameter is not get the values from Assembly parameter.
						estimateParamUpdateService.setParamToSave(params, scope.entity, opt.itemServiceName, opt.itemName);

						let displayData = estimateParameterFormatterService.getItemsByParam(scope.entity, opt);
						updateDisplayData(displayData);
						platformGridAPI.grids.invalidate(gridId);
					};

					dataService.getEstLeadingStructContext = function getEstLeadingStructContext(){
						let item = angular.copy(scope.entity);
						item = estimateParamUpdateService.getLeadingStructureContext(item, scope.entity, opt.itemServiceName, opt.itemName);
						return {item : item, itemName: opt.itemName};
					};

					dataService.getEstLeadingStructureContext = function getEstLeadingStructureContext(){
						let item = {};
						let selectItem = $injector.get(opt.itemServiceName).getSelected();

						if(!selectItem){
							selectItem = angular.copy(scope.entity);
						}
						if(selectItem) {
							item = estimateParamUpdateService.getLeadingStructureContext(item, selectItem, opt.itemServiceName, opt.itemName);
						}
						return {item : item, itemName: opt.itemName};
					};

					dataService.createItem = function(){

						let creationData = {
							itemName: scope.entity.IsRoot ? ['EstHeader'] : [opt.itemName],
							// item : scope.entity,  useless property while creating Parameter
							itemServiceName : opt.itemServiceName
						};

						return createLookupItem(creationData).then(function(data){
							let newParam = data[(scope.entity.IsRoot ? 'EstHeader' : opt.itemName)+'Param'];
							newParam.Code = '...';
							newParam.ItemName = opt.itemName;
							dataService.addData([newParam], scope, opt, dataService);
							setParameterDataService.addParam(newParam);
							return newParam;
						});
					};

					function deleteItem(selectedItems){
						let entity = scope.entity;
						let items = selectedItems || dataService.getSelectedItems();

						estimateParamUpdateService.setParamToDelete(items, entity, opt.itemServiceName, opt.itemName);

						// remove the Issues which container the deleteItem
						let complexLookupService = $injector.get('estimateParameterComplexLookupValidationService');
						_.forEach(items, function (item) {
							_.remove(complexLookupService.getValidationIssues(), function(issue){
								return issue.entity.Code === item.Code;
							});
						});

						if(estimateAssembliesService.isAssemblyParameterActived){
							estimateAssembliesService.update().then(function () {
								// service.onCloseOverlayDialog.fire();
								estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
								let displayData = estimateParameterFormatterService.getItemsByParam(scope.entity, opt);

								// validate
								let complexLookupService = $injector.get('estimateParameterComplexLookupValidationService');
								_.forEach(displayData, function(para){
									complexLookupService.validateCode(para, para.Code, 'Code');
								});

								updateDisplayData(displayData);
							});
						}else if(opt.itemName === 'Boq'){
							let boqMainService = $injector.get('boqMainService');
							boqMainService.update().then(function () {
								if(entity && entity.ParamAssignment){

									let displayData = _.sortBy(entity.ParamAssignment, 'Code');

									estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);

									// validate
									let complexLookupService = $injector.get('estimateParameterComplexLookupValidationService');
									_.forEach(displayData, function(para){
										complexLookupService.validateCode(para, para.Code, 'Code',displayData);
									});
									updateDisplayData(displayData);

								}
							});
						}
						else{
							estimateMainService.update().then(function () {
								// service.onCloseOverlayDialog.fire();
								estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
								let displayData = estimateParameterFormatterService.getItemsByParam(scope.entity, opt);

								// validate
								let complexLookupService = $injector.get('estimateParameterComplexLookupValidationService');
								_.forEach(displayData, function(para){
									complexLookupService.validateCode(para, para.Code, 'Code');
								});

								// displayData = _.filter(displayData, function(pa){return pa.Version !== 0;});
								updateDisplayData(displayData);
							});
						}
					}

					dataService.deleteItem = function(){
						let items = dataService.getSelectedItems();
						let platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
						platformDeleteSelectionDialogService.showDialog({dontShowAgain : true, id: service.gridGuid()}).then(result => {
							if (result.ok || result.delete) {
								deleteItem(items);
							}
						});
					};

					dataService.getGridId = function () {
						return gridId;
					};

					dataService.UpdateParameter = function UpdateParameter(parameter, colName) {
						onCellChangeAction(parameter, colName);
					};

					scope.toggleFilter = function (active, clearFilter) {
						platformGridAPI.filters.showSearch(gridId, active, clearFilter);
					};

					scope.toggleColumnFilter = function (active, clearFilter) {
						platformGridAPI.filters.showColumnSearch(gridId, active, clearFilter);
					};

					let searchAllToggle = {
						id: 'gridSearchAll',
						sort: 150,
						caption: 'cloud.common.taskBarSearch',
						type: 'check',
						iconClass: 'tlb-icons ico-search-all',
						fn: function () {
							scope.toggleFilter(this.value);

							if (this.value) {
								searchColumnToggle.value = false;
								scope.toggleColumnFilter(false, true);
							}
						},
						disabled: function () {
							return scope.showInfoOverlay;
						}
					};

					let searchColumnToggle = {
						id: 'gridSearchColumn',
						sort: 160,
						caption: 'cloud.common.taskBarColumnFilter',
						type: 'check',
						iconClass: 'tlb-icons ico-search-column',
						fn: function () {
							scope.toggleColumnFilter(this.value);

							if (this.value) {
								searchAllToggle.value = false;
								scope.toggleFilter(false, true);
							}
						},
						disabled: function () {
							return scope.showInfoOverlay;
						}
					};

					// Define standard toolbar Icons and their function on the scope
					if (scope.tools) {
						// show the system and role level configuratio
						_.forEach(scope.tools.items, function (item) {
							if (item.type === 'dropdown-btn') {
								item.list.level = 1;
								overloadItem(item.list.level, function (level) {
									_.forEach(item.list.items, function (subItem) {
										let tempFn = subItem.fn;
										subItem.fn = function () {
											if (item.list.level !== level) {
												item.list.level = level;
											}
											tempHidePopup(level);
											tempFn();
										};
									});
								});
							}
						});
						let toolItems = [
							{
								id: 't1',
								sort: 0,
								caption: 'cloud.common.taskBarNewRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-new',
								fn: dataService.createItem,
								disabled: false
							},
							{
								id: 't2',
								sort: 11,
								caption: 'cloud.common.taskBarDeleteRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-delete',
								fn: dataService.deleteItem,
								disabled: true
							},
							searchAllToggle,
							searchColumnToggle,
							{
								id: 't4',
								sort: 110,
								caption: 'cloud.common.print',
								iconClass: 'tlb-icons ico-print-preview',
								type: 'item',
								fn: function () {
									$injector.get('reportingPrintService').printGrid(gridId);
								}
							}
						];
						scope.tools.items = toolItems.concat(scope.tools.items);
					}
					function overloadItem(level, func) {
						func(level);
					}
					function onCellChange(e, args) {
						onCellChangeAction(args.item, args.grid.getColumns()[args.cell].field);
					}

					function onCellChangeAction(item, col){
						let referenceParams = {params: [], promiseList: []};

						if (col === 'ValueDetail') {
							if(item.ValueType === estimateRuleParameterConstant.Text){
								item.ParameterText = item.ValueDetail;
							}else{
								if(!item.isCalculateByParamReference){
									estimateRuleCommonService.calculateDetails(item, col, 'ParameterValue', dataService, referenceParams);
								}else{
									if(dataService &&  _.isFunction(dataService.getList)) {
										estimateRuleCommonService.calculateReferenceParams(item, dataService, referenceParams);
									}
								}
							}

						}else if(col === 'ParameterText'){
							if(item.ValueType !== estimateRuleParameterConstant.TextFormula){
								item.ValueDetail = item.ParameterText;
							}

						}else if (col === 'ParameterValue'){
							item.ParameterValue = (item.ParameterValue === '') ? 0 : item.ParameterValue;
							estimateRuleCommonService.calculateDetails(item, col, undefined, dataService, referenceParams);
						}
						else if (item.ValueType === 1 && col === 'Code') {
							let fields = [];
							let itemsCache = setParameterDataService.getParamsCache();
							let paramItem = _.find(itemsCache, {'Id': item.Id});
							if (paramItem && item.Code === paramItem.Code) {
								item.IsLookup = paramItem.IsLookup;
								item.EstRuleParamValueFk = paramItem.EstRuleParamValueFk;
								item.ParameterValue = paramItem.ParameterValue;
								item.ValueDetail = paramItem.ValueDetail;

								fields.push({field: 'ValueDetail', readonly: true});
								fields.push({field: 'ParameterValue', readonly: true});
								fields.push({field: 'EstRuleParamValueFk', readonly: false});
							}
							else {
								item.IsLookup = false;
								item.EstRuleParamValueFk = null;

								$injector.get('estimateMainParameterValueLookupService').forceReload().then(function (response) {
									let data = response.data;
									let paramValues = _.filter(data,{'Code': item.Code});
									if(paramValues && paramValues.length > 0){
										fields.push({field: 'ValueDetail', readonly: false});
										fields.push({field: 'ParameterValue', readonly: false});
										fields.push({field: 'EstRuleParamValueFk', readonly: true});
										fields.push({field: 'IsLookup', readonly: false});
									}
									else {
										fields.push({field: 'ValueDetail', readonly: false});
										fields.push({field: 'ParameterValue', readonly: false});
										fields.push({field: 'EstRuleParamValueFk', readonly: true});
										fields.push({field: 'IsLookup', readonly: true});
									}

									if (fields.length > 0) {
										$injector.get('platformRuntimeDataService').readonly(item, fields);
										platformGridAPI.items.invalidate(gridId, item);
									}
								});
							}

							if (fields.length > 0) {
								$injector.get('platformRuntimeDataService').readonly(item, fields);
							}
						}
						else if(item.ValueType === 1 && col === 'EstRuleParamValueFk'){
							estimateRuleCommonService.calculateDetails(item, 'ParameterValue', undefined, dataService, referenceParams);
						}

						estimateMainCommonFeaturesService.fieldChanged(col,item);

						platformGridAPI.items.invalidate(gridId, item);

						// check it here
						checkCodeConflict(scope.entity.ParamAssignment);
						// checkCodeConflict(scope.entity.Param);
						checkCodeConflict(scope.displayItem);

						let params = displayData.concat(estimateParameterFormatterService.getLookupList(opt.itemName));
						params = _.uniq(params, 'Id');

						if(col === 'Code'){
							$timeout(function () {
								// checkCodeConflict(scope.displayItem);
								scope.entity.Param = _.map(scope.displayItem,'Code');
								platformGridAPI.grids.invalidate(gridId);
							});
						}

						// todo : add server call here to get value detail parameters and then update grid here..check
						estimateParamUpdateService.markParamAsModified(item, scope.entity, opt.itemServiceName, opt.itemName,params);

						// update the reference Params after all the promise resolved
						if (referenceParams.promiseList.length > 0) {
							$q.all(referenceParams.promiseList).then(function (){
								angular.forEach(referenceParams.params, function (param) {
									estimateParamUpdateService.markParamAsModified(param, scope.entity, opt.itemServiceName, opt.itemName, params);
								});

								if (referenceParams.params && referenceParams.params.length) {
									dataService.gridRefresh();
								}
							});
						}
					}

					// set/reset toolbar items readonly
					function updateTools(readOnly) {
						let currentDataService = formatterOptions.realDataService ? $injector.get(formatterOptions.realDataService): $injector.get(formatterOptions.itemServiceName);
						angular.forEach(scope.tools.items, function (item) {
							if(item.id === 't2') {
								if (Object.prototype.hasOwnProperty.call(currentDataService, 'getHeaderStatus') && Object.prototype.hasOwnProperty.call(currentDataService, 'hasCreateUpdatePermission')) {
									if (currentDataService.getHeaderStatus() || !currentDataService.hasCreateUpdatePermission()) {
										item.disabled = true;
									} else {
										item.disabled = !readOnly;
									}
								}else{
									item.disabled = !readOnly;
								}
							}
						});
						$timeout(function () {
							scope.tools.update();
						});
					}

					// set initialized dialog buttons view here
					$timeout(function () {
						scope.tools.update();
					});

					function onChangeGridContent(e, args) {
						updateTools(args && _.isArray(args.rows) && args.rows.length>0);
						// Get the parameter select item
						if(args && _.isArray(args.rows) && args.rows.length>0) {
							setParameterDataService.setSelectParam(args.grid.getData().getItem(args.rows[0]));
						}
					}

					platformGridAPI.events.register(gridOptions.gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.register(gridOptions.gridId, 'onSelectedRowsChanged', onChangeGridContent);

					scope.$on('$destroy', function () {
						platformGridAPI.events.unregister(gridOptions.gridId, 'onCellChange', onCellChange);
						platformGridAPI.events.unregister(gridOptions.gridId, 'onSelectedRowsChanged', onChangeGridContent);
						setParameterDataService.clear();

						basicsLookupdataPopupService.hidePopup = tempHidePopup;
					});

				};

				function createLookupItem(data) {
					return $http.post(globals.webApiBaseUrl + 'estimate/parameter/lookup/create', data).then(function(response){
						return response.data;
					});
				}

				function checkCodeConflict(displayData,isCheckRedIcon) {
					_.forEach(displayData,function (param) {
						param.IsRoot = mainEntity.IsRoot || mainEntity.IsEstHeaderRoot;
						$injector.get('estimateParameterComplexLookupValidationService').validateCode(param, param.Code, 'Code',displayData,isCheckRedIcon);
					});
				}

				return service;
			}]);
})(angular);
