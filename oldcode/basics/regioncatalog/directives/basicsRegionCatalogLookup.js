/**
 * Created by jhe on 8/2/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.regionCatalog';
	/**
     * @ngdoc directive
     * @name basics.material.directive:basicsMaterialPriceConditionLookup
     * @element div
     * @restrict A
     * @description
     * Configuration combobox.
     *
     */
	angular.module(moduleName).directive('basicsRegionCatalogLookup', ['platformModalService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				valueMember: 'Id',
				displayMember: 'Code',
				columns: [
					{id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 100, name$tr$: 'cloud.common.entityDescription'},
					{id: 'com',field: 'CommentTextInfo.Translated', name: 'CommentText', width: 120, name$tr$: 'basics.regionCatalog.entityCommentTextInfo'},
					{ id: 'uom', field: 'UoMFk', name: 'UomFk', width: 120, toolTip: 'QuantityUoM', name$tr$: 'cloud.common.entityUoM', formatter: 'lookup',
						formatterOptions: {lookupType: 'uom', displayMember: 'Unit'	}, searchable:false},
					{id: 'orgCode',field: 'OrgCode', name: 'OrgCode', width: 100, name$tr$: 'basics.regionCatalog.entityOrgCode'}
				],
				height: 250,
				treeOptions: {
					parentProp: 'RegionCatalogFk',
					childProp: 'ChildItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				title: {name: 'Region Catalog', name$tr$: 'basics.regionCatalog.regionCatalogList'},
				buildSearchString:function(searchValue){
					if(!searchValue){
						return '';
					}
					var searchString = 'CommentTextInfo.Description.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g,searchValue);
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}]);
})(angular);
