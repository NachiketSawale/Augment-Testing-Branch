/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _, $ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainTotalsConfigDetailFilterLookup
	 * @requires $q
	 * @description display a grid view to configure totals by filter selection
	 */

	angular.module(moduleName).directive('estimateMainTotalsConfigDetailFilterLookup', [
		'$q', '$translate', 'basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'platformGridDomainService', 'basicsLookupdataLookupDescriptorService','estimateMainTotalsConfigTypeService',
		function ($q, $translate, basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition, platformGridDomainService, basicsLookupdataLookupDescriptorService,estimateMainTotalsConfigTypeService) {
			let defaults = {
				uuid: 'c8546cf72bdd48338a0812378a9aa25f',
				lookupType: 'estimateMainTotalConfigFilter',
				valueMember: 'Id',
				displayMember: 'Description',
				showCustomInputContent: true,
				formatter: function displayFormatter(data, lookupItem, displayValue, lookupConfig) {
					return _.map(data, function (item) {
						return (item.Id === 0 ? {Description: $translate.instant('basics.customize.noAssignment')} : basicsLookupdataSimpleLookupService.getItemByIdSync(item.Id, lookupConfig.formatterOptions) || {}).Description;
					}).join(', ');
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
						headerChkbox: true
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
					basicsLookupdataLookupDescriptorService.removeData(field);
					$scope.settings.dataView.dataProvider.getList($scope.options, $scope.$parent).then(function(data){
						// update filters from server
						let arrayData = [];
						_.forEach(data, function(item){
							if (_.findIndex($scope.entity[field], { Id: item.Id }) !== -1){
								arrayData.push(item);
							}
						});
						$scope.entity[field] = arrayData;
						//
						let processedData = $scope.settings.dataProcessor.execute(data, $scope.options);
						$scope.refreshData(processedData);
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: function (settings, scope) {
						let mdcContextId = estimateMainTotalsConfigTypeService.getMdcContextId();

						let list = basicsLookupdataLookupDescriptorService.getData(scope.$parent.$parent.config.field);
						if (!_.isEmpty(list)) {
							/* let resultArray = [];
							_.forEach(list, function (item) {
								resultArray.push(item);
							}); */

							let resultArray = angular.copy(list);
							if(mdcContextId){
								resultArray = _.filter(resultArray,{'MdcContextFk':mdcContextId});
							}
							resultArray = _.sortBy(resultArray, 'sorting');
							return $q.when(resultArray);
						}
						let defer = $q.defer();
						let typicalCodesFormatter = angular.copy(scope.settings.formatterOptions);
						typicalCodesFormatter.displayMember = 'TypicalCode';
						basicsLookupdataSimpleLookupService.refreshCachedData(typicalCodesFormatter).then(function (typicalCodes) {
							basicsLookupdataSimpleLookupService.refreshCachedData(scope.settings.formatterOptions).then(function (data) {
								_.forEach(data, function (item, index) {
									item.TypicalCode = item.Id === typicalCodes[index].Id ? typicalCodes[index].TypicalCode : '';
								});

								data = _.filter(data, 'isLive');
								data = _.sortBy(data, 'sorting');
								data.push({ Id: 0, Description: $translate.instant('basics.customize.noAssignment') });
								basicsLookupdataLookupDescriptorService.updateData(scope.$parent.$parent.config.field, data);

								let result =[];
								if(mdcContextId){
									result = _.filter(data,{'MdcContextFk':mdcContextId});
								}
								defer.resolve(result);
							});
						});
						return defer.promise;
					},
					getItemByKey: function () {
						// value = angular.copy(scope.ngModel);
						return $q.when([]);
					}
				},
				processData: function (data, options) {
					_.forEach(data, function (item) {
						item.Filter = _.findIndex(options.dataToProcess, {'Id': item.Id }) > -1;
					});
					return data;
				},
				controller: ['$scope', 'platformGridAPI', 'platformCreateUuid', function ($scope) {
					$.extend($scope.lookupOptions, {
						formatterOptions: $scope.$parent.config.formatterOptions,
						dataToProcess: $scope.entity[$scope.$parent.config.field]
					});
				}]
			});
		}
	]);

})(angular);
