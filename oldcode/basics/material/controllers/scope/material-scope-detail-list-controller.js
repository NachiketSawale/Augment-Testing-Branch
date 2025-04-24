/**
 * Created by wui on 10/16/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialScopeDetailListController', [
		'$scope',
		'$injector',
		'platformControllerExtendService',
		'platformGridControllerService',
		'basicsMaterialScopeDetailUIStandardService',
		'basicsMaterialScopeDetailDataService',
		'basicsMaterialScopeDetailValidationService',
		function ($scope,
			$injector,
			platformControllerExtendService,
			platformGridControllerService,
			basicsMaterialScopeDetailUIStandardService,
			basicsMaterialScopeDetailDataService,
			basicsMaterialScopeDetailValidationService) {
			var gridConfig = {
				columns: [],
				costGroupService: 'basicsMaterialScopeDetailCostGroupService'
			};

			platformControllerExtendService.initListController($scope, basicsMaterialScopeDetailUIStandardService, basicsMaterialScopeDetailDataService, basicsMaterialScopeDetailValidationService, gridConfig);

			/*function costGroupLoaded(costGroupCatalogs){
                $injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, basicsMaterialScopeDetailUIStandardService, costGroupCatalogs, basicsMaterialScopeDetailDataService, basicsMaterialScopeDetailValidationService);
            }

            /!* add costGroupService to mainService *!/
            if(!basicsMaterialScopeDetailDataService.costGroupService){
                basicsMaterialScopeDetailDataService.costGroupService = $injector.get('basicsMaterialScopeDetailCostGroupService');
            }

            basicsMaterialScopeDetailDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

            $scope.$on('$destroy', function () {
                basicsMaterialScopeDetailDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
            });

            basicsMaterialScopeDetailDataService.costGroupService.registerCellChangedEvent($scope.gridId);

            /!* refresh the columns configuration when controller is created *!/
            if(basicsMaterialScopeDetailDataService.costGroupCatalogs){
                costGroupLoaded(basicsMaterialScopeDetailDataService.costGroupCatalogs);
            }*/
		}
	]);

})(angular);