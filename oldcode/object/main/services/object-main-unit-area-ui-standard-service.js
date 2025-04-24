(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainUnitAreaUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of unit area entities
	 */
	angular.module(moduleName).factory('objectMainUnitAreaUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'object.main.unitareadetailform',
						version: '1.0.0',
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: [ 'areatypefk', 'quantity', 'uomfk', 'commenttext']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							areatypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectunitareatype'),
							uomfk:{
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-uom-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Uom',
										displayMember: 'Unit'
									},
									width: 100
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-uom-lookup'
								}
							},
							quantity: {
								formatterOptions: {
									decimalPlaces: 4
								},
								editorOptions:{
									decimalPlaces: 4
								}
							}
						}
					};
				}

				var objectMainUnitAreaDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var objectMainUnitAreaAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'UnitAreaDto',
					moduleSubModule: 'Object.Main'
				});
				objectMainUnitAreaAttributeDomains = objectMainUnitAreaAttributeDomains.properties;


				function UnitAreaUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitAreaUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitAreaUIStandardService.prototype.constructor = UnitAreaUIStandardService;

				return new BaseService(objectMainUnitAreaDetailLayout, objectMainUnitAreaAttributeDomains, objectMainTranslationService);
			}
		]);
})();
