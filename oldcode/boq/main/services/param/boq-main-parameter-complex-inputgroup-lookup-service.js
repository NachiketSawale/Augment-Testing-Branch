/**
 * Created by zos on 2/27/2018.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqParameterComplexInputgroupLookupService
	 * @function
	 * @description
	 * This is the data service for boq parameter item related functionality.
	 */
	angular.module(moduleName).factory('boqParameterComplexInputgroupLookupService',
		['$q', '$http', '$injector', 'PlatformMessenger', 'boqParameterFormatterService', 'platformCreateUuid', 'platformGridAPI',
			'estimateParamUpdateService', 'estimateRuleCommonService', 'platformModalService', 'boqMainService',
			'estimateMainCommonFeaturesService', '$timeout', 'basicsLookupdataPopupService', 'reportingPrintService', 'estimateRuleParameterConstant',
			function ($q, $http, $injector, PlatformMessenger, boqParameterFormatterService, platformCreateUuid, platformGridAPI,
				estimateParamUpdateService, estimateRuleCommonService, platformModalService, boqMainService,
				estimateMainCommonFeaturesService, $timeout, basicsLookupdataPopupService, reportingPrintService, estimateRuleParameterConstant) {

				var service = {
					dataService: {},
					onCloseOverlayDialog: new PlatformMessenger()
				};

				service.initController = function initController(scope, lookupControllerFactory, opt, popupInstance, coloumns) {
					// fix defect 85022,when delete Item record in Items container,the Line Item record disappear
					var tempHidePopup = basicsLookupdataPopupService.hidePopup;
					basicsLookupdataPopupService.hidePopup = function temp() {
					};

					var displayData = _.sortBy(scope.entity.ParamAssignment, 'Code');

					var setParameterDataService = $injector.get('boqParamDataService');
					setParameterDataService.setParams(displayData);
					setParameterDataService.setParamsCache(angular.copy(displayData));

					var gridId = platformCreateUuid();
					scope.displayItem = displayData;
					var gridOptions = {
						gridId: gridId,
						columns: coloumns,
						idProperty: 'Id'
					};

					service.dataService = lookupControllerFactory.create({grid: true}, scope, gridOptions);
					var dataService = service.dataService;

					dataService.getList = function getList() {
						return displayData;
					};

					function calculateParamValueFristLoad(paramItems) {
						angular.forEach(paramItems, function (patamItem) {

							if (patamItem.ValueType === estimateRuleParameterConstant.Text || patamItem.ValueType === estimateRuleParameterConstant.TextFormula) {
								patamItem.ParameterText = patamItem.ValueDetail;
							} else {
								$injector.get('estimateRuleCommonService').calculateDetails(patamItem, 'ValueDetail', 'ParameterValue', dataService);
							}
						});
					}

					$injector.get('boqMainParamListProcessor').processItems(displayData);

					checkCodeConflict(displayData);

					calculateParamValueFristLoad(displayData);
					dataService.updateData(displayData);
					dataService.scope = scope;
					dataService.opt = opt;

					// resize the content by interaction
					popupInstance.onResizeStop.register(function () {
						platformGridAPI.grids.resize(gridOptions.gridId);
					});

					var updateDisplayData = function updateDisplayData(displayData) {
						scope.displayItem = displayData;

						// this make the user's created item whose code validation error
						scope.ngModel = _.map(displayData, 'Code');

						$injector.get('boqMainParamListProcessor').processItems(displayData);
						dataService.updateData(displayData);
					};

					dataService.createItem = function () {
						var creationData = {
							boqHeaderFk: scope.entity.BoqHeaderFk,
							boqItemFk: scope.entity.Id
						};

						createBoqItemParam(creationData).then(function (response) {
							var newParam = response;
							newParam.Code = '...';
							newParam.Action = 'ToSave';
							newParam.Version = 0;
							$injector.get('boqParameterComplexLookupValidationService').validateCode(newParam, newParam.Code, 'Code');

							if (!scope.entity.ParamAssignment) {
								scope.entity.ParamAssignment = [];
							}
							if (!_.find(scope.entity.ParamAssignment, {Id: newParam.Id})) {
								if (!scope.entity.ParamAssignment) {
									scope.entity.ParamAssignment = [];
								}
								scope.entity.ParamAssignment.push(newParam);
								setParameterDataService.addParam(newParam);
							}

							// var displayData = _.sortBy(scope.entity.ParamAssignment, 'Code');
							// updateDisplayData(displayData);

							updateDisplayData(scope.entity.ParamAssignment);
							platformGridAPI.grids.invalidate(gridId);
						});
					};

					dataService.deleteItem = function () {
						var entity = scope.entity;

						var items = dataService.getSelectedItems();
						estimateParamUpdateService.setParamToDelete(items, entity);

						// remove the Issues which container the deleteItem
						var complexLookupService = $injector.get('boqParameterComplexLookupValidationService');
						_.forEach(items, function (item) {
							_.remove(complexLookupService.getValidationIssues(), function (issue) {
								return issue.entity.Id === item.Id;
							});
						});

						var displayData = _.sortBy(scope.entity.ParamAssignment, 'Code');

						// validate other items
						_.forEach(displayData, function (para) {
							complexLookupService.validateCode(para, para.Code, 'Code');
						});

						updateDisplayData(displayData);
						platformGridAPI.grids.invalidate(gridId);
					};

					// Define standard toolbar Icons and their function on the scope
					scope.tools = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						version: Math.random(),
						update: function () {
							scope.tools.version += 1;
						},
						items: [
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
								sort: 10,
								caption: 'cloud.common.taskBarDeleteRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-delete',
								fn: dataService.deleteItem,
								disabled: true
							},
							// todo, this grouping button can't work here, no good idea for it temporary
							// {
							//     id: 't12',
							//     sort: 10,
							//     caption: 'cloud.common.taskBarGrouping',
							//     type: 'check',
							//     iconClass: 'tlb-icons ico-group-columns',
							//     fn: function(){
							//         platformGridAPI.grouping.toggleGroupPanel(gridId, !this.value);
							//     },
							//     value: platformGridAPI.grouping.toggleGroupPanel(gridId),
							//     disabled: false
							// },
							{
								id: 't13',
								sort: 11,
								caption: 'cloud.common.print',
								iconClass: 'tlb-icons ico-print-preview',
								type: 'item',
								fn: function () {
									reportingPrintService.printGrid(gridId);
								}
							}
							// {
							//     id: 't4',
							//     caption: 'cloud.common.toolbarSearch',
							//     type: 'item',
							//     iconClass: 'tlb-icons ico-search', //ico-search',
							//     fn: function () {
							//         platformGridAPI.filters.showSearch(gridId, true);
							//     }
							// },
							// {
							//     id: 't5',
							//     caption: 'cloud.common.toolbarDeleteSearch',
							//     type: 'item',
							//     iconClass: 'tlb-icons ico-search-delete',
							//     fn: function () {
							//         platformGridAPI.filters.showSearch(gridId, false);
							//
							//         // $timeout(function () {
							//         //     scope.tools.update();
							//         // });
							//     }
							// }
						]
					};

					function onCellChange(e, args) {
						var item = args.item,
							col = args.grid.getColumns()[args.cell].field;

						var modified = false;
						if (col === 'ValueDetail') {

							if (item.ValueType === estimateRuleParameterConstant.Text) {
								item.ParameterText = item.ValueDetail;
							} else {
								estimateRuleCommonService.calculateDetails(item, col, 'ParameterValue', dataService);
							}
							modified = true;
						} else if (col === 'ParameterValue') {
							item.ParameterValue = (item.ParameterValue === '') ? 0 : item.ParameterValue;
							estimateRuleCommonService.calculateDetails(item, col);
							modified = true;
						} else if (col === 'ParameterText') {
							item.ValueDetail = item.ParameterText;
							modified = true;
						} else if (item.ValueType === 1 && col === 'Code') {
							var fields = [];
							var itemsCache = setParameterDataService.getParamsCache();
							var paramItem = _.find(itemsCache, {'Id': item.Id});
							if (paramItem && item.Code === paramItem.Code) {
								item.IsLookup = paramItem.IsLookup;
								item.EstRuleParamValueFk = paramItem.EstRuleParamValueFk;
								item.ParameterValue = paramItem.ParameterValue;
								item.ValueDetail = paramItem.ValueDetail;

								fields.push({field: 'ValueDetail', readonly: true});
								fields.push({field: 'ParameterValue', readonly: true});
								fields.push({field: 'EstRuleParamValueFk', readonly: false});
							} else {
								item.IsLookup = false;
								item.EstRuleParamValueFk = null;

								$injector.get('estimateMainParameterValueLookupService').forceReload().then(function (response) {
									var data = response.data;
									var paramValues = _.filter(data, {'Code': item.Code});
									if (paramValues && paramValues.length > 0) {
										fields.push({field: 'ValueDetail', readonly: false});
										fields.push({field: 'ParameterValue', readonly: false});
										fields.push({field: 'EstRuleParamValueFk', readonly: true});
										fields.push({field: 'IsLookup', readonly: false});
									} else {
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
							modified = true;
						}

						if (modified) {
							platformGridAPI.items.invalidate(gridId, item);
						}
						estimateMainCommonFeaturesService.fieldChanged(col, item);

						checkCodeConflict(scope.entity.ParamAssignment);
						if (!item.__rt$data.errors || !item.__rt$data.errors.Code) {
							estimateParamUpdateService.setParamToSave([item], scope.entity, 'boqMainService', 'Boq');
						} else {
							estimateParamUpdateService.removeValidatedErrorItem(item);
						}

						if (col === 'Code') {
							$timeout(function () {
								platformGridAPI.grids.invalidate(gridId);
							});
						}
					}

					// fix the defect that the tool's version always changs
					var oldParamItemSelectedStatus = false;
					// toolStatusChanged = false;
					// set/reset toolbar items readonly
					function updateTools(oldParamItemSelectedStatus) {
						angular.forEach(scope.tools.items, function (item) {
							if (item.id === 't2') {
								item.disabled = !oldParamItemSelectedStatus;
							}
						});

						// if(toolStatusChanged){
						//     $timeout(function () {
						//         scope.tools.update();
						//     });
						// }
						$timeout(function () {
							scope.tools.update();
						});
					}

					// set initialized dialog buttons view here
					$timeout(function () {
						scope.tools.update();
					});

					function onChangeGridContent(e, args) {

						// refresh the delete button when select or delete or new Boq Param item
						var newParamItemSelectedStatus = args && _.isArray(args.rows) && args.rows.length > 0;
						if (oldParamItemSelectedStatus !== newParamItemSelectedStatus) {
							oldParamItemSelectedStatus = newParamItemSelectedStatus;
							// toolStatusChanged = true;
						}
						// else{
						//     //toolStatusChanged = false;
						// }
						oldParamItemSelectedStatus = newParamItemSelectedStatus;
						updateTools(oldParamItemSelectedStatus);

						// Get the parameter select item
						if (newParamItemSelectedStatus) {
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

				function createBoqItemParam(data) {
					return $http.post(globals.webApiBaseUrl + 'boq/main/createboqitemparam', data).then(function (response) {
						return response.data;
					});
				}

				function checkCodeConflict(assignedParams) {
					_.forEach(assignedParams, function (param) {
						$injector.get('boqParameterComplexLookupValidationService').validateCode(param, param.Code, 'Code', assignedParams);
						$injector.get('boqParameterComplexLookupValidationService').validateValueDetail(param, param.ValueDetail, 'ValueDetail');
					});
				}

				return service;
			}]);
})(angular);