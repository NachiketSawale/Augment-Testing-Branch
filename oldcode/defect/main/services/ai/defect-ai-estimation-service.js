/**
 * Created by gaz on 04/05/2018.
 */
/* global  Platform */
(function () {

	'use strict';

	var moduleName = 'defect.main';

	/**
	 * @ngdoc service
	 * @name defectAiEstimateService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('defectAiEstimateService', [
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
			var _busyStatus = false;
			service.busyStatusChanged = new Platform.Messenger();
			var setBusyStatus = function (newStatus) {
				if (_busyStatus !== newStatus) {
					_busyStatus = newStatus;
					service.busyStatusChanged.fire(_busyStatus);
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
