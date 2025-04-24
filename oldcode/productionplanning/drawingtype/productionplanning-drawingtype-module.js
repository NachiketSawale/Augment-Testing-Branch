/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global angular, globals */
	const moduleName = 'productionplanning.drawingtype';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			const options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'productionPlanningDrawingTypeConstantValues', function (platformSchemaService, constantValues) {
						return platformSchemaService.getSchemas([
							constantValues.schemes.drawingType,
							constantValues.schemes.drawingTypeSkill
						]);
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'basics.customize']);
					}],
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
