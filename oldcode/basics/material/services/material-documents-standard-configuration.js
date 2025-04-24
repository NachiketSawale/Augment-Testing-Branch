(function () {
	'use strict';

	var moduleName = 'basics.material',
		cloudCommonModule = 'cloud.common';

	angular.module(moduleName).value('basicsMaterialDocumentLayout',
		{
			fid: 'basics.material.document.detail',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['documenttypefk', 'description', 'documentdate', 'originfilename']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			translationInfos: {
				'extraModules': ['basics.common'],
				'extraWords': {
					DocumentTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Document Type'},
					Description: {
						location: cloudCommonModule,
						identifier: 'documentDescription',
						initial: 'Description'
					},
					DocumentDate: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Document Date'},
					OriginFileName: {
						location: moduleName,
						identifier: 'documents.materialDocumentName',
						initial: 'Origin File Name'
					}
				}
			},
			overloads: {
				'documenttypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-table-document-type-combobox',
						'options': {
							'eagerLoad': true
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookupdata-table-document-type-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'documentType',
							displayMember: 'Description'
						}
					}
				},
				'originfilename': {
					readonly: true
				}
			}
		}
	);

	angular.module(moduleName).factory('basicsMaterialDocumentStandardConfigurationService',
		['platformUIStandardConfigService', 'basicsMaterialTranslationService',
			'basicsMaterialDocumentLayout', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService,
			          layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MaterialDocumentDto',
					moduleSubModule: 'Basics.Material'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function DocumentUIStandardService(layout, schema, translateService) {
					BaseService.call(this, layout, schema, translateService);
				}

				DocumentUIStandardService.prototype = Object.create(BaseService.prototype);
				DocumentUIStandardService.prototype.constructor = DocumentUIStandardService;

				return new DocumentUIStandardService(layout, domainSchema, translationService);
			}
		]);
})();
