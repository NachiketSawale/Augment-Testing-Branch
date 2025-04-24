
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('ppsProcessConfigurationPhaseRequirementUIReadonlyService', UIReadonlyService);

	UIReadonlyService.$inject = ['ppsProcessConfigurationPhaseRequirementUIStandardService'];

	function UIReadonlyService(uiStandardService) {

		var factory = {};
		var serviceCache = {};

		factory.getService = function (dataService){
			var key = dataService.getServiceName();
			if (_.isNil(serviceCache[key])) {
				var ui = uiStandardService.getService(dataService);
				var columns = _.cloneDeep(ui.getStandardConfigForListView().columns);
				_.forEach(columns, function (o) {
					o.editor = null;
				});
				var rows = _.cloneDeep(ui.getStandardConfigForDetailView().rows);
				_.forEach(rows, function (o) {
					o.readonly = true;
				});
				serviceCache[key] = {
					getStandardConfigForListView: function () {
						return {
							columns: columns
						};
					},
					getStandardConfigForDetailView: function () {
						return {
							groups: ui.getStandardConfigForDetailView().groups,
							rows: rows
						};
					}
				};
			}
			return serviceCache[key];
		};

		return factory;
	}
})(angular);