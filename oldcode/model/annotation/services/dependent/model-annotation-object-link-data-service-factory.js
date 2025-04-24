/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationObjectLinkDataServiceFactory';

	myModule.factory(svcName, modelAnnotationObjectLinkDataServiceFactory);

	modelAnnotationObjectLinkDataServiceFactory.$inject = ['platformDataServiceFactory',
		'modelAnnotationDataService', 'platformRuntimeDataService', '_',
		'modelProjectPinnableEntityService', 'modelAnnotationDataServiceFactoryHelperService',
		'$http', '$q', 'modelViewerToggleObjectSelectionHelperService'];

	function modelAnnotationObjectLinkDataServiceFactory(platformDataServiceFactory,
		modelAnnotationDataService, platformRuntimeDataService, _,
		modelProjectPinnableEntityService, modelAnnotationDataServiceFactoryHelperService,
		$http, $q, modelViewerToggleObjectSelectionHelperService) {

		function createService(config) {
			const actualConfig = modelAnnotationDataServiceFactoryHelperService.normalizeConfig(config);

			function generateGlobalId(item) {
				item.globalId = _.isString(item.TemporaryId) ? item.TemporaryId : (item.LinkKind + item.Id);
			}

			function updateStateByKind(item) {
				const linksToObject = item.LinkKind === 'o';
				const linksToObjectSet = item.LinkKind === 's';

				platformRuntimeDataService.readonly(item, [{
					field: 'ProjectFk',
					readonly: !linksToObjectSet
				}, {
					field: 'ModelFk',
					readonly: !linksToObject
				}, {
					field: 'ObjectSetFk',
					readonly: !linksToObjectSet
				}, {
					field: 'ObjectFk',
					readonly: !linksToObject
				}]);
			}

			function supplyContextInfo(item) {
				var selParent = actualConfig.parentService.getSelected();
				if (selParent) {
					item.ContextProjectId = actualConfig.getProjectIdFromParent(selParent);
				}
				if (!_.isInteger(item.ContextModelId) || (item.ContextModelId <= 0)) {
					item.ContextModelId = modelProjectPinnableEntityService.getPinned();
				}
			}

			const self = {};
			const serviceOptions = {
				flatLeafItem: {
					module: actualConfig.getModule(),
					serviceName: actualConfig.serviceName,
					entityNameTranslationID: 'model.annotation.annotationObjectLinkEntityName',
					dataProcessor: [{
						processItem: generateGlobalId
					}, {
						processItem: updateStateByKind
					}, {
						processItem: supplyContextInfo
					}],
					actions: {
						delete: true,
						create: 'flat'
					},
					presenter: {
						list: {
							handleCreateSucceeded: function (newItem) {
								generateGlobalId(newItem);
								updateStateByKind(newItem);
								supplyContextInfo(newItem);
								newItem.ContextModelId = modelProjectPinnableEntityService.getPinned();
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'ModelAnnotationObjectLinks',
							parentService: actualConfig.parentService
						}
					}
				}
			};

			actualConfig.createHttpCrudSettings('objlink', serviceOptions.flatLeafItem);

			const serviceContainer = platformDataServiceFactory.createService(serviceOptions, self);

			self.addCustomCreatedItem = function (item) {
				return serviceContainer.data.onCreateSucceeded(item, serviceContainer.data);
			};

			self.initializeCreationData = function (creationData) {
				return actualConfig.initializeCreationData(creationData, 'AnnotationId');
			};

			serviceContainer.service.getParentDataService = () => actualConfig.parentService;

			serviceContainer.service.createObjectLinks = function (contextModelId, objectIds) {
				const request = {
					ModelId: contextModelId,
					ObjectIds: objectIds.useGlobalModelIds().toCompressedString()
				};

				if (actualConfig.initializeCreationData(request, 'AnnotationId')) {
					return $http.post(globals.webApiBaseUrl + 'model/annotation/objlink/createmany', request).then(function response() {
					}, function () {});
				}

				return $q.reject();
			};

			serviceContainer.service.retrieveModelObjectIds = function (info) {
				return $http.get(globals.webApiBaseUrl + 'model/annotation/objlink/idsbylinks', {
					params: {
						objectLinkIds: _.join(_.map(_.filter(info.items, l => l.LinkKind === 'o'), l => l.Id), ':'),
						objectSetLinkIds: _.join(_.map(_.filter(info.items, l => l.LinkKind === 's'), l => l.Id), ':'),
						modelId: info.modelId
					}
				}).then(r => r.data);
			};

			serviceContainer.service.createModelFilterSettings = function () {
				return {
					serviceName: actualConfig.serviceName
				};
			};

			modelViewerToggleObjectSelectionHelperService.initializeObservable({
				dataService: serviceContainer.service,
				titleKey: 'model.annotation.selectObjects'
			});

			return serviceContainer.service;
		}

		return {
			createService: createService
		};
	}
})(angular);
