/**
 * Created by baf on 16.02.2021.
 */
(function (angular) {
	'use strict';
	var moduleName = 'resource.master';
	/**
	 * @ngdoc service
	 * @name resourceMasterProcessor
	 * @function
	 * @requires platformRuntimeDataService, platformContextService, $http
	 *
	 * @description
	 * resourceMasterProcessor is the service to process data in main entity
	 *
	 */
	angular.module(moduleName).service('resourceMasterDataContextProcessor', ResourceMasterDataContextProcessor);

	ResourceMasterDataContextProcessor.$inject = ['platformRuntimeDataService'];

	function ResourceMasterDataContextProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(item) {
			platformRuntimeDataService.readonly(item, !item.BelongsToLoginContext);
		};
	}
})(angular);