/* global Platform */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningCommonClipboardService
	 * @description provides cut, copy and paste functionality for the treeview grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('productionplanning.common').factory('productionplanningCommonClipboardService', ['_', 'projectLocationMainService', '$http', 'platformDragdropService', 'productionplanningCommonLoadSequenceDataService',
		function (_, projectLocationMainService, $http, platformDragdropService, productionplanningCommonLoadSequenceDataService) {

			var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			var service = {};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onDragStart = new Platform.Messenger();
			service.onDragEnd = new Platform.Messenger();
			service.onDrag = new Platform.Messenger();

			service.canDrag = (type) => {
				return true;
			};

			let getChildren = (list, items) => {
				angular.forEach(items, function (item) {
					list.push(item);
					if (item.HasChildren) {
						getChildren(list, item.Items);
					}
				});
			};

			let add2Clipboard = (node, type) => {
				clipboard.type = type;
				clipboard.data = angular.copy(node);
				clipboard.dataFlattened = [];
				for (var i = 0; i < clipboard.data.length; i++) {
					clipboard.dataFlattened.push(clipboard.data[i]);
					if (clipboard.data[i].HasChildren) {
						getChildren(clipboard.dataFlattened, clipboard.data[i].Items);
					}
				}
				service.clipboardStateChanged.fire();
			};

			var clearClipboard = function () {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			};

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut;
			};
			//
			// service.getClipboardMode = function getClipboardMode() {
			// 	return clipboard.cut;
			// };
			//
			/**
			 * @ngdoc function
			 * @name cut
			 * @function
			 * @methodOf productionplanningCommonClipboardService
			 * @description adds the product to the cut clipboard
			 * @param {object} product selected node
			 * @returns
			 */
			service.cut = function (product, type) {
				add2Clipboard(product, type);
				clipboard.cut = true; // set clipboard mode
			};
			//
			// /**
			//  * @ngdoc function
			//  * @name copy
			//  * @function
			//  * @methodOf productionplanningCommonClipboardService
			//  * @description adds the trsPackage to the copy clipboard
			//  * @param {object} trsPackage selected node
			//  * @returns
			//  */
			service.copy = function copy() {
				// add2Clipboard(ppsItems, type);
				// clipboard.cut = true; // set clipboard mode
			};

			/**
			 * @ngdoc function
			 * @name doPaste
			 * @function
			 * @methodOf productionplanningCommonClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
			 */
			service.doPaste = function doPaste(pastedContent, targetContent, type, onSuccess) {
				let toBePasted = pastedContent.data[0];
				let toBePastedTo = targetContent;
				// if the object to be pasted is of same class instance as target object
				if (toBePasted instanceof toBePastedTo.constructor) {
					if (productionplanningCommonLoadSequenceDataService.isInstanceOfProduct(toBePasted)) {
						pastedContent.itemService.moveProductAfterProduct(pastedContent.data, targetContent);
					}
					if (productionplanningCommonLoadSequenceDataService.isInstanceOfLoad(toBePasted)) {
						// move load to after load;
						pastedContent.itemService.moveLoadToLoad(pastedContent.data, targetContent);
					}
					// if class instances of object to be pasted and target object are different
				} else if (productionplanningCommonLoadSequenceDataService.isInstanceOfProduct(toBePasted)) {
					pastedContent.itemService.moveProductToLoad(pastedContent.data, targetContent);
				}
			};

			/**
			 * @ngdoc function
			 * @name paste
			 * @function
			 * @methodOf productionplanningCommonClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @returns
			 */
			service.paste = function (targetLoad, targetType, onSuccess) {
				service.doPaste(
					{
						type: clipboard.type,
						data: clipboard.data,
						action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
					},
					targetLoad, targetType, onSuccess);
			};
			//
			// /**
			//  * @ngdoc function
			//  * @name doCanPaste
			//  * @function
			//  * @methodOf productionplanningCommonClipboardService
			//  * @description check if the copied data can be moved or copied to the targetPackage
			//  * @returns
			//  */
			service.doCanPaste = function doCanPaste(canPastedContent, type, target) {
				let result = false;
				let addedWeight = 0;
				let infotext = '';

				let validData = true;
				canPastedContent.data.forEach(data => {
					if (validData) {
						validData = _.isEqual(canPastedContent.data[0].constructor.name, data.constructor.name);
					}
				});
				if (validData) {
					if (_.has(canPastedContent.data[0], 'children')) {
						infotext = `Moving ${canPastedContent.data.length} load${canPastedContent.data.length > 1 ? 's' : ''}`;
						if (target) {
							// if dragging loads to load
							if (_.has(target, 'children')) {
								// do we need to check against stretch rate?
								result = _.has(target, 'children');
							}
						}
					}

					if (!_.has(canPastedContent.data[0], 'children')) {
						infotext = `Moving ${canPastedContent.data.length} product${canPastedContent.data.length > 1 ? 's' : ''}`;
						if (target) {
							// if dragging products to load
							if (_.has(target, 'children')) {
								addedWeight = target.weight;
								canPastedContent.data.forEach(productToBePasted => {
									addedWeight += productToBePasted.weight;
									result = productionplanningCommonLoadSequenceDataService.options.maxWeight >= addedWeight;
								});
								if (!result) {
									infotext += ' failed! The maximal weight of load exceeded!';
								}
							} else { // if dragging products after product
								// if products moved withing a load - can paste, else check the weight of load of the target
								let loadOfTargetProduct = productionplanningCommonLoadSequenceDataService.getLoadByProduct(target.Id)[0];
								addedWeight = loadOfTargetProduct.weight;
								canPastedContent.data.forEach(productToBePasted => {
									if(!loadOfTargetProduct.children.includes(productToBePasted)) {
										addedWeight += productToBePasted.weight;
									}
									result = productionplanningCommonLoadSequenceDataService.options.maxWeight >= addedWeight;
								});
								if (!result) {
									infotext += ' failed! The maximal weight of load exceeded!';
								}
							}
						}
					}
				} else {
					infotext = 'Invalid selection!';
				}
				platformDragdropService.setDraggedText(infotext);
				return result;
			};

			/**
			 * @ngdoc function
			 * @name canPaste
			 * @function
			 * @methodOf productionplanningCommonClipboardService
			 * @description check if the copied data can be moved or copied to the target Package
			 * @returns
			 */
			service.canPaste = function (type, selectedProduct) {
				return service.doCanPaste(
					{
						type: clipboard.type,
						data: clipboard.data,
						action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
					},
					type, selectedProduct);
			};
			//
			// service.getClipboard = function getClipboard() {
			// 	return clipboard;
			// };
			//
			// service.fireOnDragStart = function fireOnDragStart() {
			// 	service.onDragStart.fire();
			// };
			//
			// service.fireOnDragEnd = function fireOnDragEnd(e, arg) {
			// 	service.onDragEnd.fire(e, arg);
			// };
			//
			// service.fireOnDrag = function fireOnDragEnd(e, arg) {
			// 	service.onDrag.fire(e, arg);
			// };
			//
			// service.clearClipboard = function clearClipboard() {
			// 	clearClipboard();
			// };
			//
			// service.clipboardHasData = function clipboardHasData() {
			// 	return angular.isDefined(clipboard.data) && (clipboard.data !== null) && angular.isDefined(clipboard.data.length) && (clipboard.data.length > 0);
			// };

			return service;
		}
	]);
})(angular);