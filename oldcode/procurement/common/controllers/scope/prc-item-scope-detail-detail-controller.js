/**
 * Created by wui on 10/18/2018.
 */

(function(angular){
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('prcItemScopeDetailDetailController', [
		'$scope',
		'$injector',
		'platformTranslateService',
		'platformDetailControllerService',
		'prcItemScopeDetailUIStandardService',
		'prcItemScopeDetailDataService',
		'prcItemScopeDetailValidationService',
		function ($scope,
			$injector,
			platformTranslateService,
			platformDetailControllerService,
			prcItemScopeDetailUIStandardService,
			prcItemScopeDetailDataService,
			prcItemScopeDetailValidationService) {

			var uiStandardService = prcItemScopeDetailUIStandardService.getService();
			var dataService = prcItemScopeDetailDataService.getService();
			var validationService = prcItemScopeDetailValidationService.getService(dataService);

			uiStandardService.isDynamicReadonlyConfig = true;
			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, platformTranslateService);

			function costGroupLoaded(costGroupCatalogs){
				$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
					scope : $scope,
					dataService : dataService,
					validationService : validationService,
					formConfiguration : uiStandardService,
					costGroupName : 'basicData'
				});
			}

			dataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

			$scope.$on('$destroy', function () {
				dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			});

			/* $scope.formOptions.configure.dirty = function dirty(entity, field, options) {
                if(dataService.costGroupService && options && options.costGroupCatId){
                    dataService.costGroupService.createCostGroup2Save(entity, {costGroupCatId : options.costGroupCatId, field : options.model});
                }
            }; */

			/* refresh the columns configuration when controller is created */
			if(dataService.costGroupCatalogs){
				costGroupLoaded(dataService.costGroupCatalogs);
			}
		}
	]);

})(angular);