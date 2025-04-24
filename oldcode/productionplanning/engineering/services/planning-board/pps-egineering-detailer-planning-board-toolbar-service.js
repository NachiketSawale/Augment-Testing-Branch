(function (angular) {

	'use strict';
	var module = angular.module('productionplanning.engineering');
	module.service('ppsEngineeringDetailerPlanningboardToolbarService', PpsEngineeringDetailerPlanningboardToolbarService);

	PpsEngineeringDetailerPlanningboardToolbarService.$inject = ['_', '$http', '$q', 'platformPlanningBoardDataService'];

	function PpsEngineeringDetailerPlanningboardToolbarService(_, $http, $q, platformPlanningBoardDataService) {
		var _self = this;
		var roleTools = [];
		_self.selectedRole = null;

		_self.getCustomTools = function getCustomTools() {
			var defer = $q.defer();

			$http.get(globals.webApiBaseUrl + 'productionplanning/configuration/clerkroleslot/isEngineering').then(function (response) {
				if (!_.isNil(response.data)) {
					var roleSelectionTool = [{
						id: 'roleSelection',
						sort: 25,
						iconClass: 'status-icons ico-status40',
						type: 'dropdown-btn',
						caption: 'roleSelection',
						showTitles: false,
						list: {
							showImages: true,
							cssClass: 'dropdown-menu-right',
							items: []
						}
					}];

					_.forEach(response.data, function (role) {
						var roleItem = {
							id: 'role-' + role.Id,
							caption: role.DescriptionInfo.Description,
							type: 'item',
							iconClass: 'status-icons ico-status40',
							roleId: role.Id,
							roleDescription: role.DescriptionInfo,
							fn: function () {
								_self.role(this);
								// reload planningboard
								platformPlanningBoardDataService.getPlanningBoardDataServiceBySupplierServiceName('ppsEngDetailerPlanningBoardSupplierService').load();
							}
						};

						roleSelectionTool[0].list.items.push(roleItem);
					});

					roleTools = roleSelectionTool[0];
					return defer.resolve(roleSelectionTool[0]);
				}
			});

			return defer.promise;
		};

		_self.role = function role(role) {
			if (!_.isUndefined(role)) {
				_self.selectedRole = role;
			}
			// return first entry on default if no role is selected
			return (!_.isNil(_self.selectedRole)) ? _self.selectedRole : roleTools.list.items[0];
		};

	}
})(angular);