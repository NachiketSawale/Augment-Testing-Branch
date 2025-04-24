/**
 * Created by lav on 7/24/2020.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.cadimportconfig';
	angular.module(moduleName).service('ppsEngineeringCadValidationValidationService', [
		'platformValidationServiceFactory',
		'ppsEngineeringCadValidationDataService',
		function (platformValidationServiceFactory,
				  dataService) {
			var self = this;
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'EngCadValidationDto',
					moduleSubModule: 'ProductionPlanning.CadImportConfig'
				}, {
					mandatory: ['EngCadImportFk', 'RuleId', 'MessageLevel']
				},
				self,
				dataService);
		}]);
})();