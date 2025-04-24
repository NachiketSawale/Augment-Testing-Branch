/**
 * Created by wed on 6/19/2017.
 */
(function(angular){
	'use strict';
	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterGroupDetailController',['$scope','platformContainerControllerService',
		function ($scope,platformContainerControllerService) {
			platformContainerControllerService.initController($scope,moduleName,'189564016710460192353d6dd68daa44','constructionsystemMasterTranslationService');
		}]);
})(angular);