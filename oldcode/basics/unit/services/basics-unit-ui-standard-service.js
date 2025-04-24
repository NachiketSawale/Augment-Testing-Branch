(function (angular) {
	'use strict';
	var moduleName = 'basics.unit';
	/**
	 * @ngdoc service
	 * @name basicsUnitUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of unit entities
	 */
	angular.module(moduleName).factory('basicsUnitUIStandardService',

		['platformUIStandardConfigService', 'basicsUnitTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'basicsCommonCodeDescriptionSettingsService',

			function (platformUIStandardConfigService, basicsUnitTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, basicsCommonCodeDescriptionSettingsService) {

				function createMainDetailLayout() {
					var settings = basicsCommonCodeDescriptionSettingsService.getSettings([{
						typeName: 'UomEntity',
						modul: 'Basics.Unit'
					}]);
					return {
						fid: 'basics.unit.unitdetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						'groups': [
							{
								gid: 'baseGroup',
								attributes: ['unitinfo', 'roundingprecision', 'descriptioninfo', 'uomtypefk', 'islive', 'isocode']
							},
							{
								gid: 'convGroup',
								attributes: ['lengthdimension', 'timedimension', 'massdimension', 'isbase', 'factor'],
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							unitinfo: {
								detail: {
									maxLength: settings[0].codeLength
								},
								grid: {
									maxLength: settings[0].codeLength
								}
							},
							uomtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.units.uomType'),
							factor: {
								formatterOptions: {
									decimalPlaces: 13
								},
								editorOptions:{
									decimalPlaces: 13
								}
							}
						}
					};
				}

				var unitDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var unitUoMAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'UomDto',
					moduleSubModule: 'Basics.Unit'
				});
				unitUoMAttributeDomains = unitUoMAttributeDomains.properties;


				function UnitUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitUIStandardService.prototype.constructor = UnitUIStandardService;

				var service = new BaseService(unitDetailLayout, unitUoMAttributeDomains, basicsUnitTranslationService);

				return service;
			}
		]);
})(angular);
