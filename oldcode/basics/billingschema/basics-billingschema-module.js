/**
 * Created by chm on 6/3/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.billingschema';

	angular.module(moduleName, ['ui.router', 'platform']);
	// eslint-disable-next-line no-undef
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {

				var options = {
					'moduleName': moduleName,
					'controller':'basicsBillingSchemaController',
					'resolve': {
						'loadDomains': ['platformSchemaService', function(platformSchemaService){

							var moduleSubModule = 'Basics.BillingSchema';

							platformSchemaService.initialize();
							return platformSchemaService.getSchemas( [
								{ typeName: 'BillingSchemaDto', moduleSubModule: moduleSubModule},
								{ typeName: 'BillingSchemaDetailDto', moduleSubModule: moduleSubModule},
								{ typeName: 'RubricCategoryTreeItemDto', moduleSubModule: moduleSubModule}
							] );
						}	]
					}
				};

				mainViewServiceProvider.registerModule(options);
			}
		]);

})(angular);