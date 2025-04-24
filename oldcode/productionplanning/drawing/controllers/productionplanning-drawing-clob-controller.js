/**
 * Created by zov on 28/04/2019.
 */
(function () {
	/*global angular*/
	'use strict';

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).controller('productionplanningDrawingClobController', [
		'$scope',
		'platformContainerControllerService',
		'productionplanningDrawingClobControllerService',
		function ($scope,
				  platformContainerControllerService,
				  clobControllerService) {

			var _moduleName = $scope.getContentValue('moduleName') || moduleName;
			var modCIS = platformContainerControllerService.getModuleInformationService(_moduleName);
			var guid = $scope.getContentValue('uuid');
			var layInfo = modCIS.getContainerInfoByGuid(guid);

			clobControllerService.initController($scope, layInfo);
		}
	]);
})();