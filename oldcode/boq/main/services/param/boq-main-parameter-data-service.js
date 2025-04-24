/**
 * Created by zos on 2/27/2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqParamDataService
	 * @description provides parameters to create, save or delete for the boq items and all fiter structures
	 */
	angular.module(moduleName).factory('boqParamDataService', [/* 'PlatformMessenger', */
		function (/* PlatformMessenger */) {
			var service = {},
				parames = [],
				paramsCache = [],
				selectParam = {},
				isParam = false;

			service.setParams = function setParams(parameters) {
				parames = parameters;
				isParam = true;
			};

			service.setParamsCache = function setParamsCache(items) {
				paramsCache = items;
			};

			service.getParams = function getParams() {
				return parames;
			};

			service.getList = function getList() {
				return parames;
			};

			service.getParamsCache = function getParamsCache() {
				return paramsCache;
			};

			service.addParam = function addParam(item) {
				parames.push(item);
			};

			service.setSelectParam = function setSelectParam(parameter) {
				selectParam = parameter;
				isParam = true;
			};

			service.getSelectParam = function getSelectParam() {
				return selectParam;
			};

			service.getIsParam = function getIsParam() {
				return isParam;
			};

			service.clear = function clear() {
				parames = [];
				selectParam = {};
				paramsCache = [];
				isParam = false;
			};

			return service;
		}
	]);

})(angular);

