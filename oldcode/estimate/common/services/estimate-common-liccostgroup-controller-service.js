/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global _ */
	let moduleName = 'estimate.common';
	let estimateCommonModule = angular.module(moduleName);

	estimateCommonModule.factory('estimateCommonLiccostgroupControllerService', ['$injector', 'platformGridControllerService', 'estimateMainCommonUIService', 'estimateDefaultGridConfig', 'estimateMainValidationService',
		function ($injector, platformGridControllerService, estimateMainCommonUIService, estimateDefaultGridConfig, estimateMainValidationService) {

			let service = {};

			service.initLiccostgroupController = function (scope, licCostGroupNumber, mainService, licGroupServiceName, clipboardService, filterService) {
				let licGroupService = $injector.get(licGroupServiceName);
				let type = 'estLicCostGrp' + licCostGroupNumber + 'Items';
				let name = 'EstLicCostGrp' + licCostGroupNumber;


				let uiAttributes = ['Code', 'DescriptionInfo', 'Quantity', 'UomFk', 'Rule', 'Param'];

				// assembly Cost Group container, no need the Rule and Param columns now
				if(licGroupServiceName === 'estimateAssembliesLiccostgroup' + _.toString(licCostGroupNumber) + 'Service') {
					uiAttributes = uiAttributes.filter(function(attr){
						return ! _.includes(['Rule', 'Param'], attr);
					});
				}

				let gridConfig = angular.extend({
						marker : {
							filterService: filterService,
							filterId: mainService.getServiceName().replace('Service','') + 'LicCostgroup' + licCostGroupNumber + 'ListController',
							dataService: licGroupService,
							serviceName: licGroupServiceName
						},
						parentProp: 'LicCostGroupFk', childProp: 'ChildItems', childSort: true, type: clipboardService ? type : undefined,
						dragDropService: clipboardService ? clipboardService : undefined
					}, estimateDefaultGridConfig),
					// uiService = estimateMainCommonUIService.createUiService(['Code', 'DescriptionInfo', 'Quantity', 'UomFk', 'Rule', 'Param'], {serviceName: licGroupServiceName, 'itemName':name});
					uiService = estimateMainCommonUIService.createUiService(uiAttributes, {serviceName: licGroupServiceName, 'itemName':name});

				platformGridControllerService.initListController(scope, uiService, licGroupService, estimateMainValidationService, gridConfig);

				licGroupService.registerSelectionChanged(licGroupService.creatorItemChanged);

				// refresh data when assemblies are refreshed
				mainService.registerRefreshRequested(licGroupService.refresh);
				scope.$on('$destroy', function () {
					licGroupService.unregisterSelectionChanged(licGroupService.creatorItemChanged);
					mainService.unregisterRefreshRequested(licGroupService.refresh);
				});
			};

			return service;
		}]);
})();
