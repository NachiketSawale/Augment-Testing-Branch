(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).service('productionplanningDrawingStackUIStandardService', StackUIStandardService);

	StackUIStandardService.$inject = ['platformUIConfigInitService', 'productionplanningDrawingContainerInformationService', 'productionplanningDrawingTranslationService'];

	function StackUIStandardService(platformUIConfigInitService, drawingContainerInformationService, drawingTranslationService) {

		function createService(key) {
			key = key || '';
			var service = {};
			var layout = drawingContainerInformationService.getPpsDrawingStackLayout();

			if (!key.toLowerCase().includes('cadimport')) {
				filter(layout, ['dbid']);
			}

			platformUIConfigInitService.createUIConfigurationService({
				service: service,
				layout: layout,
				dtoSchemeId: {
					moduleSubModule: 'ProductionPlanning.Drawing',
					typeName: 'EngStackDto'
				},
				translator: drawingTranslationService
			});
			return service;
		}

		function filter(layout, rows) {
			_.forEach(layout.groups, function (group) {
				group.attributes = _.filter(group.attributes, function (att) {
					return !_.includes(rows, att);
				});
			});
		}

		var serviceCache = {};

		function getService(key) {
			if (!serviceCache[key]) {
				serviceCache[key] = createService(key);
			}
			return serviceCache[key];
		}

		var service = getService();
		service.getService = getService;
		return service;
	}
})();