/**
 * Created by las on 3/12/2018.
 */

(function () {
	'use strict';
	/* global angular, Platform, globals, _*/
	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringTaskClipboardService
	 * @description provides cut and paste functionality for the task container
	 */
	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).factory('productionplanningEngineeringTaskClipboardService', productionplanningEngineeringTaskClipboardService);

	productionplanningEngineeringTaskClipboardService.$inject = ['$http', '$injector', 'platformDragdropService',
		'cloudCommonGridService'];

	function productionplanningEngineeringTaskClipboardService($http, $injector, platformDragdropService,
															   cloudCommonGridService) {

		var locationFilter = 'projectLocation-leadingStructure';
		var clipboard = {type: null, data: null, cut: false, dataFlattened: null, seqNumber: -1};
		var service = {};

		// events
		service.clipboardStateChanged = new Platform.Messenger();
		service.onDragStart = new Platform.Messenger();
		service.onDragEnd = new Platform.Messenger();
		service.onDrag = new Platform.Messenger();
		service.onPostClipboardError = new Platform.Messenger();
		service.onPostClipboardSuccess = new Platform.Messenger();

		var add2Clipboard = function add2Clipboard(leadingStructure, type, seqNumber) {
			clipboard.type = type;
			clipboard.data = angular.copy(leadingStructure);
			clipboard.seqNumber = seqNumber;
			clipboard.dataFlattened = [];
			service.clipboardStateChanged.fire();
		};

		var clearClipboard = function () {
			clipboard.type = null;
			clipboard.data = null;
			clipboard.dataFlattened = null;
			clipboard.seqNumber = -1;
			service.clipboardStateChanged.fire();
		};

		service.setClipboardMode = function (cut) {
			clipboard.cut = cut;
		};

		service.canDrag = function (sourceType) {
			var list = sourceType.split(',');
			var type = list[0];
			if (type === 'ppsItem-leadingStructure' ||
				type === 'prj-leadingStructure' ||
				type === 'lic-leadingStructure' ||
				type === locationFilter ||
				type === 'ctrlUnit-leadingStructure' ||
				type === 'psdActivity-leadingStructure' ||
				type === 'engineeringTask') {
				return true;
			} else {
				return false;
			}
		};

		service.getClipboardMode = function getClipboardMode() {
			return clipboard.cut;
		};

		/**
		 * @ngdoc function
		 * @name cut
		 * @function
		 * @methodOf productionplanningEngineeringTaskClipboardService
		 * @description adds the leading structures to the cut clipboard
		 * @param {leadingStructures}
		 * * @param {type} prj-leadingStructure, lic-leadingStructure, ppsItem-leadingStructure
		 * @returns
		 */
		service.cut = function (leadingStructure, type, seqNumber) {
			add2Clipboard(leadingStructure, type, seqNumber);
			clipboard.cut = true; // set clipboard mode
		};


		/**
		 * @ngdoc function
		 * @name doPaste
		 * @function
		 * @methodOf productionplanningEngineeringTaskClipboardService
		 * @description move or copy the clipboard to the selected template group
		 * @param {object} selected template group selected node
		 * @returns
		 */
		service.doPaste = function doPaste(pastedContent, itemOnDragEnd, targetType, onSuccess, targetService) {
			if (!itemOnDragEnd) {
				return;
			}

			var pastedData = angular.copy(pastedContent.data);

			if (angular.isArray(pastedData) && pastedData.length > 0) {

				var list = pastedContent.type.split(',');
				var type = list[0];
				var seqNumber = list[1];
				switch (type) {
					case 'projectLocation-leadingStructure': {
						itemOnDragEnd.PrjLocationFk = pastedData[0].Id;
					}
						break;
					case 'prj-leadingStructure': {
						var propertyName = 'PrjCostGroup' + seqNumber + 'Fk';
						itemOnDragEnd[propertyName] = pastedData[0].Id;
					}
						break;
					case 'lic-leadingStructure': {
						var costPropertyName = 'LicCostGroup' + seqNumber + 'Fk';
						itemOnDragEnd[costPropertyName] = pastedData[0].Id;
					}
						break;
					case 'ctrlUnit-leadingStructure': {
						itemOnDragEnd.MdcControllingUnitFk = pastedData[0].Id;
					}
						break;
					case 'psdActivity-leadingStructure': {
						itemOnDragEnd.PsdActivityFk = pastedData[0].Id;
					}
						break;
				}

				if (targetType === 'engineeringTask') {
					var engimeeringService = $injector.get('productionplanningEngineeringMainService');
					engimeeringService.markItemAsModified(itemOnDragEnd);
					engimeeringService.update();
				}

				service.fireOnDragEnd(itemOnDragEnd);
				onSuccess(pastedContent.type);   // callback on success
				clearClipboard();
			}

			// Manipulate structure of project locations
			if (itemOnDragEnd && pastedData && _.isArray(pastedData) && pastedContent.type === locationFilter &&
				targetType === locationFilter) {
				postClipboard(itemOnDragEnd.Id, platformDragdropService.actions.move, pastedContent.type, pastedData, function (data) {
						if (pastedContent.action === platformDragdropService.actions.move) {
							targetService.load();
						}
						// callback on success
						onSuccess(targetService.setNewSelected(pastedData, itemOnDragEnd.Id));
						clearClipboard();
					});
			}
		};


		/**
		 * @ngdoc function
		 * @name paste
		 * @function
		 * @methodOf productionplanningEngineeringTaskClipboardService
		 * @description move or copy the clipboard to the selected template group
		 * @returns
		 */
		service.paste = function (targetTask, targetType, onSuccess) {
			service.doPaste({
				type: clipboard.type,
				data: clipboard.data,
				seqNumber: clipboard.seqNumber,
				action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
			}, targetTask, targetType, onSuccess);
		};

		/**
		 * @ngdoc function
		 * @name doCanPaste
		 * @function
		 * @methodOf transportplanningPackageClipboardService
		 * @description check if the copied data can be moved or copied to the cuttargetPackage
		 * @returns
		 */
		service.doCanPaste = function doCanPaste(canPastedContent, targetType, itemOnDragEnd) {
			var result = false;
			if (targetType === 'engineeringTask' && itemOnDragEnd !== null && itemOnDragEnd !== undefined) {
				var list = canPastedContent.type.split(',');
				var type = list[0];
				if (type === 'ppsItem-leadingStructure' ||
					type === 'prj-leadingStructure' ||
					type === 'lic-leadingStructure' ||
					type === 'projectLocation-leadingStructure' ||
					type === 'ctrlUnit-leadingStructure' ||
					type === 'psdActivity-leadingStructure') {
					result = true;
				}
			}

			if(canPastedContent.type === locationFilter && targetType === locationFilter){
				var flatLocations = [];
				var selectedLocation = angular.copy(canPastedContent.data);
				flatLocations = cloudCommonGridService.flatten(selectedLocation, flatLocations, 'Locations');
				result = angular.isDefined(itemOnDragEnd) ? !_.find(flatLocations, {Id: itemOnDragEnd.Id}) : true;
			}

			return result;
		};

		/**
		 * @ngdoc function
		 * @name canPaste
		 * @function
		 * @methodOf transportplanningPackageClipboardService
		 * @description check if the copied data can be moved or copied to the target Package
		 * @returns
		 */
		service.canPaste = function (targetType, targetTask) {
			return service.doCanPaste({
				type: clipboard.type,
				data: clipboard.data,
				seqNumber: clipboard.seqNumber,
				action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
			}, targetType, targetTask);
		};

		service.getClipboard = function getClipboard() {
			return clipboard;
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

		service.clearClipboard = function clearClipboard() {
			clearClipboard();
		};

		service.clipboardHasData = function clipboardHasData() {
			return angular.isDefined(clipboard.data) && (clipboard.data !== null) && angular.isDefined(clipboard.data.length) && (clipboard.data.length > 0);
		};

		function postClipboard (toId, action, type, data, onSuccessCallback) {
			if (!toId) {
				toId = null;
			}
			var api = action === platformDragdropService.actions.move ? 'move' : 'copy';
			var url = 'project/location/';
			var projectId = data[0].ProjectFk;

			$http.post(globals.webApiBaseUrl + url + api + '?toItem=' + toId + '&toProjectId=' + projectId, data)
				.then(function onSuccess(response) {
					onSuccessCallback(response);
				})
				.catch(function onError(response) {
					//console.log(response.data.Exception.Message);
					if(angular.isDefined(response.data.Exception)) {
						service.onPostClipboardError.fire(response);
					}
				});
		}

		return service;
	}

})(angular);