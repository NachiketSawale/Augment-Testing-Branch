/**
 * Created by wed on 11/7/2017.
 */
(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.package';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.packageTotalDropDown = function packageTotalDropDown($injector) {
		var cache = [];
		var procurementPackageTotalDataService = $injector.get('procurementPackageTotalDataService');
		var _ = $injector.get('_');
		var q = $injector.get('$q');

		return {
			lookupOptions: {
				version: 2,
				valueMember: 'Id',
				lookupType: 'packageTotalDropDown',
				displayMember: 'Code',
				uuid: 'a079122b367f4db98f9435282185ac0d',
				columns: [
					{
						id: 'desc',
						field: 'TotalTypeFk',
						name: 'TotalTypeFk',
						width: 120,
						name$tr$: 'procurement.common.reqTotalTotalTypeFk',
						editorOptions: {
							directive: 'basics-procurement-configuration-total-type-combobox',
							lookupOptions: {filterKey: 'procurement-common-total-type-filter'}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcTotalType',
							displayMember: 'Code'
						}
					},
					{
						id: 'Description',
						field: 'Translated',
						name: 'Description',
						formatter: 'description',
						width: 150,
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
						var item = procurementPackageTotalDataService.getTotalType(lookupItem);   // todo livia
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

					if (!_.isUndefined(scope.entity.TotalOcGross)) {
						var valOc = found ? found.ValueNetOc : cost;
						var grossOc = found ? found.GrossOc : undefined;
						var validationService = $injector.get('procurementCommonGeneratePaymentScheduleValidationService').getValidationService({
							moduleName: moduleName, alltotal: {}, rate: 0
						});
						$injector.get('platformRuntimeDataService').applyValidationResult(
							validationService.validateTotalCost(scope.entity, valOc, 'TotalCost', !!found, grossOc), scope.entity, 'TotalCost');
					}
					return found;
				},
				getSearchList: function (request, displayMember) {
					var options = JSON.parse(request), text = options.SearchText || '';
					var deferred = q.defer();
					var list = getItems(), targets = list;
					if (text !== '') {
						targets = _.filter(list, function (item) {
							return item[displayMember].toLowerCase().indexOf(text.toLowerCase()) > -1;
						});
					}
					deferred.resolve(targets);
					return deferred.promise;
				}
			}
		};

		// /////////////////////
		function clearCache() {
			cache = [];
		}

		function getItems() {
			if (cache.length === 0) {
				var list = procurementPackageTotalDataService.getLookupData();
				_.each(list, function (item) {
					var type = procurementPackageTotalDataService.getTotalType(item);      // todo livia
					if (type) {
						item.Code = type.Code;
						item.Translated = type.DescriptionInfo.Translated;
					}
				});
				cache = list;
			}
			return cache;
		}
	};

	angular.module(moduleName).directive('packageTotalDropDown', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			var defaults = globals.lookups.packageTotalDropDown($injector);

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit',
				defaults.lookupOptions, {
					dataProvider: defaults.dataProvider
				});
		}
	]);
})(angular, globals);