/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/* global _, globals */
	/**
	 * @ngdoc service
	 * @name logisticSettlementDataService
	 * @description provides methods to access, create and update logistic settlement  entities
	 */
	myModule.service('logisticSettlementDataService', LogisticSettlementDataService);

	LogisticSettlementDataService.$inject = ['$q', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupFilterService','$injector', 'platformRuntimeDataService', 'platformPermissionService', 'permissions',
		'cloudDesktopSidebarService', 'logisticSettlementReadOnlyProcessorService'];

	function LogisticSettlementDataService($q, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsLookupdataLookupFilterService, $injector, platformRuntimeDataService,platformPermissionService, permissions,
		cloudDesktopSidebarService, logisticSettlementReadOnlyProcessorService) {
		var self = this;

		var logisticSettlementServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticSettlementDataService',
				entityNameTranslationID: 'logistic.settlement.settlementEntity',
				entityInformation: { module: 'Logistic.Settlement', entity: 'Settlement', specialTreatmentService: null },
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/settlement/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'SettlementDto',
					moduleSubModule: 'Logistic.Settlement'
				}), {processItem: processItem}, logisticSettlementReadOnlyProcessorService],
				entityRole: {
					root: {
						codeField: 'SettlementNo',
						descField: 'BookingText',
						itemName: 'Settlements',
						moduleName: 'cloud.desktop.moduleDisplayNameLogisticSettlement',
						useIdentification: true,
						handleUpdateDone: handleUpdateDone
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {
					handleCreateSucceeded: function (item) {
						processItemOnCreate(item);
					}}},
				actions: { delete: false, create: false },
				sidebarSearch: {
					options: {
						moduleName: 'logistic.settlement',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: null,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true,
						pinningOptions: {
							isActive: true, showPinningContext: [{token: 'project.main', show: true}],
							setContextCallback: function (prjService) {
								cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'ProjectFk');
							}
						},

					}
				}
			}
		};

		var statusRevisionTrue = [];
		var statusReadOnlyTrue = [];
		var lookup = $injector.get('basicsLookupdataSimpleLookupService');

		function setStatusWithReadOnlyTrue(){
			lookup.getList({
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'basics.customize.logisticssettlementstatus',
				filter: {
					customBoolProperty: 'ISREADONLY',
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					field: 'RubricCategoryFk'
				}
			}).then(function (response) {
				if(response) {
					statusReadOnlyTrue = _.map(_.filter(response, {Isreadonly: true}), function (item) {
						return item.Id;
					});
				}
				setStatusWithRevisionTrue();
			});
		}

		function setStatusWithRevisionTrue(){
			lookup.refreshCachedData({
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'basics.customize.logisticssettlementstatus',
				filter: {
					customBoolProperty: 'ISREVISION',
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					field: 'RubricCategoryFk'
				}
			}).then(function (response) {
				if(response) {
					statusRevisionTrue = _.map(_.filter(response, {Isrevision: true}), function (item) {
						return item.Id;
					});
				}
			});
		}

		function handleUpdateDone(originalData, updatedData, data) { // jshint ignore:line
			var childServices = self.getChildServices();
			if (updatedData.FormattedText1ToSave) {
				_.forEach(childServices, function (childService) {
					if (childService.currentFormattedText1Changed) {
						childService.currentFormattedText1Changed.fire(updatedData.FormattedText1ToSave);
					}
				});
			}

			if (updatedData.FormattedText2ToSave) {
				_.forEach(childServices, function (childService) {
					if (childService.currentFormattedText2Changed) {
						childService.currentFormattedText2Changed.fire(updatedData.FormattedText2ToSave);
					}
				});
			}

			if (updatedData.FormattedText3ToSave) {
				_.forEach(childServices, function (childService) {
					if (childService.currentFormattedText3Changed) {
						childService.currentFormattedText3Changed.fire(updatedData.FormattedText3ToSave);
					}
				});
			}

			if (updatedData.FormattedText4ToSave) {
				_.forEach(childServices, function (childService) {
					if (childService.currentFormattedText4Changed) {
						childService.currentFormattedText4Changed.fire(updatedData.FormattedText4ToSave);
					}
				});
			}

			if (updatedData.FormattedText5ToSave) {
				_.forEach(childServices, function (childService) {
					if (childService.currentFormattedText5Changed) {
						childService.currentFormattedText5Changed.fire(updatedData.FormattedText5ToSave);
					}
				});
			}

			if (updatedData.FormattedText6ToSave) {
				_.forEach(childServices, function (childService) {
					if (childService.currentFormattedText6Changed) {
						childService.currentFormattedText6Changed.fire(updatedData.FormattedText6ToSave);
					}
				});
			}

			data.handleOnUpdateSucceeded(originalData, updatedData, data, true);
		}

		setStatusWithReadOnlyTrue();

		var serviceContainer = platformDataServiceFactory.createService(logisticSettlementServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.data.formattedText1TransferCallback = null;
		serviceContainer.data.formattedText2TransferCallback = null;
		serviceContainer.data.formattedText3TransferCallback = null;
		serviceContainer.data.formattedText4TransferCallback = null;
		serviceContainer.data.formattedText5TransferCallback = null;
		serviceContainer.data.formattedText6TransferCallback = null;

		serviceContainer.data.waitForOutstandingDataTransfer = function waitForOutstandingDataTransfer() {
			if(serviceContainer.data.formattedText1TransferCallback !== null) {
				serviceContainer.data.formattedText1TransferCallback();
			}

			if(serviceContainer.data.formattedText2TransferCallback !== null) {
				serviceContainer.data.formattedText2TransferCallback();
			}

			if(serviceContainer.data.formattedText3TransferCallback !== null) {
				serviceContainer.data.formattedText3TransferCallback();
			}

			if(serviceContainer.data.formattedText4TransferCallback !== null) {
				serviceContainer.data.formattedText4TransferCallback();
			}

			if(serviceContainer.data.formattedText5TransferCallback !== null) {
				serviceContainer.data.formattedText5TransferCallback();
			}

			if(serviceContainer.data.formattedText6TransferCallback !== null) {
				serviceContainer.data.formattedText6TransferCallback();
			}
			return $q.when(true);
		};

		this.doPrepareUpdateCall = function doPrepareClerkUpdateCall(updateData) {
			var childServices = self.getChildServices();
			if (self.getSelected()) {
				updateData.MainItemId = self.getSelected().Id;

				_.forEach(childServices, function (childService) {
					if (childService.provideFormattedText1ChangesToUpdate) {
						childService.provideFormattedText1ChangesToUpdate(updateData);
					}
				});

				_.forEach(childServices, function (childService) {
					if (childService.provideFormattedText2ChangesToUpdate) {
						childService.provideFormattedText2ChangesToUpdate(updateData);
					}
				});

				_.forEach(childServices, function (childService) {
					if (childService.provideFormattedText3ChangesToUpdate) {
						childService.provideFormattedText3ChangesToUpdate(updateData);
					}
				});

				_.forEach(childServices, function (childService) {
					if (childService.provideFormattedText4ChangesToUpdate) {
						childService.provideFormattedText4ChangesToUpdate(updateData);
					}
				});

				_.forEach(childServices, function (childService) {
					if (childService.provideFormattedText5ChangesToUpdate) {
						childService.provideFormattedText5ChangesToUpdate(updateData);
					}
				});

				_.forEach(childServices, function (childService) {
					if (childService.provideFormattedText6ChangesToUpdate) {
						childService.provideFormattedText6ChangesToUpdate(updateData);
					}
				});
			}
		};

		this.SetFormattedText1TransferCallback = function SetFormattedText1TransferCallback(transferCallback) {
			serviceContainer.data.formattedText1TransferCallback = transferCallback;
		};

		this.SetFormattedText2TransferCallback = function SetFormattedText2TransferCallback(transferCallback) {
			serviceContainer.data.formattedText2TransferCallback = transferCallback;
		};

		this.SetFormattedText3TransferCallback = function SetFormattedText3TransferCallback(transferCallback) {
			serviceContainer.data.formattedText3TransferCallback = transferCallback;
		};

		this.SetFormattedText4TransferCallback = function SetFormattedText4TransferCallback(transferCallback) {
			serviceContainer.data.formattedText4TransferCallback = transferCallback;
		};

		this.SetFormattedText5TransferCallback = function SetFormattedText5TransferCallback(transferCallback) {
			serviceContainer.data.formattedText5TransferCallback = transferCallback;
		};

		this.SetFormattedText6TransferCallback = function SetFormattedText6TransferCallback(transferCallback) {
			serviceContainer.data.formattedText6TransferCallback = transferCallback;
		};

		var entityRelatedFilters = [
			{
				key: 'logistic-settlement-subsidiary-filter',
				fn: function (subsidiary, entity) {
					return ( subsidiary.BusinessPartnerFk === entity.BusinessPartnerFk);
				}
			},
			{
				key: 'logistic-settlement-customer-filter',
				fn: function (customer, entity) {
					return ( customer.BusinessPartnerFk === entity.BusinessPartnerFk);
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(entityRelatedFilters);

		this.takeOver = function takeOver(entity) {
			var data = serviceContainer.data;
			var dataEntity = data.getItemById(entity.Id, data);

			data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
			data.markItemAsModified(dataEntity, data);
		};

		this.isRevision = function isRevision(entity){
			var result = false;
			if(statusRevisionTrue.length > 0 && entity){
				result = _.some(statusRevisionTrue, function(status) { return status === entity.SettlementStatusFk;});
			}
			return result;
		};

		this.isReadOnly = function isRevision(entity){
			var result = false;
			if(statusReadOnlyTrue.length > 0 && entity){
				result = _.some(statusReadOnlyTrue, function(status) { return status === entity.SettlementStatusFk;});
			}
			return result;
		};

		var scheme = null;

		function assertScheme() {
			if(scheme === null) {
				scheme = $injector.get('logisticSettlementLayoutService').getDtoScheme();
			}
		}

		function processItem(entity) {
			customizedProcessItem(entity);
		}

		function processItemOnCreate(item) {
			var fields = [
				{field: 'ExchangeRate', readonly: item.LoginCompanyCurrencyFk === item.CurrencyFk}
			];
			platformRuntimeDataService.readonly(item, fields);
		}

		function customizedProcessItem(entity, newCurrencyFk) {
			assertScheme();
			var readonly = self.isRevision(entity) || self.isReadOnly(entity);
			var fields = [];
			_.each(Object.getOwnPropertyNames(scheme), function (prop) {
				fields.push({
					field: prop,
					readonly: 'ExchangeRate' === prop ?
						_.isUndefined(newCurrencyFk) ?
							entity.LoginCompanyCurrencyFk === entity.CurrencyFk :
							entity.LoginCompanyCurrencyFk === newCurrencyFk :
						readonly
				});
			});
			platformRuntimeDataService.readonly(entity, fields);
		}


		this.customizedProcessItem = customizedProcessItem;

		function canDeleteCallBack() {
			var result = true;
			var selected = self.getSelected();
			if(!selected || self.isReadOnly(selected) || !selected.CanBeDeleted){
				result = false;
			}
			return result;
		}

		this.navigateTo = function navigateTo(item, triggerfield) {
			if(item && item[triggerfield] && angular.isNumber(item[triggerfield])){
				cloudDesktopSidebarService.filterSearchFromPKeys([item[triggerfield]]);
			} else if (triggerfield === 'Ids' && item.FromGoToBtn && _.isString(item.Ids)) {
				const ids = item.Ids.split(',').map(id => id.trim()).filter(id => id);
				if (ids.length > 0) {
					cloudDesktopSidebarService.filterSearchFromPKeys(ids);
				}
			}
		};

		platformPermissionService.restrict(['5c40f34757a140a4956fd60da1072129'],
			permissions.read);

	}

})(angular);
