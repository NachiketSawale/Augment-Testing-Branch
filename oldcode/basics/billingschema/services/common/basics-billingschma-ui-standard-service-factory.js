/**
 * Created by wed on 5/18/2018.
 */


(function (angular) {

	'use strict';

	angular.module('basics.billingschema').factory('basicsBillingSchemaUIStandardServiceFactory',
		['platformSchemaService', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'basicsBillingSchemaLayoutFactory', 'basicsBillingSchemaTranslateServiceFactory',
			function (platformSchemaService, PlatformUIStandardConfigService, platformUIStandardExtentService, basicsBillingSchemaLayoutFactory, basicsBillingSchemaTranslateServiceFactory) {

				function getUIStandardService(qualifier, customLayout, translateService) {

					var layout = basicsBillingSchemaLayoutFactory.getLayout(qualifier, customLayout);

					var billingSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'CommonBillingSchemaDto',
						moduleSubModule: 'Basics.BillingSchema'
					});
					if (billingSchema) {
						billingSchema = billingSchema.properties;
					}
					if (qualifier === 'procurement.pes.billingschmema' || qualifier === 'procurement.contract.billingschmema') {
						layout.overloads.controllingunitfk.grid.editorOptions.lookupDirective = 'controlling-structure-dialog-lookup';
						layout.overloads.controllingunitfk.grid.editorOptions.lookupOptions = {
							'filterKey': 'basics-billings-controlling-unit-filter',
							'showClearButton': true
						};

						layout.overloads.controllingunitfk.detail.options.lookupDirective = 'controlling-structure-dialog-lookup';
						layout.overloads.controllingunitfk.detail.options.lookupOptions = {
							'filterKey': 'basics-billings-controlling-unit-filter',
							'showClearButton': true
						};
					}

					var service = new PlatformUIStandardConfigService(layout, billingSchema, translateService || basicsBillingSchemaTranslateServiceFactory.getService(qualifier, layout));

					if (layout.addition) {
						platformUIStandardExtentService.extend(service, layout.addition, billingSchema);
					}
					return service;
				}

				return {
					getUIStandardService: getUIStandardService
				};

			}]);

})(angular);

