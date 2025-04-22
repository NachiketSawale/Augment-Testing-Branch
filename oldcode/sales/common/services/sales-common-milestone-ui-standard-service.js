/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';

	var moduleName = 'sales.common';
	angular.module(moduleName).factory('salesCommonMilestoneLayout', [
		function () {
			return {
				fid: 'procurement.common.mileston.detail',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [{
					gid: 'basicData',
					attributes: ['salesdatekindfk', 'salesdatetypefk', 'description', 'milestonedate', 'mdctaxcodefk', 'amount', 'commenttext',
						'userdefinedtext1', 'userdefinedtext2', 'userdefinedtext3', 'userdefinedtext4', 'userdefinedtext5',
						'userdefineddate1', 'userdefineddate2', 'userdefineddate3', 'userdefineddate4', 'userdefineddate5',
						'userdefinednumber1', 'userdefinednumber2', 'userdefinednumber3', 'userdefinednumber4', 'userdefinednumber5']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					salesdatekindfk: {
						detail: {
							type: 'directive',
							directive: 'sales-common-sales-date-kind-combobox',
							options: {
								lookupDirective: 'sales-common-sales-date-kind-combobox',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: { directive: 'sales-common-sales-date-kind-combobox' },
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesDateKind',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					salesdatetypefk: {
						detail: {
							type: 'directive',
							directive: 'sales-common-sales-date-type-combobox',
							options: {
								lookupDirective: 'sales-common-sales-date-type-combobox',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: { directive: 'sales-common-sales-date-type-combobox' },
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesDateType',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					mdctaxcodefk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TaxCode',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupField: 'MdcTaxCodeFk',
								lookupOptions: {
									showClearButton: true
								},
								directive: 'basics-master-data-context-tax-code-lookup'
							},
							width: 100
						}
					}
				}
			};
		}
	]);

	angular.module(moduleName).factory('salesCommonMilestoneUIStandardService', [
		'platformUIStandardConfigService',
		'salesCommonTranslationService',
		'salesCommonMilestoneLayout',
		'platformSchemaService',
		function (
			platformUIStandardConfigService,
			salesCommonTranslationService,
			salesCommonMilestoneLayout,
			platformSchemaService
		) {
			function constructor(schemaOption) {
				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache(schemaOption);
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				var service = new BaseService(salesCommonMilestoneLayout, domainSchema, salesCommonTranslationService);

				return service;
			}

			return constructor;
		}]
	);
})();