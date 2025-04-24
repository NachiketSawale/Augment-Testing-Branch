/**
 * Created by pel on 7/9/2019.
 */

(function (angular) {
	'use strict';
	var modName = 'procurement.inventory';
	angular.module(modName).factory('inventoryDocumentLayout',[
		function () {
			return {
				'fid': 'inventory.document',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['description','originfilename','documenttypefk','documentdate']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName],
					'extraWords': {
						'moduleName': {
							'location': modName,
							'identifier': 'moduleName',
							'initial': 'Inventory Header'
						},
						'OriginFileName': {location: modName, identifier: 'document.entityFileArchiveDoc', initial: 'Origin File Name'},
						'DocumentDate': {location: modName, identifier: 'document.entityDate', initial: 'Date'},
						'DocumentTypeFk': {location:modName, identifier: 'document.entityType', initial: 'Type'},
						'Description': {location: modName, identifier: 'document.entityDescription', initial: 'Description'},
					}
				},
				'overloads': {
					'documenttypefk':{
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'basics-lookupdata-table-document-type-combobox'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'documentType', 'displayMember': 'Description'},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-table-document-type-combobox',
								'descriptionMember': 'Description'
							}
						}
					},
					'originfilename': {
						readonly: true
					}
				}
			};
		}]);

	angular.module(modName).factory('inventoryDocumentUIStandardService',
		['platformUIStandardConfigService', 'inventoryDocumentTranslationService', 'inventoryDocumentLayout', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache( {
					typeName: 'PrcInventoryDocumentDto',
					moduleSubModule:'Procurement.Inventory'
				} );
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				return new BaseService(layout, domainSchema, translationService);
			}
		]);

})(angular);

