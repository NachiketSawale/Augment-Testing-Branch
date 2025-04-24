/**
 * Created by chk on 4/5/2016.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var modName = 'procurement.invoice';
	var packageMod='procurement.package';
	angular.module(modName).factory('procurementInvoiceImportResultLayout', ['procurementPackageLookUpItems',
		function (procurementPackageLookUpItems) {
			return {
				'fid': 'procurement.invoice.import.result.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['status','errormessage','log']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [packageMod],
					'extraWords': {
						Status: {
							location: packageMod,
							identifier: 'import.status',
							initial: 'Status'
						},
						ErrorMessage: {
							location: packageMod,
							identifier: 'import.errorMessage',
							initial: 'Error Message'
						},
						Log: {
							location: packageMod,
							identifier: 'import.log',
							initial: 'Log'
						}
					}
				},
				'overloads': {
					'errormessage': {
						'readonly': true
					},
					'status': {
						'readonly': true,
						'detail': {
							options: {
								displayMember: 'Description',
								valueMember: 'Id',
								items: procurementPackageLookUpItems.importStatusItems
							}
						},
						'grid': {
							formatter: function (row, cell, value) {
								var selectItem = _.find(procurementPackageLookUpItems.importStatusItems, {Id: value});
								return selectItem ? selectItem.Description : '';
							}
							/* editorOptions: {
							 displayMember: 'Description',
							 valueMember: 'Id',
							 items: procurementPackageLookUpItems.importStatusItems
							 } */
						}
					},
					'log': {
						'readonly': true
					}
				}
			};
		}]);

	angular.module(modName).factory('procurementInvoiceImportResultUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService', 'procurementInvoiceImportResultLayout', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvInvoiceImportDto',
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

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})();