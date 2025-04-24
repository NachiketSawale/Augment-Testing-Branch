/**
 * Created by las on 9/27/2019.
 */


(function (angular) {
	'use strict';
	/* global angular _ */
	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('productionplanningDrawingCreateOption', [function () {
		return {
			rootService: 'productionplanningDrawingMainService',
			dataService: 'productionplanningDrawingCreateService',
			uiStandardService: 'productionplanningDrawingUIStandardService',
			validationService: 'productionplanningDrawingValidationService',
			fields: ['Code', 'Description', 'EngDrawingStatusFk', 'EngDrawingTypeFk', 'PrjProjectFk', 'LgmJobFk','BasClerkFk', 'PrjLocationFk', 'EngDrawingFk'],
			creationData: {mainItemId: null, 'PKey1': null},
		};
	}]);

	angular.module(moduleName).factory('ppsItemDrawingCreateOption', [
		'productionplanningDrawingCreateOption',
		'productionplanningDrawingUIStandardService',
		'productionplanningItemDataService',
		'basicsLookupdataLookupDescriptorService',
		function (productionplanningDrawingCreateOption,
			productionplanningDrawingUIStandardService,
			productionplanningItemDataService,
			basicsLookupdataLookupDescriptorService) {

			const option = Object.create(productionplanningDrawingCreateOption);

			const rows = _.cloneDeep(productionplanningDrawingUIStandardService.getStandardConfigForDetailView().rows).filter(i => option.fields.includes(i.model));
			addCreateOptionsForEngDrawingFkRow(rows.filter(i => i.model === 'EngDrawingFk')[0]);

			option.uiStandardService = {
				getDtoScheme: productionplanningDrawingUIStandardService.getDtoScheme,
				getStandardConfigForDetailView: () => {
					return {
						addValidationAutomatically: true,
						rows: rows,
					};
				},
			};

			option.creationData = () => {
				// before entity update response, the selectedItem(productionplanningItemDataService.getSelected()) pointed to update item
				// so if update request takes time, we may get the wrong "selectedItem" as currentItem
				// the correct way to get currentItem, should be get selected entity from platformGrid,
				// let focusedItem = itemTreeGrid.dataView.getRows()[itemTreeGrid.instance.getActiveCell().row]
				// however, this approach needs to build every item-configuration for each PU platform grid.
				// we find an easy way and use it temporary
				let creationData = {};
				const selectedEntities = productionplanningItemDataService.getSelectedEntities();

				if (selectedEntities.length > 0) {
					const selectedItem = selectedEntities[0];

					if (selectedItem === null) {
						return creationData;
					}

					creationData = {
						Id: getMasterDrawingFk(selectedItem) || 0,
						PKey1: selectedItem.ProjectFk,
						PKey2: selectedItem.LgmJobFk,
						PKey3: selectedItem.MaterialGroupFk
					};
				}

				return creationData;
			};

			return option;

			function addCreateOptionsForEngDrawingFkRow(row) {
				if (!row || !row.options) { return; }

				row.options.lookupOptions = {
					showAddButton: true,
					showClearButton: true,
					createOptions: option,
					defaultFilter: { projectId: 'PrjProjectFk'}
				};
			}

			function getMasterDrawingFk(selectedItem) {
				const ppsHeader = basicsLookupdataLookupDescriptorService.getLookupItem('PpsHeader', selectedItem.PPSHeaderFk);
				return ppsHeader ? ppsHeader.EngDrawingFk : null;
			}
		}]);

	angular.module(moduleName).factory('productionplanningDrawingCreateService', [
		'$q', 'productionplanningDrawingMainService',
		'platformDataValidationService',
	    'productionplanningItemDataService',
	    function ($q, productionplanningDrawingMainService,
		    platformDataValidationService,
		    productionplanningItemDataService) {
			var service = {};
			service.updateData = [];

			service.createItem = function (creationOptions, customCreationData) {
				return productionplanningDrawingMainService.createItemSimple(creationOptions, customCreationData, function (data) {
					let pu = productionplanningItemDataService.getSelected();
					if (pu) {
						let engTaskType = _.find(pu.EventTypeEntities, {PpsEntityFk: 5});
						// Engineering Task Type Id from event type table.
						let engTaskEvent = engTaskType ? _.find(pu.EventEntities, {EventTypeFk: engTaskType.Id}) : null;
						data.PrjLocationFk = engTaskEvent ? engTaskEvent.PrjLocationFk : null;
					}

					service.updateData.push(data);
					return data;
				});
			};
			service.update = function () {
				const updateData = service.updateData.pop();
				return productionplanningDrawingMainService.updateSimple({
					'Drawing': [updateData],
					'EntitiesCount': 1,
					'MainItemId': updateData.Id
				}).then(function (result) {
					clearValidationErrors(updateData);
				});
			};
			service.deleteItem = function () {
				const toDelete = service.updateData.pop();
				clearValidationErrors(toDelete);
				return $q.when(true);
			};

			function clearValidationErrors(entity) {
				platformDataValidationService.removeDeletedEntityFromErrorList(entity, productionplanningDrawingMainService);
			}

			return service;
		}]);

})(angular);
