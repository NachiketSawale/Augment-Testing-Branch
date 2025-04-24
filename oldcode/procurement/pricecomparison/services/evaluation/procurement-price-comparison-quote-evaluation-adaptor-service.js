/**
 * Created by wed on 12/25/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonQuoteEvaluationAdaptorService', [
		'_',
		'basicsLookupdataLookupDescriptorService',
		'businesspartnerMainHeaderDataService',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonItemService',
		'commonBusinessPartnerEvaluationQuoteSyncHelper',
		function (_,
			basicsLookupDescriptorService,
			businessPartnerMainHeaderDataService,
			mainDataService,
			procurementPriceComparisonLineTypes,
			boqComparisonService,
			itemComparisonService,
			evaluationSyncHelper) {

			var currSelectedQuoteId = null,
				currSelectedLineType = null,
				senderName = 'QUOTE_EVALUATION';

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
				getDialogTitleTranslation: function () {
					return 'businesspartner.main.screenQuoteEvaluationnDailogTitle';
				},
				getMainService: function () {
					return mainDataService;
				},
				getParentService: function () {
					return itemComparisonService;
				},
				getChartTitle: function (parentNode) {
					var selectedQtnId = parentNode.ChildrenItem[0].QtnHeaderFk,
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
					var allSelectedQuote = parentService.allSelectedQuote;
					if (!allSelectedQuote || allSelectedQuote.LineType === procurementPriceComparisonLineTypes.grandTotal) {
						return true;
					}
					var evaluationSchemaId = mainDataService.getEvaluationSchemaFromSelectedItem(allSelectedQuote ? allSelectedQuote.RfqHeaderId : null);
					return !allSelectedQuote || !evaluationSchemaId;
				},
				extendDataReadParams: function (readData) {
					var parentService = this.getParentService(),
						selectedQuote = parentService.allSelectedQuote,
						mainItemIds = selectedQuote ? selectedQuote.QtnHeaderId || -1 : -1,
						evaluationSchemaId = mainDataService.getEvaluationSchemaFromSelectedItem(parentService.allSelectedQuote ? parentService.allSelectedQuote.RfqHeaderId : null);
					readData.filter = '?MainItemId=' + mainItemIds + '&MainItemType=' + 'QuoteHeader';
					if (evaluationSchemaId){
						readData.filter += '&RfqEvaluationSchemaId=' + evaluationSchemaId;
					}
				},
				extendDataColumns: function (evaluationColumns) {
					_.remove(evaluationColumns, function (item) {
						return item.id === 'conheaderfk' || item.id === 'conheaderdescription' || item.id === 'invheaderfk' || item.id === 'invheaderdescription';
					});
					return evaluationColumns;
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
				extendDetailColumns: function (evaluationColumns) {
					_.remove(evaluationColumns, function (item) {
						return item.rid === 'conheaderfk' || item.rid === 'conheaderdescription' || item.rid === 'invheaderfk' || item.rid === 'invheaderdescription';
					});
					return evaluationColumns;
				},
				extendCreateOptions: function (createOptions, parentService) {
					var projectId = parentService.allSelectedQuote.ProjectId,
						qtnHeaderId = parentService.allSelectedQuote.QtnHeaderId,
						businessPartnerId = parentService.allSelectedQuote.BusinessPartnerId,
						evaluationSchemaId = mainDataService.getEvaluationSchemaFromSelectedItem(parentService.allSelectedQuote ? parentService.allSelectedQuote.RfqHeaderId : null);

					return angular.extend(createOptions, {
						businessPartnerId: businessPartnerId,
						projectFk: projectId,
						qtnHeaderFk: qtnHeaderId,
						evaluationSchemaId: evaluationSchemaId
					});
				},
				extendReadonlyFields: function (readonlyFields) {
					readonlyFields = readonlyFields.concat([
						{
							'field': 'QtnHeaderFk',
							'readonly': true
						}, {
							'field': 'EvaluationSchemaFk',
							'readonly': true
						}, {
							'field': 'ProjectFk',
							'readonly': true
						}
					]);
					return readonlyFields;
				},
				onControllerCreate: function (scope, parentService, evaluationTreeService) {
					this.onQuoteItemSelectionChangedHandler = getQuoteItemSelectionChangedHandler(evaluationTreeService, parentService, evaluationTreeService.getContainerData());
					this.onParentDeselectedHandler = getParentDeselectedHandler(evaluationTreeService, parentService, evaluationTreeService.getContainerData());

					var syncHelper = evaluationSyncHelper.createSyncProvider({
						evaluationModificationKeeper: mainDataService.evaluationModificationKeeper,
						senderName: senderName,
						evaluationTreeService: evaluationTreeService,
						quoteProvideFn: function () {
							return parentService.allSelectedQuote ? parentService.allSelectedQuote.QtnHeaderId : currSelectedQuoteId;
						},
						evaluationSchemaProvideFn: function () {
							return mainDataService.getEvaluationSchemaFromSelectedItem(parentService.allSelectedQuote ? parentService.allSelectedQuote.RfqHeaderId : null);
						}
					});

					this.onEvaluationChangedHandler = function (args) {
						syncHelper.evaluationChangedSyncHandler(args);
					};
					this.onListLoadedHandler = function () {
						syncHelper.listLoadedSyncHandler();
					};

					mainDataService.onQuoteSelectedLoadEvaluation.register(this.onQuoteItemSelectionChangedHandler);
					boqComparisonService.onRowDeselected.register(this.onParentDeselectedHandler);
					itemComparisonService.onRowDeselected.register(this.onParentDeselectedHandler);
					mainDataService.onEvaluationChanged.register(this.onEvaluationChangedHandler);
					evaluationTreeService.registerHandleReadSucceeded(this.onListLoadedHandler);
				},
				onControllerDestroy: function (scope, parentService, evaluationTreeService) {
					mainDataService.onQuoteSelectedLoadEvaluation.unregister(this.onQuoteItemSelectionChangedHandler);
					boqComparisonService.onRowDeselected.unregister(this.onParentDeselectedHandler);
					itemComparisonService.onRowDeselected.unregister(this.onParentDeselectedHandler);
					mainDataService.onEvaluationChanged.unregister(this.onEvaluationChangedHandler);
					evaluationTreeService.unregisterHandleReadSucceeded(this.onListLoadedHandler);
				}
			};

		}]);
})(angular);