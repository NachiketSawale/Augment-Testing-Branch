(function (angular) {
	'use strict';

	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name
	 * @description provides translation for this module
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('basicsCharacteristicDataTranslationService',
		['platformUIBaseTranslationService', 'basicsCharacteristicDataLayoutServiceFactory',
			function (platformUIBaseTranslationService, basicsCharacteristicDataLayoutServiceFactory) {

				var layouts = [basicsCharacteristicDataLayoutServiceFactory.getLayoutForTranslation()];
				var localBuffer = {};
				platformUIBaseTranslationService.call(this, layouts, localBuffer);

			}
		]);

})(angular);
