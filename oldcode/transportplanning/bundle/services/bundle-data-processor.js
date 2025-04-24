/**
 * Created by waz on 8/3/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.bundle';

	angular.module(moduleName).factory('transportplanningBundleDataProcessor', TransportplanningBundleDataProcessor);

	TransportplanningBundleDataProcessor.$inject = ['platformRuntimeDataService', 'ppsCommonCustomColumnsServiceFactory', 'moment',
		'ppsCommonTransportInfoHelperService', 'ppsCommonCodGeneratorConstantValue', 'basicsCompanyNumberGenerationInfoService'];

	function TransportplanningBundleDataProcessor(platformRuntimeDataService, customColumnsServiceFactory, moment,
												  ppsCommonTransportInfoHelperService, ppsCommonCodGeneratorConstantValue, basicsCompanyNumberGenerationInfoService) {

		function processForTrsRequisition(item, data) {
			if (data.isParentTrsRequisitionAccepted(item)) {
				_.each(item, function (value, key) {
					if (key === 'LoadingDevice') {
						setColumnReadOnly(item, 'LoadingDevice.Quantity', true);
						setColumnReadOnly(item, 'LoadingDevice.RequestedFrom', true);
						setColumnReadOnly(item, 'LoadingDevice.RequestedTo', true);
						setColumnReadOnly(item, 'LoadingDevice.UomFk', true);
						setColumnReadOnly(item, 'LoadingDevice.TypeFk', true);
						setColumnReadOnly(item, 'LoadingDevice.Description', true);
						setColumnReadOnly(item, 'LoadingDevice.JobFk', true);
						setColumnReadOnly(item, 'LoadingDevice.ResourceFk', true);
					} else {
						setColumnReadOnly(item, key, true);
					}
				});
			} else {
				//setColumnReadOnly(item, 'LoadingDevice.Quantity', true);
				setColumnReadOnly(item, 'TrsRequisitionDate', ppsCommonTransportInfoHelperService.trsReqLinkOthers(item));
			}
		}

		function processItem(item, data) {
			if (item.ProjectFk !== null) {
				setColumnReadOnly(item, 'ProjectFk', true);
			}
			if (item.TrsRequisitionDate) {
				item.TrsRequisitionDate = moment.utc(item.TrsRequisitionDate);
			}
			if (item.RoutesInfo && item.RoutesInfo.PlannedDelivery) {
				item.RoutesInfo.PlannedDelivery = moment.utc(item.RoutesInfo.PlannedDelivery);
			}
			processForTrsRequisition(item, data);

			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			customColumnsService.updateDateTimeFields(item);

			if (_.isArray(item.ReadonlyCustomColumns)) {
				_.each(item.ReadonlyCustomColumns, function (column) {
					setColumnReadOnly(item, column, true);
				});
			}
			var categoryId = ppsCommonCodGeneratorConstantValue.CategoryConstant.TrsBundleCat;
			if(item.Version === 0 && categoryId > 0 &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsBundleNumberInfoService').hasToGenerateForRubricCategory(categoryId))
			{
				item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsBundleNumberInfoService').provideNumberDefaultText(categoryId, item.Code);
				setColumnReadOnly(item, 'Code', true);
			}
			else {
				setColumnReadOnly(item, 'Code', false);
			}
			setColumnReadOnly(item, 'ProductCollectionInfo.PrjStockLocationFk', true);
		}

		function setColumnReadOnly(item, column, flag) {
			var fields = [
				{field: column, readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		}

		return {
			processForTrsRequisition: processForTrsRequisition,
			processItem: processItem,
			setColumnReadOnly: setColumnReadOnly
		};
	}

})(angular);