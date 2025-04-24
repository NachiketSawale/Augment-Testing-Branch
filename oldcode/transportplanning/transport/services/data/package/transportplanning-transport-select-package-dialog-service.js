(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).value('transportplanningTransportPackageDialogListColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						sortable: true,
						editor: null
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						editor: null,
						sortable: true,
						readonly: true
					}
					/*,
					 {
					 id: 'header',
					 field: 'TrsHeaderFk',
					 name: 'Transport',
					 name$tr$: 'transportplanning.transport.entityTrsHeaderFk',
					 readonly: true,
					 editor: null,
					 sortable: true
					 }*/
				]
			};
		}
	});


	angular.module(moduleName).factory('transportplanningTransportPackageDialogDataService', transportplanningTransportPackageDialogDataService);
	transportplanningTransportPackageDialogDataService.$inject = [
		'treeviewListDialogListFactoryService'];
	function transportplanningTransportPackageDialogDataService(dataServiceFactory) {
		var moduleId = 'd5235c1fa22a4df9890e12eb505bbc30';
		var serviceOptions = {
			flatRootItem: {
				module: angular.module(moduleName),
				serviceName: 'transportplanningTransportPackageDialogBundleDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'transportplanning/package/',
					endRead: 'listthatreadyforroute'

				},
				actions: {},
				entityRole: {
					root: {
						itemName: 'TransportPackage',
						moduleName: 'cloud.desktop.moduleDisplayNamePackage',
						descField: 'DescriptionInfo.Translated'
					}
				},
				useItemFilter: true
			}
		};
		serviceOptions.getUrlFilter = function getUrlFilter() {
			return '';
		};
		return dataServiceFactory.getService(moduleId, serviceOptions);
	}
})(angular);