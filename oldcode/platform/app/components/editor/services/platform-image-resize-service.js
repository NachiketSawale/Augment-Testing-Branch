(function (angular, Platform) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name editor:platformImageResizeService
	 * @function
	 * @requires
	 * @description
	 */
	angular.module('platform').factory('platformImageResizeService', platformImageResizeService);

	platformImageResizeService.$inject = ['$rootScope', '$compile', 'cloudDesktopTextEditorConsts'];

	function platformImageResizeService($rootScope, $compile, cloudDesktopTextEditorConsts) {
		var service = {};

		service.getElement = function (scope) {
			let data = scope.customSettings;
			let unit;
			if (data.user.useSettings) {
				unit = data.user.unitOfMeasurement;
			} else {
				unit = data.system.unitOfMeasurement;
			}

			let unitConst = cloudDesktopTextEditorConsts.units.find(item => item.value === unit);
			scope.options = {
				decimalPlaces: unitConst.decimal
			};

			let template = '<div data-platform-image-resizer data-options="options" data-img-width="imgWidth" data-img-height="imgHeight" data-prop="e"/>';
			let compiledElement = $compile(template)(scope);

			return compiledElement;
		};

		return service;
	}
})(angular, Platform);