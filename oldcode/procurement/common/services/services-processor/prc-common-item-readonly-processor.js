/**
 * Created by wwa on 1/11/2016.
 */
/**
 * Created by wwa on 1/4/2016.
 */
(function (angular) {
	'use strict';
	/* global _ */

	/* jshint -W072 */
	angular.module('procurement.common').factory('procurementCommonPrcItemReadonlyProcessor', [
		'basicsCommonReadOnlyProcessor',
		'procurementContextService',
		'prcGetIsCalculateOverGrossService',
		function (
			commonReadOnlyProcessor,
			moduleContext,
			prcGetIsCalculateOverGrossService) {

			let service = commonReadOnlyProcessor.createReadOnlyProcessor({
				uiStandardService: 'procurementCommonItemUIStandardService',
				readOnlyFields: ['TargetPrice', 'TargetTotal', 'PrcStructureFk', 'DateRequired', 'Price', 'PriceOc', 'prcpriceconditionfk', 'priceunit', 'basuompriceunitfk', 'LeadTimeExtra', 'MdcTaxCodeFk',
					'SafetyLeadTime', 'BufferLeadTime', 'SellUnit', 'LeadTime', 'MinQuantity', 'DiscountAbsolute', 'DiscountAbsoluteOc', 'DiscountAbsoluteGross', 'DiscountAbsoluteGrossOc', 'BudgetPerUnit', 'BudgetTotal', 'BudgetFixedUnit', 'BudgetFixedTotal', 'TotalGross', 'TotalGrossOc']
			});
			let isPackage = false;
			let isRequisition = false;
			let editAble;
			let budgetEditionInProcurement = false;
			let frameworkContractCallOffReadonlyFields = ['Description1', 'BasUomFk', 'Price', 'PriceOc', 'PriceGross', 'PriceGrossOc', 'PrcStructureFk'];
			service.handlerItemReadOnlyStatus = function (item) {
				if (moduleContext.getMainService()) {
					let parentService = moduleContext.getMainService();
					isPackage = parentService.name === 'procurement.package';
					isRequisition = parentService.name === 'procurement.requisition';
					if (isPackage || isRequisition) {
						let headerService = isPackage ? parentService.parentService() : parentService;
						if (typeof headerService.getBudgetEditingInProcurement === 'function') {
							budgetEditionInProcurement = headerService.getBudgetEditingInProcurement();
						}
					}
					let readOnyStatus = moduleContext.isReadOnly;
					service.setRowReadonlyFromLayout(item, readOnyStatus);
					return readOnyStatus;
				}
				return true;
			};

			service.getCellEditable = function (item, model) {
				let editable = true;
				let mainService = moduleContext.getMainService();
				let moduleName = mainService.name;
				isPackage = mainService.name === 'procurement.package';
				if ((moduleName === 'procurement.contract' && mainService.isFrameworkContractCallOffByMdc() && item.MdcMaterialFk) ||
					(moduleName === 'procurement.requisition' && mainService.isFrameworkContractCallOffByMdc() && item.MdcMaterialFk)) {
					let frameworkContractCallOffReadonlyField = _.find(frameworkContractCallOffReadonlyFields, function (e) {return e === model;});
					return !frameworkContractCallOffReadonlyField;
				}
				switch (model) {
					case 'DiscountAbsolute':
					case 'DiscountAbsoluteOc':
					case 'DiscountAbsoluteGross':
					case 'DiscountAbsoluteGrossOc': {
						if (item.Price === 0) {
							editable = false;
						}
						break;
					}
					case 'DateRequired':
						editable = !item.Hasdeliveryschedule;
						break;
					case 'PrcStructureFk':
						editable = !item.MdcMaterialFk;
						break;
					case 'TargetPrice':
					case 'TargetTotal':
						editable = isPackage;
						break;
					case 'LeadTimeExtra':
						editable = !item.HasLeadTimeFormula;
						break;
					case 'SellUnit':
					case 'LeadTime':
					case 'MinQuantity':
						if (moduleName === 'procurement.qto') {
							editable = true;
						} else {
							editable = !item.MdcMaterialFk;
						}
						break;
					case 'MdcTaxCodeFk':
						if (moduleName === 'procurement.contract') {
							let parentItem = mainService.getSelected();
							if (parentItem && angular.isDefined(parentItem.Id)) {
								editable = !parentItem.MaterialCatalogFk;
							} else {
								editable = false;
							}
						}
						break;
					case 'SafetyLeadTime':
					case 'BufferLeadTime':
						if (moduleName === 'procurement.contract' || moduleName === 'procurement.requisition') {
							editable = false;
						}
						break;
					case 'Price':
					case 'PriceOc':
						editable = !item.HasScope;
						break;
					case 'BudgetPerUnit':
						editAble = isPackage ? mainService.parentService().getHeaderEditAble() : true;
						if (_.includes(['procurement.package', 'procurement.requisition'], moduleName) && budgetEditionInProcurement && editAble) {
							editable = item.BudgetFixedUnit;
						} else {
							editable = false;
						}
						break;
					case 'BudgetTotal':
						editAble = isPackage ? mainService.parentService().getHeaderEditAble() : true;
						if (_.includes(['procurement.package', 'procurement.requisition'], moduleName) && budgetEditionInProcurement && editAble) {
							editable = item.BudgetFixedTotal;
						} else {
							editable = false;

						}
						break;
					case 'BudgetFixedUnit':
						editable = (_.includes(['procurement.package', 'procurement.requisition'], moduleName) && budgetEditionInProcurement);
						break;
					case 'BudgetFixedTotal':
						editable = (_.includes(['procurement.package', 'procurement.requisition'], moduleName) && budgetEditionInProcurement);
						break;
					case 'TotalGross':
					case 'TotalGrossOc':
						if (moduleName !== 'procurement.contract') {
							editable = false;
						} else {
							editable = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						}
						break;
					default:
						break;
				}

				return editable;
			};

			return service;
		}]);
})(angular);