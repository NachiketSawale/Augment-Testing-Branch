/**
 * Created by lnt on 1/29/2018.
 */
(function (angular) {
	/* global  globals */
	'use strict';

	var moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainBulkEditorDialogService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * qtoMainBulkEditorDialogService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('qtoMainBulkEditorDialogService', [
		'$q', '$translate', 'platformModalService', 'platformDataServiceFactory',
		'qtoMainSearchDataDetailDialogService', 'platformSidebarWizardCommonTasksService',
		function ($q, $translate,  platformModalService, platformDataServiceFactory,
			qtoMainSearchDataDetailDialogService, platformSidebarWizardCommonTasksService) {

			return {
				showDialog: showDialog
			};

			// show the dialog
			function showDialog() {
				var selecteditem = qtoMainSearchDataDetailDialogService.dataService.getSelected(),
					title = 'qto.main.wizard.wizardDialog.bulkEditor',
					msg = $translate.instant('qto.main.wizard.wizardDialog.NoSelectedItem');

				if (platformSidebarWizardCommonTasksService.assertSelection(selecteditem, title, msg)) {
					var defer = $q.defer();

					var defaultOptions = {
						headerText: $translate.instant('qto.main.wizard.wizardDialog.bulkEditor'),
						templateUrl: globals.appBaseUrl + 'qto.main/templates/qto-main-bulk-editor-dialog.html',
						backdrop: false,
						width: '500px',
						maxWidth: '1000px',
						uuid: '4601f77e02f7428bb3b167f52195339d'   // grid id (uuid)
					};

					platformModalService.showDialog(defaultOptions).then(function (result) {
						defer.resolve(result);
					});

					return defer.promise;
				}
			}
		}
	]);
})(angular);

