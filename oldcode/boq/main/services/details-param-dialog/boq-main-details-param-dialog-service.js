/**
 * Created by zos on 3/14/2018.
 */

(function () {
	/* global globals, _ */
	'use strict';

	var moduleName = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainDetailsParamDialogService
	 * @function
	 *
	 * @description
	 * This is the data service for  details Formula Parameter Items functions.
	 */
	angular.module(moduleName).factory('boqMainDetailsParamDialogService', ['$http', '$q', '$injector', 'PlatformMessenger', 'platformModalService', 'boqMainService', 'estimateMainParamStructureConstant',
		function ($http, $q, $injector, PlatformMessenger, platformModalService, boqMainService, estimateMainParamStructureConstant) {

			var currentItem = {},
				isFormula = false,
				result = {},
				sourceBoqItemService = {},
				oldDetailsParam = [];

			/* var detailFields = {
				  'Quantity': 'QuantityDetail' ,
				  'QuantityAdj' : 'QuantityAdjDetail',
				  'Factor':'FactorDetail'
			 };
			 var union = angular.extend({}, _.invert(detailFields), detailFields);
			 */
			var service = {
				onCurrentItemChanged: new PlatformMessenger()
			};

			service.getCurrentItem = function () {
				return currentItem;
			};

			service.getIsFormula = function () {
				return isFormula;
			};

			service.setIsFormula = function (value) {
				isFormula = value;
			};

			service.getOldDetailsParam = function () {
				return oldDetailsParam;
			};

			service.setCurrentItem = function (item) {
				isFormula = item.isFormula;
				if (item.detailsParamItems && item.detailsParamItems.length > 1) {
					var fillterList = [];
					var valueTypes = $injector.get('estimateRuleParameterConstant');
					_.forEach(item.detailsParamItems, function (x) {
						if (!_.find(fillterList, function (y) {
							if (x.Id === y.Id || x.Code !== y.Code || x.ValueType !== y.ValueType) {
								return false;
							}
							if (x.ValueType === valueTypes.Text || x.ValueType === valueTypes.TextFormula) {
								return x.ValueText === y.ValueText;
							} else {
								return x.DefaultValue === y.DefaultValue;
							}
						})) {
							fillterList.push(x);
						}
					});
					item.detailsParamItems = fillterList;
					currentItem = item;
				} else {
					currentItem = item;
				}
			};

			service.getSourceBoqItemService = function getSourceBoqItemService() {
				return sourceBoqItemService;
			};

			service.setSourceBoqItemService = function setSourceBoqItemService(dataService) {
				sourceBoqItemService = dataService;
			};

			service.showSameCodeWarning = function showSameCodeWarning(entity, code) {
				var params = $injector.get('boqMainDetailsParamListDataService').getList();
				var assignedStructure = [];

				_.forEach(params, function (param) {
					if (param.Code.toUpperCase() === code.toUpperCase() && param.Id !== entity.Id) {
						assignedStructure.push(param);
					}
				});

				var sameCodeResult = _.filter(assignedStructure, function (item) {
					if (item.AssignedStructureId !== entity.AssignedStructureId) {
						return item;
					}
				});

				if (sameCodeResult && sameCodeResult.length > 0) {
					entity.SameCodeButNoConlict = true;
					_.forEach(sameCodeResult, function (item) {
						item.SameCodeButNoConlict = true;
					});
				} else {
					entity.SameCodeButNoConlict = false;
					_.forEach(assignedStructure, function (item) {
						item.SameCodeButNoConlict = false;
					});
				}
			};

			service.showDialog = function showDialog(data, levelToSave, sourceBoqItemService) {
				service.setSourceBoqItemService(sourceBoqItemService);

				// set the useful data to result from data
				result.ProjectId = data.ProjectId;
				result.detailsParamItems = data.FormulaParameterEntities;
				result.BoqItem = data.BoqItem;
				result.MainItemId = data.MainItemId;
				result.BoqItems = [data.BoqItem];
				result.isFormula = data.isFormula;
				if (levelToSave) {
					angular.forEach(result.detailsParamItems, function (item) {
						if (levelToSave === estimateMainParamStructureConstant.Project) {  // if save to the proejct level
							if (item.Version <= 0) {
								item.AssignedStructureId = levelToSave;
							}
						} else {
							if (item.AssignedStructureId === estimateMainParamStructureConstant.Project) {// change project parameter to boq parameter
								item.Version = 0;
							}
							if (boqMainService.getCallingContextType() !== 'Wic') {
								item.AssignedStructureId = levelToSave;
							} else {
								if (item.isFormulaFromBoq) { // get the paramater from the Facotry detail/Quantity Detail/ QuantitAQ detail

									item.AssignedStructureId = estimateMainParamStructureConstant.BasicCusizmeParam;// means save parameter to customization parameter
								} else {
									item.AssignedStructureId = levelToSave;
								}
							}
						}

					});
					return service.updateData(result).then(
						function (response) {
							var BoqParamToSave = {BoqParamToSave: result.detailsParamItems};
							$injector.get('estimateParameterFormatterService').handleUpdateDone(BoqParamToSave);
							boqMainService.gridRefresh();
							$injector.get('boqMainDetailsParamListDataService').clear();

							if (result.isFormula) {
								if (response && response.data) {
									response.data.MainModuleName = 'boq.main';
									boqMainService.getContainerData().onUpdateSucceeded(response.data, boqMainService.getContainerData(), response.data);
								}
							}
							return $q.when(true);
						}
					);
				} else if (data.isBulkEdit) {
					if (!levelToSave) {
						levelToSave = 1; // BoQ
					}
					angular.forEach(result.detailsParamItems, function (item) {
						if (item.Version <= 0) {
							item.AssignedStructureId = levelToSave;
						}
					});
					return service.updateData(result);
				} else {
					// when all the paramAssignedTo is existed now, edit the param will can't be save, this code has error now
					var options = {
						templateUrl: globals.appBaseUrl + moduleName + '/templates/details-parameters-dialog/boq-main-details-param-dialog.html',
						controller: 'boqMainDetailsParamDialogController',
						width: '1100px',
						// height: '550px',
						resizeable: true
					};
					// set params to save for display
					service.setCurrentItem({
						selectedLevel: levelToSave && levelToSave.length ? levelToSave : 'Element',
						doRememberSelect: levelToSave && levelToSave.length ? true : false,
						detailsParamItems: result.detailsParamItems
					});

					service.setIsFormula(result.isFormula);

					$injector.get('estimateParamDataService').clear();
					oldDetailsParam = angular.copy(result.detailsParamItems);
					return platformModalService.showDialog(options);
				}
			};

			// /* jshint -W074 */ // function's cyclomatic complexity is too high
			service.updateData = function (item) {

				if (item.detailsParamItems && item.detailsParamItems.length > 0) {
					var isFormula = result.isFormula = item.isFormula;
					// var detailFormulaField = item.detailsParamItems[0].DetailFormulaField;
					result.detailsParamItems = item.detailsParamItems;
					angular.forEach(result.detailsParamItems, function (detailParamItem) {
						if (typeof detailParamItem.ParameterValue === 'boolean') {
							detailParamItem.ParameterValue = detailParamItem.ParameterValue ? 1 : 0;
						}
						if (typeof detailParamItem.DefaultValue === 'boolean') {
							detailParamItem.DefaultValue = detailParamItem.DefaultValue ? 1 : 0;
						}
						detailParamItem.BoqItemFk = result.BoqItem.Id;
						detailParamItem.BoqHeaderFk = result.BoqItem.BoqHeaderFk;

						if (detailParamItem.AssignedStructureId === estimateMainParamStructureConstant.Project) {
							detailParamItem.BoqItemFk = 0;
							detailParamItem.BoqHeaderFk = 0;
						}
					});
					result.EntitiesCount = item.detailsParamItems.length;

					return $http.post(globals.webApiBaseUrl + 'boq/main/calculator/updatedetailsparameters', result)
						.then(function (response) {

							var estimateParamUpdateService = $injector.get('estimateParamUpdateService');

							var _sourceBoqItemService = service.getSourceBoqItemService();

							var boqItem = _.find(_sourceBoqItemService.getList(), {Id: result.BoqItem.Id});
							if (!boqItem) {
								return;
							}
							boqItem.ParamAssignment = [];

							if (response.data.detailsParamItems && _.isArray(response.data.detailsParamItems)) {
								_.forEach(response.data.detailsParamItems, function (detailParamItem) {

									// this parameter not be assigned to project here
									if (detailParamItem.AssignedStructureId !== estimateMainParamStructureConstant.Project) {
										boqItem.ParamAssignment.push(detailParamItem);
									}

								});
							}

							item.detailsParamItems = boqItem.ParamAssignment;
							if (isFormula) {
								if (response && response.data) {
									response.data.MainModuleName = 'boq.main';
									boqMainService.getContainerData().itemList = _sourceBoqItemService.getContainerData().itemList;
									boqMainService.getContainerData().itemTree = _sourceBoqItemService.getContainerData().itemTree;

									boqMainService.getContainerData().onUpdateSucceeded(response.data, boqMainService.getContainerData(), response.data);
								}
							}
							estimateParamUpdateService.clear();
							return response;
						},
						function (/* error */) {
						});
				}

			};

			service.getCurrentEntity = function () {
				return result.BoqItem;
			};

			service.getConfigulation = function () {
				return result;
			};

			service.currentItemChangedFire = function () {
				service.onCurrentItemChanged.fire(currentItem);
			};

			return service;
		}
	]);
})();
