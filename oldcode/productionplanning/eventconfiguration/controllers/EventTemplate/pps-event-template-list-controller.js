/**
 * Created by anl on 6/6/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).controller('productionplanningEventconfigurationTemplateListController', EventTemplateListController);

	EventTemplateListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningEventconfigurationTemplateUIStandardService'];

	function EventTemplateListController($scope, platformContainerControllerService,
										 platformTranslateService, uiStandardService) {

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}

})(angular);