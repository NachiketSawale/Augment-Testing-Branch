/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('salesCommonCopyBoqContextService',
		['_', '$injector', '$rootScope', '$log',
			function (_, $injector, $rootScope, $log) {

				var subModule2Context = {
					'sales.bid': {id: 2, mainService: 'salesBidService', boqService: 'salesBidBoqService', copyUrl: 'sales/bid/boq/copyboqs?bidId='},
					'sales.contract': {id: 3, mainService: 'salesContractService', boqService: 'salesContractBoqService', copyUrl: 'sales/contract/boq/copyboqs?contractId='},
					'sales.wip': {id: 4, mainService: 'salesWipService', boqService: 'salesWipBoqService', copyUrl: 'sales/wip/boq/copyboqs?wipId='},
					'sales.billing': {id: 5, mainService: 'salesBillingService', boqService: 'salesBillingBoqService', copyUrl: 'sales/billing/boq/copyboqs?billId='}
				};

				function getContext() {
					if (!_.includes(_.keys(subModule2Context), $rootScope.currentModule)) {
						$log.warn('No context available for given sub module!');
					}
					return subModule2Context[$rootScope.currentModule];
				}

				// TODO: improve name
				// TODO: move to caller (pass context?)
				var _contextSourceIdsObject = null;

				function setContextSourceIdsObject(contextSourceIdsObject) {
					_contextSourceIdsObject = contextSourceIdsObject;
				}

				function getContextSourceIdsObject() {
					// for take over wizard we take selected main item, e.g. contract from contracts container
					// TODO: in create dialog we want to have the settings from basics tab
					if (_contextSourceIdsObject !== null) {
						return _contextSourceIdsObject;
					} else {
						var mainService = $injector.get(getContext().mainService);
						return mainService.getSelected();
					}
				}

				return {
					getContext: getContext,
					getContextSourceIdsObject: getContextSourceIdsObject,
					setContextSourceIdsObject: setContextSourceIdsObject
				};

			}]);

	salesCommonModule.factory('salesCommonCopyBoqService',
		['_', 'globals', '$injector', '$q', '$http', 'platformSchemaService', 'salesCommonCopyBoqContextService',
			function (_, globals, $injector, $q, $http, platformSchemaService, salesCommonCopyBoqContextService) {

				function getAllQuotedBidsByProjectId(projectId) {
					return $http.get(globals.webApiBaseUrl + 'sales/bid/list?projectId=' + projectId).then(function (response) {
						var bidList = response.data;
						return $injector.get('salesBidStatusLookupDataService').getList({lookupType: 'salesBidStatusLookupDataService'}).then(function (bidStatusItems) {
							var isQuotedStatusIds = _.map(_.filter(bidStatusItems, {IsQuoted: true}), 'Id');
							// only 'isQuoted' status items
							return _.map(_.filter(bidList, function (bid) {return _.includes(isQuotedStatusIds, bid.BidStatusFk);}), 'Id');
						});
					});
				}

				function getBidHeaderId(mainItem) {
					// contract header available?
					// so we get the bid header by the contract
					if (mainItem.OrdHeaderFk > 0) {
						// get contract header and return corresponding bid header id
						var contractId = mainItem.OrdHeaderFk;
						return $http.get(globals.webApiBaseUrl + 'sales/contract/byid?id=' + contractId).then(function (response) {
							var contract = response.data;
							var bidId = _.get(contract, 'BidHeaderFk');
							if (bidId > 0) {
								return bidId;
							} else {
								// still no bid? so we will return all bids of the project (quoted status)
								return getAllQuotedBidsByProjectId(contract.ProjectFk);
							}
						});
					}

					// no bid and no contract references? -> we show all bids of the project
					if (!(mainItem.BidHeaderFk > 0) && !(mainItem.OrdHeaderFk > 0) && mainItem.ProjectFk > 0) {
						return getAllQuotedBidsByProjectId(mainItem.ProjectFk);
					}

					return $q.when(null);
				}

				function getBoqSources() {
					var boqSources = [
						{Id: 1, Description: 'Project BoQ', SubUrl: 'boq/project/list?projectId=', Property: 'ProjectFk'},
						{Id: 2, Description: 'Bid BoQ', SubUrl: 'sales/bid/boq/list?includerelated=true&bidId=', SubUrlByIds: 'sales/bid/boq/listbyids', Property: 'BidHeaderFk', Fallback: getBidHeaderId},
						{Id: 3, Description: 'Contract BoQ', SubUrl: 'sales/contract/boq/list?includerelated=true&contractId=', Property: 'OrdHeaderFk'},
						{Id: 4, Description: 'WIP BoQ', SubUrl: 'sales/wip/boq/listbycontractid?includerelated=true&contractId=', Property: 'OrdHeaderFk'}
					];

					// show only boqs of previous modules (e.g. in contract show: project boqs, bid boqs)
					var contextId = salesCommonCopyBoqContextService.getContext().id;
					return _.filter(boqSources, function (boqSource) {
						return contextId > 0 ? boqSource.Id < contextId : true;
					});
				}


				var boqColumnsBySource = {};

				function initBoqColumns() {
					if (_.isObject(boqColumnsBySource[1]) &&_.isObject(boqColumnsBySource[2]) &&
						_.isObject(boqColumnsBySource[3]) &&_.isObject(boqColumnsBySource[4])) {
						return $q.when(boqColumnsBySource);
					} else {
						return platformSchemaService.getSchemas([
							{typeName: 'BidHeaderDto', moduleSubModule: 'Sales.Bid'},
							{typeName: 'OrdHeaderDto', moduleSubModule: 'Sales.Contract'},
							{typeName: 'WipHeaderDto', moduleSubModule: 'Sales.Wip'}
						]).then(function () {
							var utilsService = $injector.get('salesCommonUtilsService');
							var configService = $injector.get('salesCommonBoqConfigurationServiceProvider').getInstance('sales.common.copyboqwizard');
							var columns = angular.copy(configService.getStandardConfigForListView().columns);

							// Project BoQ
							boqColumnsBySource[1] = columns;

							// Bid BoQ
							var bidConfig = $injector.get('salesBidConfigurationService');
							boqColumnsBySource[2] = _.cloneDeep(utilsService.getColumnsSubset(bidConfig.getStandardConfigForListView().columns,
								['code', 'descriptioninfo', 'rubriccategoryfk']
							)).concat(columns);

							// Contract BoQ
							var contractConfig = $injector.get('salesContractConfigurationService');
							boqColumnsBySource[3] = _.cloneDeep(utilsService.getColumnsSubset(contractConfig.getStandardConfigForListView().columns,
								['code', 'descriptioninfo', 'rubriccategoryfk']
							)).concat(columns);

							// WIP BoQ
							var wipConfig = $injector.get('salesWipConfigurationService');
							boqColumnsBySource[4] = _.cloneDeep(utilsService.getColumnsSubset(wipConfig.getStandardConfigForListView().columns,
								['code', 'descriptioninfo', 'performedfrom', 'performedto']
							)).concat(columns);

							// remove all navigators from all boq column configurations
							_.each(boqColumnsBySource, function (columnsConfig) {
								utilsService.removeNavigators(columnsConfig);
							});
							return boqColumnsBySource;
						});
					}
				}

				function getBoqColumns() {
					return boqColumnsBySource;
				}

				function processBoqItems(curBoqSourceId, boqItemList) {
					var defer = $q.defer();

					if (curBoqSourceId === 4) { // WIP BoQ
						let ids = _.map(boqItemList, 'WipBoq.WipHeaderFk');
						$http.post(globals.webApiBaseUrl + 'sales/wip/wipsbyids', ids).then(function (response) {
							var wipHeaderList = response.data;
							_.each(boqItemList, function (boqItem) {
								// get related wip header
								var curWip = _.find(wipHeaderList, {Id: _.get(boqItem, 'WipBoq.WipHeaderFk')});
								if (curWip) {
									boqItem.Code = curWip.Code;
									boqItem.DescriptionInfo = curWip.DescriptionInfo;
									boqItem.PerformedFrom = curWip.PerformedFrom;
									boqItem.PerformedTo = curWip.PerformedTo;
								}
							});
							defer.resolve(boqItemList);
						});

					} else if (curBoqSourceId === 3) { // Contract BoQ
						let ids = _.map(boqItemList, 'OrdBoq.OrdHeaderFk');
						$http.post(globals.webApiBaseUrl + 'sales/contract/contractsbyids', ids).then(function (response) {
							var ordHeaderList = response.data;
							_.each(boqItemList, function (boqItem) {
								// get related contract header
								var curContract = _.find(ordHeaderList, {Id: _.get(boqItem, 'OrdBoq.OrdHeaderFk')});
								if (curContract) {
									boqItem.Code = curContract.Code;
									boqItem.DescriptionInfo = curContract.DescriptionInfo;
									boqItem.RubricCategoryFk = curContract.RubricCategoryFk;
								}
							});
							defer.resolve(boqItemList);
						});

					} else if (curBoqSourceId === 2) { // Bid BoQ
						let ids = _.map(boqItemList, 'BidBoq.BidHeaderFk');
						$http.post(globals.webApiBaseUrl + 'sales/bid/bidsbyids', ids).then(function (response) {
							var bidHeaderList = response.data;
							_.each(boqItemList, function (boqItem) {
								// get related bid header
								var curBid = _.find(bidHeaderList, {Id: _.get(boqItem, 'BidBoq.BidHeaderFk')});
								if (curBid) {
									boqItem.Code = curBid.Code;
									boqItem.DescriptionInfo = curBid.DescriptionInfo;
									boqItem.RubricCategoryFk = curBid.RubricCategoryFk;
								}
							});
							defer.resolve(boqItemList);
						});
					} else {
						return $q.when(boqItemList);
					}
					return defer.promise;
				}

				// server api
				function takeOverBoQs(postData, selectedItemId) { // TODO: check selectedItem / use id instead?
					var context = salesCommonCopyBoqContextService.getContext();

					if (_.size(postData) > 0 && _.isString(context.copyUrl)) {
						$http.post(globals.webApiBaseUrl + context.copyUrl + selectedItemId, postData).then(function (result) {
							// merge updated header
							var header = result.data;
							var curMainService = $injector.get(context.mainService);
							curMainService.updateHeader(header);
							curMainService.recalculateBillingSchema();
							// force reload of BoQs container
							var curBoqService = $injector.get(context.boqService);
							if(_.isFunction(curBoqService.loadSubItemsList)) {
								curBoqService.loadSubItemsList();
							}
							else {
								// TODO: instead of reload we could also merge into item list. check also that solution. see #83004
								// This is just a fallback to the old behavior in case the loadSubItemsList function is not there.
								curBoqService.reload();
							}
						});
					}
				}

				// helper
				function setMarkerForBoqStructure(boqStructure, markerValue) {
					var salesCommonUtilsService = $injector.get('salesCommonUtilsService');
					var flatItems = salesCommonUtilsService.flatten(boqStructure, 'BoqItems');

					// select all or un-select all
					if (markerValue === true) {
						_.each(flatItems, salesCommonUtilsService.setMarker);
					} else if (markerValue === false) {
						_.each(flatItems, salesCommonUtilsService.clearMarker);
					}
				}

				function processPredecessors(items, childItem, processFunc) {
					var parentFk = childItem['BoqItemFk'];
					var curParent = _.find(items, {Id: parentFk});

					while (curParent !== null && curParent !== undefined) {
						// do something
						processFunc(curParent);
						// go to next predecessor
						curParent = _.find(items, {Id: curParent['BoqItemFk']});
					}
				}

				return {
					getBoqSources: getBoqSources,

					initBoqColumns: initBoqColumns,
					getBoqColumns: getBoqColumns,

					processBoqItems: processBoqItems,
					processPredecessors: processPredecessors,
					setMarkerForBoqStructure: setMarkerForBoqStructure,

					takeOverBoQs: takeOverBoQs
				};

			}]);

	salesCommonModule.factory('salesCommonCopyBoqWizardService',
		['_', 'globals', '$rootScope', '$injector', '$q', '$http', '$translate', 'platformTranslateService', 'platformModalFormConfigService', 'boqMainServiceFactory', 'salesCommonCopyBoqService', 'salesCommonCopyBoqContextService',
			function (_, globals, $rootScope, $injector, $q, $http, $translate, platformTranslateService, platformModalFormConfigService, boqMainServiceFactory, salesCommonCopyBoqService, salesCommonCopyBoqContextService) {

				var service = {};

				// see also: #116825 and #117036
				var events = {_isDirty_BoqStructure: false};
				function updateBoQStructure() {
					events._isDirty_BoqStructure = true;
				}

				var callBackApi = {};
				function updateBoQStructureV2() {
					if (_.isFunction(_.get(callBackApi, 'updateBoqStructure'))) {
						callBackApi.updateBoqStructure();
					}
				}

				var initDataItem = {};
				var boqItems = [];      // binded to boq select directive
				var boqColumns = [];    // binded to boq select directive
				var boqStructure = [];  // binded to boq structure select directive

				var boqHeader2boqStructure = {}; // cache
				var boqColumnsBySource = salesCommonCopyBoqService.getBoqColumns();

				var mainService = $injector.get(salesCommonCopyBoqContextService.getContext().mainService);
				var boqMainService = boqMainServiceFactory.createNewBoqMainService({
					'isLookup': true,
					'parent': mainService
				}).service;

				function getBoqDataItem() {
					return initDataItem;
				}
				service.setBoqDataItem = function setBoqDataItem(boqDataItem) {
					initDataItem = boqDataItem;
				};

				function updateBoqColumnsConfig() {
					// columns configuration depends on boq source
					var curBoqSourceId = _.get(initDataItem, 'BoqSource');

					var columns = boqColumnsBySource[curBoqSourceId];
					if (columns) {
						boqColumns.length = 0; // TODO: necessary?
						_.each(columns, function (column) {
							boqColumns.push(column);
						});
					}
				}

				function updateBoqItems(outBoqItems) {
					var currentBoqSource = _.find(salesCommonCopyBoqService.getBoqSources(), {Id: initDataItem.BoqSource});
					initDataItem.currentSelectedItem = salesCommonCopyBoqContextService.getContextSourceIdsObject();
					var id = initDataItem.currentSelectedItem[currentBoqSource.Property];

					// if property not available, try fallback
					var idPromise = $q.when(null);
					if (_.isUndefined(id) || _.isNull(id)) {
						idPromise = currentBoqSource.Fallback ? currentBoqSource.Fallback(initDataItem.currentSelectedItem) : idPromise;
					} else {
						idPromise = $q.when(id);
					}
					idPromise.then(function (id) {
						outBoqItems.length = 0;

						var boqListPromise = $q.when([]);
						if (_.isArray(id) && currentBoqSource.SubUrlByIds) {
							boqListPromise = $http.post(globals.webApiBaseUrl + currentBoqSource.SubUrlByIds, id);
						} else if (id) {
							boqListPromise = $http.get(globals.webApiBaseUrl + currentBoqSource.SubUrl + id);
						}
						boqListPromise.then(function (response) {
							var boqList = _.filter(response.data, function(boq) { return !($rootScope.currentModule==='sales.billing' && boq.BoqHeader.IsGCBoq); } ); // GC BOQs should not be contained in sales.billing

							// process boq list - extends data
							salesCommonCopyBoqService.processBoqItems(currentBoqSource.Id, boqList).then(function (extendedBoqList) {
								_.each(extendedBoqList, function (boqItem) {
									outBoqItems.push(boqItem);
								});
							});
						});
					});
				}

				function loadBoqStructurePromise(boqHeaderId) {
					// try from cache
					if (boqHeader2boqStructure[boqHeaderId]) {
						var rootBoqItem = boqHeader2boqStructure[boqHeaderId];
						return $q.when(rootBoqItem);
					} else {
						var defer = $q.defer();
						var boqHeaderChanged = function () {
							var rootBoqItem = boqMainService.getRootBoqItem();

							// cache for next use and for selection marker
							var boqHeaderId = _.get(rootBoqItem, 'BoqHeaderFk');
							if (boqHeaderId) {
								boqHeader2boqStructure[boqHeaderId] = rootBoqItem;
							}

							defer.resolve(rootBoqItem);
							boqMainService.selectedBoqHeaderChanged.unregister(boqHeaderChanged);
						};
						boqMainService.selectedBoqHeaderChanged.register(boqHeaderChanged);
						boqMainService.setSelectedHeaderFk(boqHeaderId !== null ? boqHeaderId : -1);

						return defer.promise;
					}
				}

				service.getBoqItems = function getBoqItems() {
					return boqItems;
				};

				service.getBoqStructureList = function getBoqStructureList() {
					return boqStructure;
				};

				service.getPostData = function getPostData() {
					// extended api, so we need to convert to dictionary/map looking like:
					// { <boqheaderid>: [<boqitemid>, <boqitemid>, .. <boqitemid>],
					//   <boqheaderid2>: []} // empty list, i.e. full item will be copied

					var cloudCommonGridService = $injector.get('cloudCommonGridService');
					var postData = {};
					var markedBoqItemsIds = _.map(_.filter(boqItems, {IsMarked: true}), 'BoqHeader.Id');
					_.each(markedBoqItemsIds, function (boqHeaderId) {
						var curBoqStructure = boqHeader2boqStructure[boqHeaderId];

						var flatBoqItemsList = [];
						cloudCommonGridService.flatten([curBoqStructure], flatBoqItemsList, 'BoqItems');

						// if no boq item is marked, skip current boq header
						if (_.every(flatBoqItemsList, {IsMarked: false})) {
							return; // continue with next boq header
						}

						// check if full boq will be copied
						var fullCopy = !_.some(flatBoqItemsList, {IsMarked: false}); // TODO: correct? or just positions?
						if (fullCopy) {
							// if full boq will be copied, boq structure array will be empty
							postData[boqHeaderId] = [];
						} else {
							var boqItemIds = _.filter(flatBoqItemsList, {'IsMarked': true});
							postData[boqHeaderId] = _.map(boqItemIds, 'Id');
						}
					});

					return postData;
				};

				// event handler
				// - boq source
				function onBoqSourceChanged() {
					// update columns configuration
					updateBoqColumnsConfig();
					// reload boq items
					updateBoqItems(boqItems);
				}
				// - boq items
				function onBoqItemChanged(selectedItem) {
					boqStructure.length = 0;

					if (selectedItem !== null) {
						var selectedBoqHeader = selectedItem && _.has(selectedItem, 'BoqHeader') ? selectedItem.BoqHeader : null;
						var boqHeaderId = selectedBoqHeader && _.has(selectedBoqHeader, 'Id') ? selectedBoqHeader.Id : null;

						var boqStructurePromise = loadBoqStructurePromise(boqHeaderId);
						boqStructure.push(boqStructurePromise); // set loading indicator

						boqStructurePromise.then(function (rootBoqItem) {

							var isMarked = _.get(_.find(boqItems, {BoqHeader: {Id: rootBoqItem.BoqHeaderFk}}), 'IsMarked');
							// check if is initial data or from cache
							var isFromCache = _.has(rootBoqItem, 'IsMarked'); // TODO: any better solution here as indicator?
							if (!isFromCache) {
								salesCommonCopyBoqService.setMarkerForBoqStructure([rootBoqItem], isMarked);
							}

							boqStructure.length = 0;
							boqStructure.push(rootBoqItem);
							updateBoQStructure();
						});
					}
					updateBoQStructureV2();
				}
				function onBoqItemsMarkerChanged(changedItem) {
					// is promise?
					if (_.has(_.first(boqStructure), '$$state')) {
						_.first(boqStructure).then(function (rootBoqItem) {
							salesCommonCopyBoqService.setMarkerForBoqStructure([rootBoqItem], changedItem['IsMarked']);
							updateBoQStructure();
						});
					} else {
						// select all or un-select all
						salesCommonCopyBoqService.setMarkerForBoqStructure(boqStructure, changedItem['IsMarked']);
						updateBoQStructure();
					}
				}
				// - boq structure
				function onBoqStructureMarkerChanged(changedItem, allItems) {

					// select all predecessor (parents)
					salesCommonCopyBoqService.processPredecessors(allItems, changedItem, function (curParent) {
						if (changedItem['IsMarked']) {
							curParent.IsMarked = true;
						}
					});

					let salesCommonUtilsService = $injector.get('salesCommonUtilsService');

					// on un-select/select, also un-select/select all successors
					if (_.isArray(changedItem.BoqItems) && _.size(changedItem.BoqItems) > 0) {
						var allChildren = salesCommonUtilsService.flatten(changedItem.BoqItems, 'BoqItems');
						if (changedItem['IsMarked']) {
							_.each(allChildren, salesCommonUtilsService.setMarker);
						} else {
							_.each(allChildren, salesCommonUtilsService.clearMarker);
						}
					}

					// uncheck or check related boq header?
					var flatAllItems = salesCommonUtilsService.flatten(boqStructure, 'BoqItems');
					var availableIsMarkedValues = _.uniq(_.map(flatAllItems, 'IsMarked'));

					// set related boq header to isMarked value
					var isMarked = _.includes(_.values(availableIsMarkedValues), true);
					var boqHeader = _.find(boqItems, {BoqHeader: {Id: _.get(_.first(flatAllItems), 'BoqHeaderFk')}});
					_.set(boqHeader, 'IsMarked', isMarked);

					updateBoQStructure();
				}

				function getFormConfig () {
					return {
						fid: 'sales.common.CopyBoqWizardModal',
						version: '0.0.1',
						showGrouping: false,
						groups: [
							{gid: 'baseGroup', attributes: ['boqsource']}
						],
						rows: [
							// Boq Source
							{
								gid: 'baseGroup',
								rid: 'boqsource',
								label$tr$: 'sales.common.wizard.boqSource',
								model: 'BoqSource',
								type: 'select',
								options: {
									displayMember: 'Description',
									valueMember: 'Id',
									inputDomain: 'description',
									select: 1,
									items: salesCommonCopyBoqService.getBoqSources()
								},
								visible: true,
								sortOrder: 1,
								change: onBoqSourceChanged
							},
							// grid with select column boq (headers)
							{
								gid: 'baseGroup',
								rid: 'boqsGrid',
								label: 'BoQs',
								label$tr$: 'sales.common.wizard.boqs',
								type: 'directive',
								directive: 'sales-common-select-boqs',
								options: {
									serviceName: 'salesCommonCopyBoqWizardService',
									getListName: 'getBoqItems',
									columns: boqColumns,
									events: events,
									items: boqItems,
									gridStyle: 'height:150px;',
									selectionChanged: onBoqItemChanged,
									markerChanged: onBoqItemsMarkerChanged
								},
								readonly: false, maxlength: 5000, rows: 20, visible: true, sortOrder: 1
							},
							// grid with select column for boq structure
							{
								gid: 'baseGroup',
								rid: 'boqStructureGrid',
								label: 'BoQ Structure',
								label$tr$: 'sales.common.wizard.boqstructure',
								type: 'directive',
								directive: 'sales-common-select-boq-structure',
								options: {
									serviceName: 'salesCommonCopyBoqWizardService',
									getListName: 'getBoqStructureList',
									events: events,
									items: boqStructure,
									callBackApi: callBackApi,
									gridStyle: 'height:300px;', // TODO: check how to remove this style
									markerChanged: onBoqStructureMarkerChanged
								},
								readonly: false, maxlength: 5000, rows: 20, visible: true, sortOrder: 1
							}
						]
					};
				}

				function getDialogConfig() {
					var modalDialogConfig = {
						title: $translate.instant('sales.common.wizard.takeoverBoq'),
						dataItem: getBoqDataItem(), // get default settings, see resetToDefault()
						formConfiguration: getFormConfig(),
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								// disable ok button, if no boq items are selected
								return _.size(_.filter(boqItems, {'IsMarked': true})) === 0;
							},
							disableCancelButton: function disableCancelButton() {
								return false;
							},
							minWidth: '900px'
						},
						isDisabled: function isDisabled(buttonType) { // TODO: check and remove (see #520133 and #520911)
							if (buttonType === 'ok') {
								// disable ok button, if no boq items are selected
								return _.size(_.filter(boqItems, {'IsMarked': true})) === 0;
							} else if (buttonType === 'cancel') {
								return false;
							}
						},
						handleOK: function handleOK(/* result */) {
							// var selectedBoqHeaders = _.filter(result.data.items, {'IsMarked': true}); // TODO: check selectedBoqHeaders
							// var boqIdList = _.compact(_.map(selectedBoqHeaders, 'BoqHeader.Id')); // TODO: remove
							var selectedItem = _.get(initDataItem, 'currentSelectedItem');
							var context = salesCommonCopyBoqContextService.getContext();

							// make sure sales item (e.g. bid) is already saved on server (see also #84185)
							// sales item not saved yet (version=0)? Then we perform an update(, quite without asking user)
							var mainService = $injector.get(context.mainService);
							var promise2Continue = _.get(selectedItem, 'Version') === 0 ? mainService.update() : $q.when();
							promise2Continue.then(function takeOverBoq() {
								var postData = service.getPostData();
								salesCommonCopyBoqService.takeOverBoQs(postData, selectedItem.Id);
							});
						}
					};
					platformTranslateService.translateFormConfig(modalDialogConfig.formConfiguration);
					return modalDialogConfig;
				}

				service.getFormConfig = getFormConfig;

				service.resetToDefault = function () {
					boqItems.length = 0;
					boqColumns.length = 0;
					boqMainService.setSelectedHeaderFk(-1);
					boqHeader2boqStructure = {};
					
					// pre-select 'BoQ Source'
					initDataItem.BoqSource = _.get(_.last(salesCommonCopyBoqService.getBoqSources()), 'Id');
					initDataItem.items = boqItems;
					onBoqSourceChanged();

					boqStructure.length = 0;  // reset
				};

				service.init = function init(contextSourceObj, boqDataItem) {
					if (contextSourceObj) {
						salesCommonCopyBoqContextService.setContextSourceIdsObject(contextSourceObj);
					}
					if (boqDataItem) {
						service.setBoqDataItem(boqDataItem);
					}
					return salesCommonCopyBoqService.initBoqColumns().then(function () {
						service.resetToDefault();
					});
				};

				service.showDialog = function showDialog() {
					salesCommonCopyBoqContextService.setContextSourceIdsObject(null);
					service.init().then(function () {
						return platformModalFormConfigService.showDialog(getDialogConfig());
					});
				};

				return service;

			}]);
})();
