/*
 * Created by alm on 08.24.2020.
 */

(function (angular) {
	'use strict';
	/*global angular,globals*/
	var moduleName = 'basics.taxcode';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						platformSchemaService.initialize();

						return platformSchemaService.getSchemas([
							{typeName: 'MdcTaxCodeDto', moduleSubModule: 'Basics.TaxCode'},
							{typeName: 'MdcTaxCodeMatrixDto', moduleSubModule: 'Basics.TaxCode'}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);
})(angular);
