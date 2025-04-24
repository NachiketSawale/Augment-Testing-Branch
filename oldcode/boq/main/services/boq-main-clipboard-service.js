(function () {

	/* global Platform, globals, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqMainClipboardService
	 * @description provides cut, copy and paste functionality for the treeview grid
	 */
	angular.module('boq.main').factory('boqMainClipboardService', ['$http', '$injector', 'boqMainCommonService', '$q', 'platformPermissionService', 'platformDialogService', '$translate',
		function ($http, $injector, boqMainCommonService, $q, platformPermissionService, platformDialogService, $translate) {

			var clipboard = {type: null, dataOriginal: null, dataCopy: null, cut: false};
			var sourceBoqMainService = null;
			var targetBoqMainService = null;
			var service = {};
			var currentMouseEvent = null;
			var forceCopy = false; // This parameter being true means that not a CopyOrMove is done on server side, but a CopyBoq.
			var activePasteCounter = 0; // Counts currently active paste calls and helps to avoid execution of parallel pastes that could cause problems with wrongly created reference numbers

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onDragStart = new Platform.Messenger();
			service.onDragEnd = new Platform.Messenger();
			service.onDrag = new Platform.Messenger();
			service.onPostClipboardSuccess = new Platform.Messenger();

			/**
			 * @ngdoc function
			 * @name setClipboardMode
			 * @function
			 * @methodOf boqMainClipboardService
			 * @description set the current clipboard mode telling if cut (clipboard mode is true) or copy (clipboard mode is false) is active
			 * @param {Boolean} cut telling if cut is active or not
			 */
			service.setClipboardMode = function setClipboardMode(cut) {
				if ((sourceBoqMainService !== null) && (sourceBoqMainService.getReadOnly() || !platformPermissionService.hasWrite(sourceBoqMainService.getContainerUUID().toLowerCase()))) {
					clipboard.cut = false; // if the source data service is set to read only mode no cut is allowed
				} else {
					clipboard.cut = cut; // set clipboard mode
				}
			};

			/**
			 * @ngdoc function
			 * @name getClipboardMode
			 * @function
			 * @methodOf boqMainClipboardService
			 * @description return the current clipboard mode telling if cut (clipboard mode is true) or copy () is active (clipboard mode is false)
			 * @returns {Boolean} returns clipboard telling if cut is active or not
			 */
			service.getClipboardMode = function getClipboardMode() {
				if ((sourceBoqMainService !== null) && (sourceBoqMainService.getReadOnly() || !platformPermissionService.hasWrite(sourceBoqMainService.getContainerUUID().toLowerCase()))) {
					return false; // if the source data service is set to read only mode no cut is allowed
				}

				return clipboard.cut;
			};

			/**
			 * @ngdoc function
			 * @name setCurrentMouseEvent
			 * @function
			 * @methodOf boqMainClipboardService
			 * @description set the current mouse event that triggered to drag and drop
			 * @param {object} mouseEvent thats currently active
			 */
			service.setCurrentMouseEvent = function setCurrentMouseEvent(mouseEvent) {
				currentMouseEvent = mouseEvent;
			};

			/**
			 * @ngdoc function
			 * @name getCurrentMouseEvent
			 * @function
			 * @methodOf boqMainClipboardService
			 * @description get the current mouse event that triggered to drag and drop
			 * @returns {object} mouseEvent thats currently active
			 */
			service.getCurrentMouseEvent = function getCurrentMouseEvent(/* mouseEvent */) {
				return currentMouseEvent;
			};
			var add2Clipboard = function add2Clipboard(nodes) {

				if (angular.isArray(nodes) && nodes.length > 0 && _.isObject(nodes[0]) && Object.prototype.hasOwnProperty.call(nodes[0], 'BoqHeaderFk')) {// check that clipboard gets valid data
					clipboard.type = 'boqitem';
					// Sort boq items based on current structure settings
					nodes.sort(sourceBoqMainService !== null ? sourceBoqMainService.compareBoqItemsByReferences : undefined);

					if(sourceBoqMainService !== null) {
						// Group the selected nodes to hava a criteria to avoid the possibly timeconsuming preparation the nodes list if not needed.
						// This preparation is only needed in case of an inhomogeneous list of selected boq items.
						let groupedSelectedBoqTypes = sourceBoqMainService.getGroupedSelectedBoqTypes(nodes);
						let homogeneous = _.isObject(groupedSelectedBoqTypes) ? Object.keys(groupedSelectedBoqTypes).length <= 1 : false;

						if(!homogeneous) {
							// Avoid adding child nodes whose parent nodes are also added, but only in case of having an inhomogeneous list of selected nodes
							nodes = sourceBoqMainService.prepareSelectedBoqItems(nodes);
						}
					}

					clipboard.dataOriginal = nodes; // angular.copy(node);
					if (sourceBoqMainService.isCrbBoq()) {
						// a deep copy is not necessary for the CRB standard
						var clonedBoqItems = [];
						_.forEach(nodes, function (boqItem) {
							clonedBoqItems.push(_.clone(boqItem));
							_.last(clonedBoqItems).BoqItems = [];
						});
						clipboard.dataCopy = clonedBoqItems;
					} else {
						clipboard.dataCopy = _.cloneDeep(nodes);
					}
					service.clipboardStateChanged.fire();
				}
			};

			/**
			 * @ngdoc function
			 * @name cut
			 * @function
			 * @methodOf boqMainClipboardService
			 * @description adds the boqItem to the cut clipboard
			 * @param {object} boqItem selected node
			 * @returns
			 */
			service.cut = function cut(boqItem, type, boqMainService) {

				if (angular.isObject(boqItem)) {
					if (boqMainService.isCrbBoq()) {
						platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
					} else {
						sourceBoqMainService = boqMainService;
						// store a deep clone of the item to cut
						add2Clipboard(boqItem);
						// removeNode(boqItem); --> will be done when paste !
						service.setClipboardMode(true); // set clipboard mode
					}
				} else {
					sourceBoqMainService = null;
				}
			};

			/**
			 * @ngdoc function
			 * @name copy
			 * @function
			 * @methodOf boqMainClipboardService
			 * @description adds the boqItem to the copy clipboard
			 * @param {object} boqItem selected node
			 * @returns
			 */
			service.copy = function copy(boqItem, type, boqMainService) {
				if (boqItem) {
					sourceBoqMainService = boqMainService;
					add2Clipboard(boqItem);
					service.setClipboardMode(false);
				}
				else {
					sourceBoqMainService = null;
				}
			};

			var getPositionInfo = function getPositionInfo() {
				var positionInfo = {before: true, below: false}; // This information comes from the user given by special keyboard keys he uses while doing the paste.
				if (_.isObject(service.getCurrentMouseEvent())) {
					if (service.getCurrentMouseEvent().shiftKey) {
						positionInfo.before = false;
						positionInfo.below = false;
					} else if (service.getCurrentMouseEvent().altKey) {
						positionInfo.before = false;
						positionInfo.below = true;
					}
				}

				return positionInfo;
			};

			/**
			 * @ngdoc function
			 * @name canDrag
			 * @function
			 * @methodOf boqMainClipboardService
			 * @description According to the current state of the drag and drop service return if a drag can be started
			 * @param {string} itemType of a dragged pasted item
			 * @returns {Boolean} returns if a drag can be started
			 */
			service.canDrag = function canDrag(/* itemType */) {
				return activePasteCounter === 0;
			};

			/**
			 * @ngdoc function
			 * @name canPaste
			 * @function
			 * @methodOf boqMainClipboardService
			 * @description check if the copied data can be moved or copied above/below the selectedBoqItem
			 * @param {string} type of pasted item
			 * @param {object} selectedBoqItem selected node
			 * @param {object} boqMainService of destination structure
			 * @param {Boolean} showErrorMessages triggers if error messages are shown when calling can paste of boqMainService
			 * @returns
			 */
			service.canPaste = function canPaste(type, selectedBoqItem, boqMainService, showErrorMessages) {

				if (!selectedBoqItem || activePasteCounter > 0) {
					return false;
				}

				if (clipboard.type === 'boqitem') {

					// Check if target data service exists or if it is set readOnly
					if (!angular.isObject(boqMainService) || (angular.isDefined(boqMainService) && boqMainService !== null && (boqMainService.getReadOnly() || !platformPermissionService.hasWrite(boqMainService.getContainerUUID().toLowerCase())))) {
						return false;
					}

					if (!boqMainService.isDragAndDropAllowed()) {
						return false;
					}

					// Here we handle the special case of copying the source boq as a whole.
					// Currently, we expect the target boq to be a base boq for this makes the process easier, and we expect the source and the target boq to have the same structure definition.
					let sourceBoqStructure = _.isObject(sourceBoqMainService) ? sourceBoqMainService.getStructure() : null;
					let targetBoqStructure = _.isObject(boqMainService) ? boqMainService.getStructure() : null;
					let sourceBoqRootItemIsPasted = false;
					let sourceBoqRootItem = null;
					let allSourceBoqRootItemChildrenArePasted = false;
					let targetAndSourceAreDifferent = false;
					let targetIsBaseBoq = false;
					let targetBoqIsEmpty = false;

					if(_.isObject(sourceBoqStructure) && _.isObject(targetBoqStructure) && !_.isEmpty(sourceBoqStructure.Boqmask) && !_.isEmpty(targetBoqStructure.Boqmask)  && sourceBoqStructure.Boqmask === sourceBoqStructure.Boqmask) {
						sourceBoqRootItem = sourceBoqMainService.getRootBoqItem();
						let targetBoqRootItem = boqMainService.getRootBoqItem();
						targetAndSourceAreDifferent = _.isObject(targetBoqRootItem) && _.isObject(sourceBoqRootItem) ? sourceBoqRootItem !== targetBoqRootItem : false;
						targetIsBaseBoq = _.isObject(targetBoqRootItem) ? targetBoqRootItem.BoqItemPrjBoqFk === null : false;
						let allSourceBoqRootItemChildren = _.isObject(sourceBoqRootItem) ? sourceBoqRootItem.BoqItems : null;

						sourceBoqRootItemIsPasted = _.isObject(sourceBoqRootItem) ? _.isObject(_.find(clipboard.dataCopy, {Id: sourceBoqRootItem.Id})) : false;
						targetBoqIsEmpty = _.isObject(targetBoqRootItem) ? !(_.isArray(targetBoqRootItem.BoqItems) && targetBoqRootItem.BoqItems.length > 0) : false;

						if(!service.getClipboardMode() && targetAndSourceAreDifferent && targetIsBaseBoq && targetBoqIsEmpty && _.isArray(allSourceBoqRootItemChildren) && _.isArray(clipboard.dataCopy) && allSourceBoqRootItemChildren.length > 0 && clipboard.dataCopy.length > 0) {
							let allSourceBoqRootItemChildrenIds = _.map(allSourceBoqRootItemChildren, function(sourceBoqItem) {
								return sourceBoqItem.Id;
							});
							let allPastedSourceBoqItemIds = _.map(clipboard.dataCopy, function(sourceBoqItem) {
								return sourceBoqItem.Id;
							});

							let result = _.xor(allSourceBoqRootItemChildrenIds, allPastedSourceBoqItemIds);
							allSourceBoqRootItemChildrenArePasted = _.isArray(result) && result.length === 0;
						}
					}

					if((targetAndSourceAreDifferent && targetIsBaseBoq && targetBoqIsEmpty) && (sourceBoqRootItemIsPasted || allSourceBoqRootItemChildrenArePasted)) {
						forceCopy = true;
						let readjustedPastedData = [];
						readjustedPastedData.push(sourceBoqRootItem);
						add2Clipboard(readjustedPastedData);
						return true;
					}
					else {
						forceCopy = false;
					}

					let positionInfo = getPositionInfo(); // This information comes from the user given by special keyboard keys he uses while doing the paste.

					return boqMainService.canPasteMultiple(selectedBoqItem, clipboard.dataCopy, showErrorMessages, positionInfo, sourceBoqMainService);
				}

				return false;
			};

			function spliceBoqTree(data, boqItem, parentBoqItem, onSuccess) {
				var parent = null;

				if (angular.isArray(data) && data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						boqItem = data[i].BoqItem;

						if (angular.isDefined(boqItem) && boqItem !== null) {
							// Update parent node
							if (angular.isUndefined(parentBoqItem.BoqItems) || parentBoqItem.BoqItems === null) {
								parent.BoqItems = [];
							}
							if (!!boqItem.BriefInfo && !!boqItem.BriefInfo.Translated) {
								boqItem.BriefInfo.Translated = boqItem.BriefInfo.Description;
							}
							parentBoqItem.BoqItems.splice(0, 0, boqItem);

							// Do the general sync of the updated item
							data[i].BoqItem = null; // ...now data[i].BoqItem is set into the boq object hierarchy. No further sync for this node is necessary so we set it to null, also to avoid deleting the children array.

							boqMainCommonService.insertImages(boqItem);
						}
					}

					targetBoqMainService.gridRefresh();
					// targetBoqMainService.resortChildren(parent, true);

					onSuccess('boqitem'/* clipboard.dataOriginal */);   // callback on success
				}
			}

			/**
			 * @ngdoc function
			 * @name spliceBoqItemTree
			 * @function
			 * @methodOf boqMainClipboardService
			 * @description copy the new item above/below the selectedBoqItem and keep the same structure
			 * @param {object} newBoqItem the new boqItem to splice
			 * @param {Object} selectedBoqItem the target new BoqItem
			 * @param {Object} targetService the target service
			 * @param {function} successCallBack the callback function
			 * @returns
			 */
			service.spliceBoqItemTree = function spliceBoqItemTree(newBoqItem, selectedBoqItem, targetService, successCallBack) {
				targetBoqMainService = targetService;
				spliceBoqTree(newBoqItem, null, selectedBoqItem, successCallBack);
			};

			function getMainService(service) {
				// Climb up the chain of parent services until the main service is reached,
				// i.e. the one not having any parent service.
				var parentService = service.parentService ? service.parentService() : service.getService().parentService();
				var mainService = service;

				while (parentService !== null) {
					mainService = parentService;
					parentService = parentService.parentService ? parentService.parentService() : parentService.getService().parentService();
				}

				return mainService;
			}

			var getParent = function getParent(root, id, callback, isSource) {

				var boqDataService = isSource ? sourceBoqMainService : targetBoqMainService;

				if (root === null) {
					// todo: foreach rootItem in rootObject
					// change by bh: we will only have one root object

					root = boqDataService.getRootBoqItem();
				}

				if (angular.isDefined(root.BoqItems) && root.BoqItems !== null) {

					for (var i = 0; i < root.BoqItems.length; i++) {
						if (root.BoqItems[i].Id === id) {
							callback(root);
							break;
						} else {
							getParent(root.BoqItems[i], id, callback, isSource);
						}
					}
				}
			};

			// removes a node including all sub-nodes
			var removeNode = function removeNode(boqItem) {

				getParent(null, boqItem.Id, function (parent) {

					for (var i = 0; i < parent.BoqItems.length; i++) {
						if (parent.BoqItems[i].Id === boqItem.Id) {
							parent.BoqItems.splice(i, 1);
							break;
						}
					}
				}, true);
			};

			var clearClipboard = function clearClipboard() {
				clipboard.type = null;
				clipboard.dataOriginal = null;
				clipboard.dataCopy = null;
				service.clipboardStateChanged.fire();
			};

			var postClipboard = function postClipboard(data, selectedId, cut, positionInfo, copyAndPasteEstimateOrAssembly, onSuccessCallback) {

				var boqMainLookupFilterService = $injector.get('boqMainLookupFilterService');

				var api = cut === true ? 'movenode' : 'copynode';
				var exchangeRate = angular.isDefined(targetBoqMainService) && (targetBoqMainService !== null) ? targetBoqMainService.getCurrentExchangeRate() : 1;
				var targetBoqProjectId = targetBoqMainService ? targetBoqMainService.getSelectedProjectId() : null;
				var sourceBoqProjectId = sourceBoqMainService ? sourceBoqMainService.getSelectedProjectId() : null;
				var targetBoqModuleContext = targetBoqMainService ? targetBoqMainService.getModuleName() : '';
				var targetBoqStructureDefinition = targetBoqMainService ? targetBoqMainService.getBoqStructure() : null;
				var fromEstimateHeaderId = boqMainLookupFilterService.boqHeaderLookupFilter.fromEstimateHeaderId;
				var toEstimateHeaderId = boqMainLookupFilterService.boqHeaderLookupFilter.toEstimateHeaderId;

				var boqItemCopyOrMoveData = {
					TargetId: selectedId,
					TargetBoqProjectId: targetBoqProjectId,
					SourceBoqProjectId: sourceBoqProjectId,
					TargetModuleContext: targetBoqModuleContext,
					PositionInfo: positionInfo,
					ExchangeRate: exchangeRate,
					Nodes: data,
					KeepRefNoPart: targetBoqStructureDefinition ? targetBoqStructureDefinition.KeepRefNo : false,
					AutoInsertAtCopy: targetBoqStructureDefinition ? targetBoqStructureDefinition.AutoAtCopy : false,
					UseCopyRoutine: forceCopy,
					FromEstimateHeaderId: fromEstimateHeaderId,
					ToEstimateHeaderId:toEstimateHeaderId,
					CopyAndPasteEstimateOrAssembly:copyAndPasteEstimateOrAssembly
				};

				if(forceCopy && boqItemCopyOrMoveData.Nodes.length === 1 && boqMainCommonService.isRoot(boqItemCopyOrMoveData.Nodes[0])) {
					// In this special case the copy routine is used to copy the whole source boq
					// -> no need to hand over the whole source boq to the server and risking running into the limits for web api call content length
					// -> remove the children array for the copy routine only needs the source boq header to be copied
					// -> only hand over the source boq root item without children

					// Cloning done to avoid resetting the currently loaded source boq structure tree to lose the children
					// when BoqItems is set to  an empty array.
					let clonedRootItem = _.clone(boqItemCopyOrMoveData.Nodes[0]);
					clonedRootItem.BoqItems = []; // only hand over boq root item by resetting children array
					boqItemCopyOrMoveData.Nodes[0] = clonedRootItem;
				}

				$http.post(globals.webApiBaseUrl + 'boq/main/' + api, boqItemCopyOrMoveData).then(function (response) {
					var boqStructureLoadedPromise = $q.when(true);
					if(forceCopy) {
						boqStructureLoadedPromise = targetBoqMainService.reloadStructureForCurrentHeader();
					}
					boqStructureLoadedPromise.then(function() {
						onSuccessCallback(response.data);
						if (response.data.errorDescription) {
							platformDialogService.showDialog({headerText$tr$:'cloud.common.infoBoxHeader', bodyText:response.data.errorDescription, iconClass:'info'});
						}
					});
				},
				function() {
					// Something went wrong when being on server side
					activePasteCounter--;
				});
			};

			/**
			 * @ngdoc function
			 * @name paste
			 * @function
			 * @methodOf boqMainClipboardService
			 * @description move or copy the clipboard above/below the selectedBoqItem
			 * @param {object} selectedBoqItem selected node
			 * @param {boolean} below (optional) when set to true the clipboard will be moved/copy below the selectedBoqItem
			 * @returns
			 */
			service.paste = function paste(selectedBoqItem, type, onSuccess, boqMainService, copyAndPasteEstimateOrAssembly) {
				if (!selectedBoqItem) {
					return;
				}

				var boqItem = null;
				var mainService = null;
				var updateDone = $q.defer();

				if (clipboard.type === 'boqitem') {

					targetBoqMainService = boqMainService;

					// Check if target data service exists
					if (!angular.isObject(targetBoqMainService)) {
						return;
					}

					var copyAndPasteEstimateOrAssembly = sourceBoqMainService === targetBoqMainService ? false : true; //If copy and paste within boq structure container then false, if copy and paste from Source boq container then true

					if (angular.isArray(clipboard.dataCopy) && clipboard.dataCopy.length > 0) {

						var result = {}; // Holding information in which level dropped item is pasted. This is driven by line types of items involved.
						var positionInfo = getPositionInfo(); // This information comes from the user given by special keyboard keys he uses while doing the paste.
						var readjustedItems = boqMainService.adjustPastedAndSelectedItem(selectedBoqItem, clipboard.dataCopy[0], sourceBoqMainService);
						var selectedItem = readjustedItems.selectedItem;
						var pastedItem = readjustedItems.pastedItem;
						var canPaste = forceCopy || boqMainService.canPaste(selectedItem, pastedItem, false, result);

						if (!canPaste) {
							return;
						}

						if (result.pasteAsChild) {
							// Overwrite user input by given result determined by boq line type rules for drag and drop (i.e. dropped position is pasted as child of division)
							positionInfo.before = false;
							positionInfo.below = true;
						}

						mainService = getMainService(targetBoqMainService);
						if (mainService) {
							// Do an update of the mainService to avoid loosing unsaved changes by saving sub items or changed parent items of the dropped item
							mainService.updateAndExecute(function () {
								updateDone.resolve(); // Start drag&drop after update of mainService is done.
							});
						} else {
							updateDone.resolve();
						}

						// Send changes to the server
						updateDone.promise.then(function () {
							activePasteCounter++;
							postClipboard(sourceBoqMainService.isCrbBoq() ? clipboard.dataCopy : clipboard.dataOriginal, selectedBoqItem.Id, service.getClipboardMode(), positionInfo, copyAndPasteEstimateOrAssembly, function (compositeData) {

								if (!_.isObject(compositeData)) {
									activePasteCounter--;
									return;
								}

								var data = angular.copy(compositeData.dtos);
								var boq2MdcRules = compositeData.boq2MdcRules;
								var boq2PrjRules = compositeData.boq2PrjRules;
								var prjEstRules = compositeData.prjEstRules;
								var estRules = compositeData.estRules;
								var boqParams = compositeData.boqParams;
								var boqRootItem = targetBoqMainService.getRootBoqItem();
								var boqRootItemPermissionObjectInfo = (angular.isDefined(boqRootItem) && boqRootItem !== null) ? boqRootItem.PermissionObjectInfo : null;
								var source2TargetBoqItemIdMap = compositeData.source2TargetBoqItemIdMap;

								if (targetBoqMainService.isCrbBoq()) {
									$injector.get('boqMainCrbService').onPostClipboardSuccess(targetBoqMainService, data);
								}

								var boqRuleFormatterService = $injector.get('boqRuleFormatterService');
								if (boqRuleFormatterService) {
									// var boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
									_.forEach(data, function (item) {
										if (item.BoqItem && item.BoqItem.IsWicItem) {
											boqRuleFormatterService.buildRuleAndRuleAssignment([item.BoqItem], boq2MdcRules, estRules);
										} else {
											boqRuleFormatterService.buildRuleAndRuleAssignment([item.BoqItem], boq2PrjRules, prjEstRules);
										}
									});
								}

								// Attach the divisionType assingment to boqItem
								// so we can use it to formatter the divisionType assignment
								var boqDivisionTypeAssignmentFormatterService = $injector.get('boqDivisionTypeAssignmentFormatterService');
								if (boqDivisionTypeAssignmentFormatterService) {
									_.forEach(data, function (item) {
										boqDivisionTypeAssignmentFormatterService.setDivisionTypeAssignmentToBoqItems([item.BoqItem], compositeData.boqItem2boqDivisionTypes);
									});
								}

								var estimateParameterFormatterService = $injector.get('estimateParameterFormatterService');
								if (estimateParameterFormatterService) {
									_.forEach(data, function (item) {
										if (item.BoqItem) {
											estimateParameterFormatterService.buildParamAssignment([item.BoqItem], boqParams);
										}
									});
								}

								compositeData.myDtos = _.map(data, function (boqItemComplete) {
									return boqItemComplete.BoqItem;
								});

								$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
									basicsCostGroupAssignmentService.process(compositeData, targetBoqMainService, {
										mainDataName: 'myDtos',
										attachDataName: 'BoqItem2CostGroups',
										dataLookupType: 'BoqItem2CostGroups',
										isTreeStructure: true,
										childrenName: 'BoqItems',
										identityGetter: function identityGetter(entity) {
											return {
												BoqHeaderFk: entity.RootItemId,
												Id: entity.MainItemId
											};
										}
									});
								}]);

								var parent = null;

								if (angular.isArray(data) && data.length > 0) {

									for (var i = 0; i < data.length; i++) {
										boqItem = data[i].BoqItem;
										if (service.getClipboardMode() && angular.isDefined(boqItem) && boqItem !== null) {
											// If the item is moved we first remove it from its old parent.
											removeNode(boqItem);
											sourceBoqMainService.deselect(); // If the removed item is the selected item we have to deselect in order to avoid having an old version of the moved item referenced.
										}
									}

									// Update clipboard
									clipboard.dataOriginal = data;

									//   if (isRootNode(selectedBoqItem)) {     // insert below root node
									//
									//      if (selectedBoqItem.BoqItems === null) {
									//         selectedBoqItem.BoqItems = [];
									//      }
									//      selectedBoqItem.BoqItems.splice(0, 0, clipboard.dataOriginal);
									//
									//   }
									//   else {
									// copy clipboard above/below the selected node
									//   getParent(null, selectedBoqItem.Id, function (parent) {
									//      for (var i = 0; i < parent.BoqItems.length; i++) {
									//         if (parent.BoqItems[i].Id === selectedBoqItem.Id) {
									//            if (below && below === true) {
									//               parent.BoqItems.splice(i + 1, 0, clipboard.dataOriginal);
									//            }
									//            else {
									//               parent.BoqItems.splice(i, 0, clipboard.dataOriginal);
									//            }
									//            break;
									//         }
									//      }
									//   }, false);

									for (i = 0; i < data.length; i++) {

										boqItem = data[i].BoqItem;

										if (angular.isDefined(boqItem) && boqItem !== null) {

											// Update parent node
											if(forceCopy) {
												// In this mode we get the root item of the target boq returned.
												// For we already have the target root item we have to add the children of the target boq root item coming form server
												// to the client side target boq root item
												parent = boqRootItem;
												if(!_.isArray(boqRootItem.BoqItems)) {
													boqRootItem.BoqItems = boqItem.BoqItems;
												}
												else if(boqRootItem.BoqItems.length === 0) {
													boqRootItem.BoqItems = boqRootItem.BoqItems.concat(boqItem.BoqItems);
												}
												else {
													console.error('Target boq is not empty! -> This copy is not supported here !!');
												}
											}
											else {
												parent = (parent !== null) ? parent : targetBoqMainService.getBoqItemById(boqItem.BoqItemFk);
												if (angular.isUndefined(parent.BoqItems) || parent.BoqItems === null) {
													parent.BoqItems = [];
												}
												parent.BoqItems.splice(0, 0, boqItem);
											}

											// Do the general sync of the updated item
											data[i].BoqItem = null; // ...now data[i].BoqItem is set into the boq object hierarchy. No further sync for this node is necessary so we set it to null, also to avoid deleting the children array.
											// Patch PermissionObjectInfo of boqRootItem to dropped boqItem and its possible children.
											targetBoqMainService.patchPermissionObjectInfo(boqItem, boqRootItemPermissionObjectInfo);
											targetBoqMainService.syncItemsAfterUpdate(data[i]);
											targetBoqMainService.processBoqItem(boqItem);
											targetBoqMainService.updateItemList();

											boqMainCommonService.insertImages(boqItem);

											if (_.isObject(parent) && boqMainCommonService.isLeadDescription(parent)) {
												targetBoqMainService.processBoqItem(parent);
											}

											if (_.isArray(parent.BoqItems)) {
												parent.HasChildren = parent.BoqItems.length > 0;
											}
										}
									}

									targetBoqMainService.fireListLoaded(true);

									targetBoqMainService.resortChildren(parent, true);

									if(_.isArray(clipboard.dataCopy) && clipboard.dataCopy.length > 0) {
										// For boqItem isn't neccessarily the original pasted item (for example when hierarchical elements have been added)
										// we have to determine the corresponding copied item first before we set the selected item.
										// This is done by using the source2TargetBoqItemIdMap which hopefully maps the Id's of the source items to the Id's of
										// the corresponding target boq items.
										let boqItemToBeSelected = clipboard.dataCopy[clipboard.dataCopy.length - 1];
										if(boqMainCommonService.isDivisionOrRoot(boqItem) && _.isObject(source2TargetBoqItemIdMap)) {
											let output = [];
											let flattenedSubTreeList = boqMainCommonService.flatten(boqItem, output);
											boqItemToBeSelected = _.find(flattenedSubTreeList, function(item) {
												return item.Id === source2TargetBoqItemIdMap[boqItemToBeSelected.Id];
											});

											if(!_.isObject(boqItemToBeSelected)) {
												boqItemToBeSelected = boqItem;
											}
										}
										else {
											boqItemToBeSelected = boqItem;
										}

										targetBoqMainService.setSelected(boqItemToBeSelected); // Set the last pasted item as selected item
									}

									service.onPostClipboardSuccess.fire(data);

									onSuccess('boqitem', copyAndPasteEstimateOrAssembly/* clipboard.dataOriginal */);   // callback on success
									clearClipboard();

									let _dynamicUserDefinedColumnsService = targetBoqMainService.getDynamicUserDefinedColumnsService();
									if(_dynamicUserDefinedColumnsService && _.isFunction(_dynamicUserDefinedColumnsService.attachDataToColumn)) {
										_dynamicUserDefinedColumnsService.attachDataToColumn(targetBoqMainService.getList()).then(function () {
											var itemList = [];
											$injector.get('cloudCommonGridService').flatten(compositeData.dtos, itemList, 'BoqItems');
											var boqChildItems = _.filter(itemList,{'HasChildren':false});
											if(boqChildItems && boqChildItems.length){
												targetBoqMainService.calcUserDefinedColumnParentChain(boqChildItems[0]);
												if(_.isFunction(targetBoqMainService.update)){
													targetBoqMainService.update();
												}
											}
										});
									}


									if (compositeData.identicalBoqItems && compositeData.identicalBoqItems.length > 0) {
										var platformModalService = $injector.get('platformModalService');
										var msg = 'boq.main.assignBoqItemResult';
										platformModalService.showMsgBox($translate.instant(msg), 'cloud.common.informationDialogHeader', 'ico-info');
									}
								}

								activePasteCounter--;
							});
						});
					}
				}
			};

			service.getClipboard = function getClipboard() {
				return clipboard;
			};

			service.fireOnDragStart = function fireOnDragStart() {
				service.onDragStart.fire();
			};

			service.fireOnDragEnd = function fireOnDragEnd(e, arg) {
				service.onDragEnd.fire(e, arg);
			};

			service.fireOnDrag = function fireOnDragEnd(e, arg) {
				service.onDrag.fire(e, arg);
			};

			service.clearClipboard = function clearClipboard() {
				clearClipboard();
			};

			service.clipboardHasData = function clipboardHasData() {
				return angular.isDefined(clipboard.dataOriginal) && (clipboard.dataOriginal !== null) && angular.isDefined(clipboard.dataOriginal.length) && (clipboard.dataOriginal.length > 0);
			};

			service.resetActivePasteCounter = function resetActivePasteCounter() {
				activePasteCounter = 0;
			};

			// keep this code - supports offline mode !
			//   var nextId = 0;
			//   var getUnusedId = function() {
			//      nextId--;
			//      return nextId;
			//   }
			//   var setNewIds = function(boqItem) {
			//
			//      boqItem.Id = getUnusedId();
			//
			//      if (angular.isDefined(boqItem.BoqItems) && boqItem.BoqItems !== null) {
			//
			//         for (var i = 0; i < boqItem.BoqItems.length; i++) {
			//            boqItem.BoqItems[i].Id = getUnusedId();
			//            setNewIds(boqItem.BoqItems[i]);
			//         }
			//      }
			//   };

			//   var postClipboard = function (selectedId, cut, below, callback) {
			//
			//         var api = cut === true ? 'movenode' : 'copynode';
			//         var below = below === true ? true : false;
			//         $http.post(globals.webApiBaseUrl + 'boq/main/' + api + '?targetId=' + selectedId + '&below=' + below, clipboard)
			//         .then(function(response) {
			//            callback(response);
			//         },
			//         // todo global catch http errors (see http://stackoverflow.com/questions/11971213/global-ajax-error-handler-with-angularjs)
			//         function(response) {
			//            console.log("error");
			//         })
			//   };

			// todo: reactivate as soon as global error handling is established
			// http://stackoverflow.com/questions/11956827/angularjs-intercept-all-http-json-responses

			//   var postClipboard = function (selectedId, cut, below) {
			//
			//      var api = cut === true ? 'movenode' : 'copynode';
			//      var below = below === true ? true : false;
			//      return $http.post(globals.webApiBaseUrl + 'boq/main/' + api + '?targetId=' + selectedId + '&below=' + below, clipboard.dataOriginal);
			//   };

			return service;

		}

	]);

})();
