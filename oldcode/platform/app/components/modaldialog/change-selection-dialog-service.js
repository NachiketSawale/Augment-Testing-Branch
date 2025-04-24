((angular) => {
	'use strict';

	function changeSelectionDialog(_, platformDialogService) {

		function showDialog(customModalOptions) {

			let finalOptions = {
				id: _.get(customModalOptions, 'id'),
				headerText$tr$: _.get(customModalOptions, 'headerText$tr$', 'platform.dialogs.changeSelection.headerText'),
				bodyText$tr$: _.get(customModalOptions, 'bodyText$tr$', 'platform.dialogs.changeSelection.bodyText'),
				iconClass: 'ico-warning',
				buttons: [{id: 'yes'}, {id: 'cancel'}],
				defaultButtonId: 'yes',
				dontShowAgain: _.get(customModalOptions, 'dontShowAgain')
			};

			return platformDialogService.showDialog(finalOptions);
		}

		return {
			/**
			 * @ngdoc function
			 * @name showDialog
			 * @function
			 * @methodOf platformChangeSelectionDialogService
			 * @description Show a dialog to change a selection
			 * @param {(object)} customModalOptions The options for the modal dialog. See http://rib-s-wiki01.rib-software.com/cloud/wiki/32/ui-dialog for more information.
			 * @returns {result} Returns the result of the dialog.
			 */
			showDialog: showDialog
		};
	}

	changeSelectionDialog.$inject = ['_', 'platformDialogService'];

	/**
	 * @ngdoc service
	 * @name platformChangeSelectionDialogService
	 * @function
		 * @requires _
		 * @description The platformChangeSelectionDialogService provides a common dialog to change a selection
		 */
	angular.module('platform').factory('platformChangeSelectionDialogService', changeSelectionDialog);
})(angular);
