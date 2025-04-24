(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).controller('constructionSystemMasterModelObjectDetailController',
		['$scope','constructionSystemMasterModelObjectDataService',
			'platformDetailControllerService', 'constructionSystemMasterModelObjectUIStandardService','platformTranslateService',
			'$injector',
			function ($scope,modelObjectDataService,
				platformDetailControllerService, modelObjectUIStandardService,translateService,
				$injector) {
				/* set the isDynamicReadonlyConfig true, make it can be change dynamic */
				modelObjectUIStandardService.isDynamicReadonlyConfig = true;
				platformDetailControllerService.initDetailController($scope, modelObjectDataService, {}, modelObjectUIStandardService, translateService);

				function costGroupLoaded(costGroupCatalogs) {
					$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs,{
						scope: $scope,
						dataService:modelObjectDataService,
						validationService: {},
						formConfiguration:modelObjectUIStandardService,
						costGroupName:'referenceGroup'
					}
					);

				}
				modelObjectDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

				/* refresh the columns configuration when controller is created */
				if(modelObjectDataService.costGroupCatalogs){
					costGroupLoaded(modelObjectDataService.costGroupCatalogs);
				}

				$scope.$on('destroy',function () {
					modelObjectDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
				});
			}
		]);
})(angular);