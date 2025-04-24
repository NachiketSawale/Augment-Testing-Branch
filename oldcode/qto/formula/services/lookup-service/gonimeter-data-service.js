/**
 * Created by wui on 6/23/2015.
 */

(function(angular){
	'use strict';

	/* globals globals, _ */

	angular.module('qto.formula').factory('qtoFormulaGonimeterDataService', ['$q', '$http',
		function($q, $http) {

			let service = {};

			let lookupData = {
				goniometerTypeItems: []
			};


			function getGoniometerTypeItems() {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/GoniometerType/list').then(function (response) {
					return response.data;
				});
			}

			function getListAsync() {
				let list = lookupData.goniometerTypeItems;
				if (list && list.length > 0) {
					return $q.when(list);
				}
				else {
					return service.loadAsync();
				}
			}

			function getItemById(value) {
				let item = {};
				item = _.find(lookupData.goniometerTypeItems, {Id: value});
				return item && item.Id ? item : null;
			}

			service.loadAsync = function loadAsync() {
				if (!lookupData.goniometerTypeAsyncPromise) {
					lookupData.goniometerTypeAsyncPromise = getGoniometerTypeItems();
				}
				return lookupData.goniometerTypeAsyncPromise.then(function (response) {
					lookupData.goniometerTypeAsyncPromise = null;
					lookupData.goniometerTypeItems = response;
					return lookupData.goniometerTypeItems;
				});
			};

			service.getList = function () {
				return getListAsync();
			};

			service.getItemByKey = function (value) {
				if (lookupData.goniometerTypeItems.length) {
					return $q.when(getItemById(value));
				} else {
					if (!lookupData.itemsPromise) {
						lookupData.itemsPromise = getListAsync();
					}
					return lookupData.itemsPromise.then(function (data) {
						lookupData.itemsPromise = null;
						lookupData.goniometerTypeItems = data;
						return getItemById(value);
					});
				}
			};
			return service;
		}
	]);

})(angular);