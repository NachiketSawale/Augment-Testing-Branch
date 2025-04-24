/**
 * Created by chi on 12/05/2023.
 */
(function(angular){
	'use strict';

	let moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialClipboardService', basicsMaterialClipboardService);

	basicsMaterialClipboardService.$inject = ['$injector'];

	function basicsMaterialClipboardService($injector) {
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