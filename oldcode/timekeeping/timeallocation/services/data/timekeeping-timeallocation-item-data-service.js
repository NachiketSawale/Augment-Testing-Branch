/**
 * Created by baf on 22.09.2021
 */

(function (angular) {
	/* global globals Platform */
	'use strict';
	var myModule = angular.module('timekeeping.timeallocation');

	/**
	 * @ngdoc service
	 * @name timekeepingTimeallocationItemDataService
	 * @description pprovides methods to access, create and update timekeeping timeallocation item entities
	 */
	myModule.service('timekeepingTimeallocationItemDataService', TimekeepingTimeallocationItemDataService);

	TimekeepingTimeallocationItemDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingTimeallocationConstantValues', 'timekeepingTimeallocationHeaderDataService', 'platformGridAPI',
		'timekeepingTimeallocationActionDataService', '$injector', '$q', '$http', 'platformRuntimeDataService'];

	function TimekeepingTimeallocationItemDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, timekeepingTimeallocationConstantValues, timekeepingTimeallocationHeaderDataService, platformGridAPI,
		timekeepingTimeallocationActionDataService, $injector, $q, $http, platformRuntimeDataService) {
		var self = this;
		var serviceContainer = null;

		function canDelete(item) {
			return !item.IsGenerated;
		}

		var timekeepingTimeallocationItemServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'timekeepingTimeallocationItemDataService',
				entityNameTranslationID: 'timekeeping.timeallocation.itemEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/timeallocation/item/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingTimeallocationHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canDelete},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingTimeallocationConstantValues.schemes.timeallocationitem), {
					  processItem: setReadonly
				}],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingTimeallocationHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey3 = selected.PeriodFk;
						},
						incorporateDataRead: function (readData, data) {
							let result = serviceContainer.data.handleReadSucceeded(readData, data);
							timekeepingTimeallocationActionDataService.setDataItemList(readData);
							let exist = platformGridAPI.grids.exist('a3b5c55c64f74de89c84f8265b8cef42');
							if (exist && readData.length > 0) {
								let selected = timekeepingTimeallocationHeaderDataService.getSelected();
								if (selected !== null) {
									let colService = $injector.get('timekeepingTimeallocationActionColumnService');
									colService.appendActionValues(readData, selected.ProjectActions);
								}
							}
						}
					}
				},
				entityRole: {
					node: {itemName: 'TimeAllocation', parentService: timekeepingTimeallocationHeaderDataService}
				}
			}
		};
		function setReadonly(item){
			const allassignedHoursValue = _.find(item.TimeAllocations2ProjectActions, action => _.isNil(action.assignedHours));
			let timealloctionHeaderEntity = timekeepingTimeallocationHeaderDataService.getSelected();
			 if(typeof allassignedHoursValue !== 'undefined')
			 {
				 let fields = [
					 {field: 'ProjectFk', readonly: true},
					 {field: 'JobFk', readonly: true},
					 {field: 'AllocationDate', readonly: true}
				 ];
				 platformRuntimeDataService.readonly(timealloctionHeaderEntity,fields);
			 }
			if (item.Version === 0) {
				serviceContainer.service.markItemAsModified(item);
			}
			platformRuntimeDataService.readonly(item, [{field: 'IsGenerated', readonly: true}]);
			if (item.IsGenerated) {
				let fields = [
					{field: 'RecordFk', readonly: true},
					{field: 'RecordType', readonly: true},
					{field: 'RecordDescription', readonly: true},
					{field: 'RecordingFk', readonly: true},
					{field: 'DistributedHours', readonly: true},
					{field: 'DistributedHoursTotal', readonly: true},
					{field: 'ToDistribute', readonly: true}
				];
				platformRuntimeDataService.readonly(item, fields);
			}
			if (item.RecordType === 1 && item.IsGenerated) {
				platformRuntimeDataService.readonly(item, [{field: 'TotalProductiveHours', readonly: true}]);
			} else {
				platformRuntimeDataService.readonly(item, [{field: 'TotalProductiveHours', readonly: false}]);
			}
		}
		serviceContainer = platformDataServiceFactory.createService(timekeepingTimeallocationItemServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingTimeallocationItemValidationService'
		}, timekeepingTimeallocationConstantValues.schemes.timeallocationitem));
		serviceContainer.service.articleChanged = new Platform.Messenger();
		serviceContainer.service.setTriggerLoadOnSelectedEntitiesChanged(true);

		timekeepingTimeallocationHeaderDataService.registerSelectionChanged(function (e, item) {
			if (item !== null) {
				let colService = $injector.get('timekeepingTimeallocationActionColumnService');
				colService.appendActionCols(item.ProjectActions, item.ProjectFk, item.JobFk);
			}
		});

		function getArticleInformation(artId, artType, period) {
			return $http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/item/articleinformation', {
				Id: artId,
				PKey2: period,
				PKey3: artType
			});
		}

		function takeOverDescription(record, article) {
			if (!_.isNull(article) && !_.isUndefined(article)) {
				record.RecordDescription = article.RecordDescription;
				if (record.RecordType === timekeepingTimeallocationConstantValues.types.employee.id && _.isNil(record.RecordingFk)) {
					record.RecordingFk = article.RecordingFk;
				}
			}
		}

		serviceContainer.service.setArticleInformation = function (item, article) {
			let header = timekeepingTimeallocationHeaderDataService.getSelected();
			let period = null;
			if (header) {
				period = header.PeriodFk;
			}
			switch (item.RecordType) {
				case timekeepingTimeallocationConstantValues.types.plant.id:
					return getArticleInformation(article || item.PlantFk, item.RecordType, period).then(function (result) {
						takeOverDescription(item, result.data);
						return item;
					});
				case timekeepingTimeallocationConstantValues.types.employee.id:
					return getArticleInformation(article || item.EmployeeFk, item.RecordType, period).then(function (result) {
						takeOverDescription(item, result.data);
						serviceContainer.service.articleChanged.fire();
						return item;
					});
				default:
					return $q.when(item);
			}
		};

		serviceContainer.service.updateTotalHours = function (changeValue) {
			let selectedTimeAllocation = serviceContainer.service.getSelected();
			if (selectedTimeAllocation !== null) {
				selectedTimeAllocation.TotalProductiveHours += changeValue;
				selectedTimeAllocation.ToDistribute += changeValue;
				serviceContainer.service.markItemAsModified(selectedTimeAllocation);
			}
		};

	}
})(angular);
