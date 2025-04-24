/**
 * Created by baf on 29.01.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.dispatching';
	var myModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name logisticDispatchHeaderDataService
	 * @description provides methods to access, create and update logistic dispatch header entities
	 */
	myModule.service('logisticDispatchingHeaderDataService', LogisticDispatchingHeaderDataService);

	LogisticDispatchingHeaderDataService.$inject = [
		'_', '$injector', '$translate', '$http','platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'platformObjectHelper', 'platformTranslateService', 'platformModalFormConfigService',
		'logisticDispatchingHeaderProcessorService', 'platformPermissionService', 'permissions', 'logisticDispatchingConstantValues',
		'mainViewService', 'platformDialogService', 'cloudDesktopPinningContextService', 'cloudDesktopSidebarService'
	];

	function LogisticDispatchingHeaderDataService(
		_, $injector, $translate, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		mandatoryProcessor, platformObjectHelper, platformTranslateService, platformModalFormConfigService,
		logisticDispatchingHeaderProcessorService, platformPermissionService, permissions, logisticDispatchingConstantValues,
		mainViewService, platformDialogService, cloudDesktopPinningContextService, cloudDesktopSidebarService
	) {
		var self = this;
		let selectedProject = -1;
		let pinnedProject = -1;
		let readOnlyFlag = false;
		let createFromPrevious = null;

		var logisticDispatchHeaderServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticDispatchHeaderDataService',
				entityNameTranslationID: 'logistic.dispatching.dispatchingHeader',
				entityInformation: { module: 'Logistic.Dispatching', entity: 'DispatchHeader', specialTreatmentService: null },

				actions: {
					delete: true,
					create: 'flat',
					suppressAutoCreate: true,
					canDeleteCallBackFunc: canDeleteCallBack
				},
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/header/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete',
					extendSearchFilter: function extendSearchFilter(readData, data) {
						if (data.headerId) {
							readData.PKeys = readData.PKeys || [];
							readData.PKeys.push({
								Id: data.headerId,
								PKey1: data.companyFk
							});
						}
					}
				},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'DispatchHeaderDto',
						moduleSubModule: 'Logistic.Dispatching'
					}),
					logisticDispatchingHeaderProcessorService
				],
				entityRole: {root: {
					itemName: 'DispatchHeader',
					moduleName: 'cloud.desktop.moduleDisplayNameLogisticDispatching',
					useIdentification: true,
					handleUpdateDone: handleUpdateDone }},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						handleCreateSucceeded: function (item) {
							if(createFromPrevious){
								item.Job1Fk = createFromPrevious.Job1Fk;
								item.PerformingCompanyFk = createFromPrevious.PerformingCompanyFk;
								item.PerformingJobGroupFk = createFromPrevious.PerformingJobGroupFk;
								item.PerformingProjectFk = createFromPrevious.PerformingProjectFk;
								item.DocumentDate = createFromPrevious.DocumentDate;
								item.EffectiveDate = createFromPrevious.EffectiveDate;
								item.DispatchHeaderTypeFk = createFromPrevious.DispatchHeaderTypeFk;
							}
							createFromPrevious = null;
							logisticDispatchingHeaderProcessorService.processItemOnCreate(item);
							logisticDispatchingHeaderProcessorService.validateRubricCategory(item);
						}
					}},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						includeDateSearch: true,
						useIdentification: true,
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: null,
						showOptions: true,
						showProjectContext: false,
						pinningOptions: {
							isActive: true,
							showPinningContext: [
								{ token: 'project.main', show: true }
							],
						},
						withExecutionHints: true
					}
				}
			}
		};

		function canDeleteCallBack() {
			var result = true;
			var selected = self.getSelected();
			if(!selected || selected.IsReadOnly){
				result = false;
			}
			return result;
		}

		let serviceContainer = platformDataServiceFactory.createService(logisticDispatchHeaderServiceOption, self);
		let service = serviceContainer.service;

		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'DispatchHeaderDto',
			moduleSubModule: 'Logistic.Dispatching',
			validationService: 'logisticDispatchingHeaderValidationService'
		});

		// selection project
		serviceContainer.service.setSelectedProject = function setSelectedProject(item) {

			if (selectedProject !== item) {
				if (item) {
					selectedProject = item;
				} else {
					selectedProject = -1;
				}
			}
		};

		serviceContainer.service.getSelectedProject = function getSelectedProject() {
			if (selectedProject === -1) {
				if (pinnedProject !== -1) {
					return pinnedProject;
				}
			}
			return selectedProject;
		};

		service.navigateTo = function navigateTo(item, triggerfield) {
			if (!item || !triggerfield) return;

			let headerId = null;
			if (item) {
				if (triggerfield === 'Code') {
					serviceContainer.data.headerId = headerId = platformObjectHelper.getValue(item, 'Id');
					serviceContainer.data.companyFk = platformObjectHelper.getValue(item, 'CompanyFk');
				} else if (triggerfield === 'Ids' && item.FromGoToBtn && _.isString(item.Ids)){
					const ids = item.Ids.split(',').map(id => id.trim()).filter(id => id);
					if (ids.length > 0) {
						cloudDesktopSidebarService.filterSearchFromPKeys(ids);
					}
				} else if (item.DispatchHeaderFk || platformObjectHelper.getValue(item, triggerfield)) {
					serviceContainer.data.headerId = headerId = item.DispatchHeaderFk || platformObjectHelper.getValue(item, triggerfield);
					serviceContainer.data.companyFk = platformObjectHelper.getValue(item, 'CompanyFk');
				}
			}

			service.setSelected(null);
			service.load().then(function () {
				var header = service.getItemById(headerId);// Hope it is an id ...
				if(header){
					service.setSelected(header);
				}
				headerId = null;
				serviceContainer.data.headerId = serviceContainer.data.companyFk = null;
			});
		};

		service.registerSelectionChanged (function (e, item){
			if(item){
				service.setReadOnly(item.IsReadOnly);
			}
		});

		service.getDefaultButtonConfig = function getSettingsButtonConfig(containerUuid) {
			return {
				id: 't2',
				caption: 'logistic.dispatching.defaultSettings',
				type: 'item',
				fn: function () {
					service.defaultDialog(containerUuid);
				},
				disabled: function () {
					return false;
				}
			};
		};

		service.defaultDialog = function defaultDialog(containerUuid) {
			let loadedDataItem = mainViewService.customData(containerUuid, 'defaultValues');
			let defaultDataItem = {
				RubricCategoryFk: null,
			};
			let dataItem = _.isNil(loadedDataItem) ? defaultDataItem : loadedDataItem;
			let formConfig = $injector.get('logisticDispatchingHeaderDefaultValuesLayoutService').getFormConfig();
			let modalConfig = {
				title: $translate.instant('logistic.dispatching.defaultSettings'),
				dataItem: dataItem,
				formConfiguration: formConfig,
				dialogOptions: {
					disableOkButton: function disableOkButton() {
						return false;
					}
				},
				handleOK: function handleOK(result) {
					mainViewService.customData(containerUuid, 'defaultValues', result.data);
				}
			};
			platformTranslateService.translateFormConfig(modalConfig.formConfiguration);
			platformModalFormConfigService.showDialog(modalConfig);
		};

		service.setReadOnly = function setReadOnly (flag) {

			var oldValue = readOnlyFlag;

			if (readOnlyFlag === flag) {
				return; // Nothing has changed -> nothing to be done
			}

			readOnlyFlag = flag;

			if (flag) {
				platformPermissionService.restrict([logisticDispatchingConstantValues.permissionUuid.records, logisticDispatchingConstantValues.permissionUuid.characteristics, logisticDispatchingConstantValues.permissionUuid.comments, logisticDispatchingConstantValues.permissionUuid.documents],
					permissions.read);
			} else if (oldValue) { // Only do this if readonly was set before
				platformPermissionService.restrict([logisticDispatchingConstantValues.permissionUuid.records, logisticDispatchingConstantValues.permissionUuid.characteristics, logisticDispatchingConstantValues.permissionUuid.comments, logisticDispatchingConstantValues.permissionUuid.documents]);
			}

		};

		service.calculatePriceTotalPre = function calculatePriceTotalPre(records) {
			var newTotal = _.sumBy(records, function(record) {
				return record.PriceTotalPre;
			});
			var sel = service.getSelected();

			if(!!sel && sel.PriceTotalPre !== newTotal) {
				sel.PriceTotalPre = newTotal;
				service.markItemAsModified(sel);
			}
		};

		service.createItemFromSelected = function createItemFromSelected(records) {
			createFromPrevious = service.getSelected();
			if(!_.isNil(createFromPrevious)){
				self.createItem();
			}
		};

		service.calculatePriceTotal = function calculatePriceTotal(records) {
			var newTotal = _.sumBy(records, function(record) {
				return record.PriceTotal;
			});
			var sel = service.getSelected();

			if(!!sel && sel.PriceTotal !== newTotal) {
				sel.PriceTotal = newTotal;
				service.markItemAsModified(sel);
			}
		};

		service.getExchangeRate = function getExchangeRate() {
			var sel = service.getSelected();

			if(!!sel && sel.ExchangeRate !== 0) {
				return sel.ExchangeRate;
			}
			else{
				return 1;
			}
		};

		service.registerDataModified (function (){
			var selected = service.getSelected();
			if(selected && selected.IsReadOnly !== readOnlyFlag){
				service.setReadOnly(selected.IsReadOnly);
				logisticDispatchingHeaderProcessorService.processItem(selected);
			}
		});

		service.createDeepCopy = function createDeepCopy() {
			var command = {
				Action: 4,
				DispatchHeaders:   [service.getSelected()]
			};

			$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/execute', command)
				.then(function (response) {
					serviceContainer.data.handleOnCreateSucceeded(response.data.DispatchHeader[0], serviceContainer.data);}, function (/* error */) {
				});
		};

		service.takeOverHeadersFromDragedJobCards2DispRecords = function takeOverHeadersFromDragedJobCards2DispRecords(headers) {
			_.forEach(headers, function (header) {
				let viewHeader =  _.find(serviceContainer.data.itemList, {Id: header.Id});

				if( !_.isArray(viewHeader.DragedJobCards2DispRecordsIds)){
					viewHeader.DragedJobCards2DispRecordsIds = [];
				}
				viewHeader.DragedJobCards2DispRecordsIds.push(...header.DragedJobCards2DispRecordsIds);
				// has to be overwritten?
				// viewHeader.Job2Fk = header.JobFk;
				// viewHeader.EffectiveDate = header.ActualFinish ? header.ActualFinish : header.PlannedFinish;
				// viewHeader.StartDate = header.ActualStart ? header.ActualStart : header.PlannedStart;
				// viewHeader.EndDate = header.ActualFinish ? header.ActualFinish : header.PlannedFinish;
				// viewHeader.Description = header.Description;
				serviceContainer.data.markItemAsModified(viewHeader, serviceContainer.data);
			});
			serviceContainer.data.listLoaded.fire();
		};

		function handleUpdateDone(originalData, updatedData, data) { // jshint ignore:line
			let doNotify = false;
			let selected = null;
			if(updatedData.DispatchHeader && _.size(updatedData.DispatchHeader) > 0) {
				selected = service.getSelected();

				if(selected && selected.Version === 0)
				{
					const savedSelection = _.find(updatedData.DispatchHeader, { Id: selected.Id });
					if(savedSelection) {
						doNotify = true;
					}
				}
			}
			data.handleOnUpdateSucceeded(originalData, updatedData, data, true);

			if(doNotify && !_.isNil(selected))
			{
				let timeout = $injector.get('$timeout');
				timeout(function () {
					const valService = $injector.get('logisticDispatchingHeaderValidationService');
					valService.notifyEntityCompletion(selected.Job1Fk, selected.Job2Fk, {Version: 0});
				}, 10);
			}
		}
	}

})(angular);
