/**
 * Created by zos on 1/9/2018.
 */

(function () {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqParameterFormatterService
	 * @function
	 *
	 * @description
	 * boqParameterFormatterService provides list of parameter formatter data for boq main filter structures and boq item
	 */
	angular.module(moduleName).factory('boqParameterFormatterService', ['$q',
		function ($q) {

			var service = {},
				lookupData = {
					BoqParamItems: []
				};

			var setParamAssignment4BoqItems = function (boqItems, boqParamItems) {
				angular.forEach(boqItems, function (boqItem) {
					var boqParams = _.filter(boqParamItems, function (boqParamItem) {
						return boqParamItem.BoqHeaderFk === boqItem.BoqHeaderFk && boqParamItem.BoqItemFk === boqItem.Id;
					});
					boqItem.ParamAssignment = boqParams;

					var childBoqItems = boqItem.BoqItems;
					if (childBoqItems && childBoqItems.length) {
						setParamAssignment4BoqItems(childBoqItems, boqParamItems);
					}
				});
			};

			service.buildParamAssignment = function buildRuleAndRuleAssignment(boqTreeItems, boqParamItems) {
				if (boqParamItems && boqParamItems.length && boqTreeItems && boqTreeItems.length) {
					lookupData.BoqParamItems = boqParamItems;
					// as the boqTreeItems has a hirachical structure, so a recursion function here to handler it
					setParamAssignment4BoqItems(boqTreeItems, boqParamItems);
				}
			};

			service.isCss = function () {
				return true;
			};

			// get list of the estimate Parameter Code by Id
			service.getItemById = function getItemById(value) {
				var iconItem = {};
				if (_.isString(value) && value === 'default') {
					iconItem = {css: true, res: 'tlb-icons ico-menu', text: ''};
				}
				// else if(value.ParamAssignment && value.ParamAssignment.length > 0) {
				else if (value && value.params && value.params.length > 0) {
					var conflict = false;
					// var params= _.map(value.ParamAssignment,'Code').sort();
					var params = value.params.sort();
					for (var i = 0; i < params.length; i++) {
						if (params[i] === params[i + 1] || params[i] === '...') {
							conflict = true;
							break;
						}
					}
					if (conflict) {
						iconItem = {css: true, res: 'control-icons ico-parameter-warning', text: ''};
					} else {
						iconItem = {css: true, res: 'control-icons ico-parameter', text: ''};
					}
				}
				return iconItem;
			};

			// get param from list of the Parameters
			var getParam = function getParam(params) {
				var tempparam = {params: params};
				return params && params.length ? tempparam : 'default';
			};

			// get list of the Parameters as per item async
			var getListAsync = function getListAsync(item) {
				var params = _.map(item.ParamAssignment, 'Code');
				return $q.when(getParam(params));
			};

			// get list of the estimate Parameter Code item by Id Async
			service.getItemByParamAsync = function getItemByParamAsync(item) {
				if (!item) {
					return;
				}
				return $q.when(getListAsync(item));
			};

			// clear lookup data
			service.clear = function clear() {
				lookupData = {};
			};

			return service;
		}]);
})();
