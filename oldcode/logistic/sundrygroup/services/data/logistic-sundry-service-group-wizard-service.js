(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name logisticSundryServiceGroupSidebarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards
	 */
	angular.module('logistic.sundrygroup').factory('logisticSundryServiceGroupSidebarWizardService', ['platformSidebarWizardConfigService','logisticSundryServiceGroupDataService','platformSidebarWizardCommonTasksService',

		function (platformSidebarWizardConfigService, logisticSundryServiceGroupDataService, platformSidebarWizardCommonTasksService) {

			var service = {};

			var disableSundryServiceGroup;
			disableSundryServiceGroup = function disableSundryServiceGroup() {
				return platformSidebarWizardCommonTasksService.provideDisableInstance(logisticSundryServiceGroupDataService, 'Disable Group', 'logistic.sundrygroup.disableSundryServiceGroup', 'Code',
					'logistic.sundrygroup.disableSundryServiceGroupDone', 'logistic.sundrygroup.sundryServiceGroupAlreadyDisabled', 'code', 1);
			};
			service.disableSundryServiceGroup = disableSundryServiceGroup().fn;

			var enableSundryServiceGroup;
			enableSundryServiceGroup = function enableSundryServiceGroup() {
				return platformSidebarWizardCommonTasksService.provideEnableInstance(logisticSundryServiceGroupDataService, 'Enable Group', 'logistic.sundrygroup.enableSundryServiceGroup', 'Code',
					'logistic.sundrygroup.enableSundryServiceGroupDone', 'logistic.sundrygroup.sundryServiceGroupAlreadyEnabled', 'code', 2);
			};
			service.enableSundryServiceGroup = enableSundryServiceGroup().fn;

			return service;
		}

	]);
})(angular);
