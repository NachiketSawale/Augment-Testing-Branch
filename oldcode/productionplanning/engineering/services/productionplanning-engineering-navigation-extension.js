/**
 * Created by zwz on 2020/1/8.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var engtaskModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringNavigationExtension
	 * @function
	 * @requires basicsLookupdataLookupDescriptorService, cloudDesktopSidebarService, platformSchemaService, productionplanningEngineeringPinningContextExtension, $q
	 * @description
	 * productionplanningEngineeringNavigationExtension provides navigation functionality for engineering task data service
	 */
	engtaskModule.service('productionplanningEngineeringNavigationExtension', NavigationExtension);
	NavigationExtension.$inject = ['basicsLookupdataLookupDescriptorService',
		'$q',
		'cloudDesktopSidebarService',
		'platformSchemaService',
		'productionplanningEngineeringPinningContextExtension'];

	function NavigationExtension(basicsLookupdataLookupDescriptorService,
								 $q,
								 cloudDesktopSidebarService,
								 platformSchemaService,
								 pinningContextExtension) {

		this.addNavigation = function (service) {
			//for navigational function
			service.navigateTo = function navigateTo(item, triggerField) {
				if (isEngHeader(item)) {
					//Function getItemByKey is "get lookup item from server side". The task item should be valid,then we set pinningCxt and load data.
					$q.when(basicsLookupdataLookupDescriptorService.getItemByKey('EngHeader', item.Id, { version: 3 })).then(function (item) {
						if (item) {
							pinningContextExtension.setEngineeringToPinningContext(item.ProjectFk, item, service).then(function () {
								//refresh data
								service.load();
							});
						}
					});
				} else if (triggerField === 'EngTaskFk') {
					searchById(item.EngTaskFk, service);
				} else if(triggerField === 'EngDrawingFk'){
					cloudDesktopSidebarService.filterSearchFromPKeys(null, [{
						Token: 'productionplanning.engDrawingFk',
						Value: item.EngDrawingFk
					}]);
				}else if (triggerField === 'Code') {
					searchById(item.Id, service);
				}
			};
		};

		function isEngHeader(item) {
			var dtoSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'EngHeaderDto',
				moduleSubModule: 'ProductionPlanning.Engineering'
			}).properties;
			var propertyNames = Object.getOwnPropertyNames(dtoSchema);

			for (var i = 0; i < propertyNames.length; i++) {
				if (propertyNames[i] === 'Inserted' || propertyNames[i] === 'Updated') {
					continue;
				}
				if (!Object.prototype.hasOwnProperty.call(item,propertyNames[i])) {
					return false;
				}
			}
			return true;
		}

		function searchById(id, service) {
			var item = service.getItemById(id);
			if (!item) {
				cloudDesktopSidebarService.filterSearchFromPKeys([id]);
			}
			else {
				service.setSelected(item);
			}
		}

	}
})(angular);
