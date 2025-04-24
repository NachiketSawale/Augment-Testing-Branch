
(function (angular) {
	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc service
	 * @name resourceTypeProcessorService
	 * @description provides validation methods for resourceType entities
	 */
	angular.module(moduleName).service('resourceTypeProcessorService', ResourceTypeProcessorService);

	ResourceTypeProcessorService.$inject = ['platformRuntimeDataService'];

	function ResourceTypeProcessorService(platformRuntimeDataService) {

		this.processItem = function processResourceType(item) {
			if(item.CreateTemporaryResource === true){
				platformRuntimeDataService.readonly(item, [
					{ field: 'GroupFk', readonly: false }
				]);
			}else{
				platformRuntimeDataService.readonly(item, [
					{ field: 'GroupFk', readonly: true }
				]);
			}
			platformRuntimeDataService.readonly(item, [
				{ field: 'HR', readonly: true }
			]);
			platformRuntimeDataService.readonly(item, [
				{ field: 'Has2ndDemand', readonly: true }
			]);
		};
	}
})(angular);
