/**
 * Created by gaz on 04/05/2018.
 */

(function () {

	'use strict';

	var moduleName = 'procurement.package';
	// eslint-disable-next-line no-redeclare
	/* global angular,Platform */
	angular.module(moduleName).factory('procurementPackageItemMaterialAiAdditionService', [
		'_',
		'$q',
		'$http',
		'platformGridAPI',
		function (_,
			$q,
			$http,
			platformGridAPI) {

			var service = {};
			var _gridId = '54578541574a458787927413986A109f';  // selected codes grid
			// var _busyStatus = false;
			service.busyStatusChanged = new Platform.Messenger();
			/* var setBusyStatus = function (newStatus) {
				if (_busyStatus !== newStatus) {
					_busyStatus = newStatus;
					service.busyStatusChanged.fire(_busyStatus);
				}
			}; */

			// needed for code lookup to get used codes
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

			service.init = function () {
				angular.noop();
			};

			return service;

		}
	]);
})(angular);