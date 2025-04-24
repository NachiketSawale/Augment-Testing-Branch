(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).service('ppsEngDetailerPlanningBoardAssignmentMappingService', MappingService);

	MappingService.$inject = ['$q', '$http', '$injector', '$translate','ppsEngDetailerPlanningBoardStatusService', 'ppsEngineeringDetailerPlanningboardToolbarService'];

	function MappingService($q, $http, $injector, $translate, statusService, ppsEngineeringDetailerPlanningboardToolbarService) {

		function implementMemberAccess(field, clerk, value) {
			if (!_.isUndefined(value)) {
				clerk[field] = value;
			}
			return clerk[field];
		}

		function implementNumberMemberAccess(field, clerk, value) {
			// nullable values are accepted
			if(_.isNumber(value) || value === null ){
				clerk[field] = value;
			}
			return clerk[field];
		}

		this.id = function (clerk) {
			return clerk.Id;
		};

		this.description = function (clerk) {
			if (!_.isNil(clerk.EngTaskDescription)) {
				return clerk.EngTaskCode + ' - ' + clerk.EngTaskDescription;
			}
			return clerk.EngTaskCode;
		};

		this.infoField = function (clerk, infoField) {
			if (infoField === 'InfoField1' && clerk.RoleDescriptionInfo) {
				return clerk.RoleDescriptionInfo.Translated;
			}
			return '';
		};

		this.from = function (clerk, from) {
			return implementMemberAccess('EngTaskPlannedStart', clerk, from);
		};

		this.to = function (clerk, to) {
			return implementMemberAccess('EngTaskPlannedFinish', clerk, to);
		};

		this.quantity = function () {
			return 0;
		};

		this.unitOfMeasurement = function () {
			return 0;
		};

		this.assignmentType = function () {
			return -1;
		};

		this.forMaintenance = function () {
			return false;
		};

		this.supplier = function (clerk, clerkId) {
			return implementMemberAccess('ClerkFk', clerk, clerkId);
		};

		this.demand = function (clerk, engTask) {
			implementMemberAccess('EngTaskFk', clerk, engTask.Id);
			implementMemberAccess('EngTaskCode', clerk, engTask.Code);
			implementMemberAccess('EngTaskDescription', clerk, engTask.Description);

			return clerk;
		};

		this.project = function () {
			return -1;
		};

		this.areRelated = function () {
			return false;
		};

		this.createAssignment = function (clerk, newClerk) {
			let demandDataService = $injector.get('ppsEngDetailerPlanningBoardDemandService');
			let demands = demandDataService.getList();
			let demand = _.find(demands, {'Id': clerk.EngTaskFk});
			let role = ppsEngineeringDetailerPlanningboardToolbarService.role();

			newClerk.ClerkFk = clerk.ClerkFk;
			newClerk.ClerkRoleFk = role.roleId;
			newClerk.RoleDescriptionInfo = role.roleDescription;
			newClerk.EngTaskFk = clerk.EngTaskFk;
			newClerk.EngTaskCode = clerk.EngTaskCode;
			newClerk.EngTaskDescription = clerk.EngTaskDescription;
			newClerk.EngTaskPlannedStart = moment(demand.PlannedStart);
			newClerk.EngTaskPlannedFinish = moment(demand.PlannedFinish);

			// filter demand from current grid
			if (_.isFunction(demandDataService.filterDemands)) {
				demandDataService.filterDemands(demand);
			}

			return newClerk;
		};

		this.validateAssignment = function () {

		};

		this.getTypeService = function () {
			return {
				getAssignmentTypeIcons: function () {
					return $q.when([]);
				},
				getAssignmentType: function () {
					return $q.when([]);
				}
			};
		};

		this.getStatusService = function () {
			return statusService;
		};

		this.status = function () {
			return -1;
		};

		this.statusKey = function () {
			return '';
		};

		this.statusPanelText = function () {
			return '';
		};

		this.validateAgainst = function validateAgainst (assignment) {
			return assignment ? assignment.ProvidedSkillList : [];
		};

		this.isReadOnly = () => {
			return true;
		};

		this.ppsHeaderColor = function ppsHeaderColor(productionSet) {
			var ppsHeaderColor = implementNumberMemberAccess('PPSHeaderColor', productionSet);
			return ppsHeaderColor ? ppsHeaderColor : null;
		};

		this.manipulateDefaultConfigValues = (defaultConfigValues) => {
			let tagConfig = Object.values(defaultConfigValues)[0].tagConfig;
			let currentMaxSort = Math.max(...tagConfig.map(i => i.sort));
			tagConfig.push({
				id: 'ppsHeader',
				name: $translate.instant('platform.planningboard.ppsHeader'),
				color: '#786735',
				customColor: false,
				icon: true,
				visible: true,
				sort: ++currentMaxSort
			});

			return defaultConfigValues;
		};
	}
})();
