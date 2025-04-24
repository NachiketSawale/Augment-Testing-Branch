(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainResourceDetailStackCommonService', ['$http', 'platformGridAPI', 'estimateMainCommonUIService', 'basicsLookupdataPopupService',
		'estimateMainService',
		function ($http, platformGridAPI, estimateMainCommonUIService, basicsLookupdataPopupService,
			estimateMainService) {

			let service = {};

			let popupToggle = basicsLookupdataPopupService.getToggleHelper();

			function getOptions(scope) {
				let config = scope.$parent.$parent.groups;
				if (!config) {
					return;
				}
				let group = _.find(scope.$parent.$parent.groups, {gid: 'ruleAndParam'});
				if (!group) {
					return;
				}
				let ruleConfig = _.find(group.rows, {rid: 'param'});
				return ruleConfig ? ruleConfig.formatterOptions : null;
			}

			function getAllColumns() {
				let uiService = estimateMainCommonUIService.createUiService(['LineItemCode', 'LineItemDescriptionInfo', 'AssemblyCode', 'AssemblyDescriptionInfo', 'Code',
					'DescriptionInfo', 'BoqRootRef', 'BoqItemFk', 'ExternalCode', 'EstResourceTypeFk', 'EstCostTypeFk', 'EstResourceFlagFk', 'PrcStructureFk', 'PackageAssignments', 'LgmJobFk', 'UomFk', 'EstimateCostUnit', 'CostUnitOriginal', 'QuantityTotal',
					'CostTotal', 'BasCurrencyFk', 'CostFactor1', 'CostFactor2', 'CostFactorCc', 'QuantityFactor1', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4', 'QuantityFactorCc', 'ProductivityFactor',
					'EfficiencyFactor1', 'EfficiencyFactor2', 'IsLumpsum', 'IsIndirectCost', 'IsGeneratedPrc'], null);
				return uiService.getStandardConfigForListView().columns;
			}

			service.openPopup = function openPopup(e, scope) {
				let popupOptions = {
					templateUrl: globals.appBaseUrl + '/estimate.main/templates/resource-summary/estimate-main-resource-details-stack.html',
					footerTemplateUrl:globals.appBaseUrl + '/estimate.main/templates/resource-summary/estimate-main-resource-details-stack-footer.html',
					title: 'estimate.main.detailsstack',
					showLastSize: true,
					controller: ['$scope', '$q','basicsLookupdataLookupControllerFactory', '$popupInstance', controller],
					width: 900,
					height: 300,
					focusedElement: angular.element(e.target.parentElement),
					relatedTarget: angular.element(e.target),
					scope: scope.$new()
				};

				// toggle popup
				popupToggle.toggle(popupOptions);
				function controller($scope, $q, lookupControllerFactory, $popupInstance) {

					let options = {};
					service.initController($scope, $q, lookupControllerFactory, options, $popupInstance, getAllColumns());

					// for close the popup-menu
					$scope.$on('$destroy', function () {
						if ($scope.$close) {
							$scope.$close();
						}
					});
				}
			};

			service.initController = function initController(scope, $q, lookupControllerFactory, opt, popupInstance, coloumns) {
				let tempHidePopup = basicsLookupdataPopupService.hidePopup;
				basicsLookupdataPopupService.hidePopup = function temp() {
				};

				// let displayData = estimateParameterFormatterService.getItemsByParam(scope.entity, opt);
				// displayData = _.sortBy(displayData, 'Code');

				let lineItemResourceIds = scope.entity.LineItemResourceIds;
				let currentPage = 1, pageSize = 10, recordTotal = lineItemResourceIds.length;
				let pagMainIds = lineItemResourceIds.length <= 10 ? lineItemResourceIds : _.slice(lineItemResourceIds, 0, pageSize);

				let estHeaderId = estimateMainService.getSelectedEstHeaderId();
				let projectId = estimateMainService.getSelectedProjectId();

				let requestData = {
					MainIds:pagMainIds,
					ProjectId: projectId,
					EstHeaderId: estHeaderId
				};
				let dataCache = {};
				let displayData = [];

				let gridId = '1097872e3b9340d4897f044d38da08f2';
				scope.displayItem = displayData;
				let gridOptions = {
					gridId: gridId,
					columns: coloumns,
					idProperty: 'Id'
				};

				service.dataService = lookupControllerFactory.create({grid: true}, scope, gridOptions);
				let dataService = service.dataService;

				scope.isLoading = false;

				dataService.getStackList = function getStackList() {
					return $http.post(globals.webApiBaseUrl + 'estimate/main/resources/summary/getresourcesdetailsstack', requestData).then(function (result) {
						_.each(result.data, function (item) {
							item.TriggerLineItemField = {
								ProjectContextId: projectId,
								EstHeaderFk: estHeaderId,
								Id: item.BaseLineItemId
							};
						});
						return result.data;
					});
				};

				dataService.getList = function getList() {
					return displayData;
				};

				dataService.updateData(displayData);
				// inputGroupService = self;
				dataService.scope = scope;
				dataService.opt = opt;

				// resize the content by interaction
				popupInstance.onResizeStop.register(function () {
					platformGridAPI.grids.resize(gridOptions.gridId);
				});

				function getPageText() {
					let startIndex = (currentPage - 1) * pageSize + 1,
						endIndex = currentPage * pageSize;
					endIndex = recordTotal <= endIndex ? recordTotal : endIndex;
					return startIndex + ' - ' + endIndex + ' / ' + recordTotal;
				}

				function pageUp() {
					if (canPageUp()) {
						let startIndex = (currentPage - 1) * pageSize;
						let endIndex = currentPage * pageSize;
						refreshData(currentPage - 1, startIndex, endIndex).then(function (res) {
							if (res) {
								currentPage--;
							}
						});
					}
				}

				function canPageUp() {
					return !scope.isLoading && currentPage > 1;
				}

				function pageDown() {
					if (canPageDown()) {
						let startIndex = currentPage * pageSize;
						let endIndex = (currentPage + 1) * pageSize;
						refreshData(currentPage + 1, startIndex, endIndex).then(function (res) {
							if (res) {
								currentPage++;
							}
						});
					}
				}

				function canPageDown() {
					return !scope.isLoading && currentPage < _.ceil(recordTotal / pageSize);
				}

				function refreshData(page, startIndex, endIndex) {
					scope.isLoading = true;
					let result = $q.when();
					if (Object.prototype.hasOwnProperty.call(dataCache, page)) {
						if (_.isArray(dataCache[page]) && dataCache[page].length > 0) {
							result = $q.when(dataCache[page]);
						}
					} else {
						endIndex = recordTotal <= endIndex ? recordTotal : endIndex;
						pagMainIds = _.slice(lineItemResourceIds, startIndex, endIndex);
						requestData.MainIds = pagMainIds;
						result = dataService.getStackList();
					}
					return result.then(function (data) {
						displayData = data;
						dataCache[page] = angular.copy(displayData);
						scope.isLoading = false;
						if (data && _.isArray(data)) {
							dataService.updateData(data);
							return true;
						}
						return false;
					});
				}

				scope.pageUp = pageUp;
				scope.canPageUp = canPageUp;
				scope.pageDown = pageDown;
				scope.canPageDown = canPageDown;
				scope.getPageText = getPageText;

				function initData() {
					let startIndex = 0;
					let page = 1;
					let endIndex = pageSize;
					refreshData(page, startIndex, endIndex);
				}

				initData();

				scope.$on('$destroy', function () {
					basicsLookupdataPopupService.hidePopup = tempHidePopup;
					displayData = [];
				});
			};

			return service;
		}]);
})();
