(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningDrawingPinnableEntityService
	 * @function
	 * @requires cloudDesktopPinningContextService, basicsLookupdataLookupDataService
	 *
	 * @description A pinning context service adapter for drawing.
	 */
	angModule.factory('productionplanningDrawingPinnableEntityService', Service);
	Service.$inject = ['cloudDesktopPinningContextService', 'basicsLookupdataLookupDataService'];

	function Service(cloudDesktopPinningContextService, basicsLookupdataLookupDataService) {
		return cloudDesktopPinningContextService.createPinnableEntityService({
			token: 'productionplanning.drawing',
			retrieveInfo: function (id) {
				return basicsLookupdataLookupDataService.getItemByKey('EngDrawing', id, {version: 3}).then(function (item) {
					if (item) {
						item = item ? item : {Code: '*'};
						return cloudDesktopPinningContextService.concate2StringsWithDelimiter(item.Code, item.Description, ' - ');
					}
				});
			},
			dependsUpon: ['project.main']
		});
	}
})(angular);