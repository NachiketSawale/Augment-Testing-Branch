/**
 * Created by Jeffrey on 12/9/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterController',
		['$scope',
			'platformMainControllerService',
			'platformMainControllerService',
			'constructionsystemMasterTranslationService',
			'constructionSystemMasterHeaderService',
			'constructionSystemMasterParameterGroupDataService',
			'constructionSystemMasterWizardService',
			'constructionSystemMasterFilterService',
			'constructionSystemMasterTestDataService',
			'platformNavBarService',
			'constructionSystemMasterGroupService',
			'$injector',
			'constructionSystemCommonContextService',
			'constructionSystemMasterGlobalParameterDataService',
			function (
				$scope,
				platformMainControllerService,
				mainControllerService,
				translateService,
				constructionSystemMasterHeaderService,
				constructionSystemMasterParameterGroupDataService,
				constructionSystemMasterWizardService,
				constructionSystemMasterFilterService,
				constructionSystemMasterTestDataService,
				platformNavBarService,
				constructionSystemMasterGroupService,
				$injector,
				constructionSystemCommonContextService,
				constructionSystemMasterGlobalParameterDataService) {/* jshint -W072 */ // ignore line for initial ues

				var opt = { search: true, reports: false, wizards: false , auditTrail: '77abd189594645e4b103fb80da2706d5'};
				var result = mainControllerService.registerCompletely($scope, constructionSystemMasterHeaderService, {}, translateService, moduleName, opt);

				constructionSystemMasterWizardService.active();
				constructionSystemMasterFilterService.registerFilters();
				constructionSystemMasterHeaderService.registerLookupFilter();
				constructionSystemMasterTestDataService.registerLookupFilter();

				var originalFn = platformNavBarService.getActionByKey('save').fn;
				platformNavBarService.getActionByKey('save').fn = function () {
					if (originalFn) {
						originalFn();
					}
					if(constructionSystemMasterGroupService.isModelChanged()){
						var selectedItem = constructionSystemMasterGroupService.getSelected();
						if(selectedItem){
							var validationService = $injector.get('constructionSystemMasterGroupValidationService');
							// validationService.validateCode(selectedItem, selectedItem.Code, 'Code');
							validationService.asyncValidateCode(selectedItem, selectedItem.Code, 'Code');
						}
					}
					constructionSystemMasterGroupService.update();
					constructionSystemMasterGlobalParameterDataService.update();
				};

				constructionSystemCommonContextService.setMainService(constructionSystemMasterHeaderService);

				$scope.$on('$destroy', function () {
					constructionSystemMasterFilterService.unRegisterFilters();
					constructionSystemMasterHeaderService.unregisterLookupFilter();
					constructionSystemMasterTestDataService.unregisterLookupFilter();
					constructionSystemMasterWizardService.deactive();
					mainControllerService.unregisterCompletely(constructionSystemMasterHeaderService, result, translateService, opt);
					constructionSystemCommonContextService.removeModuleValue(constructionSystemCommonContextService.cosCommonMainService);
				});
			}
		]);
})(angular);