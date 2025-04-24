/**
 * Created by joshi on 27.10.2015.
 */
(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainSurchargeStdConfigService
	 * @function
	 *
	 * @description
	 * boqMainSurchargeStdConfigService is the configuration service for creating a form container standard config from dto and high level description.
	 */
	angular.module(moduleName).factory('boqMainSurchargeStdConfigService',
		['platformUIStandardConfigService', 'boqMainTranslationService', 'platformSchemaService', 'boqMainSurchargedConfigService',
			function (platformUIStandardConfigService, boqMainTranslationService, platformSchemaService, boqMainSurchargedConfigService) {

				var BaseService = platformUIStandardConfigService;

				var boqISurchargeAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BoqItemDto',
					moduleSubModule: 'Boq.Main'
				});
				if (boqISurchargeAttributeDomains) {
					boqISurchargeAttributeDomains = boqISurchargeAttributeDomains.properties;
					boqISurchargeAttributeDomains.QuantitySplit = {domain: 'quantity'};
					boqISurchargeAttributeDomains.SelectMarkup = {domain: 'boolean'};
					boqISurchargeAttributeDomains.QuantitySplitTotal = {domain: 'money'};
				}

				function BoqMainSurchargeUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				BoqMainSurchargeUIStandardService.prototype = Object.create(BaseService.prototype);
				BoqMainSurchargeUIStandardService.prototype.constructor = BoqMainSurchargeUIStandardService;

				return new BaseService(boqMainSurchargedConfigService.getSurchargeConfig(), boqISurchargeAttributeDomains, boqMainTranslationService);
			}
		]);
})();
