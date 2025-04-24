/**
 * Created by Shankar on 01/16/2024.
 */
(function (angular) {
	'use strict';

	let moduleName = 'logistic.common';

	angular.module(moduleName).factory('resourceCommonDragDropService', resourceCommonDragDropService);

	resourceCommonDragDropService.$inject = ['$injector'];

	function resourceCommonDragDropService($injector) {
		let service = {};

		service.setClipboardMode = setClipboardMode;
		service.canDrag = canDrag;
		service.doCanPaste = doCanPaste;
		service.copy = copy;
		service.doPaste = doPaste;

		return service;

		function setClipboardMode(/* cut */) {

		}

		function canDrag(type) {
			return true;
		}

		function doCanPaste(obj, type, item/* , itemService */) {
			return false;
		}

		function copy(/* items, type, itemService */) {
		}

		function doPaste(obj, item, type/* , callback */) {
		}
	}

})(angular);