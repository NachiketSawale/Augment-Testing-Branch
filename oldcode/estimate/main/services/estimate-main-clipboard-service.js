/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/* global Platform, globals, _ */
	/**
	 * @ngdoc service
	 * @name estimateMainClipboardService
	 * @description provides cut, copy and paste functionality for the line items
	 */

	estimateMainModule.factory('estimateMainClipboardService', ['$injector','platformDialogService','$q', '$translate', '$timeout', 'estimateMainService', '$http', 'estimateMainResourceService',
		'estimateRuleProcessor', 'estimateMainRuleUpdateService', 'estimateMainValidationService', 'estimateMainGenerateSortingService',
		'modelViewerDragdropService', 'estimateMainLineItem2MdlObjectService', 'platformDragdropService', 'estimateMainCommonService',
		'basicsLookupdataLookupDescriptorService', 'estimateMainBoqService', 'platformModalService', 'estimateMainTranslationService',
		'platformPermissionService','platformGridAPI', 'estimateMainResourceType',
		function ($injector,platformDialogService,$q, $translate, $timeout, estimateMainService, $http, estimateMainResourceService,
			estimateRuleProcessor, estimateMainRuleUpdateService, estimateMainValidationService, estimateMainGenerateSortingService,
			modelViewerDragdropService, estimateMainLineItem2MdlObjectService, platformDragdropService, estimateMainCommonService,
			basicsLookupdataLookupDescriptorService, estimateMainBoqService, platformModalService, estimateMainTranslationService,
			platformPermissionService,platformGridAPI, estimateMainResourceType) {

			let clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			let service = {};
			let ids = []; // drag the wic2assembly ids
			let resourceTypes = ['resources', 'copySourceLineItemResource', 'copySourceAssembliesResource'];
			let lineItem2ModelObjects = [];

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onDragStart = new Platform.Messenger();
			service.onDragEnd = new Platform.Messenger();
			service.onDrag = new Platform.Messenger();
			service.onPostClipboardError = new Platform.Messenger();
			service.setResourceSelectionOnSort = new Platform.Messenger();

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			service.canDrag = function canDrag(type) {
				let result = true;
				let boqMainLineTypes = $injector.get('boqMainLineTypes');

				if(type === 'estBoqItems' || type ==='wicBoqItems') {
					let selectedBoqItem = $injector.get('estimateMainBoqService').getSelected();
					if(type ==='wicBoqItems'){
						selectedBoqItem = $injector.get('estimateMainWicBoqService').getSelected();
					}
					let boqLineTypes = [0, 11, 200, 201, 202, 203];
					if (boqLineTypes.indexOf(selectedBoqItem.BoqLineTypeFk) === -1) {
						return false;
					}
					else if (selectedBoqItem.BoqLineTypeFk === boqMainLineTypes.crbSubQuantity) {
						return true;
					}

					if (selectedBoqItem && selectedBoqItem.Id && selectedBoqItem.BoqLineTypeFk === 0) {
						// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
						if (_.isArray(selectedBoqItem.BoqItems) && selectedBoqItem.BoqItems.length > 0) {

							let crbChildrens = _.filter(selectedBoqItem.BoqItems,{'BoqLineTypeFk':11});
							if(crbChildrens && crbChildrens.length){
								return false;
							}
						}
					}
				}

				if(type === 'estActivityItems') {
					let selectedActivityItem = $injector.get('estimateMainActivityService').getSelected();
					if (selectedActivityItem.ActivityTypeFk === 2 || selectedActivityItem.HasChildren || !angular.isDefined(selectedActivityItem.ActivityTypeFk)) {
						return false;
					}
				}

				if ( type ==='estCtuItems') {
					let selectedCtuItem = $injector.get('estimateMainControllingService').getSelected();
					if ( selectedCtuItem && selectedCtuItem.HasChildren) {
						return false;
					}
				}

				// todo : DEV-4617 - Assignment of CostGroup Elements only on last level possible
				// if ( type ==='EstCostGrp') {
				// 	let selectedCostGroupItem = $injector.get('costGroupStructureDataServiceFactory').getSelected();
				// 	if ( selectedCostGroupItem && selectedCostGroupItem.HasChildren) {
				// 		return false;
				// 	}
				// }



				if (resourceTypes.indexOf(clipboard.type) >= 0 || resourceTypes.indexOf(type) >= 0) {
					let selectedLineItem = estimateMainService.getSelected();// todo : multiselect chnages pending
					result = !(selectedLineItem && selectedLineItem.EstLineItemFk > 0);
					if (result) {
						if (clipboard.data && clipboard.data.length === 1) {
							let item = clipboard.data[0];
							result = item && !item.EstRuleSourceFk;
						}
					}
				}
				return result;
			};

			function isFilterStructureType(type) {
				return type.match('estLicCostGrp[0-9]Items') ||
					type.match('estPrjCostGrp[0-9]Items') ||
					['estActivityItems', 'estAssemblyItems', 'EstCostGrp', 'estBoqItems', 'wicBoqItems', 'estCtuItems', 'estPrjLocationItems', 'estPrcStructureItems'].indexOf(type) >= 0;
			}

			function canPasteToLISS(selectedItem, canPastedContent) {
				let destItem = selectedItem;
				// destination is null (LISS container is empty)
				if (_.isEmpty(destItem)) {
					return false;
				} else {
					// Position = 0, Surcharge Item (200, 201, 202, 203)
					let boqLineTypes = [0, 11, 200, 201, 202, 203];
					let wicBoqLineTypes = [0, 11, 200, 201, 202, 203];
					let activityTypes = [1, 2];

					if (canPastedContent.type === 'estActivityItems' && activityTypes.indexOf(_.first(canPastedContent.data).ActivityTypeFk) === -1) { // item
						return false;
					} else if (canPastedContent.type === 'estBoqItems' && boqLineTypes.indexOf(_.first(canPastedContent.data).BoqLineTypeFk) === -1) {
						return false;
					} else if (canPastedContent.type === 'wicBoqItems' && wicBoqLineTypes.indexOf(_.first(canPastedContent.data).BoqLineTypeFk) === -1) {
						return false;
					}

					return destItem.EstLineItemSelStatementType === 0; // 0 = Item, 1 = Folder
				}
			}

			function canPasteToResource(selectedItem, canPastedContent) {

				let getRootCompositeItem = function getRootCompositeItem(resource, resourceList) {
					let compositeItem = null;
					if (resource && resource.EstRuleSourceFk > 0) { // Resource is generated by rule
						return resource;
					}
					if (resource && !resource.EstResourceFk) {
						return compositeItem;
					}
					while (resource && resource.EstResourceFk) {
						resource = _.find(resourceList, {Id: resource.EstResourceFk});
						if (resource && resource.EstResourceTypeFk === estimateMainResourceType.Assembly && (resource.EstAssemblyFk && resource.EstAssemblyFk > 0)) {
							compositeItem = resource;
						}
					}
					return compositeItem;
				};

				let destItem = selectedItem;
				let destRootCompositeItem = getRootCompositeItem(selectedItem, canPastedContent.itemService ? canPastedContent.itemService.getList() : estimateMainResourceService.getList());

				// destination is null (resources container is empty), no validation needed
				if (_.isEmpty(destItem)) {
					return true;
				}


				// destination item parent is NOT a composite assembly item, we validate other conditions
				if (_.isEmpty(destRootCompositeItem)) {

					// destination item is a composite assembly item
					if (destItem.EstResourceTypeFk === estimateMainResourceType.Assembly && (selectedItem.EstAssemblyFk && selectedItem.EstAssemblyFk > 0)) {
						return false;

					} else if (destItem.EstRuleSourceFk > 0) {
						// Destination item is generated by rule
						return false;

					} else if (destItem.EstResourceTypeFk !== 5) {
						// destination item is not a sub item
						return false;

					} else {

						// origin items contain composite assembly or is generated by rule
						let originItems = canPastedContent.data || [];

						for (let i = 0; i < originItems.length; i++) {
							let originRootCompositeItem = getRootCompositeItem(originItems[i], canPastedContent.itemService.getList());
							if (!_.isEmpty(originRootCompositeItem)) {
								return false;
							}
						}

						if (destItem.EstResourceTypeFk === estimateMainResourceType.SubItem) {
							let cloudCommonGridService = $injector.get('cloudCommonGridService');
							let isSelfAssignment = _.findIndex(canPastedContent.data, {Id: destItem.Id}) > -1;
							if (isSelfAssignment) {

								if(canPastedContent.type ==='copySourceLineItemResource'  && canPastedContent.type !=='resources')
								{
									return true;
								}

								// platformDragdropService.setDraggedText('The destination item cannot be the same as the source item.');
								return false;
							}

							let canPasteContentList = [];
							if (canPastedContent.data) {
								cloudCommonGridService.flatten(canPastedContent.data, canPasteContentList, 'EstResources');
							}

							// it is reaches here, then destination sub item is valid
							return true;
						}

						// it is reaches here, then destination item is valid
						return true;
					}

					// destination item parent is a composite assembly item
				} else if (!_.isEmpty(destRootCompositeItem)) {
					return false;
				}
			}

			/**
			 * check the LineItem Container Permission
			 * @param canPastedContent
			 * @param type current content type
			 * @returns {boolean}
			 */
			function checkLIContainerPermission(canPastedContent, type, selectedItem) {
				let result = true;
				let grids = estimateMainService.getGridId().toLowerCase();
				if (type === 'lineItems' || (!_.isUndefined(canPastedContent.type) && canPastedContent.type === 'lineItems')) {
					switch (canPastedContent.type) {
						case 'copySourceLineItems':
						case 'copySourceAssemblies':
							if (!platformPermissionService.hasCreate(grids)) {
								result = false;
							}
							break;
						case 'wicBoqItems':
						case 'estBoqItems':
							if (!platformPermissionService.hasCreate(grids)) {
								result = false;
							}
							break;
						case 'estAssemblyItems':
						case 'estPrcStructureItems':
						case 'estActivityItems':
						case 'estCtuItems':
						case 'EstCostGrp':
						case 'estPrjLocationItems':
						case 'estimateRules':
						case 'copySourceAssembliesResource':
						case 'copySourceLineItemResource':
						case 'resources':
							if (!platformPermissionService.hasWrite(grids)) {
								result = false;
							}
							break;
						default:
							if (canPastedContent.type.match('estLicCostGrp[0-9]Items') ||
								canPastedContent.type.match('estPrjCostGrp[0-9]Items')) {
								if (!platformPermissionService.hasWrite(grids)) {
									result = false;
								}
							}
							break;
					}

					if (result && canPastedContent.type === 'lineItems' && (type.match('estLicCostGrp[0-9]Items') || type.match('estPrjCostGrp[0-9]Items') || ['estActivityItems', 'estAssemblyItems', 'EstCostGrp', 'estBoqItems', 'wicBoqItems', 'estCtuItems', 'estPrjLocationItems', 'estimateRules', 'estPrcStructureItems', 'dragdrop2d3d'].indexOf(type) >= 0)) {
						if (!platformPermissionService.hasWrite(grids)) {
							result = false;
						}
					}
				}

				if (result && _.has(canPastedContent, 'draggedData.sourceGrid.type') && canPastedContent.draggedData.sourceGrid.type === 'lineItems') {
					if (!platformPermissionService.hasWrite(canPastedContent.sourceId)) {
						result = false;
					}
				}

				if (result && canPastedContent.type === 'estWic2Assemblies') {
					switch (type) {
						case 'lineItems': {
							selectedItem = estimateMainService.getSelected();
							let copyop = canPastedContent.currentAction === platformDragdropService.actions.copy;
							if (selectedItem && !copyop) {
								if (!platformPermissionService.hasWrite(grids)) {
									result = false;
								}
							} else {
								if (!platformPermissionService.hasCreate(grids)) {
									result = false;
								}
							}
						}
							break;
						case 'resources':
							if (!platformPermissionService.hasWrite(grids)) {
								result = false;
							}
							break;
						default:
							break;
					}
				}

				if (result && type === 'resources') {
					if (canPastedContent.type === 'copySourceAssembliesResource' || canPastedContent.type === 'copySourceLineItemResource') {
						if (!platformPermissionService.hasWrite(grids)) {
							result = false;
						}
					}
				}
				return result;
			}

			service.checkLIContainerPermission = checkLIContainerPermission;

			/* jshint -W074 */
			service.doCanPaste = function doCanPaste(canPastedContent, type, selectedItem) {

				let result = true;
				let isHeaderReadOnly = $injector.get('estimateMainService').isReadonly();
				if (isHeaderReadOnly) {
					result = false;
					return result;
				}

				if(type === 'lineItems' && isFilterStructureType(canPastedContent.type)){
					return canPastedContent.data.length < 2;
				}
				let boqLineTypes = [0, 11, 200, 201, 202, 203];
				if ( type ==='estBoqItems' && selectedItem && boqLineTypes.indexOf(selectedItem.BoqLineTypeFk) === -1) {
					return false;
				}

				if (selectedItem && selectedItem.Id && selectedItem.BoqLineTypeFk === 0) {
					// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
					if (_.isArray(selectedItem.BoqItems) && selectedItem.BoqItems.length > 0) {
						let crbChildrens = _.filter(selectedItem.BoqItems,{'BoqLineTypeFk':11});
						if(crbChildrens && crbChildrens.length){
							return false;
						}
					}
				}

				if ( type ==='estActivityItems' && selectedItem && (selectedItem.ActivityTypeFk === 2 || selectedItem.HasChildren || !angular.isDefined(selectedItem.ActivityTypeFk))) {
					return false;
				}

				if ( type ==='estCtuItems' && selectedItem && selectedItem.HasChildren) {
					return false;
				}

				// todo : DEV-4617 - Assignment of CostGroup Elements only on last level possible.
				// if ( type ==='EstCostGrp' && selectedItem && selectedItem.HasChildren) {
				// 	return false;
				// }

				// todo-cheni:check the LineItem Container permission
				if (!checkLIContainerPermission(canPastedContent, type, selectedItem)) {
					return false;
				}

				// lineItem generated by rule To costGroup and the contrary
				if (canPastedContent.type === 'lineItems' && canPastedContent.data && _.isNumber(_.first(canPastedContent.data).EstRuleSourceFk) && type === 'EstCostGrp') {
					return false;
				}
				if (selectedItem && canPastedContent.type === 'EstCostGrp' && canPastedContent.data && _.isNumber(selectedItem.EstRuleSourceFk) && type === 'lineItems') {
					return false;
				}

				if (canPastedContent.type === 'resources') {
					let api = canPastedContent.currentAction === platformDragdropService.actions.move ? true : false;
					let allow = true;
					_.forEach(canPastedContent.data, function (resource) {
						if(resource.EstResourceFk !== null && api){
							allow = false;
							return allow;
						}
					});
					if(!allow && type ==='lineItems'){
						return false;
					}
				}




				if (canPastedContent.type === 'copySourceLineItems' || canPastedContent.type === 'copySourceAssemblies') {
					return type === 'lineItems';
				}
				if (canPastedContent.type === 'estBoqItems') {
					return type === 'lineItems';
				}

				if ((type === 'lineItems' && canPastedContent.type === 'estAssemblyItems') || (type === 'estAssemblyItems' && canPastedContent.type === 'lineItems')) {
					return false;
				}

				if (type === 'lineItems' && canPastedContent.type === type) {
					return result;
				}

				if (type === 'estlineitemselstatements') { // when drag the assembly category to LISS
					// canPastedContent.type === 'estAssemblyItems' &&
					return canPasteToLISS(selectedItem, canPastedContent);
				}

				if (type === 'resources' && resourceTypes.indexOf(canPastedContent.type) >= 0) {
					return canPasteToResource(selectedItem, canPastedContent);
				}

				if (!selectedItem && canPastedContent.type !== 'estWic2Assemblies') { // when drag the wic2assembly to line item view, retuen true
					return false;
				}

				if (canPastedContent.type === 'estWic2Assemblies' && type === 'estWic2Assemblies') {
					return false;
				}

				if (!canPastedContent.data) {
					return false;
				}

				if (type === 'resources' && canPastedContent.type === type && selectedItem) {
					return canPasteToResource(selectedItem, canPastedContent);
				}

				if ((canPastedContent.type === 'wicBoqItems' ||
						canPastedContent.type === 'estBoqItems' ||
						canPastedContent.type === 'estAssemblyItems' ||
						canPastedContent.type === 'estPrcStructureItems' ||
						canPastedContent.type === 'estActivityItems' ||
						canPastedContent.type === 'estCtuItems' ||
						canPastedContent.type === 'EstCostGrp' ||
						canPastedContent.type === 'estPrjLocationItems' ||
						canPastedContent.type.match('estLicCostGrp[0-9]Items') ||
						canPastedContent.type.match('estPrjCostGrp[0-9]Items')) &&
					type !== 'lineItems') {
					return false;
				}

				if (canPastedContent.type === 'estWic2Assemblies' && type !== 'lineItems' && type !== 'resources') {
					return false;
				}

				if (type !== canPastedContent.type && !isFilterStructureType(canPastedContent.type)) {

					switch (canPastedContent.type) {
						case 'lineItems':
							if (type !== 'estMainLineItem2ModelObject' && !isFilterStructureType(type) && type !== 'estimateRules') {
								result = false;
							}
							break;
						case 'resources':
							var selectedLineItem = estimateMainService.getSelected();
							result = !(selectedLineItem && selectedLineItem.EstLineItemFk > 0);
							break;
						case 'estimateRules':
							if (type === 'lineItems' && selectedItem && selectedItem.EstRuleSourceFk > 0) {
								result = false;
								break;
							}
							if (type !== 'lineItems' && !isFilterStructureType(type) && type !== 'estHeaderItems') {
								result = false;
							}
							break;
						case 'estMainLineItem2ModelObject':
							result = false;
							break;
						case 'estWic2Assemblies':
							if (type === 'lineItems') {
								if (selectedItem) {
									if (selectedItem.EstLineItemFk > 0 || selectedItem.EstRuleSourceFk > 0) {
										result = false;
									}
								}
							} else if (type === 'resources') {
								let lineItemSelected = estimateMainService.getSelected();
								if (lineItemSelected) {
									if (lineItemSelected.EstLineItemFk > 0 || lineItemSelected.EstRuleSourceFk > 0) {
										result = false;
									}

									if (selectedItem && selectedItem.EstRuleSourceFk > 0) {
										result = false;
									}
								} else {
									result = false;
								}

								if (result) {
									result = canPasteToResource(selectedItem, {});
								}
							}
							break;
					}
					return result;
				} else {
					if (canPastedContent.type === 'group') {
						return false;
					}
					// allow assignments filter structures to line item(s)
					else if (isFilterStructureType(canPastedContent.type)) {
						return !!(angular.isArray(canPastedContent.data) && canPastedContent.data.length === 1);
					} else if (type === 'estimateRules' && canPastedContent.type === type) {
						result = false;
					}
				}
				return result;
			};

			/**
			 * @ngdoc function
			 * @name cut
			 * @function
			 * @methodOf estimateMainClipboardService
			 * @description adds the item to the cut clipboard
			 * @param {object} item selected node
			 * @returns
			 */
			service.cut = function (items, type) {
				let selectedLineItem = estimateMainService.getSelected();
				if (type === 'resources' && selectedLineItem && selectedLineItem.EstLineItemFk > 0) {
					clearClipboard();
					clipboard.cut = false;
				} else {
					add2Clipboard(items, type);
					clipboard.cut = true;
				}
			};

			/**
			 * @ngdoc function
			 * @name copy
			 * @function
			 * @methodOf estimateMainClipboardService
			 * @description adds the item to the copy clipboard
			 * @param {object} item selected node
			 * @returns
			 */
			service.copy = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = false;
			};



			let showConfirmationDailog = function(destItem, pastedContent ,type /* , api */){
				let result = { yes:true };
				if (((pastedContent.type === 'lineItems' && isFilterStructureType(type)) || (isFilterStructureType(pastedContent.type) && type === 'lineItems'))) {
					let isLeadingStructreAssign = false;
					let LeadingStructureKeyFk;
					switch(type==='lineItems' ? pastedContent.type : type){
						case 'estBoqItems':
							LeadingStructureKeyFk = 'BoqItemFk';
							break;
						case 'estCtuItems':
							LeadingStructureKeyFk = 'MdcControllingUnitFk';
							break;
						case 'estActivityItems':
							LeadingStructureKeyFk = 'PsdActivityFk';
							break;
						case 'estPrcStructureItems':
							LeadingStructureKeyFk = 'PrcStructureFk';
							break;
						case 'EstCostGrp':
							LeadingStructureKeyFk = 'CostGroupFk';
							break;
					}
					if(LeadingStructureKeyFk){
						if(type==='lineItems') {
							if(pastedContent.type === 'EstCostGrp'){
								if(pastedContent.data&&pastedContent.data.length>0) {
									_.forEach(pastedContent.data, function (item) {
										if (destItem['costgroup_' + item.CostGroupCatalogFk] && destItem['costgroup_' + item.CostGroupCatalogFk] !== item.Id) {
											isLeadingStructreAssign = true;
										}
									});
								}
							}else if(!_.isNil(destItem[LeadingStructureKeyFk])) {
								isLeadingStructreAssign = true;
							}
						}
						else{
							if(_.find(pastedContent.data, entry => entry[LeadingStructureKeyFk])){
								if(_.find(pastedContent.data, entry => !_.isNull(entry[LeadingStructureKeyFk]))){
									isLeadingStructreAssign = true;
								}
							}
						}
					}
					if(isLeadingStructreAssign){
						return platformDialogService.showYesNoDialog('estimate.main.dargDropLineItem', 'estimate.main.dragDropTitle').then(function (result) {
							return $q.when(result);
						});
					}
				}
				else if(pastedContent.type === 'copySourceLineItemResource' && type === 'resources' && destItem){
					let isAnySameCodeInDestItemChildren = pastedContent.data.some(item => {
						return _.findIndex(destItem.EstResources, { Code: item.Code }) > -1;
					});
					if (isAnySameCodeInDestItemChildren) {
						return platformDialogService.showYesNoDialog('estimate.main.reNumberCodeDragDrop', 'Warning').then(function (result) {
							return $q.when(result);
						});
					}
				}
				return $q.when(result);
			};


			/**
			 * @ngdoc function
			 * @name doPaste
			 * @function
			 * @methodOf schedulingTemplateClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
			 */
			service.doPaste = function doPaste(pastedContent, selectedItem, type, onSuccess, destinationService) {

				if(selectedItem === undefined && pastedContent.type === 'estBoqItems')
				{
					service.createLineItemBoq(pastedContent.data,selectedItem);
				}
				if (pastedContent.type !== 'lineItems' && pastedContent.type !== 'resources' && pastedContent.type !== 'estWic2Assemblies' &&
					pastedContent.type !== 'copySourceLineItems' && pastedContent.type !== 'copySourceAssemblies' && pastedContent.type !== 'copySourceLineItemResource' && pastedContent.type !== 'copySourceAssembliesResource') {
					if (!selectedItem) {
						return;
					}
				}
				let lineitems = [];
				let boqItem = {};
				let boqSplitQuantityLinked = null;

				let translationSPlitQuantity = estimateMainTranslationService.getTranslationInformation('BoqSplitQuantityFkExist');
				let error = $translate.instant(translationSPlitQuantity.location + '.' + translationSPlitQuantity.identifier);
				let translationHeader = estimateMainTranslationService.getTranslationInformation('BoqSplitQuantityFkExistHeaderInfo');
				let headerMessage = $translate.instant(translationHeader.location + '.' + translationHeader.identifier);

				// Defect #81421,UPDATE rules first
				if (pastedContent.type === 'estWic2Assemblies') {
					let estimateComboService = $injector.get('estimateRuleComboService');
					estimateComboService.refresh();
				} else if (pastedContent.type === 'estBoqItems' && type === 'lineItems') { // drag boq to lineitem

					lineitems = destinationService.getSelectedEntities();
					boqItem = angular.copy(pastedContent.data);
					boqSplitQuantityLinked = _.filter(lineitems, function (d) {
						return d.BoqSplitQuantityFk !== null && d.BoqItemFk !== boqItem[0].Id;
					});

					if (boqSplitQuantityLinked && boqSplitQuantityLinked.length) {
						platformModalService.showMsgBox(error, headerMessage, 'info');
						return;
					}
				} else if (pastedContent.type === 'lineItems' && type === 'estBoqItems') { // drag lineitem to boq
					lineitems = angular.copy(pastedContent.data);
					boqItem = selectedItem;

					boqSplitQuantityLinked = _.filter(lineitems, function (d) {
						return d.BoqSplitQuantityFk !== null && d.BoqItemFk !== boqItem.Id;
					});

					if (boqSplitQuantityLinked && boqSplitQuantityLinked.length) {
						// translationSPlitQuantity = estimateMainTranslationService.getTranslationInformation('BoqSplitQuantityFkExist');
						let errorMessage = $translate.instant(translationSPlitQuantity.location + '.' + translationSPlitQuantity.identifier);

						// translationHeader = estimateMainTranslationService.getTranslationInformation('BoqSplitQuantityFkExistHeaderInfo');
						// headerMessage = $translate.instant(translationHeader.location + '.' + translationHeader.identifier);
						platformModalService.showMsgBox(errorMessage, headerMessage, 'info');

						return;
					}

				}
				// let pastedData  = angular.copy(pastedContent.data);estimateLineItems
				// send changes to the server
				postClipboard(selectedItem, pastedContent, type, destinationService, function (data) {
					// update clipboard
					let typeByAction = type;
					clipboard.data = data;
					if (pastedContent.type === 'estWic2Assemblies') {
						estimateMainService.addList(data.lineItem);
						estimateMainService.fireListLoaded();
						estimateMainResourceService.setList(data.resources, false);
						estimateMainResourceService.fireListLoaded();
						if (ids && ids.length > 0) {// TODO: create next lineitem and resource
							createLineItemAndResource(ids, data.destinationService, pastedContent.data, data.onSuccessCallback);
						} else {
							estimateMainService.update().then(function () {
								estimateMainService.setSelected(data.lineItem);
								$injector.get('platformGridAPI').rows.scrollIntoViewByItem('681223e37d524ce0b9bfa2294e18d650', data.lineItem);
							});
						}
					} else {
						let action = pastedContent.action === platformDragdropService.actions.move ? 'move' : 'copy';

						if (pastedContent.type === 'lineItems' && action === 'copy' && isFilterStructureType(type)){
							typeByAction = pastedContent.type;
						}
						switch (typeByAction) {
							case 'lineItems':
								estimateMainService.addList(data);
								estimateMainService.fireListLoaded();
								break;
							case 'resources':
								estimateMainResourceService.setList(data, false);
								estimateMainResourceService.fireListLoaded();
								break;
						}
					}
					onSuccess(typeByAction);   // callback on success
					clearClipboard();
				});


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
				// if clipboard.type is resources, then set ColumnId = 0;
				let filterNode = null;
				if (type === 'resources') {
					_.forEach(node, function (nodeItem) {
						nodeItem.ColumnId = 0;
					});
					filterNode = _.filter(node, function (nodeItem) {
						return nodeItem.EstRuleSourceFk === null;
					});
				}
				clipboard.type = type;
				clipboard.data = angular.copy(filterNode);
				clipboard.dataFlattened = [];
				service.clipboardStateChanged.fire();
			}

			function clearClipboard() {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			}


			/* jshint -W071 */ // This function has too many statements
			function postClipboard(destItem, pastedContent, type, destinationService, onSuccessCallback) { // jshint ignore:line
				let api = pastedContent.action === platformDragdropService.actions.move ? 'move' : 'copy';
				showConfirmationDailog(destItem, pastedContent,type,api).then((response)=> {
					if (response.yes) {
						if (pastedContent.type === 'estWic2Assemblies') { // drag wic2assembly to create line item and resource by assembly
							if (type === 'lineItems') {

								let estimateMainWicRelateAssemblyService = $injector.get('estimateMainWicRelateAssemblyService');
								let estDragDropAssemblyTypeConstant = $injector.get('estimateMainDragDropAssemblyTypeConstant');
								/* jshint -W071 */ // This function has too many statements
								let dragDropAssemlySourceType = estDragDropAssemblyTypeConstant.Assembly;
								if (estimateMainWicRelateAssemblyService.filterByBoQ) {

									dragDropAssemlySourceType = estDragDropAssemblyTypeConstant.BoQRelatedAssembly;
								} else if (estimateMainWicRelateAssemblyService.filterByWicBoQ) {

									dragDropAssemlySourceType = estDragDropAssemblyTypeConstant.WICBoQRelatedAssembly;
								}
								if (api === 'copy') {
									let assemblyIds = [];
									let boqWic2assemblyIds = [];
									if (pastedContent && pastedContent.data && pastedContent.data.length > 0) {
										angular.forEach(pastedContent.data, function (assembly) {
											assemblyIds.push(assembly.EstLineItemFk);
											boqWic2assemblyIds.push(assembly.Id);
										});
										/* jshint -W073 */ // locks are nested too deeply
										if (assemblyIds && assemblyIds.length > 0) {
											let postData = {
												LineItemCreationData: {
													SelectedItems: [],
													ProjectId: estimateMainService.getSelectedProjectId(),
													EstHeaderFk: estimateMainService.getSelectedEstHeaderId()
												},
												DragDropAssemlySourceType: dragDropAssemlySourceType,
												AssemblyIds: assemblyIds,
												isCopy: true,
												BoqWic2assemblyIds: boqWic2assemblyIds,
												api: api,
												type: pastedContent.type
											};

											estimateMainService.assignQtyRelationOfLeadingStructures(postData.LineItemCreationData);
											estimateMainService.assignDefaultLeadingStructures(postData.LineItemCreationData);
											estimateMainService.AssignAssemblyToLineItem(postData, null);
										}
									}
								} else if (api === 'move') {
									let selectedDestItems = estimateMainService.getSelectedEntities();

									let matchDestItems = _.filter(selectedDestItems, function (litem) {
										if (litem.EstRuleSourceFk <= 0 && litem.EstLineItemFk <= 0) {
											return litem;
										}
									});

									let isNeedAssignBoq = false;
									let destItems = [];
									if (selectedDestItems.length > 0) {
										destItems = matchDestItems;
									} else {
										destItems = [destItem];
										if (pastedContent.type === 'estWic2Assemblies') {
											isNeedAssignBoq = true;
										}
									}

									if (pastedContent.data && pastedContent.data.length === 1 && destItems && destItems.length > 0) {

										let assemblyIds = [pastedContent.data[0].EstLineItemFk];
										let boqWic2assemblyIds = [pastedContent.data[0].Id];
										// let currentSelectedLineItem = estimateMainService.getSelected();
										let currentSelectedLineItems = estimateMainService.getSelectedEntities();
										let postData = {
											LineItemCreationData: {
												SelectedItems: currentSelectedLineItems,
												ProjectId: estimateMainService.getSelectedProjectId(),
												EstHeaderFk: estimateMainService.getSelectedEstHeaderId()
											},
											DragDropAssemlySourceType: dragDropAssemlySourceType,
											AssemblyIds: assemblyIds,
											BoqWic2assemblyIds: boqWic2assemblyIds
										};

										if (isNeedAssignBoq) {
											estimateMainService.assignDefaultLeadingStructures(postData.LineItemCreationData);
										}
										estimateMainService.AssignAssemblyToLineItem(postData, currentSelectedLineItems);
									}
								}
							} else if (type === 'resources') {
								let lineItemSelected = estimateMainService.getSelected();
								if (lineItemSelected && pastedContent && pastedContent.data && pastedContent.data.length > 0) {
									let ids = _.map(pastedContent.data, 'EstLineItemFk');
									estimateMainResourceService.setSelected(destItem);
									if (api === 'copy') {
										estimateMainResourceService.copyAssembliesToEstResource(lineItemSelected, ids, true);
									} else if (api === 'move') {
										// if destination is SubItem, then add assembly(s) to SubItem
										let addToSubItem = destItem && destItem.EstResourceTypeFk === estimateMainResourceType.SubItem;
										estimateMainResourceService.moveAssembliesToEstResource(lineItemSelected, ids, addToSubItem, true);
									}
								}
							} else if (type === 'estlineitemselstatements') {
								let wic2AssemblyItem = _.first(pastedContent.data);
								destItem.EstAssemblyFk = wic2AssemblyItem.EstLineItemFk;
								destItem.EstHeaderAssemblyFk = wic2AssemblyItem.EstHeaderFk;

								destinationService.markItemAsModified(destItem);
								estimateMainService.update();
							}
						} else if ((pastedContent.type === 'copySourceLineItems' || pastedContent.type === 'copySourceAssemblies') && type === 'lineItems') {

							let sourceLineItemsToCopy = angular.copy(pastedContent.data);

							if (!sourceLineItemsToCopy.length) {
								return;
							}

							let selectedBoq = $injector.get('estimateMainBoqService').getSelected();

							if (selectedBoq) {
								let estConfigData = estimateMainService.getEstiamteReadData();
								angular.forEach(sourceLineItemsToCopy, function (item) {
									let description = angular.copy(item.DescriptionInfo);
									// estimateMainService.assignQtyRelationOfLeadingStructures(item);
									if (estConfigData.EstStructureDetails && estConfigData.EstStructureDetails.length >= 1) {
										let itemUomFk = item.BasUomFk;
										estimateMainService.assignDefaultLeadingStructures(item);
										item.QtyTakeOverStructFk = 1;
										item.QtyRelFk = item.EstQtyRelBoqFk;
										$injector.get('estimateMainCreationService').processItem(item);
										item.QuantityTarget = selectedBoq.QuantityAdj;
										item.QuantityTargetDetail = selectedBoq.QuantityAdjDetail;
										item.WqQuantityTarget = selectedBoq.Quantity;
										item.WqQuantityTargetDetail = selectedBoq.QuantityDetail;
										item.BasUomFk = itemUomFk ? itemUomFk : 0;
									}
									item.QuantityTotal = selectedBoq.Quantity;
									item.Quantity = 1;
									if (description) {
										item.DescriptionInfo = angular.copy(description);
									}
								});
							}

							angular.forEach(sourceLineItemsToCopy, function (item) {
								item.BasUomTargetFk = (selectedBoq && selectedBoq.BasUomFk) ? selectedBoq.BasUomFk : item.BasUomTargetFk ? item.BasUomTargetFk : 0;
								item.BasUomFk = item.BasUomFk ? item.BasUomFk : 0;
								item.Budget = item.Budget ? item.Budget : 0;
								item.BudgetUnit = item.BudgetUnit ? item.BudgetUnit : 0;
							});

							let estMainCopySourceFilter = $injector.get('estimateMainCopySourceFilterService');

							let copySourceLineItems = function copySourceLineItems() {
								let dataTemp = {
									'LineItems': sourceLineItemsToCopy,
									'SourceProjectId': estMainCopySourceFilter.getSelectedProjectId(),
									'ProjectId': estimateMainService.getSelectedProjectId(),
									'SourceEstHeaderFk': estMainCopySourceFilter.getSelectedEstHeaderId(),
									'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
									'FromAssembly': estMainCopySourceFilter.getIsAssembly() ? 'AssemblyMaster' : null,
									'IsCopyLineItems': true,
									'IsLookAtCopyOptions': true,
									'SelectedTargetBoqItemId': selectedBoq ? selectedBoq.Id : null,
									'SelectedTargetBoqHeaderId': selectedBoq ? selectedBoq.BoqHeaderFk : null,
									'IsCopyByDragDropSearchWizard': true
								};
								let lastSelected = angular.copy(estimateMainService.getSelected());
								$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/saverequestdata', dataTemp).then(function (response) {
									let result = response.data;
									let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
									basicsCostGroupAssignmentService.attachCostGroupValueToEntity(result.CopiedLineItems, result.EstLineItem2CostGroups, function identityGetter(entity) {
										return {
											EstHeaderFk: entity.RootItemId,
											Id: entity.MainItemId
										};}, 'LineItem2CostGroups'
									);

									// clear lookup
									$injector.get('estimateRuleFormatterService').refreshRules();
									$injector.get('estimateParameterFormatterService').refreshParams();

									// update updatedLineItems UDP
									let udpValues = [];
									if(result.CopiedLineItems && result.CopiedLineItems.length > 0){
										_.forEach(result.CopiedLineItems, function(item){
											if(item && item.UserDefinedPriceColVal){
												udpValues.push(item.UserDefinedPriceColVal);
											}
										});
									}

									let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
									estimateMainDynamicUserDefinedColumnService.attachUpdatedValueToColumn(result.CopiedLineItems, udpValues);

									estimateMainService.addList(result.CopiedLineItems);
									estimateMainService.fireListLoaded();
									estimateMainService.updateItemSelection(lastSelected);

								});
							};
							estimateMainService.updateAndExecute(copySourceLineItems);
						} else {

							let data = angular.copy(pastedContent.data);
							let toId = destItem ? destItem.Id : -1;
							if (!data || !data.length) {
								clearClipboard();
								return;
							}
							let selectedDestItems = destinationService.getSelectedEntities();
							selectedDestItems = _.compact(selectedDestItems);
							let matchingItem = _.find(selectedDestItems, {Id: toId});

							let destItems = selectedDestItems && selectedDestItems.length && matchingItem ? selectedDestItems : [destItem];

							// eslint-disable-next-line no-prototype-builtins
							if (pastedContent.type === 'estimateRules' && destItem && !destItem.hasOwnProperty('EstResourceTypeFkExtend')) {

								// can not assigned rule to the lineitem which generated by rule ro reference with other lineitem
								destItems = _.filter(destItems, function (item) {
									return !item.EstRuleSourceFk && !item.EstLineItemFk;
								});

								angular.forEach(destItems, function (item) {
									assignEstRulesToItem(data, item, destinationService);
								});
								estimateMainValidationService.asyncValidateDragDropRule(destItems, destinationService);
								// todo : pending display rule param dialog and apply param for all selected lineitems line items..pending requirement
							} else if (type === 'estlineitemselstatements' && destItem) {
								if (pastedContent.type === 'estActivityItems') {
									let activityItem = _.first(pastedContent.data);
									destItem.PsdActivityFk = activityItem.Id;
									destinationService.markItemAsModified(destItem);
									estimateMainService.update();
								} else if (pastedContent.type === 'estBoqItems') {
									let boqItem = _.first(pastedContent.data);
									destItem.BoqItemFk = boqItem.Id;
									destItem.BoqHeaderFk = boqItem.BoqHeaderItemFk;
									destItem.IsIncluded = boqItem.Included;
									destItem.IsFixedPrice = boqItem.IsFixedPrice;
									destItem.IsOptional = estimateMainBoqService.IsLineItemOptional(boqItem);
									destItem.IsOptionalIT = estimateMainBoqService.IsLineItemOptionalIt(boqItem);
									setGCValueFromBoqHeader(destItem);

									destinationService.markItemAsModified(destItem);
									estimateMainService.update();
								} else if (pastedContent.type === 'wicBoqItems') {
									let wicBoqItem = _.first(pastedContent.data);
									destItem.WicItemFk = wicBoqItem.Id;

									destItem.WicBoqItemFk = wicBoqItem.WicItemFk;
									destItem.WicBoqHeaderFk = wicBoqItem.WicHeaderItemFk;

									destinationService.markItemAsModified(destItem);
									estimateMainService.update();
								}
							} else if (isFilterStructureType(pastedContent.type) && destItem) {
								let ids = _.map(destItems, 'Id');
								let projectId = estimateMainService.getProjectId();
								let estHeaderId = estimateMainService.getSelectedEstHeaderId();
								let postData = {
									estLineItemFks: ids,
									estHeaderFk: estHeaderId,
									projectId: projectId
								};
								let url = $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getlistbylineitems', postData);

								url.then(function (response) {
									let resources = response && response.data && response.data.dtos ? response.data.dtos : [];

									// load user defined column value
									let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
									let udpData = response && response.data && response.data.dynamicColumns && _.isArray(response.data.dynamicColumns.ResoruceUDPs) ? response.data.dynamicColumns.ResoruceUDPs : [];
									if (udpData.length > 0) {
										estimateMainResourceDynamicUserDefinedColumnService.attachUpdatedValueToColumn(resources, udpData, false);
									}

									if (pastedContent.type === 'estBoqItems') {
										if (api === 'copy') {
											copyLineItemFromLeadingStructure(pastedContent.type, pastedContent.data[0], estHeaderId, projectId, ids, onSuccessCallback);
										} else if (api === 'move') {
											let readData = {};
											readData.Data = [];
											angular.forEach(destItems, function (item) {
												readData.Data.push({
													EstHeaderFk: item.EstHeaderFk,
													EstLineItemFk: item.Id
												});
											});
											$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/listbyselection', readData).then(function (response) {
												lineItem2ModelObjects = response.data;
												assignLeadingStructureToLineItems(destItems, resources, pastedContent, destinationService, data);
											});
										}
									} else {
										assignLeadingStructureToLineItems(destItems, resources, pastedContent, destinationService, data);
									}
								});

							} else if (pastedContent.type === 'resources' && destinationService.getServiceName() === 'estimateMainResourceService') {
								// renumber resources.EstResourceFk change
								let itemsToMove = _.filter(data, function (d) {
									return d.EstRuleSourceFk === null;
								});

								if (!itemsToMove.length) {
									clearClipboard();
								} else {
									let lineItem = estimateMainService.getSelected();
									if (api === 'move') {
										let resItemToFocus = itemsToMove[0],
											itemList = destinationService.getList();

										angular.forEach(itemsToMove, function (item) {
											estimateMainGenerateSortingService.sortOnDragDrop(destItem, itemList, item);
										});

										// calculate resources
										/* calculate quantity and cost of resources */
										$injector.get('estimateMainCompleteCalculationService').updateResourcesInList(lineItem, itemList);

										angular.forEach(itemsToMove, function (item) {
											if (item.EstResourceTypeFk === estimateMainResourceType.SubItem) {
												item.EstResourceFk = _.find(itemList, {'Id': item.Id}).EstResourceFk;
												$injector.get('estimateMainSubItemCodeGenerator').getSubItemCode(item, itemList);
												_.find(itemList, {'Id': item.Id}).Code = item.Code;
												// handle subitem child code
												if(item.EstResources.length > 0){
													let newItem = _.find(itemList, {'Id': item.Id});
													$injector.get('estimateMainResourceDetailService').updateCodeAndSorting(newItem.EstResources, newItem, estimateMainResourceService);
												}
											}
										});

										estimateMainResourceService.handleGcBreakdownDragDrop(lineItem, itemsToMove, itemList);

										// save resources
										angular.forEach(itemList, function (item) {
											destinationService.markItemAsModified(item);
										});

										estimateMainService.markItemAsModified(lineItem);
										updateItems(lineItem, resItemToFocus, itemList);
									} else {

										let itemList = destinationService.getList();

										angular.forEach(itemsToMove, function (item) {
											estimateMainGenerateSortingService.sortOnDragDrop(destItem, itemList, item);
										});

										estimateMainResourceService.handleGcBreakdownDragDrop(lineItem, itemsToMove, itemList);

										copyResources(pastedContent, destItem, api);
									}

								}
							} else if (pastedContent.type === 'resources' && type === 'lineItems') {
								let currentAction = pastedContent.action === platformDragdropService.actions.copy ? true : false;
								let copyResourcesToLineItem = function copyResourcesToLineItem() {
									let containerData = estimateMainService.getContainerData();
									let updateData = {EntitiesCount: 1};
									updateData.IsMoveOrCopyResource = api;
									updateData[containerData.itemName] = [destItem];
									updateData.ToLineItemId = destItem.Id;
									updateData.EstResourcesToCopy = pastedContent.data;
									updateData.ProjectId = estimateMainService.getSelectedProjectId();
									updateData.EstHeaderId = estimateMainService.getSelectedEstHeaderId();
									updateData.DoUpdate = !currentAction;
									updateData.IsLookAtCopyOptions = true;
									updateData.IsCopyResourcesTo= true;
									updateData.IsCopyFromLineItemResource = true;
									updateData.CopyResourcesToLineItemIds = [destItem.Id];

									let copyOptionItem = $injector.get('estimateMainCopySourceCopyOptionsDialogService').getCurrentItem();
									 if(copyOptionItem.CopyResourcesTo === 1){
										updateData.CopyResourcesToLineItemIds =  _.map(estimateMainService.getList(), 'Id');
									}

									// Adding a flag to copy subitem resources to lineitem
									_.forEach(updateData.EstResourcesToCopy, function(item){
										if(item){
											updateData.IsSubitemResource = item.EstResourceFk !== null && currentAction ? true : false;
										}
									});
									let updatePromise = $http.post(containerData.httpUpdateRoute + 'copyresourcestolineitem', updateData);
									updatePromise.then(function (response) {
										let result = response ? response.data : {};
										let updatedLineItems = result[containerData.itemName];
										if (angular.isArray(result.UserDefinedcolsOfLineItemModified)) {
											$injector.get('estimateMainDynamicUserDefinedColumnService').attachUpdatedValueToColumn(updatedLineItems, result.UserDefinedcolsOfLineItemModified, true);
										}
										estimateMainService.addList(updatedLineItems);
										_.each(updatedLineItems, function (item) {
											estimateMainService.fireItemModified(item);
										});
										estimateMainService.setSelected(destItem);
									});
								};
								estimateMainService.updateAndExecute(copyResourcesToLineItem);
							} else if ((pastedContent.type === 'copySourceLineItemResource' || pastedContent.type === 'copySourceAssembliesResource') && type === 'lineItems') {
								if (api === 'move') {
									return;
								}
								let copyResourcesToLineItem = function copyResourcesToLineItem() {
									let containerData = estimateMainService.getContainerData();
									let updateData = {EntitiesCount: 1};
									updateData.IsMoveOrCopyResource = 'copy';
									updateData[containerData.itemName] = [destItem];
									updateData.ToLineItemId = destItem.Id;
									updateData.EstResourcesToCopy = pastedContent.data;
									updateData.ProjectId = estimateMainService.getSelectedProjectId();
									updateData.EstHeaderId = estimateMainService.getSelectedEstHeaderId();
									updateData.IsLookAtCopyOptions = true;
									updateData.IsCopyResourcesTo= true;
									updateData.CopyResourcesToLineItemIds = _.map(estimateMainService.getSelectedEntities(), 'Id');

									let copyOptionItem = $injector.get('estimateMainCopySourceCopyOptionsDialogService').getCurrentItem();
									if(copyOptionItem.CopyResourcesTo === 2){
										updateData.CopyResourcesToLineItemIds =  _.map(estimateMainService.getSelectedEntities(), 'Id');
									}else if(copyOptionItem.CopyResourcesTo === 1){
										updateData.CopyResourcesToLineItemIds =  _.map(estimateMainService.getList(), 'Id');
									}

									// Adding a flag to copy subitem resources to lineitem
									_.forEach(updateData.EstResourcesToCopy, function(item){
										if(item){
											updateData.IsSubitemResource = item.EstResourceFk !== null ? true : false;
										}
									});

									let updatePromise = $http.post(containerData.httpUpdateRoute + 'copyresourcestolineitem', updateData);
									updatePromise.then(function (response) {
										let result = response ? response.data : {};
										let updatedLineItems = result[containerData.itemName];
										estimateMainService.addList(updatedLineItems);
										_.each(updatedLineItems, function (item) {
											estimateMainService.fireItemModified(item);
										});
										let selectedLineItem = estimateMainService.getSelected();
										if (selectedLineItem && selectedLineItem.Id === destItem.Id && selectedLineItem.EstHeaderFk === destItem.EstHeaderFk) {
											estimateMainResourceService.load();
										} else {
											estimateMainService.setSelected(destItem);
										}
									});
								};
								estimateMainService.updateAndExecute(copyResourcesToLineItem);
							} else if (pastedContent.type === 'copySourceLineItemResource' || pastedContent.type === 'copySourceAssembliesResource' && type === 'resources') {
								let copySourceResToLineItem = function copyResourcesToLineItem() {
									let toLiItem = estimateMainService.getSelected();
									let currentAction = pastedContent.action === platformDragdropService.actions.copy ? true : false;
									if (!toLiItem) {
										return $injector.get('platformModalService').showMsgBox($translate.instant('estimate.main.noCurrentLineItemSelection'), 'Info', 'ico-info');
									}

									let containerData = estimateMainService.getContainerData();
									let updateData = { EntitiesCount: 1 };
									updateData[containerData.itemName] = [toLiItem];
									updateData.ToLineItemId = toLiItem.Id;
									updateData.EstResourcesToCopy = pastedContent.data;
									updateData.ProjectId = estimateMainService.getSelectedProjectId();
									updateData.EstHeaderId = estimateMainService.getSelectedEstHeaderId();
									updateData.EstParentResource = destItem;
									updateData.IsMove = true;
									updateData.IsLookAtCopyOptions = true;
									updateData.IsCopyByDragDropSearchWizard = true;

									// Adding a flag to copy subitem resources to lineitem
									_.forEach(updateData.EstResourcesToCopy, function(item){
										if(item){
											updateData.IsSubitemResource = item.EstResourceFk !== null && currentAction ? true : false;
										}
									});

									let updatePromise = $http.post(containerData.httpUpdateRoute + 'copyresourcestolineitem', updateData);
									updatePromise.then(function (response) {
										let result = response ? response.data : {};
										let updatedLineItems = result[containerData.itemName];

										if (angular.isArray(result.UserDefinedcolsOfLineItemModified)) {
											$injector.get('estimateMainDynamicUserDefinedColumnService').attachUpdatedValueToColumn(updatedLineItems, result.UserDefinedcolsOfLineItemModified, true);
										}

										estimateMainService.addList(updatedLineItems);
										_.each(updatedLineItems, function (item) {
											estimateMainService.fireItemModified(item);
										});
										estimateMainResourceService.load();
									});
								};
								estimateMainService.updateAndExecute(copySourceResToLineItem);
							} else {
								if (pastedContent.type !== 'lineItems') {
									return;
								}
								// let url = data && data.length ? 'estimate/main/lineitem/' : null;
								// multi lineitems drg drop to leading structures or rule
								if (type === 'estimateRules' && destItem) {
									angular.forEach(data, function (d) {
										assignEstRulesToItem([destItem], d, pastedContent.itemService);
									});
									estimateMainValidationService.asyncValidateDragDropRule(data, pastedContent.itemService);

								} else if (isFilterStructureType(type) && destItem) {

									let ids = _.map(pastedContent.data, 'Id');
									let projectId = estimateMainService.getProjectId();
									let estHeaderId = estimateMainService.getSelectedEstHeaderId();

									estimateMainService.parentScope.isLoading = true;

									let postData = {
										estLineItemFks: ids,
										estHeaderFk: estHeaderId,
										projectId: projectId
									};
									$http.post(globals.webApiBaseUrl + 'estimate/main/resource/getlistbylineitems', postData)
										.then(function (response) {
											let resourceList = [];
											if (response && response.data && response.data.dtos) {
											// load user defined column value
												let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
												let udpData = response && response.data && response.data.dynamicColumns && _.isArray(response.data.dynamicColumns.ResoruceUDPs) ? response.data.dynamicColumns.ResoruceUDPs : [];
												if (udpData.length > 0) {
													estimateMainResourceDynamicUserDefinedColumnService.attachUpdatedValueToColumn(response.data.dtos, udpData, false);
												}
												if (api === 'copy') {
													copyLineItemFromLeadingStructure(type, destItem, estHeaderId, projectId, ids, onSuccessCallback);
												} else if (api === 'move') {
													assignLeadingStructureToLineItemsLoop(resourceList,pastedContent,destItem,response,type);
												}
											}
											if (pastedContent.type === 'wicBoqItems') {
												pastedContent.itemService.update();
											} else {
												estimateMainService.update();
											}

											estimateMainService.parentScope.isLoading = false;
										}, function (){
											estimateMainService.parentScope.isLoading = false;
										});
								} else {
									// multi lineitems drg drop to same container
									if (destItem && data.length > 1) {
										toId = -1;
									}
									if (api === 'move') {
										return;
									}

									let dataTemp = {
										'LineItems': data,
										'SourceProjectId': estimateMainService.getSelectedProjectId(),
										'ProjectId': estimateMainService.getSelectedProjectId(),
										'SourceEstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
										'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
										'FromAssembly': null,
										'IsCopyLineItems' : true,
										'CopyAsRef':false,
										'IsLookAtCopyOptions' :true
									};

									$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/savecopyrequestdata', dataTemp)
										.then(function (response) {
											let result = response.data;
											let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
											basicsCostGroupAssignmentService.attachCostGroupValueToEntity(result.CopiedLineItems, result.EstLineItem2CostGroups, function identityGetter(entity) {
												return {
													EstHeaderFk: entity.RootItemId,
													Id: entity.MainItemId
												};
											},
											'LineItem2CostGroups'
											);
											onSuccessCallback(result.CopiedLineItems);
										})
										// todo global catch http errors (see http://stackoverflow.com/questions/11971213/global-ajax-error-handler-with-angularjs)
										.catch(function (response) {
											service.onPostClipboardError.fire(response);
										});
								}
							}
						}
					}
				});
			}
			function  copyLineItemFromLeadingStructure(type, destItem, estHeaderId, projectId, ids, onSuccessCallback) {
				let RootItemId = null;
				let boqList = [];
				if (type === 'estBoqItems') {
					boqList.push(destItem.Id);
					RootItemId = destItem.BoqHeaderFk;
				}
				let generateFromleadingStructurePostData = {
					'StructureId': 15,
					'StructureName': 'Boq',
					'RootItemId': RootItemId,
					'CopyLineItemUsingLeadingStructure': true,
					'UpdateLineItemCode': false,
					'CreateOnlyNewLineItem': false,
					'UpdateExistedItem': false,
					'CreateBoq': false,
					'IsDragDrop': true,
					'EstHeaderFk': estHeaderId,
					'ProjectFk': projectId,
					'EstStructureId': 0,
					'CopyCostGroup': false,
					'CopyPrjCostGroup': false,
					'CopyWic': false,
					'CopyControllingUnit': false,
					'CopyLocation': false,
					'CopyProcStructure': false,
					'CopyBoqFinalPrice': false,
					'CopyRelatedWicAssembly': false,
					'IsBySplitQuantity': false,
					'IsGenerateAsReferenceLineItems': false,
					'CopyLeadingStructrueDesc': false,
					'UpdateLeadStrucDescToExistingItem': false,
					'CopyUserDefined1': false,
					'CopyUserDefined2': false,
					'CopyUserDefined3': false,
					'CopyUserDefined4': false,
					'CopyUserDefined5': false,
					'BoqIdList': boqList,
					'LineItemIdList': ids,
					'UserDefined6': true,
					'BoqHeaderFk': 0,
					'IsLookAtCopyOptions':true
				};
				if (generateFromleadingStructurePostData.ProjectFk > 0 && generateFromleadingStructurePostData.EstHeaderFk > 0) {
					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/CopyFromLeadingStructure', generateFromleadingStructurePostData)
						.then(function (response) {
							let result = response.data;
							let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
							basicsCostGroupAssignmentService.attachCostGroupValueToEntity(result.CopiedLineItems, result.EstLineItem2CostGroups, function identityGetter(entity) {
								return {
									EstHeaderFk: entity.RootItemId,
									Id: entity.MainItemId
								};
							},
							'LineItem2CostGroups'
							);
							onSuccessCallback(result.CopiedLineItems);
						})
						.catch(function (response) {
							service.onPostClipboardError.fire(response);
						});
				}
			}

			function assignLeadingStructureToLineItemsLoop(resourceList,pastedContent,destItem,response,type){
				let refReslist = basicsLookupdataLookupDescriptorService.getData('refLineItemResources');
				angular.forEach(pastedContent.data, function (d) {
					resourceList = _.filter(response.data.dtos, function (r) {
						return r.EstHeaderFk === d.EstHeaderFk && r.EstLineItemFk === d.Id;
					});

					if (resourceList.length === 0) {
						resourceList = _.filter(refReslist, function (item) {
							return item.EstResourceFk === null && item.EstLineItemFk === destItem.EstLineItemFk;
						});
					}
					assignFilterStructureToItem(type, [destItem], d, pastedContent.itemService, resourceList);
				});
			}
			function assignLeadingStructureToLineItems(destItems,resources,pastedContent,destinationService,data){
				var permissions = [];
				angular.forEach(destItems, function (item) {
					let resourceList = [];

					resourceList = _.filter(resources, function (d) {
						return d.EstHeaderFk === item.EstHeaderFk && d.EstLineItemFk === item.Id;
					});

					if (resourceList.length === 0) {
						let refReslist = basicsLookupdataLookupDescriptorService.getData('refLineItemResources');
						resourceList = _.filter(refReslist, function (item) {
							return item.EstResourceFk === null && item.EstLineItemFk === item.EstLineItemFk;
						});
					}

					let res = assignFilterStructureToItem(pastedContent.type, data, item, destinationService, resourceList);
					if(res && res.then){
						permissions.push(res);
					}
				});
				if (pastedContent.type === 'wicBoqItems' || pastedContent.type === 'estBoqItems') {
					if(permissions.length > 0){
						$q.all(permissions).then(function(){
							destinationService.update();
						});
					}else{
						destinationService.update();
					}

				}
			}

			service.createLineItemBoq = function createLineItemBoq(selectedItems,selectedKey) {

				let boqList = [];

				selectedItems.forEach(item => {
					let  boq=item.Id;
					boqList.push(boq);
				});
				let createLineItem,updateLineItem;
				if(selectedKey){
					createLineItem = false;
					updateLineItem = true;
				} else {
					createLineItem = true;
					updateLineItem = false;
				}
				let postData = {
					'StructureId': 15,
					'StructureName': 'Boq',
					'RootItemId':selectedItems[0].BoqHeaderFk,
					'CreateOnlyNewLineItem': createLineItem,
					// Create new line items (from new BoQ items) and update the existing items
					'UpdateExistedItem': updateLineItem,
					'CreateBoq':true,
					'IsDragDrop':true,
					'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
					'ProjectFk': estimateMainService.getSelectedProjectId(),
					'EstStructureId': 0,
					'CopyCostGroup': false,
					'CopyPrjCostGroup': false,
					'CopyWic': false,
					'CopyControllingUnit': false,
					'CopyLocation': false,
					'CopyProcStructure': false,
					'CopyBoqFinalPrice': false,
					'CopyRelatedWicAssembly': false,
					'IsBySplitQuantity': false,
					'IsGenerateAsReferenceLineItems': false,
					'CopyLeadingStructrueDesc': true,
					'UpdateLeadStrucDescToExistingItem': false,
					'CopyUserDefined1': false,
					'CopyUserDefined2': false,
					'CopyUserDefined3': false,
					'CopyUserDefined4': false,
					'CopyUserDefined5': false,
					'BoqIdList': boqList,
					'UserDefined6':true,
					'BoqHeaderFk':0,
					'IsDayWork': true
				};

				if (postData.ProjectFk > 0 && postData.EstHeaderFk > 0) {
					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/generatefromleadingstructure', postData)
						.then(function (response) {

							if (response.data && response.data.result) {

								let permission = $q.when(null);
								if (postData.StructureName === 'Boq') {
									if (postData.RootItemId){
										permission = $injector.get('estimateMainBoqLookupService').loadDataByBoqHeaderId([postData.RootItemId]);
									}
								}
								permission.then(function () {
									$injector.get('basicsBoqSplitQuantityLookupDataService').resetCache({lookupType: 'basicsBoqSplitQuantityLookupDataService'});
									let estimateProjectService = $injector.get('estimateProjectService');
									let projectCompositeItems = estimateProjectService.getList();
									if (projectCompositeItems && projectCompositeItems.length > 0) {
										let a = null;
										_.forEach(projectCompositeItems, function (item) {
											if (item.EstHeader.Id === estimateMainService.getSelectedEstHeaderId()) {
												a = item;
											}
										});

										if (a) {
											estimateMainService.setEstimateHeader(a, 'EstHeader.Code');
										}
									} else {
										estimateMainService.load();
									}
								});
							}else{
								$injector.get('estimateMainCommonService').showConcurrencyBox(response.data);
							}

						});
				}

			};


			// TODO: drag wic2assembly to create line item and resource by assembly
			function createLineItemAndResource(assemblyIds, destinationService, data, onSuccessCallback) {
				destinationService.createItem().then(function (item) {
					item.EstAssemblyFk = assemblyIds[0];
					// set the takeover quantity from related assembly of WIC
					let currentEntity = _.find(data, {'EstLineItemFk': item.EstAssemblyFk});
					if (currentEntity) {
						item.Quantity = currentEntity.Wic2AssemblyQuantity;
						item.QuantityDetail = item.Quantity;
					}

					ids = _.drop(assemblyIds);
					let func = function () {
						estimateMainCommonService.getAssemblyById(item.EstAssemblyFk).then(function (response) {
							let lineItemEntity = item,
								assembly = response.data,
								projectInfo = destinationService.getSelectedProjectInfo(),
								projectId = projectInfo.ProjectId ? projectInfo.ProjectId : destinationService.getSelectedProjectId();

							if (lineItemEntity && lineItemEntity.EstAssemblyFk) {

								lineItemEntity.DescriptionInfo.Translated = assembly.DescriptionInfo.Description;
								lineItemEntity.DescriptionInfo.Description = assembly.DescriptionInfo.Description;
								lineItemEntity.DescriptionInfo.Modified = true;

								// TO DO: copy character1 and character2 to line item form assembly
								$injector.get('estimateMainCharacteristicCommonService').copyCharacter1AssemblyToLineItem(estimateMainService, assembly, lineItemEntity);
								$injector.get('estimateMainCharacteristicCommonService').copyCharacter2AssemblyToLineItem(estimateMainService, assembly, lineItemEntity);

								// only assign assembly when has value
								estimateMainCommonService.assignAssembly(lineItemEntity, assembly, projectId, true, null, null, true, true).then(function (response) {
									let resources = _.filter(angular.copy(response.data.resourceOfAssembly), function (res) {
										return res.EstLineItemFk === lineItemEntity.Id;
									});
									if (resources) {
										estimateMainResourceService.resolveResourceFromAssembly(lineItemEntity, resources);
										// set also assembly cat
										lineItemEntity.EstAssemblyCatFk = assembly.EstAssemblyCatFk;

										// recalculate the dynamic column
										estimateMainCommonService.calculateLineItemAndResources(lineItemEntity, resources);

										$injector.get('estimateMainResourceValidationService').validateSubItemsUniqueCodeFromAssembly(resources);
										let data = {
											lineItem: item,
											resources: resources,
											destinationService: destinationService,
											onSuccessCallback: onSuccessCallback
										};
										onSuccessCallback(data);
									}
								});
							}
						});
					};
					$timeout(func, 500);
				});
			}

			function assignFilterStructureToItem(type, sourceItems, destItem, itemService, resourceList) {
				// only exact one item can be assigned
				if (_.size(sourceItems) !== 1) {
					return;
				}

				// special handling for activity and boq
				// ActivityTypeFk, only assign Activities (Activity => ActivityTypeFk === 1)
				let item = sourceItems[0];
				if (type === 'estActivityItems') {
					if (item.ActivityTypeFk === undefined) {
						return;
					}
				} else if (type === 'estBoqItems') {
					// BoqLineTypeFk, only assign:
					// Position = 0, Sub-Description = 110, Surcharge Item (200, 201, 202, 203)
					let boqLineTypes = [0, 11, 200, 201, 202, 203];
					if (boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
						return;
					}

					if (item && item.Id && item.BoqLineTypeFk === 0) {
						// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
						if (_.isArray(item.BoqItems) && item.BoqItems.length > 0) {
							let crbChildrens = _.filter(item.BoqItems,{'BoqLineTypeFk':11});
							if(crbChildrens && crbChildrens.length){
								return;
							}
						}
					}
				} else if (type === 'wicBoqItems') {
					// wic boq position(0) and surcharge(200, 201, 202, 203) can assign to line item.
					let boqLineTypes1 = [0, 11, 200, 201, 202, 203];
					if (boqLineTypes1.indexOf(item.BoqLineTypeFk) === -1) {
						return;
					}

					if (item && item.Id && item.BoqLineTypeFk === 0) {
						// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
						if (_.isArray(item.BoqItems) && item.BoqItems.length > 0) {
							let crbChildrens = _.filter(item.BoqItems,{'BoqLineTypeFk':11});
							if(crbChildrens && crbChildrens.length){
								return;
							}
						}
					}
				}

				let mapType2Prop = {
					'estActivityItems': 'PsdActivityFk',
					'estAssemblyItems': 'EstAssemblyFk',
					'estBoqItems': 'BoqItemFk',
					'wicBoqItems': 'WicBoqItemFk',
					'EstCostGrp': 'CostGroupFk',
					'estCtuItems': 'MdcControllingUnitFk',
					'estPrjLocationItems': 'PrjLocationFk',
					'estPrcStructureItems': 'PrcStructureFk'
				};
				if (mapType2Prop[type]) {
					// fix for ALM 106365
					let updateByEstConfigSorting = function updateByEstConfigSorting(destItem, item, structureFk, modelObjects) {
						// fix for ALM 123995
						destItem[mapType2Prop[type]] = item.Id;

						// Fix for ALM 103089
						$injector.get('estimateMainValidationService').updateQuantityUomEstConfigSorting(destItem, item, structureFk, modelObjects);

						destItem.QuantityTargetDetail = destItem.QuantityTarget;
						destItem.WqQuantityTargetDetail = destItem.WqQuantityTarget;


						// calculate LineItem
						resourceList = !resourceList || !resourceList.length ? $injector.get('estimateMainResourceService').getList() : resourceList;

						// Get reference Lineitem resources
						if (resourceList.length === 0) {
							let refReslist = basicsLookupdataLookupDescriptorService.getData('refLineItemResources');
							resourceList = _.filter(refReslist, function (item) {
								return item.EstResourceFk === null && item.EstLineItemFk === destItem.EstLineItemFk;
							});
						}
						else if(resourceList[0].EstHeaderFk !== destItem.EstHeaderFk || resourceList[0].EstLineItemFk !== destItem.Id){
							resourceList = [];
						}

						itemService.markItemAsModified(destItem);

						let resourceTree = _.filter(resourceList, function (resource) {
							return resource.EstResourceFk === null;
						});

						return estimateMainCommonService.calculateLineItemAndResources(destItem, resourceTree).then(function (){
							if (type === 'estBoqItems') {
								resourceList = [];
								$injector.get('cloudCommonGridService').flatten(resourceTree, resourceList, 'EstResources');
								angular.forEach(resourceList, function (res) {
									res.IsIndirectCost = destItem.IsGc;
									estimateMainResourceService.fireItemModified(res);
								});
							}
							estimateMainResourceService.setList(resourceTree);
							let resGridId = estimateMainResourceService.getGridId();
							let resGrid = resGridId ? platformGridAPI.grids.element('id', resGridId) : null;
							let grid = resGrid ? resGrid.instance : null;
							if(grid) {
								grid.getData().setItems(resourceTree, grid.options.idProperty);
							}
							itemService.fireItemModified(destItem);
							return true;
						});
					};

					if (type === 'EstCostGrp') {
						if (destItem['costgroup_' + item.CostGroupCatalogFk] !== item.Id) {
							destItem['costgroup_' + item.CostGroupCatalogFk] = item.Id;

							let isProjectCostGroup;
							let structureFk;
							let costGroupCatalogs = $injector.get('basicsLookupdataLookupDescriptorService').getData('costGroupCatalogs');
							if (costGroupCatalogs && _.size(costGroupCatalogs) > 0) {
								let prjCostGroup = _.filter(costGroupCatalogs, function (item) {
									return item.ProjectFk && !item.LineItemContextFk;
								});

								isProjectCostGroup = _.filter(prjCostGroup, {Id: item.CostGroupCatalogFk});
								if (isProjectCostGroup.length >= 1) {
									structureFk = $injector.get('estimateMainParamStructureConstant').ProjectCostGroup;
								} else {
									structureFk = $injector.get('estimateMainParamStructureConstant').EnterpriseCostGroup;
								}
							}

							let costGroupCol = {};
							costGroupCol.field = 'costgroup_' + item.CostGroupCatalogFk;
							costGroupCol.costGroupCatId = item.CostGroupCatalogFk;

							if (!itemService.getSelected()) {
								itemService.setSelected(destItem);
							}

							$injector.get('estimateMainLineItemCostGroupService').createCostGroup2Save(destItem, costGroupCol).then(function () {
								return updateByEstConfigSorting(destItem, item, structureFk);
							});
						}
					} else {

						// let oldBoqItemId= destItem[mapType2Prop[type]];
						// destItem[mapType2Prop[type]] = item.Id;
						if (mapType2Prop[type] === 'BoqItemFk') {
							destItem.BoqHeaderFk = item.BoqHeaderFk;
							destItem.IsIncluded = item.Included;
							destItem.IsFixedPrice = item.IsFixedPrice;
							destItem.IsOptional = estimateMainBoqService.IsLineItemOptional(item);
							destItem.IsOptionalIT = estimateMainBoqService.IsLineItemOptionalIt(item);
							destItem.BoqItemFk = item.Id;
							destItem.ExternalCode = item.ExternalCode;
							setGCValueFromBoqHeader(destItem);
							destItem.IsDaywork = !destItem.IsGc && item.IsDaywork;

							if(!destItem.DescriptionInfo || !destItem.DescriptionInfo.Description || destItem.DescriptionInfo.Description === '') {
								destItem.DescriptionInfo = angular.copy(item.BoqLineTypeFk !== 11 ? item.BriefInfo : item.DescriptionInfo);
								if(destItem.DescriptionInfo){ destItem.DescriptionInfo.DescriptionTr = null;}
							}

							if (item.BoqLineTypeFk === 11 && [1, 4, 6, 7].includes(destItem.EstQtyRelBoqFk)){
								let output = [];
								$injector.get('cloudCommonGridService').flatten(estimateMainBoqService.getList(), output, 'BoqItems');
								let parentBoqItem = _.find(output, {'Id': item.BoqItemFk});
								if(parentBoqItem){
									item.BasUomFk = parentBoqItem.BasUomFk;
								}
							}
							return updateByEstConfigSorting(destItem, item, $injector.get('estimateMainParamStructureConstant').BoQs, _.filter(lineItem2ModelObjects, {EstLineItemFk: destItem.Id, EstHeaderFk: destItem.EstHeaderFk}));
						} else if (mapType2Prop[type] === 'WicBoqItemFk') {
							destItem.WicBoqHeaderFk = item.BoqHeaderFk;
							destItem.BoqWicCatFk = item.BoqWicCatFk;
							destItem.BasUomTargetFk = item.BasUomFk ? item.BasUomFk : item.UomFk;
							destItem.WicBoqItemFk = item.Id;
							$injector.get('boqWicItemService').clearBoqCache();
							itemService.markItemAsModified(destItem);
							// calculate LineItem
							let lineItemResources = resourceList && resourceList.length ? _.filter(resourceList, {EstLineItemFk: destItem.Id, EstHeaderFk: destItem.EstHeaderFk}) : [];
							estimateMainCommonService.calculateLineItemAndResources(destItem, lineItemResources);
						} else if (mapType2Prop[type] === 'PsdActivityFk') {
							return updateByEstConfigSorting(destItem, item, $injector.get('estimateMainParamStructureConstant').ActivitySchedule);
						} else if (mapType2Prop[type] === 'MdcControllingUnitFk') {
							return updateByEstConfigSorting(destItem, item, $injector.get('estimateMainParamStructureConstant').Controllingunits);
						} else if (mapType2Prop[type] === 'PrjLocationFk') {
							return updateByEstConfigSorting(destItem, item, $injector.get('estimateMainParamStructureConstant').Location);
						} else {
							return updateByEstConfigSorting(destItem, item);
						}
					}
				}
			}

			function assignEstRulesToItem(sourceItems, destItem, itemService) {
				estimateMainRuleUpdateService.setRuleToSave(sourceItems, destItem, itemService.getServiceName(), itemService.getItemName());
				estimateRuleProcessor.assignRules(sourceItems, destItem, true);
				itemService.fireItemModified(destItem);
			}

			function updateItems() {
				let containerData = estimateMainService.getContainerData();
				let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
				let updateData = modTrackServ.getModifications(estimateMainService);
				updateData.doUpdate = true;
				let updatePromise = $http.post(containerData.httpUpdateRoute + containerData.endUpdate, updateData);
				updatePromise.then(function (response) {
					containerData.onUpdateSucceeded(response.data, containerData, updateData);
					estimateMainResourceService.load();
				});
			}

			// #start drag & drop for 3D Viewer
			service.myDragdropAdapter = new modelViewerDragdropService.DragdropAdapter();

			service.setDropMessageToViewer = function (msg) {
				modelViewerDragdropService.setDropMessage($translate.instant('estimate.main.dragDropMessage', {target: msg}));
			};

			service.myDragdropAdapter.canDrop = function (info) {
				if (!info.draggedData && info.draggedData.sourceGrid) {
					return;
				}
				if (!checkLIContainerPermission(info)) {
					return false;
				}
				return info.draggedData.sourceGrid.type === 'lineItems';

			};

			service.myDragdropAdapter.drop = function (info) {
				if (!info.draggedData && info.draggedData.sourceGrid) {
					return;
				}
				let grid = info.draggedData.sourceGrid;
				let draggedData = grid.data;
				modelViewerDragdropService.paste().then(function (createParam) {
					if (draggedData && grid.type === 'lineItems') {// drag line item to 3D viewer
						copyObjectsToModelObjects(draggedData, [], createParam.modelId, createParam.includedObjectIds);
					}
					clearClipboard();
				});
			};

			function initCreateData(req, mainObjectsSelected, modelSelectedId, objectIds) {
				let reqParameters = [];
				if (req && req.length) {
					_.forEach(req, function (item) {
						let reqParameter = {};
						reqParameter.EstHeaderFk = item ? item.EstHeaderFk : -1;
						reqParameter.EStLineItemFk = item ? item.Id : -1;
						reqParameter.ObjectIds = objectIds.useGlobalModelIds().toCompressedString();
						reqParameter.MdlModelFk = modelSelectedId;
						reqParameters.push(reqParameter);
					});
				}
				return reqParameters;
			}

			service.copyObjectsFromViewer = function copyObjectsFromViewer() {
				let selectedLineItems = estimateMainService.getSelectedEntities();
				if (selectedLineItems && selectedLineItems.length) {
					modelViewerDragdropService.paste().then(function (createParam) {
						copyObjectsToModelObjects(selectedLineItems, [], createParam.modelId, createParam.includedObjectIds);
					});
				}
			};

			function copyObjectsToModelObjects(req, selectedObjects, modelId, objectIds) {
				estimateMainService.update().then(function () {
					let instance2ObjectUrl = 'estimate/main/lineitem2mdlobject/viewer2objectcopy';
					let reqParameters = initCreateData(req, selectedObjects, modelId, objectIds);
					$http.post(globals.webApiBaseUrl + instance2ObjectUrl, reqParameters)
						.then(function (response) {
							if (response) {
								estimateMainLineItem2MdlObjectService.addList(response.data);
							}
						}).catch(function () {
						});
				});
			}

			// #end

			function setGCValueFromBoqHeader(lineItem) {
				let boqHeaderList = estimateMainBoqService.getBoqHeaderEntities();
				let boqHeader = _.find(boqHeaderList, {'Id': lineItem.BoqHeaderFk});
				if (boqHeader) {
					lineItem.IsGc = boqHeader.IsGCBoq;
					if(boqHeader.IsGCBoq){
						lineItem.IsOptional = false;
						lineItem.IsOptionalIT = false;
					}
				}
			}

			function copyResources (pastedContent, targetResource, api){
				// copy resources from one res to other
				let copySourceResToLineItem = function copyResourcesToLineItem() {
					let toLiItem = estimateMainService.getSelected();
					if (!toLiItem) {
						return $injector.get('platformModalService').showMsgBox($translate.instant('estimate.main.noCurrentLineItemSelection'), 'Info', 'ico-info');
					}

					let containerData = estimateMainService.getContainerData();
					let updateData = {EntitiesCount: 1};

					updateData[containerData.itemName] = [toLiItem];
					updateData.ToLineItemId = toLiItem.Id;
					updateData.EstResourcesToCopy = pastedContent.data;
					updateData.ProjectId = estimateMainService.getSelectedProjectId();
					updateData.EstHeaderId = estimateMainService.getSelectedEstHeaderId();
					updateData.EstParentResource = targetResource;
					updateData.IsMove = true;
					updateData.IsMoveOrCopyResource = api;
					updateData.IsLookAtCopyOptions=true;
					_.forEach(updateData.EstResourcesToCopy, function(item){
						if(item){
							item.EstResourceFk = null;
						}
					});
					let updatePromise = $http.post(containerData.httpUpdateRoute + 'copyresourcestolineitem', updateData);
					updatePromise.then(function (response) {
						let result = response ? response.data : {};
						let updatedLineItems = result[containerData.itemName];

						if(angular.isArray(result.UserDefinedcolsOfLineItemModified)){
							$injector.get('estimateMainDynamicUserDefinedColumnService').attachUpdatedValueToColumn(updatedLineItems, result.UserDefinedcolsOfLineItemModified, true);
						}

						estimateMainService.addList(updatedLineItems);
						_.each(updatedLineItems, function(item){
							estimateMainService.fireItemModified(item);
						});
						estimateMainResourceService.load();
					});
				};
				estimateMainService.updateAndExecute(copySourceResToLineItem);
			}

			return service;
		}
	]);

})(angular);

