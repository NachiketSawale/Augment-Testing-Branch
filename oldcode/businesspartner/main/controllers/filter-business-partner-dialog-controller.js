/**
 * Created by lcn on 4/8/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,Slick */

	var moduleName = 'businesspartner.main';

	// eslint-disable-next-line no-redeclare

	/* global angular,$,globals */
	angular.module(moduleName).controller('filterBusinessPartnerDialogController', ['$scope', '$translate', 'platformTranslateService', 'platformGridAPI', 'keyCodes', '$http', 'procurementContextService', 'basicsLookupdataLookupViewService',
		'basicsLookupdataLookupDataService', 'procurementReqCreateRfqWizardDataService', '$state', 'basicsLookupdataConfigGenerator', 'cloudDesktopSidebarService', 'procurementRequisitionWizardCreateContractService',
		'lookupPageSizeService', 'basicsLookupdataLookupDescriptorService', '$timeout', 'platformGridDomainService', 'basicsLookupdataLookupControllerFactory', 'procurementRfqBusinessPartnerWizardMainService', 'platformModalService',
		'platformRuntimeDataService', 'platformModuleNavigationService', 'filterBusinessPartnerContactService', '_', '$injector', 'filterBusinessPartnerDialogFields', 'procurementCommonCreateSuggestedBidderService',
		'filterBusinessPartnerSubsidiaryService', 'businessPartnerLogicalValidator', 'documentsProjectDocumentModuleContext', 'dialogUserSettingService', 'platformModuleInfoService', 'filterBusinessPartnerGuarantorService', 'moment', '$q', 'BasicsCommonDateProcessor',
		function ($scope, $translate, platformTranslateService, platformGridAPI, keyCodes, $http, moduleContext, basicsLookupdataLookupViewService, lookupDataService, procurementReqCreateRfqWizardDataService, $state, basicsLookupdataConfigGenerator,
			cloudDesktopSidebarService, requisitionWizardCreateContractService, lookupPageSizeService, basicsLookupdataLookupDescriptorService, $timeout, platformGridDomainService, lookupControllerFactory, procurementRfqBusinessPartnerWizardService,
			platformModalService, platformRuntimeDataService, platformModuleNavigationService, filterBusinessPartnerContactService, _, $injector, filterBusinessPartnerDialogFields, procurementCommonCreateSuggestedBidderService, filterBusinessPartnerSubsidiaryService,
			businessPartnerLogicalValidator, documentsProjectDocumentModuleContext, dialogUserSettingService, platformModuleInfoService, filterBusinessPartnerGuarantorService, moment, $q, BasicsCommonDateProcessor) {

			var dialogId = '000af9b0abd14af8b594f45800ae99de';
			var bpStatusPromise = basicsLookupdataLookupDescriptorService.loadData('BusinessPartnerStatus');
			var bpStatus2Promise = basicsLookupdataLookupDescriptorService.loadData('BusinessPartnerStatus2');
			var needSetDefaultContactPromise = IsSetDefaultContactInPBLookup();
			var contains = 0;
			var dateProcessor = new BasicsCommonDateProcessor(['CraftcooperativeDate', 'TradeRegisterDate', 'Updated', 'Inserted']);

			$scope.isBidderSearchPreAllocation = null;
			$scope.needSetDefaultContact = true;
			$scope.IsShowContracts = false;
			$scope.IsShowBranch = false;
			$scope.showGuarantor = false;
			$scope.isFromProcurement = false;
			$scope.isFromSales = false;

			var _options = $scope.$parent.modalOptions || $scope.$parent.options;
			var prcMainHeaderService = moduleContext.getMainService();
			if (!_.isNil(prcMainHeaderService)) {
				// the structure should load from header in procurement modules, issue:#136131
				var prcServiceName = prcMainHeaderService.getServiceName();
				if (!_.isNil(prcServiceName) && prcServiceName.indexOf('procurement') !== -1) {
					$scope.isFromProcurement = true;
				}
				while (prcMainHeaderService.parentService() !== null) {
					prcMainHeaderService = prcMainHeaderService.parentService();
				}
				if (!_.isNil(_options.showGuarantor) && prcMainHeaderService.getServiceName() === 'salesContractService') {
					$scope.showGuarantor = true;
				}
			}
			var mainService = null;
			let validationService = null;
			if (!_.isNil(_options.validationService)) {
				validationService = $injector.get(_options.validationService);
			}
			var businessPartnerValidatorService = null;
			if (!_.isNil(_options.mainService)) {
				mainService = $injector.get(_options.mainService);
				if (_options.mainService === 'procurementPackage2ExtBidderService') {
					var loadRes = mainService.loadControllerInitData();
					if (!_.isNil(loadRes)) {
						mainService = loadRes.dataService;
					}
				}
				if (_options.mainService === 'procurementCommonSuggestedBiddersDataService') {
					mainService = mainService.getService(moduleContext.getMainService());
				}
				if (_options.mainService === 'prcItemScopeDataService') {
					mainService = mainService.getService();
				}
				if (_options.mainService === 'documentsProjectDocumentDataService') {
					mainService = mainService.getService(documentsProjectDocumentModuleContext.getConfig());
				}
				if (_options.mainService.indexOf('sales') !== -1) {
					$scope.isFromSales = true;
				}

				businessPartnerValidatorService = businessPartnerLogicalValidator.getService({
					dataService: mainService,
					BusinessPartnerFk: _options.BusinessPartnerField,
					SubsidiaryFk: _options.SubsidiaryField,
					SupplierFk: _options.SupplierField,
					PaymentTermFiFk: _options.PaymentTermFiField,
					PaymentTermPaFk: _options.PaymentTermPaField,
					PaymentMethodFk: _options.PaymentMethodField,
					validationService: validationService
				});
			} else {
				if (_options.hasOwnProperty('lookupOptions')) {
					$scope.IsShowBranch = _options.lookupOptions.IsShowBranch ? _options.lookupOptions.IsShowBranch : false;
					_options.SubsidiaryField = 'BpdSubsidiaryFk';
				}
			}
			$scope.$parent.options.modalDialogHeight = $scope.$parent.options.height;
			$scope.bidderData = _options.bidderData;
			$scope.isCommonBidder = _options.isCommonBidder;
			//$scope.isFromContractModule = _options.filterKey === 'procurement-contract-businesspartner-businesspartner-filter';// From Contract Module
			$scope.approvalBPRequired = _options.approvalBPRequired;
			$scope.isApprovedBP = $scope.approvalBPRequired && checkApprovedBP();// Only look up approved BP=1
			$scope.isPrcCommonSuggestedBidder = _options.IsPrcCommonSuggestedBidder;
			$scope.hasContractItem = _options.hasContractItem || false;

			$scope.StructureFk = null;
			// from wizrd
			if (_options.mainData) {
				$scope.StructureFk = _options.mainData.bpPrcHeaderEntity ? _options.mainData.bpPrcHeaderEntity.StructureFk : null;
			}
			// from contains
			var parentEntity = $scope.$parent.entity;
			if (parentEntity) {
				setValueFromParentEntity(parentEntity, $scope, _options);
			}
			if ($scope.isFromProcurement && _.isNil($scope.StructureFk)) {
				var prcParentEntity = prcMainHeaderService.getSelected();
				if (prcParentEntity) {
					setValueFromParentEntity(prcParentEntity, $scope, _options);
				}
			}

			if (_.isNil($scope.StructureFk) && !_.isNil(_options.requisitionService)) {
				// the modules RfQ and Quote we use the Prc Structure from Requisition.
				var requisitionService = $injector.get(_options.requisitionService);
				var requisitionList = requisitionService.getList();
				if (requisitionList.length > 0) {
					// eslint-disable-next-line no-mixed-spaces-and-tabs
					var bpPrcHeaderEntity = requisitionList[0].PrcHeaderEntity;
					$scope.StructureFk = bpPrcHeaderEntity ? bpPrcHeaderEntity.StructureFk : null;
				}
			}

			if (_options.IsWizardForCreateReq) {
				$scope.IsShowContracts = $scope.IsWizardForCreateReq = true;
			}
			if (_options.wizardForCreateRfQFromPackage) {
				$scope.IsShowContracts = $scope.wizardForCreateRfQFromPackage = true;
			}

			if (_options.IsWizardForCreateContract) {
				$scope.IsWizardForCreateContract = true;
			}
			if (_options.IsWizardForFindBidder) {
				$scope.IsShowContracts = $scope.IsWizardForFindBidder = true;
			}
			//if has the contact field from the lookup option, then need show the contact window
			if (!$scope.IsShowContracts) {
				$scope.IsShowContracts = _options.ContactField !== undefined && _options.ContactField !== '';
			}
			if (_options.IsShowBranch || (_.isNil(_options.IsShowBranch) && $scope.IsShowContracts)) {
				$scope.IsShowBranch = $scope.IsShowBranch = true;
			} else {
				if (!_.isNil(_options.SubsidiaryField) && _options.SubsidiaryField !== '') {
					$scope.IsShowBranch = true;
				}
			}

			if ($scope.showGuarantor && !_.isNil(parentEntity) && !_.isNil(parentEntity.CertificateTypeFk)) {
				var certType = _.find(basicsLookupdataLookupDescriptorService.getData('certificatetype'), {Id: parentEntity.CertificateTypeFk});
				if (!_.isNil(certType) && certType.IsBond) {
					$scope.certIsActive = true;
					$scope.certTypeId = certType.Id;
				}
			}

			var paneNum = 1;
			$scope.panesOption = {panes: [], orientation: 'vertical'};
			paneNum = $scope.IsShowBranch ? paneNum + 1 : paneNum;
			paneNum = $scope.IsShowContracts ? paneNum + 1 : paneNum;
			paneNum = $scope.showGuarantor ? paneNum + 1 : paneNum;
			var heightPer = paneNum === 2 ? 60 : (paneNum === 3 ? 40 : (paneNum === 4 ? 25 : 100));
			var heightPercent = heightPer;
			$scope.panesOption.panes.push({collapsible: true, size: heightPercent + '%'});
			for (let i = 1; i < paneNum; i++) {
				heightPer = ((100 - heightPercent) / (paneNum - 1)).toFixed(2);
				$scope.panesOption.panes.push({collapsible: true, size: heightPer + '%'});
			}

			var mainHeader = _options.mainData;
			var locationDistanceParameters = {
				moduleName: null,
				isSubModule: false,
				addressFk: null,
				projectFk: null,
				companyFk: null,
				s_headerFk: null,// secondary module
				t_headerFk: null // tertiary module
			};

			var navigateParameters = {
				moduleName: null, registerService: null, Id: null
			};

			$scope.bpGridData = [];
			$scope.generateArrayData = [];

			if ($scope.options.dataView === undefined) {
				$scope.options.dataView = new basicsLookupdataLookupViewService.LookupDataView();
				$scope.options.dataView.dataPage.size = 100;
				$scope.options.dataView.dataProvider = lookupDataService.registerDataProviderByType('businesspartner');
			}
			// Bp Set
			$scope.findBidderSetting = {
				location: {
					isActive: false, distance: {
						isActive: false, selectedItemFk: null
					}, regional: {
						isActive: false, selectedItemFk: null, addressElement: null
					}
				}, bidder: {
					isHide: true
				}, evaluation: {
					isActive: false, selectedItemFk: null, point: null
				}, withCharacteristic: {
					isActive: false, selectedItemFk: null, hasError: false
				}, prcstructure: {
					isActive: false, selectedItemFk: $scope.StructureFk
				},
				businesspartnerstatus: {
					isActive: false,
					selectedItemsFk: [],
					isApprovedBP: $scope.isApprovedBP,
				},
				businesspartnerstatus2: {
					isActive: false,
					selectedItemsFk: []
				},
				contractGrandTotal: {
					isActive: false, selectedOp: null, total: null, isFilterByStructure: false
				},
				contractedDateOrdered: {
					isActive: false,
					startDate: null,
					endDate: null
				}
			};
			$scope.gridId = 'a3cac64f52af43beb1b7a32d127531bd';
			$scope.grid = {
				state: $scope.gridId
			};
			$scope.branchGridId = 'f3b7569b3ba344768005d7b4a24f62c1';
			// subsidiary
			if ($scope.IsShowBranch) {
				var subsidiaryGridConfig = filterBusinessPartnerSubsidiaryService.getGridConfig();
				platformGridAPI.grids.config(subsidiaryGridConfig);
				platformTranslateService.translateGridConfig(subsidiaryGridConfig.columns);
				platformGridAPI.events.register($scope.branchGridId, 'onSelectedRowsChanged', showContacts);
			}

			// contact
			if ($scope.IsShowContracts) {
				var contactGridConfig = filterBusinessPartnerContactService.getGridConfig();
				platformGridAPI.grids.config(contactGridConfig);
				platformTranslateService.translateGridConfig(contactGridConfig.columns);
			}

			// eslint-disable-next-line no-unused-vars
			var displayText = GetdisplayText();
			var settings = {columns: []};
			var GridColumns = angular.copy(filterBusinessPartnerDialogFields);
			if ($scope.IsShowContracts) {
				settings.columns.push({
					id: 'Id',
					field: 'BpIsExisted',
					name: 'Selected',
					name$tr$: 'cloud.common.entitySelected',
					formatter: 'boolean',
					editor: 'boolean',
					width: 75,
					pinned: true,
					headerChkbox: true,
					focusable: true,
					sortable: true,
					searchable: true,
					resizeable: true
				});
			}
			_.forEach(GridColumns, function (column) {
				settings.columns.push(column);
			});

			var extendGridColumns = platformTranslateService.translateGridConfig(extendGrouping(settings.columns));
			var gridConfig = {
				columns: angular.copy(extendGridColumns),
				data: [],
				id: $scope.gridId,
				gridId: $scope.gridId,
				lazyInit: true,
				options: {
					skipPermissionCheck: true,
					iconClass: 'control-icons',
					idProperty: 'Id',
					collapsed: false,
					indicator: true,
					multiSelect: false,
					enableDraggableGroupBy: true,
					enableModuleConfig: true,
					editorLock: new Slick.EditorLock()
				}
			};
			if (!platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.config(gridConfig);
				if (!$scope.IsWizardForCreateReq && !$scope.wizardForCreateRfQFromPackage) {
					platformGridAPI.events.register($scope.gridId, 'onDblClick', onDblClick);
				}
				if ($scope.IsShowContracts) {
					platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
				}

			} else {
				platformGridAPI.columns.configuration($scope.gridId, angular.copy(extendGridColumns));
				if (!$scope.IsWizardForCreateReq && !$scope.wizardForCreateRfQFromPackage) {
					platformGridAPI.events.register($scope.gridId, 'onDblClick', onDblClick);
				}

			}
			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', showSubData);

			if (!$scope.tools) {
				lookupControllerFactory.create({grid: true, dialog: true, search: true}, $scope, gridConfig);
			}

			if ($scope.IsWizardForFindBidder && _options.refreshBidderContainer) {
				$scope.refreshBidder = _options.refreshBidderContainer;
			}
			$scope.modalOptions = {
				navigateTitle: $translate.instant('cloud.common.Navigator.goTo'),
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				refreshButtonText: $translate.instant('basics.common.button.refresh'),
				passButtonText: $translate.instant('procurement.requisition.wizard.create.rfq.pass'),
				headerText: getheaderText(),
				bidderCopyNote: $translate.instant('procurement.common.findBidder.bidderCopyNote'),
				checkbidderCopy: true,
				contactGridTitle: $translate.instant('procurement.common.findBidder.contactTitle'),
				contactGridTitleCopy: $translate.instant('procurement.common.findBidder.contactTitle'),
				subsidiary: {
					isLoading: false
				},
				contact: {
					isLoading: false
				},
				guarantor: {
					isLoading: false
				},
				subsidiaryGridTitle: $translate.instant('procurement.common.findBidder.subsidiaryGridTitle'),
				subsidiaryGridTitleCopy: $translate.instant('procurement.common.findBidder.subsidiaryGridTitle'),
				guarantorGridTitle: $translate.instant('businesspartner.main.entityGuarantor'),
				guarantorGridTitleCopy: $translate.instant('businesspartner.main.entityGuarantor'),
				disableOkButton: true,
				selectedItem: [],
				searchValue: null,
				step: 'step1',
				isValid: function isValid() {
					if (!$scope.IsShowContracts || ($scope.bpGridData.length === 0 && !$scope.IsWizardForCreateReq && !$scope.wizardForCreateRfQFromPackage)) {
						if ($scope.IsWizardForFindBidder) {
							return false;
						}
						var selectedItem = platformGridAPI.rows.selection({gridId: $scope.gridId});
						return !!selectedItem;
					} else {
						return $scope.bpGridData.length > 0 || (($scope.IsWizardForCreateReq || $scope.wizardForCreateRfQFromPackage) && $scope.modalOptions.checkbidderCopy && $scope.bidderData.length > 0);
					}
				},
				ok: function onOK() {
					SaveDialogSetting();
					var selectedItem = platformGridAPI.rows.selection({gridId: $scope.gridId});
					var options = [];
					var bpMapSubsidiaryDic = {};
					// subsidiary
					if ($scope.IsShowBranch) {
						var subsArrayData = filterBusinessPartnerSubsidiaryService.getArrayData();
						subsArrayData.forEach(function (bpItem) {
							bpMapSubsidiaryDic[bpItem.bpId] = bpItem.subsId;
						});
					}

					if ($scope.IsWizardForCreateReq || $scope.wizardForCreateRfQFromPackage) {
						var result = [];
						let ctSelectedItem = platformGridAPI.rows.selection({gridId: filterBusinessPartnerContactService.getCtGridId()});
						$scope.bpGridData.forEach(function (bpItem) {
							// update the ArrayData.
							var arrayData = filterBusinessPartnerContactService.getArrayData();
							if (arrayData.length > 0) {
								$scope.generateArrayData = arrayData;
							}
							var item = {
								BusinessPartnerId: null, BPDContactID: null
							};
							item.BusinessPartnerId = bpItem.Id;
							if (ctSelectedItem) {
								$scope.generateArrayData.forEach(function (array) {
									if (array.bpId === item.BusinessPartnerId) {
										item.BPDContactID = array.ctId;
									}
								});
							}
							result.push(item);
						});

						options = {
							RfqBpWithContact: result,
							AutoCopyBidder: $scope.modalOptions.checkbidderCopy,
							AutoCopyDefaultContact: ctSelectedItem ? true : $scope.modalOptions.checkbidderCopy
						};
						options.BpMapSubsidiaryDic = bpMapSubsidiaryDic;
						if ($scope.IsWizardForCreateReq) {
							options.ReqHeaderId = mainHeader.Id;
							createRfq(options);
						} else {
							options.PackageId = mainHeader.Id;
							createRfqFromPackageAsync(options).then(function (rfq) {
								$scope.$close({
									isOk: true,
									rfq: rfq
								});
							});
						}
					} else if ($scope.IsWizardForCreateContract) {
						var selectedSubs = platformGridAPI.rows.selection({gridId: 'f3b7569b3ba344768005d7b4a24f62c1'});
						options = {
							ReqHeaderFk: mainHeader.Id,
							BusinessPartnerFk: selectedItem.Id,
							SubsidiaryFk: null
						};
						if (!_.isNil(selectedSubs)) {
							options.SubsidiaryFk = selectedSubs.Id;
						}

						createContract(options);
					} else if ($scope.IsWizardForFindBidder) {
						var bpMapContactDic = {};
						var arrayData = filterBusinessPartnerContactService.getArrayData();
						if (arrayData.length > 0) {
							$scope.generateArrayData = arrayData;
						}
						$scope.generateArrayData.forEach(function (bpItem) {
							bpMapContactDic[bpItem.bpId] = bpItem.ctId;
						});
						options = {
							headerId: mainHeader.Id,
							businessPartnerList: $scope.bpGridData,
							checkBpMapContact: bpMapContactDic,
							checkBpMapSubsidiary: bpMapSubsidiaryDic,
							isPrcCommonSuggestedBidder: $scope.isPrcCommonSuggestedBidder
						};
						if (options.isPrcCommonSuggestedBidder) {
							options.headerId = mainHeader.PrcHeaderEntity.Id;
						}
						createBusinessPartner(options, $scope.refreshBidder, $scope.isPrcCommonSuggestedBidder);
					} else {
						if ($scope.canSelect(selectedItem)) {
							// handle branch
							if ($scope.IsShowBranch) {
								var parentEntity = $scope.$parent.entity;
								var selectedSubsidiary = platformGridAPI.rows.selection({
									gridId: 'f3b7569b3ba344768005d7b4a24f62c1'
								});
								// set subsidiary and supplier
								if (!_.isNil(parentEntity) && !_.isNil(selectedSubsidiary) && !_.isNil(_options.SubsidiaryField)) {
									if (_options.SubsidiaryField && parentEntity[_options.SubsidiaryField] !== selectedSubsidiary.Id) {
										parentEntity[_options.SubsidiaryField] = selectedSubsidiary.Id;
										selectedItem[_options.SubsidiaryField] = selectedSubsidiary.Id;
										if (!_.isNil(_options.SupplierField) && !_.isNil(businessPartnerValidatorService)) {
											// eslint-disable-next-line no-unused-vars
											businessPartnerValidatorService.GetDefaultSupplier(parentEntity, selectedItem.Id).then(function (data) {
												if (!_.isNil(mainService) && angular.isFunction(mainService.markItemAsModified)) {
													mainService.markItemAsModified(parentEntity);
												}
											});
										}
									}
									parentEntity.SubsidiaryFromBpDialog = true;
									if (!_.isNil(mainService) && angular.isFunction(mainService.markItemAsModified)) {
										mainService.markItemAsModified(parentEntity);
									}

								}
							}
							// handle contact
							if ($scope.IsShowContracts) {
								var parentEntity = $scope.$parent.entity;
								if (!_.isNil(parentEntity) && !_.isNil(_options.ContactField)) {
									var selContactId = null;
									var selectedContact = platformGridAPI.rows.selection({
										gridId: '015039777D6F4A1CA0BF9EEC6E9D244E'
									});
									if (!_.isNil(selectedContact)) {
										selContactId = selectedContact.Id;
									}
									if (!_.isNil(mainService) && angular.isFunction(mainService.markItemAsModified)) {
										parentEntity[_options.ContactField] = selContactId;
										selectedItem[_options.ContactField] = selContactId;
										parentEntity.ContactFromBpDialog = true;
										mainService.markItemAsModified(parentEntity);
									}
									//for  create contract wizard,should set the value to bp directly
									selectedItem[_options.ContactField] = selContactId;
									selectedItem.ContactFromBpDialog = true;
								}
							}
							$scope.$close({
								isOk: true, selectedItem: selectedItem
							});
						}
					}
				},
				cancel: function onCancel() {
					SaveDialogSetting();
					$scope.$close({
						isOk: false, isCancel: true
					});
				},
				refresh: function onRefresh() {
					getSearchList();
				},
				extraFilter: false,
				prjProjectFk: null,
				column: null,
				mode: null,
				onPass: function onPass() {
					let options = {
						ReqHeaderId: mainHeader.Id,
						RfqBpWithContact: [],
						AutoCopyBidder: $scope.modalOptions.checkbidderCopy
					};
					if (!$scope.wizardForCreateRfQFromPackage) {
						options.ReqHeaderId = mainHeader.Id;
						options.AutoCopyDefaultContact = true;
						createRfq(options);
					} else {
						options.PackageId = mainHeader.Id;
						createRfqFromPackageAsync(options).then(function (rfq) {
							$scope.$close({
								isOk: true,
								rfq: rfq
							});
						});
					}
				},
				onNavigate: function () {
					if (!_.isNull(navigateParameters.moduleName)) {
						$scope.$close(false);
						platformModuleNavigationService.navigate({
							moduleName: navigateParameters.moduleName,
							registerService: navigateParameters.registerService
						}, {Id: navigateParameters.Id}, 'Id');
					}
				},
				isFromProcurement: $scope.isFromProcurement,
				isFromSales: $scope.isFromSales
			};

			var page = $scope.options.dataView.dataPage;
			var pageState = {
				PageNumber: page.number, PageSize: 10000
			};
			var searchRequest = {
				SearchFields: ['Code', 'TradeName'], SearchText: '', AdditionalParameters: {
					IsFliter: true, Column: null, Mode: null
				}, PageState: pageState, FilterKey: $scope.options.filterKey
			};
			var translatePrefix = 'procurement.rfq.wizard.businessPartner';
			var errorType = {
				info: 1, error: 3
			};
			var url = globals.webApiBaseUrl + 'businesspartner/main/lookup/bp/searchslice';

			$scope.onSearch = function () {
				page.number = 0;
				getSearchList();
			};
			$scope.getPageText = function () {
				var startIndex = page.number * page.size,
					endIndex = ((page.count - (page.number + 1) > 0 ? startIndex + page.size : page.totalLength));
				if ($scope.searchValueModified === undefined) {
					if (page.totalLength > 0) {
						return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
					}
					return '';
				}
				if ($scope.isLoading) {
					return $translate.instant('cloud.common.searchRunning');
				}
				if (page.currentLength === 0) {
					return $translate.instant('cloud.common.noSearchResult');
				}
				return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
			};
			$scope.getFirstPage = function () {
				page.number = 0;
				getSearchList();
			};
			$scope.getLastPage = function () {
				page.number = page.count - 1;
				getSearchList();
			};
			$scope.getPrevPage = function () {
				if (page.number <= 0) {
					return;
				}
				page.number--;
				getSearchList();
			};
			$scope.getNextPage = function () {
				if (page.count <= page.number) {
					return;
				}
				page.number++;
				getSearchList();
			};

			$scope.canFirstPage = $scope.canPrevPage = function () {
				return page.number > 0;
			};
			$scope.canLastPage = $scope.canNextPage = function () {
				return page.count > (page.number + 1);
			};
			$scope.myOptions = {
				fields: [
					{id: 1, caption$tr$: 'businesspartner.main.businessPartnerDialog.name'},
					{id: 35, caption$tr$: 'businesspartner.main.name2'},
					{id: 37, caption$tr$: 'businesspartner.main.name3'},
					{id: 38, caption$tr$: 'businesspartner.main.name4'},
					{id: 39, caption$tr$: 'businesspartner.main.code'},
					{id: 40, caption$tr$: 'businesspartner.main.matchCode'},
					{id: 2, caption$tr$: 'businesspartner.main.import.addressStreet'},
					{id: 3, caption$tr$: 'businesspartner.main.import.addressCity'},
					{id: 4, caption$tr$: 'basics.common.entityCountryDescription'},
					{id: 5, caption$tr$: 'businesspartner.main.import.addressZipCode'},
					{id: 6, caption$tr$: 'businesspartner.main.telephoneNumber'},
					{id: 7, caption$tr$: 'businesspartner.main.internet'},
					{id: 8, caption$tr$: 'businesspartner.main.import.email'},
					{id: 9, caption$tr$: 'businesspartner.main.creFoNo'},
					{id: 10, caption$tr$: 'businesspartner.main.import.bedirektNo'},
					{id: 11, caption$tr$: 'businesspartner.main.import.dunsNo'},
					{id: 12, caption$tr$: 'businesspartner.main.import.vatNo'},
					{id: 13, caption$tr$: 'businesspartner.main.taxNo'},
					{id: 14, caption$tr$: 'businesspartner.main.import.tradeRegister'},
					{id: 15, caption$tr$: 'businesspartner.main.import.tradeRegisterNo'},
					{id: 16, caption$tr$: 'businesspartner.main.import.avaid'},
					{id: 17, caption$tr$: 'businesspartner.main.import.craftCooperative'},
					{id: 18, caption$tr$: 'businesspartner.main.import.craftCooperativeType'},
					{id: 19, caption$tr$: 'basics.customize.customerabc'},
					{id: 20, caption$tr$: 'businesspartner.main.customerSector'},
					{id: 21, caption$tr$: 'basics.customize.customerstate'},
					{id: 22, caption$tr$: 'businesspartner.main.customerGroup'},
					{id: 23, caption$tr$: 'businesspartner.main.import.legalForm'},
					{id: 24, caption$tr$: 'businesspartner.main.import.creditStanding'},
					{id: 25, caption$tr$: 'businesspartner.main.import.remarkMarketing'},
					{id: 26, caption$tr$: 'businesspartner.main.import.remark1'},
					{id: 27, caption$tr$: 'businesspartner.main.import.remark2'},
					{id: 28, caption$tr$: 'businesspartner.main.import.entityUserDefined1'},
					{id: 29, caption$tr$: 'businesspartner.main.import.entityUserDefined2'},
					{id: 30, caption$tr$: 'businesspartner.main.import.entityUserDefined3'},
					{id: 31, caption$tr$: 'businesspartner.main.import.entityUserDefined4'},
					{id: 32, caption$tr$: 'businesspartner.main.import.entityUserDefined5'},
					{id: 33, caption$tr$: 'businesspartner.main.referenceValue1'},
					{id: 34, caption$tr$: 'businesspartner.main.referenceValue2'},
					{id: 36, caption$tr$: 'basics.customize.language'}
				],
				displayMember: 'caption',
				valueMember: 'id',
				showOptions: true,
				// operators: ['contains', 'starts', 'ends', 'between'],
				config: {
					autofocus: 500, readonly: false,
				},
				fnc: function () {
					getSearchList();
				},
				multipleSelect: true,
				openPopUpAfterItemClick: true

			};
			$scope.myModel = {
				mode: contains
			};

			loadSearchBoxSetting();

			$scope.resizeContent = function (element) {
				var content = element.splitter.element.parents('.modal-content.ui-resizable');
				content.resizable({minHeight: 560});
				var pane = element.splitter.element.children();
				if (pane && pane.length === 3 && pane.context) {
					var contextPaneWidth = pane.context.offsetWidth;
					var leftPaneWidth = pane[0].offsetWidth;
					var dragPaneWidth = pane[1].offsetWidth;
					var rightPaneWidth = pane[2].offsetWidth;
					if (contextPaneWidth > leftPaneWidth && contextPaneWidth > rightPaneWidth) {
						$(pane[0]).css('width', (leftPaneWidth + dragPaneWidth) + 'px');
						$(pane[1]).css('left', (leftPaneWidth + dragPaneWidth) + 'px');
						$(pane[2]).css('left', (leftPaneWidth + dragPaneWidth * 2) + 'px').css('width', (rightPaneWidth - dragPaneWidth * 3) + 'px');
					}
					if (contextPaneWidth <= rightPaneWidth) {
						$(pane[2]).css('left', dragPaneWidth + 'px').css('width', (rightPaneWidth - dragPaneWidth) + 'px');
					}
				}
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
			};

			const unwatch = $scope.$watch(function () {
				var modalDialog = $('.modal-dialog');
				if (modalDialog && modalDialog[0] && $scope.alert && $scope.alert.show) {
					modalDialog.css({maxHeight: '200px'});
				}
			});

			function setValueFromParentEntity(parentEntity, $scope, _options) {
				// - In the modules Package, Requisition, Contract we can take the Value directly from the main entity.
				// - In the modules RfQ and Quote we use the Prc Structure from Requisition.
				if (parentEntity.StructureFk) {
					$scope.StructureFk = parentEntity.StructureFk;
				} else if (parentEntity.PrcStructureFk) {
					$scope.StructureFk = parentEntity.PrcStructureFk;
				} else {
					$scope.StructureFk = parentEntity.PrcHeaderEntity ? parentEntity.PrcHeaderEntity.StructureFk : null;
				}
				$scope.selectedBpId = parentEntity[_options.BusinessPartnerField];
			}

			function showSubData() {
				if (!$scope.IsShowBranch && !$scope.IsShowContracts && !$scope.showGuarantor) {
					return;
				}
				var selectedItem = platformGridAPI.rows.selection({
					gridId: $scope.gridId
				});

				if (!_.isNil(selectedItem)) {
					if ($scope.modalOptions.selectedItem !== selectedItem) {
						$scope.modalOptions.selectedItem = selectedItem;
					}
					const promises = [];
					// show branch
					if ($scope.IsShowBranch) {
						var location = $scope.findBidderSetting.location;
						if (location.isActive) {
							if (location.regional.isActive && !location.regional.selectedItemFk) {
								$scope.isLoading = false;
								showError(true, $translate.instant(translatePrefix + '.selectCountryError'), errorType.error);
								return;
							}
						}
						SetlocationDistanceParameters();
						var parameter = {
							isLocation: location.isActive,
							isDistance: location.distance.isActive,
							isRegional: location.regional.isActive,
							distanceId: location.distance.selectedItemFk,
							regionalCountryId: location.regional.selectedItemFk,
							regionalAddressElement: location.regional.addressElement,
							distanceParameters: locationDistanceParameters,
							isCommonBidder: !!$scope.isCommonBidder,
							isPrcStructure: $scope.findBidderSetting.prcstructure.isActive,
							structureFk: $scope.findBidderSetting.prcstructure.selectedItemFk

						};
						parameter.distanceParameters.businessPartnerFk = selectedItem.Id;
						$scope.modalOptions.subsidiaryGridTitle = $scope.modalOptions.subsidiaryGridTitleCopy + '（' + selectedItem.BusinessPartnerName1 + ')';
						$scope.modalOptions.subsidiary.isLoading = true;
						filterBusinessPartnerSubsidiaryService.setSubsidiaries(selectedItem, parentEntity, parameter, _options.SubsidiaryField)
							.then(function (data) {
								$scope.modalOptions.subsidiary.isLoading = false;
							}, function () {
								$scope.modalOptions.subsidiary.isLoading = false;
							}).finally(function () {
							$scope.modalOptions.subsidiary.isLoading = false;
						});
					}

					// show Guarantor
					if ($scope.showGuarantor && !_.isNil($scope.certTypeId) && $scope.certTypeId !== 0) {
						$scope.modalOptions.guarantorGridTitle = $scope.modalOptions.guarantorGridTitleCopy + '（' + selectedItem.BusinessPartnerName1 + ')';
						$scope.modalOptions.guarantor.isLoading = true;
						filterBusinessPartnerGuarantorService.showGuarantor(selectedItem, $scope.certTypeId)
							.then(function (data) {
								$scope.modalOptions.guarantor.isLoading = false;
							}, function () {
								$scope.modalOptions.guarantor.isLoading = false;
							}).finally(function () {
							$scope.modalOptions.guarantor.isLoading = false;
						});
					}
				}
			}

			function showContacts() {
				var selectedBp = platformGridAPI.rows.selection({
					gridId: $scope.gridId
				});
				var selectedBranch = platformGridAPI.rows.selection({
					gridId: $scope.branchGridId
				});
				if ($scope.IsShowContracts && !_.isNil(selectedBp) && !_.isNil(selectedBranch)) {
					$scope.modalOptions.contactGridTitle = $scope.modalOptions.contactGridTitleCopy + '（' + selectedBp.BusinessPartnerName1 + ')';
					var generateArrayData = filterBusinessPartnerContactService.getArrayData();
					$scope.modalOptions.contact.isLoading = true;
					filterBusinessPartnerContactService.setSelectContact(selectedBp, generateArrayData, parentEntity, _options.ContactField, selectedBranch)
						.then(function (data) {
							$scope.modalOptions.contact.isLoading = false;
						}, function () {
							$scope.modalOptions.contact.isLoading = false;
						}).finally(function () {
						$scope.modalOptions.contact.isLoading = false;
					});
				}
			}

			function SaveDialogSetting() {
				var strucIsActive = $scope.findBidderSetting.prcstructure.isActive;
				var structureFk = $scope.findBidderSetting.prcstructure.selectedItemFk;
				var locIsActive = $scope.findBidderSetting.location.isActive;
				var disIsActive = $scope.findBidderSetting.location.distance.isActive;
				var disSelItemFk = $scope.findBidderSetting.location.distance.selectedItemFk;
				var regIsActive = $scope.findBidderSetting.location.regional.isActive;
				var regSelItemFk = $scope.findBidderSetting.location.regional.selectedItemFk;
				var regAddressEle = $scope.findBidderSetting.location.regional.addressElement;
				var evalIsActive = $scope.findBidderSetting.evaluation.isActive;
				var evalSelItemFk = $scope.findBidderSetting.evaluation.selectedItemFk;
				var evalPoint = $scope.findBidderSetting.evaluation.point;
				var charIsActive = $scope.findBidderSetting.withCharacteristic.isActive;
				var charSelItemFk = $scope.findBidderSetting.withCharacteristic.selectedItemFk;
				var charSelectedOp = $scope.findBidderSetting.withCharacteristic.selectedOp;
				var charSelectedItem = $scope.findBidderSetting.withCharacteristic.selectedItem;
				var charOperators = $scope.findBidderSetting.withCharacteristic.operators;
				var bpStatusIsActive = $scope.findBidderSetting.businesspartnerstatus.isActive;
				var bpStatusSelItemFk = $scope.findBidderSetting.businesspartnerstatus.selectedItemsFk;
				var bpStatus2IsActive = $scope.findBidderSetting.businesspartnerstatus2.isActive;
				var bpStatus2SelItemFk = $scope.findBidderSetting.businesspartnerstatus2.selectedItemsFk;
				var conGrandTotalIsActive = $scope.findBidderSetting.contractGrandTotal.isActive;
				var isFilterByStructure = $scope.findBidderSetting.contractGrandTotal.isFilterByStructure;
				var grandTotalOperation = $scope.findBidderSetting.contractGrandTotal.selectedOp;
				var grandTotalValue = $scope.findBidderSetting.contractGrandTotal.total;
				var contractedDateOrderedIsActive = $scope.findBidderSetting.contractedDateOrdered.isActive;
				var startDate = $scope.findBidderSetting.contractedDateOrdered.startDate;
				var endDate = $scope.findBidderSetting.contractedDateOrdered.endDate;

				dialogUserSettingService.setCustomConfig(dialogId, 'SearchString', $scope.isBidderSearchPreAllocation ? $scope.myModel.searchstring : '');
				dialogUserSettingService.setCustomConfig(dialogId, 'StructureIsActive', strucIsActive);
				if (!$scope.isFromProcurement) {
					dialogUserSettingService.setCustomConfig(dialogId, 'StructureFk', structureFk);
				}
				dialogUserSettingService.setCustomConfig(dialogId, 'LocationIsActive', locIsActive);
				dialogUserSettingService.setCustomConfig(dialogId, 'DistanceIsActive', disIsActive);
				dialogUserSettingService.setCustomConfig(dialogId, 'DistanceSelectedItemFk', disSelItemFk);
				dialogUserSettingService.setCustomConfig(dialogId, 'RegionalIsActive', regIsActive);
				dialogUserSettingService.setCustomConfig(dialogId, 'RegionalSelectedItemFk', regSelItemFk);
				dialogUserSettingService.setCustomConfig(dialogId, 'RegionalAddressElement', regAddressEle);
				dialogUserSettingService.setCustomConfig(dialogId, 'EvaluationIsActive', evalIsActive);
				dialogUserSettingService.setCustomConfig(dialogId, 'EvaluationSelectedItemFk', evalSelItemFk);
				dialogUserSettingService.setCustomConfig(dialogId, 'EvaluationPoint', evalPoint);
				dialogUserSettingService.setCustomConfig(dialogId, 'CharIsActive', charIsActive);
				dialogUserSettingService.setCustomConfig(dialogId, 'CharSelectedItemFk', charSelItemFk);
				dialogUserSettingService.setCustomConfig(dialogId, 'CharSelectedOp', charSelectedOp);
				dialogUserSettingService.setCustomConfig(dialogId, 'CharSelectedItem', charSelectedItem);
				dialogUserSettingService.setCustomConfig(dialogId, 'CharOperators', charOperators);
				dialogUserSettingService.setCustomConfig(dialogId, 'BpStatusIsActive', bpStatusIsActive);
				dialogUserSettingService.setCustomConfig(dialogId, 'BpStatusSelItemFk', bpStatusSelItemFk);
				dialogUserSettingService.setCustomConfig(dialogId, 'BpStatus2IsActive', bpStatus2IsActive);
				dialogUserSettingService.setCustomConfig(dialogId, 'BpStatus2SelItemFk', bpStatus2SelItemFk);
				dialogUserSettingService.setCustomConfig(dialogId, 'ConGrandTotalIsActive', conGrandTotalIsActive);
				dialogUserSettingService.setCustomConfig(dialogId, 'IsFilterByStructure', isFilterByStructure);
				dialogUserSettingService.setCustomConfig(dialogId, 'GrandTotalOperation', grandTotalOperation);
				dialogUserSettingService.setCustomConfig(dialogId, 'GrandTotalValue', grandTotalValue);
				dialogUserSettingService.setCustomConfig(dialogId, 'ContractedDateOrderedIsActive', contractedDateOrderedIsActive);
				dialogUserSettingService.setCustomConfig(dialogId, 'StartDate', startDate);
				dialogUserSettingService.setCustomConfig(dialogId, 'EndDate', endDate);
			}

			function loadSearchBoxSetting() {
				IsBidderSearchPreAllocation().then(function (res) {
					if (res) {
						$scope.myModel.searchstring = dialogUserSettingService.getCustomConfig(dialogId, 'SearchString');
					}
				})
			}

			function LoadDialogSetting() {
				loadSearchBoxSetting();
				$scope.findBidderSetting.prcstructure.isActive = dialogUserSettingService.getCustomConfig(dialogId, 'StructureIsActive');
				if (!$scope.isFromProcurement) {
					$scope.findBidderSetting.prcstructure.selectedItemFk = dialogUserSettingService.getCustomConfig(dialogId, 'StructureFk');
				}
				$scope.findBidderSetting.location.isActive = dialogUserSettingService.getCustomConfig(dialogId, 'LocationIsActive');
				$scope.findBidderSetting.location.distance.isActive = dialogUserSettingService.getCustomConfig(dialogId, 'DistanceIsActive');
				$scope.findBidderSetting.location.distance.selectedItemFk = dialogUserSettingService.getCustomConfig(dialogId, 'DistanceSelectedItemFk');
				$scope.findBidderSetting.location.regional.isActive = dialogUserSettingService.getCustomConfig(dialogId, 'RegionalIsActive');
				$scope.findBidderSetting.location.regional.selectedItemFk = dialogUserSettingService.getCustomConfig(dialogId, 'RegionalSelectedItemFk');
				$scope.findBidderSetting.location.regional.addressElement = dialogUserSettingService.getCustomConfig(dialogId, 'RegionalAddressElement');
				$scope.findBidderSetting.evaluation.isActive = dialogUserSettingService.getCustomConfig(dialogId, 'EvaluationIsActive');
				$scope.findBidderSetting.evaluation.selectedItemFk = dialogUserSettingService.getCustomConfig(dialogId, 'EvaluationSelectedItemFk');
				$scope.findBidderSetting.evaluation.point = dialogUserSettingService.getCustomConfig(dialogId, 'EvaluationPoint');
				$scope.findBidderSetting.withCharacteristic.isActive = dialogUserSettingService.getCustomConfig(dialogId, 'CharIsActive');
				$scope.findBidderSetting.withCharacteristic.selectedItemFk = dialogUserSettingService.getCustomConfig(dialogId, 'CharSelectedItemFk');
				$scope.findBidderSetting.withCharacteristic.selectedOp = dialogUserSettingService.getCustomConfig(dialogId, 'CharSelectedOp');
				$scope.findBidderSetting.withCharacteristic.selectedItem = dialogUserSettingService.getCustomConfig(dialogId, 'CharSelectedItem');
				$scope.findBidderSetting.withCharacteristic.operators = dialogUserSettingService.getCustomConfig(dialogId, 'CharOperators');
				$scope.findBidderSetting.businesspartnerstatus.isActive = dialogUserSettingService.getCustomConfig(dialogId, 'BpStatusIsActive');
				$scope.findBidderSetting.businesspartnerstatus.selectedItemsFk = dialogUserSettingService.getCustomConfig(dialogId, 'BpStatusSelItemFk');
				$scope.findBidderSetting.businesspartnerstatus2.isActive = dialogUserSettingService.getCustomConfig(dialogId, 'BpStatus2IsActive');
				$scope.findBidderSetting.businesspartnerstatus2.selectedItemsFk = dialogUserSettingService.getCustomConfig(dialogId, 'BpStatus2SelItemFk');
				$scope.findBidderSetting.businesspartnerstatus.header = $translate.instant('procurement.common.findBidder.businesspartnerstatus.title');
				$scope.findBidderSetting.businesspartnerstatus2.header = $translate.instant('procurement.common.findBidder.businesspartnerstatus2.title');
				$scope.findBidderSetting.contractGrandTotal.isFilterByStructure = dialogUserSettingService.getCustomConfig(dialogId, 'IsFilterByStructure');
				$scope.findBidderSetting.contractGrandTotal.isActive = dialogUserSettingService.getCustomConfig(dialogId, 'ConGrandTotalIsActive');
				$scope.findBidderSetting.contractGrandTotal.selectedOp = dialogUserSettingService.getCustomConfig(dialogId, 'GrandTotalOperation');
				$scope.findBidderSetting.contractGrandTotal.total = dialogUserSettingService.getCustomConfig(dialogId, 'GrandTotalValue');
				$scope.findBidderSetting.contractedDateOrdered.isActive = dialogUserSettingService.getCustomConfig(dialogId, 'ContractedDateOrderedIsActive');
				const startDate = dialogUserSettingService.getCustomConfig(dialogId, 'StartDate');
				if (startDate) {
					$scope.findBidderSetting.contractedDateOrdered.startDate = moment(startDate);
				}
				const endDate = dialogUserSettingService.getCustomConfig(dialogId, 'EndDate');
				if (endDate) {
					$scope.findBidderSetting.contractedDateOrdered.endDate = moment(endDate);
				}
			}

			function onDblClick(e, args) {
				var selectedItem = args.grid.getDataItem(args.row);
				if (selectedItem) {
					$scope.modalOptions.ok();
				}
			}

			function showError(isShow, message, type) {
				$scope.error = {
					show: isShow, messageCol: 1, message: message, type: type
				};
			}

			function showInfo(isShow, message, type, bp = false) {
				$scope.alert = {
					show: isShow, messageCol: 1, message: message, type: type, showBp: bp
				};
			}

			function getSearchList() {
				$scope.isLoading = true;
				$scope.searchValueModified = true;
				searchRequest.SearchText = ($scope.myModel.searchstring || '');
				showError(false, '', errorType.error);
				var setting = $scope.findBidderSetting, location = setting.location, bidder = setting.bidder,
					evaluation = setting.evaluation, withCharacteristic = setting.withCharacteristic,
					prcstructure = setting.prcstructure, businesspartnerstatus = setting.businesspartnerstatus, businesspartnerstatus2 = setting.businesspartnerstatus2,
					contractGrandTotal = setting.contractGrandTotal, contractedDateOrdered = setting.contractedDateOrdered;

				if ($scope.myModel.selected?.length > 0 && $scope.myModel.mode != null) {
					searchRequest.AdditionalParameters.Column = $scope.myModel.selected;
					searchRequest.AdditionalParameters.Mode = $scope.myModel.mode;
				} else {
					searchRequest.AdditionalParameters.Column = [];
					searchRequest.AdditionalParameters.Mode = null;
				}

				if (location.isActive) {
					if (location.regional.isActive && !location.regional.selectedItemFk) {
						showError(true, $translate.instant(translatePrefix + '.selectCountryError'), errorType.error);
						$scope.isLoading = false;
						return;
					}
					if (location.distance.isActive) {
						SetlocationDistanceParameters();
					}
				}

				if (evaluation.isActive && !evaluation.selectedItemFk) {
					showError(true, $translate.instant(translatePrefix + '.selectEvaluationError'), errorType.error);
					$scope.isLoading = false;
					return;
				}

				if (searchRequest.SearchText) {
					bidder.isActive = true;
					bidder.bidderName = searchRequest.SearchText;
					bidder.bidderColumn = searchRequest.AdditionalParameters.Column;
					bidder.bidderMode = searchRequest.AdditionalParameters.Mode;
				} else {
					bidder.isActive = false;
					bidder.bidderName = '';
					bidder.bidderColumn = [];
					bidder.bidderMode = null;
				}
				var certificate = {
					isActive: !_.isNil($scope.certIsActive) && $scope.certIsActive,
					typeId: $scope.certTypeId
				};

				var parameter = {
					isLocation: location.isActive,
					isBidderName: bidder.isActive,
					isCharacteristic: withCharacteristic.isActive,
					isEvaluation: evaluation.isActive,
					isDistance: location.distance.isActive,
					isRegional: location.regional.isActive,
					isPrcStructure: prcstructure.isActive,
					isBusinesspartnerstatus: businesspartnerstatus.isActive,
					isBusinesspartnerstatus2: businesspartnerstatus2.isActive,
					distanceId: location.distance.selectedItemFk,
					regionalCountryId: location.regional.selectedItemFk,
					regionalAddressElement: location.regional.addressElement,
					bidderName: bidder.bidderName,
					evaluationId: evaluation.selectedItemFk,
					evaluationPoint: evaluation.point,
					basCharacteristicId: withCharacteristic.selectedItemFk,
					characteristicOperation: withCharacteristic.selectedOp ? withCharacteristic.selectedOp.value : '',
					characteristicValue2Compare: withCharacteristic.selectedItem ? withCharacteristic.selectedItem.compareValue : null,
					structureFk: prcstructure.selectedItemFk,
					businesspartnerstatusFks: businesspartnerstatus.selectedItemsFk,
					businesspartnerstatus2Fks: businesspartnerstatus2.selectedItemsFk,
					filterValue: JSON.stringify(searchRequest),
					pageNumber: page.number,
					pageSize: page.size,
					distanceParameters: locationDistanceParameters,
					bidderColumn: bidder.isActive ? bidder.bidderColumn : [],
					bidderMode: bidder.isActive ? bidder.bidderMode : null,
					isCommonBidder: !!$scope.isCommonBidder,
					isApprovedBP: businesspartnerstatus.isApprovedBP,
					certificateInfo: certificate,
					isContractGrandTotal: contractGrandTotal.isActive,
					isFilterByStructure: contractGrandTotal.isFilterByStructure,
					grandTotalOperation: contractGrandTotal.selectedOp ? contractGrandTotal.selectedOp.value : '',
					grandTotalValue: contractGrandTotal.total,
					isContractedDateOrdered: contractedDateOrdered.isActive,
					startDate: !_.isNil(contractedDateOrdered.startDate) ? moment(contractedDateOrdered.startDate).toDate() : null,
					endDate: !_.isNil(contractedDateOrdered.endDate) ? moment(contractedDateOrdered.endDate).toDate() : null
				};
				if ($scope.IsWizardForFindBidder) {
					if ($scope.isPrcCommonSuggestedBidder) {
						parameter.headerId = mainHeader.PrcHeaderEntity.Id;
					} else {
						parameter.headerId = mainHeader.Id;
					}
				} else {
					parameter.headerId = 0;
				}

				lookupPageSizeService.getPageSizeAsync().then(function (pageSize) {
					parameter.selectedBpId = $scope.selectedBpId;
					parameter.pageSize = page.size = pageSize;
					$http.post(url, parameter).then(function (res) {
						_.forEach(res.data.main, function (item) {
							dateProcessor.processItem(item);
						});

						if (res.data.log) {
							console.log(res.data.log);
						}

						var mainData = res.data.main;
						var totalLength = res.data.totalLength;
						page.currentLength = page.totalLength = totalLength;
						page.count = Math.ceil(page.totalLength / page.size);

						if ($scope.IsShowContracts) {
							checkIndeterminateness();
							if ($scope.IsWizardForCreateReq || $scope.wizardForCreateRfQFromPackage) {
								generateArray(mainData);
								setBpGridData(res.data, true);
							} else if ($scope.IsWizardForFindBidder) {
								setBpGridData(res.data);
								generateArray(mainData);
							} else {
								generateArray(mainData);
							}
						}
						// clear branch grid container
						if ($scope.IsShowBranch) {
							platformGridAPI.items.data('f3b7569b3ba344768005d7b4a24f62c1', []);
							//filterBusinessPartnerSubsidiaryService.resetArrayData();
							filterBusinessPartnerSubsidiaryService.setGenerateSubs(res.data.mapsubsidiary);
						}

						platformGridAPI.items.data($scope.gridId, mainData);
						filterBusinessPartnerContactService.setData([]);

					}, function () {
						// TODO: react to error
						$scope.isLoading = false;
					}).finally(function () {
						$scope.isLoading = false;
					});
				}, function () {
					// TODO: react to error
					$scope.isLoading = false;
				});

				function checkIndeterminateness() {
					var grid = platformGridAPI.grids.element('id', $scope.gridId);
					if (grid && grid.instance) {
						var _grid = grid.instance;
						var columnDef = _.find(_grid.getColumns(), {field: 'BpIsExisted'});

						if (columnDef) {
							var headers = _grid.getColumnHeaders();
							var ele = headers.find('#chkbox_' + _grid.getUID() + '_' + columnDef.id);

							if (ele.length) {
								var data = _grid.getData().getItems();
								var hasTrueValue = false;
								var hasFalseValue = false;

								if (data.length) {
									hasTrueValue = _.findIndex(data, _.set({}, columnDef.field, true)) !== -1;
									hasFalseValue = _.findIndex(data, _.set({}, columnDef.field, false)) !== -1;
								}

								ele.prop('disabled', !data.length);
								ele.prop('indeterminate', hasTrueValue && hasFalseValue);
								ele.prop('checked', hasTrueValue && !hasFalseValue);
							}
						}
					}
				}

				function generateArray() {
					$scope.generateArrayData = [];
				}

				function setBpGridData(data, isNoReadOnly) {
					/** @namespace data.mapcontact */
					var tempGenerateArrayData = $scope.generateArrayData;
					var tempGenerateSubsArrayData = $scope.generateSubsArrayData;
					$scope.generateArrayData = [];
					$scope.generateSubsArrayData = [];

					setBidderReadOnly(data.main);
					setContactGridChecked(data.main, data.mapcontact);
					if ($scope.generateArrayData.length <= 0 && tempGenerateArrayData !== undefined) {
						$scope.generateArrayData = tempGenerateArrayData;
					}
					if ($scope.generateSubsArrayData.length <= 0 && tempGenerateSubsArrayData !== undefined) {
						$scope.generateSubsArrayData = tempGenerateSubsArrayData;
					}

					function setBidderReadOnly(bpAllGridData) {

						const allSelectedBpIds = [];
						const selectedBpId = _options?.mainData?.BusinessPartnerFk;
						if (selectedBpId) {
							allSelectedBpIds.push(selectedBpId);
						}
						const selectedBpIds = _options?.bidderData?.map(e => e.BusinessPartnerFk) ?? [];
						allSelectedBpIds.push(...selectedBpIds);

						allSelectedBpIds.forEach(bpId => {
							const bpItem = _.find(bpAllGridData, {'Id': bpId});
							if (bpItem) {
								bpItem.BpIsExisted = true;
								platformRuntimeDataService.readonly(bpItem, [{'field': 'BpIsExisted', 'readonly': true}]);
							}
						});

						_.forEach($scope.bpGridData, function (bp) {
							var bpItem = _.find(bpAllGridData, {'Id': bp.Id});
							if (bpItem) {
								bpItem.BpIsExisted = true;
							}
						});
					}

					function setContactGridChecked(bpGridData, selectedBp) {
						_.forEach(selectedBp, function (bp) {
							var bpItem = _.find(bpGridData, {'Id': bp.BusinessPartnerFk});
							if (bpItem) {
								var contactDtos = bpItem.ContactDtos,
									contactItem = _.filter(contactDtos, {Id: bp.ContactFk});
								_.forEach(contactDtos, function (item) { // jshint ignore : line
									platformRuntimeDataService.readonly(item, [{
										field: 'bpContactCheck',
										readonly: true
									}]);
								});
								if (contactItem.length) {
									contactItem[0].bpContactCheck = true;
									$scope.generateArrayData.push({bpId: bp.BusinessPartnerFk, ctId: bp.ContactFk});
									filterBusinessPartnerContactService.pushArrayData({
										bpId: bp.BusinessPartnerFk,
										ctId: bp.ContactFk
									});
								}
							}
						});
					}
				}
			}

			var moduleNameFields = {
				prc_requisition: 'procurement.requisition',
				prc_contract: 'procurement.contract',
				prc_package: 'procurement.package',
				prc_invoice: 'procurement.invoice',
				prc_pes: 'procurement.pes',
				prc_rfq: 'procurement.rfq',
				prc_quote: 'procurement.quote',
				prj_main: 'project.main'
			};

			function SetlocationDistanceParameters() {
				var extBidderServ = 'procurementPackage2ExtBidderService';
				var parentEntity = $scope.$parent.entity || mainHeader;

				if (_options.mainService === extBidderServ || !_.isNil(_options.FromPackageWizard)) {
					var mainServ = moduleContext.getMainService().parentService();
					if (!_.isNil(mainServ)) {
						var selParent = mainServ.getSelected();
						if (!_.isNil(selParent)) {
							parentEntity = selParent;
						}
					}
				}
				var currentModule = $scope.$root.currentModule;
				locationDistanceParameters.moduleName = currentModule;

				if (!parentEntity) {
					return;
				}

				switch (currentModule) {
					case moduleNameFields.prc_requisition:
					case moduleNameFields.prc_contract:
					case moduleNameFields.prc_package:
					case moduleNameFields.prj_main:
						if (parentEntity.AddressFk) {
							locationDistanceParameters.addressFk = parentEntity.AddressFk;
						} else {// in sub module
							locationDistanceParameters.isSubModule = true;
							locationDistanceParameters.s_headerFk = parentEntity.PrcHeaderFk || null;
							locationDistanceParameters.t_headerFk = parentEntity.PrcItemFk || null;
						}
						break;
					case moduleNameFields.prc_invoice:// ==>ConHeaderFk
					case moduleNameFields.prc_pes:// ==>ConHeaderFk
					case moduleNameFields.prc_rfq:// ==>RfqHeaderFk
					case moduleNameFields.prc_quote:// ==>PrcHeaderFk or PrcItemFk
						locationDistanceParameters.s_headerFk = parentEntity.ConHeaderFk || parentEntity.RfqHeaderFk || parentEntity.PrcHeaderFk || null;
						locationDistanceParameters.t_headerFk = parentEntity.PrcItemFk || null;
						if ($scope.IsWizardForFindBidder) {
							locationDistanceParameters.s_headerFk = parentEntity.Id;
						}
						break;
					default:
						break;
				}
				locationDistanceParameters.projectFk = parentEntity.ProjectFk || parentEntity.PrjProjectFk || null;
				locationDistanceParameters.companyFk = parentEntity.CompanyFk || null;
			}

			function SetNavigateParameters(moduleName, registerService, id, code, successMessage) {
				$scope.modalOptions.step = 'step2';
				navigateParameters.moduleName = moduleName;
				navigateParameters.registerService = registerService;
				navigateParameters.Id = id;
				$scope.modalOptions.navigateTitle = platformModuleInfoService.getNavigatorTitle(moduleName);
				$($('#businessPartnerDIV').parent()).css('margin', '0 auto').css('width', '600px').css('height', 'auto');
				showInfo(true, successMessage + '<br />' + code, 0, true);
			}

			function stateGo(data) {
				if (data && data.Id) {
					var ReqStatus = _.find(basicsLookupdataLookupDescriptorService.getData('RfqStatus'), {Id: data.RfqStatusFk});
					var prefix = 'procurement.common.wizard.request.';
					// var code = data.Code + $translate.instant(prefix + 'for') + data.Description + $translate.instant(prefix + 'is') + (_.isNil(ReqStatus.DescriptionInfo)  ? ReqStatus.Description : ReqStatus.DescriptionInfo.Translated);
					let code = $translate.instant(prefix + 'newCode', {newCode: data.Code});
					var successMessage = $translate.instant('procurement.requisition.wizard.create.request.for.createSuccessfully');
					SetNavigateParameters('procurement.rfq', 'procurementRfqMainService', data.Id, code, successMessage);
				}
			}

			function init() {
				if ($scope.settings !== undefined) {
					$scope.settings.dataView.resetDataPage({count: 0, currentLength: 0, number: 0, totalLength: 0});
				}
				LoadDialogSetting();
				if (displayText !== '') {
					$scope.myModel.searchstring = displayText;
				}
				if (!_.isNil($scope.myModel.searchstring) && $scope.myModel.searchstring !== '') {
					pageState.PageNumber = 0;
					getSearchList();
				}
			}

			function createRfq(options) {
				$scope.isLoading = true;
				procurementReqCreateRfqWizardDataService.createRfq(options).then(function (data) {
					$scope.isLoading = false;
					stateGo(data);
				}, function () {
					$scope.isLoading = false;
				});
			}

			function createRfqFromPackageAsync(options) {
				$scope.isLoading = true;
				return $http.post(globals.webApiBaseUrl + 'procurement/rfq/header/createfrompackage', options).then(function (response) {
					return response.data;
				}).finally(function () {
					$scope.isLoading = false;
				});
			}

			function createContract(options) {
				$scope.isLoading = true;
				requisitionWizardCreateContractService.createContractWizard(options).then(function (data) {
					$scope.isLoading = false;
					if (angular.isArray(data) && data.length > 0) {
						let dataItem = data[0];
						var ConStatus = _.find(basicsLookupdataLookupDescriptorService.getData('ConStatus'), {Id: dataItem.ConStatusFk});
						var prefix = 'procurement.common.wizard.request.';
						// var code = data.Code + $translate.instant(prefix + 'for') + data.Description + $translate.instant(prefix + 'is') + (ConStatus.DescriptionInfo.Translated===null ? ConStatus.Description : ConStatus.DescriptionInfo.Translated);
						let code = $translate.instant(prefix + 'newCode', {newCode: dataItem.Code});
						var successMessage = $translate.instant('procurement.contract.wizard.createSucceed');

						SetNavigateParameters('procurement.contract', 'procurementContractHeaderDataService', dataItem.Id, code, successMessage);
					}
				}, function () {
					$scope.isLoading = false;
				});
			}

			function createBusinessPartner(options, refreshBidder, isPrcCommonSuggestedBidder) {
				var headerId = options.headerId,
					businessPartnerList = options.businessPartnerList,
					checkBpMapContact = options.checkBpMapContact,
					checkBpMapSubsidiary = options.checkBpMapSubsidiary;

				var CreateBpWizardResult = {
					NoBpSearchOut: 0,
					NoMatchBpSearchOut: 1,
					MatchAndSaveSuccess: 2,
					NotNeedSelectFindSupplier: 3
				};

				if (businessPartnerList.length > 0) {
					if (options.isPrcCommonSuggestedBidder) {
						procurementCommonCreateSuggestedBidderService
							.createSuggestedBusinessPartner(headerId, businessPartnerList, checkBpMapContact, checkBpMapSubsidiary)
							.then(function (response) {
								handleResult(response.data, refreshBidder, isPrcCommonSuggestedBidder);
							}, function () {
								$scope.isLoading = false;
								showError(true, $translate.instant(translatePrefix + '.createBusinessPartnerFail'), errorType.error);
							});
					} else {
						procurementRfqBusinessPartnerWizardService
							.createRfqBusinessPartner(headerId, businessPartnerList, checkBpMapContact, checkBpMapSubsidiary)
							.then(function (response) {
								handleResult(response, refreshBidder);
							}, function () {
								$scope.isLoading = false;
								showError(true, $translate.instant(translatePrefix + '.createBusinessPartnerFail'), errorType.error);
							});
					}

				} else {
					showError(true, $translate.instant(translatePrefix + '.noBidderCreate'), errorType.error);
				}

				function handleResult(response, refreshBidder, isPrcCommonSuggestedBidder) {
					$scope.isLoading = true;
					if (response.Message === CreateBpWizardResult.NotNeedSelectFindSupplier) {
						showError(true, $translate.instant(translatePrefix + '.notNeedSelectFindSupplier'), errorType.error);
					} else if (response.Message === CreateBpWizardResult.NoBpSearchOut) {
						showError(true, $translate.instant(translatePrefix + '.responseNoData'), errorType.error);
					} else if (response.Message === CreateBpWizardResult.NoMatchBpSearchOut || response.Message === CreateBpWizardResult.MatchAndSaveSuccess) {

						showDialog(response, refreshBidder, isPrcCommonSuggestedBidder);
					}
				}

				function showDialog(response, refreshBidder, isPrcCommonSuggestedBidder) {
					var message = '<p>' + $translate.instant(translatePrefix + '.findSupplierResult.oldSupplierCount') + ' ' +
						response.OldResultCount + ' ' + '</p>';

					message += '<p>' + $translate.instant(translatePrefix + '.findSupplierResult.resultSaveCount') + ' ' +
						response.resultCount + '</p>';
					$scope.$close(false);
					var modalOptions = {
						headerTextKey: 'cloud.common.informationDialogHeader',
						bodyTextKey: message,
						showOkButton: true,
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions).then(function () {
						if (!isPrcCommonSuggestedBidder) {
							stateGo(response.Entity);
						}
						refreshBidder();
					});
				}

			}

			function checkAll(e) {
				$scope.$apply(function () {
					onCellChange(e.target.checked);
				});
			}

			function onCellChange(e, data) {
				// $scope.bpGridData = [];
				var gridData = platformGridAPI.items.data($scope.gridId);

				if ($scope.IsWizardForFindBidder) {
					gridData.forEach(function (item) {
						if (item.__rt$data && item.__rt$data.readonly && !!_.find(item.__rt$data.readonly, {
							field: 'BpIsExisted',
							readonly: true
						})) {
							item.BpIsExisted = true;
						}
						if (item.Id === data.item.Id) {
							item.BpIsExisted = data.item.BpIsExisted;
						}
					});
				}

				var items = _.filter(gridData, function (item) {
					return item.BpIsExisted === true;
				});

				_.forEach(items, function (item) {
					var isExist = _.some($scope.bpGridData, ['Id', item.Id]);
					if (!isExist) {
						$scope.bpGridData.push(item);
					}
				});

				if (data.item.BpIsExisted === false) {
					$scope.bpGridData = _.filter($scope.bpGridData, function (item) {
						return item.BpIsExisted === true;
					});
				}

				if ($scope.bpGridData.length === 0) {
					$scope.modalOptions.disableOkButton = false;
				}
				if ($scope.IsShowContracts) {
					var selectedItem = platformGridAPI.rows.selection({
						gridId: $scope.gridId
					});
					if ($scope.modalOptions.selectedItem !== selectedItem) {
						$scope.modalOptions.selectedItem = selectedItem;
						if (selectedItem) {
							$scope.modalOptions.contactGridTitle = $scope.modalOptions.contactGridTitleCopy + '（' + selectedItem.BusinessPartnerName1 + ')';
							filterBusinessPartnerContactService.setSelectContact(selectedItem);
						}
					}
				}
			}

			function getheaderText() {
				var text = $translate.instant('cloud.common.dialogTitleBusinessPartner');
				if ($scope.IsWizardForCreateReq || $scope.wizardForCreateRfQFromPackage) {
					text = $translate.instant('procurement.requisition.wizard.create.request.for.quote');
				}
				if ($scope.IsWizardForCreateContract) {
					text = $translate.instant('procurement.common.wizard.item.createContract');
				}
				if ($scope.IsWizardForFindBidder) {
					text = $translate.instant('procurement.common.findSupplier.headerText');
				}
				return text;
			}

			function extendGrouping(gridColumns) {
				angular.forEach(gridColumns, function (column) {
					angular.extend(column, {
						grouping: {
							title: column.name$tr$, getter: column.field, aggregators: [], aggregateCollapsed: true
						}, formatter: column.formatter || platformGridDomainService.formatter('description')
					});
				});
				return gridColumns;
			}

			function GetdisplayText() {
				if ($scope.IsWizardForCreateContract)
					return '';
				if ($scope.displayText)
					return $scope.displayText;
				if ($scope.ngModel && !_.isInteger($scope.ngModel))
					return $scope.ngModel;

				return '';
			}

			function checkApprovedBP() {
				if (!$scope.approvalBPRequired) {
					return false;
				}

				const systemOptionDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
				if (!systemOptionDataService) {
					return false;
				}

				const systemOptions = systemOptionDataService.getList();
				if (!systemOptions || systemOptions.length === 0) {
					return false;
				}
				const optionWithValue = _.find(systemOptions, {Id: 10021});
				return optionWithValue && optionWithValue.ParameterValue !== '0';
			}

			function GetCurrentStatusIdsSimplified() {
				const selectedItem = basicsLookupdataLookupDescriptorService.getData('BusinessPartnerStatus');
				const filteredItem = checkApprovedBP() ? _.filter(selectedItem, {IsApproved: true}) : selectedItem;
				return _.map(filteredItem, 'Id');
			}

			function GetCurrentStatus2IdsSimplified() {
				const selectedItem = basicsLookupdataLookupDescriptorService.getData('BusinessPartnerStatus2');
				return _.map(selectedItem, 'Id');
			}

			function IsSetDefaultContactInPBLookup() {
				return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/issetdefaultcontactinbplookup').then(function (res) {
					$scope.needSetDefaultContact = res.data;
					filterBusinessPartnerContactService.setIsNeedDefaultContact($scope.needSetDefaultContact);
				});
			}

			function IsBidderSearchPreAllocation() {
				const defer = $q.defer();

				if ($scope.isBidderSearchPreAllocation !== null) {
					defer.resolve($scope.isBidderSearchPreAllocation);
					return defer.promise;
				}

				// try to get system options from lookup cache.
				var systemOptionDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
				if (systemOptionDataService) {
					const options = systemOptionDataService.getList();
					if (options) {
						const option = _.find(options, function (item) {
							return item.Id === 10117
						});
						if (option) {
							$scope.isBidderSearchPreAllocation = option.ParameterValue === 'true';
							defer.resolve($scope.isBidderSearchPreAllocation);
							return defer.promise;
						}
					}
				}
				// if system option lookup is not preload, get it from Api.
				return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/isbiddersearchpreallocation').then(function (res) {
					$scope.isBidderSearchPreAllocation = res.data;
					return $scope.isBidderSearchPreAllocation;
				});
			}

			$q.all([bpStatusPromise, bpStatus2Promise, needSetDefaultContactPromise]).then(() => {
				const statusIds = GetCurrentStatusIdsSimplified();
				const status2Ids = GetCurrentStatus2IdsSimplified();

				const bpStatus = {
					isActive: false, selectedItemsFk: statusIds, approvalBPRequired: $scope.approvalBPRequired, isApprovedBP: $scope.isApprovedBP, codeLookupConfig: {
						rt$readonly: function () {
							return !bpStatus.isActive;
						}
					}
				};
				const bpStatus2 = {
					isActive: false, selectedItemsFk: status2Ids, codeLookupConfig: {
						rt$readonly: function () {
							return !bpStatus2.isActive;
						}
					}
				};

				$scope.findBidderSetting.businesspartnerstatus = bpStatus;
				$scope.findBidderSetting.businesspartnerstatus2 = bpStatus2;

				init();
			});

			filterBusinessPartnerContactService.setCtOptions($scope.modalOptions);
			filterBusinessPartnerContactService.setIsShowContracts($scope.IsShowContracts);
			filterBusinessPartnerSubsidiaryService.setCtOptions($scope.modalOptions);
			filterBusinessPartnerGuarantorService.setCtOptions($scope.modalOptions);
			$scope.$on('$destroy', function () {
				unwatch();
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', showSubData);
				if (!$scope.IsShowContracts) {
					platformGridAPI.events.unregister($scope.gridId, 'onDblClick', onDblClick);
				}
				if ($scope.IsShowContracts) {
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
				}
				if ($scope.IsShowBranch) {
					platformGridAPI.events.unregister($scope.branchGridId, 'onSelectedRowsChanged', showContacts);
				}
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				if (platformGridAPI.grids.exist('f3b7569b3ba344768005d7b4a24f62c1')) {
					platformGridAPI.grids.unregister('f3b7569b3ba344768005d7b4a24f62c1');
				}
				if (platformGridAPI.grids.exist('015039777D6F4A1CA0BF9EEC6E9D244E')) {
					platformGridAPI.grids.unregister('015039777D6F4A1CA0BF9EEC6E9D244E');
				}
				if (platformGridAPI.grids.exist('95717603aed74a1da6bf51b510ddca09')) {
					platformGridAPI.grids.unregister('95717603aed74a1da6bf51b510ddca09');
				}
				filterBusinessPartnerSubsidiaryService.resetArrayData();
				filterBusinessPartnerContactService.resetArrayData();
				filterBusinessPartnerContactService.resetBranchContactMap();
			});

		}]);

})(angular);