/**
 * Created by Alm on 12/12/2020.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name materialAlternativeDialogService
     * @function
     * @requires $q
     *
     * @description
     */
	/* jshint -W072 */
	angular.module('basics.material').factory('materialAlternativeDialogService', ['$translate','platformModalService',
		function ($translate,platformModalService) {
			var service = {
				showDialog: showDialog
			};
			function showDialog(customOptions) {
				var headerText= $translate.instant('basics.material.record.alternative')+':'+customOptions.code;
				var defaultOptions = {
					headerText:headerText,
					templateUrl: globals.appBaseUrl + 'basics.material/templates/material-alternative-dialog.html',
					gridData: [],
					width: 'max',
					resizeable: true,
					showCancelButton:true,
					closeButtonText:$translate.instant('basics.common.cancel'),
					maxWidth: '1000px'
				};
				var tempOptions = {};
				angular.extend(tempOptions, defaultOptions, customOptions);
				return platformModalService.showDialog(tempOptions);
			}
			return service;
		}
	]);
})(angular);