(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.package';
	angular.module(moduleName).directive('transportplanningPackageSelectionLookup', lookup);

	lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'transportplanningPackageImageProcessor', 'packageTypes', 'transportplanningPackageStatusHelperService','basicsLookupdataConfigGenerator'];

	function lookup(BasicsLookupdataLookupDirectiveDefinition, transportplanningPackageImageProcessor, packageTypes, packageStatusHelperServ,basicsLookupdataConfigGenerator) {

		var defaults = {
			lookupType: 'TrsPackageListLookup',
			version: 3,//for new lookup master api, the value of version should be greater than 2
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '63dae02ca88a486fa57bda45a2f3a44e',
			treeOptions: {
				parentProp: 'TransportPackageFk',
				childProp: 'ChildPackages',
				initialState: 'expanded',
				inlineFilters: true,
				hierarchyEnabled: true
			},
			columns: [
				{id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
				{
					id: 'Description',
					field: 'DescriptionInfo.Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'TrsPkgStatusFk',
					field: 'TrsPkgStatusFk',
					name: 'TrsPkgStatusFk',
					name$tr$: 'cloud.common.entityStatus',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.trspackagetatus',null, {
						showIcon: true
					}).grid.formatterOptions
				},
				{
					id: 'TrsPkgTypeFk',
					field: 'TrsPkgTypeFk',
					name: 'TrsPkgTypeFk',
					name$tr$: 'cloud.common.entityType',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.transportpackagetype',null).grid.formatterOptions
				}
			],
			width: 500,
			height: 200
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
			processData: function (dataList) {
				var array = [];
				dataList.forEach(function (item) {
					if (item.TrsPkgTypeFk === packageTypes.PackageSelection) {
						array.push(item);
					}
				});
				array.forEach(function (item) {
					var x = dataList.indexOf(item);
					if (x > -1) {
						dataList.splice(x, 1);
					}
				});
				return transportplanningPackageImageProcessor.processData(dataList);
			}
		});
	}
})(angular);