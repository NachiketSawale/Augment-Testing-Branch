/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainCopySourceLineItemResourceLookupController
	 * @function
	 * @description
	 * Controller for the tree view of Copy Source Line Item's Resources entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainCopySourceLineItemResourceLookupController',
		['$scope',
			'platformGridControllerService',
			'estimateMainCopySourceLineItemResourceLookupService',
			'estimateMainClipboardService',
			'estimateMainResourceConfigurationService',
			'estimateMainResourceValidationService',
			'estimateMainCopySourceFilterService',
			'platformDragdropService',
			'$translate',
			'estimateMainResourceDynamicConfigurationService',

			function ($scope,
				platformGridControllerService,
				estimateMainCopySourceLineItemResourceLookupService,
				estimateMainClipboardService,
				estimateMainResourceConfigurationService,
				estimateMainResourceValidationService,
				estimateMainCopySourceFilterService,
				platformDragdropService,
				$translate,estimateMainResourceDynamicConfigurationService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'EstResourceFk',
					childProp: 'EstResources',
					childSort: true,
					sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
					type: 'copySourceLineItemResource',
					dragDropService: estimateMainClipboardService,
					allowedDragActions: [platformDragdropService.actions.copy]
				};

				$scope.gridId = 'c705f90e96b3472c982488b686c0e30b';

				$scope.setTitle($translate.instant('estimate.main.resourceContainer'));

				platformGridControllerService.initListController($scope, estimateMainResourceDynamicConfigurationService, estimateMainCopySourceLineItemResourceLookupService, estimateMainResourceValidationService, myGridConfig);

				function clear(){
					estimateMainCopySourceLineItemResourceLookupService.clearLookupData();
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

