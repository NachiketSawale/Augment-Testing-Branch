/**
 * Created by zwz on 2/25/2019.
 */
(function (angular) {
	/*global angular, _*/
	'use strict';
	var moduleName = 'transportplanning.transport';

	/**
	 * @ngdoc service
	 * @name transportplanningTransportResRequisitionUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of resource requisition entities
	 */
	angular.module(moduleName).factory('transportplanningTransportResRequisitionUIStandardService', UIStandardService);
	UIStandardService.$inject = ['resourceRequisitionUIStandardService', 'platformModuleNavigationService'];

	function UIStandardService(resourceRequisitionUIStandardService, platformModuleNavigationService) {
		function createUiService(uiStandardService) {
			var columns = _.clone(uiStandardService.getStandardConfigForListView().columns);
			var col = {
				navigator: {
					//modulename can't not equal to "transportplanning.transport" because basic function[platform-grid-domain-service] will check if is current module
					//if is current module,navigator do
					moduleName: 'transportplanning.transport.route',
					navFunc: function (options, entity) {
						//set the real modulename to navigator
						var opt = angular.copy(options);
						opt.navigator.moduleName = 'transportplanning.transport';
						platformModuleNavigationService.navigate(opt.navigator, entity, opt.field || opt.model);
					}
				},
				id: 'trsRouteFk',
				field: 'TrsRouteFk',
				name: 'Transport Route',
				name$tr$: 'transportplanning.transport.entityRoute',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'TrsRoute',
					displayMember: 'Code',
					version: 3,
					width: 140
				}
			};
			columns.splice(0, 0, col);

			return {
				getStandardConfigForListView: function () {
					return {
						addValidationAutomatically: true,
						columns: columns
					};
				}
			};
		}

		return createUiService(resourceRequisitionUIStandardService);
	}
})(angular);
