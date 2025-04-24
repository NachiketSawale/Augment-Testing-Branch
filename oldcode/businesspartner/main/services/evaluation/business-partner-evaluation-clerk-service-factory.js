/**
 * Created by chi on 5/8/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainEvaluationClerkServiceFactory', businessPartnerMainEvaluationClerkServiceFactory);

	businessPartnerMainEvaluationClerkServiceFactory.$inject = [
		'_',
		'$q',
		'$http',
		'$translate',
		'globals',
		'ServiceDataProcessDatesExtension',
		'platformDataServiceFactory',
		'commonBusinessPartnerEvaluationServiceCache',
		'basicsLookupdataLookupDescriptorService',
		'businessPartnerMainEvaluationClerkType',
		'PlatformMessenger',
		'businessPartnerMainEvaluationModificationService',
		'businessPartnerMainEvaluationClerkCopyPasteService',
		'platformRuntimeDataService',
		'platformDataValidationService',
	];

	function businessPartnerMainEvaluationClerkServiceFactory(
		_,
		$q,
		$http,
		$translate,
		globals,
		ServiceDataProcessDatesExtension,
		platformDataServiceFactory,
		commonBusinessPartnerEvaluationServiceCache,
		basicsLookupdataLookupDescriptorService,
		businessPartnerMainEvaluationClerkType,
		PlatformMessenger,
		businessPartnerMainEvaluationModificationService,
		businessPartnerMainEvaluationClerkCopyPasteService,
		platformRuntimeDataService,
		platformDataValidationService
	) {

		return {
			createService: createService
		};

		// //////////////////////////////////////////
		function createService(serviceDescriptor, evaluationService, parentService, qualifier, evalClerkType, options) {

			if (!evalClerkType) {
				throw new Error('evalClerkType is required.');
			}

			var itemName = null;
			if (options) {
				itemName = options.itemName || itemName;
			}

			if (!itemName) {
				throw new Error('itemName is required.');
			}

			var serviceType = null;
			if (evalClerkType === businessPartnerMainEvaluationClerkType.EVAL) {
				serviceType = commonBusinessPartnerEvaluationServiceCache.serviceTypes.EVALUATION_CLERK_DATA;
			} else if (evalClerkType === businessPartnerMainEvaluationClerkType.GROUP) {
				serviceType = commonBusinessPartnerEvaluationServiceCache.serviceTypes.EVALUATION_GROUP_CLERK_DATA;
			} else {
				serviceType = commonBusinessPartnerEvaluationServiceCache.serviceTypes.EVALUATION_SUBGROUP_CLERK_DATA;
			}

			if (commonBusinessPartnerEvaluationServiceCache.hasService(serviceType, serviceDescriptor)) {
				return commonBusinessPartnerEvaluationServiceCache.getService(serviceType, serviceDescriptor);
			}

			var hasWrite = true;
			var currentEvaluationSchemaId = null;

			// there is a case that when the form is updated, the controller is created a new one again, but the old ones are not destroyed.
			// If the messengers are registered for many times, it will cause some unbelievable issues. There is no a better way to destroy the grid controller.
			// Workaround: when creating the new controller, the old controllers should unregister the messengers.
			var currentClerkScope = null;
			var currentEmptyScope = null;

			var defaultOptions = angular.merge({
				moduleName: moduleName,
				route: globals.webApiBaseUrl + 'businesspartner/main/evaluationclerk/',
				endRead: 'listclerk',
				endCreate: 'createclerk',
				canLoad: function () {
					return true;
				}
			}, options);

			var serviceOptions = {
				flatLeafItem: {
					module: angular.module((defaultOptions.moduleName)),
					serviceName: commonBusinessPartnerEvaluationServiceCache.getServiceName(serviceType, serviceDescriptor),
					httpRead: {
						route: defaultOptions.route,
						endRead: defaultOptions.endRead,
						usePostForRead: true,
						initReadData: initReadData
					},
					httpCreate: {
						route: defaultOptions.route,
						endCreate: defaultOptions.endCreate
					},
					presenter: {
						list: {
							initCreationData: initCreationData,
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						leaf: {
							itemName: itemName,
							parentService: parentService
						}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo']), readonlyProcessor()],
					actions: {
						create: 'flat',
						delete: {}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = serviceContainer.service;
			var data = serviceContainer.data;
			service.clearAllData = clearAllData;
			service.permissionUpdated = new PlatformMessenger();
			service.evaluationSchemaChanged = new PlatformMessenger();
			service.loadSubEntities = function () {
			};
			service.setNewClerkScope = setNewClerkScope;
			service.setNewEmptyScope = setNewEmptyScope;
			if (parentService.permissionUpdated) {
				parentService.permissionUpdated.register(onPermissionUpdated);
			}
			parentService.evalClerkValidationMessenger.register(onClerkValidationHandler);
			parentService.evalClerkValidationErrorMessenger.register(onClerkValidationErrorHandler);
			evaluationService.evaluationSchemaChangedMessenger.register(onEvaluationSchemaChangedHandler);
			parentService.clearEntityErrors.register(onClearEntityErrors);

			Object.defineProperties(service, {
				'hasWrite': {
					get: function () {
						return hasWrite;
					},
					set: function (value) {
						hasWrite = value;
					},
					enumerable: true
				}
			});

			businessPartnerMainEvaluationModificationService.initialize(service, data, {
				parentService: parentService,
				getRootModifiedDataCache: evaluationService.getModifiedDataCache,
				markItemAsModified: true,
				addEntitiesToDeleted: true,
				doClearModifications: true,
				canMarkParentAsModified: function (item) {
					return item.Version === 0;
				}
			});

			businessPartnerMainEvaluationClerkCopyPasteService.initialize(service, {
				paste: paste,
				canCopy: canCopy
			});

			commonBusinessPartnerEvaluationServiceCache.setService(serviceType, serviceDescriptor, service);

			return service;

			// ////////////////////////
			function initReadData(readData) {
				var requestData = getRequestData();
				angular.extend(readData, {
					Qualifier: requestData.qualifier,
					MainItemId: requestData.mainItemId
				});
			}

			function initCreationData(creationData) {
				var requestData = getRequestData();
				creationData.Qualifier = requestData.qualifier;
				creationData.MainItemId = requestData.mainItemId;
			}

			function incorporateDataRead(readItems, data) {
				var dataRead = null;
				readItems = readItems || {};
				var readData = readItems || [];
				if (readItems && Object.prototype.hasOwnProperty.call(readItems, 'dtos')) {
					readData = readItems.dtos || [];
				}
				var localEvaluationData = null;
				var parentItemName = parentService.getItemName() + 'ToSave';
				if (evaluationService.view && evaluationService.view.getDataFromLocal) {
					localEvaluationData = evaluationService.collectLocalEvaluationDataScreen.fire();
					if (localEvaluationData) {
						var parentDataToSave = data.getModifiedDataByItemName(localEvaluationData, parentService, parentItemName, 'ToSave');
						if (!angular.isArray(parentDataToSave) && angular.isObject(parentDataToSave)) {
							mergeReadDataWithModifiedData(readData, parentDataToSave);
						} else if (angular.isArray(parentDataToSave) && parentDataToSave.length > 0) {
							var parentItem = parentService.getSelected();
							if (parentItem) {
								var toSave = _.find(parentDataToSave, {MainItemId: parentItem.Id});
								mergeReadDataWithModifiedData(readData, toSave);
							}
						}
					}
				}

				dataRead = data.handleReadSucceeded(readData || [], data);
				return dataRead;
			}

			function clearAllData() {
				data.currentParentItem = null;
				data.itemList.length = 0;
				service.deselect();
				data.cache = {};
			}

			function mergeData(source, target) {
				var temp = target;
				target = source;
				target.InsertedAt = temp.InsertedAt;
				target.InsertedBy = temp.InsertedBy;
				target.UpdatedAt = temp.UpdatedAt;
				target.UpdatedBy = temp.UpdatedBy;
				target.Version = temp.Version;
				return target;
			}

			function mergeReadDataWithModifiedData(readData, parentModifiedDataToSave) {
				readData = readData || [];
				var currentItemName = service.getItemName();
				var curToSavePropName = currentItemName + 'ToSave';
				var curToDeletePropName = currentItemName + 'ToDelete';

				if (readData.length > 0 &&
					(angular.isArray(parentModifiedDataToSave[curToDeletePropName]) && parentModifiedDataToSave[curToDeletePropName].length > 0)) {

					var idsToDelete = _.map(parentModifiedDataToSave[curToDeletePropName], function (deleteItem) {
						return deleteItem.Id;
					});
					_.remove(readData, function (mainItem) {
						var pos = _.indexOf(idsToDelete, mainItem.Id);
						return pos > -1;
					});
				}

				if (angular.isArray(parentModifiedDataToSave[curToSavePropName]) && parentModifiedDataToSave[curToSavePropName].length > 0) {
					var toSave = parentModifiedDataToSave[curToSavePropName];

					_.forEach(toSave, function (source) {
						var target = _.find(readData, {Id: source.Id});
						if (target) {
							mergeData(source, target);
						} else {
							readData.push(source);
						}
					});
				}
			}

			function getRequestData() {
				var mainItemId = 0;
				var parentItem = parentService.getSelected();
				var qualifierTemp = qualifier;
				if (parentItem) {
					mainItemId = parentItem.Id;
					if (parentItem.IsEvaluationSubGroupData) {
						mainItemId = parentItem.Id * -1;
						qualifierTemp = 'businesspartner.main.evalsubgroupdata.clerk';
					}
				}
				return {
					qualifier: qualifierTemp,
					mainItemId: mainItemId
				};
			}

			function onPermissionUpdated(e, selected) {
				if (selected && selected.IsEvaluationSubGroupData && evalClerkType === businessPartnerMainEvaluationClerkType.GROUP) {
					service.permissionUpdated.fire(null, {
						clerkType: businessPartnerMainEvaluationClerkType.SUBGROUP
					});
				} else {
					service.permissionUpdated.fire(null, {
						clerkType: evalClerkType
					});
				}
			}

			function paste(toCopied) {
				var requestData = getRequestData();
				var copyRequest = {
					Qualifier: requestData.qualifier,
					MainItemId: requestData.mainItemId,
					ListToCopied: toCopied
				};
				return $http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluationclerk/copy', copyRequest)
					.then(function (response) {
						if (!response || !angular.isArray(response.data) || response.data.length === 0) {
							return null;
						}
						var newList = response.data;
						var promises = [];
						_.forEach(newList, function (newItem) {
							var promise = serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data, copyRequest);
							promises.push(promise);
						});
						$q.all(promises).finally(function () {
							return newList;
						});
					});
			}

			function canCopy() {
				var canCopy = true;
				var selectedEntities = service.getSelectedEntities();
				if (angular.isArray(selectedEntities) && selectedEntities.length > 0) {
					for (var i = 0; i < selectedEntities.length; ++i) {
						var selected = selectedEntities[i];
						canCopy &= selected.ClerkRoleFk && selected.ClerkFk;
						if (!canCopy) {
							break;
						}
					}
				} else {
					canCopy = false;
				}
				return canCopy;
			}

			function onClerkValidationHandler() {
				var result = true;
				var list = serviceContainer.service.getList();
				if (Array.isArray(list) && list.length > 0) {
					result = !hasError(list);
				}

				if (result) {
					var parentItem = parentService.getSelected();
					var parentItemId = parentItem ? parentItem.Id : null;
					var cache = data.cache;
					if (cache) {
						for (var prop in cache) {
							if (Object.prototype.hasOwnProperty.call(cache, prop)) {
								if (parentItemId && parentItem === prop) {
									continue;
								}
								result = !hasError(cache[prop].loadedItems);
							}
						}
					}
				}
				return result;
			}

			function onClerkValidationErrorHandler() {
				var list = serviceContainer.service.getList();
				var errorString = getErrors(list, '');

				var parentItem = parentService.getSelected();
				var parentItemId = parentItem ? parentItem.Id : null;
				var cache = data.cache;
				if (cache) {
					for (var prop in cache) {
						if (Object.prototype.hasOwnProperty.call(cache, prop)) {
							if (parentItemId && parentItem === prop) {
								continue;
							}
							errorString = getErrors(cache[prop].loadedItems, errorString);
						}
					}
				}

				return errorString;
			}

			function hasError(list) {
				var hasError = false;
				_.forEach(list, function (item) {
					if (item.__rt$data && item.__rt$data.errors) {
						for (var property in item.__rt$data.errors) {
							if (Object.prototype.hasOwnProperty.call(item.__rt$data.errors, property) && item.__rt$data.errors[property]) {
								hasError = true;
								break;
							}
						}
					}
				});
				return hasError;
			}

			function getErrors(list, errorString) {
				_.forEach(list, function (item) {
					var errors = item.__rt$data ? item.__rt$data.errors : null;
					if (errors) {
						for (var property in errors) {
							if (Object.prototype.hasOwnProperty.call(errors, property) && errors[property]) {
								if (errorString && errorString.trim() !== '') {
									errorString += '; ' + $translate.instant(errors[property].error);
								} else {
									errorString += $translate.instant(errors[property].error);
								}
							}
						}
					}
				});
				return errorString;
			}

			function onEvaluationSchemaChangedHandler(e, evaluationSchemaId) {
				if (currentEvaluationSchemaId === evaluationSchemaId) {
					return;
				}
				currentEvaluationSchemaId = evaluationSchemaId;
				clearAllData();
				service.evaluationSchemaChanged.fire(null, {
					clerkType: businessPartnerMainEvaluationClerkType.EVAL
				});
			}

			function readonlyProcessor() {
				return {
					processItem: function processItem(item) {
						platformRuntimeDataService.readonly(item, !hasWrite);
					}
				};
			}

			function onClearEntityErrors() {
				var list = serviceContainer.service.getList();
				removeFromErrorList(list);

				var parentItem = parentService.getSelected();
				var parentItemId = parentItem ? parentItem.Id : null;
				var cache = data.cache;
				for (var prop in cache) {
					if (Object.prototype.hasOwnProperty.call(cache, prop)) {
						removeFromErrorList(cache[prop].deletedItems);
						if (parentItemId && parentItem === prop) {
							continue;
						}
						removeFromErrorList(cache[prop].loadedItems);
					}
				}
			}

			function removeFromErrorList(list) {
				var validationFields = ['ClerkRoleFk', 'ClerkFk', 'ContextFk', 'ValidFrom', 'ValidTo'];
				_.forEach(list, function (entity) {
					_.forEach(validationFields, function (model) {
						platformDataValidationService.removeFromErrorList(entity, model, {}, serviceContainer.service);
					});
				});
			}

			function setNewClerkScope(newScope) {
				if (newScope && currentClerkScope) {
					currentClerkScope.unregisterMessengers();
				}
				currentClerkScope = newScope;
			}

			function setNewEmptyScope(newScope) {
				if (newScope && currentEmptyScope) {
					currentEmptyScope.unregisterMessengers();
				}
				currentEmptyScope = newScope;
			}
		}
	}

})(angular);