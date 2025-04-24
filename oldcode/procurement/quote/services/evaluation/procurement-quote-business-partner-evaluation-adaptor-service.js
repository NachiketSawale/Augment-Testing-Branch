/**
 * Created by wed on 12/27/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementQuoteBusinessPartnerEvaluationAdaptorService', [
		'procurementQuoteHeaderDataService',
		'businesspartnerMainHeaderDataService',
		'commonBusinessPartnerEvaluationBusinessPartnerSyncHelper',
		function (procurementQuoteHeaderDataService,
			businessPartnerMainHeaderDataService,
			evaluationSyncHelper) {

			var senderName = 'BUSINESS_PARTNER_EVALUATION';

			return {
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
					var selectedItem = parentService.getSelected();
					return !(selectedItem && angular.isDefined(selectedItem.BusinessPartnerFk));
				},
				extendDataReadParams: function (readData) {
					var parentService = this.getParentService(),
						selectedItem = parentService.getSelected();
					readData.filter = '?MainItemId=' + (selectedItem && angular.isDefined(selectedItem.BusinessPartnerFk) ? selectedItem.BusinessPartnerFk : -1);
				},
				onEvaluationChanged: function (args) {
					procurementQuoteHeaderDataService.onEvaluationChanged.fire(angular.extend(args, {
						senderName: senderName
					}));
				},
				extendCreateOptions: function (createOptions, parentService) {
					var quoteSelected = parentService.getSelected(),
						projectId = quoteSelected.ProjectFk,
						qtnHeaderId = quoteSelected.Id;
					return angular.extend(createOptions, {
						projectFk: projectId,
						qtnHeaderFk: qtnHeaderId,
						businessPartnerId: (quoteSelected && angular.isDefined(quoteSelected.BusinessPartnerFk) ? quoteSelected.BusinessPartnerFk : -1)
					});
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
				onControllerCreate: function (scope, parentService, evaluationTreeService) {

					var syncHelper = evaluationSyncHelper.createSyncProvider({
						evaluationModificationKeeper: procurementQuoteHeaderDataService.evaluationModificationKeeper,
						senderName: senderName,
						evaluationTreeService: evaluationTreeService,
						businessPartnerProvideFn: function () {
							var selectedItem = parentService.getSelected();
							return selectedItem ? (selectedItem.BusinessPartner || {Id: selectedItem.Id}) : null;
						}
					});

					this.onEvaluationChangedHandler = function (args) {
						syncHelper.evaluationChangedSyncHandler(args);
					};
					this.onListLoadedHandler = function () {
						syncHelper.listLoadedSyncHandler();
					};

					parentService.registerSelectionChanged(evaluationTreeService.load);
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