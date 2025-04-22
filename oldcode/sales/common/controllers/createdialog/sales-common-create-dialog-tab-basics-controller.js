/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.common';

	angular.module(moduleName).controller('salesCommonCreateDialogTabBasicsController',
		['_', '$translate', '$scope', '$injector', 'platformTranslateService', 'salesCommonCreateDialogService', 'salesCommonFunctionalRoleService',
			function (_, $translate, $scope, $injector, platformTranslateService, salesCommonCreateDialogService, salesCommonFunctionalRoleService) {

				// show functional role restriction if needed
				$scope.restrictionText = $translate.instant('sales.common.functionalRoleRestrictionInfo');
				$scope.isFunctionalRoleRestriction = salesCommonFunctionalRoleService.getIsFunctionalRoleRestriction; // assigning function, not return value

				var formConfig = salesCommonCreateDialogService.getFormConfig();
				var curMainService = salesCommonCreateDialogService.getCurMainService();
				var configuredCreateLayout = curMainService.configuredCreateLayout;
				// check if configured dialog is activated
				if (curMainService.isConfigurableDialog() &&
					configuredCreateLayout &&
					configuredCreateLayout.formConfiguration &&
					configuredCreateLayout.dataItem) {
					// overwrite form config and data item
					formConfig = configuredCreateLayout.formConfiguration;
					$scope.dataItem = configuredCreateLayout.dataItem;
				} else {
					$scope.dataItem = salesCommonCreateDialogService.getDataItem();
				}

				platformTranslateService.translateFormConfig(formConfig);
				$scope.formContainerOptions = {
					formOptions: {
						configure: formConfig
					}
				};

				function updateDataItem(mainItem) {
					if (mainItem) {
						$scope.dataItem.BusinesspartnerFk = mainItem.BusinesspartnerFk;
						$scope.dataItem.SubsidiaryFk = mainItem.SubsidiaryFk;
						$scope.dataItem.CustomerFk = mainItem.CustomerFk;
					}
				}
				function updateCurrencyAndRate(mainItem) {
					if (mainItem) {
						$scope.dataItem.CurrencyFk = mainItem.CurrencyFk;
						$scope.dataItem.ExchangeRate = mainItem.ExchangeRate;
						$injector.get('platformRuntimeDataService').readonly($scope.dataItem, [{field: 'CurrencyFk', readonly: false}]);
					}
				}

				function retrieveHeaderInfoAndUpdateDataItem(typeEntity) {
					const baseUrl = globals.webApiBaseUrl;
					const dataItem = $scope.dataItem;
					const { fid } = formConfig;
					const getBidHeader = () => { // todo: need to check if replace server endpoint call with existing method/data service
						$injector.get('$http').get(`${baseUrl}sales/bid/refheaderlookup?bidId=${dataItem.Id}&projectId=${dataItem.ProjectFk}`)
							.then(resp => {
								const hasSingleNonNullRecord = Array.isArray(resp.data) && resp.data.length === 1 &&  !_.isNil(resp.data);
								if (hasSingleNonNullRecord) {
									dataItem.BidHeaderFk = resp.data[0].Id;
									updateDataItem(resp.data[0]);
								}
							});
					};
					const getContractHeader = () => { // todo: need to check if replace server endpoint call with existing method/data service
						const params = JSON.stringify({
							SearchFields: ['Code', 'OrdStatusFk', 'DescriptionInfo'],
							SearchText: '',
							FilterKey: 'sales-contract-main-contract-filter-by-server',
							AdditionalParameters: { ProjectId: dataItem.ProjectFk },
							TreeState: { StartId: null, Depth: null },
							RequirePaging: false
						});
						$injector.get('$http').get(`${baseUrl}basics/lookupdata/master/getsearchlist?lookup=salescontractv2&filtervalue=${params}`)
							.then(resp => {
								const hasSingleNonNullRecord = Array.isArray(resp.data) && resp.data.length === 1 &&  !_.isNil(resp.data);
								let filteredData = resp.data.filter(item => item.Id === dataItem.OrdHeaderFk)[0];
								if(_.isNil(filteredData)){
									filteredData =  resp.data[0];
								}
								hasSingleNonNullRecord && fid !== 'data.service.create.Bills' && (dataItem.OrdHeaderFk = resp.data[0].Id);
								if (!_.isNil(dataItem.OrdHeaderFk)) {
									if (fid === 'data.service.create.Contracts'|| fid === 'data.service.create.WIP') {
										updateDataItem(filteredData);
									}
									else if (fid === 'data.service.create.Bills') {
										updateDataItem(filteredData);
										updateCurrencyAndRate(filteredData);
										setFieldReadOnlyStatus(true);
									}
								}
								else if(dataItem.OrdHeaderFk === null && fid === 'data.service.create.Bills') {
									setCustomerDataFromProject();
									setFieldReadOnlyStatus(false);
									$injector.get('salesCommonDataHelperService').getProjectById($scope.dataItem.ProjectFk, {dataServiceName: 'salesCommonDataHelperService'}).then(result => Object.assign(
										$scope.dataItem, {CurrencyFk: result.CurrencyFk, ExchangeRate: 1}));
								} else if (dataItem.OrdHeaderFk === null && fid === 'data.service.create.WIP') {
									setCustomerDataFromProject();
								}
							});
					};
					if (fid === 'data.service.create.Bids' && typeEntity.IsChange) {
						getBidHeader();
					}
					else if (fid !== 'data.service.create.Bids') {
						getContractHeader();
					}
				}

				function readOnlyFields(typeEntity) {
					let selectedMainItem = getSelectedMainItem(formConfig.fid);
					const isReadOnly = shouldApplyReadOnly(typeEntity, selectedMainItem);
					setFieldReadOnlyStatus(isReadOnly);
				}

				function getSelectedMainItem(formId) {
					switch (formId) {
						case 'data.service.create.Bids':
							return $scope.dataItem.BidHeaderFk;
						case 'data.service.create.Contracts':
							return $scope.dataItem.OrdHeaderFk;
						default:
							return null;
					}
				}

				function shouldApplyReadOnly(typeEntity, selectedMainItem) {
					return (typeEntity.IsChange || typeEntity.IsSide) && !_.isNil(selectedMainItem);
				}

				function setFieldReadOnlyStatus(isReadOnly) {
					const fields = [
						{ field: 'BusinesspartnerFk', readonly: isReadOnly },
						{ field: 'SubsidiaryFk', readonly: isReadOnly },
						{ field: 'CustomerFk', readonly: isReadOnly }
					];
					$injector.get('platformRuntimeDataService').readonly($scope.dataItem, fields);
				}

				function setCustomerDataFromProject() {
					$injector.get('salesCommonDataHelperService').getProjectById($scope.dataItem.ProjectFk, {dataServiceName: 'salesCommonDataHelperService'}).then(result => Object.assign(
						$scope.dataItem, {BusinesspartnerFk: result.BusinessPartnerFk, SubsidiaryFk: result.SubsidiaryFk, CustomerFk: result.CustomerFk}));
				}

				function getTypeLookupConfig() {
					let typeFilterKey;
					let typeOf;
					switch (formConfig.fid) {
						case 'data.service.create.Bills':
							typeFilterKey = 'sales-billing-type-with-rubric-filter';
							typeOf = 'basics.customize.billtype';
							break;

						case 'data.service.create.Bids':
							typeFilterKey = 'sales-bid-type-with-rubric-filter';
							typeOf = 'basics.customize.bidtype';
							break;

						case 'data.service.create.Contracts':
							typeFilterKey = 'sales-contract-type-with-rubric-filter';
							typeOf = 'basics.customize.ordertype';
							break;
					}
					return $injector.get('basicsLookupdataConfigGenerator').provideGenericLookupConfigForForm(
						typeOf,
						'Description',
						{
							gid: 'allData',
							rid: 'typeFk',
							model: 'TypeFk',
							required: true,
							visible:true,
							sortOrder: 0,
							label: 'Type',
							label$tr$: 'sales.contract.entityContractTypeFk',
						},
						false, // caution: this parameter is ignored by the function
						{
							required: true,
							customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
							filterKey: typeFilterKey
						}
					);
				}

				function getMainOrderLookupConfig() {
					return {
						gid: 'allData',
						rid: 'ordheaderfk',
						model: 'OrdHeaderFk',
						sortOrder: 1,
						label: 'Main Contract',
						required: false,
						label$tr$: 'sales.common.MainContract',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'sales-common-contract-dialog-v2',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'sales-contract-main-contract-filter-by-server',
								showClearButton: true,
							}
						}
					};
				}

				function getChangeOrderLookupConfig() {
					let prjChgFilterKey;
					switch (formConfig.fid) {
						case 'data.service.create.Bids':
							prjChgFilterKey = 'sales-bid-project-change-common-filter';
							break;
						case 'data.service.create.Contracts':
							prjChgFilterKey = 'sales-contract-project-change-common-filter';
							break;
					}

					return {
						gid: 'allData',
						rid: 'prjchangefk',
						model: 'PrjChangeFk',
						required: false,
						readonly: false,
						sortOrder: 2,
						label: 'Change Order',
						label$tr$: 'sales.common.entityChangeOrder',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'project-change-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true,
								createOptions: {
									typeOptions: {
										isSales: true,
										isChangeOrder: true
									}
								},
								filterKey: prjChgFilterKey
							}
						}
					};
				}

				function overloadBidHeaderFk() {
					var ret;
					ret = $injector.get('basicsLookupdataConfigGenerator').provideDataServiceLookupConfigForForm({
							dataServiceName: 'salesBidHeaderRefLookupDataService',
							filter: function (item) {
								if (item && item.ProjectChangeGenerateMode === 2) {
									return {
										Id: -1,
										ProjectFk: item.ProjectFk
									};
								} else if (item.BidId) {
									return item.BidId;// should set the bid code when using in "update bid"
								} else {
									return {
										Id: -1,
										ProjectFk: item.ProjectFk
									};
								}
							},
							showClearButton: true,
						},
						{
							gid: 'allData',
							rid: 'bidheaderfk',
							model: 'BidHeaderFk',
							required: false,
							visible: true,
							sortOrder: 11,
							label: 'Main Bid',
							label$tr$: 'sales.billing.entityBidHeaderFk'
						});

					ret.required = true;
					// adding bid status column
					ret.options.lookupOptions.columns.push({
						id: 'Status',
						field: 'BidStatusFk',
						name: 'Status',
						formatter: 'lookup',
						name$tr$: 'entityBidStatusFk',
						formatterOptions: {
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService',
							lookupModuleQualifier: 'basics.customize.bidstatus',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						}
					});
					return ret;
				}

				function getGidContracts() {
					return {
						gid: 'allData',
						rid: 'contractsGrid',
						label: 'Contracts',
						label$tr$: 'sales.contract.wizardCWCreateWipContractsGridLabel',
						type: 'directive',
						directive: 'sales-contract-select-contracts',
						options: {
							contractServiceName: 'salesWipCreateWipDialogService',
							getListName: 'getContractsFromServer',
							gridStyle: 'height:150px;'
						},
						sortOrder: 2,
						readonly: true, disabled: false, maxlength: 1000, rows: 10, visible: true
					}
				}

				// TODO: this is a common service which should not contain module specific logic
				// watch on change sales.bid create bid dialogue for dynamic validation
				$scope.$watch('dataItem.TypeFk', function (newTypeId) {
					if (formConfig.fid === 'sales.bid.createBidModal') {
						$injector.get('salesBidTypeLookupDataService').getItemByIdAsync(newTypeId).then(function (typeEntity) {
							// if type has changed we have to update validation on field
							var prjChange = _.find(formConfig.rows, { model: 'PrjChangeFk' });
							var mainBid = _.find(formConfig.rows, { model: 'BidHeaderFk' });
							if (typeEntity.IsMain) {
								prjChange.required = false;
								mainBid.required = false;
								mainBid.visible = false;
								mainBid.options.lookupOptions.showClearButton = true;
							} else if (typeEntity.IsSide) {
								prjChange.required = false;
								mainBid.required = true;
								mainBid.visible = true;
								mainBid.options.lookupOptions.showClearButton = false;
							} else {
								prjChange.required = true;
								mainBid.required = true;
								mainBid.visible = true;
								mainBid.options.lookupOptions.showClearButton = false;
							}
							$scope.$broadcast('form-config-updated');
						});
					}
					else if (formConfig.fid === 'sales.contract.createContractModal') {
						$injector.get('salesContractTypeLookupDataService').getItemByIdAsync(newTypeId).then(function (typeEntity) {
							// if type has changed we have to update validation on field
							var changeOrder = _.find(formConfig.rows, { model: 'PrjChangeFk' }); // used for change order (db still PrjChangeFk)
							var mainContract = _.find(formConfig.rows, { model: 'OrdHeaderFk' });
							var wicGroup = _.find(formConfig.rows, { model: 'BoqWicCatFk' });
							var wicBoq = _.find(formConfig.rows, { model: 'BoqWicCatBoqFk' });

							if (typeEntity.IsMain) {
								changeOrder.required = false;
								changeOrder.readonly = true;
								mainContract.required = false;
								mainContract.visible = false;
								wicGroup.visible = false;
								wicBoq.visible = false;
								mainContract.options.lookupOptions.showClearButton = true;
							} else if (typeEntity.IsSide) {
								changeOrder.required = false;
								changeOrder.readonly = true;
								mainContract.required = true;
								mainContract.visible = true;
								wicGroup.visible = false;
								wicBoq.visible = false;
								mainContract.options.lookupOptions.showClearButton = false;
							} else if (typeEntity.IsFrameworkCallOff) {
								wicGroup.visible = true;
								wicBoq.visible = true;
								mainContract.required = false;
								mainContract.visible = false;
								changeOrder.required = false;
								changeOrder.readonly = true;
							} else if (typeEntity.IsChange) {
								mainContract.visible = true;
								mainContract.required = true;
								changeOrder.required = true;
								changeOrder.readonly = false;
								wicGroup.visible = false;
								wicBoq.visible = false;
							}
							else { // TODO: what's the case here?
								mainContract.required = true;
								mainContract.visible = true;
								wicGroup.visible = false;
								wicBoq.visible = false;
								mainContract.options.lookupOptions.showClearButton = false;
							}
							$scope.$broadcast('form-config-updated');
						});
					}
					// TODO: need to find dynamic logic to avoid loading Qto related fields in create WIP process
					else if (formConfig.fid === 'sales.wip.createWipModal') {
						var updateWith = _.find(formConfig.rows, { model: 'updateWith' });
						var Type = _.find(formConfig.rows, { model: 'TypeFk' });
						var PreviousBill = _.find(formConfig.rows, { model: 'PreviousBillFk' });
						var PerformedFrom = _.find(formConfig.rows, { model: 'PerformedFrom' });
						var PerformedTo = _.find(formConfig.rows, { model: 'PerformedTo' });

						updateWith.visible = false;
						Type.visible = false;
						PreviousBill.visible = false;
						PerformedFrom.visible = false;
						PerformedTo.visible = false;
						// contracts grid
						var gridOptions = _.get(_.find(formConfig.rows, {rid: 'contractsGrid'}), 'options');
						$scope.$watch('dataItem.OrdHeaderFk', function (newOrdHeaderFk/* , oldOrdHeaderFk */) {
							// set readonly state and reload grid
							gridOptions.readonly = newOrdHeaderFk === null;
							$scope.$broadcast('reloadGrid');
						});
						// end contract grid
					}
					// TODO: Basic setup when configurable dialog is activated For billing module
					else if (formConfig.fid === 'data.service.create.Bills') {
						let type = _.find(formConfig.rows, { model: 'TypeFk' });
						if(_.isNil(type)) {
							type = getTypeLookupConfig();
							formConfig.rows.push(type);
						}
						let config = _.find(formConfig.rows, { model: 'ConfigurationFk' });
						config.options.filterKey = 'sales-billing-configuration-filter';
						let project = _.find(formConfig.rows, { model: 'ProjectFk' });
						let billNo = _.find(formConfig.rows, { model: 'BillNo' });
						project.options.lookupOptions.readOnly = false;
						billNo.readonly = false;
						$injector.get('salesBillTypeLookupDataService').getItemByIdAsync(newTypeId).then(function (typeEntity) {
							let consecutiveBillNo = _.find(formConfig.rows, { model: 'ConsecutiveBillNo' });
							consecutiveBillNo.visible = false;
							let rubricValue = $scope.dataItem.RubricCategoryFk = typeEntity.RubricCategoryFk;
							$scope.dataItem.TypeEntity = typeEntity;


							// TODO: do not access or change __rt$data (directly). Use platform services.
							let validateEntity = $scope.$$watchers[0].last.__rt$data.errors;
							validateEntity.BillingSchemaFk = {};
							validateEntity.ConsecutiveBillNo = {};
							$scope.$broadcast('form-config-updated');
							return $injector.get('salesCommonDataHelperService').getDefaultOrFirstSalesConfig(rubricValue).then(function (configurationId) {
								$scope.dataItem.ConfigurationFk = configurationId;
								let hasToBeGenerated = $injector.get('salesBillingNumberGenerationSettingsService').hasToGenerateForRubricCategory(rubricValue);
								billNo.readonly = !!hasToBeGenerated;
								$scope.$broadcast('form-config-updated');
							});
						});
						$scope.$broadcast('form-config-updated');
					}
					// TODO: Basic setup when configurable dialog is activated For Bid module
					else if (formConfig.fid === 'data.service.create.Bids') {
						let bidConfig = _.find(formConfig.rows, { model: 'ConfigurationFk' });
						bidConfig.options.filterKey = 'sales-bid-configuration-filter';
						let project = _.find(formConfig.rows, { model: 'ProjectFk' });
						let type = _.find(formConfig.rows, { model: 'TypeFk' });
						if(_.isNil(type)) {
							type = getTypeLookupConfig();
							formConfig.rows.push(type);
						}
						let code = _.find(formConfig.rows, { model: 'Code' });
						let prjChange = _.find(formConfig.rows, { model: 'PrjChangeFk' });
						if(_.isNil(prjChange)) {
							prjChange = getChangeOrderLookupConfig();
							formConfig.rows.push(prjChange);
						}
						let bidHeader = _.find(formConfig.rows, { model: 'BidHeaderFk' });
						if(_.isNil(bidHeader)) {
							bidHeader = overloadBidHeaderFk();
							formConfig.rows.push(bidHeader);
						}
						project.options.lookupOptions.readOnly = false;
						type.readonly = false;
						code.readonly = false;
						$injector.get('salesBidTypeLookupDataService').getItemByIdAsync(newTypeId).then(function (typeEntity) {
							let rubricCategoryId = typeEntity.RubricCategoryFk;
							$scope.dataItem.RubricCategoryFk = rubricCategoryId;
							$scope.dataItem.TypeEntity = typeEntity;
							if (typeEntity.IsMain) {
								prjChange.required = false;
								prjChange.visible = false;
								bidHeader.required = false;
								bidHeader.visible = false;
								bidHeader.options.lookupOptions.showClearButton = false;
								$scope.dataItem.BidHeaderFk = null;
								setCustomerDataFromProject();
							} else if (typeEntity.IsSide) {
								prjChange.required = false;
								prjChange.visible = true;
								bidHeader.required = true;
								bidHeader.visible = true;
								bidHeader.options.lookupOptions.showClearButton = true;
							} else if (typeEntity.IsChange) {
								prjChange.required = false;
								prjChange.visible = true;
								bidHeader.required = true;
								bidHeader.visible = true;
								bidHeader.options.lookupOptions.showClearButton = true;
								retrieveHeaderInfoAndUpdateDataItem(typeEntity);
							} else {
								prjChange.required = true;
								prjChange.visible = true;
								bidHeader.required = true;
								bidHeader.visible = true;
								bidHeader.options.lookupOptions.showClearButton = true;
							}
							$scope.$broadcast('form-config-updated');
							return $injector.get('salesCommonDataHelperService').getDefaultOrFirstSalesConfig(rubricCategoryId).then(function (configurationId) {
								$scope.dataItem.ConfigurationFk = configurationId;
								let codeReadonly = $injector.get('salesBidNumberGenerationSettingsService').hasToGenerateForRubricCategory(rubricCategoryId);
								code.readonly = !!codeReadonly;

								// TODO: do not access or change __rt$data (directly). Use platform services.
								let validateEntity = $scope.$$watchers[0].last.__rt$data.errors; // TODO:

								if (typeEntity.IsMain) {
									validateEntity.BidHeaderFk = {};
									validateEntity.PrjChangeFk = {};
								}
								if (typeEntity.IsMain || typeEntity.IsChange) {
									readOnlyFields(typeEntity);
								}

								validateEntity.BillingSchemaFk = {}; // TODO: check if needed
								$scope.$broadcast('form-config-updated');
							});
						});
					}
					// TODO: Basic setup when configurable dialog is activated For Sales-Contract module
					else if (formConfig.fid === 'data.service.create.Contracts') {
						let contractConfiguration = _.find(formConfig.rows, { model: 'ConfigurationFk' });
						let type = _.find(formConfig.rows, { model: 'TypeFk' });
						if(_.isNil(type)) {
							type = getTypeLookupConfig();
							formConfig.rows.push(type);
						}
						type.readonly = false;
						$scope.dataItem.IsBillOptionalItems = false;
						let contractCode = _.find(formConfig.rows, { model: 'Code' });
						contractConfiguration.options.filterKey = 'sales-contract-configuration-filter';
						let changeOrder = _.find(formConfig.rows, { model: 'PrjChangeFk' }); // used for change order (db still PrjChangeFk)
						if(_.isNil(changeOrder)) {
							changeOrder = getChangeOrderLookupConfig();
							formConfig.rows.push(changeOrder);
						}
						let mainContract = _.find(formConfig.rows, { model: 'OrdHeaderFk' });
						if(_.isNil(mainContract)) {
							mainContract = getMainOrderLookupConfig();
							formConfig.rows.push(mainContract);
						}
						let wicGroup = _.find(formConfig.rows, { model: 'BoqWicCatFk' });
						let wicBoq = _.find(formConfig.rows, { model: 'BoqWicCatBoqFk' });
						let isFramework = _.find(formConfig.rows, { model: 'IsFramework' });
						let isFreeItemsAllowed = _.find(formConfig.rows, { model: 'IsFreeItemsAllowed' });
						contractCode.readonly = false;
						$injector.get('salesContractTypeLookupDataService').getItemByIdAsync(newTypeId).then(function (typeEntity) {
							let rubricCategoryId = typeEntity.RubricCategoryFk;
							$scope.dataItem.RubricCategoryFk = rubricCategoryId;
							$scope.dataItem.TypeEntity = typeEntity;
							if (typeEntity.IsMain) {
								changeOrder.required = false;
								changeOrder.readonly = true;
								changeOrder.visible = false;
								mainContract.required = false;
								mainContract.visible = false;
								wicGroup.visible = false;
								wicBoq.visible = false;
								isFramework.required = false;
								isFramework.visible = false;
								isFreeItemsAllowed.required = false;
								isFreeItemsAllowed.visible = false;
								$scope.dataItem.OrdHeaderFk = null;
								// TODO: do not access or change __rt$data (directly). Use platform services.
								mainContract.options.lookupOptions.showClearButton = true;
								setCustomerDataFromProject();
							} else if (typeEntity.IsSide) {
								changeOrder.required = false;
								changeOrder.readonly = true;
								changeOrder.visible = false;
								mainContract.required = true;
								mainContract.visible = true;
								wicGroup.visible = false;
								wicBoq.visible = false;
								mainContract.options.lookupOptions.showClearButton = false;
							} else if (typeEntity.IsFrameworkCallOff) {
								wicGroup.visible = true;
								wicBoq.visible = true;
								mainContract.required = false;
								mainContract.visible = false;
								changeOrder.required = false;
								changeOrder.readonly = true;
							} else if (typeEntity.IsChange) {
								mainContract.visible = true;
								mainContract.required = true;
								changeOrder.required = true;
								changeOrder.readonly = false;
								changeOrder.visible = true;
								wicGroup.visible = false;
								wicBoq.visible = false;
								retrieveHeaderInfoAndUpdateDataItem(typeEntity);
							}
							else { // TODO: what's the case here?
								mainContract.required = true;
								mainContract.visible = true;
								wicGroup.visible = false;
								wicBoq.visible = false;
								mainContract.options.lookupOptions.showClearButton = false;
							}
							$scope.$broadcast('form-config-updated');
							return $injector.get('salesCommonDataHelperService').getDefaultOrFirstSalesConfig(rubricCategoryId).then(function (configurationId) {
								$scope.dataItem.ConfigurationFk = configurationId;
								let hasToBeGenerated = $injector.get('salesContractNumberGenerationSettingsService').hasToGenerateForRubricCategory(rubricCategoryId);
								contractCode.readonly = !!hasToBeGenerated;
								// removed error msg from some entities
								// TODO: do not access or change __rt$data (directly). Use platform services.
								let validateEntity = $scope.$$watchers[0].last.__rt$data.errors;

								validateEntity.BillingSchemaFk = {};
								validateEntity.IsFramework = {};
								validateEntity.IsFreeItemsAllowed = {};

								if (!typeEntity.IsFrameworkCallOff) {
									validateEntity.BoqWicCatFk = {};
									validateEntity.BoqWicCatBoqFk = {};
								}
								if (typeEntity.IsMain || typeEntity.IsChange) {
									readOnlyFields(typeEntity);
								}
								$scope.$broadcast('form-config-updated');
							});
						});
					}
					else if (formConfig.fid === 'data.service.create.WIP') {
						let prevWip = _.find(formConfig.rows, { model: 'PrevWipHeaderFk' });
						let factorDJC = _.find(formConfig.rows, { model: 'FactorDJC' });
						let salesContract = _.find(formConfig.rows, { model: 'OrdHeaderFk' });
						if (!_.isNil(factorDJC)) {
							let removeFactorDJC = _.remove(formConfig.rows, { model: 'FactorDJC' });
							formConfig.rows.push(removeFactorDJC);
						}

						prevWip.readonly = false;
						prevWip.visible = true;

						// contracts grid
						let gridContracts = getGidContracts();
						formConfig.rows.push(gridContracts);
						$scope.dataItem.gridContracts = [];
						salesContract.options.lookupDirective = 'sales-common-contract-dialog-v2';
						salesContract.options.lookupOptions.filterKey = 'sales-wip-contract-filter-by-server';
						salesContract.options.lookupOptions.lookupType = 'SalesContractV2';
						// end contract grid

						// TODO: do not access or change __rt$data (directly). Use platform services.
						let validateEntity = $scope.dataItem.__rt$data.errors;
						validateEntity.FactorDJC = {};
						validateEntity.PrevWipHeaderFk = {};

						$scope.$broadcast('form-config-updated');
					}
					$scope.$broadcast('form-config-updated');
				});

				$scope.$watch('dataItem.RubricCategoryFk', function () {
					// TODO: Basic setup when configurable dialog is activated For Sales-WIP module
					if (formConfig.fid === 'data.service.create.WIP') {
						let wipConfig = _.find(formConfig.rows, { model: 'ConfigurationFk' });
						let wipCode = _.find(formConfig.rows, { model: 'Code' });
						let rubricValue = $scope.dataItem.RubricCategoryFk;
						wipConfig.options.filterKey = 'sales-wip-configuration-filter';
						let hasToBeGenerated = $injector.get('salesWipNumberGenerationSettingsService').hasToGenerateForRubricCategory(rubricValue);
						wipCode.readonly = !!hasToBeGenerated;
						retrieveHeaderInfoAndUpdateDataItem();
						$injector.get('salesCommonDataHelperService').getSalesConfigurations().then(function (data) {
							let items = _.filter(data, {RubricCategoryFk: rubricValue});
							if (_.size(items) > 0) {
								$scope.dataItem.ConfigurationFk = _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id;
							}

							$scope.$broadcast('form-config-updated');
						});
					}
					$scope.$broadcast('form-config-updated');
				});
				$scope.$watch('dataItem.ConfigurationFk', function () {
					if (formConfig.fid === 'data.service.create.WIP') {
						let contractTypeFk = $scope.dataItem.ConfigurationFk;
						let contractTypeField = _.find(formConfig.rows, { model: 'ContractTypeFk' });
						contractTypeField.readonly = contractTypeFk !== null;
					}
					$scope.$broadcast('form-config-updated');
				});

				// Todo: added the logic to take over data from MainBid/MainContract
				$scope.$watch('dataItem.BidHeaderFk', function (bidId) {
					if (formConfig.fid === 'data.service.create.Bids') {
						if ($scope.dataItem.TypeEntity.IsSide || $scope.dataItem.TypeEntity.IsChange) {
							let dataService = $injector.get('salesBidHeaderRefLookupDataService');
							readOnlyFields($scope.dataItem.TypeEntity);
							if(_.isNull(bidId)){
								setCustomerDataFromProject();
							} else{
								dataService.getItemByIdAsync(bidId, {dataServiceName: 'salesBidHeaderRefLookupDataService'}).then(function(result) {
									$injector.get('salesBidCreateBidDialogService').onMainBidChanged($scope.dataItem, result);
									$scope.$broadcast('form-config-updated');
								});
							}
						}
					}
				});
				$scope.$watch('dataItem.OrdHeaderFk', function (mainItemtId) {
					if (formConfig.fid === 'data.service.create.Contracts') {
						if ($scope.dataItem.TypeEntity.IsSide || $scope.dataItem.TypeEntity.IsChange) {
							let dataService = $injector.get('salesContractService');
							let selectedMainContract = dataService.getItemById(mainItemtId);
							readOnlyFields($scope.dataItem.TypeEntity);
							if(_.isNull(mainItemtId)){
								setCustomerDataFromProject();
							} else{
								$injector.get('salesContractCreateContractDialogService').getDataFromMainContract($scope.dataItem, selectedMainContract);
							}

						}
					}
					else if (formConfig.fid === 'data.service.create.WIP') {
						let dataService = $injector.get('salesCommonContractLookupDataService');
						let selectedMainContract = dataService.getItemById(mainItemtId,{});
						let gridContracts = $scope.dataItem.gridContracts;
						let dialogService = $injector.get('salesWipCreateWipDialogService');
						dialogService.getInitDataItem().OrdHeaderFk = mainItemtId;
						dialogService.getContractsFromServer().then(result => {
							dialogService.getInitDataItem().gridContracts = result;
							gridContracts = result;
							$scope.$broadcast('form-config-updated');
						});
						$injector.get('salesWipCreateWipDialogService').getDataFromMainContract($scope.dataItem, selectedMainContract);
					}
					else if (formConfig.fid === 'data.service.create.Bills'){
						retrieveHeaderInfoAndUpdateDataItem($scope.dataItem.TypeEntity);
					}
				});
				$scope.$watch('dataItem.ExchangeRate', function () {
					if (formConfig.fid === 'data.service.create.Bills') {
						retrieveHeaderInfoAndUpdateDataItem($scope.dataItem.TypeEntity);
					}
					$scope.$broadcast('form-config-updated');
				});
			}]);

})();