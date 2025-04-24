(function (angular) {
	'use strict';
	angular.module('qto.main').controller('prjQtoCommentController', ['$scope', 'platformGridControllerService', 'prjQtoCommentUIStandardService', 'prjQtoCommentDataService', 'prjQtoCommentValidationService', function ($scope, gridControllerService, gridColumns, dataService, validationService) {
		let gridConfig = {initCalled: false, columns: []};
		gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
	}]);
})(angular);