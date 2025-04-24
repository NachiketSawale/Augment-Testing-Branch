/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	const moduleName = 'productionplanning.ppscostcodes';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			const options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'ppsCostCodesConstantValues',
						function (platformSchemaService, ppsCostCodesConstantValues) {
							return platformSchemaService.getSchemas([
								ppsCostCodesConstantValues.schemes.mdcCostCode,
								ppsCostCodesConstantValues.schemes.ppsCostCode,
								ppsCostCodesConstantValues.schemes.costCodeNew,
							]);
						}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
