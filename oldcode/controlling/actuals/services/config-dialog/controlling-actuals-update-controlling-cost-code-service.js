/**
 * Created by xia on 4/16/2018.
 */
(function () {

	'use strict';

	var moduleName = 'controlling.actuals';

	angular.module(moduleName).factory('controllingActualsUpdateControllingCostCodesService', ['globals', '$http', 'platformTranslateService',
		'platformModalService', '$translate', 'controllingActualsCostHeaderListService',
		function (globals, $http, platformTranslateService, platformModalService, $translate, mainService) {

			var service = {};
			var self = service;

			self.showCreateDialog = function showCreateDialog() {
				var headerId = mainService.getSelectedCostHeaderItem();
				platformModalService.showYesNoDialog(
					$translate.instant('controlling.actuals.updateControllingCostCodes') + ' ' + headerId.Code + '?',
					$translate.instant('controlling.actuals.updateControllingCostCodesTitle'), 'yes'
				).then(function (result) {
					if (result.yes) {
						$http.post(globals.webApiBaseUrl + 'controlling/actuals/wizard/updatecontrollingcostcodes?headerId=' + headerId.Id)
							.then(function () {
								mainService.callRefresh();
							});
					}

				});
			};

			service.showDialog = function showDialog() {
				self.showCreateDialog();
			};

			return service;
		}]);

})(angular);
