/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* globals _ */
	/**
     * @ngdoc service
     * @name estimateMainAssemblyTypeLookupDataService
     * @function
     *
     * @description
     * estimateMainAssemblyTypeLookupDataService is the data service providing data for Assembly Type lookup in LineItem container
     */
	angular.module('estimate.main').factory('estimateMainAssemblyTypeLookupDataService', ['$translate', '$q',

		function ($translate, $q) {

			let lookupData = [
				{Id:1, Type: 0, Description: $translate.instant('estimate.main.assembly')},
				{Id:2, Type: 1, Description: $translate.instant('estimate.main.plantAssembly')}];


			function getItemByIdAsync(id) {
				let item =_.find(lookupData,{'Type':id});
				return item ? item : {};
			}

			function getItemById(id) {
				let item =_.find(lookupData,{'Type':id});
				return item ? item : {};
			}

			function getList() {
				return getListAsync();
			}

			function getListAsync() {
				return $q.when(lookupData);
			}

			function resolveStringValue(value){
				const item = _.find(lookupData, function(e) { return e.Description.toLowerCase().startsWith(value.trim().toLowerCase()); });

				if(item) {
					return {
						apply: true,
						valid: true,
						value: item.Type
					};
				}

				return {
					apply: true,
					valid: false,
					value: value,
					error: 'not found!'
				};
			}

			return {
				getLookupData:getList,
				getList:getList,
				getListAsync:getListAsync,
				getItemById:getItemById,
				getItemByIdAsync: getItemByIdAsync,
				resolveStringValue: resolveStringValue
			};
		}]);
})(angular);
