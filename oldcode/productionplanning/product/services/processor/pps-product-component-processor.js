(angular => {
	'use strict';

	const moduleName = 'productionplanning.product';
	angular.module(moduleName).service('ppsProductComponentProcessor', processor);

	processor.$inject = ['platformRuntimeDataService'];

	function processor(platformRuntimeDataService) {

		this.processItem = item => {
			if (item.IsReadonly) {
				platformRuntimeDataService.readonly(item, true);
			}
		};
	}
})(angular);