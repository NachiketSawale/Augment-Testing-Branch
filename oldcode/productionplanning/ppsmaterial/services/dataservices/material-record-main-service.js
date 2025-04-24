(function (angular) {
	'use strict';
	/*global globals _ */
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'productionplanning.ppsmaterial';

	angular.module(moduleName).factory('productionplanningPpsMaterialRecordMainService', MainService);
	MainService.$inject = [
		'$http',
		'$injector',
		'platformGridAPI',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'cloudDesktopSidebarService',
		'basicsMaterialMaterialGroupsService',
		'basicsCommonCharacteristicService'];

	function MainService(
		$http,
		$injector,
		platformGridAPI,
		dataServiceFactory,
		basicsLookupdataLookupDescriptorService,
		cloudDesktopSidebarService,
		groupsService,
		basicsCommonCharacteristicService) {
		const gridContainerGuid = '1ed6d6955a20488e83c10c1c76326275';
		const characteristic1SectionId = 59;
		const characteristic2SectionId = 60;
		let characteristicColumn = '';

		var serviceOption = {
			flatRootItem: {
				module: moduleName,
				entityNameTranslationID: 'productionplanning.ppsmaterial.record.entityMaterial',
				serviceName: 'productionplanningPpsMaterialRecordMainService',
				httpUpdate: { route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/', endUpdate: 'update' },
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/', endRead: 'newlist', usePostForRead: true,
					initReadData: function (readData, data) {
						readData.IsRefresh = false;
						readData.GroupIds = getGroupIds();
						if (cloudDesktopSidebarService.checkStartupFilter()) {
							return null;
						}
						var params = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(data.searchFilter);
						angular.extend(readData, params);
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							readData.MaterialNew = readData.Main.Materails || [];
							basicsLookupdataLookupDescriptorService.attachData(readData);

							basicsLookupdataLookupDescriptorService.updateData('PpsMaterialUsedId', [{
								Id: 1,
								Data: readData.PpsMaterialUsedId
							}]);

							let result = {
								FilterResult: readData.FilterResult,
								dtos: readData.Main.Materails || []
							};
							let dataRead = data.handleReadSucceeded(result, data);

							// handle charactistic
							let exist = platformGridAPI.grids.exist(gridContainerGuid);
							if (exist) {
								let containerInfoService = $injector.get('productionplanningPpsmaterialContainerInformationService');
								let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory')
									.getService(service, characteristic2SectionId, gridContainerGuid,containerInfoService);
								characterColumnService.appendCharacteristicCols(result.dtos);
							}

							return dataRead;
						}
					}
				},
				// modification: {simple: false},
				actions: { delete: false, create: false },
				entityRole: {
					root: {
						itemName: 'Material',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsMaterial',
						descField: 'DescriptionInfo.Translated'
					}
				},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				},
				translation: {
					uid: 'basicsMaterialRecordService',
					title: 'basics.material.record.gridViewTitle',
					columns: [{
						header: 'cloud.common.entityDescription',
						field: 'DescriptionInfo1'
					}, {
						header: 'basics.material.record.furtherDescription',
						field: 'DescriptionInfo2'
					}]
				}
			}
		};

		/* jshint -W003 */
		var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

		var service = serviceContainer.service;
		var data = serviceContainer.data;

		// serviceContainer.data.doUpdate = function () {
		//     return $q.when();
		// };

		service.clear = function clear() {
			groupsService.clear();
			// baseServiceClear();
		};
		service.clearData = function clearItems() {
			groupsService.clearData();
			data.itemList.length = 0;
			data.listLoaded.fire();
		};

		service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
			characteristicColumn = colName;
		};
		service.getCharacteristicColumn = function getCharacteristicColumn() {
			return characteristicColumn;
		};

		const basicsCharacteristicDataServiceFactory = $injector.get('basicsCharacteristicDataServiceFactory');
		const ch1Service = basicsCharacteristicDataServiceFactory.getService(service, characteristic1SectionId, 'PpsMaterial.Id');
		const ch2Service = basicsCharacteristicDataServiceFactory.getService(service, characteristic2SectionId, 'PpsMaterial.Id');

		ch1Service.registerEntityCreated(autoCreatePpsMaterialIfAbsent);
		ch2Service.registerEntityCreated(autoCreatePpsMaterialIfAbsent);

		function autoCreatePpsMaterialIfAbsent(e, entity) {
			const selectedItem = service.getSelected();
			if (selectedItem && _.isNil(selectedItem.PpsMaterial)) {
				$http.get(globals.webApiBaseUrl + 'productionplanning/ppsmaterial/getorcreateppsmaterial?mdcMaterialId=' + selectedItem.Id)
					.then(function (result) {
						selectedItem.PpsMaterial = result.data;
						entity.ObjectFk = selectedItem.PpsMaterial.Id;
						service.gridRefresh();
					});
			}
		}

		function getGroupIds() {
			if (groupsService.tempGroupIds.length === 0) {
				return [-1];
			}
			return groupsService.tempGroupIds;
		}
		// Remark: The "SearchFilter" of current dataservice would be fired by the function "onMaterialGroupIdsCheckChanged" of basicsMaterialRecordService.

		return service;
	}
})(angular);
