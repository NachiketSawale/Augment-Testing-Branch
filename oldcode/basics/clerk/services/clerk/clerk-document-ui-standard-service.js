/**
 * Created by pel on 3/21/2019.
 */

(function (angular) {
	'use strict';
	var modName = 'basics.clerk';
	angular.module(modName).factory('clerkDocumentLayout',[
		function () {
			return {
				'fid': 'clerk.document',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['documenttypefk','clerkdocumenttypefk','originfilename','documentdate','description']
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
					'clerkdocumenttypefk':{
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'clerk-document-type-combobox'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'clerkDocumentType', 'displayMember': 'DescriptionInfo.Translated'},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'clerk-document-type-combobox',
								'descriptionMember': 'DescriptionInfo.Description'
							}
						}
					},
					'originfilename': {
						readonly: true
					}
				}
			};
		}]);

	angular.module(modName).factory('clerkDocumentUIStandardService',
		['platformUIStandardConfigService', 'basicsClerkTranslationService', 'clerkDocumentLayout', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache( {
					typeName: 'Clerk2documentDto',
					moduleSubModule:'Basics.Clerk'
				} );
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				return new BaseService(layout, domainSchema, translationService);
			}
		]);

})(angular);

