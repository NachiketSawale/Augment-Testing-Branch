
(function (angular) {
	'use strict';

	/* jshint -W072 */
	angular.module('procurement.common').factory('procurementCommonPaymentScheduleReadonlyProcessor', [
		'basicsCommonReadOnlyProcessor',
		'platformDataServiceSelectionExtension',
		'procurementContextService',
		'basicsLookupdataLookupDescriptorService',
		function (
			commonReadOnlyProcessor,
			platformDataServiceSelectionExtension,
			moduleContext,
			basicsLookupdataLookupDescriptorService
		) {

			return function (parentService) {
				var moduleName = parentService.getModule().name;

				var options = {
					typeName: 'PrcPaymentScheduleDto',
					moduleSubModule: 'Procurement.Common',
					uiStandardService: 'procurementCommonPaymentScheduleUIStandardService',
					readOnlyFields: ['Code','Description','DatePayment','DateRequest',
						'PercentOfContract','AmountNet','AmountGross','Remaining','AmountNetOc','AmountGrossOc','RemainingOc','CommentText',
						'IsDone','PsdScheduleFk','PsdActivityFk','BasPaymentTermFk', 'Sorting', 'InvTypeFk','DatePosted']
				};

				var service = commonReadOnlyProcessor.createReadOnlyProcessor(options);
				var prcPsStatuss = null;

				service.handlerItemReadOnlyStatus = function (item) {
					// add ProjectFk for schedule filter use
					var selectedItem = parentService.getSelected();
					if(!platformDataServiceSelectionExtension.isSelection(selectedItem)) {
						return false;
					}

					item.ProjectFk = selectedItem.ProjectFk;
					service.setFieldsReadOnly(item);
					return true;
				};

				/* jshint -W074 */
				service.getCellEditable = function (item, model) {
					if (item.IsDone && model !== 'IsDone') {
						return false;
					}
					if (item.Id === -1) {
						return false;
					}
					var editable = true;
					var mainService = moduleContext.getMainService();
					var mainServiceSelected = mainService.getSelected();
					var moduleState;
					if (moduleName === 'procurement.contract' && mainServiceSelected && mainServiceSelected.ContractHeaderFk) {
						return false;
					}
					if (moduleName === 'procurement.requisition' && mainServiceSelected && mainServiceSelected.ReqHeaderFk) {
						return false;
					}
					if (prcPsStatuss === null) {
						prcPsStatuss = basicsLookupdataLookupDescriptorService.getData('PrcPsStatus');
					}
					if (item.PrcPsStatusFk && prcPsStatuss[item.PrcPsStatusFk] && prcPsStatuss[item.PrcPsStatusFk]['IsReadonly']) {
						return false;
					}
					moduleState = {IsReadonly: false};
					if (moduleState.IsReadonly) {
						editable = false;
						return editable;
					}

					switch(model)
					{
						case 'PsdActivityFk' :
							editable = !!item.PsdScheduleFk;
							return editable;
						case 'PsdScheduleFk' :
							var selectedItem = parentService.getSelected();
							if(platformDataServiceSelectionExtension.isSelection(selectedItem)) {
								editable = !!parentService.getSelected().ProjectFk;
							}

							return editable;
						default :
							return true;
					}


				};

				return service;
			};
		}]);
})(angular);