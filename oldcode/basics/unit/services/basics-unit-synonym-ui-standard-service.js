(function () {
	'use strict';
	var moduleName = 'basics.unit';
	/**
	 * @ngdoc service
	 * @name basicsSynonymUnitSynonymUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of UnitSynonym entities
	 */
	angular.module(moduleName).factory('basicsUnitSynonymUIStandardService',

		['platformUIStandardConfigService', 'basicsUnitTranslationService', 'basicsUnitSynonymDetailLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsUnitTranslationService, basicsUnitSynonymDetailLayout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var unitSynonymAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'UomSynonymDto',
					moduleSubModule: 'Basics.Unit'
				});

				unitSynonymAttributeDomains = unitSynonymAttributeDomains.properties;

				var service = new BaseService(basicsUnitSynonymDetailLayout, unitSynonymAttributeDomains, basicsUnitTranslationService);

				return service;
			}
		]);
})();
