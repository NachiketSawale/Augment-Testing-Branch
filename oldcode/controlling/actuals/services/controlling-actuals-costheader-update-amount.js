/**
 * Created by Sambit on 4/06/2021.
 */
(function () {

	'use strict';

	var moduleName = 'controlling.actuals';

	angular.module(moduleName).factory('controllingActualsUpdateCostHeaderAmountService', ['globals', '$http', 'platformTranslateService',
		'platformModalService', '$translate', 'controllingActualsCostHeaderListService',
		function (globals, $http, platformTranslateService, platformModalService, $translate, mainService) {

			var service = {};
			var self = service;

			self.showCreateDialog = function showCreateDialog() {
				var companyId = mainService.getSelected();
				platformModalService.showYesNoDialog(
					$translate.instant('controlling.actuals.updateCostHeaderAmount') + '- Company Code:' + companyId.Code + '?',
					$translate.instant('controlling.actuals.updateCostHeaderAmount'), 'yes'
				).then(function (result) {
					if (result.yes) {
						$http.post(globals.webApiBaseUrl + 'controlling/actuals/wizard/updatecostheaderamount?companyId=' + companyId.CompanyFk)
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
