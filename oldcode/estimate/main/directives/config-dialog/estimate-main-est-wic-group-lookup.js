/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name estimateMainEstWicGroupLookup
	 * @requires BasicsLookupdataLookupDirectiveDefinition
	 * @description
	 */
	angular.module('estimate.main').directive('estimateMainEstWicGroupLookup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'WicGroup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'a9fb4e9d22324c8f88804c7de818fc3d',
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
				},
				treeOptions: {
					parentProp: 'WicGroupFk',
					childProp: 'WicGroups',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				url: {
					getList: 'boq/wic/group/tree',
					getItemByKey:  'boq/wic/group/getitembyid'
				},
				processData: function (dataList) {
					for (let i = 0; i < dataList.length; ++i) {
						let data = dataList[i];
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
