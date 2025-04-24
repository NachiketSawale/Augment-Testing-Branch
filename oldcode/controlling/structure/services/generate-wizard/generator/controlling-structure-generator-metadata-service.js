/**
 * Created by janas on 14.12.2015.
 */

(function () {
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureGeneratorMetadataService
	 * @function
	 *
	 * @description
	 * controllingStructureGeneratorMetadataService provides data needed for evaluating expression in generator
	 */
	controllingStructureModule.factory('controllingStructureGeneratorMetadataService', ['_', 'projectMainForCOStructureService', 'controllingStructureWizardGenerateControllingGroupsService', 'controllingStructureWizardGenerateLocationService', 'controllingStructureWizardGenerateCustomService', 'controllingStructureWizardGenerateConstantsService',
		function (_, projectMainForCOStructureService, generateControllingGroupsService, generateLocationService, generateCustomService, generateConstantsService) {

			var service = {};

			var project = [];

			service.evaluateExpression = function (str, expr) {
				var evaluated = '';
				_.each(_.get(expr, 'subStrList'), function (item) {
					// e.g. "1-4" -> [1,4]
					if (_.includes(item, '-')) {
						var res = item.split('-');
						if (_.size(res) === 2) {
							evaluated += str.substring(res[0] - 1, res[1]);
						} else if (_.size(res) === 1) {
							evaluated += str.substr(res[0] - 1, 1);
						}
					}
					// e.g. "1/6"
					else if (_.includes(item, '/')) {
						var res2 = item.split('/');
						if (_.size(res2) === 2) {
							evaluated += str.substr(res2[0] - 1, res2[1]);
						} else if (_.size(res2) === 1) {
							evaluated += str.substr(res2[0] - 1);
						}
					}
				});

				return evaluated;
			};

			service.init = function () {
				// reset and fill project
				project.length = 0;
				var selectedProj = projectMainForCOStructureService.getSelected(),
					projectId = selectedProj.Id;

				project.push(selectedProj);

				// data sources
				generateConstantsService.init();            // load constant data like project, company info
				generateControllingGroupsService.init();    // fill controlling groups
				generateLocationService.init(projectId);    // load locations (by project)
			};

			service.getObjects = function (expression) {
				var resultArr = [];

				// project
				if (expression.entityName === 'P') {
					resultArr = project;
					_.each(resultArr, function (item) { item.__getValue = function(e) {return service.evaluateExpression(item.ProjectNo, e || expression);};});
					_.each(resultArr, function (item) { item.__getDesc = function() {return item.ProjectName;};});
				}
				// Controlling Unit Groups
				else if (expression.entityName === 'CUG') {

					var cug = _.find(generateControllingGroupsService.getControllingGroups(), {name: expression.entitySub});
					resultArr = cug && cug.details ? cug.details : [];
					_.each(resultArr, function (item) { item.__getValue = function(e) {return service.evaluateExpression(item.Code, e || expression);};});
					_.each(resultArr, function (item) { item.__getDesc = function() {return _.get(item, 'DescriptionInfo.Translated') || '';};});

				}
				// Locations
				else if (expression.entityName === 'L') {
					var locations = generateLocationService.getLocations();
					resultArr = locations;
					// tag as hierarchical structure and add some helper functions
					_.each(locations, function (item) { item.__isHierarchical = true; });
					_.each(locations, function (item) { item.__getParentFk = function() {return item.LocationParentFk;};});
					_.each(locations, function (item) { item.__getParentValue = function () { return _.get(_.find(locations, {Id: item.LocationParentFk}), 'Code');};});
					_.each(locations, function (item) { item.__getValue = function(e) {return service.evaluateExpression(item.Code, e || expression);};});
					_.each(locations, function (item) { item.__getDesc = function() {return _.get(item, 'DescriptionInfo.Translated') || '';};});

				}
				// Simple "CUST" List,  e.g. [{Code: 100, Desc: "Bauabschnitt 1"},{Code: 200, Desc: "Bauabschnitt 2"}]
				else if (expression.entityName === 'CUST') {
					resultArr = generateCustomService.getList();
					_.each(resultArr, function (item) { item.__getValue = function(e) {return service.evaluateExpression(item.code, e || expression);};});
					_.each(resultArr, function (item) { item.__getDesc = function() {return item.description;};});
				}
				// Custom data
				else if(generateCustomService.checkIsCustom(expression.entityName)) {
					resultArr = generateCustomService.getCustDataByKey(expression.entityName);

					// tag as hierarchical structure and add some helper functions
					// _.each(resultArr, function (item) { item.__isHierarchical = true; });
					// _.each(resultArr, function (item) { item.__getParentFk = function() {return item.parentFk;};});
					// _.each(resultArr, function (item) { item.__getParentValue = function () { return _.get(_.find(resultArr, {Id: item.parentFk}), 'value');};});
					_.each(resultArr, function (item) { item.__getValue = function(e) {return service.evaluateExpression(item.description, e || expression);};});
				}
				// Constants
				else if (generateConstantsService.checkIsConstant(expression)) {
					var constant = generateConstantsService.getConstantByKey(expression.entityName);
					resultArr = [{value: constant}];
					_.each(resultArr, function (item) { item.__getValue = function(e) {return service.evaluateExpression(item.value, e || expression);};});
				}

				// use copy here to provide an additional syntax support for multiple usage of an expression:
				// e.g.: [P(1-3)]-[P(6-10)]     (which is same as [P(1-3), 6-10)])
				return angular.copy(resultArr);
			};

			service.getList = function (expression) {
				var resultArr = [];

				if (expression.entityName === 'P') {
					resultArr = _.map(service.getObjects(expression), 'ProjectNo');

				} else if (expression.entityName === 'CUG') {
					resultArr = _.map(service.getObjects(expression), 'Code');

				} else if (expression.entityName === 'L') {
					resultArr = _.map(service.getObjects(expression), 'Code');

				} else if (expression.entityName === 'CUST') {
					resultArr = _.map(service.getObjects(expression), 'Code');

				} else if (generateCustomService.checkIsCustom(expression.entityName)){
					resultArr = _.map(service.getObjects(expression), 'description');
				}

				resultArr = _.map(resultArr, function (str) {
					return service.evaluateExpression(str, expression);
				});

				return resultArr;
			};

			service.resolveExpression = function resolveExpression(e, context) {
				// check constants first and then context data
				if (generateConstantsService.checkIsConstant(e)) {
					var constant = generateConstantsService.getConstantByKey(e.entityName);
					return constant ? service.evaluateExpression(constant, e) : '';

				} else {
					var predicate = _.pickBy({'entityName': e.entityName,'entitySub': e.entitySub}, _.identity);
					var obj = _.find(context, predicate);
					return obj ? obj.Object.__getValue(e) : '';
				}
			};

			// see ALM #87457
			service.isConstant = function isConstant(expression) {
				return generateConstantsService.checkIsConstant(expression);
			};

			service.isCustom = function isCustom(expression) {
				return generateCustomService.checkIsCustom(expression);
			};

			return service;
		}]);


})();
