/*
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.workflow';

	angular.module(moduleName).factory('basicsWorkflowClipboardService', basicsWorkflowClipboardService);

	basicsWorkflowClipboardService.$inject = [];

	function basicsWorkflowClipboardService() {
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