/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainUpdateMarkerWizardService
	 * @function
	 *
	 * @description Provides a wizard that updates the model of model markers in several entities.
	 */
	angular.module('model.main').factory('modelMainUpdateMarkerWizardService', ['_', '$http', '$injector', '$q',
		'platformModalFormConfigService', 'basicsLookupdataConfigGenerator', 'projectMainService',
		'platformTranslateService', 'projectMainPinnableEntityService', 'platformDialogService',
		'platformDataServiceModificationTrackingExtension', 'platformGridDialogService',
		function (_, $http, $injector, $q, platformModalFormConfigService, basicsLookupdataConfigGenerator,
		          projectMainService, platformTranslateService, projectMainPinnableEntityService, platformDialogService,
		          platformDataServiceModificationTrackingExtension, platformGridDialogService) {
			var service = {};

			function cannotRunWizard() {
				return platformDialogService.showMsgBox('model.main.updateMarkerWz.unableToRunDesc', 'model.main.updateMarkerWz.unableToRun', 'info').then(function () {
					return {
						success: false
					};
				});
			}

			var getEntityId = function getEntityId(entity) {
				var result = {};
				_.reverse(this.IdProperties).forEach(function (idProp, index) {
					if (index === 0) {
						result.Id = entity[idProp];
					} else {
						result['Key' + index] = entity[idProp];
					}
				});
				return result;
			};

			service.runWizard = function () {
				return $http.get(globals.webApiBaseUrl + 'model/main/marker/markerusers').then(function (response) {
					if (_.isArray(response.data)) {
						var markerUsers = response.data;

						markerUsers.forEach(function (mu) {
							mu.dataService = $injector.get(mu.DataServiceName);
							mu.selectedEntities = mu.dataService.getSelectedEntities();
							mu.getEntityId = getEntityId;
						});

						markerUsers = _.filter(markerUsers, function (mu) {
							return mu.selectedEntities.length > 0;
						});

						if (markerUsers.length > 0) {
							var confirmPromise = (function generateConfirmPromise() {
								if (_.some(markerUsers, function (mu) {
									return platformDataServiceModificationTrackingExtension.hasModifications(mu.dataService);
								})) {
									return platformDialogService.showYesNoDialog('model.main.updateMarkerWz.changesWarningDesc', 'model.main.updateMarkerWz.changesWarning', 'no').then(function (result) {
										return !!result.yes;
									});
								} else {
									return $q.when(true);
								}
							})();

							return confirmPromise.then(function showConfigDialog(doContinue) {
								if (doContinue) {
									var pinnedProjectId = projectMainPinnableEntityService.getPinned();

									var dialogCfg = {
										title: 'model.main.updateMarkerWz.dlgTitle',
										dataItem: {
											NewModelId: null,
											Entities: _.map(markerUsers, function () {
												return true;
											})
										},
										formConfiguration: {
											fid: 'model.main.wizard.updateMarkers',
											showGrouping: true,
											groups: [
												{
													gid: 'general',
													header$tr$: 'model.main.updateMarkerWz.generalGroup',
													isOpen: true,
													sortOrder: 100
												}, {
													gid: 'entities',
													header$tr$: 'model.main.updateMarkerWz.entitiesGroup',
													isOpen: true,
													sortOrder: 200
												}
											],
											rows: _.concat([
												basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
														dataServiceName: 'modelProjectVersionedModelLookupDataService',
														filter: function () {
															return _.isNumber(pinnedProjectId) ? pinnedProjectId : 0;
														}
													},
													{
														gid: 'general',
														rid: 'model',
														label$tr$: 'model.main.updateMarkerWz.newModel',
														model: 'NewModelId',
														sortOrder: 100
													})
											], _.map(markerUsers, function (mu, index) {
												return {
													gid: 'entities',
													rid: 'entity_' + mu.DataServiceName,
													type: 'boolean',
													label$tr$: 'model.main.updateMarkerWz.entityWithCount',
													label$tr$param$: {
														entity: mu.Description,
														count: mu.selectedEntities.length
													},
													model: 'Entities[' + index + ']',
													sortOrder: 10 + index
												};
											}))
										}
									};

									platformTranslateService.translateFormConfig(dialogCfg.formConfiguration);

									return platformModalFormConfigService.showDialog(dialogCfg).then(function performChanges(result) {
										if (result.ok) {
											var request = {
												NewModelId: result.data.NewModelId,
												Items: _.compact(_.map(markerUsers, function (mu, index) {
													if (result.data.Entities[index]) {
														return {
															MarkerUserId: mu.Id,
															Ids: _.map(mu.selectedEntities, function (e) {
																return mu.getEntityId(e);
															})
														};
													}
												}))
											};

											return $http.post(globals.webApiBaseUrl + 'model/main/marker/updatemarkerstomodel', request).then(function processResults(response) {
												var countByEntity = {};
												var totalCount = 0;
												var serviceRefreshPromises = [];

												if (_.isArray(response.data)) {
													response.data.forEach(function (muInfo) {
														countByEntity[muInfo.Id] = muInfo.ChangedEntityCount;
														totalCount += muInfo.ChangedEntityCount;

														if (muInfo.ChangedEntityCount > 0) {
															var mu = _.find(markerUsers, {Id: muInfo.Id});
															if (mu && mu.dataService) {
																serviceRefreshPromises.push(mu.dataService.load());
															}
														}
													});
												}

												return $q.all(serviceRefreshPromises).then(function () {
													return {
														countByEntity: countByEntity,
														totalCount: totalCount
													};
												});
											}).then(function showSummary(results) {
												var cols = [{
													id: 'desc',
													name$tr$: 'model.main.updateMarkerWz.entity',
													formatter: 'description',
													field: 'Description',
													width: 300
												}, {
													id: 'count',
													name$tr$: 'model.main.updateMarkerWz.count',
													formatter: 'integer',
													field: 'Count',
													width: 200
												}];

												return platformGridDialogService.showDialog({
													columns: cols,
													items: _.map(markerUsers, function (mu) {
														return {
															Id: mu.Id,
															Description: mu.Description,
															Count: (function () {
																var result = results.countByEntity[mu.Id];
																return _.isNumber(result) ? result : 0;
															})()
														};
													}),
													idProperty: 'Id',
													headerText$tr$: 'model.main.updateMarkerWz.summaryTitle',
													topDescription$tr$: 'model.main.updateMarkerWz.changeSummary',
													topDescription$tr$param$: {
														count: results.totalCount
													},
													isReadOnly: true
												}).then(function () {
													return {
														success: true
													};
												});
											});
										}
									});
								}
							});
						}
					}

					return cannotRunWizard();
				});
			};

			return service;
		}]);
})(angular);
