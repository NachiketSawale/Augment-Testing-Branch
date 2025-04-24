/**
 * Created by anl on 8/25/2020.
 */

(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.common';

	/* jshint -W072*/ //many parameters because of dependency injection
	angular.module(moduleName).service('productionplanningCommonDateShiftModeService', DateShiftModeService);

	DateShiftModeService.$inject = ['$q', 'basicsLookupdataLookupDescriptorService', '$translate'];
	function DateShiftModeService($q, basicsLookupdataLookupDescriptorService, $translate) {
		var service = {};
		service.list = [{
			Id: 0,
			Description: $translate.instant('productionplanning.common.event.ignoreBounds')
		}, {
			Id: 1,
			Description: $translate.instant('productionplanning.common.event.validateBounds')
		}, {
			Id: 2,
			Description: $translate.instant('productionplanning.common.event.shiftChildren')
		}];

		service.loadData = function loadData(){
			return $q.when(true);
		};

		service.getList = function () {
			return service.list;
		};

		return service;
	}
})();