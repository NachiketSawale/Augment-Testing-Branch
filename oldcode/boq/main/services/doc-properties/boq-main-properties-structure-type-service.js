/**
 * Created by joshi on 07.08.2014.
 */
(function () {

	/* global */
	'use strict';
	var modulename = 'boq.main';

	/**
	 * @ngdoc boqMainStructureDetailsTypeService
	 * @name
	 * @returns
	 * boqMainStructureDetailsTypeService retirns types of structure details
	 */
	angular.module(modulename).factory('boqMainStructureDetailsTypeService', ['$http', '$q', '$translate', function ($http, $q, $translate) {
		var types = [
			{Id: 1, Description: $translate.instant('boq.main.structureDetailTypeNumeric')},
			{Id: 2, Description: $translate.instant('boq.main.structureDetailTypeAlphaNumeric')}
		];

		var deffered = $q.defer();
		var data;
		var service = {};

		service.loadData = function () {
			if (!data) {
				service.reloadTranslatedDescriptions();
				data = types;
				deffered.resolve();
			}
			return deffered.promise;
		};

		service.getList = function () {
			service.reloadTranslatedDescriptions();
			return data;
		};

		service.getTypes = function () {
			service.reloadTranslatedDescriptions();
			return types;
		};

		service.reloadTranslatedDescriptions = function reloadTranslatedDescriptions() {
			types[0].Description = $translate.instant('boq.main.structureDetailTypeNumeric');
			types[1].Description = $translate.instant('boq.main.structureDetailTypeAlphaNumeric');
		};

		return service;

	}]);
})();
