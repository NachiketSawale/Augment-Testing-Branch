/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* globals _ */
	/**
	 * @ngdoc service
	 * @name estimateMainTypeBoqProjectLookupDataService
	 * @function
	 *
	 * @description
	 * estimateMainTypeBoqProjectLookupDataService is the data service providing data for Type lookup in Wizard GenerateEstimateFromBoq
	 */
	angular.module('estimate.main').factory('estimateMainTypeBoqProjectLookupDataService', ['$translate', '$q','basicsLookupdataLookupDescriptorService',
		function ($translate, $q,lookupDescriptorService) {

			let lookupType = 'typeprojectorwic';
			let service = {
				setList: setList,
				getItemById: getItemById,
				getList: getList,
				getItemByIdAsync: getItemByIdAsync,
				getItemByKey: getItemByKey
			};

			function setList() {
				let list = [];
				list = [{'Id':1, 'Type': 1, 'Code': $translate.instant('estimate.main.project'),'Description': $translate.instant('estimate.main.project')},
					{'Id':2, 'Type': 2, 'Code': $translate.instant('estimate.main.wic'), 'Description': $translate.instant('estimate.main.wic')}];

				let responseData = {};
				responseData = list;
				lookupDescriptorService.attachData({'typeprojectorwic':responseData});
			}

			function getList() {
				let defer = $q.defer();
				defer.resolve(_.values(lookupDescriptorService.getData(lookupType)));

				return defer.promise;
			}
			function getItemByKey(key) {
				return lookupDescriptorService.getLookupItem(lookupType, key);
			}

			function getItemById(id) {
				return getItemByKey(id);
			}
			function getItemByIdAsync(id) {
				let defer = $q.defer();
				defer.resolve(getItemByKey(id));
				return defer.promise;
			}

			// init
			setList();

			return service;
		}]);
})(angular);
