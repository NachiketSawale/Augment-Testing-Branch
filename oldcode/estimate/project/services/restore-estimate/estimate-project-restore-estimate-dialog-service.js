/**
 * Created by lnt on 27/02/2023.
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name estPrjRestoreEstimateDialogService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * estPrjRestoreEstimateDialogService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('estPrjRestoreEstimateDialogService', [
		'$q', '$translate', 'platformModalService', 'platformDataValidationService',
		function ($q, $translate,  platformModalService) {

			return {
				showDialog: showDialog
			};

			// show the dialog
			function showDialog(data) {

				let defer = $q.defer();

				let defaultOptions = {
					headerText: $translate.instant('estimate.project.restoreVersionEstimate'),
					templateUrl: globals.appBaseUrl + 'estimate.project/templates/estimate-project-restore-estimate-dialog.html',
					resizeable: true,
					uuid: 'bbb3c93eD9f041949494e2cfd67c738a',
					restoreVersionInfoData: data
				};

				platformModalService.showDialog(defaultOptions).then(function (result) {
					defer.resolve(result);
				});

				return defer.promise;

			}

		}
	]);
})(angular);

