/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of line item entities.
	 **/
	angular.module(moduleName).controller('estimateMainLineItemDetailController', ['$scope', '$timeout', '$injector', 'platformDetailControllerService', 'estimateMainService', 'estimateMainValidationService',
		'estimateMainStandardConfigurationService', 'estimateMainTranslationService', 'estimateMainLineItemDetailService', 'estimateMainDynamicConfigurationService',

		function ($scope, $timeout, $injector, platformDetailControllerService, estimateMainService, estimateMainValidationService,
			estimateMainStandardConfigurationService, estimateMainTranslationService, estimateMainLineItemDetailService, estimateMainDynamicConfigurationService) {

			$scope.change = function(entity, field, column){
				estimateMainLineItemDetailService.fieldChange(entity, field, column);
			};

			estimateMainStandardConfigurationService.isDynamicReadonlyConfig = true;

			/* add costGroupService to mainService */
			if(!estimateMainService.costGroupService){
				estimateMainService.costGroupService = $injector.get('estimateMainLineItemCostGroupService');
			}

			// let estimateMainStandardConfigurationExtendService = estimateCommonDynamicConfigurationServiceFactory.getService('estimateMainStandardConfigurationService', estimateMainValidationService);

			// estimateMainDynamicConfigurationService.attachCostGroup(estimateMainService.costGroupCatalogs, estimateMainService.costGroupService);

			platformDetailControllerService.initDetailController($scope, estimateMainService, estimateMainValidationService, estimateMainDynamicConfigurationService, estimateMainTranslationService);

			// DynamicConfigSetUp: 5. For Detail, In case we require to change the configuration on row selected, then we will the following configuration.
			// function onSelectionChanged(item){
			// estimateMainStandardConfigurationService.refreshDetailConfig($scope);
			// }
			//
			// estimateMainService.registerSelectionChanged(onSelectionChanged);

			let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
			estimateMainDynamicUserDefinedColumnService.loadUserDefinedColumnDetail($scope);

			// update realfactorcost or realfactorquantity on modification
			function updateCurrentItem() {
				$timeout(function () {
					$scope.currentItem = estimateMainService.getSelected();
				}, 0);
			}

			//  register subscription
			estimateMainService.registerDataModified(updateCurrentItem);

			function costGroupLoaded(costGroupCatalogs){
				$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
					scope : $scope,
					dataService : estimateMainService,
					validationService : estimateMainValidationService,
					formConfiguration : estimateMainStandardConfigurationService
				});
			}
			estimateMainService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

			/* if(estimateMainService.costGroupCatalogs){
				costGroupLoaded(estimateMainService.costGroupCatalogs);
			} */

			//  unregister subscription
			$scope.$on('$destroy', function () {
				estimateMainService.unregisterDataModified(updateCurrentItem);
				estimateMainService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);

				// DynamicConfigSetUp: 5. For Detail, In case we require to change the configuration on row selected, then we will the following configuration. //Don't forget to destroy
				// estimateMainService.unregisterSelectionChanged(onSelectionChanged);
			});
		}
	]);
})(angular);
