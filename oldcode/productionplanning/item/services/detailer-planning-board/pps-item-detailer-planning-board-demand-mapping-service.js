(function () {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsItemDetailerPlanningBoardDemandMappingService', MappingService);

	MappingService.$inject = ['_', 'moment', 'ppsEngineeringDetailerPlanningboardToolbarService'];

	function MappingService(_, moment, toolbarService) {

		this.id = function (task) {
			return task.Id;
		};

		this.description = function (task) {
			return task.Code;
		};

		this.from = function (task) {
			return moment(task.PlannedStart);
		};

		this.to = function (task) {
			return moment(task.PlannedFinish);
		};

		this.supplier = function () {

		};

		this.filterDemands = function filterDemands(platformPlanningBoardDataService) {
			var demandConfig = platformPlanningBoardDataService.getDemandConfig();
			var assignmentConfig = platformPlanningBoardDataService.getAssignmentConfig();

			var demands = demandConfig.dataService.getList();
			var assignments = assignmentConfig.dataService.getList();
			var role = toolbarService.role();
			var filterDemands = [];
			assignments = _.filter(assignments, (assignment) => {
				return role.roleId === assignment.ClerkRoleFk;
			});

			_.forEach(demands, function (demand) {
				var pushDemand = true;
				_.forEach(assignments, function (assignment) {
					if (demand.Id === assignment.EngTaskFk && assignment.ClerkRoleFk === role.roleId) {
						pushDemand = false;
					}
				});
				if (pushDemand) {
					filterDemands.push(demand);
				}
			});
			return filterDemands;
		};

		this.quantity = function () {
			return 0;
		};

		this.unitOfMeasurement = function () {
			return 0;
		};

		this.dragInformation = function (task) {
			return (task.Code) ? task.Code : '';
		};
	}
})();
