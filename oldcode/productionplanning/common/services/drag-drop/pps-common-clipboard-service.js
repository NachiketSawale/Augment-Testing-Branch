/**
 * Created by las on 12/28/2023.
 */
(function(angular){
	'use strict';

	let moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonClipboardService', ppsCommonClipboardService);

	ppsCommonClipboardService.$inject = ['$injector'];

	function ppsCommonClipboardService($injector) {
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