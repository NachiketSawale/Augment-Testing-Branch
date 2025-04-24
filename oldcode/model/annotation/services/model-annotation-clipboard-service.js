/**
 * Created by raj.
 */
(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'model.annotation';

	angular.module(moduleName).factory('modelAnnotationClipboardService', modelAnnotationClipboardService);

	modelAnnotationClipboardService.$inject = ['$injector'];

	function modelAnnotationClipboardService($injector) {
		var service = {};

		service.setClipboardMode = setClipboardMode;
		service.canDrag = canDrag;
		service.doCanPaste = doCanPaste;
		service.copy = copy;
		service.doPaste = doPaste;

		return service;

		// //////////////////////////////

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