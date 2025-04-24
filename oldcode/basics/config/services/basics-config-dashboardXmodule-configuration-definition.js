/**
 * Created by aljami on 27.10.2020.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';
	var configModule = new angular.module(moduleName);

	configModule.factory('basicsConfigDashboardXModuleLayout', basicsConfigDashboardXModuleLayout);

	basicsConfigDashboardXModuleLayout.$inject = ['basicsLookupdataConfigGenerator'];

	function basicsConfigDashboardXModuleLayout(basicsLookupdataConfigGenerator){
		return {
			fid: 'basics.config.dashboard2module.layout',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['basdashboardfk', 'frmaccessrightdescriptorfk', 'isvisible']
				},
				{
					gid: 'entityHistory',
					isHistory: false
				}
			],
			overloads:{
				basdashboardfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsConfigDashboardLookupDataService',
					enableCache: true
				}),
				frmaccessrightdescriptorfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.lookup.accessrightdescriptor', 'Name', {readonly:true}),
				icon:{
					'grid': {
						exclude: true // temporary. will be changed with an icon selection later
					}
				}
			},
			translationInfos: {
				extraModules: [],
				extraWords: {
					BasModuleFk: {'location': moduleName, identifier: 'basModuleFk', initial: 'Module'},
					BasDashboardFk: {'location': moduleName, identifier: 'basDashboardFk', initial: 'Dashboard'},
					FrmAccessrightdescriptorFk: {'location': moduleName, identifier: 'frmAccessrightdescriptorFk', initial: 'Accessrightdescriptor'},
					Icon: {'location': moduleName, identifier: 'icon', initial: 'Icon'},
					Sorting: {'location': moduleName, identifier: 'sorting', initial: 'Sorting'},
					Isvisible: {'location': moduleName, identifier: 'isvisible', initial: 'Is Visible'},
					Isdefault: {'location': moduleName, identifier: 'isdefault', initial: 'Isdefault'},
					Visibility: {'location': moduleName, identifier: 'dashboardvisibility', initial: 'Visibility'}
				}
			}
		};
	}
})(angular);
