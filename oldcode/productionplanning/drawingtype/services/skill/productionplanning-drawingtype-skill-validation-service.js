(function () {
	'use strict';
	/* global angular */

	const moduleName = 'productionplanning.drawingtype';

	/**
	 * @ngdoc service
	 * @name productionPlanningDrawingTypeSkillValidationService
	 * @description provides validation methods for drawing type entities
	 */
	angular.module(moduleName).service('productionPlanningDrawingTypeSkillValidationService', ValidationService);

	ValidationService.$inject = ['platformValidationServiceFactory', 'productionPlanningDrawingTypeConstantValues', 'productionPlanningDrawingTypeSkillDataService'];

	/* jshint -W040 */ // remove the warning that possible strict voilation
	function ValidationService(platformValidationServiceFactory, constantValues, dataService) {
		let self = this;
		let schemeInfo = constantValues.schemes.drawingTypeSkill;
		let specification = {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(schemeInfo)
		};

		platformValidationServiceFactory.addValidationServiceInterface(schemeInfo, specification, self, dataService);
	}

})(angular);