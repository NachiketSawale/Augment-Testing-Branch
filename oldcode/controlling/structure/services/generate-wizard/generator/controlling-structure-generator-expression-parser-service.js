/**
 * Created by janas on 04.07.2018.
 */

(function () {
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureGeneratorExpressionParserService
	 * @function
	 *
	 * @description
	 * expression parser used to convert
	 */
	controllingStructureModule.factory('controllingStructureGeneratorExpressionParserService', ['_',
		function (_) {
			return {
				/**
				 * Extracts all expressions and returns an array containing expressions or literals
				 * @param template
				 * @returns {Array}
				 * @example
				 * var template = '[P(1-4)][*]-[CUG{DIS}(1-4)][*]-[L(1-2)]';
				 * var result_array = extractExpr(template);
				 * // result_array:
				 * // [{expr: "P(1-4)"}, {expr: "*"}, "-", {expr: "CUG{DIS}(1-4)"}, {expr: "*"}, "-", {expr: "L(1-2)"}]
				 */
				extractExpr: function extractExpr(template) {
					// TODO: change function name into 'parse*'
					var exprs = [];

					// generate expressions and state
					var buffer = '',
						state = 'noExpr', // initial state
						actions = {
							addStr: function () { if (buffer.length > 0) { exprs.push(buffer); buffer = ''; } },
							addExpr: function () { if (buffer.length > 0) { exprs.push({expr: buffer}); buffer = ''; } }
						},
						states = {
							'noExpr': function (s) {
								if (s === '[') { state = 'Expr'; actions.addStr(); return true; }
								buffer += s;
							},
							'Expr': function (s) {
								if (s === ']') { state = 'noExpr'; actions.addExpr(); return true; }
								buffer += s;
							}
						};

					_.each(template, function (s) {
						states[state](s);
					});

					actions.addStr(); // flush

					return exprs;
				},
				extendExpressions: function extendExpressions(expressions) {
					// process expressions: "P(1-4)" => extract substart, subend, ...
					return _.each(expressions, function process(expr) {
						if (expr && expr.expr && expr.expr !== '*') {

							// remove all whitespaces
							expr.expr = expr.expr.replace(/\s/g, '');

							var groups = expr.expr.match(/(\w+)(\{(\w+)\})?\((([,]?(\d+-\d+|\d+|\d+\/|\d+\/\d+))+)\)/);
							if (groups && groups.length === 7) {
								if (groups[2] || groups[3]) { // is sub?
									expr.entitySub = groups[3];
									expr.entitySubIndex = 0;
								}
								expr.entityName = groups[1];
								// P(1-4, 6-7) -> [{start:1, end:4}, {start:6, end:7}]
								expr.subStrList = groups[4].split(',');
							}
						}
					});
				},
				parse: function parse(template) {
					return this.extendExpressions(this.extractExpr(template));
				}
			};

		}]);
})();
