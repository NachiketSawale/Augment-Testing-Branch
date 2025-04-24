/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'controlling.controllingunittemplate';

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
							{typeName: 'ControltemplateDto', moduleSubModule: 'Controlling.ControllingUnitTemplate'},
							{typeName: 'ControltemplateUnitDto', moduleSubModule: 'Controlling.ControllingUnitTemplate'},
							{typeName: 'ControltemplateGroupDto', moduleSubModule: 'Controlling.ControllingUnitTemplate'},
							{typeName: 'ControllingUnitDto', moduleSubModule: 'Controlling.Structure'} // TODO: for assignments (refactoring of controllingStructureDynamicAssignmentsService needed)
						]);
					}],
					'loadContextData': ['controllingStructureContextService', function (controllingStructureContextService) {
						// init context information like current company, master data context, etc.
						return controllingStructureContextService.init(); // TODO: this service needs to be renamed (=>common or even basics if there is nothing similar)
					}],
					'loadAssignmentData': ['controllingStructureLookupService', function (controllingStructureLookupService) {
						return controllingStructureLookupService.loadAssignmentData();
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
