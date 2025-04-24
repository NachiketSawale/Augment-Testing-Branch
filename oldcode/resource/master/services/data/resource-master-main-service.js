(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceMasterMainService
	 * @function
	 *
	 * @description
	 * resourceMasterMainService is the data service for all Resource related functionality.
	 */
	var moduleName = 'resource.master';
	var masterModule = angular.module(moduleName);

	masterModule.factory('resourceMasterMainService', ResourceMasterMainService);

	ResourceMasterMainService.$inject = ['$http', '$injector', 'platformDataServiceFactory',
		'resourceMasterProcessor', 'basicsCommonMandatoryProcessor', 'resourceMasterContextService', 'platformDataServiceProcessDatesBySchemeExtension','platformGenericStructureService', 'cloudDesktopSidebarService'];

	function ResourceMasterMainService($http, $injector, platformDataServiceFactory,
	                                   resourceMasterProcessor, basicsCommonMandatoryProcessor, moduleContext,
	                                   platformDataServiceProcessDatesBySchemeExtension, platformGenericStructureService, cloudDesktopSidebarService) {

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{
				typeName: 'ResourceDto',
				moduleSubModule: 'Resource.Master'
			}
		);

		$injector.get('resourceMasterLookupService').getResourceMasterGroupTree().then(function () {
			$injector.get('resourceMasterGroupImageProcessor').setGroupIcons();
		});
		var kindImageProcessor = $injector.get('resourceMasterKindImageProcessor');
		kindImageProcessor.initKindIcons();

		var serviceOption = {
			flatRootItem: {
				module: masterModule,
				serviceName: 'resourceMasterMainService',
				entityNameTranslationID: 'resource.master.entityResource',
				entityInformation: {module: 'Resource.Master', entity: 'Resource', specialTreatmentService: null},
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/master/resource/',
					endRead: 'filtered',
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						var groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
						if (groupingFilter) {
							filterRequest.groupingFilter = groupingFilter;
						}
					},
					usePostForRead: true,
					endDelete: 'deletetrans'
				},
				entityRole: {
					root: {
						itemName: 'ResourceDtos',
						moduleName: 'cloud.desktop.moduleDisplayNameResourceMaster',
						descField: 'DescriptionInfo.Translated',
						useIdentification: true
					}
				},
				dataProcessor: [resourceMasterProcessor, dateProcessor],
				presenter: {
					list: {}
				},
				translation: {
					uid: 'resourceMasterMainService',
					title: 'resource.master.resourceMasterTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'ResourceDto',
						moduleSubModule: 'Resource.Master'
					}
				},
				entitySelection: {supportsMultiSelection: true},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'ResourceDto',
			moduleSubModule: 'Resource.Master',
			validationService: 'resourceMasterValidationService',
			mustValidateFields: true
		});

		serviceContainer.service.SetRateReadOnly = function (entity, set) {
			entity.IsRateReadOnly = set;
			resourceMasterProcessor.processItem(entity);
			serviceContainer.service.fireItemModified(entity);
		};

		serviceContainer.service.SetSelectedRateReadOnly = function (set) {
			serviceContainer.service.SetRateReadOnly(serviceContainer.service.getSelected(), set);
		};

		serviceContainer.service.selectionChanged = function selectionChanged() {
			var currentItem = service.getSelected();
			if (currentItem && currentItem.Id) {
				moduleContext.setModuleStatus(service.getModuleState(currentItem));
			} else {
				moduleContext.setModuleStatus({IsReadonly: true});
			}
		};
		serviceContainer.service.registerSelectionChanged(serviceContainer.service.selectionChanged);

		/**
		 * get module state
		 * @param item target item, default to current selected item
		 * @returns IsReadonly {Isreadonly:true|false}
		 */
		serviceContainer.service.getModuleState = function getModuleState(item) {
			var state, resKind, resKinds, parentItem = item || service.getSelected();
			resKinds = kindImageProcessor.getKindItems();
			if (parentItem && parentItem.Id && parentItem.KindFk) {
				resKind = _.find(resKinds, {Id: parentItem.KindFk});
				state = {IsReadonly: !resKind.Ispoolresource};
			} else {
				state = {IsReadonly: true};
			}
			return state;
		};

		var service = serviceContainer.service;
		service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
			if (triggerField === 'Id') {
				service.load();
			} else if (triggerField === 'Ids' && item.FromGoToBtn && _.isString(item.Ids)) {
				const ids = item.Ids.split(',');
				cloudDesktopSidebarService.filterSearchFromPKeys(ids);
			} else if (triggerField === 'Code') {
				const loadPromise = service.load();
				if (_.isObject(item)) {
					loadPromise.then(function () {
						service.setSelected(item);
					});
				} else if (_.isString(item)) {
					loadPromise.then(function (data) {
						const selected = _.find(data, {Code: item});
						service.setSelected(selected);
					});
				}
			} else if (triggerField === 'ResourceFk') {
				service.load().then(function (data) {
					var selected = _.find(data, {Id: item.ResourceFk});
					if (!_.isNil(selected)) {
						service.setSelected(selected);
					}
				});
			}
		};

		service.createDeepCopy = function createDeepCopy() {
			var command = {
				Action: 4,
				Resources: [service.getSelected()]
			};

			$http.post(globals.webApiBaseUrl + 'resource/master/resource/execute', command)
				.then(function (response) {
					serviceContainer.data.handleOnCreateSucceeded(response.data.ResourceDtos[0], serviceContainer.data);
				},
				function (/* error */) {
				});
		};

		return service;
	}
})(angular);

