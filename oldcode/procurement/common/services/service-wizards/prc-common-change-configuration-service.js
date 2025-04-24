/**
 * Created by lcn on 8/30/2018.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('ProcurementCommonChangeConfigurationService',
		['_', 'platformModalService', 'procurementCommonJudgmentTemplateService',
			function (_, platformModalService, judgmentTemplate) {
				let service = {};

				service.execute = function execute(parentService, parentValidationService) {
					let validationService = _.isFunction(parentValidationService) ? parentValidationService(parentService) : parentValidationService;
					let header = parentService.getSelected();
					let option = {
						serviceName: parentService.getServiceName(),
						currentItem: header,
						templateUrl: globals.appBaseUrl + 'procurement.common/templates/prc-common-change-configuration-wizard.html',
						parentService: parentService,
						parentValidationService: validationService
					};
					judgmentTemplate.execute(parentService, option);

				};
				return angular.extend(service, {});
			}]);
})(angular);