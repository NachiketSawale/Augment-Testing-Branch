/**
 * Created by lnt on 11/3/2017.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainRenumberDetailDialogService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * qtoMainRenumberDetailDialogService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('qtoMainRenumberDetailDialogService', [
		'$q', '$translate', 'platformModalService', 'platformDataServiceFactory',
		'qtoMainHeaderDataService', 'platformSidebarWizardCommonTasksService','qtoHeaderReadOnlyProcessor',
		function ($q, $translate,  platformModalService, platformDataServiceFactory,
			qtoMainHeaderDataService, platformSidebarWizardCommonTasksService, qtoHeaderReadOnlyProcessor) {

			return {
				showDialog: showDialog
			};

			// show the dialog
			function showDialog() {
				var selectedQtoHeader = qtoMainHeaderDataService.getSelected(),
					title = 'qto.main.wizard.wizardDialog.renumberQtoDetail',
					msg = $translate.instant('qto.main.wizard.create.wip.NoSelectedQto');

				var qtoStatusItem =qtoHeaderReadOnlyProcessor.getItemStatus(selectedQtoHeader);
				var readOnlyStatus = qtoStatusItem && qtoStatusItem.IsReadOnly;
				selectedQtoHeader = !readOnlyStatus ? selectedQtoHeader : null;
				msg = !readOnlyStatus ? msg : $translate.instant('qto.main.wizard.QtoProved');


				if (platformSidebarWizardCommonTasksService.assertSelection(selectedQtoHeader, title, msg)) {
					var defer = $q.defer();

					var defaultOptions = {
						headerText: $translate.instant('qto.main.wizard.wizardDialog.renumberQtoDetail'),
						templateUrl: globals.appBaseUrl + 'qto.main/templates/qto-main-renumber-detail-dialog.html',
						backdrop: false,
						width: '1200px',
						maxWidth: '1000px',
						uuid: '74c7c9d123c346f79a18ffa18885abf8'   // grid id (uuid)
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

