/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */

	'use strict';
	let moduleName = 'controlling.generalcontractor';

	/**
     * @ngdoc controller
     * @name controllingGeneralContractorEstimateController
     * @function
     *
     * @description
     * controllingGeneralContractorEstimateController for the  list view of the project estimate header
     **/
	angular.module(moduleName).controller('controllingGeneralContractorEstimateController',
		['_', '$injector', '$scope', '$state', '$translate', '$http', 'platformGridControllerService',
			'controllingGeneralContractorEstimateDataService',
			'controllingGeneralContractorEstimateConfigurationService',
			'platformModuleNavigationService',
			'controllingGeneralcontractorControllerFeaturesServiceProvider',
			function (_, $injector, $scope, $state, $translate, $http, platformGridControllerService,
				controllingGeneralContractorEstimateDataService,
				controllingGeneralContractorEstimateConfigurationService,
				naviService,
				controllerFeaturesServiceProvider) {

				let myGridConfig = {initCalled: false,
					columns: []
				};

				platformGridControllerService.initListController($scope, controllingGeneralContractorEstimateConfigurationService, controllingGeneralContractorEstimateDataService, null, myGridConfig);

				controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				let tools = [];
				let navigator = {moduleName: 'estimate.main', registerService: 'estimateMainService'};
				tools.push({
					id: 't11',
					caption: $translate.instant('estimate.project.goToEstimate'),
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function openEstimate() {

						let selectedItem = controllingGeneralContractorEstimateDataService.getSelected();

						if (controllingGeneralContractorEstimateDataService.isSelection(selectedItem)) {
							naviService.navigate(navigator, selectedItem);
						}
					},
					disabled: function () {
						return _.isEmpty(controllingGeneralContractorEstimateDataService.getSelected()) || !naviService.hasPermissionForModule(navigator.moduleName);
					}
				});

				controllingGeneralContractorEstimateDataService.setGridId($scope.gridId);

				platformGridControllerService.addTools(tools);

				controllingGeneralContractorEstimateDataService.loadData();

			}
		]);
})();
