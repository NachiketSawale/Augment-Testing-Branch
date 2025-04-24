(function (angular) {
	'use strict';
	//todo: remove soon
	angular.module('basics.billingschema').directive('basicsBillingSchemaBillingSchemaDetailCombobox', ['$q', 'basicsBillingSchemaBillingSchemaDetailService',
		'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, basicsBillingSchemaBillingSchemaDetailService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'BillingSchemaDetail1',
				valueMember: 'Id',
				disableDataCaching: true,
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						var deferred = $q.defer();
						var currentEntity = arguments[1].entity;
						var detailList = basicsBillingSchemaBillingSchemaDetailService.getList();
						var detailResult = [];
						for (var i = 0; i < detailList.length; i++) {
							if(detailList[i].Sorting < currentEntity.Sorting && detailList[i].Id !== currentEntity.Id){
								detailList[i].Description = detailList[i].DescriptionInfo.Translated;
								detailResult.push(detailList[i]);
							}
						}
						deferred.resolve(detailResult);
						return deferred.promise;
					},
					getItemByKey: function (value) {
						var item = {};
						var list = basicsBillingSchemaBillingSchemaDetailService.getList();
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								item.Description = item.DescriptionInfo.Translated;
								break;
							}
						}
						return item;
					}
				}
			});
		}
	]);
})(angular);