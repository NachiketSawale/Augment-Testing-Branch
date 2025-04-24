(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name schedulingActivityTemplateFilterLookupDialog
	 * @requires LookupFilterDialogDefinition, basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('scheduling.lookup').directive('schedulingActivityTemplateFilterLookupDialog', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator',
		'schedulingActivityTemplateFilterLookupDataService',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, schedulingActivityTemplateFilterLookupDataService) {
			let formSettings = {
				fid: 'scheduling.template.selectionfilter',
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
				rows: [basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'schedulingTemplateGroupLookupDataService',
					desMember: 'DescriptionInfo.Translated',
					isComposite: true,
					lookupType: 'activitytemplategroupfk',
					showClearButton: true
				},
				{
					gid: 'selectionfilter',
					rid: 'templategroup',
					label: 'ActivityTemplateGroup',
					label$tr$: 'scheduling.template.activityTemplateGroup',
					type: 'integer',
					model: 'templateGroupFk',
					sortOrder: 1
				})]
			};

			let gridSettings = {
				layoutOptions: {
					translationServiceName: 'schedulingTemplateTranslationService',
					uiStandardServiceName: 'schedulingTemplateActivityTemplateUIStandardService',
					schemas: [{
						typeName: 'ActivityTemplateDto',
						moduleSubModule: 'Scheduling.Template'
					}]
				},
				inputSearchMembers: ['Code', 'SearchPattern', 'Specification', 'DescriptionInfo.Translated', 'UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04',
					'UserDefinedText05', 'UserDefinedText06', 'UserDefinedText07', 'UserDefinedText08', 'UserDefinedText09', 'UserDefinedText10']
			};
			let lookupOptions = {
				lookupType: 'schedulingActivityTemplate',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'scheduling.main.lookupAssignTemplate',
				uuid: '3b93fdcb35bf40deb878d5ed0b50da89',
				filterOptions: {
					serverSide: true,
					serverKey: 'activityTemplateFilter',
					fn: function (item) {
						return schedulingActivityTemplateFilterLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'schedulingActivityTemplateFilterLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);