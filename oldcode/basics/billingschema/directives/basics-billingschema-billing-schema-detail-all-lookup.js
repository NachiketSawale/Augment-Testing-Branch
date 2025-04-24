/**
 * Created by wwa on 9/18/2016.
 */
(function (angular) {
	'use strict';

	angular.module('basics.billingschema').directive('basicsBillingSchemaBillingSchemaDetailAllLookup',
		['$q', 'basicsBillingSchemaBillingSchemaDetailService', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($q, basicsBillingSchemaBillingSchemaDetailService, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'BillingSchemaDetail',
					valueMember: 'Id',
					displayMember: 'Description',
					dialogUuid: '38834cd02cc84f7bb0b250106c56d544',
					uuid: '92747c238dc14add9d555718c073na57',
					columns: [
						{
							id: 'RubricCategoryFk',
							field: 'RubricCategoryFk',
							name: 'RubricCategory',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RubricCategory',
								displayMember: 'Description'
							},
							width: 100
						},
						{
							id: 'desc',
							field: 'Description',
							name: 'Description',
							width: 150,
							name$tr$: 'cloud.common.entityDescription'
						}
					],
					disableCache: true,
					width: 500,
					height: 200
				};

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
					dataProvider: {
						getList: function () {
							var deferred = $q.defer();
							var currentEntity = arguments[1].entity;
							var detailList = basicsBillingSchemaBillingSchemaDetailService.getList();
							var detailResult = [];
							for (var i = 0; i < detailList.length; i++) {
								if (detailList[i].Id !== currentEntity.Id) {
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
			}]);
})(angular);