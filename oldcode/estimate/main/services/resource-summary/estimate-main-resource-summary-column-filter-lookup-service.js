(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainResourceSummaryColumnFilterLookupService',
		['$translate', 'platformModalService', 'platformMasterDetailDialogService', 'basicsCommonConfigLocationListService', 'estimateMainResourceSummaryConfigDataService', 'basicsLookupdataSimpleLookupService', 'estimateMainResourceTypeLookupService',
			function ($translate, platformModalService, platformMasterDetailDialogService, basicsCommonConfigLocationListService, estimateMainResourceSummaryConfigDataService, basicsLookupdataSimpleLookupService, estimateMainResourceTypeLookupService) {

				let service = {};

				service.getFormatterOptions = function (columnId, formatterOptions) {
					switch (columnId){
						case 42:// cost type
							formatterOptions.lookupModuleQualifier = 'estimate.lookup.costtype';
							break;
						case 43:// Resource Flag
							formatterOptions.lookupModuleQualifier = 'estimate.lookup.resourceflag';
							break;
						case 45:// ProcurementPackage
							break;
						case 52:// Procurement Sub Package
							break;
						case 53:// ProcurementStructure
							break;
						case 8:// QuantityFactor1
							break;
						case 9:// QuantityFactor2
							break;
						case 10:// QuantityFactor3
							break;
						case 11:// QuantityFactor4
							break;
					}
					return formatterOptions;
				};

				service.getFormatter = function (data, lookupItem, displayValue, lookupConfig, _data) {
					// update config data in estimateMainResourceSummaryConfigDataService
					let configData = estimateMainResourceSummaryConfigDataService.getItems();
					let ids = _.map(_data.ExceptionKeyValues, function (item) {
						return item.Id;
					});
					if(ids && ids.length > 0) {
						_data.ExceptionKeys = ids.join('@')+'@';
					}

					_.each(configData, function (config) {
						if(config.EstResSummaryCombineEntities){
							let combineData = _.find(config.EstResSummaryCombineEntities, function (combine) {
								return combine.Id === _data.Id;
							});
							if(combineData){
								combineData.ExceptionKeyValues = data;
								if(combineData.ExceptionKeys !== _data.ExceptionKeys)
								{
									combineData.IsModified = true;
								}
								combineData.ExceptionKeys = _data.ExceptionKeys;
							}
						}
					});

					if(_data.ColumnId === 42 || _data.ColumnId === 43) {
						let thisFormatterOptions = service.getFormatterOptions(_data.ColumnId, lookupConfig.formatterOptions);

						return _.map(data, function (item) {
							return (item.Id === 0 ? {Description: $translate.instant('basics.customize.noAssignment')} : basicsLookupdataSimpleLookupService.getItemByIdSync(item.Id, thisFormatterOptions) || {}).Description;
						}).join(', ');
					}
					else if(_data.ColumnId === 47){
						return _.map(data, function (item) {
							let dataItem = (item.Id === 0 ? {Description: $translate.instant('basics.customize.noAssignment')} : estimateMainResourceTypeLookupService.getItemById(item.Id) || {}).ShortKeyInfo;
							return dataItem? dataItem.Translated : '';
						}).join(', ');
					}
					return '';
				};

				return service;
			}]);

})();
