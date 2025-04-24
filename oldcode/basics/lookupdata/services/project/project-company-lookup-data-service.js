/**
 * Created by anl on 10/14/2018.
 */


(function (angular) {
	'use strict';
	var moduleName = 'basics.lookupdata';
	angular.module(moduleName).factory('basicsLookupDataProjectLookupDataService', ProjectLookupDialog);
	ProjectLookupDialog.$inject = ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		'basicsCompanyTrsConfigService'];

	function ProjectLookupDialog(platformLookupDataServiceFactory, basicsLookupdataConfigGenerator,
								 basicsCompanyTrsConfigService) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsLookupDataProjectLookupDataService', {
			valMember: 'Id',
			dispMember: 'ProjectNo',
			columns: [
				{
					id: 'prjStatusFk',
					field: 'StatusFk',
					name$tr$: 'cloud.common.entityState',
					sortable: true,
					formatter: 'lookup',
					formatterOptions: {
						lookupSimpleLookup: true,
						lookupModuleQualifier: 'project.main.status',
						displayMember: 'Description',
						valueMember: 'Id',
						imageSelector: 'platformStatusIconService'
					},
					width: 110
				},
				{
					id: 'ProjectNo',
					field: 'ProjectNo',
					name: 'Project No.',
					width: 100,
					name$tr$: 'cloud.common.entityProjectNo'
				},
				{
					id: 'ProjectName',
					field: 'ProjectName',
					name: 'Project Name',
					width: 120,
					name$tr$: 'cloud.common.entityProjectName'
				},
				{
					id: 'AssetMaster',
					field: 'AssetMasterFk',
					name: 'Asset Master',
					name$tr$: 'procurement.package.entityAssetMaster',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'AssertMaster',
						displayMember: 'Code'
					}
				},
				{
					id: 'AssetMasterDescription',
					field: 'AssetMasterFk',
					name: 'Asset Master Description',
					name$tr$: 'procurement.package.entityAssetMasterDescription',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'AssertMaster',
						displayMember: 'DescriptionInfo.Translated'
					}
				},
				{
					id: 'ProjectName2',
					field: 'ProjectName2',
					name: 'Project Name2',
					width: 200,
					name$tr$: 'cloud.common.entityProjectName2'
				},
				{
					id: 'StartDate',
					field: 'StartDate',
					name: 'Start',
					formatter: 'dateutc',
					width: 100,
					name$tr$: 'cloud.common.entityStartDate'
				},
				{
					id: 'Group',
					field: 'GroupDescription',
					name: 'Group',
					width: 150,
					name$tr$: 'cloud.common.entityGroup',
					searchable: false
				},
				{
					id: 'ProjectIndex',
					field: 'ProjectIndex',
					name: 'Project Index',
					width: 100,
					name$tr$: 'cloud.common.entityProjectIndex',
					searchable: false
				}
			],
			uuid: '110fa305276842d9958d54d86fb56058',
			events: [],
			title: {
				name: 'cloud.common.dialogTitleProject'
			}
		});

		var filterCompanies = {};
		var projectLookupDialogDataServiceConfig = {
			httpRead: {route: globals.webApiBaseUrl + 'project/main/', endPointRead: 'listbycompany',
				usePostForRead: true},
			filterParam: filterCompanies // 'companyIds'
			// prepareFilter: function () {
			// 	var filterCompanies = [];
			// 	var selectedCompany = basicsCompanyTrsConfigService.parentService().getSelected();
			// 	if(selectedCompany){
			// 		service.getFilterCompanies(selectedCompany, filterCompanies);
			// 	}
			// 	return filterCompanies;
			// }
		};

		var service = platformLookupDataServiceFactory.createInstance(projectLookupDialogDataServiceConfig).service;

		service.getFilterCompanies = function(company, filterCompanies){
			filterCompanies.push(company.Id);
			if(company.Companies.length > 0){
				_.forEach(company.Companies, function(company){
					service.getFilterCompanies(company, filterCompanies);
				});
			}
		};

		return service;
	}
})(angular);