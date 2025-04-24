/**
 * Created by xia on 9/3/2019.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').factory('platformControllerExtendService', ['$injector', 'platformDetailControllerService', 'platformGridControllerService',
		'estimateCommonDynamicConfigurationServiceFactory', 'basicsCostGroupAssignmentService',
		function ($injector, platformDetailControllerService, platformGridControllerService, estimateCommonDynamicConfigurationServiceFactory, basicsCostGroupAssignmentService) {
			const service = {};

			service.initDetailController = function ($scope, itemService, validationService, uiStandardService, translationService, detailConfig) {

				const uiStandardExtendService = uiStandardService.isExtendService ? uiStandardService : estimateCommonDynamicConfigurationServiceFactory.createService(uiStandardService, validationService);

				/* initialize the cost group service */
				if (!itemService.costGroupService) {
					itemService.costGroupService = angular.isString(detailConfig.costGroupService) ? $injector.get(detailConfig.costGroupService) : detailConfig.costGroupService;
				}

				if (itemService.costGroupCatalogs) {
					/* generate the cost group columns */
					const costGroupColumns = basicsCostGroupAssignmentService.createCostGroupColumnsForDetail(itemService.costGroupCatalogs, itemService.costGroupService);

					/* attach the cost group columns to configuration */
					uiStandardExtendService.attachDataForDetail({costGroup: costGroupColumns});
				}

				platformDetailControllerService.initDetailController($scope, itemService, validationService, uiStandardExtendService, translationService);

				/* register the event 'onCostGroupCatalogsLoaded' */
				function costGroupLoaded(costGroupCatalogs) {
					$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
						scope: $scope,
						dataService: itemService,
						validationService: validationService,
						translationService: translationService,
						formConfiguration: uiStandardExtendService,
						costGroupName: detailConfig.costGroupName
					});
				}

				itemService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

				$scope.$on('$destroy', function () {
					/* unregister the onCostGroupCatalogsLoaded */
					itemService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
				});
			};

			service.initListController = function initListController($scope, uiStandardService, itemService, validationService, gridConfig) {

				const uiStandardExtendService = uiStandardService.isExtendService ? uiStandardService : estimateCommonDynamicConfigurationServiceFactory.createService(uiStandardService, validationService);

				/* initialize the cost group service */
				if (!itemService.costGroupService) {
					if (gridConfig.costGroupService) {
						itemService.costGroupService = angular.isString(gridConfig.costGroupService) ? $injector.get(gridConfig.costGroupService) : gridConfig.costGroupService;
					} else if (gridConfig.costGroupConfig) {
						itemService.costGroupService = $injector.get('basicsCostGroupDataServiceFactory').createService('', itemService, gridConfig.costGroupConfig);
					}
				}

				if (itemService.costGroupCatalogs) {
						/* generate the cost group columns */
						const costGroupColumns = basicsCostGroupAssignmentService.createCostGroupColumns(itemService.costGroupCatalogs, false);

						/* attach the cost group columns to configuration */
						uiStandardExtendService.attachData({costGroup: costGroupColumns});
				}

				platformGridControllerService.initListController($scope, uiStandardExtendService, itemService, validationService, gridConfig);

				/* register the cellChange event */
				itemService.costGroupService.registerCellChangedEvent($scope.gridId);

				function costGroupLoaded(costGroupCatalogs) {
					$injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, uiStandardExtendService, costGroupCatalogs, itemService, validationService, {isReadonly: gridConfig.isCostGroupReadonly});
				}

				/* refresh the columns configuration when we load the cost group catalogs */
				itemService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

				$scope.$on('$destroy', function () {
					/* unregister the onCostGroupCatalogsLoaded */
					itemService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
				});
			};

			return service;
		}]);
})(angular);
