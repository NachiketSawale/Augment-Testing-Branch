/**
 * @author: chd
 * @date: 10/28/2020 4:19 PM
 * @description:
 */

/**
 * Created by chd on 5/7/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).directive('basicsAiCostGroupLookupService',
		['_', '$q', '$http', 'globals', '$translate', '$timeout',
			'platformModalService', 'platformGridAPI', 'platformTranslateService', 'platformRuntimeDataService',
			'BasicsLookupdataLookupDirectiveDefinition', 'basicsAICostGroupDataService',
			function (_, $q, $http, globals, $translate, $timeout,
			          platformModalService, platformGridAPI, platformTranslateService, platformRuntimeDataService,
			          BasicsLookupdataLookupDirectiveDefinition, basicsAICostGroupDataService) {

				var defaults = {
					lookupType: 'SuggestedCostGroup',
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: '76CF65F6A1AD4F6DA3F5F8A03E833D9A',
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							width: 180,
							formatter: 'code',
							name$tr$: 'cloud.common.entityCode'
						},
						{
							id: 'Description',
							field: 'DescriptionInfo',
							name: 'Description',
							width: 300,
							formatter: 'translation',
							name$tr$: 'cloud.common.entityDescription'
						},
						{
							id: 'qty',
							field: 'Quantity',
							name: 'Quantity',
							width: 120,
							toolTip: 'Quantity',
							formatter: 'quantity',
							name$tr$: 'cloud.common.entityQuantity'
						},
						{
							id: 'UomFk',
							field: 'UomFk',
							name: 'Uom',
							width: 50,
							name$tr$: 'basics.costcodes.uoM',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					],
					width: 350,
					height: 120
				};

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
					dataProvider: {
						getList: function (settings, scope) {
							var deferred = $q.defer();
							var costGroupCatId = scope.$parent.$parent.config ? scope.$parent.$parent.config.costGroupCatId: -1;
							var entityId = scope.$parent.$parent.entity ? scope.$parent.$parent.entity.Id : -1;
							var costGroups = basicsAICostGroupDataService.getCostGroupList(costGroupCatId, entityId);
							deferred.resolve(costGroups);
							return deferred.promise;

						},
						getItemByKey: function (value) {
							return basicsAICostGroupDataService.getCostGroupById(value);
						}
					},
					controller: ['$scope', 'platformGridAPI', 'platformCreateUuid', function (/*$scope*/) {

					}]
				});
			}]);
})(angular);

