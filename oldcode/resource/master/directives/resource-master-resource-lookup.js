/**
 * Created by anl on 3/23/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'resource.master';
	angular.module(moduleName).directive('resourceMasterResourceLookup', ResourceMasterResourceLookup);

	ResourceMasterResourceLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', '$injector', 'basicsLookupdataConfigGenerator'];

	function ResourceMasterResourceLookup(BasicsLookupdataLookupDirectiveDefinition, $injector, basicsLookupdataConfigGenerator) {

		var defaults = {
			lookupType: 'ResourceMasterResource',
			valueMember: 'Id',
			displayMember: 'Code',
			version: 3,
			//editable: 'false'
			uuid: 'cd90457b185b48b380e86ef3d48e8324',
			columns: [
				{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
				{
					id: 'desc',
					field: 'DescriptionInfo.Translated',
					name: 'DescriptionInfo',
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'kindfk', field: 'KindFk', name: 'KindFk', name$tr$: 'resource.master.KindFk',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcekind').grid.formatterOptions
				},
				{
					id: 'groupfk', field: 'GroupFk', name: 'GroupFk', name$tr$: 'resource.master.GroupFk',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcegroup').grid.formatterOptions
				},
				{
					id: 'companyfk', field: 'CompanyFk', name: 'CompanyFk', name$tr$: 'cloud.common.entityCompany',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Company',
						displayMember: 'DescriptionInfo.Translated',
						width: 140
					}
				},
				//  { id: 'calendarfk', field: 'CalendarFk', name: 'CalendarFk', name$tr$: 'cloudCommonModule.entityCalCalendarFk' },
				{
					id: 'costcodefk', field: 'CostCodeFk', name: 'CostCodeFk', name$tr$: 'resource.master.CostCodeFk',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CostCode',
						displayMember: 'DescriptionInfo.Translated',
						width: 140
					}
				}
			],
			width: 500,
			height: 200,
			title: {name: 'Assign Resource', name$tr$: 'resource.master.dialogTitleResource'}
		};
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
			processData: function (dataList) {
				var service = $injector.get('resourceMasterPoolDataService');
				var selectedItem = service.getSelected();
				if (selectedItem === null) {
					return dataList;
				}
				var array = [];
				for (var i = 0; i < dataList.length; i++) {
					if (dataList[i].Id === selectedItem.ResourceFk) {
						array.push(i);
					}
				}
				array.forEach(function (item) {
					dataList.splice(item, 1);
				});

				return dataList;
			}
		});
	}
})(angular);
