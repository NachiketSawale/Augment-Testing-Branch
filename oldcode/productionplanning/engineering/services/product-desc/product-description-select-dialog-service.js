(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).value('productionplanningEngineeringProductDescriptionDialogListColumns', {
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
					},
					{
						id: 'engdrawingfk',
						field: 'EngDrawingFk',
						name: 'Drawing',
						name$tr$: 'productionplanning.producttemplate.entityEngDrawingFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EngDrawing',
							displayMember: 'Code',
							valueMember: 'Id',
							version: 3
						},
						readonly: true,
						editor: null
					},
					{
						id: 'engdrawingdesc',
						field: 'EngDrawingFk',
						name: 'Drawing Description',
						name$tr$: 'productionplanning.producttemplate.engDrawingDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EngDrawing',
							displayMember: 'Description',
							version: 3
						}
					}
				]
			};
		}
	});


	angular.module(moduleName).factory('productionplanningEngineeringProductDescriptionDialogDataService', DataService);
	DataService.$inject = ['treeviewListDialogListFactoryService', '$injector'];
	function DataService(dataServiceFactory, $injector) {
		var moduleId = 'e75791176aec4352aa5ffbe71ed0f25b';
		var serviceOptions = {
			flatRootItem: {
				module: angular.module(moduleName),
				serviceName: 'productionplanningEngineeringProductDescriptionDialogDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/',
					endRead: 'listthatreadyforengtask'

				},
				actions: {},
				entityRole: {
					root: {
						itemName: 'ProductDescription',
						moduleName: 'cloud.desktop.moduleDisplayNameEngineering',
						descField: 'DescriptionInfo.Translated'
					}
				},
				useItemFilter: true
			}
		};


		serviceOptions.getUrlFilter = function getUrlFilter() {
			var entity = $injector.get('productionplanningEngineeringMainService').getSelected();
			return 'engDrawingId=' + entity.EngDrawingFk;
		};

		// var factoryConfig = {
		//     itemUrl: 'productionplanning/producttemplate/productdescription/listthatreadyforengtask'
		// };
		//var service = dataServiceFactory.createDataService(serviceOptions, factoryConfig);
		//return service;
		return dataServiceFactory.getService(moduleId, serviceOptions);

	}
})(angular);