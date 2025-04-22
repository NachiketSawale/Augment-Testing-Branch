(function () {
	'use strict';
	/* global _, math */

	var salesContractModule = 'sales.contract';
	angular.module(salesContractModule).factory('salesContractPaymentScheduleValidationService',
		[
			'$q',
			'procurementCommonPaymentScheduleValidationService',
			'salesContractPaymentScheduleDataService',
			'basicsLookupdataLookupDescriptorService',
			'platformDataValidationService',
			'platformRuntimeDataService',
			'maxInt32Value',
			'prcCommonCalculationHelper',
			'prcGetIsCalculateOverGrossService',
			function (
				$q,
				procurementCommonPaymentScheduleValidationService,
				dataService,
				basicsLookupdataLookupDescriptorService,
				platformDataValidationService,
				platformRuntimeDataService,
				maxInt32Value,
				prcCommonCalculationHelper,
				prcGetIsCalculateOverGrossService
			) {
				var validation = procurementCommonPaymentScheduleValidationService.getService(dataService);
				basicsLookupdataLookupDescriptorService.loadData('BilType');

				validation.validateBilHeaderFk = function validateBilHeaderFk(entity, value) {
					var salesBillings = basicsLookupdataLookupDescriptorService.getData('SalesBillingV2');
					entity.BilHeaderFk = value;
					if (value) {
						var salesBil = _.find(salesBillings, {Id: value});
						if (salesBil) {
							entity.BilAmountNet = salesBil.AmountNet;
							entity.BilAmountNetOc = salesBil.AmountNetOc;
							entity.BilAmountGross = salesBil.AmountGross;
							entity.BilAmountGrossOc = salesBil.AmountGrossOc;
							dataService.calculatePaymentBalance();
							validation.asyncValidateBilTypeFk(entity, salesBil.TypeFk, 'BilTypeFk');
							return true;
						}
					}
					else {
						entity.BilTypeFk = null;
						entity.BilAmountNet = 0;
						entity.BilAmountNetOc = 0;
						entity.BilAmountGross = 0;
						entity.BilAmountGrossOc = 0;
					}
					dataService.calculatePaymentBalance();
					return true;
				};

				validation.asyncValidateBilTypeFk = function asyncValidateBilTypeFk(entity, value, model) {
					var defer = $q.defer();
					var result = {
						apply: true,
						valid: true
					};
					if (!value || value === entity.BilTypeFk) {
						platformDataValidationService.finishValidation(result, entity, value, model, validation, dataService);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						defer.resolve(true);
					} else {
						entity.BilTypeFk = value;
						var parentSelected = dataService.parentService().getSelected();
						var types = basicsLookupdataLookupDescriptorService.getData('BilType');

						var originalPt = entity.BasPaymentTermFk;
						entity.BasPaymentTermFk = parentSelected.PaymentTermFiFk;
						if (types) {
							var type = types[value];
							if (type) {
								if (type.Isprogress) {
									entity.BasPaymentTermFk = parentSelected.PaymentTermPaFk;
								}
								if (type.IsPsBalancing && entity.Sorting !== maxInt32Value) {
									result = {
										apply: true,
										valid: false,
										error$tr$: 'sales.contract.onlyFinalLineCanSetFinalItem'
									};
									platformDataValidationService.finishValidation(result, entity, value, model, validation, dataService);
									platformRuntimeDataService.applyValidationResult(result, entity, model);
									defer.resolve(result);
									return defer.promise;
								}
							}
						}
						if (entity.BasPaymentTermFk && originalPt !== entity.BasPaymentTermFk) {
							validation.asyncValidateBasPaymentTermFk(entity, entity.BasPaymentTermFk);
						}
						if (result.valid) {
							platformDataValidationService.finishValidation(result, entity, value, model, validation, dataService);
							platformRuntimeDataService.applyValidationResult(result, entity, model);
						}
						defer.resolve(result);

					}
					return defer.promise;
				};

				validation.checkPercentOfContract = function checkPercentOfContract(entity, model) {
					var items = dataService.getListNoSumLine();
					items = entity.IsStructure ?
						(entity.PaymentScheduleFk ?
							_.filter(items, function(i) {return i.PaymentScheduleFk === entity.PaymentScheduleFk;}) :
							_.filter(items, function(i) {return !i.PaymentScheduleFk;})
						) :
						items;
					var isParent = entity.IsStructure && !entity.PaymentScheduleFk;
					var value = entity[model];
					var result = {
						apply: true,
						valid: true
					};
					if(value > 100)
					{
						return platformDataValidationService.createErrorObject('procurement.common.paymentSchedule.paymentScheduleValueRangeErrorMessage', {object: 'percentofcontract'});
					}
					else {
						var sumOfPercentOfContract = value;

						_.forEach(items, function(item) {
							if(item.Id !== entity.Id && !item.IsFinal) {
								sumOfPercentOfContract += (isParent ? item.TotalPercent : item.PercentOfContract);
							}
						});

						if(sumOfPercentOfContract > 100.0) {
							entity.IsMarkedForPercentGreaterAsHundred = true;
							result = {
								apply: true,
								valid: false,
								error$tr$: 'procurement.common.paymentSchedule.PercentOfContractAddUpGreaterAHundred'
							};
							platformDataValidationService.finishValidation(result, entity, value, model, validation, dataService);
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							return result;
						} else {
							_.forEach(items, function(item) {
								if(item.IsMarkedForPercentGreaterAsHundred) {
									item.IsMarkedForPercentGreaterAsHundred = false;
									dataService.calculateByPercentOfContract(item, item[model], model);
									dataService.calculateRemaining();
									if (item.IsStructure && !item.PaymentScheduleFk) {
										resetAmountAfterUpdateParent(item.Id);
										dataService.calculateRemaining();
										dataService.calculatePaymentBalance();
									}
									platformDataValidationService.finishValidation(result, item, item[model], model, validation, dataService);
									platformRuntimeDataService.applyValidationResult(result, item, model);
									dataService.markItemAsModified(item);
								}
							});
						}
					}

					return platformDataValidationService.finishValidation({
						apply: true,
						valid: true
					}, entity, value, model, validation, dataService);
				};

				validation.validateSorting = function validateSorting(entity, value, model) {
					var result = {
						apply: true,
						valid: true
					};
					if (value && value >= maxInt32Value) {
						result = {
							apply: true,
							valid: false,
							error$tr$: 'sales.contract.ordPsSortingSamllerThan2147483647'
						};
					}
					platformDataValidationService.finishValidation(result, entity, value, model, validation, dataService);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return result;
				};

				validation.validateTotalPercent = function validateTotalPercent(entity, value, model) {
					entity[model] = value;
					var result = validation.validatePercentOfContract(entity, value, model);
					if (entity.IsStructure && !entity.PaymentScheduleFk && result && result.valid) {
						resetAmountAfterUpdateParent(entity.Id);
						dataService.calculateRemaining();
						dataService.calculatePaymentBalance();
					}
					return result;
				};

				var commonValidateAmountNet = validation.validateAmountNet;
				validation.validateAmountNet = function (entity, value, model) {
					var result = commonValidateAmountNet(entity, value, model);
					if (entity.IsStructure && !entity.PaymentScheduleFk) {
						resetAmountAfterUpdateParent(entity.Id);
						dataService.calculateRemaining();
						dataService.calculatePaymentBalance();
					}
					return result;
				};

				var commonValidateAmountNetOc = validation.validateAmountNetOc;
				validation.validateAmountNetOc = function (entity, value, model) {
					var result = commonValidateAmountNetOc(entity, value, model);
					if (entity.IsStructure && !entity.PaymentScheduleFk) {
						resetAmountAfterUpdateParent(entity.Id);
						dataService.calculateRemaining();
						dataService.calculatePaymentBalance();
					}
					return result;
				};

				var commonValidateAmountGross = validation.validateAmountGross;
				validation.validateAmountGross = function (entity, value, model) {
					var result = commonValidateAmountGross(entity, value, model);
					if (entity.IsStructure && !entity.PaymentScheduleFk) {
						resetAmountAfterUpdateParent(entity.Id);
						dataService.calculateRemaining();
						dataService.calculatePaymentBalance();
					}
					return result;
				};

				var commonValidateAmountGrossOc = validation.validateAmountGrossOc;
				validation.validateAmountGrossOc = function (entity, value, model) {
					var result = commonValidateAmountGrossOc(entity, value, model);
					if (entity.IsStructure && !entity.PaymentScheduleFk) {
						resetAmountAfterUpdateParent(entity.Id);
						dataService.calculateRemaining();
						dataService.calculatePaymentBalance();
					}
					return result;
				};

				function round(value) {
					return _.isNaN(value) ? 0 : prcCommonCalculationHelper.round(value);
				}

				function updateTargetToFinalLine(parent, children, isCalculateOverGross, finalPs, fixedPs, unFixedPs) {
					var percent = 0, sumTotalNetOc = 0, sumTotalGrossOc = 0, sumTotalNet = 0, sumTotalGross = 0, remainingPercent = 0, rate = 1;
					if (fixedPs && fixedPs.length) {
						_.forEach(fixedPs, function(fixedItem) {
							if (isCalculateOverGross)
							{
								fixedItem.PercentOfContract = round(math.bignumber(fixedItem.AmountGrossOc).div(parent.AmountGrossOc).mul(100));
								fixedItem.AmountNetOc = round(math.bignumber(parent.AmountNetOc).div(parent.AmountGrossOc ).mul(fixedItem.AmountGrossOc));
								fixedItem.AmountNet = round(math.bignumber(parent.AmountNet).div(parent.AmountGrossOc).mul(fixedItem.AmountGross));
							}
							else
							{
								fixedItem.PercentOfContract = round(math.bignumber(fixedItem.AmountNetOc).div(parent.AmountNetOc).mul(100));
								fixedItem.AmountGrossOc = round(math.bignumber(fixedItem.AmountNetOc).mul(parent.AmountGrossOc).div(parent.AmountNetOc));
								fixedItem.AmountGross = round(math.bignumber(fixedItem.AmountNet).mul(parent.AmountGross).div(parent.AmountNet));
							}
							percent += fixedItem.PercentOfContract;
							sumTotalNetOc += fixedItem.AmountNetOc;
							sumTotalGrossOc += fixedItem.AmountGrossOc;
							sumTotalNet += fixedItem.AmountNet;
							sumTotalGross += fixedItem.AmountGross;
						});
					}
					remainingPercent = round(math.bignumber(100).sub(percent));
					if (unFixedPs && unFixedPs.length) {
						unFixedPs = _.orderBy(unFixedPs, ['Sorting']);
						_.forEach(unFixedPs, function (item) {
							if (isCalculateOverGross)
							{
								if (sumTotalGrossOc + item.AmountGrossOc <= parent.AmountGrossOc)
								{
									item.PercentOfContract = round(math.bignumber(item.AmountGrossOc).div(parent.AmountGrossOc).mul(100));
									item.AmountNetOc = round(math.bignumber(parent.AmountNetOc).div(parent.AmountGrossOc).mul(item.AmountGrossOc));
									item.AmountNet = round(math.bignumber(parent.AmountNet).div(parent.AmountGrossOc).mul(item.AmountGross));
								}
								else
								{
									rate = round(math.bignumber(item.AmountGrossOc).div(item.AmountGross));
									item.AmountGrossOc = round(math.bignumber(parent.AmountGrossOc).sub(sumTotalGrossOc));
									item.AmountGross = round(math.bignumber(item.AmountGrossOc).div(rate));
									item.AmountNetOc = round(math.bignumber(parent.AmountNetOc).div(parent.AmountGrossOc).mul(item.AmountGrossOc));
									item.AmountNet = round(math.bignumber(parent.AmountNet).div(parent.AmountGrossOc).mul(item.AmountGross));
									item.PercentOfContract = remainingPercent;
								}
							}
							else
							{
								if (sumTotalNetOc + item.AmountNetOc <= parent.AmountNetOc)
								{
									item.PercentOfContract = round(math.bignumber(item.AmountNetOc).div(parent.AmountNetOc).mul(100));
									item.AmountGrossOc = round(math.bignumber(item.AmountNetOc).mul(parent.AmountGrossOc).div(parent.AmountNetOc));
									item.AmountGross = round(math.bignumber(item.AmountNet).mul(parent.AmountGross).div(parent.AmountNet));
								}
								else
								{
									rate = round(math.bignumber(item.AmountNetOc).div(item.AmountNet));
									item.AmountNetOc = round(math.bignumber(parent.AmountNetOc).sub(sumTotalNetOc));
									item.AmountNet = round(math.bignumber(item.AmountNetOc).div(rate));
									item.AmountGrossOc = round(math.bignumber(item.AmountNetOc).mul(parent.AmountGrossOc).div(parent.AmountNetOc));
									item.AmountGross = round(math.bignumber(item.AmountNet).mul(parent.AmountGross).div(parent.AmountNet));
									item.PercentOfContract = remainingPercent;
								}
							}
							remainingPercent = round(math.bignumber(remainingPercent).sub(item.PercentOfContract));
							sumTotalNetOc += item.AmountNetOc;
							sumTotalGrossOc += item.AmountGrossOc;
							sumTotalNet += item.AmountNet;
							sumTotalGross += item.AmountGross;
						});
					}
					if (finalPs) {
						if (remainingPercent === 0)
						{
							finalPs.AmountNet = 0;
							finalPs.AmountNetOc = 0;
							finalPs.AmountGross = 0;
							finalPs.AmountGrossOc = 0;
							finalPs.AmountGrossOc = 0;
							finalPs.PercentOfContract = 0;
						}
						else if (remainingPercent > 0)
						{
							finalPs.PercentOfContract = remainingPercent;
							finalPs.AmountNet = round(math.bignumber(parent.AmountNet).sub(sumTotalNet));
							finalPs.AmountNetOc = round(math.bignumber(parent.AmountNetOc).sub(sumTotalNetOc));
							finalPs.AmountGross = round(math.bignumber(parent.AmountGross).sub(sumTotalGross));
							finalPs.AmountGrossOc = round(math.bignumber(parent.AmountGrossOc).sub(sumTotalGrossOc));
							remainingPercent = 0;
						}
					}
				}

				function updateTargetToNotOnlyFinalLine(parent, children, isCalculateOverGross, finalPs, fixedPs, unFixedPs) {
					var percent = 0, sumTotalNetOc = 0, sumTotalGrossOc = 0, sumTotalNet = 0, sumTotalGross = 0, remainingPercent = 0;
					if (fixedPs && fixedPs.length) {
						_.forEach(fixedPs, function (fixedItem) {
							if (isCalculateOverGross)
							{
								fixedItem.PercentOfContract = round(math.bignumber(fixedItem.AmountGrossOc).div(parent.AmountGrossOc).mul(100));
								fixedItem.AmountNetOc = round(math.bignumber(parent.AmountNetOc).div(parent.AmountGrossOc).mul(fixedItem.AmountGrossOc));
								fixedItem.AmountNet = round(math.bignumber(parent.AmountNet).div(parent.AmountGrossOc).mul(fixedItem.AmountGross));
							}
							else
							{
								fixedItem.PercentOfContract = round(math.bignumber(fixedItem.AmountNetOc).div(parent.AmountNetOc).mul(100));
								fixedItem.AmountGrossOc = round(math.bignumber(fixedItem.AmountNetOc).mul(parent.AmountGrossOc).div(parent.AmountNetOc));
								fixedItem.AmountGross = round(math.bignumber(fixedItem.AmountNet).mul(parent.AmountGross).div(parent.AmountNet));
							}
							percent += fixedItem.PercentOfContract;
							sumTotalNetOc += fixedItem.AmountNetOc;
							sumTotalGrossOc += fixedItem.AmountGrossOc;
							sumTotalNet += fixedItem.AmountNet;
							sumTotalGross += fixedItem.AmountGross;

						});
					}
					remainingPercent = round(math.bignumber(100).sub(percent));
					if (unFixedPs && unFixedPs.length) {
						unFixedPs = _.orderBy(unFixedPs, ['Sorting']);
						_.forEach(unFixedPs, function (item) {
							if (remainingPercent > item.PercentOfContract)
							{
								item.AmountNet = round(math.bignumber(parent.AmountNet).mul(item.PercentOfContract).div(100));
								item.AmountNetOc = round(math.bignumber(parent.AmountNetOc).mul(item.PercentOfContract).div(100));
								item.AmountGross = round(math.bignumber(parent.AmountGross).mul(item.PercentOfContract).div(100));
								item.AmountGrossOc = round(math.bignumber(parent.AmountGrossOc).mul(item.PercentOfContract).div(100));
								remainingPercent = round(math.bignumber(remainingPercent).sub(item.PercentOfContract));
								sumTotalNetOc += item.AmountNetOc;
								sumTotalGrossOc += item.AmountGrossOc;
								sumTotalNet += item.AmountNet;
								sumTotalGross += item.AmountGross;
							}
							else if (remainingPercent <= item.PercentOfContract && remainingPercent !== 0)
							{
								item.PercentOfContract = remainingPercent;
								item.AmountNet = round(math.bignumber(parent.AmountNet).sub(sumTotalNet));
								item.AmountNetOc = round(math.bignumber(parent.AmountNetOc).sub(sumTotalNetOc));
								item.AmountGross = round(math.bignumber(parent.AmountGross).sub(sumTotalGross));
								item.AmountGrossOc = round(math.bignumber(parent.AmountGrossOc).sub(sumTotalGrossOc));
								remainingPercent = 0;
							}
							else if (remainingPercent === 0)
							{
								item.AmountNet = 0;
								item.AmountNetOc = 0;
								item.AmountGross = 0;
								item.AmountGrossOc = 0;
								item.AmountGrossOc = 0;
								item.PercentOfContract = 0;
							}
						});
					}
					if (finalPs) {
						if (remainingPercent === 0) {
							finalPs.AmountNet = 0;
							finalPs.AmountNetOc = 0;
							finalPs.AmountGross = 0;
							finalPs.AmountGrossOc = 0;
							finalPs.AmountGrossOc = 0;
							finalPs.PercentOfContract = 0;
						}
						else if (remainingPercent > 0)
						{
							finalPs.PercentOfContract = remainingPercent;
							finalPs.AmountNet = round(math.bignumber(parent.AmountNet).sub(sumTotalNet));
							finalPs.AmountNetOc = round(math.bignumber(parent.AmountNetOc).sub(sumTotalNetOc));
							finalPs.AmountGross = round(math.bignumber(parent.AmountGross).sub(sumTotalGross));
							finalPs.AmountGrossOc = round(math.bignumber(parent.AmountGrossOc).sub(sumTotalGrossOc));
							remainingPercent = 0;
						}
					}
				}

				function resetAmountAfterUpdateParent(parentId) {
					var updateVarianceToFinalLineInPS = dataService.getUpdateVarianceToFinalLine();
					var list = dataService.getList();
					var parent = _.find(list, {Id: parentId});
					var children = (list && list.length) ? _.filter(list, function(i) {
						return i.PaymentScheduleFk === parentId;
					}) : null;
					if (children && children.length && parent) {
						var statusItems = basicsLookupdataLookupDescriptorService.getData('OrdPsStatus');
						var isAgreeStatusItems = (statusItems && _.keys(statusItems)) ? _.filter(statusItems, function(s) {return s.IsAgreed;}) : [];
						var isAgreeStatusIds = (isAgreeStatusItems && isAgreeStatusItems.length) ? _.map(isAgreeStatusItems, function(i) {return i.Id;}) : [];
						var finalItem = _.find(children, {IsFinal: true});
						var fixedItems = _.filter(children, function(e) {return (!e.IsFinal && (_.includes(isAgreeStatusIds, e.OrdPsStatusFk) || e.BilHeaderFk));});
						var unfixedItems = _.filter(children, function(e) {return (!e.IsFinal && !_.includes(isAgreeStatusIds, e.OrdPsStatusFk) && !e.BilHeaderFk);});
						var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						if (updateVarianceToFinalLineInPS)
						{
							updateTargetToFinalLine(parent, children, isOverGross, finalItem, fixedItems, unfixedItems);
						}
						else
						{
							updateTargetToNotOnlyFinalLine(parent, children, isOverGross, finalItem, fixedItems, unfixedItems);
						}
						dataService.markEntitiesAsModified(children);
					}
				}

				return validation;
			}
		]);
})();