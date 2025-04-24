/**
 * Created by alm on 1/25/2022.
 */

(function () {
	'use strict';
	var moduleName = 'procurement.invoice';
	var cloudCommonModule = 'cloud.common';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementInvoiceAccrualLayout', ['procurementCommonAccrualLayoutService',
		function procurementInvoiceAccrualLayout(procurementCommonAccrualLayoutService) {

			return {
				fid: 'procurement.invoice.accrualForm',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['dateeffective', 'bascompanytransactionfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						DateEffective: {
							location: moduleName,
							identifier: 'entityDateEffective',
							initial: 'Date Effective'
						},
						BasCompanyTransactionFk: {
							location: moduleName,
							identifier: 'entityCompanyTransactionFk',
							initial: 'Company Transaction'
						}
					}
				},
				'overloads': {
					'dateeffective': {
						'readonly': true,
						'detail':{
							'type': 'dateutc',
							'formatter': 'dateutc'
						},
						'grid':{
							'editor': 'dateutc',
							'formatter': 'dateutc'
						}
					},
					'bascompanytransactionfk': {
						readonly: true,
						width: 120
					}
				},
				'addition': procurementCommonAccrualLayoutService.addition()
			};
		}
	]);

	angular.module(moduleName).factory('procurementInvoiceAccrualUIStandardService',

		['platformUIStandardConfigService', 'procurementInvoiceTranslationService', 'platformSchemaService', 'procurementInvoiceAccrualLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, procurementInvoiceAccrualLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvAccrualDto',
					moduleSubModule: 'Procurement.Invoice'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(procurementInvoiceAccrualLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, procurementInvoiceAccrualLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
