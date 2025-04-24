(function (angular) {
	'use strict';
	angular.module('platform').service('platformDataServiceEntityReadonlyProcessor', PlatformDataServiceEntityReadonlyProcessor);

	PlatformDataServiceEntityReadonlyProcessor.$inject = ['platformRuntimeDataService'];

	function PlatformDataServiceEntityReadonlyProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(entity) {
			platformRuntimeDataService.readonly(entity, true);
		};
	}
})(angular);