/**
 * Created by chi on 5/6/2016.
 */
(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonOneQuoteContractMainService', [
		'_',
		'moment',
		'platformGridDomainService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonCommonHelperService',
		'platformRuntimeDataService',
		function (
			_,
			moment,
			platformGridDomainService,
			basicsLookupdataLookupDescriptorService,
			commonHelperService,
			platformRuntimeDataService) {

			let service = {},
				tempReadData = null,
				readData = null,
				selectedReqHeaderIds = [],
				isItemData = true, // true - item data; false - boq data
				isSingleReqHeader = false,
				hasContractItem = false;
			let selectedReqHeaderId2ReqVariantIdsMap = {};

			service.responseData = responseData;
			service.getQuote = getQuote;
			service.getReqHeaders = getReqHeaders;
			service.getAllReqHeaders = getAllReqHeaders;
			service.getSelectedReqHeaderIds = getSelectedReqHeaderIds;
			service.updateSelectedReqHeaderIds = updateSelectedReqHeaderIds;
			service.getReqHeaderCount = getReqHeaderCount;
			service.getSelectedReqHeaderIdsCount = getSelectedReqHeaderIdsCount;
			service.getSelectedReqTotal = getSelectedReqTotal;
			service.getHasContractItem = getHasContractItem;
			service.getSelectedReqHeaderId2ReqVariantIdsMap = getSelectedReqHeaderId2ReqVariantIdsMap;
			service.addSelectedReqHeader = addSelectedReqHeader;
			return service;

			function createItemListData() {
				// data is set from clicking on the create contract button
				readData = tempReadData || { // if empty, set default
					Main: [],
					Quote: [],
					GrandTotal: [],
					reqHeaders: [],
					allReqHeaders: []
				};
				let quoteBpId = -2;
				if (readData.Quote.length > 0) {
					quoteBpId = readData.Quote[0].BusinessPartnerFk;
				}

				readData.Main = readData.Main.map(function (item) {
					// add a checkbox, req-count, grand-total column to the data
					item.IsChecked = false;
					item.subTotal = commonHelperService.getSubTotal(readData.Totals, item.Id);
					item.grandTotal = commonHelperService.getGrandTotal(readData.Quote, readData.Totals, item.BusinessPartnerFk, item.QuoteVersion);
					return item;
				});

				readData.reqHeaders = readData.Main[0].ReqHeaders;
				let reqVariantInfo = readData.RequisitionVariantInfo && readData.RequisitionVariantInfo.length > 0 ? readData.RequisitionVariantInfo[0] : null; // { ReqVariants: [], ReqItemVariants: [], ReqBoqVariants: [], RfqParialReqAssigneds: [] };

				readData.allReqHeaders = [];
				let allReqHeaders = [];
				_.forEach(readData.Main, function (item) {
					readData.allReqHeaders = readData.allReqHeaders.concat(item.ReqHeaders);
				});
				if (isItemData) {
					_.forEach(readData.allReqHeaders, function (item) {
						let subtotal = 0;
						allReqHeaders.push(item);

						if (isSingleReqHeader) {
							let found = _.find(selectedReqHeaderIds, function (id) {
								return item.Id === id || item.ReqHeaderFk === id;
							});
							item.isChecked = !!found;
						} else {
							item.isChecked = true;
							addSelectedReqHeader(item);
						}

						if (reqVariantInfo && reqVariantInfo.ReqVariants && reqVariantInfo.ReqVariants.length > 0) {
							let variants = reqVariantInfo.ReqVariants.filter(function (variant) {
								if (variant.ReqHeaderFk !== item.Id) {
									return false;
								}
								// the requisition defines variants and no partial requisition assigned is defined, show variants in the UI.
								if (!reqVariantInfo.RfqParialReqAssigneds ||
									reqVariantInfo.RfqParialReqAssigneds.length === 0 ||
									!reqVariantInfo.RfqParialReqAssigneds.some(e =>
										e.ReqHeaderFk === item.Id &&
										e.BpdBusinessPartnerFk === quoteBpId)) {
									return true;
								}
								// if there are no prc items assigned to the variant, don't show it in UI.
								if (!reqVariantInfo.ReqItemVariants || reqVariantInfo.ReqItemVariants.length === 0) {
									return false;
								}

								// get variants assigned to rfq bidders
								let partials = reqVariantInfo.RfqParialReqAssigneds.filter(e =>
									e.ReqHeaderFk === item.Id &&
									e.BpdBusinessPartnerFk === quoteBpId &&
									e.ReqVariantFk === variant.Id);
								variant.isForPartialReqAssigned = partials.length > 0; // mark the variant is assigned to rfq bidder
								variant.isChecked = variant.isForPartialReqAssigned; // if variant is assigned to rfq bidder, it is always checked.

								// if there are prc items assigned to the variant, show it in UI. variant
								return variant.isForPartialReqAssigned && reqVariantInfo.ReqItemVariants.some(e => e.ReqVariantFk === variant.Id);
							});

							// initialize the variants
							variants.forEach(function (variant) {
								let variantReq = angular.copy(item);
								variantReq.Id = -variant.Id;
								variantReq.Code = variant.Code;
								variantReq.Description = variant.Description;
								variantReq.ReqHeaderFk = item.Id;
								variantReq.reqHeader = item;
								variantReq.isChecked = !!variant.isChecked;
								variantReq.isForPartialReqAssigned = variant.isForPartialReqAssigned;

								allReqHeaders.push(variantReq);
							});
						}

						/** @namespace item.PrcItems */
						if (!item.PrcItems) {
							item.reqTotal = 0;
							return;
						}
						_.forEach(item.PrcItems, function (prcItem) {
							if (prcItem.ReplacementItems) {
								_.forEach(prcItem.ReplacementItems, function (replaceItem) {
									subtotal += replaceItem.Total;
								});
							} else {
								subtotal += prcItem.Total;
							}
						});

						item.reqTotal = subtotal;
					});
					readData.allReqHeaders = allReqHeaders;
				} else { // it is boq data
					/** @namespace readData.BoqRootItems2ReqHeader */
					let addtionalList = readData.BoqRootItems2ReqHeader;
					_.map(readData.allReqHeaders, function (item) {
						let finalPrice = 0;

						if (isSingleReqHeader) {
							let foundReqId = _.find(selectedReqHeaderIds, function (id) {
								return item.Id === id;
							});
							item.isChecked = !!foundReqId;
						} else {
							item.isChecked = true;
							addSelectedReqHeader(item);
						}
						allReqHeaders.push(item);
						if (reqVariantInfo && reqVariantInfo.ReqVariants && reqVariantInfo.ReqVariants.length > 0) {
							let variants = reqVariantInfo.ReqVariants.filter(function (variant) {
								if (variant.ReqHeaderFk !== item.Id) {
									return false;
								}
								// the requisition defines variants and no partial requisition assigned is defined, show variants in the UI.
								if (!reqVariantInfo.RfqParialReqAssigneds ||
									reqVariantInfo.RfqParialReqAssigneds.length === 0 ||
									!reqVariantInfo.RfqParialReqAssigneds.some(e =>
										e.ReqHeaderFk === item.Id &&
										e.BpdBusinessPartnerFk === quoteBpId)) {
									return true;
								}

								// if there are no boq items assigned to the variant, don't show it in UI.
								if (!reqVariantInfo.ReqBoqVariants || reqVariantInfo.ReqBoqVariants.length === 0) {
									return false;
								}

								// get variants assigned to rfq bidders
								let partials = reqVariantInfo.RfqParialReqAssigneds.filter(e =>
									e.ReqHeaderFk === item.Id &&
									e.BpdBusinessPartnerFk === quoteBpId &&
									e.ReqVariantFk === variant.Id);
								variant.isForPartialReqAssigned = partials.length > 0; // mark the variant is assigned to rfq bidder
								variant.isChecked = variant.isForPartialReqAssigned; // if variant is assigned to rfq bidder, it is always checked.

								// if there are boq items assigned to the variant, show it in UI.
								return variant.isForPartialReqAssigned &&
										reqVariantInfo.ReqBoqVariants.some(e => e.ReqVariantFk === variant.Id);
							});

							// initialize variants
							variants.forEach(function (variant) {
								let variantReq = angular.copy(item);
								variantReq.Id = -variant.Id;
								variantReq.Code = variant.Code;
								variantReq.Description = variant.Description;
								variantReq.ReqHeaderFk = item.Id;
								variantReq.reqHeader = item;
								variantReq.isChecked = !!variant.isChecked;
								variantReq.isForPartialReqAssigned = variant.isForPartialReqAssigned;

								allReqHeaders.push(variantReq);
							});
						}

						if (addtionalList.length === 0) {
							item.reqTotal = finalPrice;
							return;
						}

						let found = _.find(addtionalList, {ReqHeaderId: item.Id});

						if (!found) {
							item.reqTotal = finalPrice;
							return;
						}

						_.forEach(found.BoqRootItems, function (boq) {
							finalPrice += boq.Finalprice;
						});

						item.reqTotal = finalPrice;
					});
					readData.allReqHeaders = allReqHeaders;
				}

				// add an formatted date in lookup data
				readData.Quote = readData.Quote.map(function (item) {
					item.DateQuotedFormatted = platformGridDomainService.formatter('date').apply(null, [0, 0, moment.utc(item.DateQuoted), {}]);
					return item;
				});

				// lookup data
				basicsLookupdataLookupDescriptorService.attachData(readData || {});
			}

			function getQuote() {
				if (!readData) {
					createItemListData();
				}
				return readData.Main;
			}

			function getReqHeaders() {
				if (!readData) {
					createItemListData();
				}
				return readData.reqHeaders;
			}

			function getAllReqHeaders() {
				if (!readData) {
					createItemListData();
				}
				return readData.allReqHeaders;
			}

			function getSelectedReqHeaderIds() {
				let list = selectedReqHeaderIds ? selectedReqHeaderIds.filter(e => e > 0) : [];
				if (selectedReqHeaderId2ReqVariantIdsMap) {
					for (let prop in selectedReqHeaderId2ReqVariantIdsMap) {
						list.push(prop);
					}
					list = _.uniq(list);
				}
				return list;
			}

			function addSelectedReqHeader(value) {
				if (!value) {
					return;
				}
				if (value.Id > 0) { // value is reqHeader or co reqHeader
					if (!selectedReqHeaderIds.some(e => e === value.Id)) {
						selectedReqHeaderIds.push(value.Id);
					}
				} else if (value.Id < 0 && value.ReqHeaderFk > 0) { // value is reqVariant
					let selectedVariantIds = selectedReqHeaderId2ReqVariantIdsMap[value.ReqHeaderFk];
					if (selectedVariantIds) {
						if (!selectedVariantIds.some(e => e === value.Id)) {
							selectedVariantIds.push(value.Id);
						}
					} else {
						selectedReqHeaderId2ReqVariantIdsMap[value.ReqHeaderFk] = [value.Id];
					}
				}
			}

			function getSelectedReqHeaderId2ReqVariantIdsMap() {
				return selectedReqHeaderId2ReqVariantIdsMap;
			}

			function clearSelectedReqHeaderId2ReqVariantIdsMap() {
				selectedReqHeaderId2ReqVariantIdsMap = {};
			}

			function updateSelectedReqHeaderIds(item) {
				if (angular.isArray(item)) {
					_.forEach(item, function (data) {
						updateSelectedReqHeaderIds(data);
					});
				} else if (item) {
					if (angular.isUndefined(item.Id)) {
						return;
					}
					let found = _.find(selectedReqHeaderIds, function (id) {
						return id === item.Id;
					});
					let childrenIds = _.map(item.Children, 'Id');
					// if the item is req or co req, and is set to not check
					if (angular.isDefined(found) && found !== null && !item.isChecked) {
						// remove it from the selections
						selectedReqHeaderIds = _.filter(selectedReqHeaderIds, function (id) {
							return id !== found;
						});

						// loop through items' children
						_.forEach(item.Children, function (child) {
							if (child.Id > 0) { // if the child is a co req, set it to not check
								child.isChecked = false;
								// do the update actions deep into the child.
								updateSelectedReqHeaderIds(child);
							} else if (!child.isForPartialReqAssigned) { // if the child is a variant which is not assigned to a rfq bidder
								// set it to editable
								platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: false}]);
							}
						});
						// remove the children ids from the selections
						selectedReqHeaderIds = _.difference(selectedReqHeaderIds, childrenIds);
					} else if ((angular.isUndefined(found) || found === null) && item.isChecked && item.Id > 0) {
						addSelectedReqHeader(item);
						_.forEach(item.Children, function (child) {
							if (child.Id > 0) { // if the item is req or co req
								// set it to check
								child.isChecked = true;
								// do the update actions deep into the child.
								updateSelectedReqHeaderIds(child);
							} else if (!child.isForPartialReqAssigned) { // if the child is a variant which is not assigned to a rfq bidder
								// if the req header or co req header is checked, uncheck the specified variants
								child.isChecked = false;
								// set it to editable
								platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: true}]);
							}
						});
						// if req header or co req header is checked, remove the variants from the selections
						delete selectedReqHeaderId2ReqVariantIdsMap[item.Id];
					}
					// note: if the item is a variant which is assigned to rfq bidder, don't put it to selectedReqHeaderId2ReqVariantIdsMap.
					if (item.Id < 0 && !item.isForPartialReqAssigned) { // if item is a variant which is not assigned to a rfq bidder
						let parentReqHeader = item.reqHeader;
						if (!item.isChecked) { // if the variant is not checked
							// collect the selected variants
							let childrenSelected = item.reqHeader.Children.filter(e => {
								return e.isChecked;
							});

							if (childrenSelected && childrenSelected.length > 0) { // if there are variants selected, put them to the selections
								selectedReqHeaderId2ReqVariantIdsMap[parentReqHeader.Id] = childrenSelected.map(e => -e.Id);
							} else { // if there are no variants selected,  remove the variants from the selections
								delete selectedReqHeaderId2ReqVariantIdsMap[parentReqHeader.Id];
							}
						} else { // if variant is checked
							// add to the selections
							let selectedVariantIds = selectedReqHeaderId2ReqVariantIdsMap[parentReqHeader.Id];
							if (selectedVariantIds) {
								if (selectedVariantIds.length + 1 === parentReqHeader.Children.length) {
									delete selectedReqHeaderId2ReqVariantIdsMap[parentReqHeader.Id];
								} else {
									selectedVariantIds.push(-item.Id);
								}
							} else {
								selectedReqHeaderId2ReqVariantIdsMap[parentReqHeader.Id] = [-item.Id];
							}
						}
					}
				}
			}

			function getReqHeaderCount() {
				return readData && readData.reqHeaders && readData.reqHeaders.length;
			}

			function getSelectedReqHeaderIdsCount() {
				return getSelectedReqHeaderIds().length;
			}

			function getSelectedReqTotal() {
				let total = 0;

				if (readData) {
					readData.reqHeaders.forEach(reqHeader => {
						let children = _.filter(readData.allReqHeaders, {ReqHeaderFk: reqHeader.Id});
						if (children && children.length > 0) {
							children.forEach(child => {
								if (child.Id > 0 && child.isChecked) {
									total += child.reqTotal ?? 0;
								}
							});
						}
						if (reqHeader.isChecked) {
							total += reqHeader.reqTotal ?? 0;
						}
					});
				}
				return {
					total: total.toFixed(2),
					count: getSelectedReqHeaderIdsCount()
				};
			}

			// set data from clicking on the button
			function responseData(response, from, dialoguePrompt, reqHeaderId, isItem, hasContractItemArg) {
				isItemData = angular.isDefined(isItem) ? isItem : true;
				readData = null;
				tempReadData = null;
				isSingleReqHeader = false;
				clearSelectedReqHeaderId2ReqVariantIdsMap();
				if (response) {
					service.from = from;
					service.dialoguePrompt = dialoguePrompt;
					tempReadData = response;
					selectedReqHeaderIds = [];
					if (reqHeaderId !== null && angular.isDefined(reqHeaderId)) {
						isSingleReqHeader = true;
						selectedReqHeaderIds.push(reqHeaderId);
					}
				}
				hasContractItem = hasContractItemArg;
			}

			function getHasContractItem() {
				return hasContractItem;
			}
		}
	]);
})(angular);