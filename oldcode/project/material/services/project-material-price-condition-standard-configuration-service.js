/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'project.material',
		cloudCommonModule = 'cloud.common';
	/**
	 * @ngdoc service
	 * @name projectMaterialPriceConditionLayout
	 * @function
	 *
	 * @description
	 * projectMaterialPriceConditionLayout is the layout service for project material price condition.
	 */
	angular.module(moduleName).value('projectMaterialPriceConditionLayout',
		{
			'addValidationAutomatically': true,
			'groups': [{
				'gid': 'basicData',
				'attributes': ['prcpriceconditiontypefk', 'description', 'value', 'total', 'totaloc', 'ispricecomponent']
			}],
			'translationInfos': {
				'extraModules': ['basics.materialcatalog'],
				'extraWords': {
					PrcPriceConditionTypeFk: {location: cloudCommonModule, identifier: 'priceType', initial: 'Type'},
					Description: {location: cloudCommonModule, identifier: 'priceDescription', initial: 'Description'},
					Value: {location: cloudCommonModule, identifier: 'priceValue', initial: 'Value'},
					Total: {location: cloudCommonModule, identifier: 'priceTotal', initial: 'Total'},
					TotalOc: {location: cloudCommonModule, identifier: 'priceTotalOc', initial: 'TotalOc'},
					IsPriceComponent: {location: cloudCommonModule, identifier: 'priceComponent', initial: 'priceComponent'}
				}
			},
			overloads: {
				'prcpriceconditiontypefk': {
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupField: 'PrcPriceConditionTypeFk',
							lookupDirective: 'procurement-common-price-condition-type-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcpriceconditiontype',
							displayMember: 'DescriptionInfo.Translated'
						}
					}
				}
			}
		}
	);

	angular.module(moduleName).factory('projectPriceConditionStandardConfigurationService', ['platformUIStandardConfigService',
		'projectMaterialTranslationService', 'projectMaterialPriceConditionLayout', 'platformSchemaService',

		function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({ typeName: 'PrjMaterialPriceConditionDto', moduleSubModule: 'Project.Material'});

			function PrjPriceConditionUIStandardService(layout, schema, translateService) {
				BaseService.call(this, layout, schema, translateService);
				this.getStandardConfigForListView().columns[5].width=120;
			}

			PrjPriceConditionUIStandardService.prototype = Object.create(BaseService.prototype);
			PrjPriceConditionUIStandardService.prototype.constructor = PrjPriceConditionUIStandardService;

			return new PrjPriceConditionUIStandardService(layout, domainSchema.properties, translationService);
		}
	]);
})();
