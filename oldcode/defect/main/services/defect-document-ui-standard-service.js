/*
 Create by alm on 4/27/2017
 */
/* global */
(function (angular) {
	'use strict';
	var modName = 'defect.main';
	angular.module(modName).factory('defectDocumentLayout',[
		function () {
			return {
				'fid': 'defect.document',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['documenttypefk','dfmdocumenttypefk','originfilename','documentdate','description']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
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
					'dfmdocumenttypefk':{
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'defect-document-type-combobox'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'defectDocumentType', 'displayMember': 'Description'},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'defect-document-type-combobox',
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

	angular.module(modName).factory('defectDocumentUIStandardService',
		['platformUIStandardConfigService', 'defectTranslationService', 'defectDocumentLayout', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache( {
					typeName: 'DfmDocumentDto',
					moduleSubModule:'Defect.Main'
				} );
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				return new BaseService(layout, domainSchema, translationService);
			}
		]);

})(angular);
