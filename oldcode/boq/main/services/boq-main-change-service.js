/**
 * Created by bh on 23.04.2015.
 */
(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainChangeService
	 * @function
	 *
	 * @description
	 * boqMainChangeService is the service that holds functions that react on the changing of entities, i.e by adjusting correspronsing items, doing calculations ans so forth
	 */
	angular.module(moduleName).factory('boqMainChangeService', ['$q', '$http', '$translate', '$injector', 'platformModalFormConfigService','boqMainProjectChangeService', 'boqMainSelectGroupsService', 'boqMainItemTypes',
		function ($q, $http, $translate, $injector, platformModalFormConfigService, boqMainProjectChangeService, boqMainSelectGroupsService, boqMainItemTypes) {

			// The instance of the change service - to be filled with functionality below
			var service = {};
			var currentBoqPriceConditionService = null;

			/**
			 * @ngdoc function
			 * @name reactOnChangeOfBoqItem
			 * @function
			 * @methodOf boqMainChangeService
			 * @description This function handles reaction of the given changed boq item adressed by the given property name
			 * @param {Object} boqItem that's been changed
			 * @param {String} propertyName of the property that's been changed
			 * @param {Object} boqMainService that handles the neccessary adjustments
			 * @param {Object} boqMainCommonService that also handles the neccessary adjustments
			 * @param {Boolean} skipDispatching2SplitQuantity triggers skipping of dispatching of quantiy changes to split quantity
			 * @param {Boolean} isFromBulkEditor triggers from bulk edit
			 */
			/* jshint -W074 */ // function's cyclomatic complexity is too high
			/* jshint -W071 */ // this function hat too many statements
			service.reactOnChangeOfBoqItem = function reactOnChangeOfBoqItem(boqItem, propertyName, boqMainService, boqMainCommonService, skipDispatching2SplitQuantity, isFromBulkEditor) {

				var basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
				var boqMainLineTypes = $injector.get('boqMainLineTypes');
				var boqMainItemTypes2 = $injector.get('boqMainItemTypes2');
				var currentSpecification = null;
				var parentItem = null;
				var priceChanged = false;
				var calcChildren = false;
				var briefInfoChanged = false;
				var formattedReference = '';
				var hasFinalpriceOrHours = false;
				var boqStructure = null;
				var boqTree = null;
				var vatPercent = 0;
				var oldPrice = 0;
				var oldPriceOc = 0;
				var baseItem = null;
				var modifiedItemsByGroupService = [];
				var modifiedItemsForSettingBase = [];

				function getSpecificationFromMaterialAsync(material) {
					var ret = material.SpecificationInfo.Translated;

					if (material.BasBlobsSpecificationFk) {
						return $http.get(globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + material.BasBlobsSpecificationFk).then(function(response) {
							if (response.data) {
								ret = response.data.Content;
							}
							return ret;
						}).catch(ret => {
							return $q.when(ret);
						});
					} else {
						return $q.when(ret);
					}
				}

				function reactOnChangeOfBriefInfo(boqItem) {
					boqMainService.boqItemBriefChanged.fire(boqItem);

					// The following behavior is only suitable in GAEB mode, i.e. not in the free mode
					if (boqMainService.isGaebBoq()) {
						// When changing the outline specification we reset the possibly set foreign keys to a possibly related wic boq item
						boqItem.BoqItemWicBoqFk = null;
						boqItem.BoqItemWicItemFk = null;
						boqItem.WicNumber = '';
						boqMainService.fireItemModified(boqItem);
					}
				}

				if (angular.isDefined(boqItem) && (boqItem !== null) && angular.isDefined(propertyName) &&
					(propertyName !== null) && angular.isDefined(boqMainService) && (boqMainService !== null) &&
					angular.isDefined(boqMainCommonService) && (boqMainCommonService !== null)) {

					boqStructure = boqMainService.getStructure();

					if (propertyName === 'Reference') {

						// Do some formatting of the entered reference number, i.e. fill with leading spaces or zeros and
						// add final dot if missing or neccessary.
						formattedReference = boqMainService.getFormattedReferenceNumber(boqItem, boqItem.Reference);

						if (boqMainService.isReferenceValidForThisItem(formattedReference, boqItem)) {
							boqItem.Reference = formattedReference;

							// If this boq is linked to a base boq, set a proper link to the corresponding base boq item
							if (!boqMainService.hasItemBeenSavedYet(boqItem)) {
								// If the item isn't saved yet, we can change the base boq link by changing the reference number.
								boqMainService.setBaseBoqLinkViaReferenceNumber(boqItem, boqItem.Reference).then(function () {
									boqMainService.calcItemsPriceHoursNew(boqItem, true, true, propertyName);
									boqMainService.gridRefresh();
								});
							}

							// If boqItem is a parent item adjust the child item references.
							// For the watch is only set on  the current item, changing the child item references should not lead to a recursive call.
							if (!boqMainCommonService.isRoot(boqItem) || !boqMainCommonService.isTextElementWithoutReference(boqItem)) {
								boqMainService.adjustToParentPartOfReference(boqItem);
							}

							// Changes of the reference number force the siblings to be reordered
							boqMainService.resortSiblings(boqItem, true);
						}
					}
					else if (propertyName === 'BoqLineTypeFk') {
						// Because the line type has changed the corresponding image has to be set
						boqMainCommonService.insertImages(boqItem);

						hasFinalpriceOrHours = (boqItem.Finalprice !== 0) || (boqItem.FinalpriceOc !== 0) || (boqItem.Hours !== 0);

						// After changing the line type various reactions are neccessary
						boqMainService.onLineTypeChanged(boqItem);

						boqMainService.boqItemStateChanged.fire(boqItem);

						var boqMainWic2AssemblyService = $injector.get('boqMainWic2AssemblyService');
						boqMainWic2AssemblyService.onBoqItemLineTypeChanged.fire(boqItem);

						if (hasFinalpriceOrHours && (boqItem.Finalprice === 0) || (boqItem.FinalpriceOc === 0) || (boqItem.Hours === 0)) {
							// Summable values have been reset -> recalculate parent chain.
							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName); //
						}

					}
					else if (propertyName === 'BoqDivisionTypeFk' && boqMainService.isFreeBoq()) {
						// Because the division type has changed the child division types have to be adjusted
						boqMainService.adjustToParentDivisionType(boqItem);
						boqMainService.gridRefresh();

					}
					else if (propertyName === 'BoqRevenueTypeFk') {
						boqMainService.getCachedRevenueTypeAsync({'Id':boqItem.BoqRevenueTypeFk}).then(function(revenueType) {
							boqMainService.updateRevenuePercentage(boqItem, revenueType);
						});
					}
					else if (propertyName === 'BriefInfo') {
						reactOnChangeOfBriefInfo(boqItem);
					}
					else if (propertyName === 'IsDisabled' || propertyName === 'IsNotApplicable' || propertyName === 'BasItemType85Fk') {
						let calcAndRefresh = true;
						if (!boqMainCommonService.isTextElementWithoutReference(boqItem)) {
							if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
								// To avoid irritations we remove possibly existing discounts and lumpsum prices
								if (propertyName === 'IsDisabled') {
									boqItem.Discount = 0;
									boqItem.DiscountOc = 0;
									boqItem.DiscountPercentIt = 0;
									boqItem.IsLumpsum = false;
									boqItem.LumpsumPrice = 0;
									boqItem.LumpsumPriceOc = 0;

									let setIsDisabledRecursivelyVisitorObject = {
										visitBoqItemFn: function setIsDisabledRecursively(parentBoqItem, childBoqItem) {
										   childBoqItem.IsDisabled = boqItem.IsDisabled;
										   if (boqMainCommonService.isDivisionOrRoot(childBoqItem)) {
											   childBoqItem.Discount = 0;
											   childBoqItem.DiscountOc = 0;
											   childBoqItem.DiscountPercentIt = 0;
											   childBoqItem.IsLumpsum = false;
											   childBoqItem.LumpsumPrice = 0;
											   childBoqItem.LumpsumPriceOc = 0;
										   }
										   boqMainService.markItemAsModified(childBoqItem);
										   return true;
										}
									};
									boqMainService.visitBoqItemRecursively(boqItem, setIsDisabledRecursivelyVisitorObject);
									boqMainService.gridRefresh();
								}
							} else if (propertyName === 'BasItemType85Fk') {
								let oldIsNotApplicable = boqItem.IsNotApplicable;
								boqItem.IsNotApplicable = boqItem.BasItemType85Fk === 1;
								calcAndRefresh = oldIsNotApplicable !== boqItem.IsNotApplicable;
							} else if (propertyName === 'IsNotApplicable' && !boqItem.IsNotApplicable && boqItem.BasItemType85Fk === 1) {
								// Reset BasItemTypeFk to null for the state of IsNotApplicable == false and BasItemType85Fk == 1 is not allowed
								boqItem.BasItemType85Fk = null;
							}

							if (calcAndRefresh) {
								boqMainService.calcItemsPriceHoursNew(boqItem, true, true, propertyName);
								boqMainService.gridRefresh();
							}
						}
					}
					else if (propertyName === 'RecordingLevel') {
						let setRecordingLevelRecursivelyVisitorObject = {
							visitBoqItemFn: function setRecordingLevelRecursively(parentItem, myBoqItem/* , lineType, level, visitorObject */) {

								if (!boqMainCommonService.isTextElementWithoutReference(myBoqItem)) {
									myBoqItem.RecordingLevel = boqItem.RecordingLevel;
									boqMainService.markItemAsModified(myBoqItem);
								}

								return true;
							}
						};

						boqMainService.visitBoqItemRecursively(boqItem, setRecordingLevelRecursivelyVisitorObject);
						boqMainService.gridRefresh();
					}
					else if (propertyName === 'PrjChangeFk') {
						boqMainProjectChangeService.propertyChanged(boqMainService, boqItem, propertyName);
					}
					else if (boqMainCommonService.isItem(boqItem)) {
						oldPrice = boqItem.Price;
						oldPriceOc = boqItem.PriceOc;

						if (['Quantity', 'HoursUnit', 'TotalQuantity', 'TotalPrice', 'PercentageQuantity', 'CumulativePercentage', 'ItemTotalEditable', 'ItemTotalEditableOc', 'ExSalesRejectedQuantity', 'TotalRejectedQuantity', 'BasUomFk', 'QuantityAdj', 'Factor', 'FactorDetail', 'QuantityDetail', 'NotSubmitted', 'Included', 'IsLumpsum'].includes(propertyName)) {

							// Special case: When Uom is set to LSUM we set the Quantity to 1
							if (propertyName === 'BasUomFk') {
								var uom = basicsLookupdataLookupDescriptorService.getLookupItem('uom', boqItem.BasUomFk);
								if (angular.isUndefined(uom) || uom === null) {
									return;
								}

								// In case Uom ist set to LSUM we set the quantity to 1
								if (uom.Unit === 'LSUM') {
									boqItem.Quantity = 1.0;
									propertyName = 'Quantity'; // Done to trigger behavior for changed price
								}
							}

							if (propertyName === 'IsLumpsum') {
								if (boqItem.IsLumpsum){
									var allUoms = basicsLookupdataLookupDescriptorService.getData('uom');
									if (!_.isArray(allUoms) && allUoms.length === 0) {
										return;
									}

									var lumpSumUoms = _.filter(allUoms, function (item){
										return item.UomTypeFk === 8; // 8 means lumpsum type
									});

									if (!_.isArray(lumpSumUoms) && lumpSumUoms.length === 0) {
										return;
									} else {
										if(!_.isNumber(boqItem.BasUomFk) || boqItem.BasUomFk === 0) {
											boqItem.BasUomFk = lumpSumUoms[0].Id;
										}
										boqItem.Quantity = 1.0;
										propertyName = 'Quantity';
									}
								}
							}

							if (['NotSubmitted', 'Included'].includes(propertyName)) {

								if (_.isBoolean(boqItem['Reset_' + propertyName]) && boqItem['Reset_' + propertyName]) {
									boqItem[propertyName] = false;
									return;
								} else {
									boqItem.Price = 0;
									boqItem.PriceOc = 0;
									propertyName = 'Price'; // Done to trigger behavior for changed quantity
									boqItem['Reset_' + propertyName] = undefined;
								}
							}

							if (propertyName === 'Factor') {
								boqItem.FactorDetail = boqItem.Factor;
							}

							if (propertyName === 'Quantity') {
								if (boqItem._originQuantity===boqItem.QuantityAdj || boqItem.QuantityAdj===0) {
									boqItem.QuantityAdj       = boqItem.Quantity;
									boqItem.QuantityAdjDetail = boqItem.QuantityAdj;
									dispatchQuantity(boqItem, true);
								}
								delete boqItem._originQuantity;
							}

							if (propertyName === 'QuantityAdj') {
								boqItem.QuantityAdjDetail = boqItem.QuantityAdj;
							}

							if (Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity') && ['Quantity', 'TotalQuantity', 'TotalPrice', 'PercentageQuantity', 'CumulativePercentage', 'ItemTotalEditable', 'ItemTotalEditableOc', 'ExSalesRejectedQuantity', 'TotalRejectedQuantity', 'QuantityDetail'].includes(propertyName)) {
								if (propertyName === 'Quantity' || propertyName === 'QuantityDetail') {
									boqMainService.calcDependantValues(boqItem, 'Quantity');
								} else if (propertyName === 'ExSalesRejectedQuantity') {
									boqMainService.calcTotalRejectedQuantity(boqItem);
								} else if (_.isFunction(boqMainService['calc' + propertyName])) {
									boqMainService['calc' + propertyName](boqItem, true);
								}

								// dispatch changed quantity
								if (boqItem.HasSplitQuantities && !skipDispatching2SplitQuantity) {
									dispatchQuantity(boqItem);
								}
							} else if (propertyName === 'Quantity' && boqItem.HasSplitQuantities) {

								if (!skipDispatching2SplitQuantity) {
									dispatchQuantity(boqItem);
								}
							}

							if (propertyName === 'QuantityAdj' && boqItem.HasSplitQuantities && !skipDispatching2SplitQuantity) {
								dispatchQuantity(boqItem, true);
							}

							if (propertyName === 'Quantity' || propertyName === 'QuantityDetail') {
								boqItem.QuantityDetail = propertyName === 'Quantity' ? boqItem.Quantity : boqItem.QuantityDetail;
								// Todo cheni,Fixed ALM 143590:move the recalculate price condition logic to data validation
								// boqMainService.boqItemQuantityChanged.fire(boqItem);
							}

							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
						} else if (propertyName === 'Correction') {

							// First do conversion from hc 2 oc
							boqItem.CorrectionOc = boqItem.Correction * boqMainService.getCurrentExchangeRate();

							if ((boqItem.Correction + boqItem.Cost) !== boqItem.Price) {
								// Only do the following calculation if necessary
								boqItem.Price = boqItem.Correction + boqItem.Cost;
								boqItem.PriceOc = boqItem.CorrectionOc + boqItem.CostOc;
								boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
							}
						}
						else if (propertyName === 'CorrectionOc') {

							// First do conversion from oc 2 hc
							boqItem.Correction = boqItem.CorrectionOc / boqMainService.getCurrentExchangeRate();

							if ((boqItem.CorrectionOc + boqItem.CostOc) !== boqItem.PriceOc) {
								// Only do the following calculation if necessary
								boqItem.Price = boqItem.Correction + boqItem.Cost;
								boqItem.PriceOc = boqItem.CorrectionOc + boqItem.CostOc;
								boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
							}
						}
						else if (propertyName === 'Price' || propertyName === 'DiscountPercent' || propertyName === 'Pricegross' || ['ColVal1', 'ColVal2', 'ColVal3', 'ColVal4', 'ColVal5'].includes(propertyName)) {
							if (propertyName === 'Pricegross' ) {
								boqMainService.calPriceOrPriceOcByGross(boqItem, true);
							}

							// First do conversion from hc 2 oc
							boqItem.PriceOc = boqItem.Price * boqMainService.getCurrentExchangeRate();

							if ((boqItem.Price - boqItem.Cost) !== boqItem.Correction) {
								// Only do the following calculation if necessary
								boqItem.Correction = boqItem.Price - boqItem.Cost;
								boqItem.CorrectionOc = boqItem.PriceOc - boqItem.CostOc;
							}

							if (Object.prototype.hasOwnProperty.call(boqItem, 'PreviousPrice')) {
								boqMainService.calcPreviousPrice(boqItem);
							}

							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);

							if (boqItem.IsUrb && (propertyName === 'Price')) {
								// The price has changed so the according urbs have to be recalculated
								boqMainService.recalcUrbs(boqItem);
							}
						}
						else if (propertyName === 'PriceOc' || propertyName === 'PricegrossOc') {
							if (propertyName === 'PricegrossOc') {
								boqMainService.calPriceOrPriceOcByGross(boqItem, false);
							}

							// First do conversion from oc 2 hc
							boqItem.Price = boqItem.PriceOc / boqMainService.getCurrentExchangeRate();

							if ((boqItem.PriceOc - boqItem.CostOc) !== boqItem.CorrectionOc) {
								// Only do the following calculation if necessary
								boqItem.Correction = boqItem.Price - boqItem.Cost;
								boqItem.CorrectionOc = boqItem.PriceOc - boqItem.CostOc;
							}

							if (Object.prototype.hasOwnProperty.call(boqItem, 'PreviousPrice')) {
								boqMainService.calcPreviousPrice(boqItem);
							}

							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);

							if (boqItem.IsUrb && (propertyName === 'PriceOc')) {
								// The price has changed so the according urbs have to be recalculated
								boqMainService.recalcUrbs(boqItem);
							}
						}
						else if (propertyName === 'Discount') {
							// First do conversion from hc 2 oc
							boqItem.DiscountOc = boqItem.Discount * boqMainService.getCurrentExchangeRate();

							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
						}
						else if (propertyName === 'DiscountOc') {
							// First do conversion from oc 2 hc
							boqItem.Discount = boqItem.DiscountOc / boqMainService.getCurrentExchangeRate();

							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
						}
						else if (['VobDirectCostPerUnit','VobDirectCostPerUnitOc'].includes(propertyName)) {
							const exchangeRate = boqMainService.getCurrentExchangeRate();
							if (propertyName === 'VobDirectCostPerUnit') { boqItem.VobDirectCostPerUnitOc = boqMainService.roundValue(boqItem.VobDirectCostPerUnit   * exchangeRate, 'VobDirectCostPerUnitOc'); }
							else                                         { boqItem.VobDirectCostPerUnit   = boqMainService.roundValue(boqItem.VobDirectCostPerUnitOc / exchangeRate, 'VobDirectCostPerUnit'); }
						}
						else if (propertyName === 'BasItemTypeFk') {
							if (boqItem.BasItemTypeFk === boqMainItemTypes.priceRequest) {
								boqItem.Quantity    = 1;
								boqItem.QuantityAdj = 1;
							}
							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
						}
						else if (/^Urb[1-6]$/.test(propertyName)) { // Urb1 - Urb6

							if (!boqItem.IsUrb && boqStructure && boqStructure.CalcFromUrb) {
								boqItem.IsUrb = true;
								boqMainService.markItemAsModified(boqItem);
							}

							// First do conversion from hc 2 oc
							boqItem.Urb1Oc = boqItem.Urb1 * boqMainService.getCurrentExchangeRate();
							boqItem.Urb2Oc = boqItem.Urb2 * boqMainService.getCurrentExchangeRate();
							boqItem.Urb3Oc = boqItem.Urb3 * boqMainService.getCurrentExchangeRate();
							boqItem.Urb4Oc = boqItem.Urb4 * boqMainService.getCurrentExchangeRate();
							boqItem.Urb5Oc = boqItem.Urb5 * boqMainService.getCurrentExchangeRate();
							boqItem.Urb6Oc = boqItem.Urb6 * boqMainService.getCurrentExchangeRate();

							boqMainService.calcUrb(boqItem);
						}
						else if (/^Urb[1-6]Oc$/.test(propertyName)) { // Urb1Oc - Urb6Oc

							if (!boqItem.IsUrb && boqStructure && boqStructure.CalcFromUrb) {
								boqItem.IsUrb = true;
								boqMainService.markItemAsModified(boqItem);
							}

							// First do conversion from oc 2 hc
							boqItem.Urb1 = boqItem.Urb1Oc / boqMainService.getCurrentExchangeRate();
							boqItem.Urb2 = boqItem.Urb2Oc / boqMainService.getCurrentExchangeRate();
							boqItem.Urb3 = boqItem.Urb3Oc / boqMainService.getCurrentExchangeRate();
							boqItem.Urb4 = boqItem.Urb4Oc / boqMainService.getCurrentExchangeRate();
							boqItem.Urb5 = boqItem.Urb5Oc / boqMainService.getCurrentExchangeRate();
							boqItem.Urb6 = boqItem.Urb6Oc / boqMainService.getCurrentExchangeRate();

							boqMainService.calcUrb(boqItem);
						}
						else if (propertyName === 'IsUrb') {
							boqMainService.recalcUrbs(boqItem);
						}
						else if (propertyName === 'IsSurcharged') {
							boqMainService.updateSiblingSurchargeItems(boqItem, true);
						}
						else if (propertyName === 'MdcMaterialFk') {
							// Hint: We use the getLookupItem function of the basicsLookupdataLookupDescriptorService, because it does its work synchronously
							// accessing the underlying cache in which the looked up material is expected to be, because the lookup was called before to select the material.
							// Using the asynchronous loadItemByKey leads to problems between the gridRefresh and a destroyed editor of the next selected cell.
							var material = basicsLookupdataLookupDescriptorService.getLookupItem('MaterialCommodity', boqItem.MdcMaterialFk);
							if (!material) {
								return;
							}
							// Copy specific properties from material to boq item
							boqItem.Price = material.EstimatePrice;
							boqItem.PriceOc = material.EstimatePrice;
							boqItem.BasUomFk = material.BasUomFk ? material.BasUomFk : material.UomFk ? material.UomFk : boqItem.BasUomFk;
							briefInfoChanged = boqItem.BriefInfo !== material.DescriptionInfo;
							boqItem.BriefInfo.Description = material.DescriptionInfo.Description;
							boqItem.BriefInfo.Translated = material.DescriptionInfo.Translated;
							boqItem.BriefInfo.Modified = true;
							if (briefInfoChanged) {
								reactOnChangeOfBriefInfo(boqItem);
							}

							let boqMainServiceContainer = boqMainService.getServiceContainer();
							let boqMainServiceContainerData = _.isObject(boqMainServiceContainer) ? boqMainServiceContainer.data : null;
							if(_.isObject(boqMainServiceContainerData)&&!isFromBulkEditor) {

								let loadSpecificationPromise = getSpecificationFromMaterialAsync(material).then(function (result) {
									// The blob handling is a little bit tricky
									// Check if the boqItem has already a blob assigned
									if (boqItem.BasBlobsSpecificationFk) {
										// Only copy the content of the material specification
										currentSpecification = boqMainService.getCurrentSpecification();
										/* jshint -W073 */ // blocks are nested too deeply
										if (currentSpecification) {
											currentSpecification.Content = result;
											boqMainService.setSpecificationAsModifiedByItem(currentSpecification,boqItem);
										}
									} else {
										// No blob assigned -> copy the given material specification to a new boq item blob

										// By setting version and id of blob to zero we force creating a new blob object
										currentSpecification = {};
										currentSpecification.Content = result;
										currentSpecification.Id = 0;
										currentSpecification.Version = 0;
										boqMainService.setSpecificationAsModifiedByItem(currentSpecification,boqItem);
									}
									boqMainService.markItemAsModified(boqItem);
									boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
								});

								boqMainServiceContainerData.registerAsyncCall(loadSpecificationPromise);
							}

							if (boqItem.IsUrb) {
								// The price has changed so the according urbs have to be recalculated
								boqMainService.recalcUrbs(boqItem);
							}

							if (material.PrcPriceconditionFk) {
								if (isFromBulkEditor) {
									service.getCurrentBoqMainValidationService(boqMainService).validatePrcPriceConditionFkForBulkConfig(boqItem, material.PrcPriceconditionFk, 'PrcPriceConditionFk', false);
								} else {
									boqItem.PrcPriceConditionFk = boqItem.PrcPriceconditionFk = material.PrcPriceconditionFk||(boqItem.PrcPriceConditionFk || boqItem.PrcPriceconditionFk);
									let priceConditionDataService = $injector.get('boqMainPriceConditionCommonService').getPriceConditionServiceByModule(boqMainService.getModuleName());
									if (priceConditionDataService) {
										boqMainService.priceConditionSelectionChanged.fire(material.PrcPriceconditionFk, boqItem);
									}
								}
							}

							boqMainService.gridRefresh();
						}
						else if (propertyName === 'IsLeadDescription') {
							if (boqMainCommonService.isLeadDescription(boqItem)) {

								boqMainService.markItemAsModified(boqItem);

								// To ensure that the new created sub description is corretly bound to the design description
								boqMainService.setSelected(boqItem).then(function () {
									// Create a sub description as first child.
									// The first subdescription in a row gets the parent lead description as predecessor.
									// This is triggered by the last flag set to true.
									boqMainService.createNewItemByLineType(boqMainLineTypes.subDescription, true, true);
								});
							}

							boqMainService.gridRefresh();
						} else if (propertyName === 'IsUrFromSd' && boqMainCommonService.isLeadDescription(boqItem)) {

							// React on the fact that the unit rate of the subdescriptions is to be considered
							boqMainService.markItemAsModified(boqItem);
							boqMainService.calcParentChain(boqItem, false, false, propertyName);
							boqMainService.fireItemModified(boqItem);
						}
						else if (propertyName === 'MdcTaxCodeFk') {
							if (boqMainService.doCalculateOverGross()) {
								boqMainService.calPriceOrPriceOcByGross(boqItem, true);
							}
							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
						}
						else if (propertyName === 'PrcStructureFk') {
							if (boqItem.PrcStructureFk) {
								$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/list?mainItemId=' + boqItem.PrcStructureFk).then(function(response) {
									if (response.data && response.data.Main.length>0) {
										boqItem.ExSalesTaxGroupFk = response.data.Main[0].MdcSalesTaxGroupFk;
										boqMainService.markItemAsModified(boqItem);
									}
								});
							}
						}
						else if (propertyName === 'BudgetPerUnit' || propertyName === 'BudgetTotal') {
							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
						} else if (propertyName === 'BudgetFixedUnit') {
							if (boqItem.BudgetFixedUnit && boqItem.BudgetFixedTotal) {
								boqItem.BudgetFixedTotal = false;
								boqMainService.markItemAsModified(boqItem);
							}
							boqMainService.calcParentChain(boqItem, false, false, propertyName);
						} else if (propertyName === 'BudgetFixedTotal') {
							if (boqItem.BudgetFixedUnit && boqItem.BudgetFixedTotal) {
								boqItem.BudgetFixedUnit = false;
								boqMainService.markItemAsModified(boqItem);
							}
							boqMainService.calcParentChain(boqItem, true, false, propertyName);
						}
					}
					else if (boqMainCommonService.isSurchargeItem(boqItem)) {
						if (propertyName === 'Price' || ['ColVal1', 'ColVal2', 'ColVal3', 'ColVal4', 'ColVal5'].includes(propertyName)) {
							boqItem.PriceOc = boqItem.Price;
							// In the case of surcharge items the 'Price' property is used to enter a percent value for calculating the surcharge from the surcharge base.
							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
						}

						if (propertyName === 'PriceOc') {
							boqItem.Price = boqItem.PriceOc;
							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
						}

						if (propertyName === 'Quantity' && boqMainCommonService.isSurchargeItem4(boqItem)) {
							boqMainService.calcDependantValues(boqItem, propertyName);
							boqMainService.calcItemsPriceHoursNew(boqItem, true, false, propertyName);
						}
					}
					else if (boqMainCommonService.isSubDescription(boqItem)) {
						parentItem = boqMainService.getParentOf(boqItem);

						if (boqItem.IsUrb && /^Urb[1-6]$/.test(propertyName)) { // Urb1 - Urb6
							boqMainService.calcUrb(boqItem, true);
							priceChanged = true; // The upper calcUrb call usually changes to Price property
						} else if (propertyName === 'IsUrb') {
							boqMainService.recalcUrbs(boqItem);
						}

						if ((propertyName === 'Quantity' || propertyName === 'Price' || priceChanged) && parentItem.IsUrFromSd) {
							// Update the price of the parent lead description item
							boqMainService.markItemAsModified(boqItem);
							boqMainService.calcParentChain(parentItem, false, false, propertyName);
							boqMainService.boqItemPriceChanged.fire(parentItem);
						}
					}
					else if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
						if (propertyName === 'BasItemTypeFk' || propertyName === 'Discount' || propertyName === 'DiscountOc' || propertyName === 'DiscountPercentIt' || propertyName === 'MdcTaxCodeFk' || propertyName === 'LumpsumPrice' || propertyName === 'LumpsumPriceOc') {

							if (propertyName === 'Discount') {
								// Absolute discount set -> reset discount percent
								boqItem.DiscountPercentIt = 0;
								boqItem.DiscountOc = boqItem.Discount * boqMainService.getCurrentExchangeRate();
							} else if (propertyName === 'DiscountOc') {
								// Absolute discount set -> reset discount percent
								boqItem.DiscountPercentIt = 0;
								boqItem.Discount = boqItem.DiscountOc / boqMainService.getCurrentExchangeRate();
							} else if (propertyName === 'DiscountPercentIt') {
								// Discount percent set -> reset absolute discount
								boqItem.Discount = 0;
								boqItem.DiscountOc = 0;

							}

							if (propertyName === 'LumpsumPrice') {
								// LumpsumPrice set -> adjust corresponding LumpsumPriceOc
								boqItem.LumpsumPriceOc = boqItem.LumpsumPrice * boqMainService.getCurrentExchangeRate();
							} else if (propertyName === 'LumpsumPriceOc') {
								// LumpsumPriceOc set -> adjust corresponding LumpsumPrice
								boqItem.LumpsumPrice = boqItem.LumpsumPriceOc / boqMainService.getCurrentExchangeRate();
							} else if (!['Discount', 'DiscountOc', 'DiscountPercentIt'].includes(propertyName)) {
								calcChildren = true;
							}

							if (['LumpsumPrice', 'LumpsumPriceOc'].includes(propertyName)) {
								if (boqItem.IsLumpsum) {
									vatPercent = boqMainService.getVatPercentForBoqItem(boqItem);
									boqItem.Finalprice = boqItem.LumpsumPrice;
									boqItem.FinalpriceOc = boqItem.LumpsumPriceOc;
									boqItem.Finalgross = boqItem.Finalprice * (100 + vatPercent) / 100;
									boqItem.FinalgrossOc = boqItem.FinalpriceOc * (100 + vatPercent) / 100;
								}
							}

							boqMainService.markItemAsModified(boqItem);
							boqMainService.calcParentChain(boqItem, calcChildren, false, propertyName); // By giving the flag true, we assure that the children of boqItem are calculated first, before calculating up the parent chain.
							boqMainService.gridRefresh();
						} else if (propertyName === 'IsLumpsum') {
							if (boqItem.IsLumpsum) {
								// As default for the lumpsum price we take the current value of the finalprice
								boqItem.LumpsumPrice = boqItem.Finalprice;
								boqItem.LumpsumPriceOc = boqItem.FinalpriceOc;
							} else {
								// Reset the lumpsum price to zero and recalulate the changed item and its parent chain.
								boqItem.LumpsumPrice = 0;
								boqItem.LumpsumPriceOc = 0;
							}

							boqMainService.markItemAsModified(boqItem);
							boqMainService.calcParentChain(boqItem, true, false, propertyName); // By giving the flag true, we assure that the children of boqItem are calculated first, before calculating up the parent chain.
							boqMainService.gridRefresh();
						} else if (propertyName === 'BudgetTotal') {
							boqMainService.calcParentChain(boqItem, false, false, propertyName);
						} else if (propertyName === 'BudgetFixedTotal') {
							boqMainService.calcParentChain(boqItem, true, false, propertyName);
						} else if (propertyName === 'PercentageQuantity' || propertyName === 'CumulativePercentage') {
							let oldValue = null;
							if (_.isNumber(boqItem['OldValueOf_' + propertyName])) {
								oldValue = boqItem['OldValueOf_' + propertyName];
							}

							if(oldValue !== boqItem[propertyName]) {
								if (propertyName === 'PercentageQuantity') {
									boqMainService.calcPercentageQuantity(boqItem, true);
								} else if (propertyName === 'CumulativePercentage') {
									boqMainService.calcCumulativePercentage(boqItem, true);
								}

								boqMainService.calcParentChain(boqItem, true, false, propertyName);
								boqMainService.gridRefresh();
							}

							delete boqItem['OldValueOf_' + propertyName];
						}
					}

					if (propertyName==='AGN' && !boqItem.IsCrbBoq && !boqItem.IsOenBoq) {

						boqTree = boqMainService.getTree()[0];

						if (boqItem.AGN === null || boqItem.AGN === '') {
							modifiedItemsByGroupService = boqMainSelectGroupsService.setItemType(boqTree, boqItem, 1);
							boqItem.AAN = null;

							if (!boqMainSelectGroupsService.hasSelectedItems(boqTree, boqItem.AGN)) {
								baseItem = boqMainSelectGroupsService.getBaseItem(boqTree, boqItem.AGN);
								if (baseItem) {
									modifiedItemsForSettingBase = boqMainSelectGroupsService.setSelected(boqTree, baseItem);
									boqMainSelectGroupsService.merge2ModifiedItems(modifiedItemsForSettingBase, modifiedItemsByGroupService);
								}
							}
						}
						else if (boqItem.AAN === null || boqItem.AAN === '') {
							var p = {};
							p.maxAAN = -1;
							p.AGN = boqItem.AGN;
							boqMainSelectGroupsService.getMaxAAN(boqTree, p);
							boqItem.AAN = (parseInt(p.maxAAN)+1).toString();

							if (boqItem.AAN === 0) {
								modifiedItemsByGroupService = boqMainSelectGroupsService.setItemType(boqTree, boqItem, 2, true);
							} else {
								modifiedItemsByGroupService = boqMainSelectGroupsService.setItemType(boqTree, boqItem, 5, true);
							}

							boqMainService.markEntitiesAsModified(modifiedItemsByGroupService);
							boqMainService.markItemAsModified(boqItem);
							reCalc(boqItem, true);
							boqMainService.gridRefresh();

						}

						boqMainSelectGroupsService.removeTempSelectGroupProperties(boqTree); // clear temp. added fields
					}

					if (propertyName==='BasItemType2Fk' && !boqItem.IsCrbBoq && !boqItem.IsOenBoq) {
						if (!_.isNumber(boqItem.BasItemType2Fk) ||  boqItem.BasItemType2Fk===boqMainItemTypes2.normal) {
							boqItem.AGN = null;
							boqItem.AAN = null;
						}
						else {
							boqTree = boqMainService.getTree()[0];
							if (boqItem.AGN === null) {   // AGN must be set - otherwise grouping is not possible!
								if (boqItem.BasItemType2Fk === boqMainItemTypes2.base) {
									boqItem.AGN = boqMainSelectGroupsService.getNextAGN(boqTree);
									modifiedItemsByGroupService = boqMainSelectGroupsService.setItemType(boqTree, boqItem, boqItem.BasItemType2Fk);
									boqItem.AAN = '0';
								}
							} else {
								modifiedItemsByGroupService = boqMainSelectGroupsService.setItemType(boqTree, boqItem, boqItem.BasItemType2Fk);

								if (!boqMainSelectGroupsService.hasSelectedItems(boqTree, boqItem.AGN)) {
									baseItem = boqMainSelectGroupsService.getBaseItem(boqTree, boqItem.AGN);
									if (baseItem) {
										modifiedItemsForSettingBase = boqMainSelectGroupsService.setSelected(boqTree, baseItem);
										boqMainSelectGroupsService.merge2ModifiedItems(modifiedItemsForSettingBase, modifiedItemsByGroupService);
									}
								}
							}
						}

						boqMainSelectGroupsService.removeTempSelectGroupProperties(boqTree); // clear temp. added fields

						boqMainService.markEntitiesAsModified(modifiedItemsByGroupService);
						boqMainService.markItemAsModified(boqItem);
						reCalc(boqItem, true);
						boqMainService.gridRefresh();

					}

					if (propertyName==='AAN' && !boqItem.IsCrbBoq && !boqItem.IsOenBoq) {
						if (boqItem.AGN !== null) {   // AGN must be set - otherwise grouping is not possible!

							boqTree = boqMainService.getTree()[0];

							if (boqItem.AAN === null || boqItem.AAN === '') {
								boqItem.AGN = null;
								modifiedItemsByGroupService = boqMainSelectGroupsService.setItemType(boqTree, boqItem, 1);
							} else if (boqItem.AAN === 0) {
								modifiedItemsByGroupService = boqMainSelectGroupsService.setSelected(boqTree, boqItem);
							} else {
								var allItemsWithGivenAGN = boqMainSelectGroupsService.getAllItemsWithAGN(boqTree, boqItem.AGN);
								var allItemsWithSameAAN = _.filter(allItemsWithGivenAGN, function (item) {
									return item.AAN === boqItem.AAN && item.Id !== boqItem.Id;
								});

								if (allItemsWithSameAAN.length > 0) {
									// If there are alreay items with this AAN and AGN we take their BasItemType2Fk
									boqMainSelectGroupsService.copyState(allItemsWithSameAAN[0], boqItem);
								} else {
									// There are no items the same AAN and AGN so this item is set to awarded
									boqMainSelectGroupsService.setItemTypeOnly(boqItem, 5);
								}

								if (!boqMainSelectGroupsService.hasSelectedItems(boqTree, boqItem.AGN)) {
									baseItem = boqMainSelectGroupsService.getBaseItem(boqTree, boqItem.AGN);
									if (baseItem) {
										modifiedItemsForSettingBase = boqMainSelectGroupsService.setSelected(boqTree, baseItem);
										boqMainSelectGroupsService.merge2ModifiedItems(modifiedItemsForSettingBase, modifiedItemsByGroupService);
									}
								}
							}
							boqMainSelectGroupsService.removeTempSelectGroupProperties(boqTree); // clear temp. added fields
						}

						boqMainService.markEntitiesAsModified(modifiedItemsByGroupService);
						boqMainService.markItemAsModified(boqItem);
						reCalc(boqItem, true);
						boqMainService.gridRefresh();

					}

					/**
					 * #defect(99818):while user change the cost unit rate in UI, the surcharge factor will need to change automatically
					 */
					if (propertyName === 'Price' && boqMainCommonService.isSurchargeItem4(boqItem)) {
						boqItem.SurchargeFactor = boqItem.Price;
					}

					// fixed defect 80701
					// Change position type item with assigned Boq Item Flag to Note/ Design Description type,  BoQ Item Flag info should be clear
					if (propertyName === 'BoqLineTypeFk' && (boqItem.BoqLineTypeFk === 105 || boqItem.BoqLineTypeFk === 107 || boqItem.BoqLineTypeFk === 110)) {
						boqItem.BoqItemFlagFk = null;
					}

					// When BoqLineType is changed to SurchargedItem, then LumpsumFlags must be deactivated (ALM: 118610)
					if(propertyName === 'BoqLineTypeFk' && boqMainCommonService.isSurchargeItem(boqItem)){
						boqItem.IsLumpsum = false;

						// In the following lines we determine the related boqSurchargeService instance and trigger a reload to instantly get
						// the relevant surcharge data loaded.
						let boqMainServiceContainer = boqMainService.getServiceContainer();
						let boqMainServiceContainerData = _.isObject(boqMainServiceContainer) ? boqMainServiceContainer.data : null;
						if(_.isObject(boqMainServiceContainerData)) {
							// First search the fitting boqMainSurchargeService in the childServices array
							let fittingBoqMainSurchargeService = _.find(boqMainServiceContainerData.childServices, function(childService) {
								return childService.getItemName() === 'BoqSurcharged';
							});

							if(_.isObject(fittingBoqMainSurchargeService)) {
								fittingBoqMainSurchargeService.clearCache();
								fittingBoqMainSurchargeService.read();
							}
						}
					}

					if (propertyName === 'Price' || boqItem.Price !== oldPrice) {
						if (boqItem.Price !== 0) {
							boqItem.Included = false;
							boqItem.NotSubmitted=false;
						}

						boqItem.ExQtnIsEvaluated = false;

						if (!skipDispatching2SplitQuantity) {
							dispatchPrice(boqItem);
						}
					} else if (propertyName === 'PriceOc' || boqItem.PriceOc !== oldPriceOc) {
						if (boqItem.PriceOc !== 0) {
							boqItem.Included = false;
							boqItem.NotSubmitted=false;
						}

						boqItem.ExQtnIsEvaluated = false;

						if (!skipDispatching2SplitQuantity) {
							dispatchPrice(boqItem);
						}
					}

					if(['ColVal1', 'ColVal2', 'ColVal3', 'ColVal4', 'ColVal5'].includes(propertyName)) {
						let map2Total = {
							ColVal1: 'ColVal1Total',
							ColVal2: 'ColVal2Total',
							ColVal3: 'ColVal3Total',
							ColVal4: 'ColVal4Total',
							ColVal5: 'ColVal5Total',
						};
						map2Total = angular.extend({}, _.invert(map2Total), map2Total);
						let totalColumn = map2Total[propertyName];
						service.dynamicUserDefinedColumnsChanged(boqItem, totalColumn, boqMainService);
						service.dynamicUserDefinedColumnsChanged(boqItem, propertyName, boqMainService);
					}
					boqMainService.processBoqItem(boqItem);

				}

				function reCalc(changedItem, calcChildren) {

					if (boqMainCommonService.isDivisionOrRoot(changedItem)) {
						boqMainService.calcParentChain(boqItem, calcChildren); // By giving the flag true, we assure that the children of boqItem are calculated first, before calculating up the parent chain.
					} else {
						boqMainService.calcItemsPriceHoursNew(boqItem, calcChildren);
					}
				}

				function dispatchQuantity(boqItem, quantityAdj) {
					if (boqItem.HasSplitQuantities) {
						var boqMainSplitQuantityServiceFactory = boqMainService.getSplitQuantityService();
						if (quantityAdj) {
							boqMainSplitQuantityServiceFactory.dispatchQuantityAdj(boqItem.QuantityAdj);
						} else {
							boqMainSplitQuantityServiceFactory.dispatchQuantity(boqItem.Quantity);
						}
					}
				}

				function dispatchPrice(boqItem) {
					if (boqItem.HasSplitQuantities) {
						var boqMainSplitQuantityServiceFactory = boqMainService.getSplitQuantityService();
						boqMainSplitQuantityServiceFactory.dispatchPriceOc(null /* boqItem.PriceOc */); // In the  current case changes of PriceOc on boqItem level nulls the split quantity oc prices
						boqMainSplitQuantityServiceFactory.dispatchPrice(null /* boqItem.Price */);  // In the  current case changes of Price on boqItem level nulls the split quantity prices
					}
				}
			};

			service.setCurrentBoqPriceConditionService = function (priceConditionService) {
				currentBoqPriceConditionService = priceConditionService;
			};

			service.getCurrentBoqPriceConditionService = function(currentBoqMainService) {
				if (!currentBoqPriceConditionService) {
					let boqMainPriceConditionCommonService = $injector.get('boqMainPriceConditionCommonService');
					let priceConditionDataService = boqMainPriceConditionCommonService.getPriceConditionServiceByModule(currentBoqMainService.getModuleName());
					if (priceConditionDataService) {
						currentBoqPriceConditionService = priceConditionDataService;
					}
				}
				return currentBoqPriceConditionService;
			};

			service.getCurrentBoqMainValidationService = function(currentBoqMainService) {
				return $injector.get('boqMainValidationServiceProvider').getInstance(currentBoqMainService);
			};


			service.dynamicUserDefinedColumnsChanged = function(item,column,dataService){
				let _dynamicUserDefinedColumnsService = dataService.getDynamicUserDefinedColumnsService();
				if(_dynamicUserDefinedColumnsService && _.isFunction(_dynamicUserDefinedColumnsService.fieldChange)){
					_dynamicUserDefinedColumnsService.fieldChange(item, column, item[column]);
				}
			};

			return service;
		}]);
})();
