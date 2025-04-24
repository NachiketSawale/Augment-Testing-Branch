/**
 * Created by bh on 09.06.2015.
 */
(function (angular) {
	/* global _ */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boqMainReadonlyProcessor
	 * @function
	 *
	 * @description
	 * The boqMainReadonlyProcessor adds runtime data information concerning the readonly status of the properties for boqItems depending on there type.
	 */

	angular.module('boq.main').factory('boqMainReadonlyProcessor', ['$injector', 'platformRuntimeDataService', 'basicsCustomBoqItemStatusLookupDataService', 'boqMainCommonService', 'boqMainDetailFormConfigService', 'boqMainLineTypes', 'boqMainItemTypes', 'boqMainOenService',
		function ($injector, platformRuntimeDataService, basicsCustomBoqItemStatusLookupDataService, boqMainCommonService, boqMainDetailFormConfigService, boqMainLineTypes, boqMainItemTypes, boqMainOenService) {

			var service = {};

			let boqItemStatuses = [];
			basicsCustomBoqItemStatusLookupDataService.getList({lookupType:'BoqItemStatus'}).then(function(data) {
				boqItemStatuses = data;
			});

			/* jshint -W074 */ // function's cyclomatic complexity is too high
			/* jshint -W071 */ // function's has too many statements -> I don't think so !
			service.getReadOnlyFieldsForItem = function getReadOnlyFieldsForItem(boqItem, boqMainService) {
				// Check if we have a valid boqItem
				if (!(boqItem && angular.isDefined(boqItem.BoqLineTypeFk))) {
					return null;
				}

				var fields = [];

				// The boqMainService is not always handed over, so we have to check for existance
				var ignoreBoqDivisionType = false;
				var boqStructureDefinition = null;
				if (angular.isDefined(boqMainService) && boqMainService !== null && boqMainService.getStructure() !== null) {
					boqStructureDefinition = boqMainService.getStructure();
					ignoreBoqDivisionType = !boqMainCommonService.isFreeBoqType(boqStructureDefinition);
				}

				// First we get all fields that are currently visible in the UI
				var allFields = boqMainDetailFormConfigService.getListOfFields(true);
				allFields.push('ColVal1');
				allFields.push('ColVal2');
				allFields.push('ColVal3');
				allFields.push('ColVal4');
				allFields.push('ColVal5');

				// Then we add the fields, that are generally set to readonly
				var readOnlyFields = ['Cost', 'CostOc', 'VobIsSpecialIndirectCostBalancing', 'DiscountedUnitprice', 'DiscountedPrice', 'DiscountedUnitpriceOc',
					'DiscountedPriceOc', 'WicNumber', 'DesignDescriptionNo', 'IsLumpsum', 'Finaldiscount', 'FinaldiscountOc',
					'PreviousPrice', 'ExtraIncrement', 'PreEscalation', 'ExtraIncrementOc', 'PreEscalationOc', 'ExtraPrevious', 'ExtraTotal', 'PreEscalationTotal', 'CopyInfo',
					'ColVal1','ColVal2','ColVal3','ColVal4','ColVal5','PrcItemEvaluationFk'];
				var urbName = 'NameUrb';
				var urb = 'Urb';
				var userdefined = 'Userdefined';
				var i = 0;

				// Check for local handling of readonly state, i.e. modules in which the boq is used may have different readonly logic than standard boq.
				var localReadOnlyFields = allFields;
				if (boqMainService && _.isFunction(boqMainService.handleReadonlyLocally) && boqMainService.handleReadonlyLocally(boqItem, localReadOnlyFields)) {
					// The chance for other modules to add readonly fields. TODO: merge the functions 'handleReadonlyLocally' and 'addReadOnlyFields'
					if (_.isFunction(boqMainService.addReadOnlyFields)) {
						localReadOnlyFields = localReadOnlyFields.concat(boqMainService.addReadOnlyFields(boqItem));
					}
					return localReadOnlyFields;
				}

				// check for qto header handling of readonly state.
				if (boqMainService && boqMainService.getCallingContext() && angular.isDefined(boqMainService.getCallingContext().QtoHeader) && (boqMainService.getCallingContext().QtoHeader !== null)) {
					var qtoHeader = boqMainService.getCallingContext().QtoHeader;
					var isReadonly = (qtoHeader.QtoTargetType === 1 || qtoHeader.QtoTargetType === 3) && !!qtoHeader.ConHeaderFk;
					if (isReadonly) {
						readOnlyFields.push('Quantity', 'QuantityDetail', 'QuantityAdj', 'QuantityAdjDetail', 'TotalQuantity', 'BoqLineTypeFk');
						if(!qtoHeader.IsFreeItemsAllowedOfContract){
							_.forOwn(boqItem, function (value, key) {
								readOnlyFields.push(key);
							});
						}
					} else {
						_.forOwn(boqItem, function (value, key) {
							fields.push(key);
						});
						return fields;
					}
				}

				if (boqMainCommonService.isItem(boqItem) || boqMainCommonService.isLeadDescription(boqItem)) {
					// On the item level certain fields have to be set readonly
					readOnlyFields.push('ItemTotal');
					readOnlyFields.push('Finalprice');
					readOnlyFields.push('LumpsumPrice');
					readOnlyFields.push('ItemTotalOc');
					readOnlyFields.push('FinalpriceOc');
					readOnlyFields.push('LumpsumPriceOc');
					readOnlyFields.push('Discount');
					readOnlyFields.push('DiscountOc');
					readOnlyFields.push('DiscountPercentIt');
					readOnlyFields.push('DiscountText');
					readOnlyFields.push('Hours');
					readOnlyFields.push('BoqDivisionTypeFk');
					readOnlyFields.push('Finalgross');
					readOnlyFields.push('FinalgrossOc');
					readOnlyFields.push('BudgetDifference');

					if (boqMainService.getIsGCBoq()) {
						readOnlyFields.push('IsUrb');
						readOnlyFields.push('Price');
						readOnlyFields.push('PriceOc');
					}
					else if (boqItem.IsUrb) {
						// In this case the unit rate is calculated from the unit rate breakdowns.
						readOnlyFields.push('Price');
						readOnlyFields.push('PriceOc');
					}

					boqMainService.getCachedRevenueTypeAsync({'Id':boqItem.BoqRevenueTypeFk}).then(function(revenueType) {
						platformRuntimeDataService.readonly(boqItem, [{field: 'RevenuePercentage', readonly: revenueType && !revenueType.IsPercentage}]);
					});

					// Add transient fields to readonly...
					readOnlyFields = readOnlyFields.concat(boqMainDetailFormConfigService.getTransientFields());

					// ...except TotalQuantity
					readOnlyFields = _.without(readOnlyFields, 'TotalQuantity');
					readOnlyFields = _.without(readOnlyFields, 'TotalPrice');
					readOnlyFields = _.without(readOnlyFields, 'ItemTotalEditable');
					readOnlyFields = _.without(readOnlyFields, 'ItemTotalEditableOc');
					readOnlyFields = _.without(readOnlyFields, 'PercentageQuantity');
					readOnlyFields = _.without(readOnlyFields, 'CumulativePercentage');
					readOnlyFields = _.without(readOnlyFields, 'TotalRejectedQuantity');

					if (boqMainCommonService.isItem(boqItem)) {
						// A position should be able to set the IsLumpsum flag
						readOnlyFields = _.without(readOnlyFields, 'IsLumpsum'); // According to ALM #119156  (-> Lumpsum checkbox on position level should be enabled)

						if (!boqMainCommonService.isLeadDescription(boqItem)) {
							readOnlyFields.push('IsUrFromSd');
						}

						if (boqItem.BoqItemPrjBoqFk && boqItem.BoqItemPrjItemFk && boqMainService.hasItemBeenSavedYet(boqItem)) {
							readOnlyFields.push('Reference');
						}

						if (boqItem.BasItemTypeFk === boqMainItemTypes.priceRequest) {
							readOnlyFields.push('Quantity');
							readOnlyFields.push('QuantityAdj');
						}
					}

					if (boqMainCommonService.isLeadDescription(boqItem)) {
						readOnlyFields.push('BoqLineTypeFk');
						if (_.isArray(boqItem.BoqItems) && boqItem.BoqItems.length !== 0) {
							readOnlyFields.push('IsLeadDescription'); // Only in case of existing subdescriptions we set this flag readonly.
						}

						if (boqItem.IsUrFromSd) {
							// In this case the unit rate is calculated from the subdescription values and is not editable
							readOnlyFields.push('Price');
							readOnlyFields.push('PriceOc');
							readOnlyFields.push('Pricegross');
							readOnlyFields.push('PricegrossOc');
						}
					}

					if (!boqItem.BudgetFixedTotal) {
						readOnlyFields.push('BudgetTotal');
					}

					if (!boqItem.BudgetFixedUnit) {
						readOnlyFields.push('BudgetPerUnit');
					}

					// Make urb column readonly if there is no name existing for it.
					if (boqStructureDefinition) {
						for (i = 1; i <= 6; i++) {
							if (_.isEmpty(boqStructureDefinition[urbName + i]) || !boqItem.IsUrb) {
								readOnlyFields.push(urb + i);
								readOnlyFields.push(urb + i + 'Oc');
							}
						}
					}

					if (boqItem.RecordingLevel === 1) {
						let fieldsToBeReadonly = ['Quantity', 'QuantityAdj', 'QuantityDetail', 'QuantityAdjDetail', 'CumulativePercentage', 'PercentageQuantity', 'TotalQuantity'];

						_.each(fieldsToBeReadonly, function (field) {
							if(!_.includes(readOnlyFields, field)) {
								readOnlyFields.push(field);
							}
						});
					}

					if (!['Project', 'SalesBid', 'SalesContract', 'Wic'].includes(boqMainService.getCallingContextType())) {
						readOnlyFields.push('IsFixedPrice');
					}

					if (boqItem.IsLumpsum && !_.includes(readOnlyFields, 'Quantity')) {
						readOnlyFields.push('Quantity');
					}
				}
				else if (boqMainCommonService.isDivisionOrRoot(boqItem) || boqMainCommonService.isSurchargeItem(boqItem)) {
					// On the hierarchical levels certain fields have to be set readonly

					// First we take all currently visible fields, assume them to be readonly...
					readOnlyFields = allFields;
					// ...and explicitly remove those that we want to be editable
					if (boqItem.IsLumpsum) {
						// In case we have the lumpsum flag set we should be able to change the LumpsumPrice
						readOnlyFields = _.without(readOnlyFields, 'LumpsumPrice');
						readOnlyFields = _.without(readOnlyFields, 'LumpsumPriceOc');
					}

					// common for division and root
					fields = [
						'Reference', 'Reference2', 'ExternalCode', 'BriefInfo', 'IsLumpsum', 'DiscountPercentIt', 'Discount', 'DiscountOc', 'DiscountText', 'BpdAgreementFk',
						'IsNotApplicable', 'IsDisabled', 'MdcControllingUnitFk', 'MdcTaxCodeFk', 'ExSalesTaxGroupFk', 'PrcStructureFk', 'CommentClient',
						'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'PrcPriceConditionFk', 'PrjChangeFk', 'PrjChangeStatusFk',
						'PrjChangeStatusFactorByReason', 'PrjChangeStatusFactorByAmount', 'BudgetFixedTotal', 'CumulativePercentage', 'PercentageQuantity', 'RecordingLevel',
						'CommentContractor', 'ProjectBillToFk'
					];
					_.each(fields, function (field) {
						readOnlyFields = _.without(readOnlyFields, field);
					});

					if(boqItem.RecordingLevel === 1) {
						let fieldsToBeReadonly = ['CumulativePercentage', 'PercentageQuantity'];

						_.each(fieldsToBeReadonly, function (field) {
							if (!_.includes(readOnlyFields, field)) {
								readOnlyFields.push(field);
							}
						});
					}

					// When BoqLineType is changed to SurchargedItem, then LumpsumFlags must be deactivated (ALM: 118610)
					if (boqMainCommonService.isSurchargeItem(boqItem)) {
						readOnlyFields.push('IsLumpsum');
					}

					if (boqMainCommonService.isDivision(boqItem)) {
						// In case of the division item various fields shall be editable, i.e. will be removed from the readOnlyFields array
						if (!boqItem.HasChildren) {
							// Only in case the division has no children we allow the line type to be changeable, i.e. to change it to a note
							readOnlyFields = _.without(readOnlyFields, 'BoqLineTypeFk');
						}

						// The division type is only editable on level one
						if ((boqItem.BoqLineTypeFk === 1) && !ignoreBoqDivisionType) {
							readOnlyFields = _.without(readOnlyFields, 'BoqDivisionTypeFk');
						}

						if (boqItem.BudgetFixedTotal) {
							readOnlyFields = _.without(readOnlyFields, 'BudgetTotal');
						}

						readOnlyFields = _.without(readOnlyFields, 'BasItemType2Fk');
						readOnlyFields = _.without(readOnlyFields, 'AAN');
						readOnlyFields = _.without(readOnlyFields, 'AGN');

						if (boqItem.BoqItemPrjBoqFk && boqItem.BoqItemPrjItemFk && boqMainService.hasItemBeenSavedYet(boqItem)) {
							readOnlyFields.push('Reference');
						}
					}
					else if (boqMainCommonService.isSurchargeItem(boqItem)) {
						readOnlyFields = _.without(readOnlyFields, 'Price');
						readOnlyFields = _.without(readOnlyFields, 'PriceOc');
						readOnlyFields = _.without(readOnlyFields, 'BoqLineTypeFk');
						readOnlyFields = _.without(readOnlyFields, 'BoqItemFlagFk');
						readOnlyFields.push('MdcTaxCodeFk');
					}
					else if (boqMainCommonService.isRoot(boqItem)) {
						// In case of the root item various fields shall be editable, i.e. will be removed from the readOnlyFields array
						// add specific fields for root item here
						if (boqItem.BudgetFixedTotal) {
							readOnlyFields = _.without(readOnlyFields, 'BudgetTotal');
						}
					}
				}
				else if (boqMainCommonService.isTextElementWithoutReference(boqItem)) {
					// For text elements without reference certain fields have to be set readonly

					// First we take all currently visible fields...
					readOnlyFields = allFields;
					readOnlyFields = _.without(readOnlyFields, 'BriefInfo');
					readOnlyFields = _.without(readOnlyFields, 'IsDisabled');
					readOnlyFields = _.without(readOnlyFields, 'CommentClient');

					if (boqMainCommonService.isSubDescription(boqItem)) {
						readOnlyFields = _.without(readOnlyFields, 'Quantity');
						readOnlyFields = _.without(readOnlyFields, 'BasUomFk');
						readOnlyFields = _.without(readOnlyFields, 'Price');
						readOnlyFields = _.without(readOnlyFields, 'Pricegross');
						if (Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity')) {
							readOnlyFields = _.without(readOnlyFields, 'TotalQuantity');
						}

						// Make urb column readonly if there is no name existing for it.
						readOnlyFields = _.without(readOnlyFields, 'IsUrb');
						if (boqStructureDefinition) {
							for (i = 1; i <= 6; i++) {
								if (!_.isEmpty(boqStructureDefinition[urbName + i])) {
									readOnlyFields = _.without(readOnlyFields, urb + i);
									readOnlyFields = _.without(readOnlyFields, urb + i + 'Oc');
								}
							}
						}
					}

					// Make userdefined fields editable
					for (i = 1; i <= 5; i++) {
						readOnlyFields = _.without(readOnlyFields, userdefined + i);
					}

					if(boqMainCommonService.isTextElement(boqItem) && boqMainService.getBoqItemLevel(boqItem) === 1) {
						// When having a text element and being on level one it should be possible to change the line type.
						readOnlyFields = _.without(readOnlyFields, 'BoqLineTypeFk');
					}
				}

				if (boqMainCommonService.isPositionType(boqItem.BoqLineTypeFk) || boqMainCommonService.isSurchargeItem(boqItem)) {
					readOnlyFields = _.without(readOnlyFields, 'PrjCharacter');
					readOnlyFields = _.without(readOnlyFields, 'WorkContent');

					_.remove(readOnlyFields, function (field) {
						return field === 'ColVal1' || field === 'ColVal2' || field === 'ColVal3' || field === 'ColVal4' || field === 'ColVal5';
					});
				}

				if (angular.isDefined(boqItem.HasSplitQuantities) && boqItem.HasSplitQuantities) {
					readOnlyFields.push('QuantityDetail');
					readOnlyFields.push('QuantityAdjDetail');
				}

				if (angular.isDefined(boqItem.HasMultipleSplitQuantities) && boqItem.HasMultipleSplitQuantities) {
					readOnlyFields.push('Quantity');
					readOnlyFields.push('QuantityAdj');
					readOnlyFields.push('TotalQuantity');
				}

				if (boqMainCommonService.isSurchargeItem4(boqItem)) {
					readOnlyFields = _.without(readOnlyFields, 'Quantity');
					readOnlyFields = _.without(readOnlyFields, 'QuantityAdj');
					readOnlyFields = _.without(readOnlyFields, 'Rule');
					readOnlyFields = _.without(readOnlyFields, 'Param');
					readOnlyFields = _.without(readOnlyFields, 'DivisionTypeAssignment');
					readOnlyFields.push('BoqLineTypeFk');
				}
				else {
					readOnlyFields.push('Rule', 'Param', 'DivisionTypeAssignment');
				}

				if (boqMainCommonService.isSurchargeItem(boqItem) || boqMainCommonService.isLeadDescription(boqItem) || boqMainCommonService.isTextElementWithoutReference(boqItem)) {
					readOnlyFields.push('PrcPriceConditionFk');
				}

				if (boqItem.Stlno && boqItem.Stlno.length > 0) {
					readOnlyFields = readOnlyFields.concat(['BriefInfo', 'BasBlobsSpecificationFk']);
				}

				if (boqMainService) {
					readOnlyFields = $injector.get('boqMainCrbBoqItemService').getReadOnlyFieldsForItem(boqMainService, boqItem, allFields, readOnlyFields); // It also care about CRB fields in not CRB BOQs
					if (boqMainService.isOenBoq()) {
						readOnlyFields = boqMainOenService.getReadOnlyFieldsForItem(boqMainService, boqItem, readOnlyFields);
					}
				}

				if (angular.isDefined(boqItem.IsQtoForQuantity) && boqItem.IsQtoForQuantity) {
					readOnlyFields.push('Quantity');
					readOnlyFields.push('QuantityDetail');
					readOnlyFields.push('ItemTotal');
					readOnlyFields.push('CumulativePercentage');
					readOnlyFields.push('PercentageQuantity');
					readOnlyFields.push('TotalQuantity');
					readOnlyFields.push('ItemTotalEditable');
					readOnlyFields.push('ItemTotalEditableOc');
				}

				if (angular.isDefined(boqItem.IsQtoForQuantityAdj) && boqItem.IsQtoForQuantityAdj) {
					readOnlyFields.push('QuantityAdj');
					readOnlyFields.push('QuantityAdjDetail');
				}

				if (angular.isDefined(boqItem.IsQtoForBillBoQQuantity) && boqItem.IsQtoForBillBoQQuantity) {
					readOnlyFields.push('Quantity');
					readOnlyFields.push('QuantityDetail');

					readOnlyFields.push('ItemTotal');
					readOnlyFields.push('CumulativePercentage');
					readOnlyFields.push('PercentageQuantity');
					readOnlyFields.push('TotalQuantity');
					readOnlyFields.push('ItemTotalEditable');
					readOnlyFields.push('ItemTotalEditableOc');
				}

				if(boqMainCommonService.isDivisionType(boqItem.BoqLineTypeFk)){
					readOnlyFields = _.without(readOnlyFields, 'PrjCharacter');
					readOnlyFields = _.without(readOnlyFields, 'WorkContent');
				}

				// Project Change
				if (!['Project','SalesBid','PrcPackage','PrcRequisition','PrcPes'].includes(boqMainService.getCallingContextType())) {
					readOnlyFields.push('PrjChangeFk');
				}
				if (boqItem.PrjChangeFk === null) {
					readOnlyFields.push('PrjChangeStatusFk');
					readOnlyFields.push('PrjChangeStatusFactorByReason');
					readOnlyFields.push('PrjChangeStatusFactorByAmount');
				}
				platformRuntimeDataService.hideContent(boqItem, ['PrjChangeStatusFk','PrjChangeStatusFactorByReason','PrjChangeStatusFactorByAmount'], boqItem.PrjChangeFk===null);

				// localReadOnlyFields.push('ExWipIsFinalQuantity'); // bre: does not work because not provided by 'boqMainDetailFormConfigService.getListOfFields()', workaround is in next line
				const iseditableExWipIsFinalQuantity = boqMainCommonService.isItem(boqItem) && boqMainService.getServiceName()==='salesWipBoqStructureService';
				platformRuntimeDataService.readonly(boqItem, [{field: 'ExWipIsFinalQuantity',    readonly: !iseditableExWipIsFinalQuantity}]);
				platformRuntimeDataService.readonly(boqItem, [{field: 'ExWipQuantity',           readonly: true}]);
				platformRuntimeDataService.readonly(boqItem, [{field: 'ExWipExpectedRevenue',    readonly: true}]);
				platformRuntimeDataService.readonly(boqItem, [{field: 'ExSalesRejectedQuantity', readonly: !(boqMainCommonService.isItem(boqItem) && boqMainService.getServiceName().includes('sales'))}]);


				// The chance for other modules to add readonly fields
				if (boqMainService && _.isFunction(boqMainService.addReadOnlyFields)) {
					readOnlyFields = readOnlyFields.concat(boqMainService.addReadOnlyFields(boqItem));
				}

				return readOnlyFields;
			};

			service.processItem = function processItem(boqItem, data) {

				var boqMainService = data && data.getServiceContainer ? data.getServiceContainer().service : null;

				// Do a further check of items without a reference number here (i.e. item that should have a valid BoqItemBasisFk set)
				if(_.isObject(boqItem) && boqMainCommonService.isTextElementWithoutReference(boqItem) && !boqItem.BoqItemBasisFk) {
					let parentBoqItem = boqMainService.getParentOf(boqItem);
					let childIndexOfInvalidItem = _.isObject(parentBoqItem) ? parentBoqItem.BoqItems.indexOf(boqItem) : -2;
					childIndexOfInvalidItem++; // a zero-based index may not be that useful for the end user so increase it by one to have a more understandable information.
					console.error('Problem with missing predecessor link: BoqItem with Id [' + boqItem.Id + '] beneath parent item with reference number ["' + parentBoqItem.Reference + '"] at child index [' + childIndexOfInvalidItem +  '] has no valid BoqItemBasisFk!!');
				}

				service.processItem2(boqItem, boqMainService);
			};

			service.processItem2 = function processItem(boqItem, boqMainService) {

				if (!(boqItem && angular.isDefined(boqItem.BoqLineTypeFk))) {
					return;
				}

				var readOnlyFields = service.getReadOnlyFieldsForItem(boqItem, boqMainService);

				// These fields are mainly for divisions
				var hiddenNumericFields1 = ['Quantity', 'QuantityAdj', 'QuantityMax', 'QuantityTarget', 'ExSalesRejectedQuantity', 'ExWipQuantity', 'HoursUnit', 'Hours', 'Cost', 'CostOc', 'VobDirectCostPerUnit', 'VobDirectCostPerUnitOc', 'Correction', 'CorrectionOc', 'Price', 'PriceOc',
					'DiscountPercent', 'DiscountedUnitprice', 'DiscountedUnitpriceOc', 'DiscountedPrice', 'DiscountedPriceOc', 'Urb1', 'Urb1Oc', 'Urb2', 'Urb2Oc', 'Urb3', 'Urb3Oc',
					'Urb4', 'Urb4Oc', 'Urb5', 'Urb5Oc', 'Urb6', 'Urb6Oc', 'UnitRateFrom', 'UnitRateFromOc', 'UnitRateTo', 'UnitRateToOc',
					'ExtraPrevious', 'BudgetPerUnit'];

				// These fields are mainly for positions.
				var hiddenNumericFields2 = ['LumpsumPrice', 'LumpsumPriceOc', 'Discount', 'DiscountOc', 'DiscountPercentIt', 'BudgetDifference'];

				// These fields are for items that don't have a finalprice.
				var hiddenNumericFields3 = ['ItemTotal', 'ItemTotalOc', 'Finalprice', 'FinalpriceOc', 'Finaldiscount', 'FinaldiscountOc'];

				// The transientFields
				var transientFields = boqMainDetailFormConfigService.getTransientFields();

				if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null)) {
					var allFields = boqMainDetailFormConfigService.getListOfFields(true);
					if(boqMainService && boqMainService.isOenBoq()) {
						let boqMainOenBoqItemConfigService = $injector.get('boqMainOenBoqItemConfigService');
						let oenExtensionFields = boqMainOenBoqItemConfigService.getListOfFields();
						allFields = allFields.concat(oenExtensionFields);
					}
					var fields = _.map(allFields, function (field) {
						return {field: field, readonly: readOnlyFields.indexOf(field) >= 0};
					});
					platformRuntimeDataService.readonly(boqItem, fields);
				}

				// handle BoQ Reference Item
				if ([boqMainLineTypes.position,
					boqMainLineTypes.designDescription,
					boqMainLineTypes.subDescription,
					boqMainLineTypes.surchargeItem1,
					boqMainLineTypes.surchargeItem2,
					boqMainLineTypes.surchargeItem3,
					boqMainLineTypes.surchargeItem4
				].indexOf(boqItem.BoqLineTypeFk) >= 0) {
					platformRuntimeDataService.readonly(boqItem, [
						{field: 'BoqItemReferenceFk', readonly: false}
					]);
				} else {
					platformRuntimeDataService.readonly(boqItem, [
						{field: 'BoqItemReferenceFk', readonly: true}
					]);
				}

				if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
					transientFields = _.without(transientFields, 'PercentageQuantity', 'CumulativePercentage', 'Performance');

					transientFields.push('ColVal1');
					transientFields.push('ColVal2');
					transientFields.push('ColVal3');
					transientFields.push('ColVal4');
					transientFields.push('ColVal5');

					platformRuntimeDataService.hideContent(boqItem, _.filter(hiddenNumericFields1.concat(transientFields), function (field) {
						return (!['Hours','TotalPrice'].includes(field));
					}), true);
				}
				else if ((boqMainCommonService.isTextElementWithoutReference(boqItem) && !boqMainCommonService.isSubDescription(boqItem))) {
					platformRuntimeDataService.hideContent(boqItem, hiddenNumericFields1.concat(hiddenNumericFields2).concat(hiddenNumericFields3).concat(transientFields), true);
				}
				else if (boqMainCommonService.isItem(boqItem)) {
					platformRuntimeDataService.hideContent(boqItem, hiddenNumericFields2, true);
				}
				else if (boqMainCommonService.isSubDescription(boqItem)) {
					// Here only the Quantity and Price fields should be visible
					platformRuntimeDataService.hideContent(boqItem, _.filter(hiddenNumericFields1.concat(hiddenNumericFields2).concat(hiddenNumericFields3).concat(transientFields), function (field) {
						return (field !== 'Quantity' && field !== 'Price' && field !== 'PriceOc');
					}), true);
				}

				if(boqMainCommonService.isDivisionType(boqItem.BoqLineTypeFk)){
					platformRuntimeDataService.readonly(boqItem, [
						{field: 'PrjCharacter', readonly: false}
					]);

					platformRuntimeDataService.readonly(boqItem, [
						{field: 'WorkContent', readonly: false}
					]);
				}

				// Deactivated because of DEV-27003
				/*
				let billToModes = $injector.get('billToModes');
				if(['SalesContract','SalesBilling'].includes(boqMainService.getCallingContextType()) && (boqMainService.getCurrentBillToMode() === billToModes.quantityOrItemBased)) {
					if(boqMainCommonService.isItem(boqItem) && (!_.isNumber(boqItem.ValidBillToPortion) || boqItem.ValidBillToPortion === 0)) {
						platformRuntimeDataService.readonly(boqItem,true); // Currently items withoud valid BillTo portion should not be changed in those BoQ types.
					}
				}
				*/
			};

			service.isFieldEditable = function isFieldEditable(boqItem, field, boqMainService) {
				var isEditable = false;

				var readOnlyFields = service.getReadOnlyFieldsForItem(boqItem, boqMainService);

				if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null) && readOnlyFields.indexOf(field) === -1) {
					isEditable = true;
				}

				// Special case for fields 'PercentageQuantity' and 'CumulativePercentage' on division and root level
				// If there are positions below holding split quantities these two fields are currently not editable.
				if (_.isObject(boqItem) && boqMainCommonService.isDivisionOrRoot(boqItem) && ['PercentageQuantity', 'CumulativePercentage'].includes(field)) {
					let findBoqItemsWithSplitQuantitiesVisitorObject = {
						visitBoqItemFn: function findBoqItemsWithSplitQuantities(parentItem, boqItem, lineType, level, visitorObject) {

							if (boqItem.HasSplitQuantities) {
								visitorObject.HasSplitQuantities = true;
								visitorObject.visitBoqItemFn = undefined; // to stop further iteration
								return false;
							} else {
								visitorObject.HasSplitQuantities = false;
							}

							return true;
						}
					};

					boqMainService.visitBoqItemRecursively(boqItem, findBoqItemsWithSplitQuantitiesVisitorObject);

					isEditable = !findBoqItemsWithSplitQuantitiesVisitorObject.HasSplitQuantities;
				}

				return isEditable;
			};

			service.setCellEditable = function setCellEditable(boqItem, field, boqMainService, readOnlyMode) {
				let isBoqItemReadonly = false;
				let boqItemStatus;

				if (field !== 'BasItemStatusFk') {
					boqItemStatus = _.find(boqItemStatuses, {'Id':boqItem.BasItemStatusFk});
					isBoqItemReadonly = boqItemStatus && boqItemStatus.IsLive && boqItemStatus.ReadOnly;
				}

				return !(readOnlyMode || isBoqItemReadonly) && boqMainService.getCellEditable(boqItem, field);
			};

			return service;

		}]);
})(angular);
