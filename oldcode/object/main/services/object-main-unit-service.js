(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectMainUnitService
	 * @function
	 *
	 * @description
	 * objectMainUnitService is the data service for all Unit related functionality.
	 */
	var moduleName= 'object.main';
	var objectMainModule = angular.module(moduleName);
	objectMainModule.factory('objectMainUnitService', ['$http', '$q', 'platformDataServiceFactory','objectProjectHeaderService','cloudDesktopPinningContextService',
				'basicsLookupdataLookupFilterService','objectMainUnitValidationProcessor','platformDataServiceProcessDatesBySchemeExtension','objectMainUnitReadonlyProcessor', 'objectMainConstantValues',
		function ($http, $q, platformDataServiceFactory, objectProjectHeaderService, cloudDesktopPinningContextService,
		          basicsLookupdataLookupFilterService, objectMainUnitValidationProcessor, platformDataServiceProcessDatesBySchemeExtension, objectMainUnitReadonlyProcessor, objectMainConstantValues) {

			var factoryOptions = {
				flatRootItem: {
					module: objectMainModule,
					serviceName: 'objectMainUnitService',
					entityNameTranslationID: 'object.main.entityObjectMainUnit',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/main/unit/', endRead: 'filtered', endDelete: 'multidelete', usePostForRead: true
					},
					actions: {delete: true, create: 'flat'},
					entitySelection: { supportsMultiSelection: true },
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'UnitDto', moduleSubModule: 'Object.Main'}), objectMainUnitReadonlyProcessor],
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var context = cloudDesktopPinningContextService.getPinningItem('object.main');
								if(!_.isNull(context) && !_.isUndefined(context)){
									if(context.id.Id !== undefined){
										creationData.PKey1 = context.id.Id;
									}else{
										creationData.PKey1 = context.id;
									}
								}
							}
						}
					},
					entityRole: {
						root: {
							itemName: 'Units',
							moduleName: 'cloud.desktop.moduleDisplayNameObjectMain',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							useIdentification: true,
							showProjectHeader: {
								getProject: function (entity) {
									return (entity && entity.Header) ? entity.Header.Project : serviceContainer.data.headerToNavigateTo ? serviceContainer.data.headerToNavigateTo.Project : null;
								},
								getHeaderEntity: function (entity) {
									return (entity && entity.Header) ? entity.Header : serviceContainer.data.headerToNavigateTo ? serviceContainer.data.headerToNavigateTo : null;
								},
								getHeaderOptions: function () {
									return {codeField: 'Code', descField: 'Description'};
								}
							},
							handleUpdateDone: handleUpdateDone
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							showOptions: true,
							showProjectContext: false,
							pinningOptions: {
								isActive: true,
								showPinningContext: [
									{token: 'project.main', show: true},
									{token: 'object.main', show: true}
								],
								setContextCallback: setCurrentPinningContext // may own context service
							},
							withExecutionHints: true
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			serviceContainer.data.newEntityValidator = objectMainUnitValidationProcessor;
			serviceContainer.data.headerToNavigateTo = null;

			var service = serviceContainer.service;
			service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
				if (triggerField === 'Id') {
					serviceContainer.data.headerToNavigateTo = item;
					setObjectHeaderToPinningContext(item).then(function() {
						service.load();
						serviceContainer.data.headerToNavigateTo = null;
					});
				}
			};

			function handleUpdateDone(updateData, response, data) {
				data.handleOnUpdateSucceeded(updateData, response, data, true);
				if (response.Unit2ObjUnitString !== null) {
					service.load();
				}
			}


			service.canCreate = function canCreate() {
				var context = cloudDesktopPinningContextService.getContext();
				var findPinning =_.findIndex(context, {'token': 'object.main'});

				return !!context && findPinning !== -1;
			};

			function setCurrentPinningContext(dataService) {
				var unit = dataService.getSelected();

				if(unit && unit.Header) {
					setObjectHeaderToPinningContext(unit.Header, dataService);
				}
			}

			service.createDeepCopy = function createDeepCopy() {
				var command = {
					Action: 4,
					Units: [ service.getSelected() ]
				};

				$http.post(globals.webApiBaseUrl + 'object/main/unit/execute', command)
					.then(function (response) {
							serviceContainer.data.handleOnCreateSucceeded(response.data.Units[0], serviceContainer.data);
						},
						function (/*error*/) {
						});
			};

			function setObjectHeaderToPinningContext(objHeader, dataService) {
				if (objHeader && angular.isNumber(objHeader.ProjectFk)) {
					return cloudDesktopPinningContextService.getProjectContextItem(objHeader.ProjectFk).then(function (pinningItem) {
						var pinningContext = [pinningItem];

						if (angular.isNumber(objHeader.Id)) {
							pinningContext.push(
								new cloudDesktopPinningContextService.PinningItem('object.main', objHeader.Id,
									cloudDesktopPinningContextService.concate2StringsWithDelimiter(objHeader.Code, objHeader.Description, ' - '))
							);
						}
						cloudDesktopPinningContextService.setContext(pinningContext, dataService);
						serviceContainer.data.showHeaderAfterSelectionChanged(null);

						return true;
					});
				}

				return $q.when(true);
			}

			function setObjectEntityRelatedFilters(lookupItem, value){
				return ( lookupItem.BusinessPartnerFk === value);
			}

			var objectEntityRelatedFilters = [
				{
					key: 'object-main-unit-bizpartner-01-filter',
					fn: function (item, object) {
						return (setObjectEntityRelatedFilters(item, object.BusinessPartner01Fk));
					}
				},
				{
					key: 'object-main-unit-bizpartner-02-filter',
					fn: function (item, object) {
						return (setObjectEntityRelatedFilters(item, object.BusinessPartner02Fk));
					}
				},
				{
					key: 'object-main-unit-bizpartner-03-filter',
					fn: function (item, object) {
						return (setObjectEntityRelatedFilters(item, object.BusinessPartner03Fk));
					}
				},
				{
					key: 'object-main-unit-bizpartner-04-filter',
					fn: function (item, object) {
						return (setObjectEntityRelatedFilters(item, object.BusinessPartner04Fk));
					}
				},
				{
					key: 'object-main-unit-bizpartner-05-filter',
					fn: function (item, object) {
						return (setObjectEntityRelatedFilters(item, object.BusinessPartner05Fk));
					}
				},
				{
					key: 'object-main-unit-bizpartner-filter',
					fn: function (item, object) {
						return (setObjectEntityRelatedFilters(item, object.BusinessPartnerFk));
					}
				},
				{
					key: 'object-main-unit-bizpartner-ea-filter',
					fn: function (item, object) {
						return (setObjectEntityRelatedFilters(item, object.BusinessPartnerEaFk));
					}
				},
				{
					key: 'object-main-unit-bizpartner-server-filter',
					serverSide: true,
					serverKey: 'object-main-unit-bizpartner-server-filter',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinessPartnerFk
						};
					}
				},
				{
					key: 'object-main-unit-bizpartner-ea-server-filter',
					serverSide: true,
					serverKey: 'object-main-unit-bizpartner-ea-server-filter',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinessPartnerFk
						};
					}
				},
				{
					key: 'object-main-unit-bizpartner-01-server-filter',
					serverSide: true,
					serverKey: 'object-main-unit-bizpartner-01-server-filter',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinessPartner01Fk
						};
					}
				},
				{
					key: 'object-main-unit-bizpartner-02-server-filter',
					serverSide: true,
					serverKey: 'object-main-unit-bizpartner-02-server-filter',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinessPartner02Fk
						};
					}
				},
				{
					key: 'object-main-unit-bizpartner-03-server-filter',
					serverSide: true,
					serverKey: 'object-main-unit-bizpartner-03-server-filter',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinessPartner03Fk
						};
					}
				},
				{
					key: 'object-main-unit-bizpartner-04-server-filter',
					serverSide: true,
					serverKey: 'object-main-unit-bizpartner-04-server-filter',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinessPartner04Fk
						};
					}
				},
				{
					key: 'object-main-unit-bizpartner-05-server-filter',
					serverSide: true,
					serverKey: 'object-main-unit-bizpartner-05-server-filter',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinessPartner05Fk
						};
					}
				},
				{
					key: 'object-main-sub-type-by-type-filter',
					fn: function (item, object) {
						return item.UnittypeFk === object.UnitTypeFk;
					}
				},
				{
					key: 'basics-installment-filter',
					fn: function (item) {
						if(service.getSelected().InstallmentAgreementFk !== null){
							return item.InstallmentagreementFk === service.getSelected().InstallmentAgreementFk;
						}else{
							return true;
						}
					}
				},
				{
					key: 'object-main-rubric-category-by-rubric-filter',
					fn: function (rc) {
						return rc.RubricFk === objectMainConstantValues.rubricId;
					}
				},
				{
					key: 'object-main-rubric-category-lookup-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function (entity) {
						return { Rubric: objectMainConstantValues.rubricId };
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(objectEntityRelatedFilters);

			return service;
		}]);
})(angular);
