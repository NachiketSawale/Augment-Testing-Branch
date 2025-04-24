(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainProspectChangeUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of prospect change entities
	 */
	angular.module(moduleName).factory('objectMainProspectChangeUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {

						'fid': 'object.main.prospectchangedetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['description', 'pricelistdetailfk', 'uomfk', 'specification', 'quantity', 'unitprice', 'date']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							pricelistdetailfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('object.main.pricelistdetail'),
							'uomfk':{
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'basics-lookupdata-uom-lookup'
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'Uom',
										'displayMember': 'Unit'
									},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-uom-lookup'
								}
							}
						}
					};
				}

				var objectMainProspectChangeDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var objectMainProspectChangeAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ProspectChangeDto',
					moduleSubModule: 'Object.Main'
				});

				objectMainProspectChangeAttributeDomains = objectMainProspectChangeAttributeDomains.properties;


				function ProspectChangeUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProspectChangeUIStandardService.prototype = Object.create(BaseService.prototype);
				ProspectChangeUIStandardService.prototype.constructor = ProspectChangeUIStandardService;

				return new BaseService(objectMainProspectChangeDetailLayout, objectMainProspectChangeAttributeDomains, objectMainTranslationService);
			}
		]);
})();
