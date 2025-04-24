(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonChangeStatusService
	 * @function
	 * @requires platformModalService, $q, $http, $translate, platformTranslateService, basicsWorkflowInstanceService, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupDataService, platformSidebarWizardCommonTasksService, basicsWorkflowInstanceStatus
	 * @description Provide general implement for change status dialog wizard to load the status, change status and trigger the configured workflow.
	 *
	 *
	 */
	angular.module(moduleName).factory('basicsCommonChangeStatusService', [
		'platformModalService', '$q', '$http', '$translate', 'cloudDesktopSidebarService', 'platformTranslateService',
		'basicsWorkflowInstanceService', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupDataService', 'platformSidebarWizardCommonTasksService',
		'basicsWorkflowInstanceStatus',
		'$timeout',
		'platformDataProcessExtensionHistoryCreator',
		'PlatformMessenger',
		'globals',
		'$',
		'_',
		'platformValidationByDataService',
		'platformModuleStateService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function (
			platformModalService, $q, $http, $translate, cloudDesktopSidebarService, platformTranslateService,
			basicsWorkflowInstanceService, lookupDescriptorService, lookupDataService, platformSidebarWizardCommonTasksService, wfStatus, $timeout, platformDataProcessExtensionHistoryCreator,
			PlatformMessenger, globals, $, _,
			platformValidationByDataService,platformModuleStateService) {
			const onStatusChangedDone = new PlatformMessenger();
			platformTranslateService.registerModule('basics.common');

			const statusCache = {};
			let ifReadOnlyTrue =false;

			let changeStatusResults = [];

			/**
			 * @ngdoc function
			 * @name changeStatusAndTriggerWorkflow
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description Save the new stauts, the save status and trigger workflow action will be handle in backend part
			 * @param {Object}  options   Change status option setting
			 * @param {Object}  entity    Entity of the change status
			 * @param {String}  comment    Entity of the change status
			 * @returns {Promise<Object>}   Entity after save
			 */
			function changeStatusAndTriggerWorkflow(options, entity, comment) {
				const endpoint = 'basics/common/status/changeandtriggerwf?statusName=' + options.statusName;
				const parameterOptions = {
					FromStatusId: options.fromStatusId,
					ToStatusId: options.toStatusId,
					EntityId: entity.Id,
					StatusField: options.statusField,
					EntityTypeName: options.statusName.toLowerCase(),
					PKey1Field: options.pKey1Field ? entity[options.pKey1Field] : null,
					PKey2Field: options.pKey2Field ? entity[options.pKey2Field] : null,
					ProjectId: options.projectId,
					CheckAccessRight: options.checkAccessRight
				};
				const param = {
					Options: parameterOptions,
					Remark: comment,
					HookExtensionOptions: options.HookExtensionOptions
				};
				return $http({
					method: 'POST',
					url: globals.webApiBaseUrl + endpoint,
					data: param
				}).then(function (result) {
					return result.data;
				});

			}

			/**
			 * @ngdoc function
			 * @name changeStatus
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description Change status and execute the workflow logic
			 * @param {Object}  options   Change status option setting
			 * @param {String}  comment    Entity of the change status
			 * @returns {Promise<Object>}   Entity after save
			 */
			function changeStatus(options, comment) {
				const defer = $q.defer();
				const entity = options.entity;
				let mainService = options.mainService;
				let dataService = {};

				if (angular.isFunction(options.getDataService)) {
					dataService = options.getDataService();
					options.dataService = dataService;
				} else {
					dataService = options.dataService || options.mainService;
				}

				// the estimate as the project sub conatainer, but need to refresh the estimate container
				// this is for task: #95969
				if (mainService.getServiceName() === 'estimateProjectService') {
					mainService = mainService.parentService();
				}

				let promises = [];
				if(angular.isFunction(options.HookExtensionOperation)){
					options.Remark = comment;
					promises.push(options.HookExtensionOperation(options));
				}

				if (options.doValidationAndSaveBeforeChangeStatus) {
					let promise = doAsyncValidationAndSaveBeforeChangeStatus(options, [entity], mainService, dataService);
					if (!promise) {
						defer.resolve({changed: false, entity: entity});
						return defer.promise;
					}
					promises.push(promise);
				}

				$q.all(promises).then(function (canChangeStataus) {
					if (_.filter(canChangeStataus,function (status) {
						return !status;
					}).length > 0) {
						let failResult = {changed: false, entity: entity,
							ErrorMsg: $translate.instant('basics.common.changeStatus.abortToChangeByUserOrFailToUpdate')};
						defer.resolve(failResult);
						return defer.promise;
					}

					// Simple status will not need to trigger workflow
					if (options.isSimpleStatus === true) {
						saveStatus(options, entity).then(function (data) {
							defer.resolve({changed: true, entity: data});
						});
					}
					else {
						getStatusList(options).then(function () {
							changeStatusAndTriggerWorkflow(options, entity, comment).then(function (data) {
								defer.resolve({
									changed: data.Result,
									ErrorMsg: data.ErrorMsg,
									executed: data.Result,
									entity: data.Entity,
									hasConfiguredWorkflows: data.HasConfiguredWorkflows,
									statusItem: options.statusItem
								});
							});
						});
					}
				});

				return defer.promise;
			}

			/**
			 * @ngdoc function
			 * @name saveStatus
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description Save the new stauts
			 * @param {Object}  options   Change status option setting
			 * @param {Object}  entity    Entity of the change status
			 * @returns {Promise<Object>}   Entity after save
			 */
			function saveStatus(options, entity) {
				const endpoint = options.updateUrl || 'basics/common/status/change';

				return $http({
					method: 'POST',
					url: globals.webApiBaseUrl + endpoint,
					data: {
						StatusName: options.statusName,
						StatusField:options.statusField,
						OldStatusId: options.fromStatusId,
						NewStatusId: options.toStatusId,
						EntityId: entity.Id,
						EntityPKey1: options.pKey1Field ? entity[options.pKey1Field] : null,
						EntityPKey2: options.pKey2Field ? entity[options.pKey2Field] : null
					}
				}).then(function (result) {
					return result.data;
				});

			}

			/**
			 * @ngdoc function
			 * @name showDialog
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description Show the change status dialog
			 * @param {Object}  options   Change status option setting
			 * @param {Boolean} firstTime Is shown for the first time
			 * @param {Boolean} isOneGroup Is one group
			 * @returns Promise
			 */
			function showDialog(options, firstTime, isOneGroup) {

				const d = $q.defer();

				const defaultValue = {
					headerText: $translate.instant('basics.common.changeStatus.headerText'),
					keyboard: isOneGroup,
					resizeable: true,
					codeField: 'Code',
					descField: 'Description',
					statusDisplayField: 'DescriptionInfo.Translated',
					onReturnButtonPress: function () {
					}
				};

				// if using the entity(for toStatusId), when change statusField,data in outside will change too!
				$.extend(defaultValue, options, {
					templateUrl: globals.appBaseUrl + 'basics.common/partials/change-status-dialog.html'
				});

				if (!options.entity || !Object.prototype.hasOwnProperty.call(options.entity, defaultValue.statusField)) {
					d.reject('Change status dialog: empty object or cannot find needed field');
				}

				$timeout(function () {
					platformModalService.showDialog(defaultValue).then(function (results) {
						d.resolve(results);
						changeStatusResults = [];
					}, function () {
						changeStatusResults = [];
					});
				}, firstTime ? 0 : 300, false);

				return d.promise;
			}

			/**
			 * @ngdoc function
			 * @name getStatusList
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description return the status list from different data provider
			 * @param {Object}  options   Change status option setting
			 * @returns {Promise<Object>}   Array of status
			 */
			function getStatusList(options) {

				if (angular.isFunction(options.statusProvider)) {
					return options.statusProvider(options.entity);
				} else if (options.statusLookupType) {
					return lookupDataService.getList(options.statusLookupType);
				} else {
					if (Object.prototype.hasOwnProperty.call(statusCache, options.statusName)) {
						$q.when(statusCache[options.statusName]);
					}

					return $http.get(globals.webApiBaseUrl + 'basics/common/status/list?statusName=' + options.statusName)
						.then(function (respon) {
							statusCache[options.statusName] = respon.data;
							return respon.data;
						});
				}
			}

			/**
			 * @ngdoc function
			 * @name getAllProjectAlternatives for Next page
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description return all the project alternatives list
			 * @param {Object}  options   Change status option setting
			 * @returns {Promise<Object>}   
			 */
			function getAllProjectAlternatives(options)
			{
				// if (angular.isFunction(options.statusProvider)) {
				// 	return options.statusProvider(options.entity);
				// }
				

				return $http.get(globals.webApiBaseUrl + 'project/main/getProjectAlternatives?id=' + options.entity.Id)
					.then(function (respon) {
						return respon.data;
					});
			}

			/**
			 * @ngdoc function
			 * @name getAllStatusList for history page
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description return all the status list from different data provider
			 * @param {Object}  options   Change status option setting
			 * @returns {Promise<Object>}   Array of status
			 */
			function getAllStatusList(options) {

				if (angular.isFunction(options.statusProvider)) {
					return options.statusProvider(options.entity);
				}
				const cacheName = options.statusName + 'history';
				if (Object.prototype.hasOwnProperty.call(statusCache, cacheName)) {
					$q.when(statusCache[cacheName]);
				}

				return $http.get(globals.webApiBaseUrl + 'basics/common/status/getallstatus?statusName=' + options.statusName)
					.then(function (respon) {
						statusCache[cacheName] = respon.data;
						return respon.data;
					});
			}

			/**
			 * @ngdoc function
			 * @name getAvailableStatus
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description Get the next available status according to the configuration
			 * @param {Object}  options   Change status option setting
			 * @returns {Promise<Object>}   Array of status
			 */
			function getAvailableStatus(options) {
				if (_.isNaN(options.projectId)) {
					options.projectId = null;
				}
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/common/status/availablestatus',
					params: {
						statusName: options.statusName,
						statusFrom: options.fromStatusId,
						projectId: options.projectId
					}
				}).then(function (respon) {
					if (_.isFunction(options.filterStatuses)){
						return options.filterStatuses(options, respon.data);
					}
					else {
						return $q.resolve(respon.data);
					}
				});
			}

			/**
			 * @ngdoc function
			 * @name getDefaultStatus
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description Get the default status according to the configuration
			 * @param {Object}  options   Change status option setting
			 * @returns {Promise<Object>}   item of status
			 */
			function getDefaultStatus(options) {
				return $http.get(globals.webApiBaseUrl + 'basics/common/status/default?statusName=' + options.statusName)
					.then(function (respon) {
						return respon.data;
					});
			}

			/**
			 * getCurrentStatus
			 * @param options
			 * @returns {Promise|*}
			 */
			function getCurrentStatus(options) {
				const entityId = {Id: options.entity.Id,StatusField: options.statusField};

				if (options.pKey1Field) {
					entityId.PKey1 = options.entity[options.pKey1Field];
				}

				if (options.pKey2Field) {
					entityId.PKey2 = options.entity[options.pKey2Field];
				}

				return $http.post(globals.webApiBaseUrl + 'basics/common/status/current?statusName=' + options.statusName, entityId)
					.then(function (respon) {
						return respon.data;
					});
			}

			/**
			 * getMultiEntitiesCurrentStatus
			 * @param options
			 * @returns {Promise|*}
			 */
			function getMultiEntitiesCurrentStatus(statusName, identifications) {
				return $http.post(globals.webApiBaseUrl + 'basics/common/status/getcurrentstatuses?statusName=' + statusName, identifications)
					.then(function (respon) {
						return respon.data;
					});
			}

			/**
			 * @ngdoc function
			 * @name getCurrentStatusId
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description Get the default status according to the configuration
			 * @param {Object}  options   Change status option setting
			 * @returns {Promise<Object>}   status id
			 */
			function getCurrentStatusId(options) {
				const deferred = $q.defer();
				let statusId = options.entity[options.statusField];
				// the getCurrentStatus will return 0 if the current status is null, So need to set 0
				if (statusId === null) {
					statusId = 0;
				}
				getCurrentStatus(options).then(function (currentStatusId) {
					if (currentStatusId === statusId || currentStatusId === -1) {
						if (statusId === null || statusId === 0) { // if current status is null, using default status.
							getDefaultStatus(options).then(function (data) {
								if (data) {
									deferred.resolve(data.Id);
								} else {
									deferred.reject($translate.instant('basics.common.missingStatusError'));
								}
							});
						} else {
							deferred.resolve(statusId);
						}
					} else {
						deferred.reject($translate.instant('basics.common.obsoleteStatusError'));
					}
				});

				return deferred.promise;
			}

			/**
			 * @ngdoc function
			 * @name getEntitiesCurrentStatusIds
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description Get the multiple entities current status according to the configuration
			 * @param {Object[]}  options   Change status option setting
			 * @param {String}  statusName   status name
			 * @param {Object[]}  identifications  identifications
			 * @returns {Promise<Object>}  dictionary contain entity id and  status id
			 */
			function getEntitiesCurrentStatusIds(options, statusName, identifications) {
				const deferred = $q.defer();
				getMultiEntitiesCurrentStatus(statusName, identifications).then(function (results) {
					if (results === 0) {
						deferred.reject($translate.instant('basics.common.missingStatusError'));
					}
					else {
						angular.forEach(options, function (option) {
							let statusId = option.entity[option.statusField];
							if(statusId === null){
								statusId = 0;
							}
							let pKey1 = null;
							let pKey2 = null;
							if (option.pKey1Field) {
								pKey1 = option.entity[option.pKey1Field];
							}
							if (option.pKey2Field) {
								pKey2 = option.entity[option.pKey2Field];
							}
							let identification = _.find(results, function (item) {
								return item.Id === option.entity.Id && item.PKey1 === pKey1 && item.PKey2 === pKey2;
							});
							if(!_.isNil(identification)){
								if(statusId !== 0 && statusId !== identification.CurrentStatusId ){
									deferred.reject($translate.instant('basics.common.obsoleteStatusError'));
									return;
								}else{
									option.fromStatusId = identification.CurrentStatusId;
									option.toStatusId = identification.CurrentStatusId;
								}
							}

						});
						deferred.resolve(results);
					}
				});

				return deferred.promise;
			}

			/**
			 * @ngdoc function
			 * @name provideStatusChangeInstance
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description Provide the wizard configure for different entity
			 * @param {Object}  config  configuration of the workflow
			 *                          here is the sample of the configuration
				 {
												 projectField: 'ProjectFk',         //project field
												 statusName: 'businessPartner',     //status name
												 mainService: businesspartnerMainHeaderDataService, //main service
												 refreshMainService: false, //boolean, refresh the whole module if true or undefined
												 statusField: 'BusinessPartnerStatusFk',            //status field of the entity
												 codeField: 'BusinessPartnerName1',                 //entity code field, default 'Code'
												 descField: 'BusinessPartnerName2',                 //entity description field, default 'Description'
												 title: 'businesspartner.main.statusTitle',         //Dialog title
												 updateUrl: 'businesspartner/main/businesspartnermain/changestatus',  //Url request to save the status.
												 id: 13
											 }
			 * @returns {Object}
			 */
			function provideStatusChangeInstance(config) {

				return {
					id: config.id || 'changeStatus',
					text: config.title,
					text$tr$: config.title,
					type: 'item',
					showItem: true,
					cssClass: 'rw md',
					fn: function () {
						let MainService = config.mainService;
						let dataService = {};
						if (angular.isFunction(config.getDataService)) {
							dataService = config.getDataService();
							config.dataService = dataService;
						} else {
							dataService = config.dataService || config.mainService;
						}
						// the estimate as the project sub conatainer, but need to refresh the estimate container
						// this is for task: #95969
						if (MainService.getServiceName() === 'estimateProjectService') {
							MainService = MainService.parentService();

						}
						MainService.update()
							.then(function(updateResult) {
								if (!updateResult) {
									return;
								}


								// });

								// MainService.updateAndExecute(function () {
								const entity = dataService.getSelected();
								if (platformSidebarWizardCommonTasksService.assertSelection(entity, config.title)) {
									let entities = [entity];
									if (!config.denyMultiChange && (dataService.getSelectedEntities || dataService.getToHandleEntities)) {// if correct settings ,will support multi behavior
										if(dataService.getSelectedGroupEntities){
											entities = dataService.getSelectedGroupEntities();
										}else if(dataService.getToHandleEntities){
											entities = dataService.getToHandleEntities();
										}else if(dataService.getSelectedEntities){
											entities = dataService.getSelectedEntities();
										}
									}
									if(config.customValidate){
										var isValid = config.customValidate(entities);
										if(!isValid){
											return false;
										}
									}
									if (config.validateCanChangeStatus) {
										getCanChangeStatusEntities(config, entities).then(function (result) {
											// if has can not change status entity, then show the warning dialog
											if (result && result.length !== entities.length) {
												const allEntities = [].concat(entities);
												const cannnotChange = _.remove(allEntities, function (e) {
													const r = result.includes(e.Id);
													return !r;
												});
												const warningDataItems = getWarningEntitiesInfo(cannnotChange, config);
												platformModalService.showDialog({
													currentItem: warningDataItems,
													templateUrl: globals.appBaseUrl + 'basics.common/partials/show-invalid-change-status-entities-dialog.html',
													backdrop: false,
													showCancelButton: true,
													showOkButton: true,
													width: '300px'
												}).then(function (result) {
													if (result.ok) {
														if (entities.length > 1) {
															// #88622 - new way for changing status of selected entities
															handleMultiple(allEntities, config);
															return;
														}
														ExecuteChangeStatus(allEntities, dataService, config);
													} else {
														// ignore
													}

												});

											} else {
												if (entities.length > 1) {
													// #88622 - new way for changing status of selected entities
													handleMultiple(entities, config);
													return;
												}
												ExecuteChangeStatus(entities, dataService, config);
											}

										});
									} else {
										if (entities.length > 1) {
											// #88622 - new way for changing status of selected entities
											handleMultiple(entities, config);
											return;
										}
										ExecuteChangeStatus(entities, dataService, config);
									}

								}
							});
					}
				};
			}

			/**
			 * @ngdoc function
			 * @name ExecuteChangeStatus
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description execute the ChangeStatus
			 * @param {Object[]} entities
			 * @param {Object} dataService
			 * @param {Object} config
			 */
			function ExecuteChangeStatus(entities, dataService, config) {
				const options = [], promises = [];
				_.forEach(entities, function (entity) {
					const option = Object.create(config); //angular.copy(config);
					option.entity = entity;
					if (option.projectField) {
						option.projectId = entity[option.projectField];
					} else if (angular.isFunction(option.getProjectIdFn)) {
						option.projectId = option.getProjectIdFn();
					}
					promises.push(getCurrentStatusId(option));
					options.push(option);
				});
				$q.all(promises).then(function (instances) {
					angular.forEach(instances, function (instance, index) {
						options[index].fromStatusId = instance;
						options[index].toStatusId = instance;
					});
					const grouped = _.groupBy(options, function (option) {
						return [option.projectId, option.fromStatusId].join(',');
					});
					const finallyGroupedKeys = [];
					_.forOwn(grouped, function (item, pKey) {
						finallyGroupedKeys.push(pKey);
					});
					let index = 0;
					let results = [];
					const totalCount = entities.length;
					let currentCount = 0;
					const changeStatusOnce = function (firstTime, previousSelectedStatus, isOneGroup) {
						if (finallyGroupedKeys.length > index) {
							const groupedKey = finallyGroupedKeys[index++];
							const option = Object.create(config); //angular.copy(config);
							option.entities = _.map(grouped[groupedKey], 'entity');
							option.entity = option.entities[0];
							currentCount += option.entities.length;
							option.headerText = $translate.instant(config.title);
							if (totalCount !== 1) {
								option.headerText += ' (' + currentCount + '/' + totalCount + ')';
							}
							option.imageSelector = 'platformStatusIconService';
							const groupKeyArray = _.split(groupedKey, ',');
							option.projectId = parseInt(groupKeyArray[0]);
							option.fromStatusId = option.toStatusId = parseInt(groupKeyArray[1]);
							if (previousSelectedStatus) {
								option.toStatusId = previousSelectedStatus;
							}
							option.isMultipleSelected = option.entities.length > 1;
							executeChangeStatusOnce(option, dataService, firstTime, isOneGroup).then(function (result) {
								if (result && result.results) {
									results = results.concat(result.results);
								}
								changeStatusOnce(false, result ? result.currentStatusId : null, isOneGroup);// next group
							});
						} else {// finished all
							afterDoneAll(config, dataService, results, entities);
						}
					};
					changeStatusOnce(true, null, finallyGroupedKeys.length === 1);
				}, function (error) {
					platformModalService.showErrorBox(error, $translate.instant('basics.common.changeStatus.openFailedTitle'));
				});
			}

			/**
			 * @ngdoc function
			 * @name executeChangeStatusOnce
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description execute the ChangeStatus one time
			 * @param {Object} options
			 * @param {Object} dataService
			 * @param {Boolean} firstTime
			 * @param {Boolean} isOneGroup
			 * @returns {Promise}
			 */
			function executeChangeStatusOnce(options, dataService, firstTime, isOneGroup) {
				const deferred = $q.defer();
				showDialog(options, firstTime, isOneGroup).then(function (result) {
					if (angular.isFunction(options.handleSuccess)) {
						_.forEach(result.results, function (result) {
							if (result.changed) {
								options.handleSuccess(result);
							}
						});
					}
					deferred.resolve(result);
				}, function (reject) {
					console.log(reject);
					deferred.resolve();
				});
				return deferred.promise;
			}

			/**
			 * @ngdoc function
			 * @name executeMultipleChangeStatusOnce
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description execute the ChangeStatus mutiple one time
			 * @param {Object} options
			 * @param {Object} dataService
			 * @param {Boolean} firstTime
			 * @param {Boolean} isOneGroup
			 * @returns {Promise}
			 */
			function executeChangeStatusMultipleOnce(options, dataService, firstTime, isOneGroup) {
				const deferred = $q.defer();
				showMultipleDialog(options, firstTime, isOneGroup).then(function (result) {
					if (angular.isFunction(options.handleSuccess)) {
						_.forEach(result.results, function (result) {
							if (result.changed) {
								options.handleSuccess(result);
							}
						});
					}
					deferred.resolve(result);
				}, function (reject) {
					console.log(reject);
					deferred.resolve();
				});
				return deferred.promise;
			}

			/**
			 * @ngdoc function
			 * @name getCanChangeStatusEntities
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description
			 * @param {Object} config
			 * @param {Object[]} entities
			 * @returns {Object[]}
			 */
			function getCanChangeStatusEntities(config, entities) {
				const option = Object.create(config); //angular.copy(config);
				const dataItems = entities.map(function (item) {
					return {
						EntityId: item.Id,
						EntityPKey1: option.pKey1Field ? item[option.pKey1Field] : null,
						EntityPKey2: option.pKey2Field ? item[option.pKey2Field] : null
					};
				});
				return $http.post(globals.webApiBaseUrl + 'basics/common/status/getcanchangestatusentities', {
					StatusName: config.statusName,
					DataItems: dataItems
				}).then(function (res) {
					if (res.data && res.data.length) {
						return res.data;
					}

					return [];
				});
			}

			/**
			 * @ngdoc function
			 * @name getWarningEntitiesInfo
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description get can not change status entities information
			 * @param {Object[]} entities
			 * @param {Object} config
			 * @returns {Object[]}
			 */
			function getWarningEntitiesInfo(entities, config) {
				return entities.map(function (item) {
					let code = item.Code;
					if (code === undefined || code === null) {
						if (config.codeField) {
							code = item[config.codeField];
						}
					}
					let description = item.Description;
					if (description === undefined || description === null) {
						if (config.descField) {
							description = item[config.descField];
							if ((description === null || description === undefined) && config.descField === 'DescriptionInfo.Translated') {
								description = item.DescriptionInfo.Description;
							}
						}
						// the form data description is in the formDataIntersection object
						if (description === null || description === undefined) {
							const formDataIntersection = item.FormDataIntersection;
							if (formDataIntersection) {
								description = formDataIntersection.DescriptionInfo.Translated;
							}
						}
					}
					return {
						Id: item.Id,
						Code: code,
						Description: description
					};
				});
			}

			/**
			 * @ngdoc function
			 * @name afterDoneAll
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description
			 * @param {Object} config
			 * @param {Object} dataService
			 * @param {Object[]} results
			 * @param {Object[]} entities
			 */
			function afterDoneAll(config, dataService, results, entities) {
				if (angular.isFunction(config.handleSuccess) && entities.length < 2 || config.denyRefresh === true) {
					return;
				}
				let mainService = config.mainService;

				if (mainService.getServiceName() === 'estimateProjectService') {
					mainService = mainService.parentService();

				}
				// var needRefresh = _.find(results, {changed: true, executed: true});
				let needRefresh = _.find(results, {changed: true});
				if (needRefresh && (config.refreshMainService === true || config.refreshMainService === undefined)) {
					//const mainItem = mainService.getSelected();
					// Refresh the whole data cause we don't know what changes in workflow
					// TODO: workaround save filterRequest temporarily
					const filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
					cloudDesktopSidebarService.filterRequest.pKeys = _.map(mainService.getList(), 'Id');
					// #125795: own parameter required to remove undesired values from filter request!
					cloudDesktopSidebarService.filterRequest.pKeysOnly = true;
					// var objects = mainService.getList();
					// var pKeys =[];
					// _.forEach(objects, function (object) {
					//
					//      pKeys.push({Id: object.Id, PKey1: object.ModelFk});
					// });
					// cloudDesktopSidebarService.filterRequest.pKeys = pKeys;

					// mainService.refresh().then(function () {
					// 	cloudDesktopSidebarService.filterRequest = filterRequest;
					// 	// Here we need to return a promise,so we use setSelected function
					// 	mainService.setSelected({}).then(function () {
					// 		const newEntity = mainService.getItemById(mainItem.Id);
					// 		mainService.setSelected(newEntity);
					// 	});
					// });
					var refreshFn = mainService.refreshSelectedEntities ? mainService.refreshSelectedEntities : mainService.refresh;
					var seviceName = mainService.getServiceName();
					// fixed the urgent task:Changing requisition status causes empty boq-structure container - side refresh is needed
					if(seviceName === 'procurementPesHeaderService' || seviceName === 'procurementRequisitionHeaderDataService' || seviceName === 'procurementContractHeaderDataService' || seviceName === 'procurementQuoteHeaderDataService'
						//DEV-10491 refreshSelectedEntities doesn't work as expect, some containers will not get refresh if some requests are cancel.
						|| seviceName === 'procurementPackageDataService'){
						refreshFn = mainService.refresh;
					}
					if(dataService.refreshFunction){
						refreshFn = dataService.refreshFunction();
					}
					refreshFn().then(function (response) {
						cloudDesktopSidebarService.filterRequest = filterRequest;
						if(refreshFn !== mainService.refresh && config.doStatusChangePostProcessing){
							var selected = mainService.getSelected();
							if(!_.isNil(selected) && !_.isNil(results)){
								config.doStatusChangePostProcessing(selected, results[0].statusItem);
							}
						}
					});
				} else {
					// merge modified items instead
					const newEntities = _.compact(_.map(results, 'entity'));
					if (_.isFunction(dataService.processData)) {
						dataService.processData(newEntities);
					} else if (_.isFunction(dataService.getDataProcessor)) {
						const simpleProcessors = _.filter(dataService.getDataProcessor(), function (proc) {
							return _.isFunction(proc.processItem) && proc.processItem.length === 1;
						});
						_.forEach(simpleProcessors, function (processor) {
							_.forEach(newEntities, processor.processItem);
						});
					}

					angular.forEach(newEntities, function (item) {
						const oldItem = _.find(entities, {'Id': item.Id});
						if (oldItem) {
							if (oldItem.ChildItems) {
								item.ChildItems = oldItem.ChildItems;
							}// keep the tree
							angular.extend(oldItem, item);
							platformDataProcessExtensionHistoryCreator.processItem(oldItem);// update the history field
							// process the date fields!!
							needRefresh = true;
						}
					});
					if (needRefresh) {
						dataService.gridRefresh();
					}
				}
				onStatusChangedDone.fire(results);
			}

			/**
			 * @ngdoc function
			 * @name getStatusHistory
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description return the status history
			 * @param {Object}  options   Change status option setting
			 * @returns {Promise<Object>}   Array of status history
			 */
			function getStatusHistory(options) {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/common/status/listhistory',
					params: {
						statusName: options.statusName,
						objectId: options.entity.Id,
						objectPKey1: options.pKey1Field ? options.entity[options.pKey1Field] : null,
						objectPKey2: options.pKey2Field ? options.entity[options.pKey2Field] : null
					}
				}).then(function (respon) {
					return respon.data;
				});
			}

			/**
			 * @ngdoc function
			 * @name getChangeStatusResults
			 * @function
			 * @methodOf basicsCommonChangeStatusService
			 * @description return the change status result
			 * @returns {Object[]}
			 */
			function getChangeStatusResults() {
				return changeStatusResults;
			}

			function setChangeStatusResults(result) {
				changeStatusResults.push(result);
			}

			function getAvailableStatusItems(data) {
				return $http.post(globals.webApiBaseUrl + 'basics/common/status/availablestatusitems', data);
			}

			function handleMultiple(entities, config) {
				let mainService = config.mainService;
				let dataService = {};
				if (angular.isFunction(config.getDataService)) {
					dataService = config.getDataService();
					config.dataService = dataService;
				} else {
					dataService = config.dataService || config.mainService;
				}
				// the estimate as the project sub conatainer, but need to refresh the estimate container
				// this is for task: #95969
				if (mainService.getServiceName() === 'estimateProjectService') {
					mainService = mainService.parentService();
				}
				const options = [], promises = [];
				const identifications = [];
				let statusName = '';
				_.forEach(entities, function (entity) {
					const option = Object.create(config);//angular.copy(config);
					statusName = option.statusName;
					option.entity = entity;
					// not clear why set as: projectField: 'UnitFk' in objectMainSidebarWizardService
					if (option.projectField && option.projectField !== 'UnitFk') {
						option.projectId = entity[option.projectField];
					} else if (angular.isFunction(option.getProjectIdFn)) {
						option.projectId = option.getProjectIdFn();
					}
					options.push(option);
					const identification = {Id: option.entity.Id,StatusField: option.statusField};
					if (option.pKey1Field) {
						identification.PKey1 = option.entity[option.pKey1Field];
					}
					if (option.pKey2Field) {
						identification.PKey2 = option.entity[option.pKey2Field];
					}
					identifications.push(identification);
				});
				getEntitiesCurrentStatusIds(options, statusName, identifications).then(function (results) {
					const grouped = _.groupBy(options, function (option) {
						return [option.projectId, option.fromStatusId].join(',');
					});
					const finallyGroupedKeys = [];
					_.forOwn(grouped, function (item, pKey) {
						finallyGroupedKeys.push(pKey);
					});
					let index = 0;
					const totalCount = finallyGroupedKeys.length;
					let currentCount = 0;
					const optionArr = [];
					const changeStatusOnce = function (firstTime, previousSelectedStatus, isOneGroup) {
						if (finallyGroupedKeys.length > index) {
							const groupedKey = finallyGroupedKeys[index++];
							const option = Object.create(config); //angular.copy(config);
							option.entities = _.map(grouped[groupedKey], 'entity');
							option.entity = option.entities[0];
							currentCount = index;
							option.headerText = $translate.instant(config.title);
							if (totalCount !== 0) {
								option.headerText += ' (' + currentCount + '/' + totalCount + ')';
							}
							option.imageSelector = 'platformStatusIconService';
							const groupKeyArray = _.split(groupedKey, ',');
							option.projectId = parseInt(groupKeyArray[0]);
							if (_.isNaN(option.projectId)) {
								option.projectId = null;
							}
							option.fromStatusId = option.toStatusId = parseInt(groupKeyArray[1]);
							if (previousSelectedStatus) {
								option.toStatusId = previousSelectedStatus;
							}
							option.isMultipleSelected = option.entities.length > 1;
							getStatusList(option).then(function (status) {
								const groupStutus = _.find(status, {Id: option.fromStatusId});
								if (groupStutus !== null && groupStutus !== undefined) {
									if (groupStutus.DescriptionInfo !== null && groupStutus.DescriptionInfo !== undefined) {
										option.fromStatusName = groupStutus.DescriptionInfo.Translated;
										if (option.fromStatusName === '') {
											option.fromStatusName = groupStutus.DescriptionInfo.Description;
										}
									} else {
										option.fromStatusName = groupStutus.Description;
									}
								}

								executeChangeStatusMultipleOnce(option, dataService, firstTime, isOneGroup).then(function (result) {
									if (result && result.results) {
										angular.forEach(result.results, function (item) {
											optionArr.push(item);
										});
									}
									changeStatusOnce(false, null, isOneGroup);// next group
								});

							});

						} else {// finished all
							let promise = $q.when(true);
							if (config.doValidationAndSaveBeforeChangeStatus) {

								let entitiesToChange = _.filter(entities, function (entity) {
									return _.some(optionArr, {EntityId: entity.Id});
								});

								let changedOptions = _.map(optionArr, function (opt) {
									return {
										entityId: opt.EntityId,
										fromStatusId: opt.FromStatusId,
										toStatusId: opt.ToStatusId
									};
								});

								promise = doAsyncValidationAndSaveBeforeChangeStatus(changedOptions, entitiesToChange, mainService, dataService);
								if (!promise) {
									return;
								}
							}

							promise.then(function (canChangeStataus) {
								if (!canChangeStataus) {
									return;
								}
								showMultipleResultDialog(optionArr, config, entities).then(function (result) {
									afterDoneAll(config, dataService, result, entities);
								});
							});
						}
					};
					changeStatusOnce(true, null, finallyGroupedKeys.length === 1);
				}, function (error) {
					platformModalService.showErrorBox(error, $translate.instant('basics.common.changeStatus.openFailedTitle'));
				});
			}

			function showMultipleDialog(options, firstTime) {
				const d = $q.defer();

				const defaultValue = {
					headerText: $translate.instant('basics.common.changeStatus.headerText'),
					keyboard: false,
					resizeable: true,
					codeField: 'Code',
					descField: 'Description',
					statusDisplayField: 'DescriptionInfo.Translated',
					onReturnButtonPress: function () {
					}
				};

				// if using the entity(for toStatusId), when change statusField,data in outside will change too!
				$.extend(defaultValue, options, {
					templateUrl: globals.appBaseUrl + 'basics.common/partials/change-status-multiple-dialog.html'
				});

				if (!options.entity || !Object.prototype.hasOwnProperty.call(options.entity, defaultValue.statusField)) {
					d.reject('Change status dialog: empty object or cannot find needed field');
				}

				$timeout(function () {
					platformModalService.showDialog(defaultValue).then(function (results) {
						d.resolve(results);
						changeStatusResults = [];
					}, function () {
						changeStatusResults = [];
					});
				}, firstTime ? 0 : 300, false);

				return d.promise;
			}

			function showMultipleResultDialog(items, config, allEntities) {
				const d = $q.defer();

				const defaultValue = {
					headerText: $translate.instant('basics.common.changeStatus.headerText'),
					keyboard: false,
					resizeable: true,
					codeField: 'Code',
					descField: 'Description',
					statusDisplayField: 'DescriptionInfo.Translated',
					items: items,
					config: config,
					allEntities: allEntities,
					onReturnButtonPress: function () {
					}
				};

				// if using the entity(for toStatusId), when change statusField,data in outside will change too!
				$.extend(defaultValue, {
					templateUrl: globals.appBaseUrl + 'basics.common/partials/change-status-multiple-report.html'
				});

				$timeout(function () {
					platformModalService.showDialog(defaultValue).then(function (results) {
						d.resolve(results);
						changeStatusResults = [];
					}, function () {
						changeStatusResults = [];
					});

				});

				return d.promise;
			}

			function changeMultipleStatus(config, dataItems) {
				const defer = $q.defer();
				let promise = $q.when(true);

				if(dataItems.length === 0){
					defer.resolve([]);
					return defer.promise;
				}

				if (angular.isFunction(config.HookExtensionOperation)) {
					promise = config.HookExtensionOperation(config, dataItems);
				}

				return promise.then(function (canChangeStataus) {
					if (!canChangeStataus) {
						return[];
					}
					return $http.post(globals.webApiBaseUrl + 'basics/common/status/changemultiplestatus', {
						StatusName: config.statusName,
						Remark: config.remark,
						DataItems: dataItems
					}).then(function (res) {
						if (res.data && res.data.length) {
							return res.data.map(function (item) {
								return {
									changed: item.Result,
									ErrorMsg: item.ErrorMsg,
									executed: item.Result,
									entity: item.Entity,
									entityId: item.EntityId,
									hasConfiguredWorkflows: item.HasConfiguredWorkflows
								};
							});
						}

						return [];
					});
				});
			}

			function loadSettingData(key) {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/common/status/loadSetting',
					params: {key: key}
				}).then(function (result) {
					return result;
				});
			}

			function saveSettingData(key, status) {
				return $http.post(globals.webApiBaseUrl + 'basics/common/status/saveSetting', {
					key: key,
					status: status
				}).then(function (response) {
					return response;
				});
			}

			function doAsyncValidationAndSaveBeforeChangeStatus(options, entities, mainService, dataService) {
				let defer = $q.defer();
				if (!options || !angular.isArray(entities) || entities.length === 0) {
					defer.resolve(false);
					return defer.promise;
				}
				var validationService = platformValidationByDataService.getValidationServiceByDataService(dataService);

				if (!validationService) {
					defer.resolve(true);
					return defer.promise;
				}

				_.forEach(entities, function (entity){
					let toStatusId = null;
					if (angular.isArray(options)) {
						let changeOption = _.find(options, function (option) {
							if (!option) {
								return false;
							}
							return option.entityId === entity.Id;
						});

						if (changeOption) {
							toStatusId = changeOption.toStatusId;
						}
					} else if (angular.isObject(options)) {
						toStatusId = options.toStatusId;
					}

					if (!angular.isNumber(toStatusId)) {
						return;
					}
					validationService.validateCertificateStatusFk(entity, toStatusId);
					dataService.markItemAsModified(entity);
				});
				mainService.update()
					.then(function (response) {
						if(!response){
							removeValidation(entities, dataService);
						}
						defer.resolve(response);
					})
					.catch(function () {
						defer.resolve(false);
					});

				return defer.promise;
			}

			function removeValidation(entities, dataService){
				var modState = platformModuleStateService.state(dataService.getModule());
				if(!_.isNil(modState)){
					modState.validation.issues = null;
				}
				_.forEach(entities, function (entity){
					entity.__rt$data.errors = null;
					dataService.markItemAsModified(entity);
				});
			}

			return {
				'provideStatusChangeInstance': provideStatusChangeInstance,
				'showDialog': showDialog,
				'changeStatus': changeStatus,
				'getStatusList': getStatusList,
				'getAvailableStatus': getAvailableStatus,
				'getDefaultStatus': getDefaultStatus,
				'getStatusHistory': getStatusHistory,
				'getChangeStatusResults': getChangeStatusResults,
				'setChangeStatusResults': setChangeStatusResults,
				'getAllStatusList': getAllStatusList,
				'afterDoneAll': afterDoneAll,
				'getAvailableStatusItems': getAvailableStatusItems,
				'changeMultipleStatus': changeMultipleStatus,
				'loadSettingData': loadSettingData,
				'saveSettingData': saveSettingData,
				'onStatusChanged': new PlatformMessenger(),
				'onStatusChangedDone': onStatusChangedDone,
				'getAllProjectAlternatives': getAllProjectAlternatives
			};
		}]);
})(angular);
