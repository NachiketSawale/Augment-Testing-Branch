(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.cadimport';
	angular.module(moduleName).controller('ppsCadimportDrawingDetailController', [
		'$scope', 'platformDetailControllerService',
		'ppsCadimportDrawingUIService', 'ppsCadimportDrawingDataService',
		'productionplanningDrawingTranslationService',
		function ($scope, platformDetailControllerService,
				  uiStandardService, dataService,
				  ppsDrawingTranslationService) {
			platformDetailControllerService.initDetailController($scope, dataService, {}, uiStandardService, ppsDrawingTranslationService);

			$scope.onPropertyChange = function (entity, col) {
				dataService.onPropertyChange({entity: entity, col: col, isDetail: true});
			};
		}
	]);
})();