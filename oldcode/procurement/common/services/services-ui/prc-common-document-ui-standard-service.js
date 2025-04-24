(function () {
	'use strict';
	var modName = 'procurement.common';

	angular.module(modName).factory('procurementCommonDocumentLayout',['documentsProjectDocumentDataService','documentsProjectDocumentModuleContext','basicsLookupdataConfigGenerator',function (documentsProjectDocumentDataService, documentsProjectDocumentModuleContext,basicsLookupdataConfigGenerator) {

		return {
			'fid': 'requisition.subcontractor.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'translationInfos': {
				'extraModules': [modName, 'basics.common'],
				'extraWords': {
					'DocumentTypeFk': {
						'location': modName,
						'identifier': 'document.prcFileType',
						'initial': 'File Type'
					},
					'PrcDocumentTypeFk': {
						'location': modName,
						'identifier': 'document.prcDocumentType',
						'initial': 'Document Type'
					},
					'Description': {
						'location': modName,
						'identifier': 'documentDescription',
						'initial': 'Description'
					},
					'DocumentDate': {
						'location': modName,
						'identifier': 'entityDate',
						'initial': 'Date'
					},
					'OriginFileName': {
						'location': modName,
						'identifier': 'documentOriginFileName',
						'initial': 'Origin File Name'
					},	Url: {
						location: modName, identifier: 'entityUrl', initial: 'Url'
					},
					PrcDocumentStatusFk:{
						location: modName, identifier: 'entityPrcDocumentStatusFk', initial: 'Status'
					},
					FileSize: {
						location: modName,
						identifier: 'entityFileSize',
						initial: 'File Size'
					}
				}
			},
			'groups': [{
				'gid': 'baseGroup',
				'attributes': ['documenttypefk', 'prcdocumenttypefk', 'description', 'documentdate', 'originfilename','url','prcdocumentstatusfk','filesize']
			}, {'gid': 'entityHistory', isHistory: true}],
			'overloads': {
				'documenttypefk': {
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
				'prcdocumenttypefk': {
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							directive: 'procurement-common-document-type-combobox'
						},
						'formatter': 'lookup',
						'formatterOptions': {'lookupType': 'prcdocumenttype', 'displayMember': 'DescriptionInfo.Translated'},
						'width': 120
					},
					'detail': {
						'type': 'directive',
						'directive': 'procurement-common-document-type-combobox',
						'options': {
							'lookupDirective': 'procurement-common-document-type-combobox',
							'descriptionMember': 'DescriptionInfo.Description'
						}
					}
				},
				'originfilename': {
					readonly: true
				},
				'filesize': {
					readonly: true
				},
				'url': {
					'maxLength': 2000,
					grid: {
						editor: 'url',
						formatter: 'url',
						formatterOptions: {
							dataServiceName: documentsProjectDocumentDataService.getService(documentsProjectDocumentModuleContext.getConfig())
						},
						bulkSupport: false
					}
				},
				'prcdocumentstatusfk':basicsLookupdataConfigGenerator.provideReadOnlyConfig('prc.common.documentstatus', null, {
					showIcon: true
				})
			},
			'addition': {
				'grid': [],
				'detail': []
			}
		};
	}
	]);

	angular.module(modName).factory('procurementCommonDocumentUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonDocumentLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcDocumentDto',
					moduleSubModule: 'Procurement.Common'
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

				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function () {
					return angular.copy(basicGetStandardConfigForDetailView());
				};

				return service;
			}
		]);
})();
