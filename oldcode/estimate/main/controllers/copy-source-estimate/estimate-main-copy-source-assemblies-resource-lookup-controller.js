/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainCopySourceAssembliesResourceLookupController
	 * @function
	 * @description
	 * Controller for the tree view of Copy Source Assembly's Resources entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainCopySourceAssembliesResourceLookupController',
		['$scope',
			'platformGridControllerService',
			'estimateMainCopySourceAssembliesResourceLookupService',
			'estimateMainClipboardService',
			'estimateAssembliesResourceConfigurationService',
			'estimateAssembliesResourceValidationService',
			'estimateMainCopySourceFilterService',
			'platformDragdropService',
			'$translate',

			function (
				$scope,
				platformGridControllerService,
				estimateMainCopySourceAssembliesResourceLookupService,
				estimateMainClipboardService,
				estimateAssembliesResourceConfigurationService,
				estimateAssembliesResourceValidationService,
				estimateMainCopySourceFilterService,
				platformDragdropService,
				$translate) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'EstResourceFk',
					childProp: 'EstResources',
					childSort: true,
					sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
					type: 'copySourceAssembliesResource',
					dragDropService: estimateMainClipboardService,
					allowedDragActions: [platformDragdropService.actions.copy]
				};

				$scope.gridId = 'fb896283b3da4de0853f5ef2721a4870';

				$scope.setTitle($translate.instant('estimate.main.resourceContainer'));

				platformGridControllerService.initListController($scope, estimateAssembliesResourceConfigurationService, estimateMainCopySourceAssembliesResourceLookupService, estimateAssembliesResourceValidationService, myGridConfig);

				function clear(){
					estimateMainCopySourceAssembliesResourceLookupService.clearLookupData();
				}

				estimateMainCopySourceFilterService.loadSourceAssemblies.register(clear);

				estimateMainCopySourceFilterService.loadSourceLineItems.register(clear);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					estimateMainCopySourceFilterService.loadSourceAssemblies.unregister(clear);

					estimateMainCopySourceFilterService.loadSourceLineItems.unregister(clear);

				});
			}
		]);
})(angular);

