/**
 * Created by wed on 11/7/2017.
 */
(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.package';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.packagesTotalDropDown = function packagesTotalDropDown($injector, prcTotalTypes, prcTotalKinds) {
		var procurementPackageTotalDataService = $injector.get('procurementPackageTotalDataService');
		var _ = $injector.get('_');

		return {
			lookupOptions: {
				version: 2,
				valueMember: 'Id',
				lookupType: 'packagesTotalDropDown',
				displayMember: 'Description',
				uuid: '49f54e0a71f34363bc77d4f54e9b8a12',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'procurement.common.wizard.generatePaymentSchedule.totalKind'
					},
					{
						id: 'TypeCodes',
						field: 'TypeCodes',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'procurement.common.reqTotalTotalTypeFk'
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
				getList: function (options, scope) {
					return getItemsFromMultipleSelection(scope.entity.Ids).then(function (list) {
						return list;
					});
				},
				getItemByKey: function (identification, options, scope) {
					return getItemsFromMultipleSelection(scope.entity.Ids).then(function (list) {
						let found;
						if (list && list.length) {
							found = list[0];
							scope.entity.MultipleTotalType = scope.entity.MultipleTotalType === -1 ? list[0].TotalKindFk : scope.entity.MultipleTotalType;
						}
						return found;
					});
				},
				getSearchList: function (request, displayMember, scope) {
					var options = JSON.parse(request), text = options.SearchText || '';
					return getItemsFromMultipleSelection(scope.entity.Ids).then(function (list) {
						let targets = list;
						if (text !== '') {
							targets = _.filter(list, function (item) {
								return item[displayMember].toLowerCase().indexOf(text.toLowerCase()) > -1;
							});
							return targets;
						}
					});
				}
			}
		};

		function getItemsFromMultipleSelection(ids) {
			return procurementPackageTotalDataService.getSameTotalsFromPackages(ids).then(function (list) {
				var result = [];
				var obj = {};
				_.each(list, function (item) {
					var type = _.find(prcTotalTypes, {Id: item.TotalTypeFk});
					var totalKind = _.find(prcTotalKinds, {Id: item.TotalKindFk});
					if (totalKind && type) {
						item.TotalTypeCode = type.Code;
						item.TotalTypeTranslated = type.DescriptionInfo.Translated;
						item.TotalKindDescription = totalKind.Description;
						if (!obj[item.TotalKindFk]) {
							var i = {
								Id: item.TotalKindFk,
								TotalKindFk: item.TotalKindFk,
								Description: totalKind.Description,
								TypeObj: {}
							};
							i.TypeObj[type.Code] = true;
							result.push(i);
							obj[item.TotalKindFk] = totalKind.Description;
						}
						else if (obj[item.TotalKindFk]) {
							var e = _.find(result, {Id: item.TotalKindFk});
							e.TypeObj[type.Code] = true;
						}
					}
				});
				_.forEach(result, function(r) {
					var typeObjKeys = _.keys(r.TypeObj);
					r.TypeCodes = typeObjKeys.join(' / ');
				});
				return result;
			});
		}
	};

	angular.module(moduleName).directive('packagesTotalDropDown', ['BasicsLookupdataLookupDirectiveDefinition', '$injector', 'basicsLookupdataLookupDescriptorService',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector, basicsLookupdataLookupDescriptorService) {
			var prcTotalKinds = basicsLookupdataLookupDescriptorService.getData('PrcTotalKind');
			var prcTotalTypes = basicsLookupdataLookupDescriptorService.getData('PrcTotalType');
			var defaults = globals.lookups.packagesTotalDropDown($injector, prcTotalTypes, prcTotalKinds);
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit',
				defaults.lookupOptions, {
					dataProvider: defaults.dataProvider
				});
		}
	]);
})(angular, globals);