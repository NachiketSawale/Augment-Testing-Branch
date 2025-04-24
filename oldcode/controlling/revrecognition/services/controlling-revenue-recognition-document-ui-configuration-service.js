/*
 * Created by alm on 01.25.2021.
 */

(function (angular) {

	'use strict';
	var moduleName = 'controlling.revrecognition';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('controllingRevenueRecognitionDocumentLayout', [
		function hsqeCheckList2LocationLayout() {
			return {
				fid: 'controlling.RevenueRecognition.document',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'basicData',
						attributes: ['documenttypefk','originfilename','documentdate','description']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				translationInfos: {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						OriginFileName: {location: cloudCommonModule, identifier: 'documentOriginFileName', initial: 'Origin File Name'},
						DocumentDate: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Date'},
						DocumentTypeFk: {location:cloudCommonModule, identifier: 'entityType', initial: 'Type'},
						Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'}
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

	angular.module(moduleName).factory('controllingRevenueRecognitionDocumentUIStandardService',

		['platformUIStandardConfigService', 'controllingRevenueRecognitionTranslationService', 'platformSchemaService', 'controllingRevenueRecognitionDocumentLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, controllingRevenueRecognitionDocumentLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrrDocumentDto',
					moduleSubModule: 'Controlling.RevRecognition'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(controllingRevenueRecognitionDocumentLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, controllingRevenueRecognitionDocumentLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
