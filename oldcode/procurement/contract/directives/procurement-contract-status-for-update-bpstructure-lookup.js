/**
 * Created by chi on 07/01/2021.
 */
(function(angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';

	angular.module(moduleName).directive('procurementContractStatusForUpdateBpStructureLookup', procurementContractStatusForUpdateBpStructureLookup);

	procurementContractStatusForUpdateBpStructureLookup.$inject = ['$translate', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupFilterService', '_'];

	function procurementContractStatusForUpdateBpStructureLookup($translate, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataLookupFilterService, _) {
		var defaults = {
			version: 3,
			lookupType: 'ConStatus',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			showCustomInputContent: true,
			formatter: formatter,
			columns: [
				{
					id: 'seleced',
					field: 'Selected',
					name$tr$: 'basics.common.selected',
					width: 90,
					formatter: 'boolean',
					editor: 'boolean',
					headerChkbox: true
				},
				{
					id: 'description',
					field: 'Id',
					width: 100,
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'ConStatus',
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: 'platformStatusIconService'
					}
				}
			],
			selectableCallback: function () {
				return false;
			},
			uuid: '874ba1cf439c41eb9bef9c0cd8d0e0ec',
			filterKey: 'procurement-contract-status-for-update-bpstructure-filter'
		};

		basicsLookupdataLookupFilterService.registerFilter({
			key: 'procurement-contract-status-for-update-bpstructure-filter',
			fn: function (item) {
				return isValid(item);
			}
		});

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
			processData: processData
		});

		// ////////////////

		function formatter(items, lookupItem, displayValue, options) {
			if (!options) {
				return '';
			}

			if(!options.dataView.dataCache.isLoaded){
				options.dataView.loadData('');
				options.dataView.dataCache.isLoaded = true;
			}

			var dataInLookup = _.filter(options.dataView.dataFilter.data, function (item) {
				return isValid(item);
			});

			var data = getData(options.dataView.scope);

			if (data && angular.isArray(data.contractStatuses)) {
				data.contractStatuses = [];
			} else {
				data = {
					isTemp: true,
					contractStatuses: []
				};
			}

			var isAll = true;
			_.forEach(dataInLookup, function (item) {
				if (item.Selected) {
					data.contractStatuses.push(item);
				}
				else {
					isAll = false;
				}
			});

			var description = data.contractStatuses.length === 0 ? '' :
				(isAll ? $translate.instant('procurement.common.updatePrcStructureWizard.allStatus') :
					$translate.instant('procurement.common.updatePrcStructureWizard.mixedStatus'));

			return '<span>' + description + '</span>';
		}

		function processData(itemList) {
			if(itemList && itemList.length > 0){
				_.forEach(itemList, function(item){
					item.Selected = true;
				});
			}
			return itemList;
		}

		function getData(scope) {
			if (!scope) {
				return null;
			}

			while (scope && (!scope.data || !angular.isArray(scope.data.contractStatuses))) {
				scope = scope.$parent;
			}

			return scope ? scope.data : null;
		}

		function isValid(item) {
			return item.IsLive && !item.Iscanceled && !item.IsRejected && !item.IsVirtual;
		}
	}

})(angular);