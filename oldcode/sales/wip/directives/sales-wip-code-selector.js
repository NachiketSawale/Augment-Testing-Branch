/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {

	'use strict';


	angular.module('sales.wip').directive('salesWipCodeSelector', ['_', 'moment', '$q', 'salesWipLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, moment, $q, salesWipLookupDataService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version:2,
				lookupType: 'salesWipCodeSelector',
				valueMember: 'Id',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 140, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo', name: 'Description', width: 240, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription' }
				],
				// displayMember: 'Code',
				selectableCallback: function(dataItem, entity) {
					if(dataItem && entity){
						entity.CurrencyFk = dataItem.CurrencyFk;
						entity.Description = dataItem.DescriptionInfo.Description;
						entity.ProjectFk = dataItem.ProjectFk;
						entity.CompanyFk = dataItem.CompanyFk;
						entity.ClerkFk = dataItem.ClerkFk;
						entity.OrdHeaderFk = dataItem.OrdHeaderFk;
						entity.RubricCategoryFk = dataItem.RubricCategoryFk;
						if(dataItem.PerformedFrom){
							var startDate = new Date(dataItem.PerformedFrom);
							entity.PerformedFrom = moment(startDate);
						}
						if(dataItem.PerformedTo){
							var endDate = new Date(dataItem.PerformedTo);
							entity.PerformedTo = moment(endDate);
						}
					}
					return true;
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				dataProvider: {
					myUniqueIdentifier: 'salesWipCodeLookupHandler',

					getList: function getList(/* settings, scope */) {
						return salesWipLookupDataService.getSalesWipList().then(function (data) {
							return _.filter(data, function(item){
								return !item.IsOrderedStatus && !item.IsReadOnly;
							});
						});
					},

					getDefault: function getDefault() {
						return $q.when([]);
					},

					getItemByKey: function getItemByKey(value , options) {
						return salesWipLookupDataService.getItemById(value, options);
					},

					getSearchList: function getSearchList(/* searchString, displayMember, scope, searchListSettings */) {
						return salesWipLookupDataService.getSalesWipList().then(function (data) {
							data = _.filter(data, function(item){
								return !item.IsOrderedStatus && !item.IsReadOnly;
							});

							return data;
						});
					}
				}
			});
		}
	]);

})();
