/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainCopySourceAssembliesLookupController
	 * @function
	 * @description
	 * Controller for the  list view of Copy Source Assemblies entities.
	 **/
	angular.module(moduleName).controller('estimateMainCopySourceAssembliesLookupController',
		['$scope', '$translate', 'platformGridControllerService',
			'estimateMainCopySourceAssembliesLookupService', 'estimateMainClipboardService',
			'estimateAssembliesUIConfigurationServiceFactory', 'estimateAssembliesValidationService', 'estimateMainCopySourceFilterService', 'estimateMainService',
			function ($scope, $translate, platformGridControllerService, estimateMainCopySourceAssembliesLookupService,
				estimateMainClipboardService, estimateAssembliesUIConfigurationServiceFactory,
				estimateAssembliesValidationService, estimateMainCopySourceFilterService, estimateMainService) {

				let estimateAssembliesConfigurationService = estimateAssembliesUIConfigurationServiceFactory.createEstAssembliesListUIConfigService(true);

				let myGridConfig = {
					initCalled: false, columns: [],
					type: 'copySourceAssemblies',
					dragDropService: estimateMainClipboardService
				};

				$scope.setTitle($translate.instant('estimate.assemblies.containers.assemblies'));

				$scope.gridId = '78461ce0d4eb4666bcf04886fccd80fb';

				platformGridControllerService.initListController($scope, estimateAssembliesConfigurationService, estimateMainCopySourceAssembliesLookupService, estimateAssembliesValidationService, myGridConfig);

				function loadSourceAssemblies(filter) {
					estimateMainCopySourceAssembliesLookupService.loadSourceAssemblies(filter);
				}

				estimateMainCopySourceAssembliesLookupService.gridId = $scope.gridId;

				// Display the module header info for the selected main line item
				estimateMainCopySourceAssembliesLookupService.setShowHeaderAfterSelectionChanged(function (lineItemEntity) {
					estimateMainService.updateModuleHeaderInfo(estimateMainService.getSelected());
				});

				estimateMainCopySourceFilterService.loadSourceAssemblies.register(loadSourceAssemblies);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					estimateMainCopySourceFilterService.loadSourceAssemblies.unregister(loadSourceAssemblies);
				});
			}
		]);
})(angular);

