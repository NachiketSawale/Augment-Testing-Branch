
(function (angular) {
	'use strict';
	/* global globals,_ */
	var moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 *
	 * @name estimateMainBackwardCalculationGridDataService
	 * @function
	 * @description
	 */

	angular.module(moduleName).factory('estimateMainBackwardCalculationGridDataService', ['$injector', 'platformDataServiceFactory', '$translate',
		function ($injector, platformDataServiceFactory, $translate) {

			let serviceOptions = {
				flatNodeItem: {
					module: moduleName,
					serviceName: 'estimateMainBackwardCalculationGridDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/',
						endRead: 'getestmajorcostcode',
						initReadData: function (readData) {
							let estimateMainService = $injector.get('estimateMainService');
							let projectId = estimateMainService.getProjectId();
							let estHeaderFk = estimateMainService.getSelectedEstHeaderId();
							readData.filter = '?projectId=' + projectId + '&estHeaderFk=' + estHeaderFk;
						}
					},
					dataProcessor: [],
					entitySelection: {},
					presenter: {
						list: {
							incorporateDataRead: function (returnValue, data) {
								let dataList = initGridData(returnValue);
								return data.handleReadSucceeded(dataList, data);
							}
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let service = serviceContainer.service;

			service.markItemAsModified = null;

			function initGridData(majorCostCodes) {
				let list = [{
					Id: -1,
					ResourceTypeFk: 1,
					ResourceType: $translate.instant('estimate.main.backwardCalculation.resourceTypeName1'),
					MajorCostCode: '',
					IsChange: true,
					ChangeValueFk: 1,
					CalculationMethod: $translate.instant('estimate.main.backwardCalculation.calculationMethodValue')
				}, {
					Id: -2,
					ResourceTypeFk: 2,
					ResourceType: $translate.instant('estimate.main.backwardCalculation.resourceTypeName2'),
					MajorCostCode: '',
					IsChange: true,
					ChangeValueFk: 1,
					CalculationMethod: $translate.instant('estimate.main.backwardCalculation.calculationMethodValue')
				}];

				if (majorCostCodes && _.isArray(majorCostCodes)) {
					_.forEach(majorCostCodes, function (costCode) {
						list.push({
							Id: costCode.Id,
							ResourceTypeFk: 3,
							ResourceType: $translate.instant('estimate.main.backwardCalculation.resourceTypeName3'),
							MajorCostCode: costCode.Code,
							IsChange: true,
							ChangeValueFk: 1,
							CalculationMethod: $translate.instant('estimate.main.backwardCalculation.calculationMethodValue')
						});
					});
				}

				return list;
			}

			return service;
		}]);
})(angular);
