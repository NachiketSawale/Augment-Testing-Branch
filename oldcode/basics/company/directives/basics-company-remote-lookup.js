/**
 * Created by ysl on 12/20/2017.
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
	angular.module('basics.company').directive('basicsCompanyRemoteCompanyLookup', ['$q', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsCompanyImageProcessor', 'basicsCompanyImportContentSelectionService',
		function ($q, BasicsLookupdataLookupDirectiveDefinition, basicsCompanyImageProcessor, basicsCompanyImportContentSelectionService) {
			var defaults = {
				lookupType: 'remoteCompany',
				valueMember: 'Code',
				displayMember: 'Code',
				uuid: '9d5ec564654b4fbdaedb0d975ca0be7d',
				columns: [
					{id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{id: 'Name', field: 'Name', name: 'Name', name$tr$: 'cloud.common.entityName'}
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

			function processIcon(companies) {
				angular.forEach(companies, function (item) {
					item.CompanyTypeFk = item.CompanyType;
					basicsCompanyImageProcessor.processItem(item);
					if (item.Children && item.Children.length > 0) {
						processIcon(item.Children);
					}
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: function () {
						return basicsCompanyImportContentSelectionService.getCompanyListAsync();
					},
					getItemByKey: function (key) {
						return basicsCompanyImportContentSelectionService.getCompanyListAsyncByKey(key);
					}
				},
				processData: function (dataList) {
					processIcon(dataList);
					return dataList;
				}
			});
		}]);
})(angular);
