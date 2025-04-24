/**
 * Created by lvy on 3/21/2019.
 */
(function () {
	'use strict';
	var modName = 'basics.procurementconfiguration';
	var cloudCommonModule = 'cloud.common';
	angular.module(modName)
		.factory('basicsProcurementConfigurationRfqReportsLayout',
			['basicsLookupdataConfigGenerator', function () {
				return {
					'fid': 'basics.procurementconfiguration.rfqcoverletteroremailbody',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['basreportfk', 'isdefault','isnotperso']
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							BasReportFk: {
								location: modName, identifier: 'entityBasReportFk', initial: 'Report Name'
							},
							IsMandatory: {
								location: modName, identifier: 'entityIsMandatory', initial: 'Is Mandatory'
							},
							IsDefault: {
								location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'
							},
							IsNotPerSo:{
								location: modName, identifier: 'entityIsNotPerSo', initial: 'Not Personalised'
							}
						}
					},
					'overloads': {
						'basreportfk': {
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-configuration-rfq-reports-dialog',
									descriptionMember: 'Name.Translated',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							grid: {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'basics-configuration-rfq-reports-dialog',
									lookupOptions: {
										showClearButton: true,
										displayMember: 'Name.Translated'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Report',
									displayMember: 'Name.Translated',
									url: {
										getItemByKey: 'basics/reporting/report/getReportsUnderRfqById'
									}
								}
							}
						},
						'ismandatory': {
							width: 80,
							editor: 'boolean',
							formatter: 'boolean',
							cssClass: 'cell-center'
						}
					},
					'addition': {
						grid: [
							{
								'lookupDisplayColumn': true,
								'field': 'BasReportFk',
								'name': 'Text',
								'displayMember': 'Description.Translated',
								'name$tr$': 'cloud.common.entityDescription',
								'width': 100
							},
							{
								'lookupDisplayColumn': true,
								'field': 'BasReportFk',
								'name': 'File Name',
								'displayMember': 'FileName',
								'name$tr$': 'cloud.common.entityReportFileName',
								'width': 100
							},
							{
								'lookupDisplayColumn': true,
								'field': 'BasReportFk',
								'name': 'File Path',
								'displayMember': 'FilePath',
								'name$tr$': 'cloud.common.entityReportFilePath',
								'width': 100
							}
						]
					}
				};
			}])
		.factory('basicsPrcConfigRfqCoverLetterOrEamilBodyUIService',
			['platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfigurationRfqReportsLayout', 'platformSchemaService','platformUIStandardExtentService',
				function (platformUIStandardConfigService, translationService,
					layout, platformSchemaService,platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfig2ReportDto',
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
			])
		.factory('basicsProcurementConfigurationRfqReportsUIService',
			['platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfigurationRfqReportsLayout', 'platformSchemaService','platformUIStandardExtentService',
				function (platformUIStandardConfigService, translationService,
					layout, platformSchemaService,platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfig2ReportDto',
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
					layout.groups[0].attributes.push('ismandatory');

					var service = new BaseService(layout, domainSchema, translationService);
					platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

					return service;
				}
			]);
})();