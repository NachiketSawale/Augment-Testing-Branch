/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc controller
	 * @name basicsCostCodesDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of costcodes entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCostCodesDetailController', ['$scope', '$timeout', '$injector', 'platformDetailControllerService', 'basicsCostCodesMainService', 'basicsCostCodesValidationService', 'basicsCostCodesUIStandardService', 'basicsCostCodesTranslationService', 'basicsCostCodesDynamicConfigurationService', 'platformFormConfigService',

		function ($scope, $timeout, $injector, platformDetailControllerService, basicsCostCodesMainService, basicsCostCodesValidationService, basicsCostCodesUIStandardService, basicsCostCodesTranslationService, basicsCostCodesDynamicConfigurationService ) {

			$scope.change = function(entity, field){
				basicsCostCodesMainService.fieldChanged(entity, field);
			};

			platformDetailControllerService.initDetailController($scope, basicsCostCodesMainService, basicsCostCodesValidationService, basicsCostCodesDynamicConfigurationService, basicsCostCodesTranslationService);

			let basicsCostCodesDynamicUserDefinedColumnService = $injector.get('basicsCostCodesDynamicUserDefinedColumnService');
			basicsCostCodesDynamicUserDefinedColumnService.loadUserDefinedColumnDetail($scope);

			// update realfactorcost or realfactorquantity on modification
			function updateCurrentItem() {
				$timeout(function () {
					$scope.currentItem = basicsCostCodesMainService.getSelected();
				}, 0);
			}

			//  register subscription
			basicsCostCodesMainService.registerDataModified(updateCurrentItem);

			//  unregister subscription
			$scope.$on('$destroy', function () {
				basicsCostCodesMainService.unregisterDataModified(updateCurrentItem);
			});
		}
	]);
})(angular);