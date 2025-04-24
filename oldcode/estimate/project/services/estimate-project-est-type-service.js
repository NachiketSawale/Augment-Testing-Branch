/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let modulename = 'estimate.project';
	/**
	 * @ngdoc service
	 * @name estimateProjectEstTypeService
	 * @description
	 * estimateProjectEstTypeService is the data service for estimate type list.
	 */
	angular.module(modulename).factory('estimateProjectEstTypeService', ['$q', '$http', 'basicsLookupdataLookupDescriptorService',
		function ($q, $http, lookupDescriptorService) {

			let data = [];
			let service = {};
			let lookupType = 'esttype';
			service.loadData = function () {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/estimationtype/list')
					.then(function (response) {
						data = response.data;
						angular.forEach(data, function(d){
							d.Description = d.DescriptionInfo.Translated;
						});
						data = data.filter(function (item) {
							return item.GuidGrid !== '67B7A884ECC643298925743AA4DCF732' && item.GuidResGrid !== 'DC32837598DF402AAB134696A14B05E7' && item.IsLive;
						});

						lookupDescriptorService.attachData({'esttype':data});
						return data;
					});
			};

			service.getList = function getList() {

				let defer = $q.defer();
				defer.resolve(_.values(lookupDescriptorService.getData(lookupType)));
				return defer.promise;
			};
			service.getListAsync = function getListAsync() {
				return service.loadData();

			};

			service.getItemById = function getItemById(id) {
				let item = _.find(data, {'Id': id});
				return item;
			};

			service.getItemByIdAsync = function getItemByIdAsync(id) {
				return service.getListAsync().then(function(){
					return service.getItemById(id);
				});
			};

			service.getItemByKey = function getItemByKey(key) {
				return lookupDescriptorService.getLookupItem(lookupType, key);
			};

			service.loadData();

			return service;
		}
	]);
})();
