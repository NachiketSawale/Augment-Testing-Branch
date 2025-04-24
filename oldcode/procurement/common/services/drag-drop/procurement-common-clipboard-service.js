/**
 * Created by chi on 11/30/2023.
 */
(function(angular){
	'use strict';

	let moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonClipboardService', procurementCommonClipboardService);

	procurementCommonClipboardService.$inject = ['$injector'];

	function procurementCommonClipboardService($injector) {
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