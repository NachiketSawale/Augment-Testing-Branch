/**
 * Created by ltn on 12/1/2016.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc controller
	 * @function
	 *
	 * @description
	 *
	 **/

	var modelName = 'project.main';
	angular.module(modelName).controller('projectMainUpdateMaterialPricesWizardController',
		['$scope', '$injector',
			'$translate',
			'platformGridAPI',
			'$timeout',
			'platformModalService',
			'platformTranslateService',
			'projectMainService',
			'projectMainUpdateMaterialPricesService',
			'basicsLookupdataLookupDescriptorService',
			'basicsLookupdataLookupFilterService',
			'basicsLookupdataSimpleLookupService',
			'basicsLookupdataLookupDataService',
			'basicsCommonHeaderColumnCheckboxControllerService',
			'projectMainUpdatePricesWizardCommonService',
			'globals', '_',
			'projectMainUpdatePriceFromCatalogMainService',
			'projectMainUpdatePriceFromCatalogProjectMaterialService',
			'projectMainUpdatePriceFromCatalogPriceListService',
			'projectMainUpdatePriceFromCatalogPriceListSourceOption',
			'projectMainUpdatePriceFromCatalogAdditionalData',
			'projectMainUpdateResultFieldVarianceFormatter',
			'projectMainUpdatePriceByMaterialCatalogService',
			function ($scope, $injector,
				$translate,
				platformGridAPI,
				$timeout,
				platformModalService,
				platformTranslateService,
				projectMainService,
				projectMainUpdateMaterialPricesService,
				basicsLookupdataLookupDescriptorService,
				basicsLookupdataLookupFilterService,
				basicsLookupdataSimpleLookupService,
				basicsLookupdataLookupDataService,
				basicsCommonHeaderColumnCheckboxControllerService,
				projectMainUpdatePricesWizardCommonService,
				globals, _,
				projectMainUpdatePriceFromCatalogMainService,
				projectMainUpdatePriceFromCatalogProjectMaterialService,
				projectMainUpdatePriceFromCatalogPriceListService,
				projectMainUpdatePriceFromCatalogPriceListSourceOption,
				projectMainUpdatePriceFromCatalogAdditionalData,
				projectMainUpdateResultFieldVarianceFormatter,
				projectMainUpdatePriceByMaterialCatalogService
			) {

				var selectedProject = projectMainService.getSelected();
				projectMainUpdatePriceFromCatalogMainService.projectId = selectedProject ? selectedProject.Id : -1;
				// will get project Id from estimate main service when using in resource summary
				if (!selectedProject && projectMainUpdatePriceFromCatalogMainService.isInSummary) {
					var projectId = $injector.get('estimateMainService').getSelectedProjectId();
					if (projectId) {
						projectMainUpdatePriceFromCatalogMainService.projectId = projectId;
						selectedProject = {Id: projectId};
					}
				}

				var clearAll = true;
				let co2Attr = new Set();
				var count = 0;
				var quoteStatus =
					{
						showGrouping: false,
						groups: [
							{
								gid: '1',
								header: '',
								header$tr$: '',
								isOpen: true,
								visible: true,
								sortOrder: 1
							}
						],
						rows: [
							{
								gid: '1',
								rid: 'project',
								model: 'projectfk',
								sortOrder: 1,
								label: $translate.instant('project.main.loadQuotesWithSelectedProject'),
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookup-data-project-project-dialog',
									descriptionMember: 'ProjectName',
									lookupOptions: {
										initValueField: 'ProjectNo',
										showClearButton: true
									}
								}
							},
							{
								gid: '1',
								rid: 'quoteStatus',
								label: $translate.instant('project.main.loadQuotesWithSelectedStatus'),
								type: 'directive',
								model: 'statusfk',
								directive: 'procurement-Quote-Status-Combobox',
								visible: true,
								sortOrder: 1,
								width: 150,
								options: {
									'showClearButton': true,
									'filterKey': 'project-main-update-quote-status-filter'
								}
							}
						]
					};

				$scope.quoteStatus = {
					configure: quoteStatus
				};

				var contractStatus =
					{
						showGrouping: false,
						groups: [
							{
								gid: '1',
								header: '',
								header$tr$: '',
								isOpen: true,
								visible: true,
								sortOrder: 1
							}
						],
						rows: [
							{
								gid: '1',
								rid: 'project',
								model: 'projectfk',
								sortOrder: 1,
								label: $translate.instant('project.main.loadContractWithSelectedProject'),
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookup-data-project-project-dialog',
									descriptionMember: 'ProjectName',
									lookupOptions: {
										initValueField: 'ProjectNo',
										showClearButton: true
									}
								}
							}
							// {
							//     gid: '1',
							//     rid: 'project',
							//     label: $translate.instant('project.main.loadContractWithSelectedProject'),
							//     type: 'directive',
							//     model: 'projectfk',
							//     directive: 'basics-lookup-data-project-project-dialog',
							//     visible: true,
							//     sortOrder: 1,
							//     width:150,
							//     options: {
							//         'showClearButton': true
							//     }
							// }
						]
					};
				$scope.contractStatus = {
					configure: contractStatus
				};
				$scope.currentItem = {
					statusfk: null,
					projectfk: null,
					pattern: '',
					pageSize: 10,
					pageNumber: 0,
					selectPrj: null
				};

				$scope.canNextStep = true;
				// endregion

				var quoteGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						name: 'Selected',
						name$tr$: 'project.main.selected',
						editor: 'boolean',
						formatter: 'boolean',
						width: 75,
						headerChkbox: true
					},
					{
						id: 'ProjectCode',
						field: 'ProjectFk',
						name: 'Project Code',
						name$tr$: 'project.main.projectCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Project',
							displayMember: 'ProjectNo'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookup-data-project-project-dialog',
							lookupOptions: {
								showClearButton: true,
								'events': [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if (args.selectedItem !== null) {
												args.entity.ProjectName = args.selectedItem.ProjectName;
											} else {
												args.entity.QuoteFk = null;
											}
										}
									}
								]
							}
						},
						readonly: true,
						width: 90,
						validator: function (entity, value) {
							if (!value || (value !== entity.ProjectFk)) {
								entity.QuoteFk = null;
								validateQuoteFk(entity, entity.QuoteFk);
							}
						}
					},
					{
						id: 'ProjectName',
						field: 'ProjectFk',
						name: 'Project Name',
						name$tr$: 'project.main.projectName',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Project',
							displayMember: 'ProjectName'
						},
						width: 150,
						readonly: true
					},
					{
						id: 'QuoteCode',
						field: 'QuoteFk',
						name: 'Quote Code',
						name$tr$: 'project.main.quoteCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote2material',
							displayMember: 'Code'
						},
						required: true,
						editor: 'lookup',
						editorOptions: {
							directive: 'procurement-quote-to-material-Lookup',
							lookupOptions: {
								filterKey: 'quote-header-filter',
								showClearButton: true,
								'events': [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											var entity = args.entity;
											if (args.selectedItem !== null) {
												var selectedItem = args.selectedItem;
												var gridDatas = projectMainUpdateMaterialPricesService.getGridData();
												for (var index = 0; index < gridDatas.length; index++) {
													if (gridDatas[index].QuoteFk === args.selectedItem.Id) {
														platformModalService.showMsgBox($translate.instant('project.main.selectedQuoteExist'), $translate.instant('project.main.updateMaterialPricesFromQuoteTitle'), 'ico-info'); // jshint ignore:line
														gridDatas[gridDatas.length - 1].QuoteFk = null;
														projectMainUpdateMaterialPricesService.setGridData(gridDatas);
														updateQuoteGrid(gridDatas);
														return;
													}
												}
												if (!entity.ProjectFk) {
													entity.ProjectFk = selectedItem.ProjectFk;
												}
												entity.Id = selectedItem.Id;
												entity.QuoteDescription = selectedItem.Description;
												entity.BusinessPartnerFk = selectedItem.BusinessPartnerFk;
												entity.Version = selectedItem.QuoteVersion;
												entity.StatusFk = selectedItem.StatusFk;
												entity.QuotedDate = selectedItem.DateQuoted;

											} else {
												entity.Id = null;
												entity.QuoteDescription = null;
												entity.BusinessPartnerFk = null;
												entity.Version = null;
												entity.StatusFk = null;
												entity.QuotedDate = null;
											}
										}
									}
								]
							}
						},
						width: 90,
						validator: validateQuoteFk
					},
					{
						id: 'QuoteDescription',
						field: 'QuoteDescription',
						name: 'Quote Description',
						name$tr$: 'project.main.quoteDescription',
						width: 150,
						formatter: 'description',
						readonly: true
					},
					{
						id: 'BusinessPartnerName',
						field: 'BusinessPartnerFk',
						name: 'Business Partner Name',
						name$tr$: 'project.main.businessPartnerName',
						width: 150,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						},
						readonly: true
					},
					{
						id: 'Version',
						field: 'Version',
						name: 'Version',
						name$tr$: 'project.main.version',
						width: 100,
						formatter: 'description',
						readonly: true
					},
					{
						id: 'Status',
						field: 'StatusFk',
						name: 'Status',
						name$tr$: 'project.main.status',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'QuoteStatus',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService'
						},
						width: 100,
						readonly: true
					},
					{
						id: 'QuotedDate',
						field: 'QuotedDate',
						name: 'Quoted Date',
						name$tr$: 'project.main.quotedDate',
						width: 100,
						formatter: 'date'
					}
				];

				function validateQuoteFk(entity, value) {
					if (!value) {
						entity.BusinessPartnerFk = null;
						entity.QuoteDescription = null;
						entity.QuotedDate = null;
						entity.StatusFk = null;
						entity.Version = null;
					}
				}

				var quoteGridId = 'B57BF1317165451AA108E5CC4B66A995';

				$scope.updatePricesFromQuote = {
					state: quoteGridId
				};

				$scope.gridTriggersSelectionChange = true;

				function setupQuoteGrid() {

					if (!platformGridAPI.grids.exist(quoteGridId)) {
						var quoteGridConfig = {
							columns: angular.copy(quoteGridColumns),
							data: [],
							id: quoteGridId,
							lazyInit: true,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: '',
								enableConfigSave: true
							}
						};
						platformGridAPI.grids.config(quoteGridConfig);
						platformTranslateService.translateGridConfig(quoteGridConfig.columns);
					}

					var headerCheckBoxFields = ['Selected'];
					var headerCheckBoxEvents = [
						{
							source: 'grid',
							name: 'onHeaderCheckboxChanged',
							fn: function (e) {
								var isSelected = (e.target.checked);
								if (isSelected) {
									$scope.canNextStep = true;
								}
							}
						}
					];
					basicsCommonHeaderColumnCheckboxControllerService.setGridId(quoteGridId);
					basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);
				}

				var fieldVarianceFormatterOptions = {
					decimalPlaces: 2,
					dataType: 'numeric'
				};

				var resultGridColumns = [
					{
						id: 'CatalogCode',
						field: 'CatalogCode',
						name: 'Catalog Code',
						name$tr$: 'project.main.catalogCode',
						readonly: true,
						width: 90,
						formatter: 'description'
					},
					{
						id: 'CatalogDescription',
						field: 'CatalogDescription',
						name: 'Catalog Description',
						name$tr$: 'project.main.catalogDescription',
						formatter: 'description',
						width: 150,
						readonly: true
					},
					{
						id: 'resultJobCatalogCode',
						field: 'JobCode',
						name: 'Job Code',
						name$tr$: 'project.main.updatePriceFromCatalogWizard.resultJobCode',
						formatter: 'code',
						width: 100
					},
					{
						id: 'resultJobCatalogDesc',
						field: 'JobDescription',
						name: 'Job Description',
						name$tr$: 'project.main.updatePriceFromCatalogWizard.resultJobDesc',
						formatter: 'description',
						width: 120
					},
					{
						id: 'MaterialCode',
						field: 'MaterialCode',
						name: 'Material Code',
						name$tr$: 'project.main.materialCode',
						width: 90,
						formatter: 'description'
					},
					{
						id: 'MaterialDescription',
						field: 'MaterialDescription',
						name: 'Material Description',
						name$tr$: 'project.main.materialDescription',
						width: 150,
						formatter: 'description',
						readonly: true
					},
					{
						id: 'UomFk',
						field: 'UomFk',
						name: 'UoM',
						name$tr$: 'project.main.uoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Uom',
							displayMember: 'Unit'
						},
						width: 100,
						readonly: true
					},
					{
						id: 'OldEstimatePrice',
						field: 'OldEstimatePrice',
						name: 'Old Estimate Price',
						name$tr$: 'project.main.oldEstimatePrice',
						width: 100,
						formatter: 'money',
						readonly: true
					},
					{
						id: 'NewEstimatePrice',
						field: 'NewEstimatePrice',
						name: 'New Estimate Price',
						name$tr$: 'project.main.newEstimatePrice',
						editor: 'money',
						width: 100,
						formatter: 'money',
						validator: validateNewEstimatePrice
					},
					{
						id: 'resultVariance',
						field: 'Variance',
						name: 'Variance',
						name$tr$: 'project.main.variance',
						formatter: projectMainUpdateResultFieldVarianceFormatter.formatter,
						formatterOptions: fieldVarianceFormatterOptions
					},
					{
						id: 'Source',
						field: 'Source',
						name: 'Source',
						name$tr$: 'project.main.source',
						width: 100,
						formatter: 'description',
						readonly: true
					},
					{
						id: 'Comment',
						field: 'Comment',
						name: 'Comment',
						name$tr$: 'project.main.comment',
						width: 150,
						editor: 'description',
						formatter: 'description'
					},
					{
						id: 'Co2Project',
						field: 'Co2Project',
						name: 'CO2/kg (Project)',
						name$tr$: 'procurement.common.entityCo2Project',
						width: 100,
						formatter: 'money',
						readonly: true
					},
					{
						id: 'Co2Source',
						field: 'Co2Source',
						name: 'CO2/kg (Source)',
						name$tr$: 'procurement.common.entityCo2Source',
						width: 100,
						formatter: 'money',
						readonly: true
					}
				];

				var resultGridId = '8A8EC7241D66414E86B76A92E0308AC3';

				$scope.updateMaterialPricesResult = {
					state: resultGridId
				};

				function setupResultGrid() {

					var columns = angular.copy(resultGridColumns);

					if (!platformGridAPI.grids.exist(resultGridId)) {
						var resultGridConfig = {
							columns: columns,
							data: [],
							id: resultGridId,
							lazyInit: true,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: ''
							}
						};
						platformGridAPI.grids.config(resultGridConfig);
						platformTranslateService.translateGridConfig(resultGridConfig.columns);
					}
				}

				function updateResultGrid(resultGridData) {

					platformGridAPI.grids.invalidate(resultGridId);
					platformGridAPI.items.data(resultGridId, resultGridData);

					projectMainUpdatePricesWizardCommonService.setResultGridData(resultGridData);
				}

				var contractGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						name: 'Selected',
						name$tr$: 'project.main.selected',
						editor: 'boolean',
						formatter: 'boolean',
						width: 75,
						headerChkbox: true
					},
					{
						id: 'ProjectCode',
						field: 'ProjectFk',
						name: 'Project Code',
						name$tr$: 'project.main.projectCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Project',
							displayMember: 'ProjectNo'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookup-data-project-project-dialog',
							lookupOptions: {
								showClearButton: true,
								'events': [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											var selectedItem = args.selectedItem;
											var entity = args.entity;
											if (!selectedItem) {
												entity.ContractFk = null;
												entity.ProjectName = null;
												validateContractFk(entity, entity.ContractFk);
											} else {
												entity.ProjectName = selectedItem.ProjectName;
											}
										}
									}
								]
							}
						},
						readonly: true,
						width: 90
					},
					{
						id: 'ProjectName',
						field: 'ProjectName',
						name: 'Project Name',
						name$tr$: 'project.main.projectName',
						formatter: 'description',
						width: 150,
						readonly: true
					},
					{
						id: 'ContractCode',
						field: 'ContractFk',
						name: 'Contract Code',
						name$tr$: 'project.main.contractCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ConHeader2material',
							displayMember: 'Code'
						},
						required: true,
						editor: 'lookup',
						editorOptions: {
							directive: 'procurement-Contract-To-Material-Lookup',
							lookupOptions: {
								filterKey: 'contract-header-filter',
								showClearButton: true,
								'events': [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											var entity = args.entity;
											var selectedItem = args.selectedItem;
											if (selectedItem !== null) {
												var gridDatas = projectMainUpdateMaterialPricesService.getGridData();
												for (var index = 0; index < gridDatas.length; index++) {

													if (gridDatas[index].ContractFk === selectedItem.Id) {
														platformModalService.showMsgBox($translate.instant('project.main.selectedContractExist'), $translate.instant('project.main.updateMaterialPricesFromContractTitle'), 'ico-info'); // jshint ignore:line
														gridDatas[gridDatas.length - 1].ContractFk = null;
														projectMainUpdateMaterialPricesService.setGridData(gridDatas);
														updateContractGrid(gridDatas);
														return;
													}
												}
												if (!entity.ProjectFk) { // todo livia
													entity.ProjectFk = selectedItem.ProjectFk;
													entity.ProjectName = selectedItem.ProjectName;
												}
												entity.Id = selectedItem.Id;
												entity.ContractDescription = selectedItem.Description;
												entity.BusinessPartnerFk = selectedItem.BusinessPartnerFk;
												entity.StatusFk = selectedItem.ConStatusFk;
												entity.OrderedDate = selectedItem.DateOrdered;

												projectMainUpdateMaterialPricesService.getContractsData(args.selectedItem.Id).then(function (result) {
													if (result.data) {
														if (result.data.Id === args.selectedItem.Id) {
															entity.ContractTypeFk = result.data.ConTypeFk;
															if (result.data.AddressEntity) {
																entity.Address = result.data.AddressEntity.AddressLine;
															}
														}
													}
												});
											}
										}
									}
								]
							}
						},
						width: 90,
						validator: validateContractFk
					},
					{
						id: 'ContractDescription',
						field: 'ContractDescription',
						name: 'Contract Description',
						name$tr$: 'project.main.contractDescription',
						width: 150,
						formatter: 'description',
						readonly: true
					},
					{
						id: 'BusinessPartnerName',
						field: 'BusinessPartnerFk',
						name: 'Business Partner Name',
						name$tr$: 'project.main.businessPartnerName',
						width: 150,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						},
						readonly: true
					},
					{
						id: 'Status',
						field: 'StatusFk',
						name: 'Status',
						name$tr$: 'project.main.status',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ConStatus',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService'
						},
						width: 100,
						readonly: true
					},
					{
						id: 'OrderedDate',
						field: 'OrderedDate',
						name: 'Ordered Date',
						name$tr$: 'project.main.orderedDate',
						width: 100,
						formatter: 'date',
						readonly: true
					},
					{
						id: 'ContractType',
						field: 'ContractTypeFk',
						name: 'Contract Type',
						name$tr$: 'project.main.entityContractTypeFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcContractType',
							displayMember: 'Description'
						},
						width: 100
					},
					{
						id: 'Address',
						field: 'Address',
						name: 'Address',
						name$tr$: 'project.main.projectAddressGroup',
						formatter: 'description',
						width: 150,
						readonly: true
					}
				];

				var contractGridId = '562147AF81AE47D7A559C5B19604B337';

				function validateContractFk(entity, value) {

					if (!value) {
						entity.BusinessPartnerFk = null;
						entity.ContractDescription = null;
						entity.OrderedDate = null;
						entity.StatusFk = null;
						entity.Address = null;
						entity.ContractTypeFk = null;
					}

				}

				$scope.updatePricesFromContract = {
					state: contractGridId
				};

				function setupContractGrid() {

					if (!platformGridAPI.grids.exist(contractGridId)) {
						var contractGridConfig = {
							columns: angular.copy(contractGridColumns),
							data: [],
							id: contractGridId,
							lazyInit: true,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: '',
								enableConfigSave: true
							}
						};
						platformGridAPI.grids.config(contractGridConfig);
						platformTranslateService.translateGridConfig(contractGridConfig.columns);
						var headerCheckBoxFields = ['Selected'];
						var headerCheckBoxEvents = [
							{
								source: 'grid',
								name: 'onHeaderCheckboxChanged',
								fn: function (e) {
									var isSelected = (e.target.checked);
									if (isSelected) {
										$scope.canNextStep = true;
									}
								}
							}
						];
						basicsCommonHeaderColumnCheckboxControllerService.setGridId(contractGridId);
						basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);
					}
				}

				function updateContractGrid(contractsData) {

					platformGridAPI.grids.invalidate(contractGridId);
					platformGridAPI.items.data(contractGridId, contractsData);
				}

				function updateQuoteGrid(quotesData) {

					platformGridAPI.grids.invalidate(quoteGridId);
					platformGridAPI.items.data(quoteGridId, quotesData);
				}

				function updateGrid(GridDatas) {
					updateResultGrid(GridDatas);
				}

				// endregion

				$scope.FilterRequest = {
					disabled: true
				};
				$scope.LastFilterRequest = {
					disabled: true
				};

				function updateQuotesDate() {
					var quotesData = [];
					setupQuoteGrid();
					projectMainUpdateMaterialPricesService.getQuotesDataByPaging($scope.currentItem).then(function (result) {
						var data = result.data.Data;
						count = result.data.Count;
						basicsLookupdataLookupDescriptorService.updateData('Project', result.data.Project);
						if (data !== null && data.length > 0) {
							for (var i = 0, len = data.length; i < len; i++) {
								var quoteGrid = {
									Id: data[i].Id,
									Selected: false,
									ProjectFk: data[i].ProjectFk,
									ProjectName: data[i].ProjectFk,
									QuoteFk: data[i].Id,
									QuoteDescription: data[i].Description,
									BusinessPartnerFk: data[i].BusinessPartnerFk,
									Version: data[i].QuoteVersion,
									StatusFk: data[i].StatusFk,
									QuotedDate: data[i].DateQuoted
								};
								quotesData.push(quoteGrid);
							}
						}
						$timeout(function () {
							projectMainUpdateMaterialPricesService.setGridData(quotesData);
							updateQuoteGrid(quotesData);
						}, 200);
						$scope.LastFilterRequest.disabled = false;
						$scope.tools.update();
					});
				}

				function updasteContractsDate() {
					var contractData = [];
					setupContractGrid();
					projectMainUpdateMaterialPricesService.getContractsByPaging($scope.currentItem).then(function (result) {
						var data = result.data.Data;
						count = result.data.Count;
						basicsLookupdataLookupDescriptorService.updateData('Project', result.data.Project);
						if (data !== null && data.length > 0) {
							for (var i = 0, len = data.length; i < len; i++) {
								var addressLine = '';
								if (data[i].AddressEntity !== null) {
									addressLine = data[i].AddressEntity.AddressLine;
								}
								var contractGrid = {
									Id: data[i].Id,
									Selected: false,
									ProjectFk: data[i].ProjectFk,
									ProjectName: data[i].ProjectFk,
									ContractFk: data[i].Id,
									ContractDescription: data[i].Description,
									BusinessPartnerFk: data[i].BusinessPartnerFk,
									StatusFk: data[i].ConStatusFk,
									OrderedDate: data[i].DateOrdered,
									ContractTypeFk: data[i].ConTypeFk,
									Address: addressLine
								};
								contractData.push(contractGrid);
							}
						}
						$timeout(function () {
							projectMainUpdateMaterialPricesService.setGridData(contractData);
							updateContractGrid(contractData);
						}, 200);
						$scope.LastFilterRequest.disabled = false;
						$scope.tools.update();
					});
				}
				$scope.toggleFilter = function (active, clearFilter) {
					if ($scope.currentStep === 'quotePage') {
						$scope.gridId = quoteGridId;
					} else {
						$scope.gridId = contractGridId;
					}
					platformGridAPI.filters.showSearch($scope.gridId, active, clearFilter);
				};

				$scope.toggleColumnFilter = function (active, clearFilter) {
					if ($scope.currentStep === 'quotePage') {
						$scope.gridId = quoteGridId;
					} else {
						$scope.gridId = contractGridId;
					}
					platformGridAPI.filters.showColumnSearch($scope.gridId, active, clearFilter);
				};
				let searchAllToggle = {
					id: 'gridSearchAll',
					sort: 150,
					caption: 'cloud.common.taskBarSearch',
					type: 'check',
					iconClass: 'tlb-icons ico-search-all',
					fn: function () {
						$scope.toggleFilter(this.value);

						if (this.value) {
							searchColumnToggle.value = false;
							$scope.toggleColumnFilter(false, true);
						}
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				};
				let searchColumnToggle = {
					id: 'gridSearchColumn',
					sort: 160,
					caption: 'cloud.common.taskBarColumnFilter',
					type: 'check',
					iconClass: 'tlb-icons ico-search-column',
					fn: function () {
						$scope.toggleColumnFilter(this.value);

						if (this.value) {
							searchAllToggle.value = false;
							$scope.toggleFilter(false, true);
						}
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				};

				var toolItems = [
					{
						type: 'item',
						id: 'updatePricesPreviousEntity',
						sort: 2,
						caption: 'cloud.common.previousPage',
						iconClass: 'tlb-icons control-icons ico-previous',
						fn: function () {
							switch ($scope.currentStep) {
								case 'quotePage':
									if ($scope.currentItem.pageNumber > 0) {
										$scope.currentItem.pageNumber--;
										updateQuotesDate();
									}
									break;
								case 'contractPage':
									if ($scope.currentItem.pageNumber > 0) {
										$scope.currentItem.pageNumber--;
										updasteContractsDate();
									}
									break;
								default :
									break;
							}

						},
						disabled: function () {
							if ($scope.currentItem.pageNumber === 0) {
								$scope.LastFilterRequest.disabled = true;
							}
							if ((count - $scope.currentItem.pageNumber * $scope.currentItem.pageSize) > $scope.currentItem.pageSize) {
								$scope.FilterRequest.disabled = false;
							}
							return $scope.LastFilterRequest.disabled;
						}
					},
					{
						type: 'item',
						id: 'updatePricesNextEntity',
						sort: 1,
						caption: 'cloud.common.nextPage',
						iconClass: 'tlb-icons control-icons ico-next',
						fn: function () {
							switch ($scope.currentStep) {

								case 'quotePage':
									$scope.currentItem.pageNumber++;
									updateQuotesDate();
									break;
								case 'contractPage':
									$scope.currentItem.pageNumber++;
									updasteContractsDate();
									break;
								default:

									break;
							}
						},
						disabled: function () {
							if ($scope.currentItem.pageSize >= (count - $scope.currentItem.pageNumber * $scope.currentItem.pageSize)) {
								$scope.FilterRequest.disabled = true;
							}
							return $scope.FilterRequest.disabled;
						}
					},
					{
						type: 'item',
						id: 'updatePricesAddEntity',
						sort: 3,
						caption: 'cloud.common.taskBarNewRecord',
						iconClass: 'tlb-icons ico-new',
						fn: function () {
							var gridDatas = projectMainUpdateMaterialPricesService.getGridData();
							var gridData;
							var gridId = 0;
							var length = gridDatas.length;
							var createProject = null;
							if ($scope.currentItem.projectfk) {
								createProject = $scope.currentItem.projectfk;
							}
							if (length > 0) {
								gridData = {
									Id: gridDatas[length - 1].Id + 1,
									Selected: false,
									ProjectFk: createProject
								};
							} else {
								gridData = {
									Id: 1,
									Selected: true,
									ProjectFk: createProject
								};
							}

							gridDatas.push(gridData);

							projectMainUpdateMaterialPricesService.setGridData(gridDatas);

							if ($scope.currentStep === 'quotePage') {
								updateQuoteGrid(gridDatas);
								gridId = quoteGridId;
							} else {
								updateContractGrid(gridDatas);
								gridId = contractGridId;
							}

							platformGridAPI.rows.selection({
								gridId: gridId,
								rows: [gridData]
							});
						},
						disabled: function () {
						}
					},
					{
						type: 'item',
						id: 'updatePricesRemoveEntity',
						sort: 4,
						caption: 'cloud.common.taskBarDeleteRecord',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {
							var gridDatas = projectMainUpdateMaterialPricesService.getGridData();
							var gridId = 0;

							if ($scope.currentStep === 'quotePage') {
								gridId = quoteGridId;
							} else {
								gridId = contractGridId;
							}

							var selected = platformGridAPI.rows.selection({
								gridId: gridId
							});

							selected = _.isArray(selected) ? selected[0] : selected;
							for (var i = 0; i < gridDatas.length; i++) {
								if (selected && (gridDatas[i].Id === selected.Id)) {
									gridDatas.splice(i, 1);
								}
							}

							projectMainUpdateMaterialPricesService.setGridData(gridDatas);

							if ($scope.currentStep === 'quotePage') {
								updateQuoteGrid(gridDatas);
							} else {
								updateContractGrid(gridDatas);
							}

							var newSelectedRow = gridDatas[gridDatas.length - 1];
							platformGridAPI.rows.selection({
								gridId: gridId,
								rows: [newSelectedRow]
							});
						},
						disabled: function () {
						}
					},
					searchAllToggle,
					searchColumnToggle,
					{
						id: 'print',
						sort: 110,
						caption: 'cloud.common.print',
						iconClass: 'tlb-icons ico-print-preview',
						type: 'item',
						fn: function () {
							let gridId=0;
							if ($scope.currentStep === 'quotePage') {
								gridId = quoteGridId;
							} else {
								gridId = contractGridId;
							}
							$injector.get('reportingPrintService').printGrid(gridId);
						}
					},
					{
						id: 'gridConfig',
						caption: 'cloud.common.gridSettings',
						type: 'item',
						icoClass: 'tlb-icons ico-settings',
						cssClass: 'tlb-icons ico-settings',
						fn: function () {

							if ($scope.currentStep === 'quotePage') {
								$scope.gridId = quoteGridId;
							} else {
								$scope.gridId = contractGridId;
							}
							platformGridAPI.configuration.openConfigDialog($scope.gridId );
						},
						disabled: function () {
							return false;
						}
					}
				];

				$scope.tools = {
					cssClass: 'tools',
					rootPath: 'tools',
					showImages: true,
					showTitles: false,
					items: toolItems,
					update: function () {
						$scope.tools.version += 1;
					}
				};

				function onQuoteSelectRowsChanged(e, arg) {   // jshint ignore:line
					var valid = true;
					var selected = platformGridAPI.rows.selection({
						gridId: quoteGridId
					});
					var gridDatas = projectMainUpdateMaterialPricesService.getGridData();
					for (var i = 0; i < gridDatas.length; i++) {
						if (gridDatas[i].QuoteFk === null) {
							if (selected && (gridDatas[i].Id !== selected.Id)) {
								valid = false;
							}
						}
					}

					if (!valid) {
						platformModalService.showMsgBox($translate.instant('project.main.newInsertCodeError'), $translate.instant('project.main.updateMaterialPricesFromQuoteTitle'), 'warning'); // jshint ignore:line
					}
				}

				function onContractSelectRowsChanged(e, arg) {   // jshint ignore:line  todo livia
					var valid = true;
					var selected = platformGridAPI.rows.selection({
						gridId: contractGridId
					});

					var gridDatas = projectMainUpdateMaterialPricesService.getGridData();
					for (var i = 0; i < gridDatas.length; i++) {
						if (gridDatas[i].ContractFk === null) {
							if (selected && (gridDatas[i].Id !== selected.Id)) {
								valid = false;
							}
						}
					}

					if (!valid) {
						platformModalService.showMsgBox($translate.instant('project.main.newInsertCodeError'), $translate.instant('project.main.updateMaterialPricesFromContractTitle'), 'warning'); // jshint ignore:line
					}
				}

				platformGridAPI.events.register(quoteGridId, 'onSelectedRowsChanged', onQuoteSelectRowsChanged);
				platformGridAPI.events.register(contractGridId, 'onSelectedRowsChanged', onContractSelectRowsChanged);

				function canNextStep() {
					if ($scope.currentStep === 'catalogPage') {
						let projectMaterialsToUpdate = projectMainUpdatePriceFromCatalogProjectMaterialService.getListSelectedWithModification();
						var prjDataService = $injector.get('projectMainUpdatePriceFromCatalogPriceListService');
						let dataSvr = $injector.get('projectMainUpdatePriceFromCatalogProjectMaterialService');
						var prjMaterial = dataSvr.getSelected();
						let list=prjDataService.getList();
						if(!_.isNil(prjMaterial)) {
							let modifications;
							if(prjMaterial.Selected) {
								modifications= _.filter(list, function (item) {
									return item.Selected && item.MaterialId === prjMaterial.MaterialId;
								});
								if(modifications.length>0) {
									for (let i = 0; i < modifications.length; i++) {
										if (_.isNil(modifications[i].Co2Project)) {
											modifications[i].Co2Project = 0;
										}
										if (_.isNil(prjMaterial.Co2Project)) {
											prjMaterial.Co2Project = 0;
										}
										if (_.isNil(modifications[i].Co2Source)) {
											modifications[i].Co2Source = 0;
										}
										if (_.isNil(prjMaterial.Co2Source)) {
											prjMaterial.Co2Source = 0;
										}
										if (modifications[i].Co2Project !== prjMaterial.Co2Project || modifications[i].Co2Source !== prjMaterial.Co2Source || modifications[i].Co2SourceFk !== prjMaterial.Co2SourceFk) {
											co2Attr.add(modifications[i].MaterialId);
											break;
										}else{
											co2Attr.clear();
										}
									}
								}else{
									co2Attr.clear();
								}
							}else{
								co2Attr.clear();
							}
						}else{
							co2Attr.clear();
						}
						let isUpdate = angular.isArray(projectMaterialsToUpdate) ? projectMaterialsToUpdate.length > 0 : false;
						if(co2Attr.size > 0){
							return true;
						}
						return  isUpdate;
					}
					if ($scope.currentStep === 'optionPage' && $scope.optionPage.radioSelect) {
						return true;
					}

					if ($scope.currentStep === 'resultPage') {
						var grid = platformGridAPI.grids.element('id', resultGridId);
						if (grid && grid.dataView) {
							var resultData = grid.dataView.getRows();
							let tempCo2Attr = _.filter(resultData,(item)=>{
								return 	item.Co2Project !== item.OldCo2Project || item.Co2Source !== item.OldCo2Source;
							});
							var tempDataModified = _.filter(resultData, function (item) {
								return !projectMainUpdateResultFieldVarianceFormatter.isEqualToZero(item.Variance, fieldVarianceFormatterOptions.decimalPlaces, fieldVarianceFormatterOptions.dataType);
							});
							if(tempCo2Attr.length>0){
								return  true;
							}
							return angular.isArray(tempDataModified) ? tempDataModified.length > 0 : false;
						} else {
							return false;
						}
					}
					if ($scope.currentStep === 'catalogMatrialPage') {
						let byMaterialCatalogService = $injector.get('projectMainUpdatePriceByMaterialCatalogService');
						let itemList = byMaterialCatalogService.getList();
						if (itemList.length>=1) {
							let selectedItems = _.filter(itemList, {Selected: true});
							for (let i = 0; i < selectedItems.length; i++) {
								if(selectedItems[i].hasOwnProperty('Children')) {
									if (!_.isNil(selectedItems[i].MaterialPriceVersionFk)) {
										return true;
									} else {
										let childrenItems = selectedItems[i].Children;
										if (childrenItems) {
											for (let i = 0; i < childrenItems.length; i++) {
												if (childrenItems[i].Selected && !_.isNil(childrenItems[i].MaterialPriceVersionFk)) {
													return true;
												}
											}
										}
									}
								}else{
									if (!_.isNil(selectedItems[i].MaterialPriceVersionFk)) {
										return true;
									}
								}
							}
						}
					}

					var gridDatas = projectMainUpdateMaterialPricesService.getGridData();

					var enableNext = false;
					if (angular.isArray(gridDatas) && gridDatas.length > 0) {
						for (var index = 0; index < gridDatas.length; index++) {
							if (gridDatas[index].Selected) {
								enableNext = true;
							}
						}

						if ($scope.currentStep === 'quotePage') {
							for (var i = 0; i < gridDatas.length; i++) {
								if (gridDatas[i].QuoteFk === null) {
									enableNext = false;
								}
							}
						} else if ($scope.currentStep === 'contractPage') {
							for (var j = 0; j < gridDatas.length; j++) {
								if (gridDatas[j].ContractFk === null) {
									enableNext = false;
								}
							}
						}
					}

					return enableNext;
				}

				$scope.$watch(function () {
					$scope.canNextStep = canNextStep();
				});

				$scope.moveStep = function (stepStatus) {
					if (!$scope.actionType || stepStatus === 'previous') {
						reset(stepStatus);
						var result = {
							stepStatus: stepStatus,
							variableValue: {
								count: count
							}
						};
						switch ($scope.currentStep) {
							case 'optionPage':
								result.data = {
									radioSelect: $scope.optionPage.radioSelect,
									catalogSelect: $scope.optionPage.catalogSelect
								};
								break;
							case 'quotePage':
							case 'contractPage':
								result.data = {
									currentItem: $scope.currentItem,
									FilterRequest: $scope.FilterRequest,
									LastFilterRequest: $scope.LastFilterRequest
								};
								break;
							default:
								break;
						}
						$scope.close(result);
						return;
					}

					// if actionType is not null, the next button executes as function Update
					var usingInSummary = projectMainUpdatePricesWizardCommonService.isUsingInEstimateResourceSummary();
					var selectedProject = projectMainService.getSelected();
					var promise = null;
					var data = null;
					var i = 0;
					var countUpdatedData = 0;
					var bodyText = null;
					var headerText = null;
					if ($scope.actionType === 'executeUpdateFromCatalog') {
						var projectId = projectMainUpdatePriceFromCatalogMainService.projectId;
						var projectMaterialsToUpdate = projectMainUpdatePriceFromCatalogProjectMaterialService.getListSelectedWithModification(co2Attr);
						var anySelectedPrjMaterial = angular.isArray(projectMaterialsToUpdate) ? projectMaterialsToUpdate.length > 0 : false;
						if (!anySelectedPrjMaterial) {
							bodyText = $translate.instant('project.main.updatePriceFromCatalogWizard.noModifiedProjectMaterialSelectedDetail');
							headerText = $translate.instant('project.main.update');
							platformModalService.showMsgBox(bodyText, headerText, 'ico-info');
							return;
						}

						var prjMatIds = _.map(projectMaterialsToUpdate, function (item) {
							return item.Id;
						});
						var specifiedPrjMaterial2PriceList = projectMainUpdatePriceFromCatalogPriceListService.getListByPrjMaterialIds(prjMatIds);
						var prjMaterial2SourceOption = projectMainUpdatePriceFromCatalogPriceListService.getSourceOptionsByPrjMaterialIds(prjMatIds);
						var isValid = projectMainUpdatePriceFromCatalogPriceListService.checkIsValid(specifiedPrjMaterial2PriceList);
						if (!isValid) {
							platformModalService.showMsgBox('project.main.updatePriceFromCatalogWizard.updateDataNotCorrect', 'project.main.update', 'error');
							return;
						}
						data = {
							ProjectId: projectId,
							ProjectMaterialsToUpdate: projectMaterialsToUpdate,
							SpecifiedPrjMaterial2PriceList: specifiedPrjMaterial2PriceList,
							PrjMaterial2SourceOption: prjMaterial2SourceOption
						};
						promise = projectMainUpdateMaterialPricesService.updatePricesWithSpecifiedPriceList(data);
						countUpdatedData = projectMaterialsToUpdate.length;
					} else if ($scope.actionType === 'executeUpdate') {
						var grid = platformGridAPI.grids.element('id', resultGridId);
						var gridDatas = grid.dataView.getRows();
						let tempCo2Attr = _.filter(gridDatas,(item)=>{
							return 	item.Co2Project !== item.OldCo2Project || item.Co2Source !== item.OldCo2Source;
						});
						var tempDataModified = _.filter(gridDatas, function (item) {
							return !projectMainUpdateResultFieldVarianceFormatter.isEqualToZero(item.Variance, fieldVarianceFormatterOptions.decimalPlaces, fieldVarianceFormatterOptions.dataType) &&!(
								(item.Co2Project !== item.OldCo2Project) && (item.Co2Source !== item.OldCo2Source)
							);
						});
						var anyModified = angular.isArray(tempDataModified) ? tempDataModified.length > 0 : false;
						if(tempCo2Attr.length>0){
							anyModified =  true;
							tempDataModified = tempCo2Attr;
						}
						if (!anyModified) {
							bodyText = $translate.instant('project.main.updatePriceFromCatalogWizard.noModifiedProjectMaterial');
							headerText = $translate.instant('project.main.update');
							platformModalService.showMsgBox(bodyText, headerText, 'ico-info');
							return;
						}
						var priceConditions = projectMainUpdateMaterialPricesService.getPriceConditions();
						var materialDatas = [];

						for (i = 0; i < tempDataModified.length; i++) {
							var materialData = {
								Id: tempDataModified[i].Id,
								EstimatePrice: tempDataModified[i].NewEstimatePrice,
								PriceConditionFk: 0,
								CommentText: tempDataModified[i].Comment,
								PriceConditions: [],
								ProjectId: selectedProject ? selectedProject.Id : null,
								MaterialCode: tempDataModified[i].MaterialCode,
								Co2Project : tempDataModified[i].Co2Project,
								Co2Source : tempDataModified[i].Co2Source
							};

							for (var k = 0; k < priceConditions.length; k++) {
								if (tempDataModified[i].Id === priceConditions[k].Id) {
									materialData.PriceConditionFk = priceConditions[k].PriceConditionFk;
									materialData.PriceConditions = priceConditions[k].PriceConditions;
								}
							}

							materialDatas.push(materialData);
						}

						promise = projectMainUpdateMaterialPricesService.processUpdate(materialDatas);
						countUpdatedData = materialDatas.length;
					}else if($scope.actionType==='executeUpdateByMaterialCatalog'){
						var materialDatas = [];
						let itemList = projectMainUpdatePriceByMaterialCatalogService.getList();
						let allSelectedItem = _.filter(itemList,{Selected:true});
						_.forEach(allSelectedItem, (item)=>{
							if(item.Selected && item.nodeInfo.lastElement && !_.isNil(item.MaterialPriceVersionFk)){
								var materialData = {
									Id: item.Id,
									ProjectId : projectMainUpdatePriceFromCatalogMainService.projectId,
									MaterialPriceVersionFk: item.MaterialPriceVersionFk,
									IsBase: item.MaterialPriceVersionFk === -1 ? true : false
								};
								materialDatas.push(materialData);
							}
						});
						promise = projectMainUpdateMaterialPricesService.updateFromCatalogs(materialDatas);
						countUpdatedData = materialDatas.length;
					}

					if (promise) {
						afterUpdate(promise, selectedProject, usingInSummary, countUpdatedData);
					}
				};

				function initialize() {

					var selectPrj = projectMainUpdatePricesWizardCommonService.getProject();

					var data = null;
					var i = 0;
					switch ($scope.currentStep) {
						case 'quotePage':
							var quotesData = projectMainUpdateMaterialPricesService.getGridData();
							$scope.currentItem = $scope.currentItem || {};
							if (!$scope.currentItem.projectfk) {
								angular.extend($scope.currentItem, {projectfk: selectPrj ? selectPrj.Id : null});
							}
							setupQuoteGrid();

							var currentGridDatas = [];
							if (!$scope.currentItem.statusfk || $scope.currentItem.statusfk < 0) {
								currentGridDatas = quotesData;
							} else {
								var currentStatus = $scope.currentItem.statusfk;
								var currentProject = $scope.currentItem.projectfk;
								for (i = 0; i < quotesData.length; i++) {
									if (currentStatus === quotesData[i].StatusFk || currentProject === quotesData[i].ProjectFk) {
										currentGridDatas.push(quotesData[i]);
									}
								}
							}
							$timeout(function () {
								updateQuoteGrid(quotesData);
							}, 200);
							break;
						case 'contractPage':
							var contractData = projectMainUpdateMaterialPricesService.getGridData();
							$scope.currentItem = $scope.currentItem || {};
							if (!$scope.currentItem.projectfk) {
								angular.extend($scope.currentItem, {projectfk: selectPrj ? selectPrj.Id : null});
							}
							setupContractGrid();
							$timeout(function () {
								updateContractGrid(contractData);
							}, 200);
							break;
						case 'catalogPage':
							projectMainUpdatePriceFromCatalogProjectMaterialService.load();
							break;
						case 'resultPage':
							var updateResultData = [];
							setupResultGrid();
							var materialDependIds = [];
							var gridData = projectMainUpdateMaterialPricesService.getGridData();
							var selectQuoteStatus = ($scope.previousStep === 'quotePage') && (!!$scope.currentItem.statusfk && $scope.currentItem.statusfk > 0);

							if (angular.isArray(gridData) && gridData.length > 0) {
								for (var index = 0; index < gridData.length; index++) {
									if (selectQuoteStatus) {
										if (gridData[index].Selected && (gridData[index].StatusFk === $scope.currentItem.statusfk)) {
											materialDependIds.push(gridData[index].Id);
										}
									} else if (gridData[index].Selected) {
										materialDependIds.push(gridData[index].Id);
									}
								}
							}

							var selectedEstHeaderItem = $injector.get ('estimateMainService').getSelectedEstHeaderItem();
							data = {
								previousStep: $scope.previousStep === 'quotePage' ? 1 : 2,
								quoteIds: materialDependIds,
								prjId: selectPrj ? selectPrj.Id : null,
								estHeaderFk: selectedEstHeaderItem ? selectedEstHeaderItem.Id:null
							};

							projectMainUpdateMaterialPricesService.getResultGridData(data).then(function (response) {
								var resultdatas = response.data;
								for (i = 0; i < resultdatas.length; i++) {
									var updateResultGrid = {
										Id: resultdatas[i].Id,
										CatalogCode: resultdatas[i].CatalogCode,
										CatalogDescription: resultdatas[i].CatalogDescription,
										MaterialCode: resultdatas[i].MaterialCode,
										MaterialDescription: resultdatas[i].MaterialDescription,
										UomFk: resultdatas[i].Uom,
										OldEstimatePrice: resultdatas[i].OldEstimatePrice,
										NewEstimatePrice: resultdatas[i].NewEstimatePrice,
										Source: resultdatas[i].Source,
										Comment: resultdatas[i].CommentText,
										JobId: resultdatas[i].JobId,
										JobCode: resultdatas[i].JobCode,
										JobDescription: resultdatas[i].JobDescription,
										Variance: resultdatas[i].Variance,
										Co2Project : resultdatas[i].Co2Project === null ? 0 : resultdatas[i].Co2Project,
										Co2Source : resultdatas[i].Co2Source === null ? 0 : resultdatas[i].Co2Source,
										OldCo2Project : resultdatas[i].OldCo2Project === null ? 0 : resultdatas[i].OldCo2Project,
										OldCo2Source: resultdatas[i].OldCo2Source === null ? 0 : resultdatas[i].OldCo2Source
									};

									var priceCondition = {
										Id: resultdatas[i].Id,
										PriceConditionFk: resultdatas[i].PriceConditionFk,
										PriceConditions: resultdatas[i].PriceConditions
									};

									projectMainUpdateMaterialPricesService.addPriceConditions(priceCondition);
									updateResultData.push(updateResultGrid);
								}
								updateGrid(updateResultData);
							});
							break;
						case 'catalogMatrialPage':
							projectMainUpdatePriceByMaterialCatalogService.load();
							break;
						default:
							break;
					}
				}

				// add by jack
				$scope.searchProject = function () {
					var selectMainPrj = projectMainService.getSelected();
					switch ($scope.currentStep) {

						case 'quotePage':
							var quotesData = [];
							setupQuoteGrid();
							$scope.currentItem.pageNumber = 0;
							$scope.currentItem.pageSize = 10;
							$scope.currentItem.selectPrj = selectMainPrj ? selectMainPrj.Id : null;
							projectMainUpdateMaterialPricesService.getQuotesDataByPaging($scope.currentItem).then(function (result) {
								var data = result.data.Data;
								count = result.data.Count;
								basicsLookupdataLookupDescriptorService.updateData('Project', result.data.Project);
								if (data !== null && data.length > 0) {
									for (var i = 0, len = data.length; i < len; i++) {
										var quoteGrid = {
											Id: data[i].Id,
											Selected: false,
											ProjectFk: data[i].ProjectFk,
											ProjectName: data[i].ProjectFk,
											QuoteFk: data[i].Id,
											QuoteDescription: data[i].Description,
											BusinessPartnerFk: data[i].BusinessPartnerFk,
											Version: data[i].QuoteVersion,
											StatusFk: data[i].StatusFk,
											QuotedDate: data[i].DateQuoted
										};
										quotesData.push(quoteGrid);
									}
								}

								$timeout(function () {
									projectMainUpdateMaterialPricesService.setGridData(quotesData);
									updateQuoteGrid(quotesData);
								}, 200);

								$scope.FilterRequest.disabled = false;
								$scope.LastFilterRequest.disabled = true;
								if ($scope.currentItem.pageSize >= (count - $scope.currentItem.pageNumber * $scope.currentItem.pageSize)) {
									$scope.FilterRequest.disabled = true;
								}
								$scope.tools.update();
							});
							break;
						case 'contractPage':
							var contractData = [];
							setupContractGrid();
							$scope.currentItem.pageNumber = 0;
							$scope.currentItem.pageSize = 10;
							$scope.currentItem.selectPrj = selectMainPrj ? selectMainPrj.Id : null;
							projectMainUpdateMaterialPricesService.getContractsByPaging($scope.currentItem).then(function (result) {
								var data = result.data.Data;
								count = result.data.Count;
								basicsLookupdataLookupDescriptorService.updateData('Project', result.data.Project);
								for (var i = 0, len = data.length; i < len; i++) {
									var addressLine = '';
									if (data[i].AddressEntity !== null) {
										addressLine = data[i].AddressEntity.AddressLine;
									}
									var contractGrid = {
										Id: data[i].Id,
										Selected: false,
										ProjectFk: data[i].ProjectFk,
										ProjectName: data[i].ProjectFk,
										ContractFk: data[i].Id,
										ContractDescription: data[i].Description,
										BusinessPartnerFk: data[i].BusinessPartnerFk,
										StatusFk: data[i].ConStatusFk,
										OrderedDate: data[i].DateOrdered,
										ContractTypeFk: data[i].ConTypeFk,
										Address: addressLine
									};
									contractData.push(contractGrid);
								}

								$timeout(function () {
									projectMainUpdateMaterialPricesService.setGridData(contractData);
									updateContractGrid(contractData);
								}, 200);
								$scope.FilterRequest.disabled = false;
								$scope.LastFilterRequest.disabled = true;
								if ($scope.currentItem.pageSize >= (count - $scope.currentItem.pageNumber * $scope.currentItem.pageSize)) {
									$scope.FilterRequest.disabled = true;
								}
								$scope.tools.update();
							});
							break;
						default:
							break;
					}
				};

				var filters = [{
					key: 'quote-header-filter',
					serverSide: true,
					fn: function (currentItem) {
						if (currentItem && currentItem.ProjectFk) {
							return 'ProjectFk = ' + currentItem.ProjectFk;
						}
						return '';
					}
				}, {
					key: 'contract-header-filter',
					serverKey: 'contract-header-filter',
					serverSide: true,
					fn: function (currentItem) {
						if (currentItem && currentItem.ProjectFk) {
							return 'ProjectFk = ' + currentItem.ProjectFk;
						}
						return '';
					}
				}, {
					key: 'project-main-update-quote-status-filter',
					fn: function (currentItem) {
						var isStatus = true;
						if (currentItem.Description === 'Rejected') {
							if (!currentItem.IsOrdered) {
								isStatus = false;
							}
						}
						return isStatus;
					}
				}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
					projectMainUpdatePriceFromCatalogProjectMaterialService.calculating.unregister(onCalculating);

					if (clearAll) {
						if (platformGridAPI.grids.exist(quoteGridId)) {
							platformGridAPI.grids.unregister(quoteGridId);
						}

						if (platformGridAPI.grids.exist(contractGridId)) {
							platformGridAPI.grids.unregister(contractGridId);
						}
						// clear data
						projectMainUpdatePriceFromCatalogMainService.reset();
						projectMainUpdatePriceFromCatalogProjectMaterialService.reset();
						projectMainUpdatePriceFromCatalogPriceListService.reset();
						projectMainUpdateMaterialPricesService.reset();
						projectMainUpdatePriceByMaterialCatalogService.reset();
						$scope.resetStepInfo();
					}
				});

				$scope.close = function (result) {
					clearAll = !result || !result.stepStatus;
					$scope.$parent.$close(result || false);
				};

				$scope.updateAllWithBase = updateAllWithBase;
				$scope.showUpdateAll = showUpdateAll;
				$scope.canUpdateFromCatalog = projectMainUpdatePriceFromCatalogMainService.projectId > 0;
				$scope.canUpdateAllWithBase = canUpdateAllWithBase;
				$scope.fromCatalog = {
					isCalculatingEstimatePrice: false,
					isPriceListLoading: false
				};
				$scope.showNote = function (){
					return $scope.currentStep === 'catalogPage';
				};
				projectMainUpdatePriceFromCatalogProjectMaterialService.calculating.register(onCalculating);

				angular.extend($scope, $scope.options.body);
				angular.extend($scope, $scope.options.data);
				if (!$scope.optionPage.radioSelect) {
					$scope.optionPage.radioSelect = selectedProject ? 'fromCatalog' : 'fromQuote';
				}
				count = $scope.options.variableValue.count;

				initialize();

				function updateAllWithBase() {
					projectMainUpdatePriceFromCatalogProjectMaterialService.changeSourceOptionByPriceVersionId(null, projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId);
				}

				function showUpdateAll() {
					return $scope.currentStep === 'catalogPage';
				}

				function canUpdateAllWithBase() {
					return projectMainUpdatePriceFromCatalogProjectMaterialService.getList().length > 0;
				}

				function afterUpdate(promise, selectedProject, usingInSummary, countUpdatedData) {
					promise.then(function (response) {
						if (response.data === true) {
							if (!usingInSummary) {
								platformModalService.showMsgBox($translate.instant('project.main.updatePriceFromCatalogWizard.updateSuccessfulWithCount', {count: countUpdatedData}),
									$translate.instant('project.main.updateMaterialPricesTitle'), 'ico-info').then(function (response) {
									if (response.ok === true) {
										projectMainService.deselect();
										projectMainService.load().then(function () {
											projectMainService.setSelected(selectedProject);
											var gridId = '713B7D2A532B43948197621BA89AD67A';
											platformGridAPI.rows.scrollIntoViewByItem(gridId, selectedProject);
										});
									}
								});

								$scope.close();
							} else {
								projectMainUpdatePricesWizardCommonService.onMaterialPriceDataSet.fire();
								$scope.close();
							}
						} else {
							if(response.data.hasOwnProperty('status')){
								platformModalService.showMsgBox($translate.instant('project.main.updatePriceFromCatalogWizard.updateSuccessfulCount', {successCount: response.data.success}),
									$translate.instant('project.main.updateMaterialPricesTitle'), 'ico-info').then(function (response) {
									if (response.ok === true) {
										projectMainService.deselect();
										projectMainService.load().then(function () {
											projectMainService.setSelected(selectedProject);
											var gridId = '713B7D2A532B43948197621BA89AD67A';
											platformGridAPI.rows.scrollIntoViewByItem(gridId, selectedProject);
										});
									}
								});
								$scope.close();
							}else {
								platformModalService.showMsgBox($translate.instant('project.main.updateMaterialPricesFailed'), $translate.instant('project.main.updateMaterialPricesTitle'), 'ico-info'); // jshint ignore:line
							}
						}
					});
				}

				function onCalculating(e, value) {
					$scope.fromCatalog.isCalculatingEstimatePrice = value;
				}

				function resetCurrentItem() {
					$scope.currentItem = {
						statusfk: null,
						projectfk: null,
						pattern: '',
						pageSize: 10,
						pageNumber: 0,
						selectPrj: null
					};
				}

				function reset(stepStatus) {
					if (stepStatus === 'previous') {
						switch ($scope.currentStep) {
							case 'quotePage':
							case 'contractPage':
								projectMainUpdateMaterialPricesService.setGridData([]);
								$scope.FilterRequest.disabled = true;
								$scope.LastFilterRequest.disabled = true;
								resetCurrentItem();
								count = 0;
								break;
							case 'catalogPage':
								projectMainUpdatePriceFromCatalogMainService.reset();
								projectMainUpdatePriceFromCatalogProjectMaterialService.reset();
								projectMainUpdatePriceFromCatalogPriceListService.reset();
								break;
							case 'resultPage':
								projectMainUpdateMaterialPricesService.clearPriceConditions();
								break;
							case 'catalogMatrialPage':
								projectMainUpdatePriceByMaterialCatalogService.reset();
								break;
							default:
								break;
						}
					}
				}

				function validateNewEstimatePrice(entity, value) {
					entity.Variance = value - entity.OldEstimatePrice;
					return true;
				}
			}
		]);
})(angular);
