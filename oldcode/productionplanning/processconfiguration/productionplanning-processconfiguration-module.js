/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'ProcessTemplateDto', moduleSubModule: 'Productionplanning.ProcessConfiguration'},
							{typeName: 'PhaseTemplateDto',moduleSubModule: 'Productionplanning.ProcessConfiguration'},
							{typeName: 'PhaseReqTemplateDto',moduleSubModule: 'Productionplanning.ProcessConfiguration'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
