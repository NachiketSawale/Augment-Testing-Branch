(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceReservationDataService
	 * @function
	 *
	 * @description
	 * resourceReservationDataService is the data service for all reservation related functionality.
	 */
	var moduleName = 'resource.reservation';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceReservationDataService', ['_','$injector','platformDataServiceFactory', 'resourceReservationValidationProcessor', 'resourceResourceLookupDataService',
		'ServiceDataProcessDatesExtension', 'basicsCommonMandatoryProcessor', 'platformRuntimeDataService','platformGenericStructureService','platformPermissionService','permissions', 'resourceReservationReadonlyProcessorService',
		function (_,$injector,platformDataServiceFactory, resourceReservationValidationProcessor, resourceResourceLookupDataService,
			ServiceDataProcessDatesExtension, mandatoryProcessor, platformRuntimeDataService, platformGenericStructureService, platformPermissionService, permissions, resourceReservationReadonlyProcessorService) {
			var factoryOptions = {
				flatRootItem: {
					module: resourceModule,
					serviceName: 'resourceReservationDataService',
					entityNameTranslationID: 'resource.reservation.entityReservation',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/reservation/',
						endRead: 'filtered',
						extendSearchFilter: function extendSearchFilter(filterRequest) {
							var groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
							if (groupingFilter) {
								filterRequest.groupingFilter = groupingFilter;
							}
						},
						endDelete: 'multidelete',
						usePostForRead: true
					},
					actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canCreateOrDelete, canCreateCallBackFunc: canCreateOrDelete},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {}
					},
					entityRole: {
						root: {
							itemName: 'Reservations',
							moduleName: 'cloud.desktop.moduleDisplayNameResourceReservation',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							useIdentification: true,
							handleUpdateDone: function handleUpdateDone(updateData, response, data) {
								if (response.Reservations && response.Reservations.length > 0) {
									response.ReservationsToSave = _.assign([], response.Reservations);
								}
								data.handleOnUpdateSucceeded(updateData, response, data, true);
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							includeDateSearch: true,
							useIdentification: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							includeNonActiveItems: null,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['ReservedFrom', 'ReservedTo']),  resourceReservationReadonlyProcessorService]
				}
			};

			function canCreateOrDelete() {
				var result = true;
				var selected = service.getSelected();
				if(selected && selected.IsReadOnly){
					result = false;
				}
				return result;
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			// serviceContainer.data.newEntityValidator = resourceReservationValidationProcessor;
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'ReservationDto',
				moduleSubModule: 'Resource.Reservation',
				validationService: 'resourceReservationValidationService'
			});

			var service = serviceContainer.service;

			service.setEntityReadOnlyAfterStatusChange = function setEntityReadOnlyAfterStatusChange (entity){
				resourceReservationReadonlyProcessorService.processItem(entity);
			};

			service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
				if (triggerField === 'Id') {
					service.load();
				}
			};

			service.validateReservation = function (items) {
				resourceReservationValidationProcessor.validate(items);
			};

			service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
				if (updateData.ReservationsToSave && updateData.ReservationsToSave.length > 0) {
					updateData.Reservations = _.assign([], updateData.Reservations, updateData.ReservationsToSave);
					updateData.ReservationsToSave.length = 0;
					delete updateData.ReservationsToSave;
				}
			};

			service.takeOverBoardReservations = function takeOverBoardReservations(reservations) {
				let added = 0;
				_.forEach(reservations, function(reservation) {
					if(!_.find(serviceContainer.data.itemList, { Id: reservation.Id })) {
						serviceContainer.data.itemList.push(reservation);
						added += 1;
					}
				});

				if(added > 0) {
					serviceContainer.data.listLoaded.fire();
				}
			};

			service.getToHandleEntities = function getToHandleEntities() {
				var provider = $injector.get('resourceReservationSynchronisationService');

				return provider.getSelectedEntities();
			};


			return service;
		}]);
})(angular);
