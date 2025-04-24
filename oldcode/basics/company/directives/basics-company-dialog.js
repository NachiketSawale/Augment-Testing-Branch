/**
 * Created by uestuenel on 01.06.2016.
 */

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
	angular.module('basics.company').directive('basicsCompanyCompanyDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'company',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'cbe94482905045129f29fdc4958c5c1b',
				columns: [
					{ id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'Name', field: 'CompanyName', name: 'Name', name$tr$: 'cloud.common.entityName' }
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

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
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
				}
			});
		}]);

})(angular);
