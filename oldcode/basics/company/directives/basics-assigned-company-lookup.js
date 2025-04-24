/**
  created by miu 1/29 2022
 **/
(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.company.directive:assignedCompanyLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Structure lookup.
	 *
	 */
	angular.module('basics.company').directive('basicsAssignedCompanyLookup', ['_', '$http', '$q', 'globals', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $http, $q, globals, BasicsLookupdataLookupDirectiveDefinition) {
			let companies = [];
			let companyTree = {};
			let defaults = {
				lookupType: 'assignedCompany',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogUuid: '596747f97e5140b480a3266ae0f6f691',
				uuid: '4b80a9769a75487c98f7e58bcd149b26',
				columns: [
					{id: 'Code', field: 'code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{id: 'Name', field: 'name', name: 'Name', name$tr$: 'cloud.common.entityName'}
				],
				treeOptions: {
					parentProp: 'parentId',
					childProp: 'children',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				width: 500,
				height: 200
			};

			function processAndGenerateCompanies(tree) {
				_.forEach(tree, function (company) {
					company.Id = company.id;
					company.Code = company.code;
					company.CompanyName = company.name;
					companies.push(company);
					if (company.hasChildren) {
						processAndGenerateCompanies(company.children);
					}
				});
			}

			function generateAssginedCompanies(){
				$http.get(globals.webApiBaseUrl + 'basics/company/getassignedcompanies').then(function (response) {
					companyTree = response.data;
					processAndGenerateCompanies(companyTree);
				});
			}

			function getCompany(key) {
				return $http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + key).then(function (response) {
					return response.data;
				});
			}

			function initialize(){
				if (companies.length === 0) {
					generateAssginedCompanies();
				}
			}

			initialize();

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,
				{
					dataProvider: {
						getList: function () {
							if (companies.length === 0) {
								generateAssginedCompanies();
							}
							return $q.when(companyTree);
						},
						getItemByKey: function (key) {
							if (companies.length === 0){
								return getCompany(key);
							}
							else {
								return $q.when(_.find(companies, {id: key}));
							}
						}
					},
					processData: function (dataList) {
						for (var i = 0; i < dataList.length; ++i) {
							var data = dataList[i];
							if (data.companyType === 1) {
								data.image = 'control-icons ico-comp-businessunit';
							} else if (data.companyType === 2) {
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
