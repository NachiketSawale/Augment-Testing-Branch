/**
 * Created by reimer on 07.12.2016
 */

(function () {

	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of the module
	 */
	angular.module(moduleName).service('boqMainSplitQuantityUIServiceFactory', [
		'boqMainSplitQuantityTranslationService',
		'boqMainSplitQuantityConfigService',
		'platformUIConfigInitService',
		function (translationService,
			layoutService,
			platformUIConfigInitService) {
			var serviceFactory = {};

			serviceFactory.createUIService = function (options) {
				var newCreatedUIService = {};
				platformUIConfigInitService.createUIConfigurationService({
					service: newCreatedUIService,
					layout: layoutService.getLayout(options),
					dtoSchemeId: {typeName: 'BoqSplitQuantityDto', moduleSubModule: 'Boq.Main'},
					translator: translationService
				});

				return newCreatedUIService;
			};

			return serviceFactory;
		}
	]);

})();
