/**
 * Created by lcn on 8/10/2023.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonRenumberItemService',
		['platformModalService', 'procurementCommonJudgmentTemplateService',
			function (platformModalService, judgmentTemplate) {
				var service = {};
				service.execute = function execute(parentService) {
					let header = parentService.getSelected();
					let extendOption = {
						recordIsReadOnlyBody: 'procurement.common.renumberItem.info'
					};
					let option = {
						templateUrl: globals.appBaseUrl + 'procurement.common/templates/prc-common-renumber-item.html',
						currentItem: header,
						parentService: parentService
					};
					judgmentTemplate.execute(parentService, option, extendOption);

				};
				return angular.extend(service, {});
			}]);
})(angular);