
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	angular.module(moduleName).factory('transportplanningPackageTypeLookupService', lookupService);

	lookupService.$inject = ['$http', '_' ,'basicsLookupdataLookupDescriptorService', 'globals', 'platformPermissionService'];

	function lookupService($http, _, basicsLookupdataLookupDescriptorService, globals, platformPermissionService) {
		var service = {};

		service.getList = function () {
			return basicsLookupdataLookupDescriptorService.getData('basics.customize.transportpackagetype');
		};

		service.load = function load() {
			$http.post(globals.webApiBaseUrl + 'basics/customize/transportpackagetype/list').then(function (response) {
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.transportpackagetype', response.data);
				var list = service.getList();
				var accessrightDescriptorFks = _.remove(_.map(list, 'AccessrightDescriptorFk'), function (item) {
					return !_.isNil(item);
				});
				if (accessrightDescriptorFks.length > 0) {
					platformPermissionService.loadPermissions(accessrightDescriptorFks);
				}
			});
		};
		service.load();

		return service;
	}
})(angular);