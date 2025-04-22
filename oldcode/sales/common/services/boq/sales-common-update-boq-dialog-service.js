/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {

	'use strict';

	var moduleName = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonUpdateBoqDialogService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * salesCommonUpdateBoqDialogService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('salesCommonUpdateBoqDialogService', [
		'globals', '$q', '$translate', 'platformModalService',
		function (globals, $q, $translate,  platformModalService) {

			return {
				showDialog: showDialog
			};

			// show the dialog
			function showDialog() {
				var defer = $q.defer();
				var defaultOptions = {
					headerText: $translate.instant('sales.common.wizard.updateBoq'),
					templateUrl: globals.appBaseUrl + 'sales.common/templates/sales-common-update-boq-wizard.html',
					backdrop: false,
					uuid: '0F5AD32605414F01B4E9120ACA41640A'
				};

				platformModalService.showDialog(defaultOptions).then(function (result) {
					defer.resolve(result);
				});

				return defer.promise;

			}
		}
	]);
})(angular);

