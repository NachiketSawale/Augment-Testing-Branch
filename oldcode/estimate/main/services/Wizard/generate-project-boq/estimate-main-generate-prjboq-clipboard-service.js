/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global Platform */
	'use strict';

	let moduleName = 'estimate.main';



	angular.module(moduleName).factory('estimateMainGeneratePrjboqClipboardService', ['globals', '$http', '$injector', 'platformDragdropService',
		'boqMainCommonService',
		function (globals,  $http, $injector, platformDragdropService,
			boqMainCommonService) {

			let clipboard = {type: null, data: null, cut: false};
			let service = {};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onPostClipboardError = new Platform.Messenger();

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			service.doCanPaste = function doCanPaste(canPastedContent, type, selectedItem){
				let result = false;

				if(type === 'wicitem' && canPastedContent.data && canPastedContent.data.length === 1 && selectedItem && selectedItem.IsWicItem){

					let sourceBoq = canPastedContent.data[0];
					if(sourceBoq.BoqLineTypeFk === selectedItem.BoqLineTypeFk && !sourceBoq.IsWicItem && !boqMainCommonService.isDivisionOrRoot(selectedItem)){
						result = true;
					}
				}

				return result;
			};

			/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
			service.canPaste = function canPaste(type, selectedItem ) {
				service.doCanPaste({type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy},
				type, selectedItem);
			};

			/**
			 * @ngdoc function
			 * @name cut
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description adds the item to the cut clipboard
			 * @returns
			 * @param items
			 * @param type
			 */
			service.cut = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
			};

			/**
			 * @ngdoc function
			 * @name copy
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description adds the item to the copy clipboard
			 * @returns
			 * @param items
			 * @param type
			 */
			service.copy = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
			};
			/**
			 * @ngdoc function
			 * @name doPaste
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @returns
			 * @param pastedContent
			 * @param selectedItem
			 * @param type
			 * @param onSuccess
			 * @param targetService
			 */
			service.doPaste = function doPaste (pastedContent, selectedItem, type, onSuccess,targetService) {

				let sourceBoq = pastedContent.data[0];

				selectedItem.MatchRefNo = sourceBoq.Reference;
				targetService.gridRefresh();

				clearClipboard();
			};

			/*
			 service.doMove = function doMove(destItems) {
				if( !(angular.isArray(destItems) && destItems.length>0)){
					return;
				}
			};
			service.doCopy = function doCopy(selectedItem,target,toItemId,sourceItemId,type,pastedContent) {
				if(!(!_.isEmpty(pastedContent.data) && pastedContent.data.length > 0)){
					return;
				}
			};
			*/

			/**
			 * @ngdoc function
			 * @name paste
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @returns
			 * @param selectedItem
			 * @param type
			 * @param onSuccess
			 */
			service.paste = function (selectedItem, type, onSuccess) {
				service.doPaste({type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy},
				selectedItem, type, onSuccess);
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
				clearClipboard();
			};

			service.clipboardHasData = function () {
				return clipboard.data !== null;
			};

			function add2Clipboard(node, type) {

				clipboard.type = type;
				clipboard.data = angular.copy(node);

				service.clipboardStateChanged.fire();
			}

			function clearClipboard() {
				clipboard.type = null;
				clipboard.data = null;
				service.clipboardStateChanged.fire();
			}

			return service;

		}

	]);

})(angular);


