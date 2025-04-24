/**
 * Created by leo on 07.05.2018.
 */
(function (angular) {
	/* global globals */
	/* global moment */
	'use strict';
	/**
	 * @ngdoc service
	 * @name timekeepingCrewAssignmentDataService
	 * @function
	 *
	 * @description
	 * timekeepingCrewAssignmentDataService is the data service for all crew assignments related functionality.
	 */
	var moduleName = 'timekeeping.employee';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('timekeepingCrewAssignmentDataService', ['_', 'platformDataServiceFactory', 'timekeepingEmployeeDataService',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'platformDataServiceDataProcessorExtension', 'platformDataServiceActionExtension',
		function (_, platformDataServiceFactory, timekeepingEmployeeDataService, platformDataServiceProcessDatesBySchemeExtension, mandatoryProcessor,
			platformDataServiceDataProcessorExtension, platformDataServiceActionExtension) {

			var factoryOptions = {
				flatLeafItem: {
					module: resourceModule,
					serviceName: 'timekeepingCrewAssignmentDataService',
					entityNameTranslationID: 'timekeeping.employee.entityCrewAssignment',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'timekeeping/employee/crewassignment/',
						endRead: 'listbyparent',
						endDelete: 'multidelete',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = timekeepingEmployeeDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = timekeepingEmployeeDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						leaf: {
							itemName: 'CrewAssignments', parentService: timekeepingEmployeeDataService
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'CrewAssignmentDto',
						moduleSubModule: 'Timekeeping.Employee'
					})]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'CrewAssignmentDto',
				moduleSubModule: 'Timekeeping.Employee',
				validationService: 'timekeepingCrewAssignmentValidationService'
			});

			var service = serviceContainer.service;
			service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
				if (triggerField === 'Id') {
					service.load();
				}
			};

			service.takeOverItem = function (item) {
				var loadedItem = serviceContainer.data.getItemById(item.Id, serviceContainer.data);
				if (!_.isNil(loadedItem)) {
					loadedItem.ToDateTime = moment.utc(item.ToDateTime);
					service.markItemAsModified(item);
				}
			};

			service.takeOverWholeItem = function takeOverWholeItem(item){
				platformDataServiceDataProcessorExtension.doProcessItem(item, serviceContainer.data);
				platformDataServiceActionExtension.fireEntityCreated(serviceContainer.data, item);
				serviceContainer.data.itemList.push(item);
				service.markItemAsModified(item, serviceContainer.data);
			};
			service.canCreate = function canCreate() {
				let result = true;
				let selectedItem =  timekeepingEmployeeDataService.getSelected();
				if(selectedItem && selectedItem.IsCrewLeader){
					result = false;
				}
				return result;
			};
			function setCrewLeaderInEmployeeRecord(){
				let last = _.last(_.orderBy(service.getList(), ['FromTime']));
				if (last) {
					timekeepingEmployeeDataService.setCrewLeader(last);
				} else {
					timekeepingEmployeeDataService.setCrewLeader(null);
				}
			}

			service.registerEntityDeleted(setCrewLeaderInEmployeeRecord);

			let fields=[];
			function formatMoment(item, field, format) {
				switch (format) {
					case 'date':
						item[field] = item[field].format('YYYY[-]MM[-]DD[T00:00:00Z]');
						break;
					case 'dateutc':
						item[field] = item[field].utc().format();
						break;
					case 'datetimeutc':
					case 'datetime':
						item[field] = item[field].utc().format();
						break;
					case 'timeutc':
						item[field] = item[field].utc().format();
						break;
					default:
						break;
				}
			}

			function overwriteRevert(){
				_.forEach(serviceContainer.data.processor, function (proc) {
					if (proc.revertProcessItem && proc.fields) {
						fields = proc.fields;
						proc.revertProcessItem = function revertItem(item) {
							let field;
							_.forEach(fields, function (entry) {
								field = entry.field;
								if (item[field] && !angular.isString(item[field])) {
									formatMoment(item, entry.field, entry.format);
								}
							});
						}
					}
				});
			}
			overwriteRevert();
			return service;
		}]);
})(angular);
