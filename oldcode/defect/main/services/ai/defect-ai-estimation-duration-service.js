/**
 * Created by gaz on 04/05/2018.
 */

(function () {

	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,Platform */

	var moduleName = 'defect.main';

	/**
	 * @ngdoc service
	 * @name defectAiEstimateDurationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('defectAiEstimateDurationService', [
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
			var _gridId = 'C2C170A8C20D411B8B3F7AD1C3214091';
			var _durationBusyStatus = false;
			service.busyStatusChanged = new Platform.Messenger();
			var setBusyStatus = function (newStatus) {
				if (_durationBusyStatus !== newStatus) {
					_durationBusyStatus = newStatus;
					service.busyStatusChanged.fire(_durationBusyStatus);
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
