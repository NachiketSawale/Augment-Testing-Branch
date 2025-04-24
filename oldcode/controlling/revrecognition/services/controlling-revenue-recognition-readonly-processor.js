/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var modulSubModuleModule = angular.module('controlling.revrecognition');

	/**
     * @ngdoc service
     * @name modulSubModuleMainEntityNameDataService
     * @function
     * @requires platformDataServiceFactory
     *
     * @description
     * The root data service of the modul.submodule module.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	modulSubModuleModule.factory('controllingRevenueRecognitionReadonlyProcessor', [ 'platformRuntimeDataService',
		function (/* platformRuntimeDataService */) {
			var service = {};
			service.processItem = function processItem(/* prrItem, data */) {
				// var allFields = boqMainDetailFormConfigService.getListOfFields(true);
				// platformRuntimeDataService.readonly(prrItem, allFields);
			};
			return service;
		}]);
})();
