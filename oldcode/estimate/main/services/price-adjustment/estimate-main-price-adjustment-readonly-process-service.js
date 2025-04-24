
(function (angular) {
	'use strict';
	var moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainPriceAdjustmentReadonlyProcessService', ['_','platformRuntimeDataService', 'estMainPriceAdjustmentUIFields','estimateMainService',
		function (_,platformRuntimeDataService, estMainPriceAdjustmentUIFields) {
			var service = {};
			service.processItem = function processItem(entity, data) {
				if (entity) {
					let fields = estMainPriceAdjustmentUIFields.AllFields;
					let specialFields = ['WqEstimatedPrice', 'WqAdjustmentPrice', 'WqTenderPrice' ,'AqEstimatedPrice', 'AqAdjustmentPrice', 'AqTenderPrice'];
					let specialFields1 = ['WqDeltaPrice','AqDeltaPrice'];
					let readonlyFields = [];

					if (data.getService().hasReadOnlyItem(entity)) {
						_.forEach(fields, function (field) {
							readonlyFields.push({field: field, readonly: true});
						});
					} else {
						let readOnlyURBFields = data.getService().getReadOnlyURBFiledName(entity);
						let isSpecialReadOnly = data.getService().hasSpecialReadOnly(entity);
						angular.forEach(entity, function (value, key) {
							if ((fields.includes(key) && entity.BoqLineTypeFk !== 0) || (readOnlyURBFields && readOnlyURBFields.some(e => key.indexOf(e) > -1))) {
								// set readonly except the position type
								readonlyFields.push({field: key, readonly: true});
							}
							if(isSpecialReadOnly) {
								if (specialFields.includes(key)) {
									readonlyFields.push({field: key, readonly: true});
									entity[key] = entity[key] !== null ? 0 : null;
								} else if (specialFields1.includes(key)) {
									entity[key] = entity[key] !== null ? 0 : null;
								}
							}
						});
					}
					if(data.getService().canEditWqTenderPrice(entity)) {
						_.remove(readonlyFields, ({field: 'WqTenderPrice'}));
					}
					platformRuntimeDataService.readonly(entity, readonlyFields);
				}
			};
			return service;
		}]);

	angular.module(moduleName).factory('estimateMainPriceAdjustmentTotalReadonlyProcessService', ['_','platformRuntimeDataService','estimateMainService',
		function (_,platformRuntimeDataService) {
			var service = {};
			service.processItem = function processItem(entity, data) {
				if (entity) {

					let fields = ['AdjType', 'Quantity', 'EstimatedPrice', 'AdjustmentPrice', 'TenderPrice', 'DeltaA', 'DeltaB'];

					let specialFields = ['EstimatedPrice', 'AdjustmentPrice', 'TenderPrice'];
					let specialFields1 = ['DeltaA', 'DeltaB'];

					let readonlyFields = [];

					if (data.getService().hasReadOnlyAdjustment() || entity.Id === 'EpNa') {
						_.forEach(fields, function (filed) {
							readonlyFields.push({field: filed, readonly: true});
						});
					} else if (entity.Id === 'TotalWq' || entity.Id === 'TotalAq') {
						angular.forEach(entity, function (value, key) {
							readonlyFields.push({field: key, readonly: true});
						});
					} else {
						let readOnlyURBFields = data.getService().getAdjustmentReadOnlyURB();
						let isSpecialReadOnly = data.getService().hasSpecialReadOnlyAdjustment();
						if (readOnlyURBFields && readOnlyURBFields.includes(entity.Id)) {
							_.forEach(fields, function (filed) {
								readonlyFields.push({field: filed, readonly: true});
							});
						} else if (entity.Id !== 'Aq') {
							readonlyFields.push({field: 'Quantity', readonly: true});
						}
						if (isSpecialReadOnly && ['Aq', 'Wq'].includes(entity.Id)) {
							angular.forEach(entity, function (value, key) {
								if (specialFields.includes(key)) {
									readonlyFields.push({field: key, readonly: true});
									entity[key] = entity[key] !== null ? 0 : null;
								}
								if (specialFields1.includes(key)) {
									entity[key] = entity[key] !== null ? 0 : null;
								}
							});
						}
					}
					if(data.getService().canEditWqTenderPrice(entity) && entity.Id==='Wq') {
						_.remove(readonlyFields, ({field: 'TenderPrice'}));
					}
					platformRuntimeDataService.readonly(entity, readonlyFields);
				}
			};
			return service;
		}]);
})(angular);
