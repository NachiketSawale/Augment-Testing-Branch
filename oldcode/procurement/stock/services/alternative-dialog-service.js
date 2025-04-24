/**
 * Created by Alm on 5/29/2020.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals */

(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name procurementStockAlternativeDialogService
     * @function
     * @requires $q
     *
     * @description
     * #
     * basics Common Materials Portal Dialog Service
     */
	/* jshint -W072 */
	angular.module('procurement.stock').factory('procurementStockAlternativeDialogService', [
		'$q','$injector','$http', '$translate', 'platformModalService',
		function ($q,$injector, $http,$translate, platformModalService) {
			var service = {
				showDialog: showDialog
			};
			function showDialog(customOptions) {
				var defaultOptions = {
					headerTextKey: 'procurement.stock.title.alternative',
					templateUrl: globals.appBaseUrl + 'procurement.stock/templates/alternative-dialog.html',
					gridData: [],
					width: 'max',
					resizeable: true,
					maxWidth: '1000px'
				};

				var tempOptions = {};
				angular.extend(tempOptions, defaultOptions, customOptions);
				platformModalService.showDialog(tempOptions);
			}

			service.noMaterialRecordMessage = function(){
				platformModalService.showMsgBox('procurement.stock.message.noMaterialMessage', 'cloud.common.informationDialogHeader', 'ico-info');
			};

			return service;
		}
	]);
})(angular);