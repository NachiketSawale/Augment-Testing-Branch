/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformMasterDetailDialogService
	 * @function
	 *
	 * @description Displays a modal dialog box with a list from which one out of various sub-pages displayed next to
	 *              that list can be chosen.
	 */
	angular.module('platform').factory('platformMasterDetailDialogService',
		platformMasterDetailDialogService);

	platformMasterDetailDialogService.$inject = ['_', 'platformDialogService'];

	function platformMasterDetailDialogService(_, platformDialogService) {
		const service = {};

		service.showDialog = function (dialogOptions) {
			const dlgConfig = {
				width: dialogOptions.width || '700px',
				resizeable: dialogOptions.resizeable,
				height: dialogOptions.height || '450px',
				headerText$tr$: dialogOptions.dialogTitle,
				bodyTemplateUrl: globals.appBaseUrl + 'app/components/masterdetaildialog/partials/master-detail-dialog-body-template.html',
				backdrop: dialogOptions.backdrop,
				showOkButton: true,
				showCancelButton: true,
				value: dialogOptions,
				controller: dialogOptions.controller,
				windowClass: dialogOptions.windowClass
			};

			if (dialogOptions.footerTemplateUrl) {
				dlgConfig.footerTemplateUrl = dialogOptions.footerTemplateUrl;
			}

			if (dialogOptions.headerTemplateUrl) {
				dlgConfig.headerTemplateUrl = dialogOptions.headerTemplateUrl;
			}

			return platformDialogService.showDialog(dlgConfig);
		};

		return service;
	}
})(angular);
