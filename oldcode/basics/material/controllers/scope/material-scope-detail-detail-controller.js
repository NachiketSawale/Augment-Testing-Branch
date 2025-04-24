/**
 * Created by wui on 10/18/2018.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialScopeDetailDetailController', [
		'$scope',
		'$injector',
		'platformTranslateService',
		'platformDetailControllerService',
		'basicsMaterialScopeDetailUIStandardService',
		'basicsMaterialScopeDetailDataService',
		'basicsMaterialScopeDetailValidationService',
		function ($scope,
			$injector,
			platformTranslateService,
			platformDetailControllerService,
			basicsMaterialScopeDetailUIStandardService,
			basicsMaterialScopeDetailDataService,
			basicsMaterialScopeDetailValidationService) {

			basicsMaterialScopeDetailUIStandardService.isDynamicReadonlyConfig = true;
			platformDetailControllerService.initDetailController($scope, basicsMaterialScopeDetailDataService, basicsMaterialScopeDetailValidationService, basicsMaterialScopeDetailUIStandardService, platformTranslateService);

			function costGroupLoaded(costGroupCatalogs){
				$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
					scope : $scope,
					dataService : basicsMaterialScopeDetailDataService,
					validationService : basicsMaterialScopeDetailValidationService,
					formConfiguration : basicsMaterialScopeDetailUIStandardService,
					costGroupName : 'basicData'
				});
			}

			/* add costGroupService to mainService */
			if(!basicsMaterialScopeDetailDataService.costGroupService){
				basicsMaterialScopeDetailDataService.costGroupService = $injector.get('basicsMaterialScopeDetailCostGroupService');
			}

			basicsMaterialScopeDetailDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

			$scope.$on('$destroy', function () {
				basicsMaterialScopeDetailDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			});

			/* refresh the columns configuration when controller is created */
			if(basicsMaterialScopeDetailDataService.costGroupCatalogs){
				costGroupLoaded(basicsMaterialScopeDetailDataService.costGroupCatalogs);
			}
		}
	]);

})(angular);