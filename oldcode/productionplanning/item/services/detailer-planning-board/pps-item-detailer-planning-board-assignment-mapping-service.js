(function () {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsItemDetailerPlanningBoardAssignmentMappingService', MappingService);

	MappingService.$inject = ['$q', '$http', '$injector', '$translate', 'ppsItemDetailerPlanningBoardStatusService', 'ppsEngineeringDetailerPlanningboardToolbarService','productionplanningItemDataService'];

	function MappingService($q, $http, $injector, $translate, statusService, toolbarService, productionplanningItemDataService) {

		function implementMemberAccess(field, clerk, value) {
			if (!_.isUndefined(value)) {
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

			return clerk;
		};

		this.project = function () {
			return -1;
		};

		this.areRelated = function () {
			return false;
		};

		this.createAssignment = function (clerk, newClerk) {
			var demandDataService = $injector.get('ppsItemDetailerPlanningBoardDemandService');
			var demands = demandDataService.getList();
			var demand = _.find(demands, {'Id': clerk.EngTaskFk});
			var role = toolbarService.role();

			newClerk.ClerkFk = clerk.ClerkFk;
			newClerk.ClerkRoleFk = role.roleId;
			newClerk.RoleDescriptionInfo = role.roleDescription;
			newClerk.EngTaskFk = clerk.EngTaskFk;
			newClerk.EngTaskCode = demand.Code;
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

		this.isLocked = function () {
			// detailer assignments are always locked
			return true;
		};

		this.headerColor = function assignmentHeaderColor() {
			return 1; // d3.interpolateRainbow
		};

		this.validateAgainst = function validateAgainst () {
			return [];
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
