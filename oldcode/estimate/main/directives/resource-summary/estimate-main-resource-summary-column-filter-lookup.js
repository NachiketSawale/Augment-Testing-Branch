/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _, $ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainResourceSummaryColumnFilterLookup
	 * @requires $q
	 * @description display a grid view to configure totals by filter selection
	 */

	angular.module(moduleName).directive('estimateMainResourceSummaryColumnFilterLookup', [
		'$q', '$injector','$translate', 'platformGridAPI', 'basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'platformGridDomainService', 'basicsLookupdataLookupDescriptorService', 'estimateMainResourceSummaryColumnFilterLookupService',
		'estimateMainResourceTypeLookupService', 'platformRuntimeDataService',
		function ($q, $injector, $translate, platformGridAPI, basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition, platformGridDomainService, basicsLookupdataLookupDescriptorService, estimateMainResourceSummaryColumnFilterLookupService,
			estimateMainResourceTypeLookupService, platformRuntimeDataService) {
			let defaults = {
				uuid: '06569b7771e047e2afe951298c9e803c',
				lookupType: 'estimateMainResourceSummaryFilter',
				valueMember: 'Id',
				displayMember: 'Description',
				showCustomInputContent: true,
				formatter: function displayFormatter(data, lookupItem, displayValue, lookupConfig, _data) {
					return estimateMainResourceSummaryColumnFilterLookupService.getFormatter(data, lookupItem, displayValue, lookupConfig, _data);
				},
				idProperty: 'Id',
				columns: [
					{
						id: 'Filter',
						field: 'Filter',
						name: 'Filter',
						name$tr$: 'cloud.common.Filter_FilterTitle_TXT',
						width: 70,
						toolTip: 'Filter',
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: true,
					},
					{
						id: 'TypicalCode',
						field: 'TypicalCode',
						name: 'Typical Code',
						name$tr$: 'basics.customize.typicalcode',
						width: 75
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 150
					}
				],
				popupOptions:
					{
						templateUrl: 'grid-popup-lookup.html',
						controller: 'estimateMainTotalsConfigDetailFilterController',
						width: 250, height: 300
					},
				onDataRefresh: function ($scope) {
					let field = $scope.$parent.$parent.$parent.config.field;
					let cacheKey = field + ($scope.$parent.$parent.$parent.entity ? $scope.$parent.$parent.$parent.entity.ColumnId + '' : '');
					let columnId = $scope.$parent.$parent.$parent.entity ? $scope.$parent.$parent.$parent.entity.ColumnId : -1;
					if(columnId === 42 || columnId === 43) {
						basicsLookupdataLookupDescriptorService.removeData(cacheKey);
						$scope.settings.dataView.dataProvider.getList($scope.options, $scope.$parent).then(function (data) {
							// update filters from server
							let arrayData = [];
							_.forEach(data, function (item) {
								if (_.findIndex($scope.entity[field], {Id: item.Id}) !== -1) {
									arrayData.push(item);
								}
							});
							$scope.entity[field] = arrayData;
							//
							let processedData = $scope.settings.dataProcessor.execute(data, $scope.options);
							$scope.refreshData(processedData);
						});
					}else if (columnId === 47){ // ShortKey
						let estimateMainResourceSummaryConfigDataService = $injector.get('estimateMainResourceSummaryConfigDataService');
						let configItem = estimateMainResourceSummaryConfigDataService.getSelectedConfig();
						if(configItem && estimateMainResourceSummaryConfigDataService.isDefaultSystemConfiguration(configItem)){
							return;
						}
						// Keep assembly checkbox status and update all other short keys and assembly types
						let isAssemblyChecked = _.findIndex($scope.entity[field], { Id: 4 }) > -1;

						// Update short keys with latest values
						basicsLookupdataLookupDescriptorService.removeData(cacheKey);

						estimateMainResourceTypeLookupService.loadLookupData().then(function () {
							estimateMainResourceTypeLookupService.getListAsync().then(function(data){
								let newList = _.map(data, function (item) {
									return {
										Id: item.Id,
										TypicalCode: item.ShortKeyInfo? item.ShortKeyInfo.Translated: '',
										Description: item.DescriptionInfo? item.DescriptionInfo.Translated: ''
									};
								});
								let filterList = _.filter(newList, function (item) {
									return item.Id !== 5;
								});
								let filterListToProcess = _.filter(filterList, function (item) {
									if (item.Id === 4){
										return isAssemblyChecked; // If assembly was checked(assigned), then we keep in in the list, otherwise it will be filtered out(unchecked)
									}
									return true;
								});

								$scope.entity.Modified = true; // Need to press Ok to save latest data

								// Update filters from latest keys
								$scope.options.dataToProcess =  $scope.entity[field] = _.map(filterListToProcess, function(item){
									return { Id: item.Id };
								});

								//
								let processedData = $scope.settings.dataProcessor.execute(filterList, $scope.options);
								$scope.refreshData(processedData);
							});
						});
					}
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: function (settings, scope) {
						let defer = $q.defer();

						let cacheKey = scope.$parent.$parent.config.field + (scope.$parent.$parent.entity ? scope.$parent.$parent.entity.ColumnId +'' : '');
						basicsLookupdataLookupDescriptorService.removeData(cacheKey);
						// redefined the formatterOptions
						let formatterOptions = scope.settings.formatterOptions;
						let columnId = scope.$parent.$parent.entity ? scope.$parent.$parent.entity.ColumnId : -1;
						if(columnId === 42 || columnId === 43) {
							estimateMainResourceSummaryColumnFilterLookupService.getFormatterOptions(columnId, formatterOptions);

							let list = basicsLookupdataLookupDescriptorService.getData(cacheKey);
							if (!_.isEmpty(list)) {
								let resultArray = [];
								_.forEach(list, function (item) {
									resultArray.push(item);
								});
								resultArray = _.sortBy(resultArray, 'sorting');
								return $q.when(resultArray);
							}

							let typicalCodesFormatter = angular.copy(formatterOptions);
							typicalCodesFormatter.displayMember = 'TypicalCode';
							basicsLookupdataSimpleLookupService.getList(typicalCodesFormatter).then(function (typicalCodes) {
								basicsLookupdataSimpleLookupService.refreshCachedData(formatterOptions).then(function (data) {
									_.forEach(data, function (item, index) {
										item.TypicalCode = item.Id === typicalCodes[index].Id ? typicalCodes[index].TypicalCode : '';
									});
									// data = _.filter(data, 'isLive');
									// data = _.sortBy(data, 'sorting');
									// data.push({ Id: 0, Description: $translate.instant('basics.customize.noAssignment') });
									basicsLookupdataLookupDescriptorService.updateData(cacheKey, data);
									defer.resolve(data);
								});
							});
						}
						else if(columnId === 47){
							estimateMainResourceTypeLookupService.getListAsync().then(function (data) {
								let newList = _.map(data, function (item) {
									return {
										Id: item.Id,
										TypicalCode: item.ShortKeyInfo? item.ShortKeyInfo.Translated: '',
										Description: item.DescriptionInfo? item.DescriptionInfo.Translated: ''
									};
								});
								let filterList = _.filter(newList, function (item) {
									return item.Id !== 5;
								});

								let estimateMainResourceSummaryConfigDataService = $injector.get('estimateMainResourceSummaryConfigDataService');
								// get configItem
								let configItem = estimateMainResourceSummaryConfigDataService.getSelectedConfig();
								if(configItem && estimateMainResourceSummaryConfigDataService.isDefaultSystemConfiguration(configItem)){
									let fields = [];
									angular.forEach(filterList, function (item) {
										fields = [{field: 'Filter', readonly: true}];
										if (item.__rt$data){
											item.__rt$data.readonly = [];
										}
										if (item && item.Id) {
											platformRuntimeDataService.readonly(item, fields);
										}
									});
								}

								defer.resolve(filterList);
							});
						}
						return defer.promise;
					},
					getItemByKey: function (value, options, scope) {
						value = angular.copy(scope.ngModel);
						return $q.when([]);
					}
				},
				processData: function (data, options) {
					_.forEach(data, function (item) {
						item.Filter = _.findIndex(options.dataToProcess, { Id: item.Id }) > -1;
					});
					return data;
				},
				controller: ['$scope', 'platformGridAPI', 'platformCreateUuid', function ($scope) {
					// get configItem
					let estimateMainResourceSummaryConfigDataService = $injector.get('estimateMainResourceSummaryConfigDataService');
					let configItem = estimateMainResourceSummaryConfigDataService.getSelectedConfig();
					if(configItem && estimateMainResourceSummaryConfigDataService.isDefaultSystemConfiguration(configItem)){
						$scope.lookupOptions.columns[0].headerChkbox = false;
					}
					$.extend($scope.lookupOptions, {
						formatterOptions: $scope.$parent.config.formatterOptions,
						dataToProcess: $scope.entity[$scope.$parent.config.field]
					});
				}]
			});
		}
	]);

})(angular);
