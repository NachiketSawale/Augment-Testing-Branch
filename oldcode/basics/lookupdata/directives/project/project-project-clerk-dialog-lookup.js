(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name project-project-clerk-dialog-lookup
	 * @requires
	 * @description dialog lookup to get project with selection of the clerk
	 */

	angular.module('basics.lookupdata').directive('projectProjectClerkDialogLookup', ['_', 'LookupFilterDialogDefinition', 'basicsLookupdataLookupFilterService',
		'projectProjectClerkLookupDataService', 'platformLayoutHelperService',
		function (_, LookupFilterDialogDefinition, basicsLookupdataLookupFilterService, projectProjectClerkLookupDataService, platformLayoutHelperService) {

			let clerkRow =  angular.extend({
				gid: 'selectionfilter',
				rid: 'clerk',
				label: 'Clerk',
				label$tr$: 'cloud.common.entityClerk',
				model: 'clerkFk',
				sortOrder: 1
			}, platformLayoutHelperService.provideClerkLookupOverload(true).detail);

			let formSettings = {
				fid: 'project.clerk.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [clerkRow]
			};

			let gridSettings = {
				layoutOptions:{
					translationServiceName: 'projectMainTranslationService',
					uiStandardServiceName: 'projectMainStandardConfigurationService',
					schemas: [{
						typeName: 'ProjectDto',
						moduleSubModule: 'Project.Main'
					}]
				}
			};
			let lookupOptions = {
				lookupType: 'Project',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'cloud.common.dialogTitleProject',
				filterOptions: {
					serverSide: true,
					serverKey: 'project-project-clerk-filter',
					fn: function (item){
						return projectProjectClerkLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: 'b94010627344460189e293c523f73703'
			};
			return  new LookupFilterDialogDefinition(lookupOptions, 'projectProjectClerkLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
