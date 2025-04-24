
(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';

	// Provides functions for the manipulation of BOQ items in estimate module.
	// It ensures the correct usage of the functions of 'boqMainService' and hides it for safety reasons.
	angular.module(moduleName).factory('boqMainBoqDrivenEstimateService', ['$http', 'cloudCommonGridService', 'boqMainServiceFactory', 'boqMainReadonlyProcessor', 'boqMainCommonService', 'boqMainLineTypes',
		function ($http, cloudCommonGridService, boqMainServiceFactory, boqMainReadonlyProcessor, boqMainCommonService, boqMainLineTypes) {
			var service = {};

			// Initialized the 'boqMainService'. Caution: It is risky to do that and to assume that all preparation steps are made now and in the future !!!
			function initBoqMainServiceAsync(rootBoqItem, selectedBoqItem, onBoqItemDeleted) {
				let boqMainServiceContainer = boqMainServiceFactory.createNewBoqMainService({});
				let boqMainService          = boqMainServiceContainer.service;

				boqMainService.onlySetSelectedHeaderFk(rootBoqItem.BoqHeaderFk);
				return boqMainService.reloadStructureForCurrentHeader().then(function() {
					let flatBoqItems = [];

					boqMainService.getLevelOfBoqItem = boqMainServiceContainer.data.getLevelOfBoqItem;

					cloudCommonGridService.flatten([rootBoqItem], flatBoqItems, 'BoqItems');
					flatBoqItems    = _.cloneDeep(flatBoqItems);
					rootBoqItem     = _.find(flatBoqItems, {'Id':rootBoqItem.    Id});
					selectedBoqItem = _.find(flatBoqItems, {'Id':selectedBoqItem.Id});

					boqMainService.setList(flatBoqItems);
					boqMainServiceContainer.data.doClearModifications(null, boqMainServiceContainer.data);
					boqMainServiceContainer.data.itemTree                = [rootBoqItem]; // At least a precondition for a working 'boqMainService.getRootBoqItem'
					boqMainServiceContainer.data.handleOnDeleteSucceeded = onBoqItemDeleted;
					boqMainService.setSelected(selectedBoqItem);
					_.forEach(flatBoqItems, function(boqItem) {
						if (boqItem.nodeInfo) {
							boqItem.nodeInfo.level--; // There is an aditional root item in the BOQ tree in the estimate BOQ container
						}
					});

					return boqMainService;
				});
			}

			function isFieldEditable(boqMainService, boqItem, fieldName) {
				return boqMainCommonService.isItem(boqItem) && boqMainReadonlyProcessor.isFieldEditable(boqItem, fieldName, boqMainService);
			}

			/***
				* @name deleteBoqPositionAsync
				* @description Deletes a BOQ position and saves it immediately
				* @param {BoqItemEntity} rootBoqItem The root BOQ item including its children
				* @param {BoqItemEntity} deletedBoqItem The deleted BOQ item
				* @param {function} onBoqItemDeleted Called when the BOQ item is deleted (no parameters)
				* @returns {boolean} 'true' if a BOQ item can be deleted
				*/
			service.deleteBoqPositionAsync = function(rootBoqItem, deletedBoqItem, onBoqItemDeleted) {
				function onBoqItemDeletedInternal() {
					if (onBoqItemDeleted) {
						onBoqItemDeleted();
					}
				}

				return initBoqMainServiceAsync(rootBoqItem, deletedBoqItem, onBoqItemDeletedInternal).then(function(boqMainService) {
					const canDelete = boqMainService.canDeleteBoqItem(deletedBoqItem) && boqMainCommonService.isItem(deletedBoqItem);
					if (canDelete) {
						boqMainService.deleteSelection();
					}
					return canDelete;
				});
			};

			/***
				* @name createBoqPositionAsync
				* @description Creates a BOQ position and saves it immediately
				* @param {Number} projectId The ID of the project
				* @param {BoqItemEntity} rootBoqItem The root BOQ item including its children
				* @param {BoqItemEntity} selectedBoqItem The selected BOQ
				* @param {function} onBoqItemCreated Called when the BOQ item is created (the only parameter of the function)
				* @returns {boolean} 'true' if a BOQ item can be created
				*/
			service.createBoqPositionAsync = function(projectId, rootBoqItem, selectedBoqItem, onBoqItemCreated) {
				return initBoqMainServiceAsync(rootBoqItem, selectedBoqItem).then(function(boqMainService) {
					function onBoqItemCreatedInternal(createdBoqPosition) {
						onBoqItemCreated(createdBoqPosition);
						boqMainService.boqItemCreateSucceeded.unregister(onBoqItemCreatedInternal);
					}

					function canCreateBoqPosition() {
						selectedBoqItem = boqMainService.getSelected(); // To be reset because of the cloning
						let canCreate = false;
						canCreate|= boqMainCommonService.isItem(selectedBoqItem) ||
										boqMainCommonService.isDivision(selectedBoqItem) && boqMainService.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.position, boqMainService.getLevelOfBoqItem(selectedBoqItem)+1);
						if (canCreate) {
							canCreate = boqMainService.createNewItem(false);
						}
						return canCreate;
					}

					boqMainService.setSelectedProjectId(projectId);
					boqMainService.boqItemCreateSucceeded.register(onBoqItemCreatedInternal);

					const canCreate = canCreateBoqPosition();
					if (canCreate) {
						boqMainService.createNewItem(true);
					}

					return canCreate;
				});
			};

			/***
				* @name getEditableBoqItemFieldsAsync
				* @description Gets the is editable fields of the BOQ items of one BOQ. In general only BOQ positions are editable.
				* @param {BoqItemEntity} rootBoqItem The root BOQ item including its children
				* @returns {object} list of json object like '[{},..]'
				*/
			service.getEditableBoqItemFieldsAsync = function(rootBoqItem) {
				return initBoqMainServiceAsync(rootBoqItem, rootBoqItem).then(function(boqMainService) {
					let ret = [];
					_.forEach(boqMainService.getList(), function(boqItem) {
						ret.push({
							'Id':          boqItem.Id,
							'BasUomFk':    boqMainCommonService.isItem(boqItem),
							'BriefInfo':   isFieldEditable(boqMainService, boqItem, 'BriefInfo'),
							'Quantity':    isFieldEditable(boqMainService, boqItem, 'Quantity'),
							'QuantityAdj': isFieldEditable(boqMainService, boqItem, 'QuantityAdj'),
						});
					});

					return ret;
				});
			};

			/***
				* @name getUomsAsync
				* @description Gets the UOMs which are available in a BOQ
				* @param {BoqItemEntity} rootBoqItem The root BOQ item
				* @returns {Object} A list of UOMs of type 'RIB.Visual.Basics.Unit.ServiceFacade.WebApi.UomDto'
				*/
			service.getUomsAsync = function(rootBoqItem) {
				return $http.get(globals.webApiBaseUrl + 'boq/main/getuoms?boqHeaderId=' + rootBoqItem.BoqHeaderFk).then(function(response) {
					return response.data;
				});
			};

			return service;
		}]);
})();
