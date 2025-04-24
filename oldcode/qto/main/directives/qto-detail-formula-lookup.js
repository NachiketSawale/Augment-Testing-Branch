(function (angular, globals) {
	/* global _, globals */
	'use strict';
	var moduleName = 'qto.main';

	globals.lookups.QtoFormulaLookupType = function QtoFormulaLookupType($injector) {

		var basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
		return {
			lookupOptions:{
				lookupType: 'QtoFormulaLookupType',
				valueMember: 'Id',
				displayMember: 'Code',
				disableDataCaching: true,
				onDataRefresh: function ($scope) {
					var currentQtoDetailItem = $scope.entity;
					if (currentQtoDetailItem) {
						$injector.get('qtoFormulaLookupService').reloadLookupData(currentQtoDetailItem).then(function (response) {
							if (response) {
								var filed = $scope.options.OperatorFiled || $scope.options.model;
								currentQtoDetailItem.QtoFormula[filed] = response.data[filed];
								var QtoFormula = [];
								QtoFormula.push(currentQtoDetailItem.QtoFormula);
								if (currentQtoDetailItem.BasUomFk && currentQtoDetailItem.BasUomFk > 0) {
									$injector.get('qtoFormulaLookupService').updateFormulaUomOperatorCache(currentQtoDetailItem, response.data);
								} else {
									basicsLookupdataLookupDescriptorService.updateData('QtoFormula', QtoFormula);
								}

								var operatorStrList = [];
								var operatorStr = currentQtoDetailItem.QtoFormula[filed] ? _.split(currentQtoDetailItem.QtoFormula[filed], '') : [];
								operatorStr = _.union(operatorStr);
								_.forEach(operatorStr, function (item) {
									var temp = {
										Id: item,
										Code: item
									};
									operatorStrList.push(temp);
								});

								$scope.refreshData(operatorStrList);
							}
						});
					}
				},
				searchInterval: 0,
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							var value = args.selectedItem ? args.selectedItem.Code : '';
							$injector.get('qtoFormulaLookupService').setValueOrOperFieldsToDisableByOperator(args.entity, value);
						}
					}
				]
			},
			dataProvider: {
				getList: function (param) {
					return $injector.get('qtoFormulaLookupService').getList(param);
				},
				getItemByKey: function (key, param) {
					return $injector.get('qtoFormulaLookupService').getItemByKey(key, param);
				},
				getSearchList: function (param, displayField, scope, searchListSettings) {
					var obj = {};
					obj.currentItem = scope.options.currentItem;
					obj.OperatorFiled = scope.options.OperatorFiled;
					obj.displayMember = scope.options.displayMember;
					return $injector.get('qtoFormulaLookupService').getSearchList(searchListSettings.searchString, obj);
				},
				getDisplayItem: function (value, param) {
					return $injector.get('qtoFormulaLookupService').getItemByIdAsync(value, param);
				},
				getItemById: function (id, param) {
					return $injector.get('qtoFormulaLookupService').getItemByKey(id, param);
				}
			}
		};
	};

	angular.module(moduleName).directive('qtoDetailFormulaLookup',
		['$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($q, $injector, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = globals.lookups.QtoFormulaLookupType($injector);
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {
					dataProvider: defaults.dataProvider
				});
			}]);

})(angular, globals);