/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonBoqStructureServiceDecorator
	 * @description decorator to enhance sales boq structure services by overwriting given functions and enhance them
	 */
	angular.module(salesCommonModule).service('salesCommonBoqStructureServiceDecorator', [ 'boqMainDocPropertiesService', '$injector','permissions', '_', function (boqMainDocPropertiesService, $injector, permissions, _) {

		return {
			decorate: function decorate(boqStructureServiceContainer, salesService, salesBoqService, isWip, isBil) {

				var salesBoqStructureService = boqStructureServiceContainer.service;

				// Make container boq structure container UUID accessible to the salesBoqStructureService (cuzrrently helpful to handle readonly status of boq related containers via restriction of permissions)
				// Todo BH: It would be great to somehow be able to have direct access to the definition of the container UUID instead of using it here directly.
				var getSalesHeaderStatus = null;
				var salesHeaderStatusLookupService = null;
				var currentSalesHeaderStatus = null;
				switch(salesService.getItemName()) {
					case 'BidHeader':
						salesBoqStructureService.setContainerUUID('ce8cd4ae57f34df0b5e2ea3e60acb28e');
						getSalesHeaderStatus = function (salesHeader) {
							return salesHeader ? salesHeader.BidStatusFk : null;
						};
						salesHeaderStatusLookupService = $injector.get('basicsCustomSalesBidStatusLookupDataService');
						break;
					case 'BilHeader':
						salesBoqStructureService.setContainerUUID('65294188ea2f4aeea7f1243ecf096434');
						getSalesHeaderStatus = function (salesHeader) {
							return salesHeader ? salesHeader.BilStatusFk : null;
						};
						salesHeaderStatusLookupService = $injector.get('basicsCustomSalesBillingStatusLookupDataService');
						break;
					case 'OrdHeader':
						salesBoqStructureService.setContainerUUID('8d52d213015f4df6b3fb07d6fd81cb42');
						getSalesHeaderStatus = function (salesHeader) {
							return salesHeader ? salesHeader.OrdStatusFk : null;
						};
						salesHeaderStatusLookupService = $injector.get('basicsCustomSalesContractStatusLookupDataService');
						break;
					case 'WipHeader':
						salesBoqStructureService.setContainerUUID('6e5b061fc7014aec91717edbb576312c');
						getSalesHeaderStatus = function (salesHeader) {
							return salesHeader ? salesHeader.WipStatusFk : null;
						};
						salesHeaderStatusLookupService = $injector.get('basicsCustomSalesWipStatusLookupDataService');
						break;
				}

				var determineSalesCallingContext = function determineSalesCallingContext() {
					var salesCallingContext = null;
					var salesServiceModuleName = null;
					if(_.isObject(salesService)) {
						salesServiceModuleName = salesService.getItemName();
						switch (salesServiceModuleName) {
							case 'BidHeader':
								salesCallingContext = {SalesBidHeader: salesService.getSelected()};
								break;
							case 'BilHeader':
								salesCallingContext = {SalesBilHeader: salesService.getSelected()};

								break;
							case 'OrdHeader':
								salesCallingContext = {SalesOrdHeader: salesService.getSelected()};

								break;
							case 'WipHeader':
								salesCallingContext = {SalesWipHeader: salesService.getSelected()};
								break;
						}
					}

					return salesCallingContext;
				};

				var initSalesBoqStructureService = function initSalesBoqStructureService(salesComposite) {
					if (salesComposite) {
						var boqRootItem = salesComposite.BoqRootItem;
						var BoqHeaderFk = boqRootItem ? boqRootItem.BoqHeaderFk : 0;
						var currentSalesItem = salesService.getSelected();
						var salesHeaderStatusFk = getSalesHeaderStatus(currentSalesItem);
						if (currentSalesHeaderStatus === null) {
							var lookupOptions = {lookupType: salesService.getItemName() + 'Status'};
							var headerStatusList = salesHeaderStatusLookupService.getListSync(lookupOptions);
							currentSalesHeaderStatus = _.find(headerStatusList, {Id: salesHeaderStatusFk});
						}
						var isReadOnly = (currentSalesHeaderStatus && currentSalesHeaderStatus.ReadOnly) || (salesComposite && salesComposite.BoqHeader && salesComposite.BoqHeader.IsReadOnly);
						let salesCallingContext = determineSalesCallingContext();
						salesBoqService.setReadOnly(isReadOnly);
						salesBoqService.setCanCreate(!(currentSalesHeaderStatus && currentSalesHeaderStatus.ReadOnly));
						salesBoqStructureService.setReadOnly(isReadOnly);
						salesBoqStructureService.setSelectedHeaderFk(BoqHeaderFk, false, false, isWip, isBil);
						salesBoqStructureService.setCallingContext(salesCallingContext);
						salesBoqService.doProcessItem(salesComposite);
						if(angular.isDefined(currentSalesItem) && (currentSalesItem !== null)) {
							salesBoqStructureService.setSelectedProjectId(currentSalesItem.ProjectFk);
							salesBoqStructureService.setCurrentExchangeRate(currentSalesItem.ExchangeRate);
						}
					} else {
						// no composite sales boq selected
						salesBoqStructureService.setSelectedHeaderFk(-1);
						salesBoqStructureService.setCallingContext(null);
						salesBoqStructureService.setSelectedProjectId(null);
						salesBoqStructureService.setCurrentExchangeRate(1.0);
						salesBoqService.setReadOnly(currentSalesHeaderStatus && currentSalesHeaderStatus.ReadOnly);
						salesBoqService.setCanCreate(!(currentSalesHeaderStatus && currentSalesHeaderStatus.ReadOnly));
						salesBoqStructureService.setReadOnly(currentSalesHeaderStatus && currentSalesHeaderStatus.ReadOnly);
					}
				};

				// register events:
				// BoQs -> BoQ Structure
				salesBoqService.registerSelectionChanged(function onSelectedBidBoqChanged(e, salesComposite) {
					initSalesBoqStructureService(salesComposite);
				});

				var onBoqMainItemChanged = function onBoqMainItemChanged(e, args) {

					// React on an item being changed in the boq main structure
					// e is supposed to be null. args is supposed to be the changed item.

					// Check if the changed item is the root item.
					var changedBoqMainItem = args;
					if (salesBoqStructureService && salesBoqStructureService.getRootBoqItem() === changedBoqMainItem) {
						// Sync the currently selected boq root item of the list with the changed boqMainRootItem
						var selected = salesBoqService.getSelected();
						if (selected) {
							var selectedBoq = selected.BoqRootItem;
							if (angular.isDefined(selectedBoq) &&
								(selectedBoq !== null) &&
								(selectedBoq.Id === changedBoqMainItem.Id)) {
								// Merge complete changed boq root item to make sure not loosing any changes when doing an update
								// on this changed item.
								angular.merge(selectedBoq, changedBoqMainItem);
								salesBoqService.fireItemModified(selected);
							}
						}
					}
				};

				var onSalesBoqRootItemChanged = function onSalesBoqRootItemChanged(e, args) {

					// React on an item being changed in the prc boq root item list
					// e is supposed to be null. args is supposed to be the changed item.

					// Check if the changed item is the root item.
					var changedSalesBoqRootItem = args ? args.BoqRootItem : null;
					if (salesBoqService.getSelected() && salesBoqService.getSelected().BoqRootItem === changedSalesBoqRootItem) {
						// Sync the currently selected boq main root item of the list with the changed salesBoqRootItem
						if(salesBoqStructureService){
							var selectedBoq = salesBoqStructureService.getRootBoqItem();
							if (selectedBoq) {
								if (angular.isDefined(selectedBoq) &&
									(selectedBoq !== null) &&
									(selectedBoq.Id === changedSalesBoqRootItem.Id) &&
									((selectedBoq.Reference !== changedSalesBoqRootItem.Reference) || (selectedBoq.ExternalCode !== changedSalesBoqRootItem.ExternalCode) || !angular.equals(selectedBoq.BriefInfo, changedSalesBoqRootItem.BriefInfo) || selectedBoq.Version !== changedSalesBoqRootItem.Version)) {
									// Only update those properties that currently can be changed in the corresponding container.
									selectedBoq.Reference = changedSalesBoqRootItem.Reference;
									selectedBoq.ExternalCode = changedSalesBoqRootItem.ExternalCode;
									angular.extend(selectedBoq.BriefInfo, changedSalesBoqRootItem.BriefInfo);
									selectedBoq.Version = changedSalesBoqRootItem.Version;
									salesBoqStructureService.fireItemModified(selectedBoq);
								}
							}
						}
					}
				};

				var onSalesBoqHeaderChanged = function onSalesBoqHeaderChanged(e, args) {

					// React on a boq header being changed when saving the boq document properties.
					// e is supposed to be null. args is supposed to be the changed item.

					// Check if the changed item is the related to the currently selected boq header.
					var changedSalesBoqHeader = args ? args.UpdatedBoqHeader : null;
					var selectedBoqHeader = salesBoqService.getSelected() && salesBoqService.getSelected().BoqHeader ? salesBoqService.getSelected().BoqHeader : null;
					if (selectedBoqHeader !== null && changedSalesBoqHeader !== null && selectedBoqHeader.Id === changedSalesBoqHeader.Id) {
						// Sync the currently selected boq header of the list with the changed salesBoqHeader

						// Merge complete changed boq header to make sure not loosing any changes when doing an update
						// on this changed item.
						angular.merge(selectedBoqHeader, changedSalesBoqHeader);
						salesBoqService.fireItemModified(salesBoqService.getSelected());
					}
				};

				var onEntityDeleted = function onEntityDeleted(/* e, deletedItems */) {
					if(salesBoqStructureService) {
						// For a complete boq has been deleted we have to make sure that corresponging modifications done
						// in the boq structure service (-> salesBoqStructureService) are also cleared.
						var flatBoqList = salesBoqStructureService.getList();
						salesBoqStructureService.clearModifications(flatBoqList, true); // Flag set to true forces delete items list also to be cleared
					}
				};

				var onSalesHeaderChanged = function onSalesHeaderChanged(e, salesHeader) {
					if(!salesHeader) {
						return;
					}

					var salesHeaderStatusFk = getSalesHeaderStatus(salesHeader);
					var lookupOptions = {lookupType: salesService.getItemName() + 'Status'};
					salesHeaderStatusLookupService.getList(lookupOptions).then(function (headerStatusList) {
						if(salesHeaderStatusFk && headerStatusList && _.isArray(headerStatusList)) {
							currentSalesHeaderStatus = _.find(headerStatusList, {Id: salesHeaderStatusFk});

							if(currentSalesHeaderStatus) {
								// Hint BH: This header status comes from a lookup located in basics.customize. Is different from also existing lookup services in sales !!!
								// -> Here the property is named ReadOnly and not IsReadonly !!!
								salesBoqService.setReadOnly(currentSalesHeaderStatus.ReadOnly);
								salesBoqService.setCanCreate(!currentSalesHeaderStatus.ReadOnly);
								salesBoqStructureService.setReadOnly(currentSalesHeaderStatus.ReadOnly);

								var permissionFlag = currentSalesHeaderStatus.ReadOnly ? permissions.read : false;
								$injector.get('platformPermissionService').restrict([
									'dfdfdc6f81054522998c9ceb6eb3b24f', 'da8b5f2c30ae4e6dafffdb3db1e17699',
									'27cbdfed58e44dbd8d3b3c07b54bbc1f', '79db0ff7fcda4e0c944fcde734878044',
									'd668042b28334763a0d7f001cc6bd45d', '1f821207112b4cbeb037d941b18b7338'
								], permissionFlag);
							}
						}
						else {
							currentSalesHeaderStatus = null;
						}
					});
				};

				var onExchangeRateChanged = function onExchangeRateChanged(e, args) {

					var listItems = salesBoqService.getList();
					var boqHeaderIds = _.map(_.map(listItems, 'BoqRootItem'), function (item) {
						return item.BoqHeaderFk;
					});

					if(_.isEmpty(boqHeaderIds)) {
						return;
					}

					var currentMainItem = salesService.getSelected();

					if (currentMainItem) {
						salesBoqStructureService.setCurrentExchangeRate(args.ExchangeRate);

						// Before recalculating and refreshing the corresponding boqs we save all other changes.
						// Hint: The recalculation of the boqs is now handled in the update function of the sales header on server side.
						// This also includes the determination of the total amounts for the sales header object as requested in ALM 108965
						if (angular.isFunction(salesService.updateAndExecute)) {
							salesService.updateAndExecute(function () {
								// Reload the recalculated boqs
								salesBoqService.load().then(function () {
									var selected = salesBoqService.getSelected();
									initSalesBoqStructureService(selected);
								});
							});
						}
					}
				};

				if(salesBoqStructureService){
					salesBoqStructureService.registerItemModified(onBoqMainItemChanged);
				}

				// Do initial loading of boq structure service.
				var selectedSalesComposite = salesBoqService.getSelected();
				initSalesBoqStructureService(selectedSalesComposite);

				salesBoqService.registerItemModified(onSalesBoqRootItemChanged);
				salesBoqService.registerEntityDeleted(onEntityDeleted);
				salesService.registerSelectionChanged(onSalesHeaderChanged);
				boqMainDocPropertiesService.boqPropertiesSaved.register(onSalesBoqHeaderChanged);
				salesService.exchangeRateChanged.register(onExchangeRateChanged);
			}
		};
	}
	]);

})();
