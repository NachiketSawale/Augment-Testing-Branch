/**
 * Created by bh on 09.04.2019.
 */

(function () {

	/* global */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainFlatWicGroupLookup
	 * @requires $injector, BasicsLookupdataLookupDirectiveDefinition
	 * @description
	 */
	angular.module('boq.main').directive('boqMainFlatWicGroupLookup', ['$injector', '$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, $q, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'FlatWicGroup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '3a6f1019a58c4c458ddfb65d143ceed0',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'desc',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						width: 120,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				popupOptions: {
					width: 500
				}
			};

			var boqWicGroupService = $injector.get('boqWicGroupService');

			function getFlatWicGroupList() {
				return boqWicGroupService.loadWicGroup().then(function (wicGroupTree) {
					return boqWicGroupService.getFlattenByTree(wicGroupTree);
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'flatWicGroupLookupHandler',

					getList: function getList(/* settings, scope */) {
						return getFlatWicGroupList();
					},

					getDefault: function getDefault() {
						return $q.when([]);
					},

					getItemByKey: function getItemByKey(value/* , options, scope */) {
						return boqWicGroupService.getItemById(value);
					},

					getSearchList: function getSearchList(/* searchString, displayMember, scope, searchListSettings */) {
						return getFlatWicGroupList();
					}
				},
				processData: function (dataList) {
					for (var i = 0; i < dataList.length; ++i) {
						var data = dataList[i];
						if (data.WicGroupFk === null) {
							data.image = 'ico-comp-root';
						} else {
							data.image = 'ico-folder-empty';
						}
					}
					return dataList;
				}
			});
		}]);
})();
