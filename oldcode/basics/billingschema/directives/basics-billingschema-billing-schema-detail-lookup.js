/**
 * Created by wwa on 9/18/2016.
 */
(function (angular) {
	'use strict';

	angular.module('basics.billingschema').directive('basicsBillingSchemaBillingSchemaDetailLookup', ['$q', 'basicsBillingSchemaBillingSchemaDetailService',
		'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, basicsBillingSchemaBillingSchemaDetailService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'BillingSchemaDetail',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid: '92747c238dc14add9d555718c073na57',
				dialogUuid: '148c4245cf3349de998256c6f0fcc025',
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
					{ id: 'desc', field: 'Description', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDescription' }
				],
				disableCache: true,
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: function () {
						var deferred = $q.defer();
						var billingLineTypeList = [13, 14];
						var currentEntity = arguments[1].entity;
						basicsBillingSchemaBillingSchemaDetailService.getListByMainId().then(function(res){
							var detailList = [];
							var currentList = basicsBillingSchemaBillingSchemaDetailService.getList();
							if (billingLineTypeList.indexOf(currentEntity.BillingLineTypeFk) !== -1) {
								detailList = res.data;
							}else{
								detailList = currentList;
							}

							var detailResult = [];
							var pPeriodCumulative = currentEntity.BillingLineTypeFk === 14; // previous period cumulative
							var sort = false;
							for (var i = 0; i < detailList.length; i++) {
								sort = pPeriodCumulative || detailList[i].Sorting < currentEntity.Sorting;
								if (sort && detailList[i].Id !== currentEntity.Id ||
									detailList[i].RubricCategoryFk !== currentEntity.RubricCategoryFk) {
									detailList[i].Description = detailList[i].DescriptionInfo.Translated;
									detailResult.push(detailList[i]);
								}
							}

							deferred.resolve(detailResult);

						}, function(){
							console.log('basicsBillingSchemaBillingSchemaDetailLookup getList err');
						});
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
						return $q.when(item);
					}
				}
			});
		}
	]);
})(angular);