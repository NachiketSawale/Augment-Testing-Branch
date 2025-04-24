(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonCreateContractWizardGridService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * Data service for wizard 'create contract' dialog grid.
	 */
	angular.module(moduleName).factory('procurementPriceComparisonCreateContractWizardGridService', [
		'globals',
		'_',
		'moment',
		'platformDataServiceFactory',
		'platformGridDomainService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonMainService',
		'basicsLookupdataLookupFilterService',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonCommonHelperService',
		'PlatformMessenger',
		function (
			globals,
			_,
			moment,
			platformDataServiceFactory,
			platformGridDomainService,
			platformRuntimeDataService,
			basicsLookupdataLookupDescriptorService,
			procurementPriceComparisonMainService,
			basicsLookupdataLookupFilterService,
			checkBidderService,
			commonHelperService,
			PlatformMessenger) {

			let contractTypeData = '';
			let selectedQuote;
			let allReqHeaders = [];
			let allQuoteRequisition = [];
			let selectedReqHeaderIds = [];
			let reqVariantInfo = null; // { ReqVariants: [], ReqItemVariants: [], ReqBoqVariants: [], RfqParialReqAssigneds: [] };
			let selectedReqHeaderId2ReqVariantIdsMap = {};

			let incorporateDataRead = function (readData, data) {
				let reqCounts = readData['QtnReqCount'] || [];
				let totals = readData['Totals'] || [];
				let baseQuotes = [];
				let changeQuotes = [];

				// add an formatted date in lookup data
				readData.Quote = readData.Quote.map(function (item) {
					item.DateQuotedFormatted = platformGridDomainService.formatter('date')(0, 0, moment.utc(item.DateQuoted), {});
					return item;
				});

				// distinct by 'QuoteHeaderId' and remove base and target quote
				readData.Main = _.uniq(readData.Main || [], 'QuoteHeaderId').filter(function (item) {
					return checkBidderService.item.isNotReference(parseInt(item.QuoteHeaderId));
				}).map(function (item) {

					// add a checkbox, req-count, grand-total column to the data
					item.IsChecked = false;
					item.ReqCount = commonHelperService.getReqCount(reqCounts, item.QuoteHeaderId);
					item.subTotal = commonHelperService.getSubTotal(totals, item.QuoteHeaderId);
					item.grandTotal = commonHelperService.getGrandTotal(readData.Quote, totals, item.BusinessPartnerId, item.QuoteVersion);
					item.Children = []; // is hierarchy now (Base quote has change quotes now)

					return item;
				});

				// rebuild tree
				_.forEach(readData.Main, function (item) {
					if (!item.CompareColumnFk) {
						baseQuotes.push(item);
					} else {
						changeQuotes.push(item);
					}
				});

				_.forEach(baseQuotes, function (base) {
					base.Children = [];
					_.forEach(changeQuotes, function (child) {
						child.Children = [];
						if (child.CompareColumnFk === base.Id) {
							child.ReqCount = commonHelperService.getReqCount(reqCounts, child.QuoteHeaderId);
							child.subTotal = commonHelperService.getSubTotal(totals, child.QuoteHeaderId);
							child.grandTotal = commonHelperService.getGrandTotal(readData.Quote, totals, child.BusinessPartnerId, child.QuoteVersion);
							base.Children.push(child);
						}
					});
				});

				// set child field 'IsCheck' readonly
				_.forEach(baseQuotes, function (base) {
					_.forEach(base.Children, function (child) {
						platformRuntimeDataService.readonly(child, [{field: 'IsChecked', readonly: true}]);
					});
				});

				// allQuoteRequisition
				allQuoteRequisition = readData['QuoteRequisition'];

				// allReqHeaders
				allReqHeaders = readData.Requisition;

				reqVariantInfo = readData.RequisitionVariantInfo && readData.RequisitionVariantInfo.length > 0 ? readData.RequisitionVariantInfo[0] : null;

				delete readData.RequisitionVariantInfo;

				// lookup data
				basicsLookupdataLookupDescriptorService.attachData(readData || {});

				return data.handleReadSucceeded(baseQuotes, data, true);
			};
			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonCreateContractWizardGridService',
				entitySelection: {},
				presenter: {
					tree: {
						parentProp: '',
						childProp: 'Children',
						incorporateDataRead: incorporateDataRead
					}
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/',
					endRead: 'quotes4wizardcreatecontract',
					usePostForRead: true,
					initReadData: function (readData) {
						readData.rfqHeaderFk = procurementPriceComparisonMainService.getIfSelectedIdElse(-1);
						readData.compareType = 3; // (1:Item; 2: Boq; 3: both)
					}
				},
				httpUpdate: {},
				httpCreate: {},
				httpDelete: {},
				isInitialSorted: false
			};
			let service = platformDataServiceFactory.createNewComplete(serviceOption).service;

			service.registerOnSelectedQuoteChanged = new PlatformMessenger();

			// get or set contractTypeData
			service.contractTypeData = function (typeData) {
				if (typeData) {
					contractTypeData = typeData;
				} else {
					return contractTypeData;
				}
			};

			// return bool, check if the current quote's requisition count greater than 1
			service.getQuoteRequisitionCount = function getQuoteRequisitionCount() {
				return false;
				// if the quote has many requisitions and user want to create a contract for each quote requisition.
				// the code below will be used to show the options.
				// return service.hasSelection() && service.getSelected().ReqCount > 1;
			};

			service.getAllReqHeaders = function () {
				if (!selectedQuote) {
					return [];
				} else {
					let requisitions = [];
					let quoteBpId = selectedQuote.BusinessPartnerId;
					if (selectedQuote.QuoteHeaderId) {
						let quoteRequisitions = _.filter(allQuoteRequisition, function (item) {
							return item.QtnHeaderFk === selectedQuote.QuoteHeaderId;
						});

						if (selectedQuote.Children && selectedQuote.Children.length > 0) {
							let children = _.filter(allQuoteRequisition, function (item) {
								return selectedQuote.Children.some(e => item.QtnHeaderFk === e.QuoteHeaderId);
							});
							quoteRequisitions = quoteRequisitions.concat(children);
						}

						angular.forEach(quoteRequisitions, function (quoteReq) {
							angular.forEach(allReqHeaders, function (item) {
								if (item.Id === quoteReq.ReqHeaderFk) {
									let req = angular.copy(item);
									req.PrcItems = _.filter(item.PrcItems, function (prcItem) {
										return prcItem.PrcHeaderFk === quoteReq.PrcHeaderFk;
									});
									requisitions.push(req);

									if (!selectedQuote.IsIdealBidder && reqVariantInfo && reqVariantInfo.ReqVariants && reqVariantInfo.ReqVariants.length > 0) {
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

											// if there are no boq items or prc items assigned to the variant, don't show it in UI.
											if ((!reqVariantInfo.ReqBoqVariants || reqVariantInfo.ReqBoqVariants.length === 0) &&
												(!reqVariantInfo.ReqItemVariants || reqVariantInfo.ReqItemVariants.length === 0)) {
												return false;
											}

											// get variants assigned to rfq bidders
											let partials = reqVariantInfo.RfqParialReqAssigneds.filter(e =>
												e.ReqHeaderFk === item.Id &&
												e.BpdBusinessPartnerFk === quoteBpId &&
												e.ReqVariantFk === variant.Id);
											variant.isForPartialReqAssigned = partials.length > 0; // mark the variant is assigned to rfq bidder
											variant.isChecked = variant.isForPartialReqAssigned; // if variant is assigned to rfq bidder, it is always checked.

											// if there arem boq items or prc items assigned to the variant, show it in UI.
											return variant.isForPartialReqAssigned && (reqVariantInfo.ReqBoqVariants.some(e => e.ReqVariantFk === variant.Id) ||
													reqVariantInfo.ReqItemVariants.some(e => e.ReqVariantFk === variant.Id));
										});

										// initialize variants
										variants.forEach(function (variant) {
											let variantReq = angular.copy(item);
											variantReq.Id = -variant.Id;
											variantReq.Code = variant.Code;
											variantReq.Description = variant.Description;
											variantReq.ReqHeaderFk = item.Id;
											variantReq.reqHeader = req;
											variantReq.isChecked = !!variant.isChecked;
											variantReq.isForPartialReqAssigned = variant.isForPartialReqAssigned;
											variantReq.PrcItems = null;

											requisitions.push(variantReq);
										});
									}
								}
							});
						});
					}

					requisitions = _.map(requisitions, function (item) {
						let subtotal = 0;
						/** @namespace item.PrcItems */
						if (!item.PrcItems) {
							item.reqTotal = 0;
							return item;
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
						return item;
					});
					return requisitions;
				}
			};

			service.setSelectedQuote = function (selectedItem) {
				selectedQuote = selectedItem;
			};

			service.getSelectedReqHeaderIds = function (value) {
				if (value) {
					selectedReqHeaderIds = value;
				}
				let list = selectedReqHeaderIds ? selectedReqHeaderIds.filter(e => e > 0) : [];
				if (selectedReqHeaderId2ReqVariantIdsMap) {
					for (let prop in selectedReqHeaderId2ReqVariantIdsMap) {
						list.push(prop);
					}
					list = _.uniq(list);
				}
				return list;
			};

			service.addSelectedReqHeader = function (value) {
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
			};

			service.getSelectedReqHeaderId2ReqVariantIdsMap = function () {
				return selectedReqHeaderId2ReqVariantIdsMap;
			};

			service.clearSelectedReqHeaderId2ReqVariantIdsMap = function () {
				selectedReqHeaderId2ReqVariantIdsMap = {};
			}

			service.updateSelectedReqHeaderIds = function (item) {
				if (angular.isArray(item)) {
					_.forEach(item, function (data) {
						service.updateSelectedReqHeaderIds(data);
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
					if (angular.isDefined(found) && found !== null && !item.isChecked && item.Id > 0) {
						// remove it from the selections
						selectedReqHeaderIds = _.filter(selectedReqHeaderIds, function (id) {
							return id !== found;
						});

						// loop through items' children
						_.forEach(item.Children, function (child) {
							if (child.Id > 0) { // if the child is a co req, set it to not check
								child.isChecked = false;
								// do the update actions deep into the child.
								service.updateSelectedReqHeaderIds(child);
							} else if (!child.isForPartialReqAssigned) { // if the child is a variant which is not assigned to a rfq bidder
								// set it to editable
								platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: false}]);
							}
						});
						// remove the children ids from the selections
						selectedReqHeaderIds = _.difference(selectedReqHeaderIds, childrenIds);
					} else if ((angular.isUndefined(found) || found === null) && item.isChecked && item.Id > 0) {
						service.addSelectedReqHeader(item);
						_.forEach(item.Children, function (child) {
							if (child.Id > 0) { // if the item is req or co req
								// set it to check
								child.isChecked = true;
								// do the update actions deep into the child.
								service.updateSelectedReqHeaderIds(child);
							} else if (!child.isForPartialReqAssigned) { // if the child is a variant which is not assigned to a rfq bidder
								// if the req header or co req header is checked, uncheck the specified variants
								child.isChecked = false;
								// set it to readonly
								platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: true}]);
							}
						});
						// if req header or co req header is checked, remove the variants from the selections
						delete selectedReqHeaderId2ReqVariantIdsMap[item.Id];
					}
					// note: if the item is a variant which is assigned to rfq bidder, don't put it to selectedReqHeaderId2ReqVariantIdsMap.
					if (item.Id < 0 && !item.isForPartialReqAssigned) { // if item is a variant which is not assigned to a rfq bidder
						let parentReqHeader = item.reqHeader;
						if (!item.isChecked) {  // if the variant is not checked
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
			};

			service.getSelectedReqHeaderIdsCount = function () {
				return service.getSelectedReqHeaderIds().length;
			};

			service.resetRequisitionGrid = function () {
				selectedQuote = null;
				allReqHeaders = [];
				allQuoteRequisition = [];
			};

			basicsLookupdataLookupFilterService.registerFilter([{
				key: 'procurement-pricecomparison-quote-version-lookup-filter',
				serverKey: 'procurement-pricecomparison-quote-version-lookup-filter',
				serverSide: true,
				fn: function () {
					// only get the selected quote's rfq's quotes
					let quote = _.find(basicsLookupdataLookupDescriptorService.getData('Quote'), {Id: service.getSelected().QuoteHeaderId});
					if (quote) {
						return {
							RfqHeaderFk: quote.RfqHeaderFk,
							BusinessPartnerFk: quote.BusinessPartnerFk
						};
					} else {
						return {};
					}
				}
			}]);

			return service;
		}
	]);
})(angular);