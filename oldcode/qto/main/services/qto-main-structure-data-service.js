/**
 * Created by reimer on 24.09.2014.
 */
(function (angular) {
	'use strict';
	/* globals globals, _ */
	let moduleName = 'qto.main';
	let qtoMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name procurementCommonMainService
	 * @function
	 *
	 * @description
	 * procurementCommonMainService is the data service for all common related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	qtoMainModule.factory('qtoMainStructureDataService',
		['$q', '$http', '$translate', '$injector', 'platformDataServiceFactory', 'qtoMainHeaderDataService', 'ServiceDataProcessArraysExtension', 'qtoMainDetailService',
			'qtoMainStructureImageProcessor', 'qtoMainStrucutrueFilterService', 'cloudCommonGridService', 'platformRuntimeDataService', 'platformModalService','qtoBoqType', 'basicsLookupdataLookupDescriptorService',
			function ($q, $http, $translate, $injector, platformDataServiceFactory, parentService, ServiceDataProcessArraysExtension, qtoMainDetailService,
				qtoMainStructureImageProcessor, qtoMainStrucutrueFilterService, cloudCommonGridService, platformRuntimeDataService, platformModalService,qtoBoqType, lookupDescriptorService) {

				let suitableNum;
				let serviceContainer ={};
				let service ={};
				let factoryOptions = {
					hierarchicalLeafItem: {
						module: qtoMainModule,
						serviceName: 'qtoMainStructureDataService',
						httpCreate: {route: globals.webApiBaseUrl + 'qto/main/structure/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'qto/main/structure/',
							endRead: 'tree',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								let qtoHeader = parentService.getSelected();
								readData.MainItemId = qtoHeader.Id;
							}
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['QtoSheets']), qtoMainStructureImageProcessor],
						presenter: {
							tree: {
								parentProp: 'QtoSheetFk', childProp: 'QtoSheets',
								incorporateDataRead: function (response, data) {
									let readData = response.dtos;

									// set the create item button
									let itemTrees = readData || [];
									let itemList = [];
									cloudCommonGridService.flatten(itemTrees, itemList, 'QtoSheets');

									if (itemList && itemList.length > 0) {
										// keep the filter in sheet
										let filterPageNumbers = qtoMainDetailService.filterPageNumbers;
										if (filterPageNumbers && filterPageNumbers.length > 0) {
											for (let i = 0; i < itemList.length; i++) {
												let indexInList = filterPageNumbers.indexOf(itemList[i].Id);
												if (indexInList !== -1) {
													itemList[i].IsMarked = true;
													break;
												}
											}
										}
									}

									let qtoHeader = parentService.getSelected();
									let qtoStatusItem = $injector.get('qtoHeaderReadOnlyProcessor').getItemStatus(qtoHeader);
									let isReadOnly = false;
									if (qtoStatusItem) {
										isReadOnly = qtoStatusItem.IsReadOnly;
									}

									service.canCreate = function () {
										return !isReadOnly;
									};

									service.canCreateChild = function () {
										return !isReadOnly;
									};

									service.canDelete = function () {
										return !isReadOnly;
									};

									// set qto addressrange
									qtoMainDetailService.setSheetAreaList(response.qtoAddressRange);

									// update lookup qto sheet status
									lookupDescriptorService.updateData('QtoSheetStatus', response.qtoSheetStatusList);

									// set version qto as readonly
									let isBackup = parentService.getSelected().IsBackup;
									$injector.get('qtoMainCommonService').setContainerReadOnly(isBackup, '4bf041831fee4206bc5c096770c0a56e');

									return serviceContainer.data.handleReadSucceeded(itemTrees, data);
								},
								initCreationData: function initCreationData(creationData) {
									let pageNumberDesAarry, number1, strNumber1, number2, strNumber2, itemTemp,
										strNumberAppend;
									let itemList = service.getList();
									let qtoHeader = parentService.getSelected();
									if (itemList && itemList.length > 0) {
										let parentId = creationData.parentId;
										let selectItem = service.getSelected();
										if (parentId && selectItem) {
											initQtoSheetDec(selectItem);
											let nodeCurrentLevel = selectItem.nodeInfo.level;
											let nodeParentLevel = creationData.parent.nodeInfo.level;
											creationData.IsItem = nodeParentLevel + 1 === 4;
											if (nodeCurrentLevel > nodeParentLevel) {
												strNumberAppend = getLastInSaveLevel(selectItem, itemList);
											} else {
												strNumberAppend = getLastByChild(selectItem);
											}
											creationData.PageNumber = strNumberAppend;
										} else {
											if (selectItem) {
												strNumberAppend = getLastInSaveLevel(selectItem, itemList);
												if (!strNumberAppend) {
													creationData.IsOverflow = true;
												}
											} else {
												let itemsInLevel = _.filter(itemList, function (item) {
													return item.QtoSheetFk === null;
												});

												let increment = qtoHeader.QtoTypeFk === 1 ? 10000 : 1000;
												if (itemsInLevel && itemsInLevel.length > 0) {
													itemTemp = itemsInLevel[itemsInLevel.length - 1];
													pageNumberDesAarry = _.split(itemTemp.Description, '-');
													if (pageNumberDesAarry && pageNumberDesAarry.length > 1) {
														creationData.IsOverflow = qtoHeader.QtoTypeFk === 1 ? _.parseInt(pageNumberDesAarry[1]) === 99999 : _.parseInt(pageNumberDesAarry[1]) === 9999;
														number1 = _.parseInt(pageNumberDesAarry[0]) + increment;
														strNumber1 = service.leftPadZero(number1, number1 > 9999 ? 5 : 4);
														number2 = _.parseInt(pageNumberDesAarry[1]) + increment;
														strNumber2 = service.leftPadZero(number2, number2 > 9999 ? 5 : 4);
														strNumberAppend = strNumber1 + '-' + strNumber2;
													}
												}
											}

											creationData.PageNumber = strNumberAppend;
										}
									} else {
										creationData.PageNumber = '0000-9999';
									}
									parentService.getSelected().hasQtoDetal = true;
									parentService.updateReadOnly(parentService.getSelected(), 'BasGoniometerTypeFk', parentService.getSelected().BasGoniometerTypeFk);

								},
								handleCreateSucceeded: function (newData) {
									// set the parents readonly flag
									let parentItems = service.setQtoSheetParentsReadonlyFlag(newData);
									service.markEntitiesAsModified(parentItems);

									return newData;
								}
							}
						},
						toolBar: {
							id: 'filterStructure',
							costgroupName: 'groupTemp',
							iconClass: 'tlb-icons ico-filter-boq'
						},
						entityRole: {
							leaf: {
								itemName: 'QtoSheets',
								parentService: parentService
							}
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
				let data = serviceContainer.data;
				service = serviceContainer.service;

				serviceContainer.data.handleOnDeleteSucceeded = function () {
					let sheetList = service.getList();
					parentService.getSelected().hasQtoDetal = !!qtoMainDetailService.getList().length || !!sheetList.length;
					parentService.updateReadOnly(parentService.getSelected(), 'BasGoniometerTypeFk', parentService.getSelected().BasGoniometerTypeFk);
				};

				let baseCteateItem = service.createItem;
				let baseCreateChildItem = service.createChildItem;
				service.createItem = createItem;
				service.createChildItem = createChildItem;

				function createItem(creationOptions){

					if (canCreate(true)) {
						baseCteateItem(creationOptions);
					}
				}

				function createChildItem(){
					if (canCreate(false)){
						baseCreateChildItem();
					}
				}

				function canCreate(isItem) {
					var result = true;
					let qtoHeader = parentService.getSelected();
					var selectItem = service.getSelected();
					var itemsInLevel = null;
					if (selectItem) {
						var nodeCurrentLevl = selectItem.nodeInfo.level;
						var pageNumberDesAarry, index, number1, strNumber1, strNumberAppend;
						if (!isItem) {
							// create child button
							if (selectItem.QtoSheets && selectItem.QtoSheets.length > 0) {
								pageNumberDesAarry = _.split(selectItem.Description, '-');
								if (pageNumberDesAarry && pageNumberDesAarry.length === 2) {
									switch (nodeCurrentLevl) {
										case 0:
											itemsInLevel = _.filter(selectItem.QtoSheets, function (item) {
												return item.QtoSheetFk === selectItem.Id;
											});
											number1 = _.parseInt(pageNumberDesAarry[0]) + 9000;
											strNumber1 = service.leftPadZero(number1, number1 > 9999 ? 5 : 4);
											strNumberAppend = strNumber1 + '-' + pageNumberDesAarry[1];
											index = _.findIndex(itemsInLevel, {'Description': strNumberAppend});
											break;
										case 1:
											number1 = pageNumberDesAarry[0] === '0000' ? 900 : _.parseInt(pageNumberDesAarry[0]) + 900;
											strNumber1 = service.leftPadZero(number1, number1 > 9999 ? 5 : 4);
											strNumberAppend = strNumber1 + '-' + pageNumberDesAarry[1];
											index = _.findIndex(selectItem.QtoSheets, {'Description': strNumberAppend});
											break;
										case 2:
											number1 = pageNumberDesAarry[0] === '0000' ? 90 : _.parseInt(pageNumberDesAarry[0]) + 90;
											strNumber1 = service.leftPadZero(number1, number1 > 9999 ? 5 : 4);
											strNumberAppend = strNumber1 + '-' + pageNumberDesAarry[1];
											index = _.findIndex(selectItem.QtoSheets, {'Description': strNumberAppend});
											break;
										case 3:
											strNumberAppend = pageNumberDesAarry[1];
											index = _.findIndex(selectItem.QtoSheets, {'Description': strNumberAppend});
											break;
										case 4:
											index = 0;
											break;
									}

									if (index === -1) {
										result = true;
									} else {
										result = false;
										platformModalService.showMsgBox('qto.main.notCreateChildItem', 'qto.main.structure', 'warning');
									}
								}
							} else {
								if (selectItem && selectItem.nodeInfo && selectItem.nodeInfo.level === 4) {
									result = false;
									platformModalService.showMsgBox('qto.main.notCreateChildItem', 'qto.main.structure', 'warning');
								} else {
									result = true;
								}
							}
						} else {
							let canInsert = function (selectItem, parentItem, strNumberAppend){
								var lastItem = _.find(parentItem.QtoSheets, {'Description': strNumberAppend});
								if (lastItem) {
									let currentNumber = selectItem.PageNumber;
									let lastNumber = lastItem.PageNumber;
									let pageNumber = lastNumber - currentNumber;
									for (var i=0; i < pageNumber; i++){
										currentNumber++;
										if (currentNumber !== lastNumber) {
											var item = _.find(parentItem.QtoSheets, {'PageNumber': currentNumber});
											if (!item) {
												return true;
											}
										}
									}
								} else {
									return true;
								}

								return  false;
							};

							// create item button
							let itemList = service.getList();
							itemsInLevel = _.filter(itemList, function (item) {
								return item.QtoSheetFk === selectItem.QtoSheetFk;
							});
							let parentItem = _.find(itemList, {'Id': selectItem.QtoSheetFk});
							let hasNext = selectItem.Description === '90000-99999';
							switch (nodeCurrentLevl) {
								case 0:
									if (qtoHeader.QtoTypeFk === 1 && selectItem.Description !== '90000-99999') {
										pageNumberDesAarry = _.split(selectItem.Description, '-');
										number1 = _.parseInt(pageNumberDesAarry[0]) + 10000;
										var number2 = _.parseInt(pageNumberDesAarry[1]) + 10000;
										strNumber1 = service.leftPadZero(number1, number1 > 9999 ? 5 : 4);
										var strNumber2 = service.leftPadZero(number2, number1 > 9999 ? 5 : 4);
										strNumberAppend = strNumber1 + '-' + strNumber2;
										index = _.findIndex(itemsInLevel, {'Description': strNumberAppend});
										hasNext = index !== -1;
									} else {
										index = 0;
									}
									break;
								case 1:
									pageNumberDesAarry = _.split(parentItem.Description, '-');
									number1 = _.parseInt(pageNumberDesAarry[0]) + 9000;
									strNumber1 = service.leftPadZero(number1, number1 > 9999 ? 5 : 4);
									strNumberAppend = strNumber1 + '-' + pageNumberDesAarry[1];
									index = _.findIndex(itemsInLevel, {'Description': strNumberAppend});
									break;
								case 2:
									pageNumberDesAarry = _.split(parentItem.Description, '-');
									number1 = pageNumberDesAarry[0] === '0000' ? 900 : _.parseInt(pageNumberDesAarry[0]) + 900;
									strNumber1 = service.leftPadZero(number1, 4);
									strNumberAppend = strNumber1 + '-' + pageNumberDesAarry[1];
									index = _.findIndex(itemsInLevel, {'Description': strNumberAppend});
									break;
								case 3:
									pageNumberDesAarry = _.split(parentItem.Description, '-');
									number1 = pageNumberDesAarry[0] === '0000' ? 90 : _.parseInt(pageNumberDesAarry[0]) + 90;
									strNumber1 = service.leftPadZero(number1, 4);
									strNumberAppend = strNumber1 + '-' + pageNumberDesAarry[1];
									index = _.findIndex(itemsInLevel, {'Description': strNumberAppend});
									break;
								case 4:
									pageNumberDesAarry = _.split(parentItem.Description, '-');
									strNumberAppend = pageNumberDesAarry[1];
									index = canInsert(selectItem, parentItem, strNumberAppend) ? -1 : 0;
									break;
							}

							if (index === -1) {
								return true;
							} else {
								if (!hasNext && nodeCurrentLevl === 0 && qtoHeader.QtoTypeFk === 1) {
									let treeList = service.getTree();
									if (treeList && treeList.length === 10) {
										result = false;
										platformModalService.showMsgBox('qto.main.notCreateItem', 'qto.main.structure', 'warning');
									} else {
										result = true;
									}
								} else {
									let itemList = service.getList();
									if (itemList.length === 0) {
										result = true;
									} else {
										result = false;
										platformModalService.showMsgBox('qto.main.notCreateItem', 'qto.main.structure', 'warning');
									}
								}
							}
						}
					}

					return result;
				}

				let parentDeleteItem = serviceContainer.service.deleteItem;
				let parentDeleteEntities = serviceContainer.service.deleteEntities;
				service.deleteItem = deleteItem;
				service.deleteEntities = deleteEntities;

				function deleteItem(entity) {
					platformModalService.showYesNoDialog('qto.main.sheetDelete', 'qto.main.sheetDeleteTitle').then(function (response) {
						if (response.yes) {
							parentDeleteItem(entity);
						}
					});
				}

				function deleteEntities(entities) {
					let qotLineList = qtoMainDetailService.getList();
					let filterLine = _.find(qotLineList, function(qtoLine){
						if(qtoLine.IsReadonly || qtoLine.PesHeaderFk || qtoLine.WipHeaderFk){
							let index = _.findIndex(entities, {'PageNumber': qtoLine.PageNumber});
							if(index !== -1){
								return qtoLine;
							}
						}
					});

					if(filterLine){
						let modalOptions = {
							headerTextKey: 'qto.main.sheetWarningTitle',
							bodyTextKey: $translate.instant('qto.main.sheetWarning', {value: filterLine.QtoDetailReference}),
							showOkButton: true,
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
					else {
						platformModalService.showYesNoDialog('qto.main.sheetDelete', 'qto.main.sheetDeleteTitle').then(function (response) {
							if (response.yes) {
								parentDeleteEntities(entities);
							}
						});
					}
				}

				qtoMainDetailService.setSelectedPageNumber(null);

				qtoMainStrucutrueFilterService.addMarkersChanged(service, factoryOptions.hierarchicalLeafItem.presenter.tree, factoryOptions.hierarchicalLeafItem.toolBar);

				// createQtoStructure
				service.createQtoStructure = function (number, qtoHeaderId, boqType, qtoType) {
					let n = number > 9999 ? 5 : 4;
					let pageNumber = service.leftPadZero(number, n);
					let list = service.getList();
					let index = _.findIndex(list, {'Description': pageNumber});
					if (index === -1) {
						let creationData = {
							MainItemId: qtoHeaderId,
							Number: number,
							QtoType: qtoType,
							IsPrjBoq: (boqType === qtoBoqType.PrjBoq),
							IsPrcBoq: (boqType === qtoBoqType.PrcBoq),
							IsBillingBoq: (boqType === qtoBoqType.BillingBoq),
							IsWipBoq: (boqType === qtoBoqType.WipBoq),
							IsPesBoq: (boqType === qtoBoqType.PesBoq),
							IsQtoBoq: (boqType === qtoBoqType.QtoBoq)
						};

						return $http.post(globals.webApiBaseUrl + 'qto/main/structure/createbyqtoline', creationData).then(function (response) {
							let createItem;
							if (boqType !== qtoBoqType.QtoBoq) {

								let qtoSheetList = [];
								cloudCommonGridService.flatten(response.data, qtoSheetList, 'QtoSheets');

								let selectIndex = _.findIndex(qtoSheetList, {'Description': pageNumber});
								if (selectIndex !== -1) {
									createItem = qtoSheetList[selectIndex];
								}
								return createItem;
							} else {
								return service.load().then(function () {
									let selectIndex = _.findIndex(data.itemList, {'Description': pageNumber});
									if (selectIndex !== -1) {
										createItem = data.itemList[selectIndex];
										service.setSelected(data.itemList[selectIndex]);
									}

									qtoMainStrucutrueFilterService.removeFilter('QtoSheets');

									return createItem;
								});
							}
						});
					}
					else {
						return $q.when(list[index]);
					}
				};

				service.createQtoStructures =  function(qtoHeaderId, targetItems, pageNumberList, qtoTypeFk){
					let creationData = {
						MainItemId: qtoHeaderId,
						Numbers: pageNumberList,
						QtoType: qtoTypeFk
					};

					return $http.post(globals.webApiBaseUrl + 'qto/main/structure/createbyqtolines', creationData).then(function (response) {
						let qtoSheetItems = response.data;
						service.loadQtoSheetData(qtoSheetItems);
						_.forEach(targetItems, function (item) {
							let qtoSheetList = [];
							cloudCommonGridService.flatten(qtoSheetItems, qtoSheetList, 'QtoSheets');
							let index = _.findIndex(qtoSheetList, {'PageNumber': item.PageNumber});
							if (index !== -1) {
								item.QtoSheetFk = qtoSheetList[index].Id;
							}
						});
					});
				};

				service.loadQtoSheetData = function(qtoSheets){
					if(qtoSheets && qtoSheets.length > 0) {
						data.itemTree = qtoSheets;
						let qtoSheetList = [];
						cloudCommonGridService.flatten(qtoSheets, qtoSheetList, 'QtoSheets');
						data.itemList = qtoSheetList;
						data.listLoaded.fire(null, qtoSheets);
						service.setSelected(data.itemList[qtoSheetList.length - 1]);

						qtoMainStrucutrueFilterService.removeFilter('QtoSheets');
					}
				};

				service.getQtoSheetParentList = function (qtoSheet, parentItems){
					let qtoSheetList = _.filter(service.getList(), {'PageNumber': null});
					getParentList(qtoSheet, qtoSheetList, parentItems);
				};

				function getParentList(qtoSheet, qtoSheetList, parentItems){
					if (qtoSheet.QtoSheetFk){
						let findItem = _.find(qtoSheetList, { 'Id': qtoSheet.QtoSheetFk });
						if (findItem){
							parentItems.push(findItem);
							if (findItem.QtoSheetFk){
								getParentList(findItem, qtoSheetList, parentItems);
							}
						}
					}
				}

				service.setQtoSheetParentsReadonlyFlag = function (qtoSheet){
					let parentItems = [], itemsToSave = [];
					service.getQtoSheetParentList(qtoSheet, parentItems);
					if (parentItems.length > 0) {
						_.forEach(parentItems, function (parentItem) {
							if (parentItem.IsReadonly) {
								parentItem.IsReadonly = false;
								itemsToSave.push(parentItem);
							}
						});
					}

					return itemsToSave;
				};

				function getLastInSaveLevel(selectItem, itemList) {
					let itemsInLevel, strNumberAppend, strPageNumber;
					if (selectItem) {
						itemsInLevel = _.filter(itemList, function (item) {
							return item.QtoSheetFk === selectItem.QtoSheetFk;
						});
						if (!selectItem.Description) {
							strPageNumber = service.leftPadZero(selectItem.From, 4) + '-' + service.leftPadZero(selectItem.To, 4);
						} else {
							strPageNumber = selectItem.Description;
						}
						let nodeCurrentLevel = selectItem.nodeInfo.level;
						switch (nodeCurrentLevel) {
							case 0:
								if (parentService.getSelected().QtoTypeFk === 1) {
									strNumberAppend = getPageNumberDec(strPageNumber, itemsInLevel, 10000, 10000, true);
								}
								break;
							case 1:
								strNumberAppend = getPageNumberDec(strPageNumber, itemsInLevel, 1000, 1000, true);
								break;
							case 2:
								strNumberAppend = getPageNumberDec(strPageNumber, itemsInLevel, 100, 100, true);
								break;
							case 3:
								strNumberAppend = getPageNumberDec(strPageNumber, itemsInLevel, 10, 10, true);
								break;
							case 4:
								strNumberAppend = getPageNumberDec(strPageNumber, itemsInLevel, 1, 0, true);
								break;
						}
					}
					return strNumberAppend;
				}

				function getLastByChild(selectItem) {
					let itemList = selectItem.QtoSheets;
					let strTemp, strNumberAppend;
					if (selectItem) {
						let nodeChildLevel = selectItem.nodeInfo.level + 1;
						switch (nodeChildLevel) {
							case 1:
								if (itemList && itemList.length > 0) {
									strTemp = itemList[itemList.length - 1];
									strNumberAppend = getPageNumberDec(strTemp.Description, itemList, 1000, 1000, true);
								} else {
									strNumberAppend = getPageNumberDec(selectItem.Description, itemList, 0, -9000);
								}
								break;
							case 2:
								if (itemList && itemList.length > 0) {
									strTemp = itemList[itemList.length - 1];
									strNumberAppend = getPageNumberDec(strTemp.Description, itemList, 100, 100);
								} else {
									strNumberAppend = getPageNumberDec(selectItem.Description, itemList, 0, -900);
								}
								break;
							case 3:
								if (itemList && itemList.length > 0) {
									strTemp = itemList[itemList.length - 1];
									strNumberAppend = getPageNumberDec(strTemp.Description, itemList, 10, 10);
								} else {
									strNumberAppend = getPageNumberDec(selectItem.Description, itemList, 0, -90);
								}
								break;
							case 4:
								// create item
								if (itemList && itemList.length > 0) {
									strTemp = itemList.reduce((max, current) => {
										return current.Description > max.Description ? current : max;
									});
									strNumberAppend = getPageNumberDec(strTemp.Description, itemList, 1, 0, true);
								} else {
									var arrayTemp = _.split(selectItem.Description, '-');
									strNumberAppend = getPageNumberDec(arrayTemp[0], itemList, 1, 0, true);
								}
								break;
						}
					}
					return strNumberAppend;
				}

				function getPageNumberDec(description, itemList, value1, value2, isCreateItem) {
					let pageNumberDesAarry, number1, strNumber1, number2, strNumber2, itemTemp, strNumberAppend;
					pageNumberDesAarry = _.split(description, '-');
					if(pageNumberDesAarry && pageNumberDesAarry.length === 1){
						let pageNumberTemp = _.parseInt(pageNumberDesAarry[0]);
						number1 = pageNumberTemp !== 0 && (pageNumberTemp % 10 === 0) ? pageNumberTemp : (description === '0001' ? pageNumberTemp :  pageNumberTemp + value1);
						strNumber1 = service.leftPadZero(number1, number1 > 9999 ? 5 : 4);
						strNumberAppend = strNumber1;
					}
					else if (pageNumberDesAarry && pageNumberDesAarry.length === 2) {
						number1 = pageNumberDesAarry[0] === '0001' ? value1 : _.parseInt(pageNumberDesAarry[0]) + value1;
						if (number1 < 99999) {
							strNumber1 = service.leftPadZero(number1, number1 > 9999 ? 5 : 4);
							number2 = _.parseInt(pageNumberDesAarry[1]) + value2;
							strNumber2 = service.leftPadZero(number2, number1 > 9999 ? 5 : 4);
							strNumberAppend = strNumber1 + '-' + strNumber2;
						}
					}

					if(isCreateItem) {
						let index = _.findIndex(itemList, {'Description': strNumberAppend});
						if (index !== -1) {
							itemTemp = itemList[itemList.length - 1];
							pageNumberDesAarry = _.split(itemTemp.Description, '-');
							if(pageNumberDesAarry && pageNumberDesAarry.length === 1){
								getSuitableNum(itemList, strNumberAppend);
								strNumber1 = suitableNum;
								strNumberAppend = strNumber1;
							}
							else if (pageNumberDesAarry && pageNumberDesAarry.length === 2) {
								number1 = _.parseInt(pageNumberDesAarry[0]) + value1;
								strNumber1 = service.leftPadZero(number1, number1 > 9999 ? 5 : 4);
								number2 = _.parseInt(pageNumberDesAarry[1]) + value2;
								strNumber2 = service.leftPadZero(number2, number1 > 9999 ? 5 : 4);
								strNumberAppend = strNumber1 + '-' + strNumber2;
							}
						}
					}

					return strNumberAppend;
				}

				function getSuitableNum(itemList, strNumberAppend){
					let pageNumberTemp = _.parseInt(strNumberAppend);
					let numbe1 = pageNumberTemp + 1;
					let strNumber = service.leftPadZero(numbe1, numbe1 > 9999 ? 5 : 4);
					suitableNum = strNumber;
					let index = _.findIndex(itemList, {'Description': strNumber});
					if (index !== -1) {
						getSuitableNum(itemList, strNumber);
					}
				}

				service.leftPadZero = function leftPadZero(num, n) {
					return (new Array(n).join('0') + num).slice(-n);
				};

				service.updateReadOnly = function (item, fieldList, value) {
					_.forEach(fieldList, function (field) {
						platformRuntimeDataService.readonly(item, [
							{field: field, readonly: value}
						]);
					});
				};

				function initQtoSheetDec(selectItem){
					if(!selectItem.Description && selectItem.From && selectItem.To && !selectItem.PageNumber){
						selectItem.Description = service.leftPadZero(selectItem.From, 4) + '-' + service.leftPadZero(selectItem.To, 4);
					}
					else if(!selectItem.Description && selectItem.PageNumber){
						selectItem.Description = service.leftPadZero(selectItem.PageNumber, 4);
					}

					if(selectItem.QtoSheets && selectItem.QtoSheets.length > 0){
						_.forEach(selectItem.QtoSheets, function(qtoSheet){
							if(!qtoSheet.Description && qtoSheet.From && qtoSheet.To && !qtoSheet.PageNumber){
								qtoSheet.Description = service.leftPadZero(qtoSheet.From, 4) + '-' + service.leftPadZero(qtoSheet.To, 4);
							}
							else if(!qtoSheet.Description && qtoSheet.PageNumber){
								qtoSheet.Description = service.leftPadZero(qtoSheet.PageNumber, 4);
							}
						});
					}
				}

				return service;
			}
		]);
})(angular);
