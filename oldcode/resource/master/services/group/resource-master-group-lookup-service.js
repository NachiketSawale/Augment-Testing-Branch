/**
 * Created by anl on 3/28/2017.
 */

(function (angular) {

	/**
	 * @description
	 * resourceMasterLookupService provides custom lookup data for resource master module
	 */

	'use strict';
	var moduleName = 'resource.master';

	angular.module(moduleName).factory('resourceMasterLookupService', ResourceMasterLookupService);

	ResourceMasterLookupService.$inject = ['$http', '$q', 'basicsLookupdataLookupDescriptorService',
		'cloudCommonGridService'];

	function ResourceMasterLookupService($http, $q, basicsLookupdataLookupDescriptorService, cloudCommonGridService) {
		var service = {};
		var lookupData = {
			resourceMasterGroup: []
		};

		var getGroupTreeAsyn = function getGroupTreeAsyn() {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/resourcegroup/list').then(function (response) {
				lookupData.resourceMasterGroup = response.data;
				return response.data;
			});
		};

		service.getGroupTree = function () {
			return lookupData.resourceMasterGroup;
		};

		service.getResourceMasterGroupTree = function getResourceMasterGroupTree() {
			if (lookupData.resourceMasterGroup && lookupData.resourceMasterGroup.length > 0) {
				return $q.when(lookupData.resourceMasterGroup);
			} else {
				return getGroupTreeAsyn().then(function (data) {
					lookupData.resourceMasterGroup = data;
					basicsLookupdataLookupDescriptorService.updateData('basics.customize.resourcegroup', data);
					return data;
				});
			}
		};

		service.getItemByKey = function getItemByKey(value) {
			var item = {},
				list = lookupData.resourceMasterGroup;
			if (list && list.length > 0) {
				var output = [];
				list = cloudCommonGridService.flatten(list, output, 'ChildItems');
				for (var i = 0; i < list.length; i++) {
					if (list[i].Id === value) {
						item = list[i];
						item.Description = item.DescriptionInfo.Translated;
						break;
					}
				}
			}
			return item && item.Id ? item : null;
		};

		service.load = function load() {
			var resourceMasterCompleteLookup = {
				'resourcemastergroup': $http.post(globals.webApiBaseUrl + 'basics/customize/resourcegroup/list')
			};

			$q.all(resourceMasterCompleteLookup).then(function (result) {
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.resourcegroup', result.resourcemastergroup.data);
				lookupData.resourceMasterGroup = angular.copy(result.resourcemastergroup.data);
			});
		};

		service.reload = function reload() {
			return service.load();
		};

		service.clearCache = function clearCache() {
			lookupData.resourceMasterGroup = [];
		};

		service.load();

		return service;
	}

})(angular);
