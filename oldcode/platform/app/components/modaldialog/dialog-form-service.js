/**
 * Created by alisch on 24.09.2020.
 */
(function () {
	'use strict';

	function dialogFormService(_, dialogService, platformRuntimeDataService, $injector, platformTranslateService) {
		var service = {
			showDialog: show,
			/**
			 * @ngdoc function
			 * @name hasFormErrors
			 * @function
			 * @methodOf dialogFormService
			 * @description Returns whether the form has errors by checking the validators
			 * @param { object } Info The info object from the dialog. It must contains modalOptions and value.
			 * @returns { boolean } True, if the form has any errors.
			 */
			hasFormErrors: hasFormErrors,
			/**
			 * @ngdoc function
			 * @name hasRowErrors
			 * @function
			 * @methodOf dialogFormService
			 * @description Returns whether the row has errors by checking its validator
			 * @param { object } value The value object of the dialogs form. among others it can be found in the info object.
			 * @param { string } rowId The row id (rid). It is set by the definition of the rows in the formconfig.
			 * @returns { boolean } True, if the row has any errors.
			 */
			hasRowErrors: hasRowErrors,
			assets: {}
		};

		/**
		 * @ngdoc function
		 * @name showErrorDialog
		 * @methodOf platform.platformDialogFormService
		 * @description An extended dialog to display an exception to user
		 * @param {(object)} exception the thrown error.
		 * @returns {result} returns the result of the dialog
		 */
		function show(modalOptions) {
			// standard dialog options, different to the default of dialog-service.js
			var finalModalOptions = {
				// indicates whether the dialog can be resized
				resizeable: _.get(modalOptions, 'resizeable', true),
				// The template for the body area of the dialog content (body). If both "bodyTemplateUrl" and "bodyTemplate" is set, bodyTemplate wins.
				// bodyTemplate: '<div data-platform-form-container data-form-container-options="dialog.modalOptions.formConfig" entity="dialog.modalOptions.value" class="flex-element flex-basis-auto"></div>',
				bodyTemplate: '<div data-platform-form data-form-options="dialog.modalOptions.formConfig" data-entity="dialog.modalOptions.value" class="filler"></div>',

				// the X Button in the default header to close the dialog (same as the cancel button in the footer)
				showCloseButton: _.get(modalOptions, 'showCloseButton', true),
				width: _.get(modalOptions, 'width', '700px'),
				height: _.get(modalOptions, 'height'),
				headerText$tr$: _.get(modalOptions, 'headerText$tr$'),
				headerText: _.get(modalOptions, 'headerText'),
				value: _.get(modalOptions, 'value', {}),
				formConfig: _.get(modalOptions, 'formConfig'),
				dataItem: _.get(modalOptions, 'dataItem', {
					alarm: {}
				}),
				topDescription: _.get(modalOptions, 'topDescription'),
				bottomDescription: _.get(modalOptions, 'bottomDescription'),
				buttons: _.get(modalOptions, 'buttons', [{
					id: 'ok',
					disabled: function isDisabled(info) {
						return hasFormErrors(info);
					}
				}, {
					id: 'cancel'
				}
				]),
				customButtons: _.get(modalOptions, 'customButtons', undefined)
			};

			platformTranslateService.translateFormConfig(_.get(finalModalOptions, 'formConfig.configure', {}));
			return dialogService.showDialog(finalModalOptions);
		}

		function hasFormErrors(info) {
			if (_.isUndefined(info)) {
				return false;
			}

			var rows = _.keys(_.get(info, 'modalOptions.formConfig.configure.rowsDict'));
			if (rows.length) {
				for (var i = 0, l = rows.length; i < l; i++) {
					var error = platformRuntimeDataService.hasError(info.value, rows[i]);
					if ((!!error || _.isString(error))) {
						return true;
					}
				}
			}
			return false;
		}

		function hasRowErrors(value, rowId) {
			if (value && _.isString(rowId)) {
				var error = platformRuntimeDataService.hasError(value, rowId);
				if ((!!error || _.isString(error))) {
					return true;
				}
			}
			return false;
		}

		return service;
	}

	dialogFormService.$inject = ['_', 'platformDialogService', 'platformRuntimeDataService', '$injector', 'platformTranslateService'];

	/**
	 * @ngdoc service
	 * @name platform.platformDialogFormService
	 * @function
	 * @description Service for standard modal form dialogs
	 */
	angular.module('platform').service('platformDialogFormService', dialogFormService);
})();
