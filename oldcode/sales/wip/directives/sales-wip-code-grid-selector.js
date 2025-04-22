/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {

	'use strict';

	angular.module('sales.wip').directive('salesWipCodeGridSelector', ['_','$injector', 'moment', '$q', 'salesWipLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_,$injector, moment, $q, salesWipLookupDataService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version:2,
				lookupType: 'salesWipCodeGridSelector',
				valueMember: 'Id',
				// displayMember: 'Code',
				uuid: '4BEE8BBCBC92472DB4C523AA32B05BCC',
				columns:[
					{ id: 'code', field: 'Code', name: 'Code',  width: 140, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Description', name: 'Description',  width: 240, toolTip: 'Description', formatter: 'description', name$tr$: 'cloud.common.entityDescription' }
				],
				selectableCallback: function(dataItem, entity) {
					if(dataItem && entity){
						entity.CurrencyFk = dataItem.CurrencyFk;
						entity.Description = dataItem.DescriptionInfo.Description;
						entity.ProjectFk = dataItem.ProjectFk;
						entity.CompanyFk = dataItem.CompanyFk;
						entity.ClerkFk = dataItem.ClerkFk;
						entity.OrdHeaderFk = dataItem.OrdHeaderFk;
						entity.WipHeaderFk = dataItem.Id;
						entity.RubricCategoryFk = dataItem.RubricCategoryFk;
						if(dataItem.PerformedFrom){
							var startDate = new Date(dataItem.PerformedFrom);
							entity.PerformedFrom = moment(startDate);
						}
						if(dataItem.PerformedTo){
							var endDate = new Date(dataItem.PerformedTo);
							entity.PerformedTo = moment(endDate);
						}

						$injector.get('qtoMainCreateWipDialogService').onCodeChage.fire();
					}
					return true;
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				dataProvider: {
					myUniqueIdentifier: 'salesWipCodeGridLookupHandler',

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

					getItemByKey: function getItemByKey(value/* , options, scope */) {
						return salesWipLookupDataService.getItemById(value);
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