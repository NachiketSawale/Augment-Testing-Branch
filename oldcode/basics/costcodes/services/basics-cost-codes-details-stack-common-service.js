(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'basics.costcodes';

	angular.module(moduleName).factory('basicsCostcodesDetailsStackCommonService', ['$http', 'platformGridAPI', 'estimateMainCommonUIService', 'basicsLookupdataPopupService',
		function ($http, platformGridAPI, estimateMainCommonUIService, basicsLookupdataPopupService) {

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

			function getAllLineItemColumns(companyContext) {
				let filterInfo={};
				filterInfo.companyContext = companyContext;
				let uiService = estimateMainCommonUIService.createUiService(['RefLineItemCode', 'LineItemDescriptionInfo'], filterInfo);
				return uiService.getStandardConfigForListView().columns;
			}

			function getAllassemblyColumns(companyContext) {
				let filterInfo={};
				filterInfo.companyContext = companyContext;
				let uiService = estimateMainCommonUIService.createUiService(['RefAssemblyCode', 'RefAssemblyDescriptionInfo'], filterInfo);
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

					let typeOfLineItem = $scope.entity.Ids.Item4;
					let companyContext = $scope.entity.Ids.Item7;

					let options = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : getOptions(scope);

					if(typeOfLineItem === 0){
						service.initController($scope, $q, lookupControllerFactory, options, $popupInstance, getAllLineItemColumns(companyContext));
					} else {
						service.initController($scope, $q, lookupControllerFactory, options, $popupInstance, getAllassemblyColumns(companyContext));
					}


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

				let ids = scope.entity.Ids;
				let pageSize = 50, currentPage = 1, recordTotal = null;

				let estHeaderId = ids.Item1;
				let projectId = ids.Item2;
				let costcodeId = ids.Item3;
				let lineItemType = ids.Item4;
				let assemblyCatFk = ids.Item5;
				let assemblyType = ids.Item6;

				let requestData = {
					CostcodeId:costcodeId,
					ProjectId: projectId,
					EstHeaderId: estHeaderId,
					LineItemType : lineItemType,
					AssemblyCatFk : assemblyCatFk,
					Count:recordTotal,
					CurrentPage:currentPage
				};

				let dataCache = {};
				let displayData = [];

				let gridId = '1d592514017847c88ac8aa49a6a18785';
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
					return $http.post(globals.webApiBaseUrl + 'basics/costcodes/getcostcodedetailsstack', requestData).then(function (result) {

						_.each(result.data.Item1, function (item) {
							item.TriggerLineItemField = {
								ProjectContextId: projectId,
								EstHeaderFk: estHeaderId,
								Id: item.LineItemId
							};
							item.AssemblyType = assemblyType;
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
						currentPage = currentPage-1;
						requestData.CurrentPage = currentPage;
						refreshData(currentPage);
					}
				}

				function canPageUp() {
					return !scope.isLoading && currentPage > 1;
				}

				function pageDown() {
					if (canPageDown()) {
						currentPage = currentPage+1;
						requestData.CurrentPage = currentPage;
						refreshData(currentPage);
					}
				}

				function canPageDown() {
					return !scope.isLoading && currentPage < _.ceil(recordTotal / pageSize);
				}

				function refreshData(page) {
					scope.isLoading = true;
					let result = $q.when();
					if (Object.prototype.hasOwnProperty.call(dataCache, page)) {
						if (_.isArray(dataCache[page]) && dataCache[page].length > 0) {
							result = $q.when(dataCache[page]);
						}
					} else {
						result = dataService.getStackList();
					}
					return result.then(function (data) {
						_.forEach(data.Item1, function(obj, index) {
							obj.Id = index + 1;
						});
						recordTotal = data.Item2;
						displayData = data.Item1;
						requestData.Count = recordTotal;
						dataCache[page.Item1] = angular.copy(data.Item1);
						scope.isLoading = false;
						if (data.Item1 && _.isArray(data.Item1)) {
							dataService.updateData(data.Item1);
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
					let page = 1;
					refreshData(page);
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
