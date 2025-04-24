(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module('qto.main').controller('qtoMainSubTotalFormController',
		['$scope', 'qtoMainSubTotalUIStandardService', 'qtoMainSubTotalService', 'platformDetailControllerService',
			'platformTranslateService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService) {
				detailControllerService.initDetailController($scope, dataService, null, formConfiguration, translateService);
				$scope.formContainerOptions.onAddItem = false;
				$scope.formContainerOptions.onDeleteItem = false;
			}] );
})(angular);

