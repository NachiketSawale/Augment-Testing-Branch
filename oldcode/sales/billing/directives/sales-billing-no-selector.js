(function () {

	'use strict';

	angular.module('sales.billing').directive('salesBillingNoSelector', ['_', '$q', 'moment', 'salesBillingNoLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, moment, salesBillingNoLookupDataService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 2,
				lookupType: 'salesBillingNoSelector',
				valueMember: 'Id',
				// displayMember: 'Code',
				uuid: 'B7CD7EE6569C421B936F89352A8CC8F6',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 140, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo', name: 'Description', width: 240, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription' }
				],
				selectableCallback: function (dataItem, entity) {
					if (dataItem && entity) {
						entity.CurrencyFk = dataItem.CurrencyFk;
						entity.DescriptionInfo = dataItem.DescriptionInfo;
						entity.ProjectFk = dataItem.ProjectFk;
						entity.CompanyFk = dataItem.CompanyFk;
						entity.ClerkFk = dataItem.ClerkFk;
						entity.OrdHeaderFk = dataItem.OrdHeaderFk;
						entity.RubricCategoryFk = dataItem.RubricCategoryFk;
						entity.BilHeaderFk = dataItem.Id;
						entity.ConfigurationFk = dataItem.ConfigurationFk;
						entity.ContractTypeFk = dataItem.ContractTypeFk;

						entity.TypeFk = dataItem.TypeFk;
						if (dataItem.PerformedFrom) {
							var startDate = new Date(dataItem.PerformedFrom);
							entity.PerformedFrom = moment(startDate);
						}
						if (dataItem.PerformedTo) {
							var endDate = new Date(dataItem.PerformedTo);
							entity.PerformedTo = moment(endDate);
						}
					}
					return true;
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'salesBillingNoLookupHandler',

					getList: function getList(/* settings, scope */) {
						return salesBillingNoLookupDataService.getSalesBillingList().then(function (data) {
							data = _.filter(data, function (item) {
								return !item.IsBilled && !item.IsReadOnly;
							});

							return data;
						});
					},

					getDefault: function getDefault() {
						return $q.when([]);
					},

					getItemByKey: function getItemByKey(value, options) {
						return salesBillingNoLookupDataService.getItemById(value, options);
					},

					getSearchList: function getSearchList(/* searchString, displayMember, scope, searchListSettings */) {
						return salesBillingNoLookupDataService.getSalesBillingList().then(function (data) {
							data = _.filter(data, function (item) {
								return !item.IsBilled && !item.IsReadOnly;
							});

							return data;
						});
					}
				}
			});
		}
	]);

})();
