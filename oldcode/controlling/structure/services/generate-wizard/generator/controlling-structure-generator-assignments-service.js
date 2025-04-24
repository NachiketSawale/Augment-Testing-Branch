/**
 * Created by janas on 22.01.2016.
 */

(function () {
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureGeneratorAssignmentsService
	 * @function
	 *
	 * @description
	 * controllingStructureGeneratorAssignmentsService assigns Assignment01-10 to controlling units based on code templates
	 */
	controllingStructureModule.factory('controllingStructureGeneratorAssignmentsService', ['_', 'controllingStructureGeneratorService', 'controllingStructureGeneratorMetadataService',
		function (_, generatorService, generatorMetadataService) {

			var service = {};

			function evalueAssignment(assignment, context) {
				// "[CUG{DIS}(1-4)][*][L(1-2)]-YXC" => ["[CUG{DIS}(1-4)]", "[L(1-2)]-YXC"] => [[exprObj], [exprObj, exprObj]]
				var levelExpressions = _.map(assignment.split('[*]'), generatorService.parseTemplate);

				// check level for context related expressions
				var relatedExpressions = _.flatten(_.filter(levelExpressions, function (levelExpressionArray) {
					return _.some(levelExpressionArray, function (exp) {
						var predicate = _.pickBy({
							'entityName': exp.entityName,
							'entitySub': exp.entitySub
						}, _.identity);

						return (_.some(context, predicate) && !_.isEmpty(predicate)) ||
							_.isString(exp) ||
							generatorMetadataService.isConstant(exp) ||
							generatorMetadataService.isCustom(exp);
					});
				}));

				return _.map(relatedExpressions, function (e) {
					return _.isString(e) ? e : generatorMetadataService.resolveExpression(e, context);
				}).join('');
			}

			service.extendAssignments = function (controllingUnitTemplate, cunit) {
				// evaluate expression and assign to unit
				var assignments = [
					'Assignment01', 'Assignment02', 'Assignment03', 'Assignment04', 'Assignment05',
					'Assignment06', 'Assignment07', 'Assignment08', 'Assignment09', 'Assignment10'
				];

				_.each(assignments, function (a) {
					var assignVal = controllingUnitTemplate[a];
					cunit[a] = _.isString(assignVal) ? evalueAssignment(assignVal, cunit.__context) : '';
				});
			};

			return service;
		}]);
})();
