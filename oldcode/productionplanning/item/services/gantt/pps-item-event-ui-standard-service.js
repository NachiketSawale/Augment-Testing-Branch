/**
 * Created by mik on 14/08/2019.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.item';
	/**
	 * @ngdoc service
	 * @name ppsItemEventUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of Item and Event entities
	 */
	angular.module(moduleName).factory('productionplanningItemEventUIStandardService', PPSItemEventUIStandardService);

	PPSItemEventUIStandardService.$inject = ['ppsCommonLoggingUiService', 'productionplanningItemTranslationService',
		'platformSchemaService', 'productionplanningItemEventLayout', 'platformUIStandardExtentService',
		'productionplanningItemEventLayoutConfig'];

	function PPSItemEventUIStandardService(ppsCommonLoggingUiService, ppsItemTranslationService,
									  platformSchemaService, ppsItemEventLayout, platformUIStandardExtentService,
									  ppsItemEventLayoutConfig) {

		var BaseService = ppsCommonLoggingUiService;
		var schemaOption = { typeName: 'PPSItemEventDto', moduleSubModule: 'ProductionPlanning.Item' };

		var itemAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'PPSItemEventDto', moduleSubModule: 'ProductionPlanning.Item' });
		itemAttributeDomains = itemAttributeDomains.properties;

		//adding drawing code field manually
		itemAttributeDomains['Drawing.Code']= {
			domain: 'description'
		};

		// function ItemEventUIStandardService(layout, scheme, translateService) {
		// 	BaseService.call(this, layout, scheme, translateService);
		// }
		//
		// ItemEventUIStandardService.prototype = Object.create(BaseService.prototype);
		// ItemEventUIStandardService.prototype.constructor = ItemEventUIStandardService;

		// var service = new BaseService(ppsItemEventLayout, itemAttributeDomains, ppsItemTranslationService);



		var service = new BaseService(ppsItemEventLayout, schemaOption, ppsItemTranslationService);
		platformUIStandardExtentService.extend(service, ppsItemEventLayoutConfig.addition, itemAttributeDomains);


		return service;

	}
})();
