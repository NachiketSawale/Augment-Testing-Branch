/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	/**
     * @ngdoc service
     * @name estimateMainConfigStructureLookupService
     * @function
     *
     * @description
     * estimateMainStructureLookupService is the data service for estimate structure lookup
     */
	angular.module('estimate.main').factory('estimateMainConfigStructureLookupService',
		['$q', '$http',
			function ($q, $http) {

				let service = {};

				let structure = [];

				var getListAsyncPromise = null;

				service.reload = function () {
					return $http.post(globals.webApiBaseUrl + 'basics/customize/eststructure/list/').then(function (response) {
						structure = [];
						if(response.data){
							_.forEach(response.data, function (item) {
								if(item.IsLive){structure.push(item);}
							});
						}

						return structure;
					});
				};

				service.getList= function () {
					if(structure && structure.length > 0){
						return $q.when(structure);
					}
					if (getListAsyncPromise === null){
						getListAsyncPromise = service.reload();
						return getListAsyncPromise;
					}else{
						return getListAsyncPromise;
					}
				};

				service.getItemById = function getItemById(Id) {
					return _.find(structure, {Id: Id});
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					if(structure && structure.length > 0){
						return $q.when(_.find(structure, {Id: value}));
					}
					return service.getList().then(function (data) {
						return _.find(data, {Id: value});
					});
				};

				service.getItemByKey= function(identification){
					return _.find(structure, {Id: identification});

				};
				service.getSearchList= function(){

				};

				return service;
			}]);
})(angular);
