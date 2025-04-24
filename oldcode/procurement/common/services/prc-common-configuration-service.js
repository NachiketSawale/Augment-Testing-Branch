/**
 * Created by wui on 3/25/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcCommonConfigurationService', ['platformModalService',
		function (platformModalService) {
			var service = {};

			service.overrideHeaderTextConfirm = function () {
				return platformModalService.showYesNoDialog('procurement.common.overrideHeaderNItemTextQuestion', 'procurement.common.wizard.change.configuration.headerText');
			};

			return service;
		}
	]);

})(angular);