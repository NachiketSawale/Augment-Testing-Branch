
(function (){
	'use strict';
	let module = angular.module('estimate.main');

	module.factory('estimateMainStandardAllowancesDataService',[ '_','$injector','globals', '$http','platformGridAPI','platformDataServiceFactory', 'estimateMainService','cloudDesktopPinningContextService', 'basicsLookupdataLookupFilterService',
		'estStandardAllowancesCostCodeDetailValidationProcessService','$q','$rootScope','platformDataServiceModificationTrackingExtension','platformDataServiceValidationErrorHandlerExtension','platformModuleDataExtensionService','platformRuntimeDataService',
		'estimateMainStandardAllowanceProcessor', '$translate', 'cloudCommonFeedbackType',
		function (_,$injector,globals,$http,platformGridAPI,platformDataServiceFactory,estimateMainService,cloudDesktopPinningContextService,basicsLookupdataLookupFilterService,
				  estStandardAllowancesCostCodeDetailValidationProcessService,$q,$rootScope,platformDataServiceModificationTrackingExtension,platformDataServiceValidationErrorHandlerExtension,platformModuleDataExtensionService,
				  platformRuntimeDataService,estimateMainStandardAllowanceProcessor, $translate, cloudCommonFeedbackType) {
			let serviceContainer = {};
			let service = {};
			let estHeaderFk = -1;
			let isExchangeHeader = true;
			let allowanceType = [];
			let isActiveChange = false;
			let markupGridId = 'e4a0ca6ff2214378afdc543646e6b079';
			let isSelectChange = false;
			let activeAllowanceChange = null;
			let isReadOnlyContainer = false;
			let feedback;
			let isDeleteAllowance = {
				deleteEntity: false,
				deleteActiveAllowance: false
			};
			let filters = [
				{
					key: 'AllowanceFilter',
					serverSide: false,
					fn: function (dataItem) {
						return dataItem.Id ===1 || dataItem.Id ===3;
					}
				},
				{
					key: 'AllowanceTypeChangeFilter',
					serverSide: false,
					fn: function (dataItem, allowanceEntity) {
						if(allowanceEntity && allowanceEntity.Version > 0 && allowanceEntity.MdcAllowanceTypeFk !== 3){
							return dataItem.Id === 1 || dataItem.Id === 2;
						}
						return true;
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			let serviceOptions = {
				hierarchicalRootItem: {
					module: module,
					serviceName: 'estimateMainStandardAllowancesDataService',
					entityNameTranslationID: 'estimate.main.estimateMainStandardAllowancesDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/estimateallowance/',
						endRead: 'getEstimateAllowances',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let previousEstimateHeader = getHeader();
							estHeaderFk = estimateMainService.getSelectedEstHeaderId();
							isExchangeHeader = previousEstimateHeader !== estHeaderFk;
							readData.EstHeaderFk = estHeaderFk ? estHeaderFk : -1;
							return readData;
						}
					},
					httpCreate:{
						route: globals.webApiBaseUrl + 'estimate/main/estimateallowance/',
						endCreate:'create'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'estimate/main/estimateallowance/',
						endUpdate:'update'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'estimate/main/estimateallowance/',
						endDelete:'delete'
					},
					dataProcessor: [estimateMainStandardAllowanceProcessor],
					entityRole: {
						root: {
							itemName: 'EstimateAllowanceToSave',
							moduleName: 'estimate.main',
							handleUpdateDone: function (updateData, response, data) {
								let estStandardAllowancesCostCodeDetailDataService = $injector.get('estStandardAllowancesCostCodeDetailDataService');
								if(response.AllowanceMarkUp2CostCodeToSave.length){
									estStandardAllowancesCostCodeDetailDataService.updateSuccess(response.AllowanceMarkUp2CostCodeToSave);
								}
								if(service.getIsActiveChange()){
									if(service.setIsLoading){
										service.setIsLoading(true);
									}
									estimateMainService.update().then(function(){
										// calculate
										let param = {
											EstHeaderId: estimateMainService.getSelectedEstHeaderId(),
											ProjectId: estimateMainService.getProjectId(),
											AllowanceFk:service.getActiveAllowanceChange(),
											EstAllowance: service.getSelected()
										};

										$http.post(globals.webApiBaseUrl + 'estimate/main/estimateallowance/recalculate', param).then(function (response) {
											if (response && response.data){
												estStandardAllowancesCostCodeDetailDataService.load();
												estimateMainService.load();
											}
											service.setActiveAllowanceChange(null);
											if(service.setIsLoading){
												service.setIsLoading(false);
											}
										}, function(){
											if(service.setIsLoading){
												service.setIsLoading(false);
											}
										});
									});
								}
								service.setIsActiveChange(false);
								data.handleOnUpdateSucceeded(updateData, response, data, true);
							}
						}
					},
					presenter: {
						list: {
							handleCreateSucceeded: function (newItem) {
								newItem.EstHeaderFk = estimateMainService.getSelectedEstHeaderId();
								return newItem;
							}
						}},
					actions: {
						create: 'flat',
						delete: true
					},
					entitySelection: {supportsMultiSelection: true},
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = estStandardAllowancesCostCodeDetailValidationProcessService;
			serviceContainer.data.showHeaderAfterSelectionChanged = null;

			serviceContainer.data.isRealRootForOpenedModule = function isRealRootForOpenedModule(){
				return false;
			};

			service.setUniqueIsActive = function setUniqueIsActive (entity) {
				let currencyAllowance = service.getList();

				_.forEach(currencyAllowance, function (item) {
					if(item.IsActive){
						service.markItemAsModified(item);
					}
					item.IsActive = item.Id === entity.Id;
				});
				serviceContainer.data.itemList = currencyAllowance;
				service.gridRefresh();
			};

			service.setHasUpdateItem = function setHasUpdateItem (entity) {
				serviceContainer.data.doClearModifications(entity,serviceContainer.data);
			};

			service.updateSuccess = function updateSuccess (response){
				let items = service.getList();
				_.forEach(response,function (data) {
					_.forEach(items,function (item){
						if(data.Id === item.Id){
							angular.extend(item,data);
							service.setAllowanceTypeReadOnly(item);
							$injector.get('platformDataProcessExtensionHistoryCreator').processItem(item);
							// item.Version = data.Version;
							// item.DescriptionInfo.VersionTr = data.DescriptionInfo.VersionTr;
						}
					});
				});

				// serviceContainer.data.itemList = items;
				service.gridRefresh();
			};

			service.clearSelectedItem = function(){
				serviceContainer.data.selectedItem = null;
			};

			service.clearData = function clearData() {
				let data = serviceContainer.data;
				if(data.itemList.length === 0){
					return;
				}
				data.itemList.length = 0;
				if (data.listLoaded) {
					data.listLoaded.fire();
				}
			};

			service.doPrepareUpdateCall = function doPrepareUpdateCall(dataToUpdate) {
				dataToUpdate.EstHeaderId = estimateMainService.getSelectedEstHeaderId();
				dataToUpdate.ProjectId = estimateMainService.getProjectId();
				dataToUpdate.IsActiveChange = service.getIsActiveChange();
				if(Object.hasOwnProperty.call(dataToUpdate, 'AllowanceAreaToSave')){
					dataToUpdate.AllowanceMarkUp2CostCodeToSave = [];
					dataToUpdate.AllowanceMarkUp2CostCodeToDelete = [];
					_.forEach(dataToUpdate.AllowanceAreaToSave,function (item) {
						_.forEach(item.AllowanceMarkUp2CostCodeToSave,function (d) {
							if(d.AllowanceMarkUp2CostCode.IsCustomProjectCostCode){
								d.AllowanceMarkUp2CostCode.MdcCostCodeFk = null;
							}
							d.AllowanceMarkUp2CostCode.CostCodes =null;
							if(d.AllowanceMarkUp2CostCode.Id !== -2){
								dataToUpdate.AllowanceMarkUp2CostCodeToSave.push(d);
							}
						});

						_.forEach(item.AllowanceMarkUp2CostCodeToDelete,function (d) {
							d.CostCodes =null;
							if(d.Id !== -2){
								dataToUpdate.AllowanceMarkUp2CostCodeToDelete.push(d);
							}
						});
					});
				}
			};

			function getHeader() {
				return estHeaderFk;
			}

			service.setHeader = function setHeader(estHeaderId) {
				estHeaderFk = estHeaderId;
			};

			service.getIsExchangeHeader = function getIsExchangeHeader() {
				return isExchangeHeader;
			};

			service.setIsExchangeHeader = function setIsExchangeHeader(isChange) {
				isExchangeHeader = isChange;
			};

			service.getIsLoad = function getIsLoad() {
				let previousEstimateHeader = getHeader();
				estHeaderFk = estimateMainService.getSelectedEstHeaderId();
				return  previousEstimateHeader !== estHeaderFk;
			};

			service.getIsClearMarkupContainer = function getIsClearMarkupContainer() {
				let previousEstimateHeader = getHeader();
				return  previousEstimateHeader !== estimateMainService.getSelectedEstHeaderId();
			};

			service.getHeader = function getHeader() {
				return estHeaderFk;
			};

			service.loadAllowance = function loadAllowance($scope) {
				service.showFeedbackComponent($scope);
				if(service.getIsLoad()){
					service.loadAllowanceType().then(function () {
						service.load().then(function () {
							service.hideFeedbackComponent();
						});
					});
				}else {
					service.hideFeedbackComponent();
					let configurationColumn = platformGridAPI.columns.configuration(markupGridId);
					if(!configurationColumn){
						return;
					}
					let estStandardAllowancesCostCodeDetailDataService = $injector.get('estStandardAllowancesCostCodeDetailDataService');
					let AllColumns = estStandardAllowancesCostCodeDetailDataService.getAllColumns();
					let currentColumn = configurationColumn.current;
					if(AllColumns.length && currentColumn && AllColumns.length === currentColumn.length){
						estStandardAllowancesCostCodeDetailDataService.refreshColumns(markupGridId);
					}
				}
			};

			service.showFeedbackComponent = function showFeedbackComponent($scope) {
				let uiMgr = $scope.getUiAddOns();
				feedback = uiMgr.getFeedbackComponent();
				feedback.setOptions({loadingText: $translate.instant('platform.processing'),
					info:$translate.instant('cloud.common.bulkEditor.infoMessage'),
					title: $translate.instant('estimate.main.StandardAllowancesContainer'),
					type: cloudCommonFeedbackType.long})
				feedback.show();
			}

			service.hideFeedbackComponent = function hideFeedbackComponent() {
				feedback.hide();
			}

			service.loadAllowanceType = function loadAllowanceType() {
				let deferred = $q.defer();
				$http.get(globals.webApiBaseUrl + 'estimate/main/estimateallowance/getAllowanceType').then(function (response) {
					let result = null;
					if (response && response.data) {
						result = response.data;
						allowanceType = result;
					}
					deferred.resolve(result);
				});
				return deferred.promise;
			};

			service.getAllowanceType = function getAllowanceType() {
				return allowanceType;
			};

			service.getIsActiveChange = function getIsActiveChange () {
				return isActiveChange;
			};

			service.setIsActiveChange = function setIsActiveChange(flag) {
				isActiveChange = flag;
			};

			service.getIsSelectChange = function getIsSelectChange() {
				return isSelectChange;
			};

			service.setIsSelectChange = function setIsSelectChange(flag) {
				isSelectChange = flag;
			};

			let baseDeleteSelection = service.deleteSelection;
			service.deleteSelection = function deleteSelection() {
				if (estimateMainService.isReadonly()) {
					return $injector.get('platformDialogService').showDialog({iconClass: 'info', headerText$tr$: 'cloud.common.infoBoxHeader', bodyText$tr$: 'estimate.main.readOnlyStandardAllowancesDeleteText', showOkButton: true});
				}
				let selectItems = service.getSelectedEntities();
				if(selectItems.length > 0){
					service.setIsDeleteAllowance(true,false);
					_.forEach(selectItems,function (item) {
						if(item.IsActive){
							service.setIsDeleteAllowance(true,true);
							// estimateMainService.setAAReadonly(true);
						}
					});
				}

				baseDeleteSelection();
			};

			service.getIsDeleteAllowance = function getIsDeleteAllowance() {
				return isDeleteAllowance;
			};

			service.setIsDeleteAllowance = function setIsDeleteAllowance(deleteFlag,deleteActiveFlag) {
				isDeleteAllowance.deleteEntity = deleteFlag;
				isDeleteAllowance.deleteActiveAllowance = deleteActiveFlag;
			};

			service.getActiveAllowanceChange = function getActiveAllowanceChange() {
				return activeAllowanceChange;
			};

			service.setActiveAllowanceChange = function setActiveAllowanceChange(allowance) {
				activeAllowanceChange = allowance;
			};

			service.reCalculateWhenMarkUpCalcTypeChange = function reCalculateWhenMarkUpCalcTypeChange(args) {
				let lookupItem = args.selectedItem;
				let allowance = service.getSelected();
				allowance.MdcMarkUpCalcTypeFk = lookupItem.Id;
				service.markItemAsModified(allowance);
				if(service.setIsLoading){
					service.setIsLoading(true);
				}
				estimateMainService.update().then(function(){
					// calculate
					let param = {
						EstHeaderId: estimateMainService.getSelectedEstHeaderId(),
						ProjectId: estimateMainService.getProjectId(),
						EstAllowance: service.getSelected()
					};

					$http.post(globals.webApiBaseUrl + 'estimate/main/estimateallowance/recalculate', param).then(function (response) {
						if (response && response.data){
							estimateMainService.load();
							$injector.get('estStandardAllowancesCostCodeDetailDataService').load();
						}
						if(service.setIsLoading){
							service.setIsLoading(false);
						}
					},function(){
						if(service.setIsLoading){
							service.setIsLoading(false);
						}
					});
				});
			};

			service.setIsReadOnlyContainer = function setIsReadOnlyContainer(isReadOnly) {
				isReadOnlyContainer = isReadOnly;
			};

			service.getIsReadOnlyContainer = function getIsReadOnlyContainer() {
				return isReadOnlyContainer;
			};

			service.processMarkupItem = function processMarkupItem(estimateHeader,isReadOnly) {
				let oldHeader = getHeader();
				let oldIsReadOnlyContainer = service.getIsReadOnlyContainer();
				if(oldHeader > 0 && (oldHeader === estimateHeader.Id) && (isReadOnly !== oldIsReadOnlyContainer)){
					let estStandardAllowancesCostCodeDetailDataService = $injector.get('estStandardAllowancesCostCodeDetailDataService');
					let data = estStandardAllowancesCostCodeDetailDataService.getList();
					angular.forEach(data, function (li) {
						processItem(li,isReadOnly);
					});
				}
			};

			service.getActiveAllowance = function() {
				return _.find(service.getList(), {IsActive: true});
			};

			function processItem(item, isHeaderReadOnly) {
				if(!item || item.Id < 0){
					return;
				}

				let fields = [
					{field: 'MdcCostCodeFk', readonly: true},
					{field: 'GaPerc', readonly: isHeaderReadOnly},
					{field: 'RpPerc', readonly: isHeaderReadOnly},
					{field: 'AmPerc', readonly: isHeaderReadOnly},
					{field: 'DefMGraPerc', readonly: isHeaderReadOnly},
					{field: 'DefMPerc', readonly: isHeaderReadOnly},
					{field: 'DefMGcPerc', readonly: isHeaderReadOnly},
					{field: 'DefMOp', readonly: isHeaderReadOnly}
				];

				platformRuntimeDataService.readonly(item, fields);
			}

			service.setAllowanceTypeReadOnly = function setAllowanceTypeReadOnly(item) {
				let allFieldsReadOnly = [];
				let isReadonly = item && item.Version > 0 && item.MdcAllowanceTypeFk === 3;
				let field = {field: 'MdcAllowanceTypeFk', readonly: isReadonly};
				allFieldsReadOnly.push(field);
				platformRuntimeDataService.readonly(item, allFieldsReadOnly);
			};

			let baseOnCreateItem = service.createItem;
			service.createItem = function createItem() {
				const estimateMainService = $injector.get('estimateMainService');
				if (!estimateMainService.isReadonly()) {
					baseOnCreateItem(null,serviceContainer.data);
				}
			};
			return service;
		}
	]);
})();