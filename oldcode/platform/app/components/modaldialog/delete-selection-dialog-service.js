(function (angular) {
		'use strict';

		const modulename = 'platform';
		const serviceName = 'platformDeleteSelectionDialogService';

		serviceFunction.$inject = ['_', 'platformDialogService'];

		function serviceFunction(_, platformDialogService) {

			function showDialog(customModalOptions) {
				let finalOptions = {
					id: _.get(customModalOptions, 'id'),
					headerText$tr$: _.get(customModalOptions, 'headerText$tr$', 'platform.dialogs.deleteSelection.headerText'),
					bodyText$tr$: _.get(customModalOptions, 'bodyText$tr$', 'platform.dialogs.deleteSelection.bodyText'),
					iconClass: 'ico-warning',
					buttons: [{id: 'delete'}, {id: 'cancel'}],
					defaultButtonId: 'delete',
					dontShowAgain: _.get(customModalOptions, 'dontShowAgain')
				};

				if (customModalOptions && Object.prototype.hasOwnProperty.call(customModalOptions, 'details')) {
					Object.assign(finalOptions, {
						details: Object.assign(_.get(customModalOptions, 'details'), {type: 'grid'})
					});
					return platformDialogService.showDetailMsgBox(finalOptions);
				}

				return platformDialogService.showDialog(finalOptions);
			}

			return {
				/**
				 * @ngdoc function
				 * @name showDialog
				 * @function
				 * @methodOf platformDeleteSelectionDialogService
				 * @description Show a dialog to delete a selection
				 * @param {(object)} customModalOptions The options for the modal dialog. See http://rib-s-wiki01.rib-software.com/cloud/wiki/32/ui-dialog for more information.
				 * @returns {result} Returns the result of the dialog.
				 */
				showDialog: showDialog
			};
		}

		/**
		 * @ngdoc service
		 * @name platformDeleteSelectionDialogService
		 * @function
		 * @requires _
		 * @description The platformDeleteSelectionDialogService provides a common dialog to delete a selection
		 */
		angular.module(modulename).factory(serviceName, serviceFunction);
	}
)(angular);
