/**
 * Created by wed on 12/24/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementQuoteEvaluationAdaptorService', [
		'_',
		'basicsLookupdataLookupDescriptorService',
		'procurementQuoteHeaderDataService',
		'businesspartnerMainHeaderDataService',
		'commonBusinessPartnerEvaluationQuoteSyncHelper',
		function (_,
			basicsLookupdataLookupDescriptorService,
			procurementQuoteHeaderDataService,
			businessPartnerMainHeaderDataService,
			evaluationSyncHelper) {

			var senderName = 'QUOTE_EVALUATION';

			function getEvaluationSchemaId(rfqHeaderId) {
				var rfqHeaderEntity = _.find(basicsLookupdataLookupDescriptorService.getData('rfqHeader'), {Id: rfqHeaderId});
				return rfqHeaderEntity ? rfqHeaderEntity.EvaluationSchemaFk : null;
			}

			function getRfqHeaderId(parentService) {
				var selectedItem = parentService.getSelected();
				return selectedItem ? selectedItem.RfqHeaderFk : null;
			}

			return {
				getDialogTitleTranslation: function () {
					return 'businesspartner.main.screenQuoteEvaluationnDailogTitle';
				},
				getMainService: function () {
					return procurementQuoteHeaderDataService;
				},
				getParentService: function () {
					return procurementQuoteHeaderDataService;
				},
				getChartTitle: function (parentNode, parentService) {
					var selectedItem = parentService.getSelected();
					return parentNode && selectedItem ? (parentNode.EvaluationSchemaDescription || '') + ' - ' + (selectedItem.BusinessPartner.BusinessPartnerName1 || '') : '';
				},
				disabledCreate: function ($scope, parentService) {
					var evaluationSchemaId = getEvaluationSchemaId(getRfqHeaderId(parentService));
					return !evaluationSchemaId;
				},
				extendDataReadParams: function (readData) {
					var parentService = this.getParentService(),
						selectedItem = parentService.getSelected(),
						mainItemIds = selectedItem ? selectedItem.Id || -1 : -1,
						evaluationSchemaId = getEvaluationSchemaId(getRfqHeaderId(parentService));

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
				onServiceInitialized: function (service) {
					var parentService = this.getParentService();
					parentService.registerListLoadStarted(function () {
						procurementQuoteHeaderDataService.evaluationModificationKeeper.clear();
					});
					return service;
				},
				onDataReadComplete: function (readItems, data, parentService, evaluationTreeService) {
					var selectedItem = parentService.getSelected();
					if (selectedItem && selectedItem.BusinessPartner) {
						selectedItem.BusinessPartner.BusinessPartnerStatusFk = selectedItem.BusinessPartner.BpdStatusFk;
						evaluationTreeService.disableDelete(businessPartnerMainHeaderDataService.isBpStatusHasRight(selectedItem.BusinessPartner, 'AccessRightDescriptorFk', 'statusWithDeleteRight'));
					}
				},
				onEvaluationChanged: function (args) {
					procurementQuoteHeaderDataService.onEvaluationChanged.fire(angular.extend(args, {
						senderName: senderName
					}));
				},
				extendDetailColumns: function (evaluationColumns) {
					_.remove(evaluationColumns, function (item) {
						return item.rid === 'conheaderfk' || item.rid === 'conheaderdescription' || item.rid === 'invheaderfk' || item.rid === 'invheaderdescription';
					});
					return evaluationColumns;
				},
				extendCreateOptions: function (createOptions, parentService) {
					var quoteSelected = parentService.getSelected(),
						businessPartnerId = quoteSelected.BusinessPartnerFk,
						projectId = quoteSelected.ProjectFk,
						qtnHeaderId = quoteSelected.Id,
						evaluationSchemaId = getEvaluationSchemaId(getRfqHeaderId(parentService));

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
					parentService.registerSelectionChanged(evaluationTreeService.load);

					var syncHelper = evaluationSyncHelper.createSyncProvider({
						evaluationModificationKeeper: procurementQuoteHeaderDataService.evaluationModificationKeeper,
						senderName: senderName,
						evaluationTreeService: evaluationTreeService,
						quoteProvideFn: function () {
							return parentService.getIfSelectedIdElse(null);
						},
						evaluationSchemaProvideFn: function () {
							return getEvaluationSchemaId(getRfqHeaderId(parentService));
						}
					});

					this.onEvaluationChangedHandler = function (args) {
						syncHelper.evaluationChangedSyncHandler(args);
					};
					this.onListLoadedHandler = function () {
						syncHelper.listLoadedSyncHandler();
					};

					procurementQuoteHeaderDataService.onEvaluationChanged.register(this.onEvaluationChangedHandler);
					evaluationTreeService.registerHandleReadSucceeded(this.onListLoadedHandler);
				},
				onControllerDestroy: function (scope, parentService, evaluationTreeService) {
					parentService.unregisterSelectionChanged(evaluationTreeService.load);
					procurementQuoteHeaderDataService.onEvaluationChanged.unregister(this.onEvaluationChangedHandler);
					evaluationTreeService.unregisterHandleReadSucceeded(this.onListLoadedHandler);
				}
			};

		}]);
})(angular);
