/**
 * @author: chd
 * @date: 10/20/2020 4:04 PM
 * @description:
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	angular.module(moduleName).factory('estimateMainLineItemsCostGroupAiMappingDataService', ['$q', '$http', 'PlatformMessenger', '$injector',
		'platformDataServiceFactory', 'estimateMainService', 'estimateMainLineItemsCostGroupAiMappingService',
		function ($q, $http, PlatformMessenger, $injector,
			platformDataServiceFactory, estimateMainService, estimateMainLineItemsCostGroupAiMappingService) {


			let requestData = {};

			let lineItemsCostGroupAiMappingServiceOptions = {
				flatRootItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainLineItemsCostGroupAiMappingDataService',
					entityNameTranslationID: 'estimate.assemblies.containers.assemblies',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/mtwoai/',
						endRead: 'lineitem2costgroupmapping',
						initReadData: function initReadData(readData) {
							requestData.EstHeaderFk = estimateMainService.getSelectedEstHeaderId();
							requestData.ProjectFk = estimateMainService.getSelectedProjectId();
							readData.SelectLevel = estimateMainLineItemsCostGroupAiMappingService.getSelectedLevel();
							angular.extend(readData, requestData);
						},
						usePostForRead: true
					},
					presenter: {
						list: {
							isDynamicModified: true,
							isInitialSorted: true,
							sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
							incorporateDataRead: function (readData, data) {

								estimateMainLineItemsCostGroupAiMappingService.saveCostGroupCats(readData.CostGroupCats);
								estimateMainLineItemsCostGroupAiMappingService.saveLineItem2CostGroupsData(readData.LineItem2CostGroups);
								$injector.invoke(['basicsAICostGroupAssignmentService', function(basicsAICostGroupAssignmentService){
									basicsAICostGroupAssignmentService.aiProcess(readData, service, {
										mainDataName: 'dtos',
										attachDataName: 'LineItem2CostGroups',
										dataLookupType: 'LineItem2CostGroups',
										identityGetter: function identityGetter(entity){
											return {
												EstHeaderFk: entity.RootItemId,
												Id: entity.MainItemId
											};
										}
									});
								}]);

								return serviceContainer.data.handleReadSucceeded(readData.dtos, data);
							}
						}
					},
					useItemFilter: true
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(lineItemsCostGroupAiMappingServiceOptions);
			let service = serviceContainer.service;
			service.markItemAsModified = null;

			service.onCostGroupCatalogsLoaded = new PlatformMessenger();

			return service;
		}
	]);

})(angular);
