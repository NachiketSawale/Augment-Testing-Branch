
(function (angular) {
	'use strict';
	const moduleName = 'change.main';

	/**
	 * @ngdoc service
	 * @name changeMainHeaderProcessorService
	 * @description processes items sent from server regarding data specific write protection of properties
	 */
	angular.module(moduleName).service('changeMainHeaderProcessorService', ChangeMainHeaderProcessorService);

	ChangeMainHeaderProcessorService.$inject = ['platformRuntimeDataService'];

	function ChangeMainHeaderProcessorService(platformRuntimeDataService) {
		this.processItem = function processItem(item) {
			if(item.IsReadOnlyByStatus) {
				platformRuntimeDataService.readonly(item, item.IsReadOnlyByStatus);
			} else {
				platformRuntimeDataService.readonly(item, [
				{
					field: 'ChangeTypeFk',
					readonly: item.Version > 0
				}]);
			}
		};
	}

})(angular);
