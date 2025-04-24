/*
 * Copyright(c) RIB Software GmbH
 */

(function () {
	/* global globals */
	'use strict';
	let module = angular.module('controlling.configuration');

	module.factory('controllingConfigVersionCompareDataService', ['_','$injector','$http', '$translate', 'platformDataServiceFactory','contrConfigVersionCompareActionProcessor',
		'platformGridAPI','platformModalService', 'platformRuntimeDataService',
		function (_,$injector, $http, $translate, platformDataServiceFactory, contrConfigVersionCompareActionProcessor,
			platformGridAPI, platformModalService, runtimeDataService) {
			let serviceOptions = {
				flatRootItem: {
					module: module,
					serviceName: 'controllingConfigVersionCompareDataService',
					entityNameTranslationID: 'controlling.configuration.versionCompareTitle',
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/configuration/versioncompare/',
						endRead: 'getlist',
						initReadData: function (readData) {
							readData.filter = '?mdcContrConfigHeaderFk=1';
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'controlling/configuration/versioncompare/', endCreate: 'create'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'controlling/configuration/versioncompare/', endUpdate: 'update'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'controlling/configuration/versioncompare/', endUpdate: 'delete'
					},
					presenter: {
						list: {
							incorporateDataRead:function (readData, data) {
								if(readData && readData.dtos){
									_.forEach(readData.dtos, function (item){
										item.IsBaseConfigData = (item.Id < 1000000);
										runtimeDataService.readonly(item, [{field: 'DescriptionInfo', readonly: item.IsBaseConfigData}]);
									});
								}
								return data.handleReadSucceeded(readData && readData.dtos ? readData.dtos : [], data);
							}
						}
					},
					entityRole: {
						root: {
							itemName: 'MdcContrVersionCompareToSave',
							moduleName: 'controlling.configuration.versionCompareTitle',
							mainItemName: 'controllingConfigurationVersionCompareConfig',
							descField: 'Description.Translated',
							handleUpdateDone: function (updateData, response, data) {
								serviceContainer.data.handleOnUpdateSucceeded(updateData, response, data, true);
							}
						}
					},
					entitySelection: {supportsMultiSelection: true},
					actions: {
						delete: true,
						create: 'flat',
						canDeleteCallBackFunc: function () {
							if(service && service.getSelectedEntities){
								let selectedItems = service.getSelectedEntities();

								return selectedItems && selectedItems.length > 0 && _.filter(selectedItems, {IsBaseConfigData: true}).length <= 0;
							}
							return false;
						}
					},
					dataProcessor: [contrConfigVersionCompareActionProcessor],
					translation: {
						uid: 'controllingConfigVersionCompareDataService',
						title: 'controlling.configuration.versionCompareTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'MdcContrCompareconfigDto',
							moduleSubModule: 'Controlling.Configuration'
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			serviceContainer.data.doUpdate = null;

			serviceContainer.data.handleOnDeleteSucceeded = function handleOnDeleteSucceeded(deleteParams , data, response) {
				if(response && response.length > 0){
					let updated = response[0];
					if(updated.IsDefault){
						let updateTarget = _.find(data.getList(), {Id: updated.Id});
						if(updateTarget){
							updateTarget.IsDefault = updated.IsDefault;
							updateTarget.Version = updated.Version;
							platformGridAPI.rows.refreshRow({gridId: gridGuid, item: updateTarget});
						}
					}
				}
			};

			let service =  serviceContainer.service;

			service.clearSelectedItem = function(){
				serviceContainer.data.selectedItem = null;
			};

			service.handleOnUpdate = function (updateData, response) {
				serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
			};

			service.refreshSelected = function (dto){
				if(!gridGuid){return;}
				let selected = _.find(service.getList(), {Id: dto.Id});
				if(!selected){return;}
				let action = selected.Action;
				selected = _.merge(selected, dto);
				selected.Action = action;
				platformGridAPI.rows.refreshRow({gridId: gridGuid, item: selected});
			};

			let gridGuid = '';
			service.setGridGuid = function (guid){
				gridGuid = guid;
			};

			let dialogIsOpening = false;

			service.closeDialog = function (){
				dialogIsOpening = false;
			};

			service.openDialog = function (entity){
				if(dialogIsOpening){
					return;
				}

				service.setSelected(entity);

				if(entity.Version === 0){
					platformModalService.showMsgBox($translate.instant('controlling.configuration.noDataFound'), 'Warning', 'warning');
					return;
				}

				dialogIsOpening = true;

				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'controlling.configuration/templates/compare-detail-dialog.html',
					backdrop: false,
					resizeable: true,
					width: '1000px',
					uuid: '154C7DBC6119471591F663915F3D0D61',
					entity: entity
				}).then(function () {
					dialogIsOpening = false;
				},function() {
					dialogIsOpening = false;
				});
			};

			return service;
		}]);
})();
