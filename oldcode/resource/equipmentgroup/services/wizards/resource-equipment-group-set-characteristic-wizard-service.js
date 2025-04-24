/**
 * Created by cakiral on 09.27.2020
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name resourceEquipmentGroupSetCharacteristicWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards of resource.equipment module
	 */

	let moduleName = 'resource.equipment';
	angular.module(moduleName).factory('resourceEquipmentGroupSetCharacteristicWizardService', ['_', '$http', '$translate', '$injector', '$q', 'moment', 'platformTranslateService',
		'platformModalFormConfigService', 'resourceEquipmentGroupDataService','platformDialogService',

		function (_, $http, $translate, $injector, $q, moment, platformTranslateService, platformModalFormConfigService, resourceEquipmentGroupDataService, platformDialogService) {

			let service = {};
			let isValid;
			let arrowIcon = ' &#10148; ';
			let modalCreateConfig = null;
			let selectedPlantGroups = null;
			let title = $translate.instant('resource.equipmentgroup.characteristicForPlantWizard.title');

			service.setCharacteristicsforEquipment = function setCharacteristicsforEquipment() {
				selectedPlantGroups = resourceEquipmentGroupDataService.getSelectedEntities();
				let plantGroupIds = selectedPlantGroups.map(function (item) {
					return item.Id;
				});

				isValid = validatePlantGroups(plantGroupIds);
				if (isValid) {
					modalCreateConfig = {
						title: title,
						dataItem: {
							CharakteristicFk: null,
							IsOverwrite: false,
							GroupCode: '',
						},

						formConfiguration: {
							version: '1.0.0',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'group',
									label: 'Characteristic',
									label$tr$: 'resource.equipmentgroup.characteristicForPlantWizard.characteristicLable',
									type: 'directive',
									directive: 'basics-characteristic-code-lookup',
									options: {
										lookupOptions: {},
										sectionId: 34,
										mainService: 'resourceEquipmentGroupDataService', // will return characteristics by selected entity
										lookupDirective: 'basics-characteristic-code-lookup',
										descriptionMember: 'DescriptionInfo.Translated'
									},
									model: 'CharakteristicFk',
									required: true,
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'group',
									label$tr$: 'resource.equipmentgroup.characteristicForPlantWizard.isOverwriteLabel',
									label: 'Update/ Overwrite',
									type: 'boolean',
									model: 'IsOverwrite',
									validator: 'isOverwrite',
									sortOrder: 2
								},
							]
						},

						// action for OK button
						handleOK: function handleOK() {
							let dialogResourceCharacteristic = modalCreateConfig.dataItem;
							let data = {
								CharakteristicFk: dialogResourceCharacteristic.CharakteristicFk,
								SectionPlantGroupId: 34,
								SectionPlantId: 35,
								PlantGroupFks: plantGroupIds,
								PlantFks: modalCreateConfig.dataItem.PlatFks,
								IsOverwrite: modalCreateConfig.dataItem.IsOverwrite,
							};

							$http.post(globals.webApiBaseUrl + 'resource/equipmentgroup/characteristicwizard', data).then(function (response) {
								if (response && response.data) {
									let modalOptions = {
										headerText: $translate.instant(),
										bodyText:  response.data +' '+ $translate.instant('resource.equipmentgroup.characteristicForPlantWizard.addedAndUpdatedInfo') +' '+ selectedPlantGroups[0].Code,
										iconClass: 'ico-info',
										disableOkButton: false
									};
									platformDialogService.showDialog(modalOptions);
								} else {
									let modalOptionsfailed = {
										headerText: $translate.instant(),
										bodyText: $translate.instant('resource.equipmentgroup.characteristicForPlantWizard.alreadyExistInfo'),
										iconClass: 'ico-info',
										disableOkButton: false
									};
									platformDialogService.showDialog(modalOptionsfailed);
								}
							});
						},
						dialogOptions: {
							disableOkButton: function () {
								return validationCheckForResourceCharacteristicDialog(modalCreateConfig);
							}
						},
					};
					getPlantIdsByGroupFk(resourceEquipmentGroupDataService.getSelected().Id).then(function () {

						if(isValid){
							platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
							platformModalFormConfigService.showDialog(modalCreateConfig);
						}
					});
				}
			};

			function getPlantIdsByGroupFk(groupfk) {
				let data = {
					GroupFk: groupfk
				};
				return  $http.post(globals.webApiBaseUrl + 'resource/equipment/plant/lookuplistbyfilter', data).then(function (response) {
					if (response && response.data.length > 0) {
						isValid = true;
						let plants = response.data;
						let plantIds = plants.map(function (item) {
							return item.Id;
						});
						modalCreateConfig.dataItem.PlatFks = plantIds;
					}
					else{
						isValid = false;
						let modalOptionsfailed = {
							headerText: $translate.instant(title),
							bodyText: $translate.instant('resource.equipmentgroup.characteristicForPlantWizard.noPlatsWithgivenGroup'),
							iconClass: 'ico-info',
							disableOkButton: false
						};
						platformDialogService.showDialog(modalOptionsfailed);
					}
				});
			}

			function validationCheckForResourceCharacteristicDialog(modalCreateConfig) {
				let result = true;
				let dataItem = null;
				if (modalCreateConfig) {
					dataItem = modalCreateConfig.dataItem;
					if (modalCreateConfig.dataItem && dataItem.CharakteristicFk) {
						result = false;
					}
				}
				return result;
			}

			function validatePlantGroups(resources) {
				// Error MessageText
				let modalOptions = {
					headerText: $translate.instant(),
					bodyText: '',
					iconClass: 'ico-info',
					disableOkButton: false
				};
				let isValid = true;
				if (resources.length === 0) {
					modalOptions.bodyText += arrowIcon + $translate.instant('cloud.common.noCurrentSelection');
					isValid = false;
					platformDialogService.showDialog(modalOptions);
				}
				return isValid;
			}
			return service;
		}
	]);
})(angular);
