/**
 * Created by wed on 12/07/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonBusinessPartnerEvaluationAdaptorService', [
		'_',
		'basicsLookupdataLookupDescriptorService',
		'businesspartnerMainHeaderDataService',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonLineTypes',
		'commonBusinessPartnerEvaluationBusinessPartnerSyncHelper',
		function (_,
			basicsLookupDescriptorService,
			businessPartnerMainHeaderDataService,
			mainDataService,
			boqComparisonService,
			itemComparisonService,
			procurementPriceComparisonLineTypes,
			evaluationSyncHelper) {

			var currSelectedQuoteId = null,
				currSelectedLineType = null,
				senderName = 'BUSINESS_PARTNER_EVALUATION';

			function getQuoteItemSelectionChangedHandler(dataService, parentService, serviceData) {
				return function (selectedQuote) {

					parentService.allSelectedQuote = selectedQuote;
					serviceData.currentParentItem = selectedQuote;
					serviceData.selectedEntities = [];
					serviceData.selectedItem = null;

					if (selectedQuote && (selectedQuote.QtnHeaderId !== currSelectedQuoteId ||
						currSelectedLineType === procurementPriceComparisonLineTypes.grandTotal) &&
						selectedQuote.LineType !== procurementPriceComparisonLineTypes.grandTotal) {
						dataService.load();
					} else {
						if (!selectedQuote || selectedQuote.LineType === procurementPriceComparisonLineTypes.grandTotal) {
							// parentService.allSelectedQuote = null;
							serviceData.clearContent(serviceData);
						}
					}
					serviceData.selectionChanged.fire();
					currSelectedQuoteId = selectedQuote ? selectedQuote.QtnHeaderId : null;
					currSelectedLineType = selectedQuote ? selectedQuote.LineType : null;
				};
			}

			function getParentDeselectedHandler(dataService, parentService, serviceData) {
				return function () {
					parentService.allSelectedQuote = null;
					dataService.clearContent(serviceData);
					currSelectedQuoteId = null;
				};
			}

			return {
				isLoadAutomatically: function () {
					var parentService = this.getParentService();
					return !!parentService.allSelectedQuote;
				},
				getMainService: function () {
					return mainDataService;
				},
				getParentService: function () {
					return itemComparisonService;
				},
				getChartTitle: function (parentNode, parentService) {
					var selectedQtnId = parentService.allSelectedQuote ? parentService.allSelectedQuote.QtnHeaderId : null,
						customColumn = basicsLookupDescriptorService.getData('itemcustomcolumn') || basicsLookupDescriptorService.getData('boqcustomcolumn'),
						businessPartnerName1 = '';
					if (customColumn) {
						_.forEach(customColumn, function (value) {
							if (value.QuoteHeaderId === selectedQtnId) {
								businessPartnerName1 = value.Description;
							}
						});
					}
					return (parentNode.EvaluationSchemaDescription || '') + ' - ' + (businessPartnerName1 || '');
				},
				disabledCreate: function ($scope, parentService) {
					return !parentService.allSelectedQuote || parentService.allSelectedQuote.LineType === procurementPriceComparisonLineTypes.grandTotal;
				},
				extendDataReadParams: function (readData) {
					var parentService = this.getParentService(),
						selectedQuote = parentService.allSelectedQuote;
					readData.filter = '?MainItemId=' + (selectedQuote ? selectedQuote.BusinessPartnerId : -1);
				},
				onDataReadComplete: function (readItems, data, parentService, evaluationTreeService) {
					if (parentService.allSelectedQuote) {
						basicsLookupDescriptorService.loadItemByKey('businesspartner', parentService.allSelectedQuote.BusinessPartnerId).then(function (resultData) {
							resultData.BusinessPartnerStatusFk = resultData.BpdStatusFk;
							evaluationTreeService.disableDelete(businessPartnerMainHeaderDataService.isBpStatusHasRight(resultData, 'AccessRightDescriptorFk', 'statusWithDeleteRight'));
						});
					}
				},
				onEvaluationChanged: function (args) {
					mainDataService.onEvaluationChanged.fire(angular.extend(args, {
						senderName: senderName
					}));
					boqComparisonService.trySyncQuoteEvaluation();
					itemComparisonService.trySyncQuoteEvaluation();
				},
				extendCreateOptions: function (createOptions, parentService) {
					var projectId = parentService.allSelectedQuote.ProjectId,
						qtnHeaderId = parentService.allSelectedQuote.QtnHeaderId;

					return angular.extend(createOptions, {
						projectFk: projectId,
						qtnHeaderFk: qtnHeaderId,
						businessPartnerId: parentService.allSelectedQuote ? parentService.allSelectedQuote.BusinessPartnerId : -1
					});
				},
				onControllerCreate: function (scope, parentService, evaluationTreeService) {

					this.onQuoteItemSelectionChangedHandler = getQuoteItemSelectionChangedHandler(evaluationTreeService, parentService, evaluationTreeService.getContainerData());
					this.onParentDeselectedHandler = getParentDeselectedHandler(evaluationTreeService, parentService, evaluationTreeService.getContainerData());

					var syncHelper = evaluationSyncHelper.createSyncProvider({
						evaluationModificationKeeper: mainDataService.evaluationModificationKeeper,
						senderName: senderName,
						evaluationTreeService: evaluationTreeService,
						businessPartnerProvideFn: function () {
							return {
								Id: parentService.allSelectedQuote ? parentService.allSelectedQuote.BusinessPartnerId : -1
							};
						}
					});

					this.onEvaluationChangedHandler = function (args) {
						syncHelper.evaluationChangedSyncHandler(args);
					};
					this.onListLoadedHandler = function () {
						syncHelper.listLoadedSyncHandler();
					};

					mainDataService.onQuoteSelectedLoadEvaluation.register(this.onQuoteItemSelectionChangedHandler);
					mainDataService.onEvaluationChanged.register(this.onEvaluationChangedHandler);

					boqComparisonService.onRowDeselected.register(this.onParentDeselectedHandler);
					itemComparisonService.onRowDeselected.register(this.onParentDeselectedHandler);

					evaluationTreeService.registerHandleReadSucceeded(this.onListLoadedHandler);
				},
				onControllerDestroy: function (scope, parentService, evaluationTreeService) {
					mainDataService.onQuoteSelectedLoadEvaluation.unregister(this.onQuoteItemSelectionChangedHandler);
					mainDataService.onEvaluationChanged.unregister(this.onEvaluationChangedHandler);

					boqComparisonService.onRowDeselected.unregister(this.onParentDeselectedHandler);
					itemComparisonService.onRowDeselected.unregister(this.onParentDeselectedHandler);

					evaluationTreeService.unregisterHandleReadSucceeded(this.onListLoadedHandler);
				}
			};

		}]);
})(angular);
