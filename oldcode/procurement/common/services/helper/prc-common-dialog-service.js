/*
 * $Id: prc-common-dialog-service.js
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name procurementCommonDialogService
	 * @function
	 * @requires _
	 * @description
	 * procurementCommonDialogService provides support for show dialog
	 */
	var moduleName = 'procurement.common';
	angular.module(moduleName).service('procurementCommonDialogService', procurementCommonDialogService);

	procurementCommonDialogService.$inject = ['platformTranslateService', 'platformDialogService', 'errorDialogService',
		'$translate'];

	function procurementCommonDialogService(platformTranslateService, platformDialogService, errorDialogService, $translate) { // jshint ignore:line
		this.showErrorDialog = function showErrorDialog(rejection) {
			errorDialogService.addException(rejection);

			let ex = errorDialogService.getLastException(true);
			let bodyText = $translate.instant(moduleName + '.selectionDeleteFail') +
				'<br /><b>Attention:</b>' + ex.errorCodeMessage();

			let customOptions = {
				bodyTemplateUrl: 'dialog/detail-msgbox-template.html',
				windowClass: 'error-dialog',
				width: '700px',
				bodyFlexColumn: true,
				bodyMarginLarge: true,
				resizeable: true,
				headerText$tr$: 'cloud.common.errorDialogTitle',
				bodyText: bodyText,
				iconClass: 'warning',
				dataItem: {
					exception: ex
				},
				details: {
					type: 'template',
					templateUrl: globals.appBaseUrl + 'app/components/modaldialog/error-dialog-template.html',
					cssClass: 'longtext'
				},
				buttons: [{
					id: 'ok'
				}],
				customButtons: [platformDialogService.assets.buttons.getShowDetails({
					show: (info) => {
						let exception = _.get(info, 'modalOptions.dataItem.exception');
						if (exception) {
							return (exception.detailMessage || exception.errorDetail || exception.detailMethod || exception.detailStackTrace);
						}

						return false;
					}
				}), platformDialogService.assets.buttons.getCopyToClipboard(function (info) {
					return JSON.stringify(info.modalOptions.dataItem.exception);
				}, {
					tooltip$tr$: 'cloud.common.copyToClipboardTooltip',
					processSuccess: (info, msgKey) => {
						let fn = _.get(info, 'scope.dialog.setAlarm');
						if (_.isFunction(fn)) {
							fn(msgKey);
						}
					}
				})]
			};

			return showWithDetails(customOptions);
		};

		function showWithDetails(customOptions) {
			let dialogProperties = {
				details: {
					show: _.get(customOptions, 'details.show', false),
					texts: [platformTranslateService.instant('cloud.common.showDetails', undefined, true),
						platformTranslateService.instant('cloud.common.hideDetails', undefined, true)],
					type: _.get(customOptions, 'details.type')
				}
			};

			if (_.findIndex(customOptions.customButtons, {id: 'showDetails'}) < 0 &&
				_.findIndex(customOptions.buttons, {id: 'showDetails'}) < 0) {
				if (!customOptions.customButtons) {
					customOptions.customButtons = [];
				}

				customOptions.customButtons.unshift(platformDialogService.assets.buttons.getShowDetails({
					caption$tr$: '',
					caption: dialogProperties.details.texts[+customOptions.details.show]
				}));
			}

			return platformDialogService.showDialog(customOptions, dialogProperties);
		}
	}
})();
