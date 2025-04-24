// create by lst 2017-08-28 16:49:48
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name constructionSystemMainWizardService
	 * @function
	 * @requires
	 *
	 * @description
	 * #
	 *
	 */
	angular.module(moduleName).factory('constructionSystemMainWizardService', [
		'_', '$translate', '$http', 'platformModalService',
		'constructionSystemMainInstanceService', 'constructionSystemMainJobDataService',
		function (_, $translate, $http, platformModalService,
			constructionSystemMainInstanceService, constructionSystemMainJobDataService) {

			var service = {};

			service.assignObjectsBySelectionStatement = function () {
				var modelId = constructionSystemMainInstanceService.getCurrentSelectedModelId();

				if (modelId === null || modelId === undefined) {
					return platformModalService.showDialog({
						headerTextKey: 'cloud.common.informationDialogHeader',
						bodyTextKey: 'constructionsystem.main.noModel',
						iconClass: 'ico-info'
					});
				}
				else {
					constructionSystemMainJobDataService.createObjectAssignJob();
				}
			};

			// service.assignObjectsBySelectionStatement = function () {
			//    var cosInstances = _.filter(constructionSystemMainInstanceService.getList(), {IsChecked: true});
			//    if (_.isEmpty(cosInstances)) {
			//       return platformModalService.showDialog({
			//       headerTextKey: 'cloud.common.informationDialogHeader',
			//          bodyTextKey: 'constructionsystem.main.assignObjectsBySelectionStatement.mustCheck',
			//          iconClass: 'ico-info'
			//     });
			//   }
			//
			//       var parameter = {
			//       ModelId: constructionSystemMainInstanceService.getCurrentSelectedModelId(),
			//       InstanceIds: _.map(cosInstances, 'Id')
			//    };
			//
			//     constructionSystemMainInstanceService.updateAndExecute(function () {
			//        $http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/assignobjectsbyselectionstatement', parameter).then(function (response) {
			//          var failed = 0, hasData = 1, noData = 2, selectStatementError = 3;
			//          var result = response.data;
			//          if (result === hasData || result === noData) {
			//             if (result === hasData) {
			//                 constructionSystemMainInstance2ObjectService.load();
			//          }
			//
			//                return platformModalService.showDialog({
			//                headerTextKey: 'cloud.common.informationDialogHeader',
			//                bodyTextKey: 'constructionsystem.main.assignObjectsBySelectionStatement.success',
			//                iconClass: 'ico-info'
			//           });
			//           } else if (result === (hasData + selectStatementError) || result === selectStatementError) {
			//             if (result === (hasData + selectStatementError)) {
			//                 constructionSystemMainInstance2ObjectService.load();
			//              }
			//
			//                return platformModalService.showDialog({
			//                headerTextKey: 'cloud.common.informationDialogHeader',
			//                bodyTextKey: 'constructionsystem.main.assignObjectsBySelectionStatement.selectStatementError',
			//                iconClass: 'ico-info'
			//             });
			//           } else if (result === failed) {
			//             return platformModalService.showDialog({
			//                headerTextKey: 'cloud.common.informationDialogHeader',
			//                bodyTextKey: 'constructionsystem.main.assignObjectsBySelectionStatement.failed',
			//                iconClass: 'ico-info'
			//             });
			//           }
			//       });
			//    });
			// };

			service.saveAsTemplate = function () {

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
						templateUrl: globals.appBaseUrl + 'constructionsystem.main/templates/constructionsystem-save-instance-as-template-dialog.html',
						backdrop: false,
						headerTextKey: 'constructionsystem.main.saveAsTemplate.title',
						data: data
					});
				});
			};

			service.inheritCosInstance = function () {
				var cosInstance = constructionSystemMainInstanceService.getSelected();

				if (cosInstance === null || cosInstance === undefined) {
					platformModalService.showMsgBox('constructionsystem.main.inheritCosInstance.selectInstanceHint', 'constructionsystem.main.inheritCosInstance.wizardTitle', 'info');
					return;
				}

				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'constructionsystem.main/templates/inherit-cos-instance-template.html',
					controller: 'cosMainInheritInstanceController',
					resolve: {
						args: [function () {
							return {
								cosInstance: cosInstance
							};
						}]
					}
				}).then(function (/* res */) {

				});
			};

			return service;
		}
	]);
})(angular);