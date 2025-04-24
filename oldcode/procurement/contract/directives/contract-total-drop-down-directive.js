/**
 * Created by lcn on 2019-07-04.
 */
(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.contractTotal = function contractTotal($injector, $translate, basicsLookupdataLookupDescriptorService) {
		var cache = [];
		var q = $injector.get('$q');
		var _ = $injector.get('_');
		var procurementContractTotalDataService = $injector.get('procurementContractTotalDataService');
		var procurementCommonGeneratePaymentScheduleValidationService = $injector.get('procurementCommonGeneratePaymentScheduleValidationService');
		var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
		var mainAndChangeOrderText = $translate.instant('procurement.common.paymentSchedule.mainAndChangeOrder');

		return {
			lookupOptions: {
				version: 3,
				valueMember: 'Id',
				displayMember: 'Code',
				lookupType: 'contractTotal',
				uuid: 'e0563ac3b37f4904953cfb9ac907f63b',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Description',
						formatter: 'description',
						width: 120,
						name$tr$: 'procurement.common.reqTotalTotalTypeFk'
					},
					{
						id: 'Description',
						field: 'Translated',
						name: 'Description',
						formatter: 'description',
						width: 120,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'vatPercent',
						field: 'ValueNetOc',
						name: 'Net Value(Currency)',
						formatter: 'money',
						width: 80,
						name$tr$: 'procurement.common.reqTotalValueNetOc'
					},
					{
						id: 'grossPercent',
						field: 'GrossOc',
						name: 'Gross Value(Currency)',
						formatter: 'money',
						width: 80,
						name$tr$: 'procurement.common.reqTotalGrossOC'
					}
				],
				formatter: function (model, lookupItem, displayValue) {
					if (lookupItem) {
						var item = procurementContractTotalDataService.getTotalType(lookupItem);   // todo livia
						if (item) {
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
				getList: function (/* options, scope */) {
					clearCache();
					var deferred = q.defer();
					var targets = getItems();
					deferred.resolve(targets);
					return deferred.promise;
				},
				getItemByKey: function (identification, options, scope) {
					var list = getItems();
					var cost = parseFloat(scope.entity.TotalCost.toFixed(2));
					var found = _.find(list, function (item) {
						return item.ValueNetOc === cost;
					});

					var valOc = found ? found.ValueNetOc : cost;
					var grossOc = found ? found.GrossOc : undefined;
					var validationService = procurementCommonGeneratePaymentScheduleValidationService.getValidationService({
						moduleName: moduleName, alltotal: {}, rate: 0
					});
					platformRuntimeDataService.applyValidationResult(validationService.validateTotalCost(scope.entity, valOc, 'TotalCost', !!found, grossOc), scope.entity, 'TotalCost');
					return found;
				}
			}
		};

		// //////////////////////////

		function clearCache() {
			cache = [];
		}

		function getItems() {
			if (cache.length === 0) {
				var list = procurementContractTotalDataService.getLookupData();
				_.each(list, function (item) {
					var type = procurementContractTotalDataService.getTotalType(item);      // todo livia
					if (type) {
						item.Code = type.Code;
						item.Translated = type.DescriptionInfo.Translated;
					}
				});
				cache = list;
			}
			addMainAndChangeOrderItem(cache);
			return cache;
		}

		function addMainAndChangeOrderItem(list) {
			var mainAndChangeOrder = basicsLookupdataLookupDescriptorService.getData('ConMainAndChangeOrder');
			_.remove(list, function (n) {
				return n.Id === -1;
			});
			list.unshift({
				Id: -1,
				ValueNetOc: mainAndChangeOrder !== undefined ? mainAndChangeOrder['-1'].ValueNetOc : 0,
				GrossOc: mainAndChangeOrder !== undefined ? mainAndChangeOrder['-1'].GrossOc : 0,
				ValueTaxOc: 0,
				Code: mainAndChangeOrderText,
				TypeCode: mainAndChangeOrderText,
				Translated: mainAndChangeOrderText,
				DescriptionInfo: {
					Translated: mainAndChangeOrderText
				}
			});
		}
	};

	angular.module(moduleName).directive('contractTotalDropDown', [
		'$injector',
		'$translate',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataLookupDescriptorService',
		function (
			$injector,
			$translate,
			BasicsLookupdataLookupDirectiveDefinition,
			basicsLookupdataLookupDescriptorService) {

			var defaults = globals.lookups.contractTotal($injector, $translate, basicsLookupdataLookupDescriptorService);
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	]);
})(angular, globals);