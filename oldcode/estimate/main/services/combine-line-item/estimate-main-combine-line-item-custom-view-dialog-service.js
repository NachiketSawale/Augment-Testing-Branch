/**
 * Created by salopek on 02/06/2019.
 */

(function() {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	/* jshint -W035 */
	angular.module(moduleName).factory('estimateMainCombineLineItemCustomViewDialogService', ['$injector', '$q', '$http', '$translate',
		'platformTranslateService', 'platformModalService', 'platformDataValidationService', 'platformDialogService',
		function ($injector, $q, $http, $translate, platformTranslateService, platformModalService, platformDataValidationService, platformDialogService) {
			let service = {};

			service.showCustomCombinedViewDialog = function showCustomCombinedViewDialog() {
				let currentCustomView = {};

				let options = {
					headerText$tr$: 'estimate.main.combineLineItems.customCombinedView',
					// bodyText$tr$: 'cloud.desktop.deleteBodyText',
					customViewText$tr$: $translate.instant('estimate.main.combineLineItems.customView'),
					showOkButton: true,
					showCancelButton: true,
					resizeable: true,
					dataItem: { // this values are used by the custom body template
						iconClass: 'ico-question',
						currentCustomView: currentCustomView
					},
					bodyTemplateUrl: globals.appBaseUrl + 'estimate.main/templates/combine-line-item/estimate-main-combine-line-item-custom-view-dialog-template.html',
					width: '50%'
				};

				return platformDialogService.showDialog(options).then(function (result) {
					return {
						success: !!result.ok,
						currentCustomView: options.dataItem.currentCustomView
					};
				});
			};

			return service;
		}]);
})(angular);
