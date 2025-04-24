/**
 * Created by chi on 12/04/2023.
 */
(function(angular) {
	'use strict';

	let moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainClipboardService', businessPartnerMainClipboardService);

	businessPartnerMainClipboardService.$inject = [];

	function businessPartnerMainClipboardService() {
		let service = {};

		service.setClipboardMode = setClipboardMode;
		service.canDrag = canDrag;
		service.doCanPaste = doCanPaste;
		service.copy = copy;
		service.doPaste = doPaste;

		return service;

		function setClipboardMode() {

		}

		function canDrag() {
			return true;
		}

		function doCanPaste() {
			return false;
		}

		function copy() {
		}

		function doPaste() {
		}
	}

})(angular);