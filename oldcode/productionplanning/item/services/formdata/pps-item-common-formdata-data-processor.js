(function (angular) {
	'use strict';
    
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemCommonFormDataProcessor', FormDataProcessor);
    
	FormDataProcessor.$inject = ['platformRuntimeDataService'];
    
	function FormDataProcessor(platformRuntimeDataService) {
		function processItem(item, config) {
			if(item) {
				var upstreamService = config.parentService;
				var selectedItem = upstreamService.getSelected();

				if(selectedItem !== null) {
					item.Belonging = item.FormDataIntersection.ContextFk !== selectedItem.Id ? 'parentUnit' : 'currentUnit';
				}
			}
		}
		return {
			processItem : processItem
		};
	}

})(angular);