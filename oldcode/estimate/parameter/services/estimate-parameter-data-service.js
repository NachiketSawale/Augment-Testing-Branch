/**
 * Created by lnt on 6/14/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.parameter';

	/**
	 * @ngdoc service
	 * @name estimateParamUpdateService
	 * @description provides parameters to create, save or delete for the line items and all fiter structures
	 */
	angular.module(moduleName).factory('estimateParamDataService', [
		function () {
			let service = {},
				parames = [],
				paramsCache = [],
				selectParam = {},
				isParam = false,
				projectId = null,
				fromModule = null;


			service.setProjectIdNModule = function setProjectIdNModule(module,projectFk) {
				fromModule = module;
				projectId = projectFk;
			};

			service.getProjectId = function getProjectId() {
				return projectId;
			};

			service.getModule = function getModule() {
				return fromModule;
			};

			service.setParams = function setParams(parameters){
				parames = parameters;
				isParam = true;
			};

			service.setParamsCache = function setParamsCache(items){
				paramsCache = items;
			};

			service.getParams = function getParams(){
				return parames;
			};

			service.getList = function getList(){
				return parames;
			};

			service.getParamsCache = function getParamsCache(){
				return paramsCache;
			};

			service.addParam =  function addParam(item){
				parames.push(item);
			};

			service.setSelectParam = function setSelectParam(parameter){
				selectParam = parameter;
				isParam = true;
			};

			service.getSelectParam = function getSelectParam(){
				return selectParam;
			};

			service.getIsParam = function getIsParam(){
				return isParam;
			};

			service.clear = function clear() {
				parames = [];
				selectParam = {};
				paramsCache = [];
				isParam = false;
				fromModule =null;
				projectId = null;
			};

			return service;
		}
	]);

})(angular);

