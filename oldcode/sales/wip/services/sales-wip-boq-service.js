/**
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesWipBoqService
	 * @function
	 *
	 * @description
	 * salesWipBoqService is a data service for managing boqs in context of wips
	 */
	salesWipModule.factory('salesWipBoqService', ['_', 'globals', '$injector', 'salesWipService', 'platformDataServiceFactory', 'salesCommonBoqReadonlyProcessor','salesCommonBoqServiceDecorator',
		function (_, globals, $injector, salesWipService, platformDataServiceFactory, salesCommonBoqReadonlyProcessor, salesCommonBoqServiceDecorator) {

			var salesWipBoqServiceOption = {
				flatLeafItem: {
					module: salesWipModule,
					serviceName: 'salesWipBoqService',
					httpCRUD: {route: globals.webApiBaseUrl + 'sales/wip/boq/'},
					dataProcessor: [salesCommonBoqReadonlyProcessor],
					presenter: {
						list: {
							isInitialSorted: true, sortOptions: {initialSortColumn: {field: 'boqrootitem.reference', id: 'boqRootItem.reference'}, isAsc: true, doNumericComparison: true},
							incorporateDataRead: incorporatedDataRead
						}
					},
					entityRole: {
						leaf: {
							itemName: 'WipBoqComposite',
							parentService: salesWipService,
							parentFilter: 'wipId'
						}
					},
					filterByViewer: true
				}
			};

			// Complete this options with general options
			salesCommonBoqServiceDecorator.completeServiceOptions(salesWipBoqServiceOption);

			var serviceContainer = platformDataServiceFactory.createNewComplete(salesWipBoqServiceOption);

			// Overwrite standard createItem to call dialog for user entries first before doing the creation of the wip boq
			salesCommonBoqServiceDecorator.decorate(serviceContainer);
			var service = serviceContainer.service;

			function incorporatedDataRead(result, data) {

				// TODO: see 104649
				// we will deactivate update amounts for existing values here
				// because wip should behave like all other sales modules
				// checkWipValueForUpdate(result);

				// The following service method incorporateDataRead is added by the salesCommonBoqServiceDecorator.
				// If any changes in the behavior are needed have a look there.
				serviceContainer.data.sortByColumn(result);
				return service.incorporateDataRead(result, data);
			}

			/*
			TODO: check if updateWipValue() can be removed
			function calculateWipValueData(vatPercent, wipBoqsData) {
				var sumFinalprice = _.sumBy(wipBoqsData, 'BoqRootItem.Finalprice');
				var sumFinalpriceOc = _.sumBy(wipBoqsData, 'BoqRootItem.FinalpriceOc');

				return {
					sumFinalprice: sumFinalprice,
					sumFinalpriceOc: sumFinalpriceOc,
					sumFinalpriceVat: (vatPercent/100.0) * sumFinalprice,
					sumFinalpriceOcVat: (vatPercent/100.0) * sumFinalpriceOc
				};
			}

			// TODO: check if updateWipValue() can be removed
			// update wip value in wip header
			function updateWipValue(wipBoqsData, wipValueData) {
				var wipBoqs = wipBoqsData || service.getList();
				var selectedWip = salesWipService.getSelected();

				if (_.isArray(wipBoqs) && selectedWip) { // also update on empty array!
					// sum up final prices of all available BoQs
					salesWipService.getVatPercent(selectedWip).then(function (vatPercent) {
						vatPercent = vatPercent || 0;
						var wipValueData = wipValueData || calculateWipValueData(vatPercent, wipBoqs);

						// needs to be updated?
						if (Math.abs(selectedWip.AmountNet - wipValueData.sumFinalprice) > 0 ||
							Math.abs(selectedWip.AmountNetOc - wipValueData.sumFinalpriceOc) > 0 ||
							Math.abs(selectedWip.WipVat - wipValueData.sumFinalpriceVat) > 0 ||
							Math.abs(selectedWip.WipVatOc - wipValueData.sumFinalpriceOcVat) > 0
						) {
							selectedWip.AmountNet = wipValueData.sumFinalprice;
							selectedWip.AmountNetOc = wipValueData.sumFinalpriceOc;
							selectedWip.WipVat = wipValueData.sumFinalpriceVat;
							selectedWip.WipVatOc = wipValueData.sumFinalpriceOcVat;
							selectedWip.AmountGross = wipValueData.sumFinalprice + wipValueData.sumFinalpriceVat;
							selectedWip.AmountGrossOc = wipValueData.sumFinalpriceOc + wipValueData.sumFinalpriceOcVat;

							// #106025
							var state = $injector.get('platformModuleStateService').state(salesWipService.getModule());
							if (!_.isEmpty(_.get(state, 'modifications.BoqItemToSave')) ||
								!_.isEmpty(_.get(state, 'modifications.BoqItemToDelete'))) {
								salesWipService.markItemAsModified(selectedWip);
							}
						}
					});
				}
			}

			// check if wip value needs to be recalculated
			// TODO: see 104649 (deactivated at the moment)
			function checkWipValueForUpdate(wipBoqs) {
				var selectedWip = salesWipService.getSelected();
				var isReadOnly = salesWipService.isReadOnlyStatus(selectedWip);

				//TODO: see #100317
				salesWipService.getVatPercent(selectedWip).then(function (vatPercent) {
					vatPercent = vatPercent || 0;
					var wipValueData = calculateWipValueData(vatPercent, wipBoqs);

					if (_.get(_.first(wipBoqs), 'WipBoq.WipHeaderFk') === selectedWip.Id && (
						Math.abs(wipValueData.sumFinalprice - selectedWip.AmountNet) > 1 ||   // check number differ
						Math.abs(wipValueData.sumFinalpriceVat - selectedWip.WipVat) > 1 ||
						Math.abs(wipValueData.sumFinalpriceOc - selectedWip.AmountNetOc) > 1 ||
						Math.abs(wipValueData.sumFinalpriceOcVat - selectedWip.WipVatOc) > 1) &&
						!isReadOnly && _.isBoolean(isReadOnly) // update only if not readonly
					) {
						updateWipValue(wipBoqs, wipValueData);
					}
				});
			}
			*/

			// TODO: see 104649 (replaced by updateAmounts)
			// service.registerItemModified(updateWipValue);

			// update amounts in wip header
			function updateAmounts() {
				var boqsData = service.getList();
				var sumFinalprice = _.sumBy(boqsData, 'BoqRootItem.Finalprice');
				var sumFinalgross = _.sumBy(boqsData, 'BoqRootItem.Finalgross');
				var sumFinalpriceOc = _.sumBy(boqsData, 'BoqRootItem.FinalpriceOc');
				var sumFinalgrossOc = _.sumBy(boqsData, 'BoqRootItem.FinalgrossOc');

				salesWipService.updateAmounts(sumFinalprice, sumFinalpriceOc, sumFinalgross, sumFinalgrossOc);
			}

			service.registerItemModified(updateAmounts);

			service.registerEntityDeleted(updateAmounts);

			return service;
		}
	]);
})();
