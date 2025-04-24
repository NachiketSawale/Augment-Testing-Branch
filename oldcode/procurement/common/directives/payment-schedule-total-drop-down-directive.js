( function () {
	'use strict';
	/* global globals */
	var moduleName = 'procurement.common';

	globals.lookups.paymentScheduleSettingTotal = function ($injector, basicsLookupdataLookupDescriptorService) {
		var cache = [];
		var q = $injector.get('$q');
		var _ = $injector.get('_');

		return {
			lookupOptions: {
				version: 3,
				valueMember: 'Id',
				displayMember: 'TypeCode',
				lookupType: 'DisplayTotals',
				uuid: 'e0563ac3b37f4904953cfb9ac907f63f',
				columns: [
					{
						id: 'type',
						field: 'Code',
						name: 'Description',
						formatter:'description',
						width: 120,
						name$tr$: 'procurement.common.reqTotalTotalTypeFk'
					},
					{
						id: 'Description',
						field: 'Translated',
						name: 'Description',
						formatter:'description',
						width: 120,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'vatPercent',
						field: 'ValueNetOc',
						name: 'Net Value(Currency)',
						formatter:'money',
						width: 80,
						name$tr$: 'procurement.common.reqTotalValueNetOc'
					},
					{
						id: 'grossPercent',
						field: 'GrossOc',
						name: 'Gross Value(Currency)',
						formatter:'money',
						width: 80,
						name$tr$: 'procurement.common.reqTotalGrossOC'
					}
				],
				formatter: function (model, lookupItem, displayValue) {
					if (lookupItem) {
						var item = getTotalType(lookupItem);
						if(item){
							displayValue = item.Code;
						}
					}
					return displayValue;
				},
				width: 500,
				height: 200,
				disableDataCaching: true
			},
			dataProvider: {
				getList: function () {
					clearCache();
					var deferred = q.defer();
					var targets = getItems();
					deferred.resolve(targets);
					return deferred.promise;
				},
				getItemByKey: function (identification, options, scope) {
					clearCache();
					var list = getItems();
					var psTotalId = scope.entity.PsTotalId;
					return _.find(list, function (item){
						return item.Id === psTotalId;
					});
				}
			}
		};

		function clearCache() {
			cache = [];
		}

		function getItems() {
			if (cache.length === 0) {
				var listObj = basicsLookupdataLookupDescriptorService.getData('DisplayTotals');
				var list = [];
				_.each(listObj, function (item) {
					var type = getTotalType(item);
					if(type){
						item.Code = type.Code;
						item.Translated = type.DescriptionInfo.Translated;
					}
					list.push(item);
				});
				cache = list;
			}
			return cache;
		}

		function getTotalType(item) {
			return _.find(basicsLookupdataLookupDescriptorService.getData('PrcTotalType'), {
				Id: item.TotalTypeFk
			});
		}
	};

	angular.module(moduleName).directive('paymentScheduleSettingTotalDropDown', [
		'$injector',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataLookupDescriptorService',
		function (
			$injector,
			BasicsLookupdataLookupDirectiveDefinition,
			basicsLookupdataLookupDescriptorService) {

			var defaults = globals.lookups.paymentScheduleSettingTotal($injector, basicsLookupdataLookupDescriptorService);
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	]);

})();
