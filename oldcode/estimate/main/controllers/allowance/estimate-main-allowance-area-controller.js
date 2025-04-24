(function(angular){
	'use strict';

	angular.module('estimate.main').controller('estimateMainAllowanceAreaController', ['$injector', '$scope', '$timeout', 'platformGridControllerService',
		'estimateMainAllowanceAreaUIConfigService', 'estimateMainAllowanceAreaValidationService', 'estimateMainAllowanceAreaService','estimateMainService',
		'estimateMainFilterService',
		function($injector, $scope, $timeout, platformGridControllerService, estimateMainAllowanceAreaUIConfigService, estimateMainAllowanceAreaValidationService,
				 estimateMainAllowanceAreaService, estimateMainService, estimateMainFilterService){
			let gridConfig = {
				marker : {
					filterService: estimateMainFilterService,
					filterId: 'estimateMainAllowanceAreaController',
					dataService: estimateMainAllowanceAreaService,
					serviceName: 'estimateMainAllowanceAreaService'
				},
				isTree: true,
				propagateCheckboxSelection: true,
				parentProp: 'ParentFk',
				childProp: 'Children',
				childSort: true,
				type: 'allowanceArea'
			};

			platformGridControllerService.initListController($scope, estimateMainAllowanceAreaUIConfigService, estimateMainAllowanceAreaService, estimateMainAllowanceAreaValidationService, gridConfig);
			estimateMainService.onContextUpdated.register(estimateMainAllowanceAreaService.clearDataFromFavorites);

			$timeout(function(){
				$injector.get('estimateMainAllowanceAreaValueColumnGenerator').refreshColumns();
			});

			$scope.$on('$destroy', function () {
				estimateMainService.onContextUpdated.unregister(estimateMainAllowanceAreaService.clearDataFromFavorites);
			});
		}]);
})(angular);