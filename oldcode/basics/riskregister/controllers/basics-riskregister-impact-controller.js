
(function (angular) {

	/*globals angular*/
	'use strict';
	var moduleName = 'basics.riskregister';
	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of line item entities.
	 **/
	angular.module(moduleName).controller('basicsRiskRegisterImpactDetailController', ['$scope', '$timeout', '$injector', 'platformDetailControllerService',
		'basicsRiskRegisterImpactStandardConfigurationService','basicsRiskRegisterImpactService',
		'platformTranslateService','basicsRiskRegisterDataService','estimateMainRiskCalculatorDialogUIConfigService',
		'estimateCommonDynamicConfigurationServiceFactory','basicsRiskRegisterImpactDetailService',
		'platformCreateUuid','basicsRiskRegisterTranslationService',

		function ($scope, $timeout, $injector, platformDetailControllerService,
		          basicsRiskRegisterImpactStandardConfigurationService,basicsRiskRegisterImpactService,
		          platformTranslateService,basicsRiskRegisterDataService,estimateMainRiskCalculatorDialogUIConfigService,
		          estimateCommonDynamicConfigurationServiceFactory,basicsRiskRegisterImpactDetailService,
		          platformCreateUuid,basicsRiskRegisterTranslationService) {

			/*var uniqId = platformCreateUuid();

			$scope.getContainerUUID = function () {
				return uniqId;
			};

			$scope.change = function(entity, field, column){
				//estimateMainLineItemDetailService.fieldChange(entity, field, column);
				basicsRiskRegisterDataService.markItemAsModified(entity);


			};

			$scope.loadCurrentItem = function(){
				$timeout(function () {
					$scope.currentItem = basicsRiskRegisterImpactService.getSelected();
					basicsRiskRegisterImpactService.gridRefresh();
				},0);
			};
			basicsRiskRegisterImpactStandardConfigurationService.isDynamicReadonlyConfig = false;
			var estimateMainStandardConfigurationExtendService = estimateCommonDynamicConfigurationServiceFactory.getService('basicsRiskRegisterImpactStandardConfigurationService', platformTranslateService);
			*/var riskEventsDataServiceCopy = angular.copy(basicsRiskRegisterDataService);

			riskEventsDataServiceCopy.getSelected = function getSelected(){
				var selected = basicsRiskRegisterDataService.getSelected();

				if(selected){
					if(selected.hasOwnProperty('RiskRegisterImpactEntities')){
						return selected.RiskRegisterImpactEntities[0];
					}else{
						return selected;
					}

				}
				return selected;
			};

			$scope.change = function(entity, field,column){
				$scope.newEntity=entity;
				basicsRiskRegisterImpactDetailService.fieldChange(entity, field,column);
			};

			platformDetailControllerService.initDetailController($scope, riskEventsDataServiceCopy, null, basicsRiskRegisterImpactStandardConfigurationService, basicsRiskRegisterTranslationService);

			//update realfactorcost or realfactorquantity on modification
			function updateCurrentItem() {
				$timeout(function () {
					//$scope.currentItem = basicsRiskRegisterImpactService.getSelecreadted();
					$scope.loadCurrentItem();


					//var selected = basicsRiskRegisterDataService.getSelected();
					//basicsRiskRegisterImpactService.load();
				}, 0);
			}

			function refreshForm(){
				$scope.currentItem = basicsRiskRegisterImpactService.getSelected();
				var dependencyService = $injector.get('basicsRiskRegisterDependencyUpdateService');
				dependencyService.setIsModified(false);
				basicsRiskRegisterImpactService.load();
				basicsRiskRegisterImpactService.gridRefresh();

			}

			//basicsRiskRegisterImpactService.refreshData.register(refreshForm);
			//  register subscription
			//basicsRiskRegisterImpactService.registerListLoaded(updateCurrentItem);
			//basicsRiskRegisterDataService.registerSelectionChanged(updateCurrentItem);


			//  unregister subscription
			/*$scope.$on('$destroy', function () {
				//basicsRiskRegisterDataService.unregisterSelectionChanged(updateCurrentItem);
				//basicsRiskRegisterImpactService.refreshData.unregister(refreshForm);
				//basicsRiskRegisterImpactService.unregisterListLoaded(updateCurrentItem);
				//estimateMainService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			});*/
		}
	]);
})(angular);
