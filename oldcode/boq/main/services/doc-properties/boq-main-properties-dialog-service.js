/**
 * Created by bh on 16.02.2016.
 */

(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';
	var boqMainModule = angular.module(moduleName);

	boqMainModule.factory('boqMainPropertiesDialogService',
		['$http', 'platformModalService', 'boqMainDocPropertiesController', 'boqDocPropertiesControllerConfig', '$q', 'boqMainCatalogAssignCostgroupLookupService',
			function ($http, platformModalService, boqMainDocPropertiesController, boqDocPropertiesControllerConfig, $q, boqMainCatalogAssignCostgroupLookupService) {

				var service = {}, headerTextKey = 'boq.main.navDocumentProperties', maxWidth = '1200px', maxHeight = 'max', dialogMode = 'default';// default | boqcatalog

				function showPropertyDialog() {
					platformModalService.showDialog({
						headerTextKey: headerTextKey,
						templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-properties-modal.html',
						controller: ['$scope', '$modalInstance', '$injector', boqMainDocPropertiesController],
						windowClass: 'docPropertiesModalWindow',
						width: 'max',
						maxWidth: maxWidth,
						maxHeight: maxHeight
					});
				}

				/**
				 * @ngdoc function
				 * @name showDialog
				 * @function
				 * @methodOf boqMainPropertiesDialogService
				 * @description Shows a dialog with various boq properties.
				 * Can be used to show properties of a given boqMainService state or system properties given by boq type and structure entries.
				 * @parameter boqMainService: based upon its currently loaded structure the dialog is initialized and opened
				 * @parameter boqTypeFk: boq type whose structure informations are to be displayed
				 * @parameter boqStructureFk: structure holing the various properties to be displayed
				 * @parameter selectedBoqType: sometimes (not always) we have the boq type object given, so we hand it over
				 */
				service.showDialog = function showDialog(boqMainService, boqTypeFk, boqStructureFk, selectedBoqType) {

					var lineItemContextFromService = _.isObject(boqMainService) && boqMainService.getRootBoqItem() ? boqMainService.getRootBoqItem().LineItemContextWhenLoading : null;

					headerTextKey = 'boq.main.navDocumentProperties';
					maxWidth = '1200px';
					maxHeight = 'max';

					boqDocPropertiesControllerConfig.currentBoqMainService = boqMainService;
					boqDocPropertiesControllerConfig.selectedBoqType = selectedBoqType;
					boqDocPropertiesControllerConfig.mdcLineItemContextFk = _.isObject(selectedBoqType) ? selectedBoqType.LineitemcontextFk : lineItemContextFromService;
					boqDocPropertiesControllerConfig.projectId = _.isObject(boqMainService) ? boqMainService.getSelectedProjectId() || 0 : 0;
					// Set to be able to properly filter out the cost group catalogs belonging to the given lineItemContextId
					boqMainCatalogAssignCostgroupLookupService.setLineItemContextId(boqDocPropertiesControllerConfig.mdcLineItemContextFk);
					boqMainCatalogAssignCostgroupLookupService.setSelectedProjectId(boqDocPropertiesControllerConfig.projectId);

					if (boqDocPropertiesControllerConfig.currentBoqMainService !== null) {
						// Get the boqStructureFk from the currently loaded boq header in the currentBoqMainService
						var currentlyLoadedBoqStructure = boqDocPropertiesControllerConfig.currentBoqMainService.getStructure();
						if (angular.isDefined(currentlyLoadedBoqStructure) && (currentlyLoadedBoqStructure !== null)) {
							boqStructureFk = currentlyLoadedBoqStructure.Id;
						} else {
							// This is an error -> dont't proceed
							console.error('boqMainPropertiesDialogService -> showDialog: openind dialog faild due to missing boq structure information!');
						}
					}

					boqDocPropertiesControllerConfig.boqTypeFk = boqTypeFk;
					boqDocPropertiesControllerConfig.boqStructureFk = boqStructureFk;

					if (boqDocPropertiesControllerConfig.boqStructureFk !== null) {
						service.isBoqStructureInUse(boqStructureFk, boqMainService).then(function (result) {
							// Result holds a boolean indicating if the given boq structure information is already in use by a boq, i.e. that a boq is already built upon
							// the structure informations.
							boqDocPropertiesControllerConfig.structureIsAlreadyInUse = result;
							showPropertyDialog();
						},
						function () {
							console.error('boqMainPropertiesDialogService -> showDialog: call determining if structure is already in use failed!');
						});
					}
				};

				/**
				 * @ngdoc function
				 * @name isBoqStructureInUse
				 * @function
				 * @methodOf boqMainPropertiesDialogService
				 * @description Checks via a service call if the boq structure given by the boqStructureFk is already used to build a boq
				 * @parameter {Number} boqStructureFk: id of the boq structure whose usage is investigated
				 * @returns {Object}: promise holding the returning the result when resolved
				 */
				service.isBoqStructureInUse = function (boqStructureFk, currentBoqMainService) {
					var boqRootItem = null;
					var boqHeaderIds = null;
					var resolvedPromiseWithFalse = $q.when(false);

					if (currentBoqMainService === null) {
						boqDocPropertiesControllerConfig.isProjectFilter = false;

						// The dialog is obviously opened in customize module, because there is no boqMainService given

						// Special case for boqStructureFk = 0
						// -> this is the scenario of creating a new BoqType in customizing and its BoqStructureFk is initially set to 0
						// Here we intend to create a new boq structure so we don't check for this stucture already being used.
						// Hint: It can be that there is already a boq structure in use with Id = 0 but this is not attached to a BoqType so its not a system structure.
						if (boqStructureFk === 0) {
							return resolvedPromiseWithFalse;
						}

						return $http.get(globals.webApiBaseUrl + 'boq/main/areboqsbuiltwithgivenstructure?structureId=' + boqStructureFk).then(function (response) {
							if (angular.isDefined(response) && (response !== null) && angular.isDefined(response.data) && _.isBoolean(response.data)) {
								return response.data;
							} else {
								return false;
							}
						});
					} else {
						// Here we are opened on top of a base or version boq
						boqRootItem = currentBoqMainService.getRootBoqItem();
						boqHeaderIds = [];
						if (boqRootItem !== null) {

							boqDocPropertiesControllerConfig.isProjectFilter = boqRootItem.IsWicItem;

							boqHeaderIds.push(boqRootItem.BoqHeaderFk);

							// Look for corresponding base boq header
							if (boqRootItem.BoqItemPrjBoqFk !== null) {
								boqHeaderIds.push(boqRootItem.BoqItemPrjBoqFk);
							}

							if (boqHeaderIds.length > 0) {
								return $http.post(globals.webApiBaseUrl + 'boq/main/determineifboqsarebuiltwithgivenstructure?structureId=' + boqStructureFk, boqHeaderIds).then(function (response) {
									var result = false;
									boqDocPropertiesControllerConfig.baseBoqRootItemHasChildren = false;
									if (angular.isDefined(response) && (response !== null) && angular.isDefined(response.data) && _.isArray(response.data)) {
										if (response.data.length > 0) {
											result = true;
											boqDocPropertiesControllerConfig.baseBoqRootItemHasChildren = (boqRootItem.BoqItemPrjBoqFk !== null) ? _.findIndex(response.data, function (entry) {
												return entry === boqRootItem.BoqItemPrjBoqFk;
											}) !== -1 : false;
										}

										return result;
									} else {
										return false;
									}
								});
							} else {
								boqDocPropertiesControllerConfig.baseBoqRootItemHasChildren = false;
								return $q.when(false);
							}
						}
					}

					return resolvedPromiseWithFalse;
				};

				service.getDialogMode = function getDialogMode() {
					return dialogMode;
				};

				service.setDialogMode = function setDialogMode(modeName) {
					dialogMode = modeName;
				};

				/**
				 * @ngdoc function
				 * @name showCatalogDialog
				 * @function
				 * @methodOf boqMainPropertiesDialogService
				 * @param catalogAssignTypeId
				 * @param catalogAssignFk
				 * @description show catalog dialog
				 */
				service.showCatalogDialog = function showCatalogDialog(catalogAssignTypeId, catalogAssignFk, mdcLineItemContextFk) {
					boqDocPropertiesControllerConfig.catConfTypeId = catalogAssignTypeId;
					boqDocPropertiesControllerConfig.boqCatalogAssignFk = catalogAssignFk;
					boqDocPropertiesControllerConfig.isProjectFilter = false;
					boqDocPropertiesControllerConfig.mdcLineItemContextFk = mdcLineItemContextFk;
					// Set to be able to properly filter out the cost group catalogs belonging to the given lineItemContextId
					boqMainCatalogAssignCostgroupLookupService.setLineItemContextId(boqDocPropertiesControllerConfig.mdcLineItemContextFk);

					headerTextKey = 'boq.main.catalogHeader';
					maxWidth = '950px';
					maxHeight = '420px';

					showPropertyDialog();
				};

				return service;

			}]);
})();
