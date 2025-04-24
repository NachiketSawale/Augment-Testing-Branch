/**
 * Created by bh on 07.05.2015.
 */
(function () {
	'use strict';
	/* global globals, _ */
	var moduleName = 'boq.wic';
	var boqWICModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqWicCatBoqService
	 * @function
	 *
	 * @description
	 * boqWicCatBoqService is a data service for managing boqs in the wic module.
	 */
	boqWICModule.factory('boqWicCatBoqService', ['boqWicGroupService', 'platformDataServiceFactory', 'boqMainService', 'platformRuntimeDataService', '$q', 'boqWicCatBoqReadonlyProcessor', 'platformPermissionService'
		, '$injector', 'basicsLookupdataLookupFilterService', 'ServiceDataProcessDatesExtension'
		, function (boqWicGroupService, platformDataServiceFactory, boqMainService, platformRuntimeDataService, $q, boqWicCatBoqReadonlyProcessor, platformPermissionService, $injector, basicsLookupdataLookupFilterService, ServiceDataProcessDatesExtension) {
			var serviceContainer;
			var service;

			var wicCatBoqServiceOption = {
				flatLeafItem: {
					module: boqWICModule,
					serviceName: 'boqWicCatBoqService',
					httpCreate: {route: globals.webApiBaseUrl + 'boq/wic/boq/'},
					httpRead: {route: globals.webApiBaseUrl + 'boq/wic/boq/'},
					dataProcessor: [boqWicCatBoqReadonlyProcessor, new ServiceDataProcessDatesExtension(['WicBoq.ValidFrom','WicBoq.ValidTo'])],
					actions: {
						delete: true,
						create: 'flat',
						canDeleteCallBackFunc: function (selectedItem/* , data */) {
							return (service.getReadOnly()) ? false : (_.isObject(selectedItem) && !service.isFrameworkWicBoq(selectedItem));
						},
						canCreateCallBackFunc: function (/* selectedItem, data */) {
							return (service.getReadOnly()) ? false : _.isObject(boqWicGroupService.getSelected());
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selectedWicGroup = boqWicGroupService.getSelected();
								if (boqWicGroupService.isSelection(selectedWicGroup)) {
									creationData.wicGroupId = selectedWicGroup.Id;

									// Increment the reference number of the boq root item
									var convertibleReferences = _.map(service.getList(), 'BoqRootItem').filter(function (item) {
										return /^\d+$/.test(item.Reference); // Make sure we only take the references that can be converted to integers
									});

									var convertedReferences = _.map(convertibleReferences, function (item) {
										return parseInt(item.Reference, 10); // Convert the strings to integers
									});
									var maxReference = (convertedReferences.length === 0) ? null : _.max(convertedReferences);
									if (maxReference) {
										maxReference = (maxReference + 1).toString();
									}

									creationData.Reference = maxReference || '1';
								}
							},
							isInitialSorted: true, sortOptions: {initialSortColumn: {field: 'BoqRootItem.Reference', id: 'boqRootItem.reference'}, isAsc: true, doNumericComparison: true},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								serviceContainer.data.sortByColumn(readItems);

								// Depending on the selected parentItem we set this service readonly or not
								var selectedWicGroup = boqWicGroupService.getSelected();
								var readOnly = false;
								var result;

								if (angular.isDefined(selectedWicGroup) && selectedWicGroup !== null) {
									if (selectedWicGroup.AccessRightDescriptorFk === null) {
										service.setReadOnly(false);
										boqMainService.setReadOnly(false);
										result = serviceContainer.data.handleReadSucceeded(readItems, data);
										highlightFromNavigation(readItems);
										return result;
									}

									// As we have an AccessRightDescriptorFk set and hopefully the related permissions already loaded by parent service, we should be able to check the access rights.
									readOnly = platformPermissionService.hasRead(selectedWicGroup.AccessRightDescriptorFk) && !platformPermissionService.hasWrite(selectedWicGroup.AccessRightDescriptorFk);

									service.setReadOnly(readOnly);
									boqMainService.setReadOnly(service.getReadOnly());
								}

								result = serviceContainer.data.handleReadSucceeded(readItems, data);
								highlightFromNavigation(readItems);
								return result;
							}
						}
					},
					entityRole: {leaf: {itemName: 'WicBoqComposite', parentService: boqWicGroupService, parentFilter: 'wicGroupId'}},
					translation: {
						uid: 'boqWicCatBoqService',
						title: 'boq.wic.wicCatBoqListTitle',
						columns: [{header: 'boq.main.Brief', field: 'BoqRootItem.BriefInfo'}],
						dtoScheme: { moduleSubModule: 'Boq.Wic', typeName: 'WicBoqCompositeDto' }
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(wicCatBoqServiceOption);
			service = serviceContainer.service;
			var localData = serviceContainer.data;

			localData.readOnly = false; // Add local variable for read only mode

			/**
			 * @ngdoc function
			 * @name setReadOnly
			 * @function
			 * @methodOf boqWicCatBoqService
			 * @description sets the read only mode of the service
			 * @param {Boolean} flag telling if read only is active or not
			 */
			service.setReadOnly = function setReadOnly(flag) {
				localData.readOnly = flag;
			};

			/**
			 * @ngdoc function
			 * @name getReadOnly
			 * @function
			 * @methodOf boqWicCatBoqService
			 * @description gets the read only mode of the service
			 * @returns {Boolean} flag telling if read only is active or not
			 */
			service.getReadOnly = function getReadOnly() {
				return localData.readOnly;
			};

			/**
			 * @ngdoc function
			 * @name getCellEditable
			 * @function
			 * @methodOf boqWicCatBoqService
			 * @description Check if the given field in the currentItem should be editable
			 * @param {Object} currItem whose field is to be checked
			 * @param {String} field that is checked
			 * @returns {Boolean} result of check
			 */
			service.getCellEditable = function getCellEditable(currItem, field) {

				// Various fields have to be set readonly according to the state of the current item
				return boqWicCatBoqReadonlyProcessor.isFieldEditable(currItem, field, localData);

			};

			localData.isFrameworkWicBoq = function isFrameworkWicBoq(wicBoqComposite) {
				var isFrameworkWicBoq = false;

				if (wicBoqComposite.WicBoq && (wicBoqComposite.WicBoq.ConHeaderFk !== null || wicBoqComposite.WicBoq.OrdHeaderFk !== null)) {
					if (boqMainService.checkIsWicTypeFramework(wicBoqComposite)) {
						isFrameworkWicBoq = true;
					}
				}

				return isFrameworkWicBoq;
			};

			/**
			 * @ngdoc function
			 * @name isFrameworkWicBoq
			 * @function
			 * @methodOf boqWicCatBoqService
			 * @description Check if the given wicBoqComposite holds a framework wic boq
			 * @param {Object} wicBoqComposite wic cat boq that is to be checked
			 * @returns {Boolean} result of check
			 */
			service.isFrameworkWicBoq = function isFrameworkWicBoq(wicBoqComposite) {
				return localData.isFrameworkWicBoq(wicBoqComposite);
			};

			var onItemSelectionChanged = function onItemSelectionChanged() {
				var wicBoqComposite = service.getSelected();
				if (service.isSelection(wicBoqComposite) && angular.isDefined(wicBoqComposite.BoqRootItem) && (wicBoqComposite.BoqRootItem !== null)) {
					platformRuntimeDataService.readonly(wicBoqComposite, [
						{field: 'BoqRootItem.InsertedAt', readonly: true},
						{field: 'BoqRootItem.InsertedBy', readonly: true},
						{field: 'BoqRootItem.UpdatedAt', readonly: true},
						{field: 'BoqRootItem.UpdatedBy', readonly: true}
					]);
				}
			};

			service.prepareGoto = function prepareGoto() {
				var wicBoqComposite = service.getSelected();
				var deferredGoto = $q.defer();
				if (angular.isDefined(wicBoqComposite) && (wicBoqComposite !== null) && angular.isDefined(wicBoqComposite.BoqRootItem) && (wicBoqComposite.BoqRootItem !== null)) {

					// First save all changes by saving the parent service...
					service.saveParentService().then(function () {
						var boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
						if (boqRuleComplexLookupService) {
							boqRuleComplexLookupService.setNavFromBoqWic();

							boqRuleComplexLookupService.loadLookupData().then(function () {
								// ..then initialize the boqMainService whose content is to be shown after the goto.
								var boqHeaderFk = wicBoqComposite.BoqRootItem.BoqHeaderFk;
								boqMainService.setSelectedHeaderFk(boqHeaderFk, false, false, false, false, wicBoqComposite); // Composite object serves as calling context
								boqMainService.setReadOnly(service.getReadOnly() || service.isFrameworkWicBoq(wicBoqComposite));

								deferredGoto.resolve();
							});
						} else {
							// ..then initialize the boqMainService whose content is to be shown after the goto.
							var boqHeaderFk = wicBoqComposite.BoqRootItem.BoqHeaderFk;
							boqMainService.setSelectedHeaderFk(boqHeaderFk, false, false, false, false, wicBoqComposite); // Composite object serves as calling context
							boqMainService.setReadOnly(service.getReadOnly() || service.isFrameworkWicBoq(wicBoqComposite));

							deferredGoto.resolve();
						}

					});

				} else {
					deferredGoto.resolve();
				}

				return deferredGoto.promise;
			};

			service.registerSelectionChanged(onItemSelectionChanged);

			service.saveParentService = function saveParentService() {
				var deferred = $q.defer();
				if (angular.isObject(serviceContainer.data) && angular.isObject(serviceContainer.data.parentService)) {
					serviceContainer.data.parentService.updateAndExecute(function () {
						deferred.resolve();
					});

					return deferred.promise;
				}
			};

			var originalCreateItem = service.createItem;

			// Now intercept createItem call by first calling the original version and then doing special stuff
			service.createItem = function createWicCatBoq() {

				// First call the original version
				originalCreateItem().then(function reactOnSuccessfulWicCatBoqCreate(newItem) {
					if (angular.isDefined(newItem) && (newItem !== null)) {
						// Get all items and resort them
						serviceContainer.data.sortByColumn(service.getList());
						service.gridRefresh();
					}
				});
			};

			service.addWicCatBoq = function addWicCatBoq(wicCatBoq) {
				localData.itemList.push(wicCatBoq);
				localData.listLoaded.fire();
				service.setSelected(wicCatBoq);
			};

			function highlightFromNavigation(items) {
				var highlightItemId = boqWicGroupService.getHighlightedWicCatBoqId();
				if (highlightItemId) {
					var highlightItem = _.find(items, {Id: highlightItemId});
					if (highlightItem) {
						service.setSelected(highlightItem);
					}
					boqWicGroupService.clearHighlightedWicCatBoqId();
				}
			}

			var filters = [
				{
					key: 'wic-boq-subsidiary-filter',
					serverSide: true,
					serverKey: 'businesspartner-main-subsidiary-common-filter',
					fn: function () {
						var currentItem = service.getSelected();
						return {
							BusinessPartnerFk: currentItem !== null ? currentItem.WicBoq.BpdBusinessPartnerFk : null,
							SupplierFk: currentItem !== null ? currentItem.WicBoq.BpdSupplierFk : null
						};
					}
				},
				{
					key: 'wic-boq-supplier-filter',
					serverSide: true,
					serverKey: 'businesspartner-main-supplier-common-filter',
					fn: function () {
						var currentItem = service.getSelected();
						return {
							BusinessPartnerFk: currentItem ? currentItem.WicBoq.BpdBusinessPartnerFk : null,
							SubsidiaryFk: currentItem !== null ? currentItem.WicBoq.BpdSubsidiaryFk : null
						};
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			return service;
		}
	]);
})();
