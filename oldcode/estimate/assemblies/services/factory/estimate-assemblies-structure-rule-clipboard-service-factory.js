/**
 * Created by lnt on 08/26/2021.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global Platform, _, globals */
	let moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesStructureRuleClipboardServiceFactory
	 * @description provides cut, copy and paste functionality for the assemblies Categories
	 */
	angular.module(moduleName).factory('estimateAssembliesStructureRuleClipboardServiceFactory',
		['$http','$injector','platformDialogService','estimateAssembliesRuleUpdateService', 'platformDragdropService', 'estimateParamUpdateService','platformPermissionService',
			function ($http,$injector,platformDialogService, estimateAssembliesRuleUpdateService,platformDragdropService, estimateParamUpdateService,platformPermissionService) {

				let factoryService = {};

				factoryService.createAssemblyStructureCilpboardService = function (assemblyStructureService) {
					let clipboard = {type: null, data: null, cut: false, dataFlattened: null};
					let service = {};

					// events
					service.clipboardStateChanged = new Platform.Messenger();
					service.onDragStart = new Platform.Messenger();
					service.onDragEnd = new Platform.Messenger();
					service.onDrag = new Platform.Messenger();

					function isFilterStructureType(objType) {
						if(_.isString(objType)) {
							return ['estRuleAssemblyItems', 'assemblies'].indexOf(objType) >= 0;
						}else if(_.isObject(objType)) {
							if (objType.type === 'assemblies' && angular.isDefined(objType.itemService)) {
								let assembliesGuid = objType.itemService.getAssemblyGridId().toLowerCase();
								if (platformPermissionService.hasCreate(assembliesGuid)) {
									return true;
								}
							} else {
								return ['estRuleAssemblyItems', 'assemblies'].indexOf(objType.type) >= 0;
							}
						}
						return false;
					}

					let add2Clipboard = function (node, type) {
						clipboard.type = type;
						clipboard.data = angular.copy(node);
						clipboard.dataFlattened = [];
						service.clipboardStateChanged.fire();
					};

					function assignRulesToItem(sourceItems, destItem) {
						// 'estRuleAssemblyItems':'Rule',
						let relationAssembliesEntityService = null;
						try {
							relationAssembliesEntityService = $injector.get(destItem.RuleRelationServiceNames.r);
						} catch (ex) {
							return false;
						}
						if (destItem) {
							relationAssembliesEntityService.currentMainEntity(destItem);
							_.forEach(sourceItems, function (sourceItem) {
								destItem.Rule.push(sourceItem.Id);
								estimateAssembliesRuleUpdateService.setRuleToSave(destItem, sourceItem.Id);
								relationAssembliesEntityService.createRelations(destItem, sourceItem);
							});
							relationAssembliesEntityService.updateMainEntityAfterRuleChanged();
						}
					}

					service.setClipboardMode = function (cut) {
						clipboard.cut = cut; // set clipboard mode
					};

					service.canDrag = function canDrag(type) {
						return isFilterStructureType(type);
					};

					service.doCanPaste = function (canPastedContent, type) {

						if (type === 'assembliesCategories') {
							return isFilterStructureType(canPastedContent);
						}
						return false;
					};
					// this function is not really complex
					service.canPaste = function (type, selectedItem) {
						service.doCanPaste({
							type: clipboard.type,
							data: clipboard.data,
							action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
						},
						type, selectedItem);
					};
					service.cut = function (items, type) {
						let selectedLineItem = assemblyStructureService.getSelected();
						if (type === 'resources' && selectedLineItem && selectedLineItem.EstLineItemFk > 0) {
							service.clearClipboard();
							clipboard.cut = false;
						} else {
							add2Clipboard(items, type);
							clipboard.cut = true;
						}
					};

					service.copy = function (items, type) {
						add2Clipboard(items, type);
						clipboard.cut = false;
					};

					service.doPaste = function (pastedContent, selectedItem) {

						if (selectedItem && isFilterStructureType(pastedContent)) {
							let selectedItems = assemblyStructureService.getSelectedEntities();
							let validateEntity = null;

							let containerData = assemblyStructureService.getContainerData();
							let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
							let updateData = modTrackServ.getModifications(assemblyStructureService);
							let rulePromise = null;

							let entity = selectedItems[0];

							updateData.EstLeadingStuctureContext = estimateParamUpdateService.getLeadingStructureContext({}, entity, 'estimateMainAssembliesCategoryService');
							updateData.MainItemName = containerData.itemName; // 'EstAssemblyCat'
							if (pastedContent.type === 'estRuleAssemblyItems') {
								rulePromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/update', updateData);
								rulePromise.then(function (response) {
									rulePromise = null;
									let result = response.data;
									containerData.onUpdateSucceeded(result, containerData, updateData);
									// clear updateData
									modTrackServ.clearModificationsInRoot(assemblyStructureService);
									updateData = {};

									if (selectedItems && selectedItems.length > 0) {
										_.forEach(selectedItems, function (selectedItem) {
											assignRulesToItem(pastedContent.data, selectedItem);
										});
										validateEntity = selectedItems;
									} else {
										assignRulesToItem(pastedContent.data, selectedItem);
										validateEntity = selectedItem;
									}
									let validationService = $injector.get('estimateAssembliesAssemblyValidationService');
									let ruleIds = [];
									_.forEach(pastedContent.data, function (rule) {
										ruleIds.push(rule.Id);
									});
									validationService.validateRule(validateEntity, ruleIds, 'Rule');
								},
								function () {

								}
								);

							} else if (pastedContent.type === 'assemblies') {

								updateData.EstAssemblyCat = selectedItem;

								updateData.AssemblyIds = pastedContent.data && pastedContent.data.length ? _.map(pastedContent.data, 'Id') : [];
								updateData.IsMoveOrCopyResource = pastedContent.action.id;
								rulePromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/deepcopyassembly', updateData);
								rulePromise.then(function (response) {
									rulePromise = null;
									let result = response.data;
									containerData.onUpdateSucceeded(result, containerData, updateData);
									$injector.get('estimateAssembliesService').handleDeepCopy(result);
									// clear updateData
									modTrackServ.clearModificationsInRoot(assemblyStructureService);
									updateData = {};
									assemblyStructureService.refresh();
								}, function () {
								});


							}
						}

					};

					/**
					 * @ngdoc function
					 * @name paste
					 * @function
					 * @methodOf projectLocationClipboardService
					 * @description move or copy the clipboard to the selected template group
					 * @returns
					 */
					service.paste = function (selectedItem, type, onSuccess) {
						service.doPaste({
							type: clipboard.type,
							data: clipboard.data,
							action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
						},
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
						clipboard.type = clipboard.data = clipboard.dataFlattened = null;
						service.clipboardStateChanged.fire();
					};

					service.clipboardHasData = function () {
						return clipboard.data !== null;
					};

					return service;
				};

				return factoryService;
			}
		]);

})();
