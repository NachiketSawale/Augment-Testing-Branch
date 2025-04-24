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
	 * @name estimateAssembliesClipboardService
	 * @description provides cut, copy and paste functionality for the assemblies
	 */
	angular.module(moduleName).factory('estimateAssembliesClipboardService', ['$http','$injector','estimateAssembliesService','estimateAssembliesRuleUpdateService', 'platformDragdropService',
		'estimateParamUpdateService','platformPermissionService',
		function ($http,$injector,estimateAssembliesService,estimateAssembliesRuleUpdateService, platformDragdropService, estimateParamUpdateService,platformPermissionService) {

			let clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			let service = {};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onDragStart = new Platform.Messenger();
			service.onDragEnd = new Platform.Messenger();
			service.onDrag = new Platform.Messenger();

			function isFilterStructureType(type) {
				return type.match('estLicCostGrp[0-9]Items') || ['estAssemblyItems','estRuleAssemblyItems','EstCostGrp'].indexOf(type) >= 0;
			}

			let add2Clipboard = function (node, type) {
				clipboard.type = type;
				clipboard.data = angular.copy(node);
				clipboard.dataFlattened = [];
				service.clipboardStateChanged.fire();
			};

			function assignFilterStructureToItem(type, sourceItems, destItem, itemService) {
				// only exact one item can be assigned
				if (_.size(sourceItems) !== 1) {
					return;
				}

				let mapType2Prop = {
					'estAssemblyItems': 'EstAssemblyFk',
					'EstCostGrp':'CostGroupFk',
					'estLicCostGrp1Items': 'LicCostGroup1Fk',
					'estLicCostGrp2Items': 'LicCostGroup2Fk',
					'estLicCostGrp3Items': 'LicCostGroup3Fk',
					'estLicCostGrp4Items': 'LicCostGroup4Fk',
					'estLicCostGrp5Items': 'LicCostGroup5Fk'
				};
				if (mapType2Prop[type]) {
					let item = sourceItems[0];
					if(type === 'EstCostGrp'){
						if(destItem['costgroup_'+ item.CostGroupCatalogFk] !==  item.Id) {
							destItem['costgroup_' + item.CostGroupCatalogFk] = item.Id;
							let costGroupCol = {};
							costGroupCol.field = 'costgroup_' + item.CostGroupCatalogFk;
							costGroupCol.costGroupCatId = item.CostGroupCatalogFk;

							if (!itemService.getSelected()) {
								itemService.setSelected(destItem);
							}

							$injector.get('estimateAssembliesCostGroupService').createCostGroup2Save(destItem, costGroupCol).then(function () {
								itemService.markItemAsModified(destItem);
							});
						}

					}else{
						destItem[mapType2Prop[type]] = sourceItems[0].Id;
					}
				}
				itemService.fireItemModified(destItem);
			}
			function assignRulesToItem(sourceItems, destItem) {
				// 'estRuleAssemblyItems':'Rule',
				let relationAssembliesEntityService = null;
				try{relationAssembliesEntityService = $injector.get(destItem.RuleRelationServiceNames.r);
				}catch (ex) {
					return false;
				}
				if(destItem) {
					relationAssembliesEntityService.currentMainEntity(destItem);
					_.forEach(sourceItems,function(sourceItem){
						destItem.Rule.push(sourceItem.MainId || sourceItem.Id);
						estimateAssembliesRuleUpdateService.setRuleToSave(destItem, (sourceItem.MainId || sourceItem.Id));
						relationAssembliesEntityService.createRelations(destItem, sourceItem);
					});
					relationAssembliesEntityService.updateMainEntityAfterRuleChanged();
				}
			}
			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			service.canDrag = function canDrag(type) {
				return isFilterStructureType(type) || type === 'assemblies';
			};

			service.doCanPaste = function (canPastedContent,type) {
				let assembliesGuid =  estimateAssembliesService.getAssemblyGridId().toLowerCase();
				if (type === 'assemblies' && platformPermissionService.hasCreate(assembliesGuid)) {
					return isFilterStructureType(canPastedContent.type) || type === 'assemblies';
				}
				return false;
			};
			// this function is not really complex
			service.canPaste = function(type, selectedItem ) {
				service.doCanPaste({type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy},
				type, selectedItem);
			};
			service.cut = function (items, type) {
				let selectedLineItem = estimateAssembliesService.getSelected();
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

			service.doPaste = function (pastedContent,selectedItem, type, onSuccess, destinationService) {
				let selectedItems = estimateAssembliesService.getSelectedEntities();
				let validateEntity = null;
				let containerData = estimateAssembliesService.getContainerData();
				let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
				let updateData = modTrackServ.getModifications(estimateAssembliesService);
				let rulePromise = null;
				let entity = selectedItems[0];

				updateData.EstLeadingStuctureContext = estimateParamUpdateService.getLeadingStructureContext({}, entity, 'estimateAssembliesService');
				updateData.MainItemName = containerData.itemName;
				if (selectedItem && isFilterStructureType(pastedContent.type)) {
					if(pastedContent.type === 'estRuleAssemblyItems')
					{
						rulePromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/update',updateData);
						rulePromise.then(function(response){
							rulePromise = null;
							let result = response.data;
							containerData.onUpdateSucceeded(result, containerData, updateData);
							// clear updateData
							modTrackServ.clearModificationsInRoot(estimateAssembliesService);
							updateData = {};

							if(selectedItems && selectedItems.length > 0)
							{
								_.forEach(selectedItems,function(selectedItem){
									assignRulesToItem(pastedContent.data, selectedItem);
								});
								validateEntity = selectedItems;
							}
							else {
								assignRulesToItem(pastedContent.data, selectedItem);
								validateEntity = selectedItem;
							}

							let validationService = $injector.get('estimateAssembliesValidationService');
							let ruleIds = [];
							_.forEach(pastedContent.data,function(rule){
								ruleIds.push(rule.Id);
							});
							validationService.validateRule(validateEntity,ruleIds,'Rule');
						},
						function(){

						}
						);
					}
					else
					{
						if(pastedContent.type === 'EstCostGrp') {
							_.forEach(selectedItems, function (item) {
								assignFilterStructureToItem(pastedContent.type, pastedContent.data, item, destinationService);
							});
						}else{
							assignFilterStructureToItem(pastedContent.type, pastedContent.data, selectedItem, destinationService);
						}

					}
				}else if(pastedContent.type === 'assemblies'){
					updateData.IsCopyToSameAssemblyCat = true;
					updateData.AssemblyIds = pastedContent.data && pastedContent.data.length ? _.map(pastedContent.data, 'Id'):[];
					rulePromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/deepcopyassembly',updateData);
					rulePromise.then(function(response){
						rulePromise = null;
						let result = response.data;
						containerData.onUpdateSucceeded(result, containerData, updateData);
						estimateAssembliesService.handleDeepCopy(result);
						// clear updateData
						modTrackServ.clearModificationsInRoot(estimateAssembliesService);
						updateData = {};
					},function(){ });
				}else{return;}
			};
			/**
			 * @ngdoc function
			 * @name paste
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
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
