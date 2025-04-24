(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemRowService', [
		'_',
		'platformRuntimeDataService',
		'procurementPriceComparisonRowFactory',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonItemService',
		function (
			_,
			platformRuntimeDataService,
			rowFactory,
			commonService,
			itemService) {

			let service = rowFactory.getService('procurementPriceComparisonItemRowService',
				{
					compareType: commonService.constant.compareType.prcItem,
					deviationFields: commonService.itemDeviationFields,
					parentService: itemService,
					setDataReadOnly: setDataReadOnly
				});

			service.setDataReadOnly = setDataReadOnly;

			function setDataReadOnly(readData, deviationFields, isDeviationColumn) {
				let fields = [
					commonService.itemCompareFields.rank, commonService.itemCompareFields.percentage,
					commonService.itemCompareFields.prcItemEvaluationFk, commonService.itemCompareFields.userDefined1,
					commonService.itemCompareFields.userDefined2, commonService.itemCompareFields.userDefined3,
					commonService.itemCompareFields.userDefined4, commonService.itemCompareFields.userDefined5,
					commonService.itemCompareFields.leadTime, commonService.itemCompareFields.leadTimeExtra,
					commonService.constant.Generals, commonService.constant.Characteristics,
					commonService.itemCompareFields.absoluteDifference, commonService.itemCompareFields.uomFk,
					commonService.itemCompareFields.exQtnIsEvaluated, commonService.itemCompareFields.notSubmitted,
					commonService.itemCompareFields.paymentTermPaFk, commonService.itemCompareFields.paymentTermFiFk,
					commonService.itemCompareFields.externalCode, commonService.itemCompareFields.alternativeBid,
					commonService.itemCompareFields.discountComment, commonService.itemCompareFields.commentContractor,
					commonService.itemCompareFields.isFreeQuantity,
					commonService.itemCompareFields.co2Project,
					commonService.itemCompareFields.co2ProjectTotal,
					commonService.itemCompareFields.co2Source,
					commonService.itemCompareFields.co2SourceTotal,
					commonService.itemCompareFields.prjChangeFk,
					commonService.itemCompareFields.prjChangeStatusFk
				];

				_.forEach(readData, function (item) {
					let readonlyFields = [];
					if (_.includes(fields, item.Field)) {
						if (item.Field === commonService.itemCompareFields.prcItemEvaluationFk ||
							item.Field === commonService.itemCompareFields.userDefined1 ||
							item.Field === commonService.itemCompareFields.userDefined2 ||
							item.Field === commonService.itemCompareFields.userDefined3 ||
							item.Field === commonService.itemCompareFields.userDefined4 ||
							item.Field === commonService.itemCompareFields.userDefined5 ||
							item.Field === commonService.itemCompareFields.leadTime ||
							item.Field === commonService.itemCompareFields.leadTimeExtra ||
							item.Field === commonService.constant.Generals ||
							item.Field === commonService.constant.Characteristics ||
							item.Field === commonService.itemCompareFields.absoluteDifference ||
							item.Field === commonService.itemCompareFields.uomFk ||
							item.Field === commonService.itemCompareFields.exQtnIsEvaluated ||
							item.Field === commonService.itemCompareFields.notSubmitted ||
							item.Field === commonService.itemCompareFields.paymentTermFiFk ||
							item.Field === commonService.itemCompareFields.paymentTermPaFk||
							item.Field === commonService.itemCompareFields.prjChangeFk||
							item.Field === commonService.itemCompareFields.prjChangeStatusFk) {
							readonlyFields = [
								{field: 'ShowInSummary', readonly: true},
								{field: 'IsLeading', readonly: true}
							];
						} else {
							readonlyFields = [
								{field: 'IsLeading', readonly: true}
							];
						}
					}
					if (!_.includes(commonService.itemAllowEditVisibleFields, item.Field)) {
						readonlyFields.push({field: 'AllowEdit', readonly: true});
					}
					let highlightFields = commonService.highlightRowReadonly(item, deviationFields, isDeviationColumn);
					readonlyFields = readonlyFields.concat(highlightFields);
					platformRuntimeDataService.readonly(item, readonlyFields);
				});
			}

			return service;
		}]);
})(angular);
