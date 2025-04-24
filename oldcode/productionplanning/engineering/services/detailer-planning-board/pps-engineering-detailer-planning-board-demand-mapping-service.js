(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).service('ppsEngDetailerPlanningBoardDemandMappingService', MappingService);

	MappingService.$inject = ['moment', 'ppsEngineeringDetailerPlanningboardToolbarService'];

	function MappingService(moment, toolbarService) {

		this.id = function (engTask) {
			return engTask.Id;
		};

		this.description = function (engTask) {
			return engTask.Description;
		};

		this.from = function (engTask) {
			return moment(engTask.PlannedStart);
		};

		this.to = function (engTask) {
			return moment(engTask.PlannedFinish);
		};

		this.supplier = function () {

		};

		this.validateAgainst = function validateAgainst (demand) {
			return demand ? demand.RequiredSkillList : [];
		};

		this.filterDemands = (planningBoardDataService) => {
			var demandConfig = planningBoardDataService.getDemandConfig();
			var assignmentConfig = planningBoardDataService.getAssignmentConfig();

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
