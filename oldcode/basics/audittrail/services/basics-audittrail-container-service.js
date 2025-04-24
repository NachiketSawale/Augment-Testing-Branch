/**
 * Created by uestuenel on 14.03.2018.
 */
(function (angular) {
	'use strict';

	function basicsAudittrailContainerService($http, basicsConfigAuditContainerLookupService, basicsAudittrailHelperService, $translate, mainViewService) {
		var service = {}, containerList = [];

		function getFirstItem(data) {
			data.unshift({
				DescriptionInfo: {
					Translated: $translate.instant('basics.audittrail.all')
				},
				ContainerUuid: ''
			});
			return data;
		}

		service.getContainerList = function (containerName) {
			return basicsConfigAuditContainerLookupService.getModuleContainers(containerName).then(function (containers) {
				var data = {};
				data.uuids = containers;
				data.moduleName = mainViewService.getCurrentModuleName();
				return $http.post(globals.webApiBaseUrl + 'basics/config/audittrail/list4module', data).then(function (response) {
					return getFirstItem(response.data);
				});
			});
		};

		return service;

	}

	basicsAudittrailContainerService.$inject = ['$http', 'basicsConfigAuditContainerLookupService',
		'basicsAudittrailHelperService', '$translate', 'mainViewService'];

	angular.module('basics.audittrail').factory('basicsAudittrailContainerService', basicsAudittrailContainerService);

})(angular);