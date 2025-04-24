/**
 * Created by chi on 07/01/2021.
 */
(function(angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.quote';

	angular.module(moduleName).directive('procurementQuoteStatusForUpdateBpStructureLookup', procurementQuoteStatusCustomLookup);

	procurementQuoteStatusCustomLookup.$inject = ['$translate', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupFilterService', '_'];

	function procurementQuoteStatusCustomLookup($translate, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataLookupFilterService, _) {
		var defaults = {
			version:3,
			lookupType: 'QuoteStatus',
			valueMember: 'Id',
			displayMember: 'Description',
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
						lookupType: 'QuoteStatus',
						displayMember: 'Description',
						imageSelector: 'platformStatusIconService'
					}
				}
			],
			selectableCallback: function () {
				return false;
			},
			uuid: '93aa3e7669614e388140acb7018707e2',
			filterKey: 'procurement-quote-status-for-update-bpstructure-filter'
		};

		basicsLookupdataLookupFilterService.registerFilter({
			key: 'procurement-quote-status-for-update-bpstructure-filter',
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

			if (data && angular.isArray(data.quoteStatuses)) {
				data.quoteStatuses = [];
			} else {
				data = {
					isTemp: true,
					quoteStatuses: []
				};
			}

			var isAll = true;
			_.forEach(dataInLookup, function (item) {
				if (item.Selected) {
					data.quoteStatuses.push(item);
				}
				else {
					isAll = false;
				}
			});

			var desciption = data.quoteStatuses.length === 0 ? '' :
				(isAll ? $translate.instant('procurement.common.updatePrcStructureWizard.allStatus') :
					$translate.instant('procurement.common.updatePrcStructureWizard.mixedStatus'));

			return '<span>' + desciption + '</span>';
		}

		// eslint-disable-next-line no-unused-vars
		function processData(itemList, options) {
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

			while (scope && (!scope.data || !angular.isArray(scope.data.quoteStatuses))) {
				scope = scope.$parent;
			}

			return scope ? scope.data : null;
		}

		function isValid(item) {
			return item.IsLive && !item.IsVirtual;
		}
	}

})(angular);