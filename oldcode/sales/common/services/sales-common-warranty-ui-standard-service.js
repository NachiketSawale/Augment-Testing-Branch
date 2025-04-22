/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.common';
	angular.module(moduleName).factory('salesCommonWarrantyLayout', [
		function () {
			return {
				fid: 'procurement.common.Warranty.detail',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [{
					gid: 'basicData',
					attributes: ['baswarrantysecurityfk', 'baswarrantyobligationfk', 'description', 'handoverdate', 'durationmonths', 'warrantyenddate', 'commenttext',
						'userdefinedtext1', 'userdefinedtext2', 'userdefinedtext3', 'userdefinedtext4', 'userdefinedtext5',
						'userdefineddate1', 'userdefineddate2', 'userdefineddate3', 'userdefineddate4', 'userdefineddate5',
						'userdefinednumber1', 'userdefinednumber2', 'userdefinednumber3', 'userdefinednumber4', 'userdefinednumber5']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					baswarrantysecurityfk: {
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-warranty-security-combobox',
							'options': {
								'lookupDirective': 'procurement-common-warranty-security-combobox',
								'descriptionMember': 'DescriptionInfo.Description'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: { directive: 'procurement-common-warranty-security-combobox' },
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'WarrantySecurity',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					baswarrantyobligationfk: {
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-warranty-obligation-combobox',
							'options': {
								'lookupDirective': 'procurement-common-warranty-obligation-combobox',
								'descriptionMember': 'DescriptionInfo.Description'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: { directive: 'procurement-common-warranty-obligation-combobox' },
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'WarrantyObligation', 'displayMember': 'DescriptionInfo.Translated'}
						}
					}
				}
			};
		}
	]);

	angular.module(moduleName).factory('salesCommonWarrantyUIStandardService', [
		'platformUIStandardConfigService',
		'salesCommonTranslationService',
		'salesCommonWarrantyLayout',
		'platformSchemaService',
		function (
			platformUIStandardConfigService,
			salesCommonTranslationService,
			salesCommonWarrantyLayout,
			platformSchemaService
		) {
			function constructor(schemaOption) {
				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache(schemaOption);
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				var service = new BaseService(salesCommonWarrantyLayout, domainSchema, salesCommonTranslationService);

				return service;
			}

			return constructor;
		}]
	);
})(angular);