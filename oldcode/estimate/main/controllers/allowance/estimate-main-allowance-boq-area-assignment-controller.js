(function(angular){
	'use strict';

	angular.module('estimate.main').controller('estimateMainAllowanceBoqAreaAssignmentController', ['$scope', 'platformGridControllerService',
		'estimateMainAllowanceBoqAreaAssignmentConfigService', 'estimateMainBoqAreaAssignmentValidationService', 'estimateMainAllowanceBoqAreaAssigmentService',
		'estimateMainService',
		function($scope, platformGridControllerService, estimateMainAllowanceBoqAreaAssignmentConfigService, estimateMainBoqAreaAssignmentValidationService,
				 estimateMainAllowanceBoqAreaAssigmentService, estimateMainService){
			let gridConfig = {
				type: 'boqAreaAssignment'
			};

			platformGridControllerService.initListController($scope, estimateMainAllowanceBoqAreaAssignmentConfigService, estimateMainAllowanceBoqAreaAssigmentService, estimateMainBoqAreaAssignmentValidationService, gridConfig);

			estimateMainService.onContextUpdated.register(estimateMainAllowanceBoqAreaAssigmentService.clearDataFromFavorites);

			$scope.$on('$destroy', function () {
				estimateMainService.onContextUpdated.unregister(estimateMainAllowanceBoqAreaAssigmentService.clearDataFromFavorites);
			});
		}]);
})(angular);