(function () {
	'use strict';
	/* global angular */

	const moduleName = 'productionplanning.drawing';

	/**
	 * @ngdoc service
	 * @name productionplanningDrawingSkillValidationService
	 * @description provides validation methods for drawing type entities
	 */
	angular.module(moduleName).service('productionplanningDrawingSkillValidationService', ValidationService);

	ValidationService.$inject = ['platformValidationServiceFactory', 'productionplanningDrawingSkillDataService'];

	/* jshint -W040 */ // remove the warning that possible strict voilation
	function ValidationService(platformValidationServiceFactory, dataService) {
		let self = this;
		let schemeInfo = {typeName: 'EngDrawingSkillDto', moduleSubModule: 'ProductionPlanning.Drawing'};
		let specification = {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(schemeInfo)
		};

		platformValidationServiceFactory.addValidationServiceInterface(schemeInfo, specification, self, dataService);
	}

})(angular);