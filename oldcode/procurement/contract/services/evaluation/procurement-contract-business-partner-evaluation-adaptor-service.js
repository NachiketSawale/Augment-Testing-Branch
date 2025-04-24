/**
 * Created by chi on 10/15/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementContractBusinessPartnerEvaluationAdaptorService', procurementContractBusinessPartnerEvaluationAdaptorService);

	procurementContractBusinessPartnerEvaluationAdaptorService.$inject = [
		'procurementContractHeaderDataService',
		'businesspartnerMainHeaderDataService'
	];

	function procurementContractBusinessPartnerEvaluationAdaptorService(
		procurementContractHeaderDataService,
		businesspartnerMainHeaderDataService
	) {
		return {
			getMainService: function () {
				return procurementContractHeaderDataService;
			},
			getParentService: function () {
				return procurementContractHeaderDataService;
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
					selectedItem = parentService.getSelected(),
					mainItemId = selectedItem ? selectedItem.Id || -1 : -1,
					businessPartnerId = selectedItem ? selectedItem.BusinessPartnerFk || -1 : -1;
				readData.filter = '?mainItemId=' + mainItemId + '&mainItemType=ContractHeader' + '&businessPartnerId=' + businessPartnerId;
			},
			extendCreateOptions: function (createOptions, parentService) {
				var selected = parentService.getSelected();
				var projectId = selected.ProjectFk,
					contractId = selected.Id,
					businessPartnerId = selected.BusinessPartnerFk,
					qtnHeaderId = selected.QtnHeaderFk;
				return angular.extend(createOptions, {
					projectFk: projectId,
					conHeaderFk: contractId,
					businessPartnerId: businessPartnerId,
					qtnHeaderFk: qtnHeaderId
				});
			},
			onDataReadComplete: function (readItems, data, parentService, evaluationTreeService) {
				var selectedItem = parentService.getSelected();
				if (selectedItem && selectedItem.BusinessPartner) {
					selectedItem.BusinessPartner.BusinessPartnerStatusFk = selectedItem.BusinessPartner.BpdStatusFk;
					evaluationTreeService.disableDelete(businesspartnerMainHeaderDataService.isBpStatusHasRight(selectedItem.BusinessPartner, 'AccessRightDescriptorFk', 'statusWithDeleteRight'));
				}
			},
			onControllerCreate: function (scope, parentService, evaluationTreeService) {
				parentService.registerSelectionChanged(evaluationTreeService.load);
			},
			onControllerDestroy: function (scope, parentService, evaluationTreeService) {
				parentService.unregisterSelectionChanged(evaluationTreeService.load);
			}
		};
	}
})(angular);