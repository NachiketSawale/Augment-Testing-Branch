/**
 * Created by Amol on 16/05/2023.
 */

(function () {

	/* global Platform, globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name wizardGroupClipboardService
	 * @description provides cut, copy and paste functionality for the grid
	 */
	var moduleName = 'basics.config';

	angular.module(moduleName).factory('wizardGroupClipboardService', WizardGroupClipboardService);

	WizardGroupClipboardService.$inject = ['$http', 'platformDragdropService', 'basicsConfigWizardGroupService', 'basicsConfigMainService', 'basicsConfigWizardXGroupService'];

	function WizardGroupClipboardService($http, platformDragdropService, basicsConfigWizardGroupService, basicsConfigMainService, basicsConfigWizardXGroupService) {

		var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
		var service = {};

		// events
		service.onDragStart = new Platform.Messenger();
		service.onDragEnd = new Platform.Messenger();
		service.onDrag = new Platform.Messenger();

		var postClipboard = function (targetId, targetPackage, action, type, data, onSuccessCallback) {
			if (!targetId) {
				targetId = null;
			}
			var api = action === platformDragdropService.actions.move ? 'move' : 'copy';
			var url = 'basics/config/wizard2group/';

			$http.post(globals.webApiBaseUrl + url + 'copyWizardGroup?targetId=' + targetId + '&isMoveOrCopyWizardGroup=' + api,
				data)
				.then(function onSuccess(response) {
					onSuccessCallback(response);

					basicsConfigWizardGroupService.load()
					.then(function () {
						return basicsConfigWizardGroupService.setSelected(targetPackage);
					})
					.then(function () {
						return basicsConfigWizardXGroupService.load();
					})
					.then(function () {
						return basicsConfigWizardXGroupService.setSelected(response.data);
					})
					.catch(function (error) {
						console.error('An error occurred:', error);
					});

				})
				.catch(function onError(response) {
					service.onPostClipboardError.fire(response);
				});
		};

		/**
		 * @ngdoc function
		 * @name doPaste
		 * @function
		 * @methodOf wizardGroupClipboardService
		 * @description move or copy the clipboard to the selected template group
		 * @param {object} pastedContent template group selected node
		 * @returns
		 */
		service.doPaste = function doPaste(pastedContent, targetPackage, type, onSuccess) {
			if (!targetPackage) {
				return;
			}

			var pastedData = angular.copy(pastedContent.data);

			if (angular.isArray(pastedData) && pastedData.length > 0) {
				// send changes to the server
				postClipboard(targetPackage.Id, targetPackage, pastedContent.action, pastedContent.type, pastedData, function () {
					onSuccess(basicsConfigWizardGroupService.setSelected(targetPackage));   // callback on success
				});
			}
		};

		/**
		 * @ngdoc function
		 * @name paste
		 * @function
		 * @methodOf wizardGroupClipboardService
		 * @description move or copy the clipboard to the selected template group
		 * @returns
		 */
		service.paste = function (targetPackage, targetType, onSuccess) {
			service.doPaste({
				type: clipboard.type,
				data: clipboard.data,
				action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
			},
			targetPackage, targetType, onSuccess);
		};

		/**
		 * @ngdoc function
		 * @name doCanPaste
		 * @function
		 * @methodOf wizardGroupClipboardService
		 * @description check if the copied data can be moved or copied to the targetPackage
		 * @returns
		 */
		service.doCanPaste = function doCanPaste(canPastedContent, type, targetPackage) {
			var result = true;
			if (canPastedContent.type !== 'wizardToGroup') {
				return false;
			}

			if(!angular.isDefined(canPastedContent.data[0]))
			{
				return false;
			}

			var dragedPackage = canPastedContent.data[0];

			if( !angular.isDefined(targetPackage) || targetPackage && targetPackage.WizardGroupFk === dragedPackage.WizardGroupFk){
				return false;
			}

			if(targetPackage && targetPackage.Id === dragedPackage.WizardGroupFk){
				return false;
			}

			return result;
		};

		/**
		 * @ngdoc function
		 * @name canPaste
		 * @function
		 * @methodOf wizardGroupClipboardService
		 * @description check if the copied data can be moved or copied to the target Package
		 * @returns
		 */
		service.canPaste = function (type, selectedPackage) {
			return service.doCanPaste({
				type: clipboard.type,
				data: clipboard.data,
				action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
			},
			type, selectedPackage);
		};

		service.fireOnDragStart = function fireOnDragStart() {
			service.onDragStart.fire();
		};

		service.fireOnDragEnd = function fireOnDragEnd(e, arg) {
			service.onDragEnd.fire(e, arg);
		};

		service.fireOnDrag = function fireOnDragEnd(e, arg) {
			service.onDrag.fire(e, arg);
		};

		return service;
	}

})(angular);