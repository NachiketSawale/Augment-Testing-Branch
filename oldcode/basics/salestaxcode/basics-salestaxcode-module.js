/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/*global angular,globals*/
	var moduleName = 'basics.salestaxcode';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'controller': 'basicsSalesTaxCodeController',
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'MdcSalesTaxCodeDto', moduleSubModule: 'Basics.SalesTaxCode'},
							{typeName: 'MdcSalesTaxMatrixDto', moduleSubModule: 'Basics.SalesTaxCode'}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
