(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var packageModule = angular.module(moduleName);

	packageModule.controller('productionplanningEngineeringTaskListByJobController', PpsEngtaskListByJobController);
	PpsEngtaskListByJobController.$inject = ['$scope', '$controller', '_', 'productionplanningEngineeringMainService'];

	function PpsEngtaskListByJobController($scope, $controller, _ , dataService) {
		angular.extend(this, $controller('productionplanningEngineeringTaskListController', {$scope: $scope}));

		//region: sideLoadData

		var filterLgmJobFk;
		var filterProjectFk;
		var sideLoadType = 'byJob';
		dataService.registerSideloadContainer($scope.gridId, sideLoadType);

		function loadJobData(event, engTask) {
			//extend filter here!!
			engTask = dataService.getLastSideloadSelection()? dataService.getLastSideloadSelection() : engTask;
			if (engTask) {
				if (filterLgmJobFk !== engTask.LgmJobFk) {
					filterLgmJobFk = engTask.LgmJobFk;

					var currentFilter = dataService.getSideloadFilter(sideLoadType);
					if (filterProjectFk !== engTask.ProjectId) {
						filterProjectFk = engTask.ProjectId;
						currentFilter.FurtherFilters = [];
					} else {
						currentFilter.FurtherFilters = currentFilter.FurtherFilters || [];
					}
					var jobFilter = {
						Token: 'logistic.job',
						Value: engTask.LgmJobFk
					};
					_.assign(currentFilter.FurtherFilters, [jobFilter]);
					dataService.setSideloadFilter(sideLoadType, currentFilter);

					if (filterLgmJobFk) {
						dataService.sideloadData(sideLoadType);
					}
				}
			} else {
				filterLgmJobFk = null;
			}
		}
		dataService.registerSelectionChanged(loadJobData);

		function resetJobSelection() {
			filterLgmJobFk = null;
		}
		dataService.registerListLoadStarted(resetJobSelection);


		if (dataService.hasSelection()) {
			var task = dataService.getSelected();
			loadJobData(null, task);
		}

		$scope.$on('$destroy', function () {
			dataService.unregisterSelectionChanged(loadJobData);
			dataService.unregisterListLoadStarted(resetJobSelection);
			dataService.unregisterSideloadContainer($scope.gridId, sideLoadType);
		});

		//region end: sideLoadData

	}
})(angular);