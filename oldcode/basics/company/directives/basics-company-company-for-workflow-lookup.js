/**
 * Created by lst on 9/23/2019.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsCompanyCompanyForWorkflowLookup
	 * @element div
	 * @restrict A
	 * @description
	 * basicsCompanyCompanyForWorkflowLookup basics-company-company-for-workflow-lookup
	 */
	angular.module('basics.company').directive('basicsCompanyCompanyForWorkflowLookup', ['$q', '$translate', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsCompanyImageProcessor', 'basicsCompanyCompanyForWorkflowLookupService',
		function ($q, $translate, BasicsLookupdataLookupDirectiveDefinition, basicsCompanyImageProcessor, basicsCompanyCompanyForWorkflowLookupService) {
			var defaults = {
				lookupType: 'companyForWorkflow',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogUuid: '7d2aa33b51e8432694a584b0f4dfe422',
				uuid: '02ffe08e71a74b15b8aeba086051c74b',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{id: 'name', field: 'CompanyName', name: 'Name', name$tr$: 'cloud.common.entityName'}
				],
				treeOptions: {
					parentProp: 'CompanyFk',
					childProp: 'Companies',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				width: 500,
				height: 200
			};

			function processIcon(companies) {
				angular.forEach(companies, function (item) {
					basicsCompanyImageProcessor.processItem(item);
					if (item.Companies && item.Companies.length > 0) {
						processIcon(item.Companies);
					}
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: function () {
						return basicsCompanyCompanyForWorkflowLookupService.getCompanyListAsync();
					},
					getItemByKey: function (key) {
						return basicsCompanyCompanyForWorkflowLookupService.getCompanyListAsyncByKey(key);
					}
				},
				processData: function (dataList) {
					processIcon(dataList);
					return dataList;
				}
			});
		}]);

})(angular);
