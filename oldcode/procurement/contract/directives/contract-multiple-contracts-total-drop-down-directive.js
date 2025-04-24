(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.contract';
	/* global angular,globals, _ */
	globals.lookups.contractsTotal = function contractsTotal($injector, $translate, prcTotalTypes, prcTotalKinds) {
		var procurementContractTotalDataService = $injector.get('procurementContractTotalDataService');
		var mainAndChangeOrderText = $translate.instant('procurement.common.paymentSchedule.mainAndChangeOrder');

		return {
			lookupOptions: {
				version: 3,
				valueMember: 'Id',
				displayMember: 'Description',
				lookupType: 'contractsTotal',
				uuid: '6fcaf6bb81f44d84bbccd6eff8926350',
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
						}
						return found;
					});
				}
			}
		};

		function getItemsFromMultipleSelection(ids) {
			return procurementContractTotalDataService.getSameTotalsFromContracts(ids).then(function (list) {
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
				result.unshift({
					Id: -1,
					TypeCodes: mainAndChangeOrderText,
					TotalKindFk: -1,
					Description: mainAndChangeOrderText
				});
				return result;
			});
		}
	};

	angular.module(moduleName).directive('contractsTotalDropDown', [
		'$injector',
		'$translate',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataLookupDescriptorService',
		function (
			$injector,
			$translate,
			BasicsLookupdataLookupDirectiveDefinition,
			basicsLookupdataLookupDescriptorService) {
			var prcTotalKinds = basicsLookupdataLookupDescriptorService.getData('PrcTotalKind');
			var prcTotalTypes = basicsLookupdataLookupDescriptorService.getData('PrcTotalType');
			var defaults = globals.lookups.contractsTotal($injector, $translate, prcTotalTypes, prcTotalKinds);
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	]);
})(angular, globals);