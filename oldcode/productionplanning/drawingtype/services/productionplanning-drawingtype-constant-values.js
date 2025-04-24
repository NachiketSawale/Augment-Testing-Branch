/**
 * Created by zwz on 2022/03/02
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.drawingtype';

	/**
	 * @ngdoc service
	 * @name productionPlanningDrawingTypeConstantValues
	 * @function
	 *
	 * @description
	 * productionPlanningDrawingTypeConstantValues provides definitions and constants frequently used in productionplanning drawingtype module
	 */
	angular.module(moduleName).value('productionPlanningDrawingTypeConstantValues', {
		schemes: {
			drawingType: {typeName: 'EngDrawingTypeDto', moduleSubModule: 'ProductionPlanning.DrawingType'},
			drawingTypeSkill: {typeName: 'EngDrawingTypeSkillDto', moduleSubModule: 'ProductionPlanning.DrawingType'},
		},
		uuid: {
			container: {
				drawingTypeList: '1f1a4316f0fc4c81a8c9a070b9de7009',
				drawingTypeDetails: 'a5258fb9a56b465da880aacffe345158',
				drawingTypeSkillList: '29468739bb844a8db199cdb937a33632',
				drawingTypeSkillDetails: 'bf7fe88155d740fba56d668f6ff0b5d7',

			}
		}
	});
})(angular);
