(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterControllingGroupController',
		['$scope',
			'constructionSystemMasterControllingGroupService',
			'platformGridControllerService',
			'constructionSystemMasterControllingGroupUIStandardService',
			'constructionSystemMasterControllingGroupValidationService',

			function ($scope,
				constructionSystemMasterControllingGroupService,
				platformGridControllerService,
				constructionSystemMasterControllingGroupUIStandardService,
				constructionSystemMasterControllingGroupValidationService) {

				platformGridControllerService.initListController(
					$scope,
					constructionSystemMasterControllingGroupUIStandardService,
					constructionSystemMasterControllingGroupService,
					constructionSystemMasterControllingGroupValidationService,
					{});

				$scope.$on('$destroy', function () {

				});
			}
		]);
})(angular);