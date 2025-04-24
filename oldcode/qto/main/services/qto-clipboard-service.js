(function (angular) {
	'use strict';
	let moduleName = 'qto.main';

	angular.module(moduleName).constant('qtoMainDragPasteTypeOption', [
		{'QtoDetail': ['Locations','BillTos', 'boqitem', 'QtoDetail', 'qtoMainStructure', 'LineItems']},
		{'Locations': ['QtoDetail']},
		{'BillTos': ['QtoDetail']},
		{'boqitem': ['QtoDetail']},
		{'qtoMainStructure': ['QtoDetail']},
		{'SourceQtoDetial': ['QtoDetail']},
		{'LineItems': ['QtoDetail']}
	]);


	/**
	 * @ngdoc service
	 * @name projectLocationClipboardService
	 * @description provides cut, copy and paste functionality for the treeview grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('qtoMainClipboardService', ['_', 'globals', '$http', '$injector', '$translate', 'platformDragdropService', 'qtoMainDragPasteTypeOption', 'qtoMainDetailService', 'qtoBoqStructureService', 'qtoMainLocationDataService', 'qtoMainStructureDataService', 'platformRuntimeDataService', 'platformDataValidationService', 'platformModalService','qtoMainBillToDataService',
		'qtoMainLineItemDataService',
		function (_, globals, $http, $injector, $translate, platformDragdropService, qtoMainDragPasteTypeOption, qtoMainDetailService, qtoBoqStructureService, qtoMainLocationDataService, qtoMainStructureDataService, platformRuntimeDataService, platformDataValidationService, platformModalService,qtoMainBillToDataService,
		          qtoMainLineItemDataService) {

			let clipboard = {type: null, data: null, cut: false};
			let service = {};

			// events
			// eslint-disable-next-line no-undef
			service.clipboardStateChanged = new Platform.Messenger();
			// eslint-disable-next-line no-undef
			service.onPostClipboardError = new Platform.Messenger();

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			function findTypeFromDragType(type) {
				let targetIndex = qtoMainDragPasteTypeOption.findIndex(function (item) {
					// eslint-disable-next-line no-prototype-builtins
					return item.hasOwnProperty(type);
				});
				if (targetIndex > -1) {
					let res = qtoMainDragPasteTypeOption[targetIndex][type];
					if (angular.isDefined(res) && (res instanceof Array)) {
						return res;
					}
				}
				return undefined;
			}

			function getQtoDetailService(type) {
				var qtoDetailService = null;

				switch (type) {
					case 'QtoDetail':
						qtoDetailService = qtoMainDetailService;
						break;
					case 'PrcBoqQtoDetail':
						qtoDetailService = $injector.get('procurementPackageQtoDetailService');
						break;
					case 'PrjBoqQtoDetail':
						qtoDetailService = $injector.get('boqMainQtoDetailService');
						break;
					case 'WipBoqQtoDetail':
						qtoDetailService = $injector.get('salesWipQtoDetailService');
						break;
					case 'PesBoqQtoDetail':
						qtoDetailService = $injector.get('procurementPesQtoDetailService');
						break;
					case 'BillingBoqQtoDetail':
						qtoDetailService = $injector.get('salesBillingQtoDetailService');
						break;
				}

				return qtoDetailService;
			}

			function getSelectBoqItem(type){
				let selectedBoqItem = null;
				let qtoDetailService = getQtoDetailService(type);

				let getQtoDetailPermission = function (type) {
					var gridId = '';

					switch (type) {
						case 'QtoDetail':
							gridId = '6D3013BD4AF94808BEC8D0EC864119C9';
							break;
						case 'PrcBoqQtoDetail':
							gridId = '29633dbce00e41c4b494f867d7699ea5';
							break;
						case 'PrjBoqQtoDetail':
							gridId = '342bf3af97964f5ba24d3e3acc2242dd';
							break;
						case 'WipBoqQtoDetail':
							gridId = '6e5b061fc7014aec91717edbb576312c';
							break;
						case 'PesBoqQtoDetail':
							gridId = 'F52BE674B318460DA047748DF4F07BEC';
							break;
						case 'BillingBoqQtoDetail':
							gridId = '65294188ea2f4aeea7f1243ecf096434';
							break;
					}

					return $injector.get('platformPermissionService').hasWrite(gridId.toLowerCase());
				};

				if (qtoDetailService) {
					if (type === 'QtoDetail') {
						selectedBoqItem = qtoBoqStructureService.getSelected();
					} else if (qtoDetailService.parentService()) {
						let hasPermission = getQtoDetailPermission(type);
						if (hasPermission) {
							selectedBoqItem = qtoDetailService.parentService().getSelected();
						}
					}
				}

				return selectedBoqItem;
			}

			service.doCanPaste = function doCanPaste(canPastedContent, type, selectedItem) {
				let result = true;

				let qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();

				if (qtoHeader && qtoHeader.IsBackup){
					return false;
				}

				let isBillToCanPaste = qtoHeader && (qtoHeader.QtoTargetType === 2); //billto works  when qto purpose is 'wip/bill'
				let qtoStatusItem = $injector.get('qtoHeaderReadOnlyProcessor').getItemStatus(qtoHeader);

				if (qtoStatusItem && qtoStatusItem.IsReadOnly) {
					return false;
				}

				let types = ['QtoDetail', 'PrcBoqQtoDetail', 'PrjBoqQtoDetail', 'WipBoqQtoDetail', 'PesBoqQtoDetail', 'BillingBoqQtoDetail'];
				if (canPastedContent.type === 'SourceQtoDetial' && _.indexOf(types, type) !== -1){
					let selectedBoqItem = getSelectBoqItem(type);
					if (selectedBoqItem && ((selectedBoqItem.BoqLineTypeFk === 0 && (!selectedBoqItem.BoqItems || selectedBoqItem.BoqItems.length === 0)) || selectedBoqItem.BoqLineTypeFk === 11)){
						return true;
					} else {
						return false;
					}
				}

				let dest = findTypeFromDragType(canPastedContent.type);

				let res = _.find(dest, function (item) {
					return item === type;
				});

				if (canPastedContent.type === 'boqitem' ||
					((canPastedContent.type === 'Locations' ||
						canPastedContent.type==='BillTos' ||
						canPastedContent.type === 'qtoMainStructure' ||
						canPastedContent.type === 'LineItems') && canPastedContent.data.length > 1)) {
					return false;
				}

				if(canPastedContent.type==='BillTos' && !isBillToCanPaste){
					return false;
				}

				if (!angular.isDefined(dest) || !canPastedContent.data) {
					return false;
				}

				// copy the qto to the boq/Locations/Structure
				if (_.isEmpty(res)) {
					if (type === 'QtoDetail' && !_.isEmpty(selectedItem) && !_.isEmpty(canPastedContent.data) && canPastedContent.data.length > 0) {
						return true;
					} else if (
						(type === 'Locations' && canPastedContent.type === 'boqitem')
						|| (type === 'Locations' && canPastedContent.type === 'BillTos')
						|| (type === 'boqitem' && canPastedContent.type === 'Locations')
						|| (type === 'boqitem' && canPastedContent.type === 'BillTos')
						|| (type === 'BillTos' && canPastedContent.type === 'Locations')
						|| (type === 'BillTos' && canPastedContent.type === 'boqitem')

					) {
						return false;
					}
				} else if (res === 'boqitem' && qtoBoqStructureService.getSelectedEntities().length > 1) {
					return false;
				} else if (res === 'Locations' && qtoMainLocationDataService.getSelectedEntities().length > 1) {
					return false;
				} else if (res === 'qtoMainStructure' && qtoMainStructureDataService.getSelectedEntities().length > 1) {
					return false;
				}else if(res === 'BillTos' && !isBillToCanPaste){
					return false;
				} else if(res === 'LineItems' && qtoMainLineItemDataService.getSelectedEntities().length > 1){
					return false;
				}

				if (angular.isDefined(dest)) {
					if (res === 'boqitem' && !_.isEmpty(selectedItem) && angular.isDefined(selectedItem.BoqLineTypeFk)) {
						if(selectedItem.BoqLineTypeFk === 0 && _.isArray(selectedItem.BoqItems) && selectedItem.BoqItems.length > 0){
							if(_.find(selectedItem.BoqItems, function(item){return item.BoqLineTypeFk === 11;}) !== null){
								return false;
							}
						}

						return selectedItem.BoqLineTypeFk === 0 || selectedItem.BoqLineTypeFk === 11;
					} else if (res === 'Locations' && !_.isEmpty(selectedItem)) {
						return true;
					} else if(res === 'BillTos' && !_.isEmpty(selectedItem)){
						return  true;
					} else if (res === 'qtoMainStructure' && !_.isEmpty(selectedItem)) {
						return (!_.isNull(selectedItem.PageNumber));
					} else if (res === 'QtoDetail' && !_.isEmpty(selectedItem)) {
						if (canPastedContent.type === 'boqitem') {
							return (canPastedContent.data[0] && canPastedContent.data[0].BoqLineTypeFk === 0);
						} else if (canPastedContent.type === 'qtoMainStructure') {
							return (canPastedContent.data[0] && !_.isNull(canPastedContent.data[0].PageNumber));
						}
						return true;
					} else if(res === 'LineItems' && !_.isEmpty(selectedItem)){
						return  true;
					}  else {
						return false;
					}
				}

				return result;
			};

			/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
			service.canPaste = function (type, selectedItem) {

				if (type === 'boqitem' && selectedItem) {
					return true;
				}

				return service.doCanPaste(
					{
						type: clipboard.type,
						data: clipboard.data,
						action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
					},
					type, selectedItem);
			};

			/**
			 * @ngdoc function
			 * @name cut
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description adds the item to the cut clipboard
			 * @param {object} item selected node
			 * @returns
			 */
			service.cut = function (items, type, mainService) {
				if (type === 'boqitem') {
					clipboard.cut = true;
					let orgboqMainClipboardService = $injector.get('boqMainClipboardService');
					orgboqMainClipboardService.cut(items, 'boqitem', mainService);
					return;
				}
				service.add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
			};

			/**
			 * @ngdoc function
			 * @name copy
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description adds the item to the copy clipboard
			 * @param {object} item selected node
			 * @returns
			 */
			service.copy = function (items, type, mainService) {
				if (type === 'boqitem') {
					clipboard.cut = false;
					let orgboqMainClipboardService = $injector.get('boqMainClipboardService');
					orgboqMainClipboardService.copy(items, 'boqitem', mainService);
					return;
				}

				if (type === 'SourceQtoDetial') {
					clipboard.cut = false;
					service.add2Clipboard(items, type);
					return;
				}

				service.add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
			};
			/**
			 * @ngdoc function
			 * @name doPaste
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
			 */
			service.doPaste = function doPaste(pastedContent, selectedItem, type) {
				// source qto lines paste
				if (pastedContent.type === 'SourceQtoDetial') {
					let qtoDetailService = getQtoDetailService(type);
					if (qtoDetailService){
						qtoDetailService.doCopySourceQtoLines(pastedContent.data);
					}
				} else {

					if (!selectedItem && pastedContent.type !== 'QtoDetail') {
						return;
					}

					let action = pastedContent.action;

					let toItemId;
					let dest = findTypeFromDragType(pastedContent.type);
					let target = _.find(dest, function (item) {
						return item === type;
					});

					let selectedDestItems = qtoMainDetailService.getSelectedEntities();
					selectedDestItems = _.compact(selectedDestItems);

					let destItems = selectedDestItems && selectedDestItems.length ? selectedDestItems : [selectedItem];

					if (selectedDestItems && selectedDestItems.length > 0) {
						destItems = selectedDestItems;
					} else if (selectedItem) {
						destItems = [selectedItem];
					}
					toItemId = selectedItem ? selectedItem.Id : -1;

					let sourceItemId = angular.isDefined(pastedContent.data[0]) ? pastedContent.data[0].Id : null;

					let boqItemFks = [];
					if (action.id === 'action:move') {
						if (target === 'boqitem' || (target === 'QtoDetail' && pastedContent.type === 'boqitem')) {
							boqItemFks = (_.uniq((_.map(destItems, 'BoqItemFk'))));
						}
						if ((pastedContent.type === 'qtoMainStructure') || (target === 'target' && pastedContent.type === 'QtoDetail')) {
							destItems.forEach(function (item) {
								item.IsModifyLineReference = true;
							});
						}
						service.doMove(destItems, selectedItem, target, toItemId, sourceItemId, type, pastedContent);
						let qtoDetailList = qtoMainDetailService.getList();
						$injector.get('qtoMainHeaderDataService').updateBoqItemQuantity(boqItemFks, qtoDetailList);
					} else if (action.id === 'action:copy') {
						service.doCopy(selectedItem, target, toItemId, sourceItemId, type, pastedContent);
					}
				}

				service.clearClipboard();
				qtoMainDetailService.gridRefresh();
			};


			function handleBillToMove(qtoDetails, toItemId){
				let ids = [], multiLines =[];
				qtoDetails.forEach(function (item) {
					if (!item.IsReadonly && ids.indexOf(item.Id) === -1) {
						// do assignment to multi lines
						if (item.QtoFormula && item.QtoFormula.IsMultiline){
							multiLines = qtoMainDetailService.getReferencedDetails(item);
							_.each(multiLines, function (multiLine){
								multiLine.BillToFk = toItemId;
								qtoMainDetailService.markItemAsModified(multiLine);
								ids.push(multiLine.Id);
							});
						}
						else {
							item.BillToFk = toItemId;
							qtoMainDetailService.markItemAsModified(item);
						}
					}
				});

				let qtos = qtoDetails.concat(multiLines);
				qtos = _.uniqBy(qtos,'Id');
				qtoMainBillToDataService.assignContractByBillTo(qtoDetails[0]).then(function (d){
					qtos.forEach(function (item) {
						item.OrdHeaderFk =  d;
					});
					qtoMainDetailService.updateCalculation(true);
				});

			}

			function handleLocationMove(qtoDetails, toItemId){
				let ids = [], multiLines;
				qtoDetails.forEach(function (item) {
					if (!item.IsReadonly && ids.indexOf(item.Id) === -1) {
						// do assignment to multi lines
						if (item.QtoFormula && item.QtoFormula.IsMultiline){
							multiLines = qtoMainDetailService.getReferencedDetails(item);
							_.each(multiLines, function (multiLine){
								multiLine.PrjLocationFk = toItemId;
								qtoMainDetailService.markItemAsModified(multiLine);
								ids.push(multiLine.Id);
							});
						}
						else {
							item.PrjLocationFk = toItemId;
							qtoMainDetailService.markItemAsModified(item);
						}
					}
				});
				qtoMainDetailService.updateCalculation(true);
			}

			service.doMove = function doMove(destItems, selectedItem, target, toItemId, sourceItemId, type, pastedContent) {
				if (!(angular.isArray(destItems) && destItems.length > 0)) {
					return;
				}
				let destItemsBak = angular.copy(destItems), multiLines;
				let postParam = {};
				let containsMultilineFormula = false, MultilineFormulaCode = '', modifiedDestItems = [];
				let qtoSheetIds = null, readOnlyQtoSheets = null;
				switch (target) {
					case 'qtoMainStructure':
						// drag to sheet, when has range, should do validation.
						if(vailateAddressOverflow(selectedItem)){
							return;
						}

						qtoSheetIds = _.map(destItemsBak,'QtoSheetFk');
						readOnlyQtoSheets = _.filter(qtoMainStructureDataService.getList(),function(qtoSheet){
							return qtoSheet.IsReadonly && _.includes(qtoSheetIds, qtoSheet.Id);
						});

						if(selectedItem.IsReadonly || (readOnlyQtoSheets && readOnlyQtoSheets.length > 0)){
							platformModalService.showMsgBox($translate.instant('qto.main.sheetIsReadonly'), 'qto.main.dragNDropInfo', 'info');
						}else{
							destItemsBak.forEach(function (item) {
								if (!item.IsReadonly && !selectedItem.IsReadonly && !(_.isBoolean(item.IsLineReferenceReadOnly) && item.IsLineReferenceReadOnly)) {
									item.QtoSheetFk = toItemId;
									item.PageNumber = selectedItem.PageNumber;
									modifiedDestItems.push(item);
								}else{
									containsMultilineFormula = true;
									MultilineFormulaCode += ('[' + item.QtoDetailReference + ']' );
								}
							});
						}

						if(containsMultilineFormula){
							let message = $translate.instant('qto.main.multiLineQTOFormulaRefIsFix', {
								linereference: MultilineFormulaCode
							});
							platformModalService.showMsgBox(message, 'qto.main.dragNDropInfo', 'info');
						}

						if(modifiedDestItems.length > 0){
							postParam = {
								Id: _.map(modifiedDestItems, 'Id'),
								QtoHeaderId: modifiedDestItems[0].QtoHeaderFk,
								PageNumber: _.map(modifiedDestItems, 'PageNumber'),
								LineReference: _.map(modifiedDestItems, 'LineReference'),
								LineIndex: _.map(modifiedDestItems, 'LineIndex')
							};
							qtoMainDetailService.checkAddressIsUnique(postParam).then(function (response) {
								if (!response.IsUnique || !service.checkIsUnqiueInCurrentList(modifiedDestItems)) {

									let modalOptions = {
										headerTextKey: 'qto.main.LineReferenceIsUniqueTitle',
										bodyTextKey: 'qto.main.LineReferenceIsUnique',
										showOkButton: true,
										iconClass: 'ico-info'
									};
									platformModalService.showDialog(modalOptions);
								} else {
									let isUsed = qtoMainDetailService.isUsedInOtherGroup(modifiedDestItems);

									if (!isUsed.isValid && isUsed.inValidLine){
										let message = $translate.instant('qto.main.lineReferenceIsUsedInAnotherGroup', {
											linereference: isUsed.inValidLine
										});
										platformModalService.showMsgBox(message, 'qto.main.changeLineReferenceFailed', 'info');
									}else{
										destItems.forEach(function (item) {
											if (!item.IsReadonly && !(_.isBoolean(item.IsLineReferenceReadOnly) && item.IsLineReferenceReadOnly)) {
												item.QtoSheetFk = toItemId;
												item.PageNumber = selectedItem.PageNumber;
												qtoMainDetailService.markItemAsModified(item);
											}
										});
										qtoMainDetailService.updateCalculation(true);
									}
								}
							});
						}
						break;
					case 'Locations':
						handleLocationMove(destItems, toItemId);
						break;
					case 'BillTos':
						handleBillToMove(destItems, toItemId);
						break;
					case 'boqitem':
						if (destItems && destItems.length) {
							let details = qtoMainDetailService.getList();
							let filterDetails = _.filter(details, function (detail) {
								return detail.BoqItemFk === toItemId && detail.BoqSplitQuantityFk > 0;
							});

							let ids = [];
							destItems.forEach(function (item) {
								if (!item.IsReadonly && item.BoqItemFk !== toItemId && ids.indexOf(item.Id) === -1) {
									// do assignment to multi lines
									if (item.QtoFormula && item.QtoFormula.IsMultiline){
										multiLines = qtoMainDetailService.getReferencedDetails(item);
										_.each(multiLines, function (multiLine){
											multiLine.BoqItemFk = toItemId;
											multiLine.BoqSplitQuantityFk = filterDetails.length > 0 ? filterDetails[filterDetails.length - 1].BoqSplitQuantityFk : null;
											multiLine.BasUomFk = selectedItem.BasUomFk;
											qtoMainDetailService.markItemAsModified(multiLine);
											ids.push(multiLine.Id);
										});
									}
									else {
										item.BoqItemFk = toItemId;
										item.BoqSplitQuantityFk = filterDetails.length > 0 ? filterDetails[filterDetails.length - 1].BoqSplitQuantityFk : null;
										item.BasUomFk = selectedItem.BasUomFk;
										qtoMainDetailService.markItemAsModified(item);
										ids.push(item.Id);
									}
								}
							});
							qtoMainDetailService.updateCalculation(true);
						}
						break;
					case 'QtoDetail':
						if (pastedContent.type === 'Locations') {
							handleLocationMove(destItems, sourceItemId);
						}else if(pastedContent.type === 'BillTos'){
							handleBillToMove(destItems, sourceItemId);
						}else if (pastedContent.type === 'boqitem') {
							destItems.forEach(function (item) {
								if (!item.IsReadonly) {
									item.BoqItemFk = sourceItemId;
									item.BasUomFk = pastedContent.data[0] ? pastedContent.data[0].BasUomFk : item.BasUomFk;
									qtoMainDetailService.markItemAsModified(item);
								}
							});
							qtoMainDetailService.updateCalculation(true);
						} else if (pastedContent.type === 'qtoMainStructure') {
							// drag to sheet, when has range, should do validation.
							if(vailateAddressOverflow(pastedContent.data[0])){
								return;
							}

							qtoSheetIds = _.map(destItemsBak,'QtoSheetFk');
							readOnlyQtoSheets = _.filter(qtoMainStructureDataService.getList(),function(qtoSheet){
								return qtoSheet.IsReadonly && _.includes(qtoSheetIds, qtoSheet.Id);
							});

							if(pastedContent.data[0].IsReadonly || (readOnlyQtoSheets && readOnlyQtoSheets.length > 0)){
								platformModalService.showMsgBox($translate.instant('qto.main.sheetIsReadonly'), 'qto.main.dragNDropInfo', 'info');
							}else{
								destItemsBak = angular.copy(destItems);
								destItemsBak.forEach(function (item) {
									if (!item.IsReadonly && !(_.isBoolean(item.IsLineReferenceReadOnly) && item.IsLineReferenceReadOnly)) {
										item.QtoSheetFk = pastedContent.data[0].Id;
										item.PageNumber = pastedContent.data[0].PageNumber;
										modifiedDestItems.push(item);
									}else{
										containsMultilineFormula = true;
										MultilineFormulaCode += ('[' + item.QtoDetailReference + ']' );
									}
								});
							}

							if(containsMultilineFormula){
								let message = $translate.instant('qto.main.multiLineQTOFormulaRefIsFix', {
									linereference: MultilineFormulaCode
								});
								platformModalService.showMsgBox(message, 'qto.main.dragNDropInfo', 'info');
							}

							if(modifiedDestItems.length > 0){
								postParam = {
									Id: _.map(modifiedDestItems, 'Id'),
									QtoHeaderId: modifiedDestItems[0].QtoHeaderFk,
									PageNumber: _.map(modifiedDestItems, 'PageNumber'),
									LineReference: _.map(modifiedDestItems, 'LineReference'),
									LineIndex: _.map(modifiedDestItems, 'LineIndex')
								};

								qtoMainDetailService.checkAddressIsUnique(postParam).then(function (response) {
									if (!response.IsUnique || !service.checkIsUnqiueInCurrentList(modifiedDestItems)) {
										platformModalService.showMsgBox('qto.main.LineReferenceIsUnique', 'qto.main.LineReferenceIsUniqueTitle');
									} else {
										let isUsed = qtoMainDetailService.isUsedInOtherGroup(modifiedDestItems);

										if (!isUsed.isValid && isUsed.inValidLine){
											let message = $translate.instant('qto.main.lineReferenceIsUsedInAnotherGroup', {
												linereference: isUsed.inValidLine
											});
											platformModalService.showMsgBox(message, 'qto.main.changeLineReferenceFailed', 'info');
										}else{
											destItems.forEach(function (item) {
												if (!item.IsReadonly && !(_.isBoolean(item.IsLineReferenceReadOnly) && item.IsLineReferenceReadOnly)) {
													item.QtoSheetFk = pastedContent.data[0].Id;
													item.PageNumber = pastedContent.data[0].PageNumber;
													qtoMainDetailService.markItemAsModified(item);
												}
											});
											qtoMainDetailService.updateCalculation(true);
										}
									}
								});
							}
						}
						break;
				}
			};

			function vailateAddressOverflow(item){
				// drag to sheet, when has range, should do validation.
				let sheetAreaList = qtoMainDetailService.getSheetAreaList();
				if(item.PageNumber && sheetAreaList && sheetAreaList.length > 0) {
					let index = _.indexOf(sheetAreaList, item.PageNumber);
					if (index === -1) {
						let strTitle = $translate.instant('qto.main.detail.createQtoLineTilte');
						let strContent = $translate.instant('qto.main.detail.addressOverflow');
						platformModalService.showMsgBox(strContent, strTitle, 'info');
						return true;
					}
				}

				return false;
			}

			service.doCopy = function doCopy(selectedItem, target, toItemId, sourceItemId, type, pastedContent) {
				if (!(!_.isEmpty(pastedContent.data) && pastedContent.data.length > 0)) {
					return;
				}
				let toCreatedQtoLineParam = null;
				switch (target) {
					case 'qtoMainStructure':
						$injector.get('qtoMainHeaderDataService').update().then(function () {
							if (selectedItem && selectedItem.IsReadonly){
								var strTitle = $translate.instant('qto.main.wizard.qtoDetail.title');
								var strContent = $translate.instant('qto.main.sheetReadonly');
								platformModalService.showMsgBox(strContent, strTitle, 'info');
								return;
							}

							qtoMainDetailService.CopyQtoDetailByDrag(false, pastedContent.data, 'qtoMainStructure', toItemId, null, selectedItem.PageNumber, selectedItem.Id);
						});
						break;
					case 'Locations':
						qtoMainDetailService.copyPaste(true, pastedContent.data, 'Locations', toItemId, null);
						break;
					case 'LineItems':
						let lineItemIIdentifyable = {
							Id: selectedItem.Id,
							EstHeaderFk: selectedItem.EstHeaderFk,
							BoqHeaderFk: selectedItem.BoqHeaderFk,
							BoqItemFk: selectedItem.BoqItemFk
						};
						qtoMainDetailService.copyPaste(true, pastedContent.data, 'LineItems', lineItemIIdentifyable, null);
						break;
					case 'BillTos':
						toCreatedQtoLineParam = {
							QtoHeaderFk: pastedContent.data[0].QtoHeaderFk,
							BillToFk: selectedItem.Id,
							PrjBoqFk: pastedContent.data[0].PrjBoqFk
						};
						qtoMainBillToDataService.assignContractByBillTo(toCreatedQtoLineParam).then(function (responseOrderFk) {
							qtoMainDetailService.copyPaste(true, pastedContent.data, 'BillTos', toItemId, null,null,null,null,responseOrderFk);
						});

						break;
					case 'boqitem':
						var qtoDetailList = [];
						if (selectedItem) {
							let groupIds = _.map(pastedContent.data,'QtoDetailGroupId');
							let itemList = qtoMainDetailService.getList();

							if(_.isArray(itemList) && itemList.length > 0 &&  _.isArray(groupIds) && groupIds.length > 0){
								qtoDetailList = _.filter(itemList, function(item){
									return _.includes(groupIds, item.QtoDetailGroupId);
								});
							}

							if(_.isArray(qtoDetailList) && qtoDetailList.length > 0){
								qtoDetailList = angular.copy(qtoDetailList);
							}else{
								qtoDetailList = angular.copy(pastedContent.data);
							}

							qtoDetailList.forEach(function (item) {
								item.SourceBoqItemFk = item.BoqItemFk;
								item.SourceBoqHeaderFk = item.BoqHeaderFk;
								item.BoqItemFk = selectedItem.Id;
								item.BoqHeaderFk = selectedItem.BoqHeaderFk;
								item.GroupBySourceBoqItemFk = true;
							});
						}
						if (qtoDetailList && qtoDetailList.length) {
							qtoMainDetailService.copyPaste(true, qtoDetailList, 'boqitem', toItemId, null);
						}
						break;
					case 'QtoDetail':
						if (pastedContent.type === 'QtoDetail') {
							$injector.get('qtoMainHeaderDataService').update().then(function () {
								qtoMainDetailService.CopyQtoDetailByDrag(false, pastedContent.data, 'QtoDetail', toItemId, selectedItem);
							});
						} else if (pastedContent.type === 'boqitem') {
							qtoMainDetailService.copyPaste(true, pastedContent.data, 'boqitem', toItemId, selectedItem);
						}
						break;
				}
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
			service.paste = function (selectedItem, type, onSuccess, mainService) {
				if (type === 'boqitem' && selectedItem) {
					let orgboqMainClipboardService = $injector.get('boqMainClipboardService');
					orgboqMainClipboardService.paste(selectedItem, type, onSuccess, mainService);
					return;
				}
				service.doPaste(
					{
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
				service.clearClipboard();
			};

			service.clipboardHasData = function () {
				return clipboard.data !== null;
			};

			service.add2Clipboard = function (node, type) {

				clipboard.type = type;
				clipboard.data = angular.copy(node);

				service.clipboardStateChanged.fire();
			};


			service.checkIsUnqiueInCurrentList = function (destItems) {
				let IsUnqiue = true;
				if (!!destItems && !!destItems.length && destItems.length > 0) {
					for (let i = 0; i < destItems.length; i++) {
						for (let j = 0; j < destItems.length; j++) {
							if ((destItems[i].PageNumber === destItems[j].PageNumber) && (destItems[i].LineReference === destItems[j].LineReference) && (destItems[i].LineIndex === destItems[j].LineIndex) && (destItems[i].Id !== destItems[j].Id)) {
								IsUnqiue = false;
								break;
							}
						}
					}
				}
				return IsUnqiue;
			};

			service.clearClipboard = function () {
				clipboard.type = null;
				clipboard.data = null;
				service.clipboardStateChanged.fire();
			};

			return service;

		}

	]);

})(angular);

