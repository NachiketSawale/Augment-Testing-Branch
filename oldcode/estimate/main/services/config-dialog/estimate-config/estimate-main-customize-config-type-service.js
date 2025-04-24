/**
 * Created by benny on 08.06.2016.
 */
(function () {
	/* global globals, _ */
	'use strict';
	let modulename = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainCustomizeConfigTypeService
	 * @description
	 * estimateMainCustomizeConfigTypeService is the data service for customize config type list.
	 */
	angular.module(modulename).factory('estimateMainCustomizeConfigTypeService', ['$q', '$http', function ($q, $http) {

		let data = [];
		let service = {};

		service.loadData = function () {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/EstConfigType/list')
				.then(function (response) {
					data = response.data;
					return response.data;
				});
		};

		service.getList = function getList() {
			let list = _.filter(data, function(item){
				return item.Id !== 0;
			});
			angular.forEach(list, function(d){
				d.Description = d.DescriptionInfo.Translated;
			});
			return list;
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

		return service;
	}
	]);
})();
