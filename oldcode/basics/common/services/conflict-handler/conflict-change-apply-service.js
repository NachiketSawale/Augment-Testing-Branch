/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * factory for conflict change apply service
	 */
	angular.module('basics.common').factory('basicsCommonConflictChangeApplyServiceFactory', [
		'$q',
		'_',
		'platformDataServiceModificationTrackingExtension',
		function ($q, _, platformDataServiceModificationTrackingExtension) {

			function ChangeApplyService(conflictInfo, modificationId, mainService) {
				this.changesApplied = {};
				this.conflictData = conflictInfo;
				this.modificationId = modificationId;
				this.mainService = mainService;

				/**
				 * Adds the applied changes for a specific property of an entity to the changesApplied object.
				 *
				 * @param {string} typeName - typeName.
				 * @param {string} propName - The name of the property that has been changed.
				 * @param {Object} entity - The entity object containing the changed property.
				 */
				this.addChangesApplied = function(typeName, propName, entity) {
					if (!this.changesApplied[typeName]) {
						this.changesApplied[typeName] = {};
					}
					if(!this.changesApplied[typeName][entity]) {
						this.changesApplied[typeName][entity] = {};
					}
					this.changesApplied[typeName][entity][propName] = entity[propName];
				};

				this.saveChanges = function(){
					if(this.conflictData && this.modificationId) {
						const updateComplete = platformDataServiceModificationTrackingExtension.getModificationFromHistory(this.modificationId);
						if(updateComplete){
							updateComplete.ApplyChangeDatas = this.getConflictDataKeysAndApplyEntities(this.conflictData);
							if(this.mainService && this.mainService.updateConcurrencyData) {
								updateComplete.IsConflictResolve = true;
								return this.mainService.updateConcurrencyData(updateComplete);
							}
						}
					}
					return $q.when(true);
				};

				/**
				 * Extracts keys and their corresponding ApplyEntity changes from conflict data.
				 *
				 * @param {Object} conflictData - The conflict data object containing entity changes.
				 * @returns {Object} An object where each key corresponds to an array of apply entity changes.
				 */
				this.getConflictDataKeysAndApplyEntities = function(conflictData) {
					const result = [];
					if (!conflictData) return result;

					for (const key in conflictData) {
						const applyEntityChanges = [];
						const entityChanges = conflictData[key].EntityChanges;

						if (angular.isArray(entityChanges) && entityChanges.length > 0) {
							entityChanges.forEach(entityChange => {
								const applyEntity = entityChange.ApplyEntity;
								const applyPropChanges = this.changesApplied[key] && this.changesApplied[key][applyEntity]
									? this.createApplyPropChangeData(this.changesApplied[key][applyEntity])
									: [];

								applyEntityChanges.push({
									Id: entityChange.Id,
									ApplyPropChanges: applyPropChanges,
									Version: applyEntity.Version,
								});
							});
						}

						result.push({
							TypeName: key,
							ApplyEntityChanges: applyEntityChanges,
						});
					}

					return result;
				};

				this.createApplyEntity = function(entityChanges){
					if(angular.isArray(entityChanges)){
						entityChanges.forEach((entityChange) => {
							entityChange.ApplyEntity = angular.copy(entityChange.MyLocalEntity);
						});
					}
				};

				this.createApplyPropChangeData = function(applyChangeDic){
					return _.keys(applyChangeDic).map(key => ({
						'PropertyName': key,
						'ApplyValue': applyChangeDic[key]
					}));
				};
			}

			return {
				createChangeApplyService: function(conflictInfo, modificationId, mainService){
					return new ChangeApplyService(conflictInfo, modificationId, mainService);
				},
			};
		},
	]);
})(angular);
