/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */
(function(angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name estimateMainConfigCostGroupLookupService
     * @function
     *
     * @description
     * estimateConfigCostGroupLookupDataService is the data service for estimate cost group lookup
     */
	angular.module('estimate.main').factory('estimateMainConfigCostGroupLookupService',
		['$q', '$http', '$injector',
			function ($q, $http, $injector) {

				let service = {};

				let costGroup = [];

				var getListAsyncPromise = null;

				service.reload = function () {
					let filterData = {
						ProjectFk: $injector.get('estimateMainService').getProjectId()
					};
					return $http.post(globals.webApiBaseUrl + 'estimate/main/lookup/getcostgroupcatcode2desc', filterData).then(function (response) {
						costGroup = [];
						if (response.data) {
							_.forEach(response.data, function (item) {
								costGroup.push(item);
							});
						}

						return costGroup;
					});
				};

				service.getList = function () {
					if (costGroup && costGroup.length > 0) {
						return $q.when(costGroup);
					}

					if (getListAsyncPromise === null){
						getListAsyncPromise = service.reload();
						return getListAsyncPromise;
					}else{
						return getListAsyncPromise;
					}
				};

				service.getItemById = function getItemById(Id) {
					return _.find(costGroup, {Id: Id});
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					if (costGroup && costGroup.length > 0) {
						return $q.when(_.find(costGroup, {Id: value}));
					}
					return service.getList().then(function (data) {
						return _.find(data, {Id: value});
					});
				};

				service.getItemByKey = function (identification) {
					return _.find(costGroup, {Id: identification});

				};
				service.getSearchList = function (value) {
					return service.getList().then(function (data) {
						if (data) {
							data = _.filter(data, function (item) {
								return item.Id.indexOf(value.toUpperCase()) > -1 || (item.DescriptionInfo && item.DescriptionInfo.Translated && item.DescriptionInfo.Translated.toLowerCase().indexOf(value.toLowerCase()) > -1);
							});

							return data;
						}

						return null;
					});
				};

				service.getCostGroupById = function getControllingUnitById(mainItemId) {
					return $http.post(globals.webApiBaseUrl + 'basics/CostGroups/costgroup/getcostgroupbyid?Id=' + mainItemId).then(function (response) {
						if (response && response.data) {
							return response.data;
						} else {
							return '';
						}
					});
				};

				return service;
			}]);
})(angular);
