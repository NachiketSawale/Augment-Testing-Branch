/**
 * Created by leo on 26.04.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeDataService
	 * @function
	 *
	 * @description
	 * timekeepingEmployeeDataService is the data service for all employee related functionality.
	 */
	var moduleName = 'timekeeping.employee';
	var employeeModule = angular.module(moduleName);
	employeeModule.factory('timekeepingEmployeeDataService', ['$injector', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor','$http',
		'platformDataServiceEntitySortExtension', 'platformDeleteSelectionDialogService', 'platformCreateUuid', 'platformDialogService','platformRuntimeDataService',
		function ($injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, mandatoryProcessor, $http,
			platformDataServiceEntitySortExtension, platformDeleteSelectionDialogService, platformCreateUuid, platformDialogService,platformRuntimeDataService) {
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

			var factoryOptions = {
				flatRootItem: {
					module: employeeModule,
					serviceName: 'timekeepingEmployeeDataService',
					entityNameTranslationID: 'timekeeping.employee.entityEmployee',
					actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canCreateOrDelete, canCreateCallBackFunc: canCreateOrDelete},
					httpCRUD: {
						route: globals.webApiBaseUrl + 'timekeeping/employee/',
						endRead: 'filtered',
						endDelete: 'multidelete',
						usePostForRead: true
					},
					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						root: {
							itemName: 'Employees',
							moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingEmployee',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							useIdentification: true
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'EmployeeDto',
						moduleSubModule: 'Timekeeping.Employee'
					}),{ processItem: setReadonly },],
					translation: {
						uid: 'timekeepingEmployeeDataService',
						title: 'timekeeping.employee.entityEmployee',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'EmployeeDto',
							moduleSubModule: 'Timekeeping.Employee'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'EmployeeDto',
				moduleSubModule: 'Timekeeping.Employee',
				validationService: 'timekeepingEmployeeValidationService'
			});

			var service = serviceContainer.service;
			service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
				if (triggerField === 'Id') {
					service.load();
				}
			};

			var basefunction = serviceContainer.service.createItem;
			serviceContainer.service.createItem = function() {
				basefunction().then(function(employee) {
					var vmservice = $injector.get('timekeepingEmployeeWorkingTimeModelDataService');
					var initdata = {
						PKey1:employee.Id
					};
					vmservice.createItem(initdata).then(function(employeeWTM) {
						employeeWTM.HasOptedPayout = false;
						employeeWTM.ValidFrom = employee.StartDate.clone();
						employeeWTM.EmployeeWorkingTimeModelFk = employee.WorkingTimeModelFk;
					});
				});
			};

			service.setCrewLeader = function setCrewLeader(item){
				let selected = service.getSelected();
				if (item && item.EmployeeCrewFk) {
					selected.CrewLeaderFk = item.EmployeeCrewFk;
				} else {
					selected.CrewLeaderFk = null;
				}
				service.markItemAsModified(selected);
			};

			service.createDeepCopy = function createDeepCopy() {
				let selected = service.getSelected();
				if (selected) {
					$http.post(globals.webApiBaseUrl + 'timekeeping/employee/deepcopy', selected)
						.then(function (response) {
							serviceContainer.data.handleOnCreateSucceeded(response.data.Employees[0], serviceContainer.data);
						},
						function (/* error */) {
						});
				}
			};

			function deleteItems(entities){
				return $http.post(globals.webApiBaseUrl + 'timekeeping/employee/canbedeleted',entities).then(function (response) {
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
								headerText$tr$: 'timekeeping.employee.infoDeleteEmployee',
								iconClass: 'ico-info',
								bodyText$tr$: 'timekeeping.employee.infoDeleteBody',
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


			function setReadonly(entity) {
				let fields = [{ field: 'WorkingTimeAccountBalance', readonly: true },{ field: 'IsLive', readonly: true }];
				if(entity.HasCrewMember){
					fields.push({ field: 'IsCrewLeader', readonly: true });
				}
				if(!isTimekeeperOrAdmin){
					fields.push({ field: 'IsTimekeeper', readonly: true });
				}
				if (entity.ExternalId) {
					fields.push({ field: 'Code', readonly: true });
					fields.push({ field: 'Description', readonly: true });
					fields.push({ field: 'FirstName', readonly: true });
					fields.push({ field: 'FamilyName', readonly: true });
					fields.push({ field: 'Email', readonly: true });
					fields.push({ field: 'BirthDate', readonly: true });
					fields.push({ field: 'StartDate', readonly: true });
					fields.push({ field: 'IsCrewLeader', readonly: true });
					fields.push({ field: 'IsWhiteCollar', readonly: true });
					fields.push({ field: 'PaymentGroupId', readonly: true });
					fields.push({ field: 'IsPayroll', readonly: true });
				}
				platformRuntimeDataService.readonly(entity, fields);
			}


			serviceContainer.service.deleteItem = function deleteItem(entity){
				return deleteItems([entity]);
			};

			serviceContainer.service.deleteEntities = function deleteEntities(entities){
				return deleteItems(entities);
			};

			return service;
		}]);
})(angular);
