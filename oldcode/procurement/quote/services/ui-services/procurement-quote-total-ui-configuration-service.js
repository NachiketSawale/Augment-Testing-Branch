(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name basicsMaterialDocumentUIConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('procurementQuoteTotalUIConfigurationService', [
		'platformUIStandardConfigService', 'platformSchemaService', 'procurementQuoteTranslationService', 'platformUIStandardExtentService',
		function (BaseService, platformSchemaService, translationService, platformUIStandardExtentService) {

			var layout = {
				fid: 'procurement.quote.header.detail',
				version: '1.0.0',
				showGrouping: true,
				'addValidationAutomatically': true,
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['totaltypefk', 'valuenet', 'valuetax', 'gross', 'valuenetoc', 'valuetaxoc', 'grossoc', 'commenttext']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				overloads: {
					totaltypefk: {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-procurement-configuration-total-type-combobox',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									readonly: true
								}
							}
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcTotalType',
								displayMember: 'Code'
							},
							width: 135
						}
					}
				},
				'addition': {
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'TotalTypeFk',
							name$tr$: 'procurement.common.totalTypeDes',
							displayMember: 'DescriptionInfo.Translated',
							width: 125
						}]
				}
			};

			var schema = platformSchemaService.getSchemaFromCache(
				{typeName: 'ReqTotalDto', moduleSubModule: 'Procurement.Requisition'}
			);

			var service = new BaseService(layout, schema.properties, translationService);
			platformUIStandardExtentService.extend(service, layout.addition, schema.properties);
			return service;
		}
	]);
})(angular);

