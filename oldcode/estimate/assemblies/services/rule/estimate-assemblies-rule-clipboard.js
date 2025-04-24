/**
 * Created by ysl on 5/27/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global Platform */

	let moduleName = 'estimate.assemblies';

	/**
     * @ngdoc service
     * @name estimateAssembliesRuleClipboardService
     * @description provides cut, copy and paste functionality for the assemblies Categories
     */
	angular.module(moduleName).factory('estimateAssembliesRuleClipboardService', [
		function () {

			let clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			let service = {};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onDragStart = new Platform.Messenger();
			service.onDragEnd = new Platform.Messenger();
			service.onDrag = new Platform.Messenger();

			function isFilterStructureType(type) {
				return [''].indexOf(type) >= 0;// here you can define the dragdrop item that you want,'defined' is a demo
			}

			let add2Clipboard = function (node, type) {
				clipboard.type = type;
				clipboard.data = angular.copy(node);
				clipboard.dataFlattened = [];
				service.clipboardStateChanged.fire();
			};

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			service.canDrag = function canDrag() {
				return true;
			};

			service.canPaste = function(type) {
				return isFilterStructureType(type);
			};

			service.copy = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = false;
			};


			service.getClipboard = function () {
				return clipboard;
			};

			service.fireOnDragStart = function () {
				service.onDragStart.fire();
			};

			service.fireOnDragEnd = function (e, arg) {
				service.onDragEnd.fire(e, arg);
			};

			service.fireOnDrag = function (e, arg) {
				service.onDrag.fire(e, arg);
			};

			service.clearClipboard = function () {
				clipboard.type = clipboard.data = clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			};

			service.clipboardHasData = function () {
				return clipboard.data !== null;
			};

			return service;
		}
	]);

})();

