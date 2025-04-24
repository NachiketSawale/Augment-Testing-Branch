/**
 * Created by lvy on 5/24/2018.
 */
/* global globals */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainResetInstanceParametersWizardService
	 * @function
	 * @requires
	 *
	 * @description
	 * #
	 * construnctionsystem.main wizard 'reset instance parameter' service.
	 */
	angular.module(moduleName).factory('constructionSystemMainResetInstanceParametersWizardService', [
		'_', '$translate', '$http', 'platformModalService', 'constructionSystemMainHeaderService', 'constructionSystemMainInstanceService',
		function (_, $translate, $http, platformModalService, constructionSystemMainHeaderService, constructionSystemMainInstanceService) {
			var service = {};
			service.resetInstanceParameters = resetInstanceParameters;
			function resetInstanceParameters() {
				constructionSystemMainInstanceService.updateAndExecute(function () {
					var cosInstances = _.filter(constructionSystemMainInstanceService.getList(), {IsChecked: true});
					if (_.isEmpty(cosInstances)) {
						return platformModalService.showDialog({
							headerTextKey: 'cloud.common.informationDialogHeader',
							bodyTextKey: 'constructionsystem.main.assignObjectsBySelectionStatement.mustCheck',
							iconClass: 'ico-info'
						});
					}
					var data = [];

					angular.forEach(cosInstances, function (item) {
						data.push({
							Id: item.Id,
							Code: item.Code,
							DescriptionInfo: item.DescriptionInfo,
							Description: item.DescriptionInfo.Translated
						});
					});

					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'constructionsystem.main/templates/constructionsystem-reset-instance-parameters-dialog.html',
						backdrop: false,
						headerTextKey: 'constructionsystem.main.resetInstanceParameters.title',
						data: data
					});
				});
			}
			return service;
		}
	]);
})(angular);