/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function () {
	'use strict';

	angular.module('awp.main').factory('awpPackageStructureLineItemUIService', [
		'awpMainUIConfigurationService', 'platformUIStandardConfigService', 'awpMainTranslationService',
		function (awpMainUIConfigurationService, platformUIStandardConfigService, awpMainTranslationService) {

			const layout = awpMainUIConfigurationService.getPackageStructureLineItemLayout();
			let attributeDomains = {
				'Code': {
					'domain': 'text'
				},
				'Description': {
					'domain': 'text'
				},
				'Quantity': {
					'domain': 'decimal'
				},
				'WqQuantity': {
					'domain': 'decimal'
				},
				'QuantityTotal': {
					'domain': 'decimal'
				},
				'BasUomFk': {
					'domain': 'integer'
				},
				'PrcStructureFk': {
					'domain': 'integer'
				},
				'UnitRate': {
					'domain': 'decimal'
				},
				'FinalPrice': {
					'domain': 'decimal'
				},
				'GrandCostUnitTarget': {
					'domain': 'decimal'
				},
				'GrandTotal': {
					'domain': 'decimal'
				}
			};

			let BaseService = platformUIStandardConfigService;

			function DashboardUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			DashboardUIStandardService.prototype = Object.create(BaseService.prototype);
			DashboardUIStandardService.prototype.constructor = DashboardUIStandardService;

			return new BaseService(layout, attributeDomains, awpMainTranslationService);
		}
	]);
})(angular);
