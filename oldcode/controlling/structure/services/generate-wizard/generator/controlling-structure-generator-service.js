/**
 * Created by janas on 14.12.2015.
 */

(function () {
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureGeneratorService
	 * @function
	 *
	 * @description
	 * controllingStructureGeneratorService generate controlling units based on code templates
	 */
	controllingStructureModule.factory('controllingStructureGeneratorService', ['_', 'controllingStructureGeneratorHelperService', 'controllingStructureGeneratorExpressionParserService',
		function (_, generatorHelperService, generatorExpressionParserService) {

			var service = {},
				metaDataService = null,

				levels = null,
				levelLists = null,

				CUs = {};

			service.parseTemplate = function parseTemplate(template) {
				// parse and extend: "P(1-4)" => extract substart, subend, ...
				var expressions = generatorExpressionParserService.parse(template);

				// add connection to meta data service (getList / getObjects)
				return _.each(expressions, function process(expr) {
					if (expr && expr.expr && expr.expr !== '*') {
						// add getList() function to expressions
						expr.getList = function () {
							return metaDataService.getList(expr);
						};
						// add getObjects() function to expressions
						expr.getObjects = function () {
							return metaDataService.getObjects(expr);
						};
					}
				});
			};

			service.init = function init(codeTemplate, metaservice) {
				metaDataService = metaservice;
				CUs = {};

				// split on level separator [*]
				levels = [];

				_.each(codeTemplate.split('[*]'), function (levelTemplate) {
					levels.push(service.parseTemplate(levelTemplate));
				});

				// transform [exprArr, ...} -> [StringArr, ...]
				var levelsAsObjects = _.map(levels, function (exprArr) {
					return _.map(exprArr, function(expr) {
						return _.isString(expr) ? [expr] : expr.getObjects();
					});
				});

				levelLists = generatorHelperService.cartesianProductOf(_.map(levelsAsObjects, generatorHelperService.cartesianProductOf));
				return levelLists;
			};

			service.generateCUs = function (options) {
				CUs = {}; // code -> cu

				function getCode(obj) {
					return _.map(obj, function (i) { return _.isString(i) ? i : i.__getValue(); }).join('');
				}

				function getCodeFromLevelList(levelList) {
					return _.map(levelList, getCode).join('');
				}

				function getParentCodeFromLevelList(levelList) {
					var parentLevelList = _.dropRight(levelList);
					var parentCode = !_.isEmpty(parentLevelList) ? getCodeFromLevelList(parentLevelList) : null;

					// if hierarchical structure -> find correct parent
					var curObjPart = _.last(levelList);
					var lastCurObj = _.last(curObjPart);
					if (lastCurObj && lastCurObj.__isHierarchical && lastCurObj.__getParentFk()) {
						parentCode = getCodeFromLevelList(parentLevelList) + getCode(_.slice(curObjPart, 0, curObjPart.length - 1)) + lastCurObj.__getParentValue();
					}
					return parentCode;
				}

				function getDescriptionFromLevelList(levelList) {
					var lastObj = _.last(_.last(levelList));
					return _.isFunction(lastObj.__getDesc) ? lastObj.__getDesc() : '';
				}

				function getContext(obj) {
					// restore meta object context
					var expressions = _.flatten([].concat(levels)), // TODO: _.concat(...)?!
						context = _.flatten([].concat(obj)), // TODO: _.concat(...)?!
						contextArr = [];
					for (var i = 0; i < expressions.length; ++i) {
						if (_.isString(expressions[i])) { continue; }

						var contextObj = {entityName: expressions[i].entityName, Object: context[i]};
						if (expressions[i].entitySub) {
							contextObj.entitySub = expressions[i].entitySub;
						}
						contextArr.push(contextObj);
					}
					return contextArr;
				}

				function createControllingUnit(code, parentCode, description, context) {
					if (!CUs[code]) {
						CUs[code] = {
							__context: context,

							Code: code,
							DescriptionInfo: {
								'Description': null,
								'DescriptionTr': null,
								'DescriptionModified': false,
								'Translated': description,
								'VersionTr': 0,
								'Modified': true,
								'OtherLanguages': null
							},

							parent: CUs[parentCode] ? CUs[parentCode] : parentCode,

							ControllingUnits: [],
							ControllingunitFk: parentCode ? -1 : null // -> image processor (shouldn't be null, so -1)
						};
					}
					return CUs[code];
				}

				function getCUTree(parentProp, childProp) {
					// TODO: parentProp ignored at the moment
					function fillChildren(cu) {
						cu[childProp] = _.filter(CUs, {parent: CUs[cu.Code]});
						cu.HasChildren = _.size(cu[childProp]) > 0;
						_.each(cu[childProp], fillChildren);
					}

					var rootCUs = _.filter(CUs, {parent: null});
					_.each(rootCUs, fillChildren);

					return rootCUs;
				}

				// create controlling units and its structure based on code template
				_.each(levelLists, function (obj) {
					_.each(_.range(obj.length), function (n) {

						var curLevelList = _.take(obj, n + 1);

						var code = getCodeFromLevelList(curLevelList);
						var parentCode = getParentCodeFromLevelList(curLevelList);
						var description = getDescriptionFromLevelList(curLevelList);
						var context = getContext(obj);
						var isLeaf = obj.length - 1  === n;

						createControllingUnit(code, parentCode, description, isLeaf ? context : _.slice(context, 0, n + 1));
					});
				});

				// idStart option available?
				if (_.has(options, 'idStart')) {
					var id = options.idStart || 0;
					_.each(CUs, function (cunit) {
						cunit.Id = id++;
					});
				}

				// processFunc option available?
				if (_.isFunction(_.get(options, 'processFunc'))) {
					_.each(CUs, options.processFunc);
				}

				// tree options available? then we make a tree with that information
				if (_.has(options, 'parentProp') && _.has(options, 'childProp')) {
					return getCUTree(options.parentProp, options.childProp);
				}

				return CUs;
			};

			return service;
		}]);
})();
