/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.recording');

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingDataService
	 * @description provides methods to access, create and update timekeeping recording  entities
	 */
	myModule.service('timekeepingRecordingDataService', TimekeepingRecordingDataService);

	TimekeepingRecordingDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingRecordingConstantValues', '$http', '$injector',
		'platformDataServiceEntitySortExtension', 'platformDeleteSelectionDialogService', 'platformCreateUuid', 'platformDialogService'];

	function TimekeepingRecordingDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingRecordingConstantValues, $http, $injector,
		platformDataServiceEntitySortExtension, platformDeleteSelectionDialogService, platformCreateUuid, platformDialogService) {
		let self = this;
		let data;
		let deleteDialogId = platformCreateUuid();
		let isTimekeeperOrAdmin = false;
		$http.get(globals.webApiBaseUrl + 'timekeeping/employee/isadminortimekeeper')
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

		let timekeepingRecordingServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'timekeepingRecordingDataService',
				entityNameTranslationID: 'timekeeping.recording.timekeepingRecordingEntity',
				httpCRUD: {route: globals.webApiBaseUrl + 'timekeeping/recording/', usePostForRead: true, endRead: 'filtered', endDelete: 'multidelete'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'RecordingDto',
					moduleSubModule: 'Timekeeping.Recording'
				})],
				entityRole: {root: {itemName: 'Recordings', moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingRecording'}},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canCreateOrDelete, canCreateCallBackFunc: canCreateOrDelete},
				sidebarSearch: {
					options: {
						moduleName: 'timekeeping.recording',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						includeDateSearch: true,
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true,
						useIdentification: true,
						includeNonActiveItems: null,
					}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingRecordingServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingRecordingValidationService'
		}, timekeepingRecordingConstantValues.schemes.recording));

		function deleteItems(entities){
			return $http.post(globals.webApiBaseUrl + 'timekeeping/recording/canbedeleted',entities).then(function (response) {
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
							headerText$tr$: 'timekeeping.recording.infoDeleteRecording',
							iconClass: 'ico-info',
							bodyText$tr$: 'timekeeping.recording.infoDeleteBody',
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
								if (result.ok || result.yes) {
									console.log(result.value);
								}
							}
						);

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
