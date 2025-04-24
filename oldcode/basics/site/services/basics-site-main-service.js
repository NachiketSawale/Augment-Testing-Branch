(function (angular) {
	'use strict';
	/**
     * @ngdoc service
     * @name basicsSiteMainService
     * @function
     *
     * @description
     * basicsSiteMainService is the data service for all Site related functionality.
     */
	var moduleName = 'basics.site';
	var siteModule = angular.module(moduleName);
	siteModule.service('basicsSiteMainService', BasicsSiteMainService);

	BasicsSiteMainService.$inject = ['$http', '$translate', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		'basicsSiteImageProcessor', 'ServiceDataProcessArraysExtension',
		'platformDataServiceModificationTrackingExtension', 'platformDataServiceDataProcessorExtension',
		'basicsTreeDragDropService', 'basicsCommonMandatoryProcessor'];

	function BasicsSiteMainService($http, $translate, platformDataServiceFactory, basicsLookupdataLookupDescriptorService,
		basicsSiteImageProcessor, ServiceDataProcessArraysExtension,
		platformDataServiceModificationTrackingExtension, platformDataServiceDataProcessorExtension,
		basicsTreeDragDropService, basicsCommonMandatoryProcessor) {
		var lastCode = '';
		var serviceOption = {
			hierarchicalRootItem: {
				module: siteModule,
				serviceName: 'basicsSiteMainService',
				entityNameTranslationID: 'basics.site.entitySite',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/sitenew/',
					endRead: 'filtered', usePostForRead: true,
	                endDelete: 'multidelete'
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems']), basicsSiteImageProcessor],
				presenter: {
					tree: {
						parentProp: 'SiteFk', childProp: 'ChildItems',
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};
							return container.data.handleReadSucceeded(result, data);
						},
						handleCreateSucceeded: function () {
							lastCode = '';
						},
	                    initCreationData: function (creationData) {
		                    creationData.PKey1 = creationData.parentId;
	                    }
					}
				},
				entityRole: {
					root: {
						itemName: 'Site',
						moduleName: 'cloud.desktop.moduleDisplayNameSite',
						descField: 'DescriptionInfo.Translated'
					}
				},
				translation: {
					uid: 'basicsSiteMainService',
					title: 'basics.site.entitySite',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'SiteDto',
						moduleSubModule: 'Basics.Site'
					}
				},
				entitySelection: {supportsMultiSelection: true},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceOption);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'SiteDto',
			moduleSubModule: 'Basics.Site',
			validationService: 'basicsSiteValidationService',
			mustValidateFields: ['Code']
		});

		var service = container.service;

		angular.extend(service, {
			markItemAsModified: markItemAsModified
		});

		function markItemAsModified(entity) {
			if (entity.Version === 0) {

				if (angular.isUndefined(entity.Code) || entity.Code === '') {
					entity.Code = lastCode;
				} else {
					lastCode = entity.Code;
				}
			}
			platformDataServiceModificationTrackingExtension.markAsModified(container.service, entity, container.data);
		}

		service.searchByCalId = function (id) {
			// Load service if neccessary
			if (angular.isDefined(container.service.getList()) && _.isArray(container.service.getList()) && container.service.getList().length === 0) {
				container.service.load();
			}
			container.service.setSelected(container.service.getItemById(id));
		};

		service.createAccessRightDescriptorWithAccessMask = function (entity) {
			var translatedKey = $translate.instant('basics.customize.accessrightdescriptor');
			var dto = {
				DescriptorDesc: translatedKey + ' (' + entity.Code + ')',
				SortOrderPath: '/Site/Access Rights',
				AccessMask: 3855,
				ModuleName: 'Site'
			};

			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/customize/special/createaccessrightwithmask',
				data: dto
			}).then(function (result) {
				entity.AccessRightDescriptorFk = result.data.Id;
				service.markItemAsModified(entity);
				service.update();
				return result.data;
			});
		};

		service.deleteAccessRightDescriptorById = function (entity) {
			if (entity.AccessRightDescriptorFk && entity.AccessRightDescriptorFk !== -1) {
				var id2Delete = angular.copy(entity.AccessRightDescriptorFk);
				entity.AccessRightDescriptorFk = null;
				service.markItemAsModified(entity);
				service.update().then(function createAccessRightDescriptor() {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'basics/customize/special/deleteaccessrightbyid',
						params: {id: id2Delete}
					});
				});
			}
		};

		basicsTreeDragDropService.update(container);

		return service;
	}
})(angular);
