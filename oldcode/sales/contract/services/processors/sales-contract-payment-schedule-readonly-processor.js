
(function (angular) {
	'use strict';
	/* global _ */
	angular.module('sales.contract').factory('ordPaymentScheduleReadonlyProcessor', [
		'$injector',
		'basicsCommonReadOnlyProcessor',
		'platformDataServiceSelectionExtension',
		'basicsLookupdataLookupDescriptorService',
		function (
			$injector,
			commonReadOnlyProcessor,
			platformDataServiceSelectionExtension,
			basicsLookupdataLookupDescriptorService
		) {

			return function (parentService) {
				var options = {
					typeName: 'OrdPaymentScheduleDto',
					moduleSubModule: 'Sales.Contract',
					uiStandardService: 'salesContractPaymentScheduleUIStandardService',
					readOnlyFields: ['Code','DescriptionInfo','DatePayment','DateRequest',
						'PercentOfContract','AmountNet','AmountGross','Remaining','AmountNetOc','AmountGrossOc','RemainingOc','CommentText',
						'IsDone','PsdScheduleFk','PsdActivityFk','BasPaymentTermFk', 'Sorting', 'BilTypeFk', 'BilHeaderFk', 'ControllingUnitFk', 'TotalPercent','DatePosted']
				};
				var readonlyFieldsInFinalLine = ['PercentOfContract', 'TotalPercent', 'AmountNet', 'AmountGross', 'AmountNetOc', 'AmountGrossOc', 'Sorting', 'Code'];
				var readonlyFieldsInParentLine = ['PercentOfContract'];
				var readonlyFieldsInChildLine = ['TotalPercent'];

				var service = commonReadOnlyProcessor.createReadOnlyProcessor(options);
				var ordPsStatuss = null;
				let dataService = null

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
					if (item.IsFinal) {
						var isReadonlyFieldInFianlLine = _.find(readonlyFieldsInFinalLine, function (i) { return i === model; });
						if (isReadonlyFieldInFianlLine) {
							return false;
						}
					}
					if (item.IsStructure && !item.PaymentScheduleFk) {
						var isReadonlyFieldInParentLine = _.find(readonlyFieldsInParentLine, function (i) { return i === model; });
						if (isReadonlyFieldInParentLine) {
							return false;
						}
					}
					if (item.IsStructure && item.PaymentScheduleFk) {
						var isReadonlyFieldInChildLine = _.find(readonlyFieldsInChildLine, function (i) { return i === model; });
						if (isReadonlyFieldInChildLine) {
							return false;
						}
					}
					if (!item.IsStructure && model === 'TotalPercent') {
						return false;
					}
					if (item.IsDone && model !== 'IsDone') {
						return false;
					}
					if (item.Id === -1) {
						return false;
					}
					var editable = true;
					var mainServiceSelected = parentService.getSelected();
					var moduleState;
					dataService = dataService ?? $injector.get('salesContractPaymentScheduleDataService');
					if (dataService.parentIsChangeOrderNIsConsolidate(mainServiceSelected)) {
						return false;
					}
					if (ordPsStatuss === null) {
						ordPsStatuss = basicsLookupdataLookupDescriptorService.getData('OrdPsStatus');
					}
					if (item.OrdPsStatusFk && ordPsStatuss[item.OrdPsStatusFk] && ordPsStatuss[item.OrdPsStatusFk]['IsReadonly']) {
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