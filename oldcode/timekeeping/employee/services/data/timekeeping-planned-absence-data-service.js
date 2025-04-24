/**
 * Created by leo on 09.05.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingPlannedAbsenceDataService
	 * @description pprovides methods to access, create and update timekeeping planned absence entities
	 */
	myModule.service('timekeepingPlannedAbsenceDataService', TimekeepingPlannedAbsenceDataService);

	TimekeepingPlannedAbsenceDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'PlatformMessenger', 'basicsCostGroupAssignmentService', 'basicsCommonMandatoryProcessor', 'timekeepingEmployeeDataService', 'permissions',
		'platformRuntimeDataService', 'platformPermissionService', 'timekeepingEmployeeConstantValues', 'SchedulingDataProcessTimesExtension', 'platformDataServiceDataProcessorExtension'];

	function TimekeepingPlannedAbsenceDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		PlatformMessenger, basicsCostGroupAssignmentService, mandatoryProcessor, timekeepingEmployeeDataService, permissions,
		platformRuntimeDataService, platformPermissionService, timekeepingEmployeeConstantValues, SchedulingDataProcessTimesExtension, platformDataServiceDataProcessorExtension) {
		let self = this;
		let serviceContainer = null;
		let timekeepingPlannedAbsenceServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'timekeepingPlannedAbsenceDataService',
				entityNameTranslationID: 'timekeeping.employee.entityTimekeepingPlannedAbsence',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/plannedabsence/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canDelete},
				dataProcessor: [
					new SchedulingDataProcessTimesExtension(['FromTime', 'ToTime']),
					platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'PlannedAbsenceDto',
						moduleSubModule: 'Timekeeping.Employee'
					}),
					{processItem: setReadonly}
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingEmployeeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						incorporateDataRead: function (result, data) {
							data.isDataLoaded = true;

							basicsCostGroupAssignmentService.process(result, self, {
								mainDataName: 'dtos',
								attachDataName: 'PlannedAbsence2CostGroups',
								dataLookupType: 'PlannedAbsence2CostGroups',
								identityGetter: function identityGetter(entity) {
									return {
										Id: entity.MainItemId
									};
								}
							});

							return serviceContainer.data.handleReadSucceeded(result.dtos, data);
						}
					}
				},
				entityRole: {
					node: {itemName: 'PlannedAbsences', parentService: timekeepingEmployeeDataService}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(timekeepingPlannedAbsenceServiceOption, self);
		self.onCostGroupCatalogsLoaded = new PlatformMessenger();
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'PlannedAbsenceDto',
			moduleSubModule: 'Timekeeping.Employee',
			validationService: 'timekeepingPlannedAbsenceValidationService'
		});

		self.registerSelectionChanged(function (e, entity) {
			if (entity) {
				setReadonly(entity);
			}
		});

		function setReadonly(entity) {
			if (!entity) {
				return;
			}
			let fields = [];

			if (entity.IsReadOnly) {
				platformRuntimeDataService.readonly(entity, entity.IsReadOnly);
			} else {
				// If IsFromToTimeReadOnly is true, explicitly set FromTime and ToTime as read-only
				if (entity.IsFromToTimeReadOnly) {
					// Ensure that FromTime and ToTime are set as read-only, but only if they weren't already set
						fields.push({field: 'FromTime', readonly: true});
						fields.push({field: 'ToTime', readonly: true});
				} else {
					if (!_.isNil(entity.FromTime) || _.isNil(entity.ToTime)) {
						fields.push({field: 'AbsenceDay', readonly: true})
					}
				}
				if (fields.length > 0) {
					platformRuntimeDataService.readonly(entity, fields);
				}
			}
		}

		function canDelete() {
			let result = true;
			let selected = self.getSelected();
			if (selected && selected.IsReadOnly) {
				result = false;
			}
			return result;
		}
		serviceContainer.service.revertProcessItem = function revertProcessItem(item){
			platformDataServiceDataProcessorExtension.revertProcessItem(item, serviceContainer.data);
		};

	}
})(angular);
