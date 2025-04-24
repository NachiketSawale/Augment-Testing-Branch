/**
 * Created by lav on 8/9/2019.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).service('ppsCadToMaterialValidationService', [
		'platformValidationServiceFactory',
		'ppsCadToMaterialDataService',
		function (platformValidationServiceFactory,
				  dataService) {
			var self = this;
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'PpsCad2mdcMaterialDto',
					moduleSubModule: 'ProductionPlanning.PpsMaterial'
				}, {
					mandatory: ['MdcMaterialFk']
				},
				self,
				dataService);
		}]);
})();