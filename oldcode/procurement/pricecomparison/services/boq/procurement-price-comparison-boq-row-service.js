(function (angular) {
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonBoqRowService', [
		'_',
		'platformRuntimeDataService',
		'procurementPriceComparisonRowFactory',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqCompareRows',
		'procurementPriceComparisonBoqService',
		function (
			_,
			platformRuntimeDataService,
			rowFactory,
			commonService,
			boqCompareRows,
			boqService
		) {
			var service = rowFactory.getService(
				'procurementPriceComparisonBoqRowService',
				{
					compareType: commonService.constant.compareType.boqItem,
					deviationFields: commonService.boqDeviationFields,
					parentService: boqService,
					setDataReadOnly: setDataReadOnly
				}
			);

			service.setDataReadOnly = setDataReadOnly;

			function setDataReadOnly(readData, deviationFields, isDeviationColumn) {
				// (1) 'Rank/ Percentage/ Quantity/ CommentContractor/ CommentClient/ PrcItemEvaluationFk' can't be set as a 'Leading Field'.
				// (2) 'Quantity/ CommentContractor/ CommentClient/ PrcItemEvaluationFk' can't be shown in 'ShowInSummary' for bidders
				//       Note: special case, for 'BaseBoq/ Target', no 'Percentage/ Rank' value showed in 'showInSummary'.
				let fields = [
					boqCompareRows.rank,
					boqCompareRows.percentage,
					boqCompareRows.quantity,
					boqCompareRows.commentContractor,
					boqCompareRows.commentClient,
					boqCompareRows.prcItemEvaluationFk,
					boqCompareRows.bidderComments,
					commonService.quoteCompareFields.code,
					commonService.quoteCompareFields.description,
					commonService.quoteCompareFields.quoteDate,
					commonService.quoteCompareFields.receiveDate,
					commonService.quoteCompareFields.priceFixingDate,
					commonService.quoteCompareFields.exchangeRate,
					commonService.quoteCompareFields.currency,
					commonService.quoteCompareFields.paymentTermPA,
					commonService.quoteCompareFields.paymentTermFI,
					commonService.quoteCompareFields.quoteStatus,
					commonService.quoteCompareFields.quoteVersion,
					commonService.constant.Generals,
					commonService.constant.Characteristics,
					boqCompareRows.absoluteDifference,
					boqCompareRows.notSubmitted,
					boqCompareRows.included,
					boqCompareRows.uomFk,
					boqCompareRows.isLumpsum,
					boqCompareRows.boqTotalRank,
					boqCompareRows.alternativeBid,
					boqCompareRows.exQtnIsEvaluated,
					boqCompareRows.userDefined1,
					boqCompareRows.userDefined2,
					boqCompareRows.userDefined3,
					boqCompareRows.userDefined4,
					boqCompareRows.userDefined5,
					boqCompareRows.externalCode,
					boqCompareRows.prjChangeFk,
					boqCompareRows.prjChangeStatusFk,
					boqCompareRows.quantityAdj
				];

				let readonlyShowInSummaryFields = [
					boqCompareRows.commentContractor,
					boqCompareRows.commentClient,
					boqCompareRows.prcItemEvaluationFk,
					boqCompareRows.quantity,
					boqCompareRows.bidderComments,
					commonService.quoteCompareFields.code,
					commonService.quoteCompareFields.description,
					commonService.quoteCompareFields.quoteDate,
					commonService.quoteCompareFields.receiveDate,
					commonService.quoteCompareFields.priceFixingDate,
					commonService.quoteCompareFields.exchangeRate,
					commonService.quoteCompareFields.currency,
					commonService.quoteCompareFields.paymentTermPA,
					commonService.quoteCompareFields.paymentTermFI,
					commonService.quoteCompareFields.quoteStatus,
					commonService.quoteCompareFields.quoteVersion,
					commonService.constant.Generals,
					commonService.constant.Characteristics,
					boqCompareRows.absoluteDifference,
					boqCompareRows.notSubmitted,
					boqCompareRows.included,
					boqCompareRows.uomFk,
					boqCompareRows.isLumpsum,
					boqCompareRows.boqTotalRank,
					boqCompareRows.alternativeBid,
					boqCompareRows.exQtnIsEvaluated,
					boqCompareRows.prjChangeFk,
					boqCompareRows.prjChangeStatusFk,
					boqCompareRows.quantityAdj
				];

				_.forEach(readData, function (item) {
					let readonlyFields = [];
					if (_.includes(fields, item.Field)) {
						if (_.includes(readonlyShowInSummaryFields, item.Field)) {
							readonlyFields.push({field: 'ShowInSummary', readonly: true});
						}
						readonlyFields.push({field: 'IsLeading', readonly: true});
					}

					// UR Breakdown
					if (_.includes(commonService.unitRateBreakDownFields, item.Field)) {
						readonlyFields.push({field: 'DescriptionInfo.Translated', readonly: true});
					}

					if (!_.includes(commonService.boqAllowEditVisibleFields, item.Field)) {
						readonlyFields.push({field: 'AllowEdit', readonly: true});
					} else {
						readonlyFields.push({field: 'AllowEdit', readonly: false});
					}

					let highlightFields = commonService.highlightRowReadonly(item, deviationFields, isDeviationColumn);
					readonlyFields = readonlyFields.concat(highlightFields);
					platformRuntimeDataService.readonly(item, readonlyFields);
				});
			}

			return service;
		}
	]);
})(angular);
