/**
 * Created by wuj on 8/27/2015.
 */
/* jshint -W072 */

(function (angular) {
	'use strict';
	/* global globals,_ */
	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName)
		.factory('basicsProcurementConfigHeaderDataService',
			['$injector',
				'platformDataServiceFactory', 'PlatformMessenger', 'platformDataServiceDataProcessorExtension',
				'platformDataServiceActionExtension', 'platformDataServiceSelectionExtension',
				'platformModalService', 'platformDataValidationService',
				'platformModuleStateService', 'basicsLookupdataLookupDescriptorService',
				function ($injector, dataServiceFactory, PlatformMessenger, platformDataServiceDataProcessorExtension,
					platformDataServiceActionExtension, platformDataServiceSelectionExtension, platformModalService, platformDataValidationService,
					platformModuleStateService, lookupDescriptorService) {


					var serviceOptions = {
						flatRootItem: {
							module: angular.module(moduleName),
							httpCRUD: {
								route: globals.webApiBaseUrl + 'basics/procurementconfiguration/'
							},
							entityRole: {
								root: {
									itemName: 'PrcConfigHeader',
									moduleName: 'cloud.desktop.moduleDisplayNameProcurementConfiguration',
									descField: 'DescriptionInfo.Translated',
									handleUpdateDone: handleUpdateDone
								}
							},
							presenter: {
								list: {
									handleCreateSucceeded: function (newData) {
										if (null === newData.PrcTotalType) {
											platformModalService.showMsgBox('basics.procurementconfiguration.totalKindNotExist', 'basics.procurementconfiguration.headerGridTitle', 'info');
										}
										lookupDescriptorService.addData('newPrcTotalType',[newData.PrcTotalType]);

										// service.completeEntityCreateed.fire(null, newData);
										return newData.PrcConfigHeader;
									}
								}
							},
							translation: {
								uid: '890D2C0723B349E7A7A9F95D08F785CF',
								title: 'basics.procurementconfiguration.headerGridTitle',
								columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
								dtoScheme: {
									typeName: 'PrcConfigHeaderDto',
									moduleSubModule: 'Basics.ProcurementConfiguration'
								}
							}
						}
					};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);

					var service = serviceContainer.service;
					service.wrongFormula = '';
					service.completeEntityCreateed = new PlatformMessenger();
					service.completeEntityUpdated = new PlatformMessenger();
					service.updatedBasConfigurationType = new PlatformMessenger();

					var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
					serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {
						return onCreateSucceeded.call(serviceContainer.data, newData, data, creationData).then(function () {
							service.completeEntityCreateed.fire(null, newData);
						});
						// return result;
					};

					service.registerEntityDeleted(onEntityDeleted);

					service.refresh();
					return service;

					function handleUpdateDone(updateData, response, data) {
						data.handleOnUpdateSucceeded(updateData, response, data, true);
						service.completeEntityUpdated.fire(null, updateData);
						if (response.PrcConfigHeader && response.PrcConfigHeader.IsDefault) {
							if (response.PreDefaultMainItem) {
								var defaultItem = _.find(service.getList(), {Id: response.PreDefaultMainItem.Id});
								if (defaultItem) {
									defaultItem.IsDefault = response.PreDefaultMainItem.IsDefault;
									defaultItem.Version = response.PreDefaultMainItem.Version;
									service.gridRefresh();
								}
							}
						}
						if (updateData.MainItemId !== response.MainItemId) {
							service.wrongFormula = response.PrcTotalTypeToSave[0].Formula;
							platformModalService.showDialog({
								templateUrl: globals.appBaseUrl + 'basics.procurementconfiguration/partials/basic-procurement-totaltype-formula-error-dialog.html',
								backdrop: false
							});
						}
					}

					function onEntityDeleted(e, data) {
						if (platformDataValidationService.hasErrors(service)) {
							var modState = platformModuleStateService.state(service.getModule());
							modState.validation.issues = _.filter(modState.validation.issues, function (err) {
								if (angular.isArray(data)) {
									return !_.any(data, function (header) {
										return err.entity.PrcConfigHeaderFk === header.Id;
									});
								} else if (data) {
									return err.entity.PrcConfigHeaderFk !== data.Id;
								}
								return true;
							});
						}
					}
				}]);
})(angular);