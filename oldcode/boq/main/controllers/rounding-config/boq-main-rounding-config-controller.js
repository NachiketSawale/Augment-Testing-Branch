(function () {
	/* global globals, _ */
	'use strict';

	const angularModule = angular.module('boq.main');

	angularModule.factory('boqMainRoundingConfigDialogService', ['$http', '$translate', '$q', '$injector', 'platformDialogService', 'platformModalFormConfigService', 'boqMainRoundingConfigUIConfigurationService', 'boqMainRoundingConfigDataService',
		function($http, $translate, $q, $injector, platformDialogService, platformModalFormConfigService, boqMainRoundingConfigUIConfigurationService, boqMainRoundingConfigDataService) {
			var service = {};
			var dialogMode = '';
			var currentBoqStructure = {};

			service.startByBoqRoundingConfig = function(boqRoundingConfig, boqRoundingConfigType, isCustomize, dlgMode) {
				var dialogConfig;
				dialogMode = dlgMode;
				if(_.isObject(boqRoundingConfig)) {
					boqRoundingConfig.BoqRoundingConfigType = boqRoundingConfigType;
				}

				let boqRoundingConfigId = _.isObject(boqRoundingConfig) &&  _.isNumber(boqRoundingConfig.Id) ? boqRoundingConfig.Id : -1;
				$http.get(globals.webApiBaseUrl + 'boq/main/type/isboqroundingconfiginuse?boqRoundingConfigId=' +boqRoundingConfigId).then(function(response) {
					let boqMainDocPropertiesService = $injector.get('boqMainDocPropertiesService');
					let isRoundingConfigInUse = response.data;
					let lineItemContextFk = null;

					if(dialogMode === 'boqProperties') {
						lineItemContextFk = boqMainDocPropertiesService.getCurrentLineItemContext();
					}

					let currentItem = boqMainRoundingConfigDataService.setData(boqRoundingConfig, isCustomize, dlgMode, isRoundingConfigInUse, lineItemContextFk);
					var formConfig = boqMainRoundingConfigUIConfigurationService.getFormConfig(isCustomize);
					dialogConfig = {
						title: $translate.instant('boq.main.roundingConfig'),
						dataItem: currentItem,
						formConfiguration: formConfig,
						resizeable: true,
						handleOK: function handleOK() {
							let updateData = {};
							boqMainRoundingConfigDataService.provideUpdateData(updateData);

							if(dialogMode === 'boqRoundingConfigType') {
								$http.post(globals.webApiBaseUrl + 'boq/main/type/saveboqroundingconfig', updateData.BoqRoundingConfig);
							}
							else {
								// Here the rounding config dialog is usually a sub dialog of the boq document properties dialog
								// and as such doesn't save itself but delegates saving the changes to the boq document properties dialog
								if(_.isObject(currentBoqStructure)) {
									// currentBoqStructure.BoqRoundingconfigtypeEntity = _.isObject(updateData.BoqRoundingConfigType) && (isCustomize || !updateData.IsEditRoundingConfigType) ? updateData.BoqRoundingConfigType : null;
									currentBoqStructure.BoqRoundingConfigTypeFk = _.isObject(updateData.BoqRoundingConfigType) && (isCustomize || !updateData.IsEditRoundingConfigType) ? updateData.BoqRoundingConfigType.Id : null;
									currentBoqStructure.BoqRoundingConfig = updateData.BoqRoundingConfig;
									currentBoqStructure.BoqRoundingConfigFk = _.isObject(updateData.BoqRoundingConfig) ? updateData.BoqRoundingConfig.Id : 0;

									let specificDocumentProperties = boqMainDocPropertiesService.getEditVal();
									if(specificDocumentProperties) {
										boqMainDocPropertiesService.setModifiedDocProperties(boqMainDocPropertiesService.getSelectedDocProp());
									}
									if(updateData.IsEditRoundingConfigType &&
										_.isObject(updateData.BoqRoundingConfigType) &&
										_.isObject(updateData.BoqRoundingConfig) &&
										specificDocumentProperties) {
										// Trigger cloning of current system rounding config
										updateData.BoqRoundingConfig.CloneThisEntity = true;
									}
								}
							}

							// Reset state
							dialogMode = '';
							currentBoqStructure = {};
							if(dialogMode !== 'boqRoundingConfigType') {
								boqMainRoundingConfigDataService.setData({});
							}
						},
						handleCancel: function handleCancel() {
							// Reset state
							dialogMode = '';
							currentBoqStructure = {};
							boqMainRoundingConfigDataService.setData({});
						}
					};

					platformModalFormConfigService.showDialog(dialogConfig);
				});
			};

			service.start = function(boqMainService) {
				$http.get(globals.webApiBaseUrl + 'boq/main/header/getboqheader?boqHeaderId=' + boqMainService.getSelectedBoqHeader()).then(function(response) {
					if (response.data.BoqTypeFk && !boqMainService.isCrbBoq()) {
						platformDialogService.showInfoBox('boq.main.roundingConfigDisabled');
					}
					else {
						service.startByBoqStructure(boqMainService.getBoqStructure(), '', false);
					}
				});
			};

			service.startByBoqStructure = function(boqStructure, isCustomize, dlgMode) {
				currentBoqStructure = boqStructure;
				if(_.isObject(currentBoqStructure)) {
					let boqRoundingConfig = currentBoqStructure.BoqRoundingConfig;
					let boqRoundingConfigType = currentBoqStructure.BoqRoundingconfigtypeEntity;
					if(!_.isObject(boqRoundingConfigType) && currentBoqStructure.BoqRoundingConfigTypeFk) {
						// Create dummy BoqRoundingConfigType
						boqRoundingConfigType = {Id: currentBoqStructure.BoqRoundingConfigTypeFk};
					}
					service.startByBoqRoundingConfig(boqRoundingConfig, boqRoundingConfigType,isCustomize, dlgMode);
				}
			};

			service.startByRoundingConfigFks = function(boqRoundingConfigTypeFk, boqRoundingConfigFk, lineItemContextFk, dlgMode) {
				let boqRoundingConfigType = null;
				let boqRoundingConfig = null;
				let deferedBoqRoundingConfig = $q.defer();
				$http.post(globals.webApiBaseUrl + 'basics/customize/boqroundingconfigurationtype/list').then(function (response) {
					boqRoundingConfigType = _.find(response.data, function(configType) {
						return configType.Id === boqRoundingConfigTypeFk && configType.LineItemContextFk === lineItemContextFk;
					});

					if(_.isObject(boqRoundingConfigType))
					{
						$http.get(globals.webApiBaseUrl + 'boq/main/type/getboqroundingconfigbyid?id=' + boqRoundingConfigType.BoqRoundingConfigFk).then(function (response) {
							boqRoundingConfig = response.data;
							deferedBoqRoundingConfig.resolve(boqRoundingConfig);
						});
					}
				});

				return deferedBoqRoundingConfig.promise.then(function() {
					service.startByBoqRoundingConfig(boqRoundingConfig, boqRoundingConfigType,true, dlgMode);
				});
			};

			service.isDisabled = function(boqMainService) {
				const boqStructure = boqMainService.getBoqStructure();
				return boqMainService.getReadOnly() || !(boqStructure && Object.prototype.hasOwnProperty.call(boqStructure, 'Id'));
			};

			return service;
		}
	]);
})();
