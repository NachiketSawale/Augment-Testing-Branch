/**
 * Created by lav on 7/24/2020.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.cadimportconfig';
	angular.module(moduleName).service('ppsEngineeringCadImportConfigValidationService', [
		'platformValidationServiceFactory',
		'ppsEngineeringCadImportConfigDataService',
		function (platformValidationServiceFactory,
				  dataService) {
			var self = this;
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'EngCadImportConfigDto',
					moduleSubModule: 'ProductionPlanning.CadImportConfig'
				}, {
					mandatory: ['EngDrawingTypeFk', 'ImporterKind', 'BaseDirectory', 'MatchPattern', 'MatchPatternType']
				},
				self,
				dataService);
		}]);
})();