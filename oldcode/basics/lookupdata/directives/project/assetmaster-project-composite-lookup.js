/**
 * Created by jes on 2/13/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataAssetmasterProjectCompositeLookup', basicsLookupDataProjectLookup);

	basicsLookupDataProjectLookup.$inject = [
		'BasicsLookupdataParentChildGridLookupDialogDefinition'
	];

	function basicsLookupDataProjectLookup(
		BasicsLookupdataParentChildGridLookupDialogDefinition
	) {
		var options = {
			lookupType: 'project',
			valueMember: 'Id',
			displayMember: 'ProjectNo',
			dialogOptions: {
				headerText: 'cloud.common.entityProject'
			},
			parent: {
				uuid: '379D08EC06814295A54F6C5E236DDA23',
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/assetmaster/',
					endRead: 'lookuptree',
					usePostForRead: false
				},
				presenter: {
					tree: {
						parentProp: 'AssetMasterParentFk',
						childProp: 'AssetMasterChildren',
						showChildrenItems: false // default(true)
					}
				},
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						width: 100
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						readonly: true,
						width: 150
					}
				]
			},
			child: {
				uuid: '4242B96B5BD846C5A0E8490FB44B41E4',
				parentFk: 'AssetMasterFk',
				filterParent: false,
				showAllSearchResult: true,
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/lookupdata/master/',
					endRead: 'getsearchlist',
					getRequestParam: function (parentItem) {
						var temp = 'AssetMasterFk=' + parentItem.Id;
						return '?lookup=project&filtervalue=('+ temp +')';
					}
				},
				httpSearch: {
					disableGetAll: false,
					buildSearchString: function (searchValue) {
						var searchString = '';
						if (searchValue) {
							searchString += 'ProjectNo.Contains("%SEARCH%") or ProjectName.Contains("%SEARCH%")';
						}
						return searchString.replace(/%SEARCH%/g, searchValue);
					}
				},
				columns: [
					{
						id: 'projectNo',
						field: 'ProjectNo',
						name: 'ProjectNo',
						name$tr$: 'cloud.common.entityProjectNo',
						readonly: true,
						width: 100
					},
					{
						id: 'ProjectName',
						field: 'ProjectName',
						name: 'ProjectName',
						name$tr$: 'cloud.common.entityProjectName',
						readonly: true,
						width: 120
					},
					{
						id: 'AssetMaster',
						field: 'AssetMasterFk',
						name: 'Asset Master',
						name$tr$: 'procurement.package.entityAssetMaster',
						formatter: 'lookup',
						formatterOptions: {
							lookupType:'AssertMaster',
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
							lookupType:'AssertMaster',
							displayMember: 'DescriptionInfo.Translated'
						}
					},
					{
						id: 'ProjectName2',
						field: 'ProjectName2',
						name: 'Project Name2',
						width: 120,
						name$tr$: 'cloud.common.entityProjectName2'
					},
					{
						id: 'StartDate',
						field: 'StartDate',
						name: 'Start',
						formatter: 'dateutc',
						width: 120,
						name$tr$: 'cloud.common.entityStartDate'
					},
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
						width: 150
					},
					{
						id: 'Group',
						field: 'GroupDescription',
						name: 'Group',
						width: 150,
						name$tr$: 'cloud.common.entityGroup',
						searchable: false
					}
				]
			}
		};

		return new BasicsLookupdataParentChildGridLookupDialogDefinition(options);
	}

})(angular);