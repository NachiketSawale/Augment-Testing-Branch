/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'controlling.common';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			let options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'ConControllingTotalDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'PesControllingTotalDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'ControllingActualsSubTotalDto', moduleSubModule: 'Controlling.Actuals'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
