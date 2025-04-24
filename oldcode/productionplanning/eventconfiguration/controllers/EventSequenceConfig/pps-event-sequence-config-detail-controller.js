/**
 * Created by anl on 6/6/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).controller('productionplanningEventconfigurationSequenceDetailController', EventSequenceDetailController);

	EventSequenceDetailController.$inject = ['$scope', 'platformContainerControllerService', 'productionplanningEventconfigurationTranslationService'];

	function EventSequenceDetailController($scope, platformContainerControllerService, translationService) {
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid, translationService);
	}

})(angular);