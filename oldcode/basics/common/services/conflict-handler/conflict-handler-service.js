/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * Factory service for managing cell change queue and conflict resolution.
	 */
	angular.module('basics.common').factory('basicsCommonConflictHandlerService', [
		'_',
		'$injector',
		'$q',
		'platformGridAPI',
		'platformDataServiceModificationTrackingExtension',
		'platformDialogService',
		'basicsCommonConflictGridServiceFactory',
		'basicsCommonConflictGridInfoFactory',
		'basicsCommonConflictChangeApplyServiceFactory',
		'conflictGridContextService',
		function (_, $injector, $q, platformGridAPI, platformDataServiceModificationTrackingExtension, platformDialogService, basicsCommonConflictGridServiceFactory, basicsCommonConflictGridInfoFactory, basicsCommonConflictChangeApplyServiceFactory, conflictGridContextService) {

			/**
			 * Class for processes the conflict resolution.
			 * @param customConcurrencyConfig
			 * @param updateResponse
			 * @return {*[]|null}
			 * @constructor
			 */
			function ConflictResolveProcessor(customConcurrencyConfig, updateResponse) {
				const self = this;
				this.serviceConfigList = customConcurrencyConfig.conflictConfigs;
				this.conflictData = updateResponse.ConflictInfo;
				this.gridId2Info = {};
				this.changeApplyService = basicsCommonConflictChangeApplyServiceFactory.createChangeApplyService(updateResponse.ConflictInfo, updateResponse.ModificationId, customConcurrencyConfig.mainService);

				this.getGridInfo = function (gridId) {
					return this.gridId2Info[gridId];
				};

				this.updateRelateColumns = function(entity, selectedItem){
					const currentGridId = conflictGridContextService.getCurrentConflictGridId();
					if(currentGridId && self.getGridInfo(currentGridId)){
						self.getGridInfo(currentGridId).updateRelateColumns(entity, selectedItem);
					}
				}

				/**
				 * Updates the conflict data and applies the changes to the main service.
				 * use to extend the modification data
				 */
				this.updateNew = function () {
					const modificationId = updateResponse.ModificationId;
					if(this.conflictData && modificationId) {
						const updateComplete = platformDataServiceModificationTrackingExtension.getModificationFromHistory(modificationId);
						if(updateComplete){
							for (const key in self.gridId2Info){
								self.gridId2Info[key].addOrExtendEntityToModified(updateComplete);
							}
							const mainService = customConcurrencyConfig.mainService;
							if(mainService && mainService.updateConcurrencyData) {
								updateComplete.IsConflictResolve = true;
								return mainService.updateConcurrencyData(updateComplete);
							}
						}
					}
					return $q.when(true);
				};

				/**
				 * Updates the conflict data and applies the changes to the main service.
				 * use to collect the property change
				 */
				this.update = function () {
					for (const key in self.gridId2Info){
						self.gridId2Info[key].apply();
					}
					return self.changeApplyService.saveChanges();
				};

				/**
				 * Generates a grid configuration for conflict resolution based on the provided conflict data and service configuration.
				 *
				 * @param {Object} conflictData - The conflict data object containing information about the conflicts.
				 * @param {Object} serviceConfig - The service configuration object for the conflict resolution.
				 * @param {Object} applyChangeService - The service configuration object for the conflict resolution.
				 * @returns {Object} The generated grid configuration.
				 */
				this.generateGridConfig = function(conflictData, serviceConfig, applyChangeService) {
					const childConflictGridService = basicsCommonConflictGridServiceFactory.createConflictGridService(conflictData, serviceConfig);
					const gridConfig = childConflictGridService.generateGridConfig();
					this.gridId2Info[gridConfig.id] = basicsCommonConflictGridInfoFactory.createConflictGridInfoItem(gridConfig, conflictData, serviceConfig, applyChangeService);
					return gridConfig;
				};

				/**
				 * Creates conflict grid configurations based on the update response.
				 * @returns {Array} An array of grid configurations for conflict resolution.
				 */
				this.createConflictGridConfigs = function () {
					const gridConfigList = [];
					for (const key in this.conflictData) {
						const serviceConfig = this.serviceConfigList.find(e => e.typeName === key);
						const entityChanges = this.conflictData[key]?.EntityChanges;
						if (serviceConfig && entityChanges?.length > 0) {
							this.changeApplyService.createApplyEntity(entityChanges);
							if (!this.conflictData[key].IsAutoMerge) {
								const conflictGridConfig = this.generateGridConfig(this.conflictData[key], serviceConfig, this.changeApplyService);
								if (conflictGridConfig) {
									gridConfigList.push(conflictGridConfig);
								}
							}
						}
					}
					return gridConfigList;
				};
			}

			let service = {};

			/**
			 * Processes cell change conflicts and shows a dialog for conflict resolution.
			 * @param {Object} customConcurrencyConfig - concurrencyConfigs.
			 * @param {Object} updateResponse - response data object.
			 * @param {Function} reloadCallback - callback function to reload the data.
			 * @returns {Promise} The promise object for the dialog result.
			 */
			service.showConflictResolveDialog = function (customConcurrencyConfig, updateResponse, reloadCallback) {
				//create conflict grid configs
				const conflictResolveProcessor = new ConflictResolveProcessor(customConcurrencyConfig, updateResponse);
				conflictGridContextService.setConflictResolve(conflictResolveProcessor);
				const gridConfigs = conflictResolveProcessor.createConflictGridConfigs();
				if (!gridConfigs || gridConfigs.length === 0) {
					return $q.resolve();
				}

				//show merge dialog
				const dlgConfig = {
					id: '2943e3afd0184ce5aa36497cb3d31987',
					headerText$tr$: 'basics.common.conflict.resolveConflicts',
					templateUrl: globals.appBaseUrl + 'basics.common/templates/conflict-handler/conflict-resolve-dialog.html',
					resizeable: true,
					width: '600px',
					height: '400px',
					showOkButton: true,
					showCloseButton: false,
					controller: 'basicsCommonResolveConflictController',
					resolve: {
						$options: function () {
							return {
								gridConfigs: gridConfigs
							};
						},
					},
				};

				return platformDialogService.showDialog(dlgConfig).then(function (result) {
					if (result && result.isOk) {
						const updateResult = customConcurrencyConfig.mergeInClientSide ? conflictResolveProcessor.updateNew() : conflictResolveProcessor.update();
						return updateResult.then(function(){
							if(reloadCallback && !customConcurrencyConfig.mergeInClientSide){
								reloadCallback();
							}
						});
					}else if(reloadCallback){
						reloadCallback();
					}
				});
			};

			return service;
		},
	]);
})(angular);
