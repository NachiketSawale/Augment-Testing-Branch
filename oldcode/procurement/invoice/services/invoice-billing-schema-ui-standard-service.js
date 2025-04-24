(function(angular){
	'use strict';

	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module(moduleName).factory('procurementInvoiceBillingSchemaUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementCommonBillingSchemaLayout', 'platformSchemaService', 'platformUIStandardExtentService', '$injector',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService, $injector) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvBillingSchemaDto',
					moduleSubModule: 'Procurement.Invoice'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				layout.overloads.controllingunitfk.grid.editorOptions.lookupDirective ='controlling-structure-dialog-lookup';
				layout.overloads.controllingunitfk.grid.editorOptions.lookupOptions ={
					'filterKey': 'prc-invoice-controlling-unit-filter',
					'showClearButton': true,
					selectableCallback: function (dataItem) {
						return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
					}
				};

				layout.overloads.controllingunitfk.detail.options.lookupDirective ='controlling-structure-dialog-lookup';
				layout.overloads.controllingunitfk.detail.options.lookupOptions ={
					'filterKey': 'prc-invoice-controlling-unit-filter',
					'showClearButton': true,
					selectableCallback: function (dataItem) {
						return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
					}
				};
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				// disable sort.
				_.forEach(service.getStandardConfigForListView().columns,function(column){
					column.sortable = false;
				});

				return service;
			}
		]);
})(angular);