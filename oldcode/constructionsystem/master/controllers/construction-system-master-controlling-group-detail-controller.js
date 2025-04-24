(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterControllingGroupDetailController',
		['$scope',
			'platformDetailControllerService',
			'constructionSystemMasterControllingGroupService',
			'constructionSystemMasterControllingGroupValidationService',
			'constructionSystemMasterControllingGroupUIStandardService',

			function ($scope,
				platformDetailControllerService,
				constructionSystemMasterControllingGroupService,
				constructionSystemMasterControllingGroupValidationService,
				constructionSystemMasterControllingGroupUIStandardService) {

				platformDetailControllerService.initDetailController(
					$scope,
					constructionSystemMasterControllingGroupService,
					constructionSystemMasterControllingGroupValidationService,
					constructionSystemMasterControllingGroupUIStandardService,
					{});

				$scope.$on('$destroy', function () {

				});

			}]);
})(angular);