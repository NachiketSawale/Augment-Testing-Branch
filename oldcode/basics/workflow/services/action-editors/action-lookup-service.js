/**
 * Created by uestuenel on 16.11.2016.
 */

(function (angular) {
	'use strict';

	angular.module('basics.workflow').factory('basicsWorkflowActionLookupService', basicsWorkflowActionLookupService);

	basicsWorkflowActionLookupService.$inject = ['$http'];

	function basicsWorkflowActionLookupService($http) {
		var service = {};

		service.getStatusParams = function (url) {
			return getItems(url);
		};

		service.getCategoryParams = function (url) {
			return getItems(url);
		};

		service.getPrjDocParams = function (url) {
			return getItems(url);
		};

		function getItems(url) {
			return service.callUrl(url).then(function (response) {
				return response;
			});
		}

		service.callUrl = function (url) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/customize/' + url
			}).then(function (response) {
				response.data = createFirstItemInSelectController(response.data);
				return response.data;
			});
		};

		service.getEstParams = function (prjId) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'estimate/main/header/lookup',
				params: {
					projectId: prjId
				}
			}).then(function (response) {
				response.data = createFirstItemInSelectController(response.data);
				return response.data;
			});
		};

		service.getScheduleList = function (prjId) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'scheduling/schedule/list',
				params: {
					mainItemID: prjId
				}
			}).then(function (response) {
				response.data = createFirstItemInSelectController(response.data);
				return response.data;
			});
		};

		service.getInfoRequestList = function (prjId) {
			var data = {
				PKey1: prjId
			};

			var url = globals.webApiBaseUrl + 'project/rfi/informationrequest/list';
			return $http.post(url, data).then(function (response) {
				response.data.unshift(
					{
						Description: '',
						Id: 0
					});
				return response.data;
			});
		};

		service.getModelCaseList = function getModelCaseList() {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'mtwo/aiconfiguration/model/all',
				params: {}
			}).then(function (response) {
				return response.data;
			});
		};

		function createFirstItemInSelectController(data) {
			data.unshift({
				DescriptionInfo: {
					Translated: ''
				},
				Id: 0
			});
			return data;
		}

		return service;
	}
})(angular);
