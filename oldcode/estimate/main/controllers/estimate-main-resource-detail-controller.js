/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainResourceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Resource entities.
	 **/
	angular.module(moduleName).controller('estimateMainResourceDetailController', ['$scope', '$timeout', '$injector', '_', 'platformDetailControllerService', 'estimateMainResourceService', 'estimateMainResourceValidationService', 'estimateMainResourceConfigurationService', 'estimateMainTranslationService', 'estimateMainResourceDetailService',

		function ($scope, $timeout, $injector, _, platformDetailControllerService, estimateMainResourceService, estimateMainResourceValidationService, estimateMainResourceConfigurationService, estimateMainTranslationService, estimateMainResourceDetailService) {

			$scope.change = function(entity, field){
				estimateMainResourceDetailService.fieldChange(entity, field);
				estimateMainResourceDetailService.valueChangeCallBack(entity, field);
			};
			platformDetailControllerService.initDetailController($scope, estimateMainResourceService, estimateMainResourceValidationService, estimateMainResourceConfigurationService, estimateMainTranslationService);

			// update realfactorcost or realfactorquantity on modification
			function updateCurrentItem() {
				$timeout(function () {
					$scope.currentItem = estimateMainResourceService.getSelected();
				}, 0);
			}
			//  register subscription
			estimateMainResourceService.registerDataModified(updateCurrentItem);

			let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
			estimateMainResourceDynamicUserDefinedColumnService.loadUserDefinedColumnDetail($scope);
			//  unregister subscription
			$scope.$on('$destroy', function () {
				estimateMainResourceService.unregisterDataModified(updateCurrentItem);
			});
		}
	]);
})(angular);
