/**
 * Created by chi on 8/2/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementCommonSuggestedBidderReadonlyProcessor', procurementCommonSuggestedBidderReadonlyProcessor);

	procurementCommonSuggestedBidderReadonlyProcessor.$inject = ['basicsCommonReadOnlyProcessor', 'procurementContextService'];

	function procurementCommonSuggestedBidderReadonlyProcessor(commonReadOnlyProcessor, procurementContextService) {

		var service = commonReadOnlyProcessor.createReadOnlyProcessor({
			typeName: 'PrcSuggestedBidderDto',
			moduleSubModule: 'Procurement.Common',
			uiStandardService: 'procurementCommonSuggestedBiddersUIStandardService',
			readOnlyFields: ['SubsidiaryFk', 'ContactFk', 'BusinessPartnerFk', 'BpName1', 'BpName2', 'Street', 'City', 'Zipcode', 'Email',
				'CountryFk', 'Telephone', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'CommentText', 'Remark']
		});

		service.handlerItemReadOnlyStatus = function (item) {
			if (!procurementContextService.getMainService()) {
				return;
			}
			service.setRowReadonlyFromLayout(item);
		};

		service.getCellEditable = function (item, model) {
			var mainService = procurementContextService.getMainService();
			var editable = true;
			var originalModuleName = mainService && mainService.getModule().name || '';
			if (originalModuleName === 'procurement.requisition') {
				var mainServiceSelected = mainService.getSelected();
				var moduleState = procurementContextService.getMainService().getModuleState(mainServiceSelected);
				if (moduleState.IsReadonly) {
					editable = false;
					return editable;
				}
			}

			if (originalModuleName === 'procurement.rfq') {
				editable = false;
				return editable;
			}

			if (model === 'SubsidiaryFk' || model === 'ContactFk') {
				editable = item.BusinessPartnerFk !== null;
			} else if (model === 'BpName2' || model === 'Street' ||
				model === 'City' || model === 'Zipcode' || model === 'Email' ||
				model === 'CountryFk' || model === 'Telephone' || model === 'UserDefined1' ||
				model === 'UserDefined2' || model === 'UserDefined3' || model === 'UserDefined4' ||
				model === 'UserDefined5' || model === 'CommentText' || model === 'Remark') {
				editable = item.BusinessPartnerFk === null;
			}
			if (model === 'BusinessPartnerFk') {
				editable = false;
			}

			return editable;
		};

		return service;
	}
})(angular);