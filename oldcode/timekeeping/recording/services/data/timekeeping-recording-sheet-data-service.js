/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.recording');

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingSheetDataService
	 * @description pprovides methods to access, create and update timekeeping recording sheet entities
	 */
	myModule.service('timekeepingRecordingSheetDataService', TimekeepingRecordingSheetDataService);

	TimekeepingRecordingSheetDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingRecordingConstantValues', 'timekeepingRecordingDataService', '$http', 'timekeepingRecordingRoundingDataService',
		'platformDeleteSelectionDialogService','platformCreateUuid', 'platformDialogService'];

	function TimekeepingRecordingSheetDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingRecordingConstantValues,
		timekeepingRecordingDataService, $http, timekeepingRecordingRoundingDataService, platformDeleteSelectionDialogService, platformCreateUuid, platformDialogService){

		var self = this;
		let deleteDialogId = platformCreateUuid();
		let timekeepingGroupId = null;
		let isTimekeeperOrAdmin = false;
		$http.get(globals.webApiBaseUrl + 'timekeeping/employee/isadminortimekeeperorcrewleader')
			.then(function (response) {
				if(response.data) {
					isTimekeeperOrAdmin = true;
				}
			},
			function (/* error */) {
			});

		function canCreateOrDelete(){
			return isTimekeeperOrAdmin;
		}

		let timekeepingRecordingSheetServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'timekeepingRecordingSheetDataService',
				entityNameTranslationID: 'timekeeping.recording.timekeepingRecordingSheetEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'timekeeping/recording/sheet/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/recording/sheet/',
					endRead: 'listbyparentandloginuser',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingRecordingDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canCreateOrDelete, canCreateCallBackFunc: canCreateOrDelete},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingRecordingConstantValues.schemes.sheet)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingRecordingDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'Sheets', parentService: timekeepingRecordingDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingRecordingSheetServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingRecordingSheetValidationService'
		}, timekeepingRecordingConstantValues.schemes.sheet));

		function setNewConfiguration(e, item){
			if (item && item.RoundingConfigDetail && item.TimekeepingGroupId !== timekeepingGroupId){
				timekeepingGroupId = item.TimekeepingGroupId;
				timekeepingRecordingRoundingDataService.setRoundingConfigDetails(item.RoundingConfigDetail);
			} else if (item && (!item.RoundingConfigDetail || item.TimekeepingGroupId === 0)) {
				timekeepingGroupId = 0;
				timekeepingRecordingRoundingDataService.setRoundingConfigDetailDefault(item.RoundingConfigDetail);
			}
		}
		serviceContainer.service.registerSelectionChanged(setNewConfiguration);

		function deleteItems(entities){
			return $http.post(globals.webApiBaseUrl + 'timekeeping/recording/sheet/canbedeleted',entities).then(function (response) {
				if (response && response.data){
					if (response.data.canBeDeleted) {
						platformDeleteSelectionDialogService.showDialog({dontShowAgain: true, id: deleteDialogId}).then(result => {
							if (result.ok || result.delete) {
								serviceContainer.data.deleteEntities(entities, serviceContainer.data);
							}
						});
					} else {

						let modalOptions = {
							width: '700px',
							headerText$tr$: 'timekeeping.recording.infoDeleteSheets',
							iconClass: 'ico-info',
							bodyText$tr$: 'timekeeping.recording.infoDeleteSheetsBody',
							details: {
								type: 'grid',
								options: {
									id: platformCreateUuid(),
									columns: [{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode' },
										{ id: 'Description', field: 'Description', name: 'Description', width: 300, formatter: 'description', name$tr$: 'cloud.common.entityDescription' }],
									options: {
										idProperty: 'Code'
									}
								},
								value: response.data.errorMsg
							}
						};

						platformDialogService.showDetailMsgBox(modalOptions).then(
							function (result) {
								if (result.ok|| result.yes){
									console.log(result.value);
								}
							}
						);
						//platformDialogService.errorMsg(modalOptions);

					}
				}
			});
		}
		serviceContainer.service.deleteItem = function deleteItem(entity){
			return deleteItems([entity]);
		};

		serviceContainer.service.deleteEntities = function deleteEntities(entities){
			return deleteItems(entities);
		};


	}
})(angular);
