/**
 * Created by xia on 5/17/2019.
 */
/**
 * Created by xia on 5/8/2019.
 */
(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainPriceconditionUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of unit entities
	 */
	angular.module(moduleName).factory('boqMainPriceconditionUIStandardService', ['platformUIStandardConfigService',
		'boqMainPriceconditionTranslationService', 'basicsMaterialPriceConditionLayout', 'platformSchemaService',

		function (platformUIStandardConfigService, translationService,
			layout, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;
			var domainSchema = platformSchemaService.getSchemaFromCache(
				{
					typeName: 'BoqPriceconditionDto',
					moduleSubModule: 'Boq.Main'
				});

			function PriceConditionUIStandardService(layout, schema, translateService) {
				BaseService.call(this, layout, schema, translateService);
				this.getStandardConfigForListView().columns[5].width = 120;
			}

			PriceConditionUIStandardService.prototype = Object.create(BaseService.prototype);
			PriceConditionUIStandardService.prototype.constructor = PriceConditionUIStandardService;

			return new PriceConditionUIStandardService(layout, domainSchema.properties, translationService);
		}
	]);
})();

