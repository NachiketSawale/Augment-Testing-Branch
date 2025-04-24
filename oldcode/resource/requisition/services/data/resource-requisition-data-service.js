(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceRequisitionDataService resourceRequisitionDataService
	 * @function
	 *
	 * @description
	 * resourceRequisitionDataService is the data service for all requisition related functionality.
	 */
	var moduleName = 'resource.requisition';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceRequisitionDataService', ['_', '$http','platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'platformRuntimeDataService', 'resourceRequisitionModifyProcessor', 'resourceTypeLookupDataService', 'cloudDesktopSidebarService', 'resourceRequisitionConstantValues', 'platformGenericStructureService', 'resourceRequisitionReadOnlyProcessor', 'platformPermissionService','permissions',
		function (_, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, mandatoryProcessor,
			platformRuntimeDataService, resourceRequisitionModifyProcessor, resourceTypeLookupDataService, cloudDesktopSidebarService, resourceRequisitionConstantValues, platformGenericStructureService, resourceRequisitionReadOnlyProcessor, platformPermissionService, permissions) {

			var factoryOptions = {
				flatRootItem: {
					module: resourceModule,
					serviceName: 'resourceRequisitionDataService',
					entityNameTranslationID: 'resource.requisition.entityRequisition',
					entityInformation: { module: 'Resource.Requisition', entity: 'Requisition', specialTreatmentService: null },
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/requisition/',
						endRead: 'filtered',
						extendSearchFilter: function extendSearchFilter(filterRequest) {
							var groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
							if (groupingFilter) {
								filterRequest.groupingFilter = groupingFilter;
							}
						},
						endDelete: 'deleterequisition',
						usePostForRead: true
					},
					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						root: {
							itemName: 'Requisitions',
							moduleName: 'cloud.desktop.moduleDisplayNameResourceRequisition',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							useIdentification: true
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
							showProjectContext: true,
							pinningOptions: {
								isActive: true,
								showPinningContext: [{token: 'project.main', show: true}, {
									token: 'resource.requisition',
									show: true
								}],
								setContextCallback: function (prjService) {
									cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'ProjectFk');
								}
							},
							withExecutionHints: true
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'RequisitionDto',
						moduleSubModule: 'Resource.Requisition'
					}), {processItem: processItem}, resourceRequisitionModifyProcessor, resourceRequisitionReadOnlyProcessor]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			var service = serviceContainer.service;


			serviceContainer.service.canDelete = function () {
				let currentItem = serviceContainer.service.getSelected();
				return currentItem !== null && currentItem.ReservedFrom === null && currentItem.ReservedTo === null && currentItem.IsReadOnlyStatus === false;
			};

			// setting readonly child container when status is IsReadOnlyStatus

			service.registerSelectionChanged(function (e, entity) {
				if (entity) {
					service.setReadOnly(entity);
				}
			});

			service.setReadOnly = function setReadOnly(entity) {
				if (entity.IsReadOnlyStatus) {
					platformPermissionService.restrict(
						[
							resourceRequisitionConstantValues.uuid.container.requisitionDetail,
							resourceRequisitionConstantValues.uuid.container.requiredSkillList,
							resourceRequisitionConstantValues.uuid.container.requiredSkillDetail,
							resourceRequisitionConstantValues.uuid.container.requisitionDocumentList,
							resourceRequisitionConstantValues.uuid.container.requisitionDocumentDetails,
							resourceRequisitionConstantValues.uuid.container.requisitionItemList,
							resourceRequisitionConstantValues.uuid.container.requisitionItemDetails,
							resourceRequisitionConstantValues.uuid.container.stockList,
							resourceRequisitionConstantValues.uuid.container.stockDetail,
							resourceRequisitionConstantValues.uuid.container.userForm
						],
						permissions.read);
				} else {
					platformPermissionService.restrict(
						[
							resourceRequisitionConstantValues.uuid.container.requisitionDetail,
							resourceRequisitionConstantValues.uuid.container.requiredSkillList,
							resourceRequisitionConstantValues.uuid.container.requiredSkillDetail,
							resourceRequisitionConstantValues.uuid.container.requisitionDocumentList,
							resourceRequisitionConstantValues.uuid.container.requisitionDocumentDetails,
							resourceRequisitionConstantValues.uuid.container.requisitionItemList,
							resourceRequisitionConstantValues.uuid.container.requisitionItemDetails,
							resourceRequisitionConstantValues.uuid.container.stockList,
							resourceRequisitionConstantValues.uuid.container.stockDetail,
							resourceRequisitionConstantValues.uuid.container.userForm
						]);
				}
			};

			function processItem (item) {
				var options = [
					{
						field: 'Islinkedfixtoreservation',
						readonly: item.Version !== 0
					},
					{
						field: 'ProjectFk',
						readonly: item.Version !== 0
					},
					{
						field: 'DispatcherGroupFk',
						readonly: true
					},
					{
						field: 'UomFk',
						readonly: item.MaterialFk !== null
					},
					{
						field: 'JobSiteFk',
						readonly: true
					},
					{
						field: 'PreferredResourceSiteFk',
						readonly: true
					},
					{
						field: 'MaterialFk',
						readonly: item.TypeFk !== null
					},
					{
						field: 'TypeFk',
						readonly: item.MaterialFk !== null
					},
					{
						field: 'ResourceFk',
						readonly: item.MaterialFk !== null
					}
				];
				if (item.Version >= 1) {
					options.push({field: 'RequisitionTypeFk',readonly: true});
				}


				switch (item.RequisitionTypeFk) {
					case resourceRequisitionConstantValues.requisitionType.resourceRequisition:
						options.push(
							{ field: 'MaterialFk', readonly: true },
							{ field: 'StockFk', readonly: true }
						);
						break;

					case resourceRequisitionConstantValues.requisitionType.materialRequisition:
						options.push(
							{ field: 'TypeFk', readonly: true },
							{ field: 'ResourceFk', readonly: true }
						);
						break;

					default:
						break;
				}

				serviceContainer.service.fireItemModified(item);
				platformRuntimeDataService.readonly(item, options);
			}

			serviceContainer.service.ReadOnlyProcessItem = processItem;

			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'RequisitionDto',
				moduleSubModule: 'Resource.Requisition',
				validationService: 'resourceRequisitionValidationService',
				mustValidateFields: true
			});

			service.loadRequisition = function () {
				return service.load().then(function loadRequisition() {
					delete service.from;
					delete service.to;
				});
			};

			service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
				if (_.isString(triggerField)) {
					cloudDesktopSidebarService.filterSearchFromPKeys([item[triggerField]]);
				} else  {
					service.load();
				}
			};

			service.createDeepCopy = function createDeepCopy() {
				var command = {
					Action: 4,
					ResourceRequisitions:   [service.getSelected()]
				};

				$http.post(globals.webApiBaseUrl + 'resource/requisition/execute', command)
					.then(function (response) {
						serviceContainer.data.handleOnCreateSucceeded(response.data.Requisitions[0], serviceContainer.data);
					},
					function (/* error */) {
					});
			};

			service.takeOverFromMaterialReservation =  function takeOverFromMaterialReservation (response) {

				_.forEach(response.data, function (savedRequisition) {
					var viewRequisition = serviceContainer.service.getItemById(savedRequisition.Id);

					viewRequisition.UpdatedAt = savedRequisition.UpdatedAt;
					viewRequisition.UpdatedBy = savedRequisition.UpdatedBy;
					viewRequisition.InsertedAt = savedRequisition.InsertedAt;
					viewRequisition.InsertedBy = savedRequisition.InsertedBy;
					viewRequisition.Version = savedRequisition.Version;
					viewRequisition.RequisitionStatusFk = savedRequisition.RequisitionStatusFk;
					viewRequisition.ReservationId = savedRequisition.ReservationId;

					service.fireItemModified(viewRequisition);

				});
			};

			return service;
		}]);
})(angular);
