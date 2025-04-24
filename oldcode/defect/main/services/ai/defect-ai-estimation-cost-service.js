/**
 * @author: chd
 * @date: 5/20/2021 10:23 AM
 * @description:
 */
(function () {

	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,Platform */

	var moduleName = 'defect.main';

	/**
	 * @ngdoc service
	 * @name defectAiEstimateCostService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('defectAiEstimateCostService', [
		'_',
		'platformGridAPI',
		'platformRuntimeDataService',
		'PlatformMessenger',
		function (_,
			platformGridAPI,
			platformRuntimeDataService,
			PlatformMessenger
		) {

			var service = {
				listLoaded: new PlatformMessenger()
			};
			var _gridId = 'E2C170A8D20D412B9B3F7AD1C3214092';
			var _costBusyStatus = false;
			service.busyStatusChanged = new Platform.Messenger();
			var setBusyStatus = function (newStatus) {
				if (_costBusyStatus !== newStatus) {
					_costBusyStatus = newStatus;
					service.busyStatusChanged.fire(_costBusyStatus);
				}
			};

			service.set = function () {
				setBusyStatus(true);
			};

			service.getList = function () {
				return platformGridAPI.items.data(_gridId);
			};

			var selectedId = null;
			service.getSelectedId = function () {
				return selectedId;
			};
			service.setSelectedId = function (id) {
				selectedId = id;
			};

			service.gridRefresh = function () {
				platformGridAPI.grids.invalidate(_gridId);
			};

			service.init = function () {
				angular.noop();
			};

			return service;

		}
	]);
})(angular);
