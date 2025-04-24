(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name prcCommonBoqMainReadonlyProcessor
	 * @function
	 */

	angular.module('procurement.common').factory('prcCommonBoqMainReadonlyProcessor', [
		'_',
		'$http',
		'$q',
		'$injector',
		'platformRuntimeDataService',
		'boqMainReadonlyProcessor',
		'boqMainDetailFormConfigService',
		'procurementContextService',
		'basicsLookupdataLookupDescriptorService',
		'procurementCommonPrcItemDataService',
		'boqMainStandardTypes',
		function (_,
			$http,
			$q,
			$injector,
			platformRuntimeDataService,
			boqMainReadonlyProcessor,
			boqMainDetailFormConfigService,
			moduleContext,
			basicsLookupdataLookupDescriptorService,
			dataServiceFactory,
			boqMainStandardTypes) {

			var service = {};
			var oldProcessItem = boqMainReadonlyProcessor.processItem;
			/* jshint -W073 */ // nested too deeply
			service.processItem = function processItem(boqItem, data) {
				oldProcessItem(boqItem, data);
				var boqMainService = data && data.getServiceContainer ? data.getServiceContainer().service : null;
				var readOnlyFields = boqMainReadonlyProcessor.getReadOnlyFieldsForItem(boqItem, boqMainService);
				var readOnlyFrameworkContractCallOff = ['Reference', 'BriefInfo', 'BasUomFk', 'Price', 'PriceOc', 'Pricegross', 'PricegrossOc', 'BasBlobsSpecificationFk'];
				var allFields = boqMainDetailFormConfigService.getListOfFields(true);
				allFields = allFields.concat(['BasBlobsSpecificationFk', 'BasClobsFk']);
				var fields = [];

				var mainService = moduleContext.getMainService();
				var dataService = dataServiceFactory.getService(mainService);
				if (dataService && dataService.costGroupCatalogs) {
					_.forEach(dataService.costGroupCatalogs.LicCostGroupCats, function (item) {
						allFields.push('costgroup_' + item.Id);
					});
					_.forEach(dataService.costGroupCatalogs.PrjCostGroupCats, function (item) {
						allFields.push('costgroup_' + item.Id);
					});
				}
				allFields.push('PrjLocationFk');

				var moduleName = mainService.name;
				if (moduleName === 'procurement.quote.requisition' || moduleName === 'procurement.quote' || moduleName === 'procurement.pricecomparison.quote.requisition' || moduleName === 'procurement.pricecomparison.quote') {
					allFields.push('ExQtnIsEvaluated');
					if (moduleContext.isReadOnly) {
						readOnlyFields = allFields;
					} else {
						var qtnService = moduleContext.getLeadingService();
						if (qtnService !== undefined && qtnService !== null) {
							var selectedQuote = qtnService.getSelected();
							if (selectedQuote !== undefined && selectedQuote !== null) {
								var qtnStatus = selectedQuote.QuoteStatus;
								if (qtnStatus.IsReadonly === true) {
									readOnlyFields = allFields;
								} else {
									if (qtnStatus.IsProtected === true) {
										if (boqMainService.hasItemBeenSavedYet(boqItem)) {
											// Boq item is update item
											if (!boqItem.BasItemType85Fk || boqItem.BasItemType85Fk === 3) {
												readOnlyFields = allFields;
												if (boqItem.BoqLineTypeFk === 0) {
													readOnlyFields = _.without(readOnlyFields, 'Price');
													readOnlyFields = _.without(readOnlyFields, 'PriceOc');

													if (boqItem.IsFreeQuantity) {
														readOnlyFields = _.without(readOnlyFields, 'Quantity');
													}
													// defect 94724, urb is not affected by IsProtected
													readOnlyFields = _.without(readOnlyFields, 'Urb1Oc', 'Urb2Oc', 'Urb3Oc', 'Urb4Oc', 'Urb5Oc', 'Urb6Oc', 'DiscountPercent');
													if (angular.isDefined(boqMainService) && boqMainService.getStructure() !== null) {
														var boqStructureDefinition = boqMainService.getStructure();
														if (boqStructureDefinition) {
															for (var i = 1; i <= 6; i++) {
																if (!_.isEmpty(boqStructureDefinition['NameUrb' + i])) {
																	readOnlyFields = _.without(readOnlyFields, 'Urb' + i);
																}
															}
														}
													}
												} else {
													if (boqItem.IsLumpsum) {
														readOnlyFields = _.without(readOnlyFields, 'LumpsumPrice', 'LumpsumPriceOc');
													}
													readOnlyFields = _.without(readOnlyFields, 'IsLumpsum', 'DiscountPercentIt', 'Discount', 'DiscountOc', 'DiscountText');
												}

												readOnlyFields = _.without(readOnlyFields, 'BasItemType85Fk');
											}
											readOnlyFields.push('IsFreeQuantity');
											readOnlyFields.push('BasClobsFk');
											readOnlyFields.push('BasBlobsSpecificationFk');
										} else {
											// Boq item is new item
											if (boqItem.BoqLineTypeFk === 0) {
												boqItem.BasItemType85Fk = 2; // New Item Offered
											}
										}
									} else {
										// Due to ALM task #96366 (-> In module Quote, UR Breakdown Checkbox should be read only.)
										if (readOnlyFields.indexOf('IsUrb') === -1) {
											readOnlyFields.push('IsUrb');
										}
									}

									if (readOnlyFields.indexOf('ExQtnIsEvaluated') === -1) {
										readOnlyFields.push('ExQtnIsEvaluated');
									}
								}
							}
						}
					}

					if (moduleName === 'procurement.pricecomparison.quote.requisition' || moduleName === 'procurement.pricecomparison.quote') {
						readOnlyFields.push('BoqLineTypeFk');
					}
					fields = _.map(allFields, function (field) {
						return {field: field, readonly: readOnlyFields.indexOf(field) >= 0};
					});
					platformRuntimeDataService.readonly(boqItem, fields);
					// boqMainService.gridRefresh();

					let boqMainCommonService = $injector.get('boqMainCommonService');
					if(!boqMainCommonService.isItem(boqItem)){
						//Adjustment
						platformRuntimeDataService.hideContent(boqItem, ['ExQtnIsEvaluated'], true);
					}
				}
				if (moduleName === 'procurement.pes.boq') {

					var pesService = moduleContext.getLeadingService();
					if (pesService !== undefined && pesService !== null) {
						var selectedItem = pesService.getSelected();
						if (selectedItem !== undefined && selectedItem !== null) {
							var pesStatuses = basicsLookupdataLookupDescriptorService.getData('PesStatus');

							var pesStatus = pesStatuses[selectedItem.PesStatusFk];
							if (pesStatus.IsReadOnly === true) {
								readOnlyFields = allFields;
							} else {
								if (pesStatus.IsProtected === true) {
									if (boqMainService.hasItemBeenSavedYet(boqItem)) {
										let boqMainCommonService = $injector.get('boqMainCommonService');
										readOnlyFields = allFields;
										if (boqMainCommonService.isItem(boqItem)) {
											readOnlyFields = _.without(readOnlyFields, 'Quantity', 'TotalQuantity', 'PercentageQuantity', 'CumulativePercentage', 'TotalPrice', 'ItemTotalEditable', 'ItemTotalEditableOc');
										} else if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
											readOnlyFields = _.without(readOnlyFields, 'PercentageQuantity', 'CumulativePercentage');
										}
									}
								}
							}

							// In PES it should not be allowed to change the Price(Oc) so the following code does some further checking and adjusting
							if (boqMainService.hasItemBeenSavedYet(boqItem)) {
								if(boqItem.BoqItemPrjItemFk!==null){
									if(readOnlyFields.indexOf('Price')===-1){
										readOnlyFields.push('Price');
									}
									if(readOnlyFields.indexOf('PriceOc')===-1){
										readOnlyFields.push('PriceOc');
									}
								}
								if (readOnlyFields.indexOf('Correction') === -1) {
									readOnlyFields.push('Correction');
								}
								if (readOnlyFields.indexOf('CorrectionOc') === -1) {
									readOnlyFields.push('CorrectionOc');
								}
							}

							fields = _.map(allFields, function (field) {
								return {field: field, readonly: readOnlyFields.indexOf(field) >= 0};
							});
							platformRuntimeDataService.readonly(boqItem, fields);
							_.debounce(function () {
								boqMainService.gridRefresh();
							}, 200);
						}
					}
				}

				// if req or contract, is change order and has been not rewrite in package
				if ((moduleName === 'procurement.requisition' || moduleName === 'procurement.contract') && data &&
					data.parentService && !_.isNil(boqItem.BoqItemPrjItemFk) && boqItem.BoqItemPrjItemFk > 0 &&
					data.parentService.isChangeHeader(boqItem)) {
					readOnlyFields = _.without(allFields, 'Quantity');
					_.forEach(readOnlyFields, function (item) {
						fields.push({field: item, readonly: true});
					});
					if ((moduleName === 'procurement.contract' || moduleName === 'procurement.requisition') && boqItem.BoqItemWicBoqFk && boqItem.BoqItemWicItemFk && data && data.parentService.isFrameworkContractCallOffByWic()) {
						_.forEach(readOnlyFrameworkContractCallOff, function (item) {
							fields.push({field: item, readonly: true});
						});
					}
					platformRuntimeDataService.readonly(boqItem, fields);
				}
				else if ((moduleName === 'procurement.contract' || moduleName === 'procurement.requisition') && boqItem.BoqItemWicBoqFk && boqItem.BoqItemWicItemFk && data && data.parentService.isFrameworkContractCallOffByWic()) {
					_.forEach(readOnlyFrameworkContractCallOff, function (item) {
						fields.push({field: item, readonly: true});
					});
					platformRuntimeDataService.readonly(boqItem, fields);
				}

				if (moduleName !== 'procurement.package' && moduleName !== 'procurement.requisition') {
					let budgetFields = ['BudgetPerUnit', 'BudgetFixedUnit', 'BudgetTotal', 'BudgetFixedTotal'];

					_.forEach(budgetFields, function (item) {
						fields.push({field: item, readonly: true});
					});
					platformRuntimeDataService.readonly(boqItem, fields);
				}
				else {
					let budgetFields = ['BudgetPerUnit', 'BudgetFixedUnit', 'BudgetTotal', 'BudgetFixedTotal'];
					let budgetEditionInProcurement = mainService.getBudgetEditingInProcurement();
					if (!budgetEditionInProcurement){
						_.forEach(budgetFields, function (item) {
							fields.push({field: item, readonly: true});
						});
						platformRuntimeDataService.readonly(boqItem, fields);
					}
				}

				if (moduleName === 'procurement.pricecomparison.quote.requisition') {

					let isCrbBoq = boqMainService.isCrbBoq();
					let boqStructure = $injector.get('procurementPriceComparisonQuoteMainControllerService').boqData.boqStructure;
					if (boqStructure && _.isObject(boqStructure)) {
						if (boqStructure.BoqStandardFk === boqMainStandardTypes.crb) {
							isCrbBoq = true;
						}
					}
					if (isCrbBoq) {
						let referenceFields = ['Reference', 'Reference2'];
						_.forEach(referenceFields, function (item) {
							fields.push({field: item, readonly: true});
						});
						platformRuntimeDataService.readonly(boqItem, fields);
					}
				}

				if (moduleName === 'procurement.pricecomparison.quote.requisition') {
					if (boqItem.Price === 0){
						platformRuntimeDataService.readonly(boqItem, [{field: 'NotSubmitted', readonly: true}]);
						// This is a temp operation until creating boqItem with not submitted field assigned 0 by default.
						if (moduleName === 'procurement.pricecomparison.quote.requisition'){
							boqItem.NotSubmitted = true;
						}
					}
				}
			};

			/**
			 * enhance the boqMainReadonlyProcessor.processItem
			 * @param item
			 * @param data
			 * @returns {*}
			 */
			boqMainReadonlyProcessor.processItem = function (item, data) {
				var mainService = moduleContext.getMainService();
				if (angular.isDefined(mainService) && mainService !== null) {
					var moduleName = mainService.name;
					if (moduleName === 'procurement.quote.requisition' || moduleName === 'procurement.quote' ||
						moduleName === 'procurement.pricecomparison.quote.requisition' ||
						moduleName === 'procurement.pricecomparison.quote' || moduleName === 'procurement.pes.boq' ||
						moduleName === 'procurement.requisition' || moduleName === 'procurement.contract') {

						return service.processItem(item, data);
					}
					if (moduleName === 'procurement.package'){
						oldProcessItem(item, data);
						return processPackageItem(item);
					}
				}
				return oldProcessItem(item, data);
			};

			function processPackageItem(boqItem){
				let fields = [];
				let mainService = moduleContext.getMainService();
				let budgetFields = ['BudgetPerUnit', 'BudgetFixedUnit', 'BudgetTotal', 'BudgetFixedTotal'];
				let budgetEditionInProcurement = mainService.parentService().getBudgetEditingInProcurement();
				if (!budgetEditionInProcurement){
					_.forEach(budgetFields, function (item) {
						fields.push({field: item, readonly: true});
					});
					platformRuntimeDataService.readonly(boqItem, fields);
				}
			}

			return service;

		}]);
})(angular);