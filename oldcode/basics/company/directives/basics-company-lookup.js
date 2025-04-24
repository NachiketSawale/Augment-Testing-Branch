(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.company.directive:companyLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Structure lookup.
	 *
	 */
	angular.module('basics.company').directive('basicsCompanyCompanyLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'company',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogUuid: '7f6538a01eac452cb8946ddfc8a9f880',
				uuid: '6ed1e2778328490fbcb5c7c6470e5608',
				columns: [
					{id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{id: 'Name', field: 'CompanyName', name: 'Name', name$tr$: 'cloud.common.entityName'},
					{id: 'islive', field: 'IsLive', name: 'Active', name$tr$: 'cloud.common.entityIsLive', formatter: 'boolean'}
				],
				treeOptions: {
					parentProp: 'CompanyFk',
					childProp: 'Children',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				processData: function (dataList) {
					for (var i = 0; i < dataList.length; ++i) {
						var data = dataList[i];
						if (data.CompanyTypeFk === 1) {
							data.image = 'control-icons ico-comp-businessunit';
						} else if (data.CompanyTypeFk === 2) {
							data.image = 'control-icons ico-comp-root';
						} else {
							data.image = 'control-icons ico-comp-profitcenter';
						}
					}
					return dataList;
				},
			});
		}]);

})(angular);
