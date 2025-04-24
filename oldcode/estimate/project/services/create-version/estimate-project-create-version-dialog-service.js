/**
 * Created by lnt on 03/02/2023.
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name estPrjCreateVersionDialogService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * estPrjCreateVersionDialogService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('estPrjCreateVersionDialogService', [
		'$q', '$translate', 'platformModalService',
		function ($q, $translate,  platformModalService) {

			return {
				showDialog: showDialog
			};

			// show the dialog
			function showDialog(data) {

				let defer = $q.defer();

				let defaultOptions = {
					headerText: $translate.instant('estimate.project.createVersion'),
					templateUrl: globals.appBaseUrl + 'estimate.project/templates/estimate-project-create-version-dialog.html',
					resizeable: true,
					uuid: '9e94b8481efa440eaa9968f10a1dd992',   // grid id (uuid)
					generateVersionInfoData: data
				};

				platformModalService.showDialog(defaultOptions).then(function (result) {
					defer.resolve(result);
				});

				return defer.promise;

			}
		}
	]);
})(angular);

