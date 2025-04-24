/**
 * Created by pel on 3/22/2019.
 */

(function (angular) {
	'use strict';
	var modName = 'basics.procurementconfiguration';
	angular.module(modName)
		.factory('basicsProcurementConfigurationRfqDocumentsLayout',
			['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'basics.procurementconfiguration.rfqdocument',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['basrubricfk','prcdocumenttypefk', 'prjdocumenttypefk', 'basclerkdocumenttypefk', 'slsdocumenttypefk']
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							BasRubricFk: {
								location: modName, identifier: 'entityBasRubricFk', initial: 'Module'
							},
							PrcDocumenttypeFk: {
								location: modName, identifier: 'entityPrcDocumenttypeFk', initial: 'Procurement Document Type'
							},
							PrjDocumenttypeFk: {
								location: modName, identifier: 'entityPrjDocumenttypeFk', initial: 'Project Document Type'
							},
							BasClerkdocumenttypeFk: {
								location: modName, identifier: 'entityBasClerkdocumenttypeFk', initial: 'Clerk Document Type'
							},
							SlsDocumenttypeFk: {
								location: modName, identifier: 'entitySalesDocumenttypeFk', initial: 'Sales Document Type'
							}
						}
					},
					'overloads': {
						'basrubricfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-procurement-configuration-rubric-combobox',
								'options': {
									filterKey: 'rfq-rubric-filter'
								}
							},
							'grid': {
								readonly: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Rubric',
									displayMember: 'Description'
								},
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-procurement-configuration-rubric-combobox',
									lookupOptions: {
										filterKey: 'rfq-rubric-filter',
										displayMember: 'Description'
									}
								}
							}
						},
						'prcdocumenttypefk':{
							'detail': {
								'type': 'directive',
								'directive': 'procurement-common-document-type-combobox'
							},
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'procurement-common-document-type-combobox'
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'prcdocumenttype', 'displayMember': 'DescriptionInfo.Translated'},
								'width': 140
							}
						},
						'prjdocumenttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('documents.project.documenttype'),
						'basclerkdocumenttypefk':{
							'detail': {
								'type': 'directive',
								'directive': 'clerk-document-type-combobox'
							},
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'clerk-document-type-combobox'
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'clerkDocumentType', 'displayMember': 'DescriptionInfo.Translated'},
								'width': 120
							}

						},
						'slsdocumenttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salesdocumenttype')
					}
				};
			}])
		.factory('basicsProcurementConfigurationRfqDocumentsUIService',
			['platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfigurationRfqDocumentsLayout', 'platformSchemaService','platformUIStandardExtentService',
				function (platformUIStandardConfigService, translationService,
					layout, platformSchemaService,platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfig2documentDto',
						moduleSubModule: 'Basics.ProcurementConfiguration'
					});
					if (domainSchema) {
						domainSchema = domainSchema.properties;
					}
					function UIStandardService(layout, scheme, translateService) {
						BaseService.call(this, layout, scheme, translateService);
					}

					UIStandardService.prototype = Object.create(BaseService.prototype);
					UIStandardService.prototype.constructor = UIStandardService;

					var service = new BaseService(layout, domainSchema, translationService);
					platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

					return service;
				}
			]);
})(angular);