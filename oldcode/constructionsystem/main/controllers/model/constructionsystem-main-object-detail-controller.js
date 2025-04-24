(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObjectDetailController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main object form.
	 */
	angular.module(moduleName).controller('constructionSystemMainObjectDetailController', [
		'$scope', 'platformDetailControllerService', 'constructionSystemMainObjectUIConfigService',
		'constructionSystemMainObjectService', 'constructionsystemMainTranslationService', '$injector',
		function ($scope, platformDetailControllerService, uiConfigService, dataService, translateService, $injector) {
			/* set the isDynamicReadonlyConfig true, make it can be change dynamic */
			uiConfigService.isDynamicReadonlyConfig = true;

			platformDetailControllerService.initDetailController($scope, dataService, {}, uiConfigService, translateService);

			function costGroupLoaded(costGroupCatalogs) {
				$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs,{
					scope: $scope,
					dataService:dataService,
					validationService: {},
					formConfiguration:uiConfigService,
					costGroupName:'referenceGroup'
				}
				);

			}
			dataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

			/* refresh the columns configuration when controller is created */
			if(dataService.costGroupCatalogs){
				costGroupLoaded(dataService.costGroupCatalogs);
			}

			$scope.$on('destroy',function () {
				dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			});
		}
	]);
})(angular);
