/*
 * Created by alm on 01.25.2021.
 */

(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklist';
	var cloudCommonModule = 'cloud.common';
	var commonName = 'basics.common';

	angular.module(moduleName).factory('hsqeCheckListDocumentLayout', [
		function hsqeCheckList2LocationLayout() {
			return {
				fid: 'hsqe.checklist.document',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'basicData',
						attributes: ['documenttypefk','originfilename','documentdate','description','commenttext']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				translationInfos: {
					'extraModules': [moduleName, cloudCommonModule, commonName],
					'extraWords': {
						OriginFileName: {location: cloudCommonModule, identifier: 'documentOriginFileName', initial: 'Origin File Name'},
						DocumentDate: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Date'},
						DocumentTypeFk: {location:cloudCommonModule, identifier: 'entityType', initial: 'Type'},
						Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
						CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'}
					}
				},
				overloads: {
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
		}
	]);

	angular.module(moduleName).factory('hsqeCheckListDocumentUIStandardService',

		['platformUIStandardConfigService', 'hsqeCheckListTranslationService', 'platformSchemaService', 'hsqeCheckListDocumentLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, hsqeCheckListDocumentLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'HsqCheckListDocumentDto',
					moduleSubModule: 'Hsqe.CheckList'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(hsqeCheckListDocumentLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, hsqeCheckListDocumentLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
