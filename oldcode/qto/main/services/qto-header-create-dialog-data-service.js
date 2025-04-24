/**
 * Created by xia on 12/22/2016.
 */

(function() {
	/* global  globals, _, Platform */
	'use strict';

	var moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoMainHeaderCreateDialogDataService', ['_', '$injector', '$q', '$http', 'platformSchemaService', '$translate', 'platformTranslateService',
		'platformModalService', 'platformRuntimeDataService', 'platformDataValidationService', 'cloudDesktopSidebarService', 'qtoHeaderCreateDialogReadOnlyProcessor',
		'platformUserInfoService', 'basicsClerkUtilitiesService','basicsLookupdataLookupDescriptorService','basicsLookupdataConfigGenerator', 'qtoMainProjectModes', 'qtoRubricCategory',
		function (_, $injector, $q, $http, platformSchemaService, $translate, platformTranslateService,
			platformModalService, runtimeDataService, platformDataValidationService, cloudDesktopSidebarService, readOnlyProcessor,
			platformUserInfoService, basicsClerkUtilitiesService,basicsLookupdataLookupDescriptorService,basicsLookupdataConfigGenerator, qtoMainProjectModes, qtoRubricCategory) {

			let service = {};

			let defaultQtoPurposeTypeId = -1, defaultQtoTypeId = 0, defaultBasRubricCategoryFk = 0;
			let defaultBasGoniometerTypeFk = null;
			let defaultProject = null;
			let isGenerated = false;
			let prcBoqLookupService = null;
			let prjBoqLookupService = null;
			let dialogConfig, containerData, defaultValues = {
				ProjectFk: 0,
				ClerkFk: 0,
				QtoTargetType: defaultQtoPurposeTypeId,
				IsGenerated : isGenerated,
				QtoTypeFk: defaultQtoTypeId,
				BasRubricCategoryFk: defaultBasRubricCategoryFk,
				BasGoniometerTypeFk: defaultBasGoniometerTypeFk
			};

			// var contractedOrderedItem = { DescriptionInfo: { Translated: $translate.instant('sales.common.orderedContractsStatusDescription') }};

			service.setIsGeneratedState = function(state) {
				isGenerated = state;
			};

			service.setQtoTypeInfo = function(qtoTypeFk, basRubricCategoryFk, basGoniometerTypeFk) {
				defaultQtoTypeId = qtoTypeFk;
				defaultBasRubricCategoryFk = basRubricCategoryFk;
				defaultBasGoniometerTypeFk = basGoniometerTypeFk;
			};

			service.getOptions = function () {

				var options = {
					title: 'qto.main.createQtoHeaderDialogTitle',
					fid: 'qto.main.createQtoHeaderDialog',
					attributes: {},
					uiStandardService: 'qtoMainHeaderUIStandardService',
					readOnlyProcessor: readOnlyProcessor,
					validationService: 'qtoMainHeaderValidationService',
					IsWQ:true,
					IsAQ:true,
					IsIQ:true,
					IsBQ:true

				};

				options.attributes = {
					QtoTargetType: {mandatory: true, required:true, errorParam: $translate.instant('qto.main.QtoTargetType')},
					ProjectFk: {mandatory: false,required:true, errorParam: $translate.instant('cloud.common.entityProject')},
					QtoTypeFk: { mandatory: true, required: true, errorParam: $translate.instant('qto.main.qtoTypeFk') },
					BasRubricCategoryFk:  { mandatory: true, required: true, errorParam: $translate.instant('qto.main.BasRubricCategoryFk') },
					Code: {mandatory: true, required:true, errorParam: $translate.instant('cloud.common.entityCode')},
					DescriptionInfo: {mandatory: false, errorParam: $translate.instant('cloud.common.entityDescription')},
					OrdHeaderFk: {mandatory: false, required:true, errorParam: $translate.instant('qto.main.OrdHeaderFk')}, // Sales Contract
					ConHeaderFk: {mandatory: false, errorParam: $translate.instant('qto.main.ConHeaderFk')}, // Contract
					PrjBoqFk: {mandatory: false,required:true, errorParam: $translate.instant('qto.main.PrcBoq')}, // BoQ
					PackageFk: {mandatory: false,required:true, errorParam: $translate.instant('qto.main.Package')}, // Package
					Package2HeaderFK: {mandatory: false,required:true, errorParam: $translate.instant('qto.main.Package2Header')}, // Sub Package
					PrcBoqFk: {mandatory: false, required:true,errorParam: $translate.instant('qto.main.PrcBoq')}, // BoQ Reference No.
					ClerkFk: {mandatory: false, required:false,errorParam: $translate.instant('qto.main.customerCode')} ,// Clerk

					IsIQ: {mandatory: false, required:false,errorParam: $translate.instant('qto.main.isIq')} ,// Clerk
					IsBQ: {mandatory: false, required:false,errorParam: $translate.instant('qto.main.isBq')} ,// Clerk
					IsAQ: {mandatory: false, required:false,errorParam: $translate.instant('qto.main.isAq')} ,// Clerk
					IsWQ: {mandatory: false, required:false,errorParam: $translate.instant('qto.main.isWq')} ,// Clerk

				};

				options.defaultValues = {
					ProjectFk: defaultValues ? defaultValues.ProjectFk : 0,
					ClerkFk: defaultValues ? defaultValues.ClerkFk : 0,
					QtoTargetType: defaultQtoPurposeTypeId,
					Code: defaultValues && defaultValues.IsGenerated ? $translate.instant('cloud.common.isGenerated') : '',
					QtoTypeFk: defaultQtoTypeId,
					BasRubricCategoryFk: defaultBasRubricCategoryFk,
					BasGoniometerTypeFk: defaultBasGoniometerTypeFk,
					IsWQ:true,
					IsAQ:true,
					IsIQ:true,
					IsBQ:true
				};

				let QtoTargetTypeRow = basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
					'basics.customize.qtopurposetype',
					'Description',
					{
						gid: 'baseGroup',
						rid: 'QtoTargetType',
						attribute: 'QtoTargetType',
						model: 'QtoTargetType',
						required: true,
						sortOrder: 2,
						label$tr$: 'qto.main.QtoTargetType',
						label: 'Qto Purpose',
					},
					false,
					{
						required: true,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									var selectedItem = args.selectedItem;
									service.onSelectedQtoTargetTypeChanged.fire(selectedItem.Id);
									args.entity.PrcBoqFk = null;
									args.entity.PrjBoqFk = null;
								}
							}
						]
					});

				options.rows = [
					{
						attribute: 'ConHeaderFk', // procurement contract
						config: {
							'rid': 'ConHeaderFk',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.ConHeaderFk',
							'model': 'ConHeaderFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'qto-header-procurement-contract-lookup-dialog',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'filterKey': 'qto-main-create-header-procurment-contract-filter',
									title: { name:'cloud.common.dialogTitleContract' },
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												var selectedDataItem = args.entity;
												if (args.selectedItem !== null) {
													selectedDataItem.BusinessPartnerFk = args.selectedItem.BusinessPartnerFk;
													selectedDataItem.Package2HeaderFk =  args.selectedItem.Package2HeaderFk;
													// refresh the package lookup
													selectedDataItem.PackageFk = args.selectedItem.PackageFk;
													var qtoPackageLookupService = $injector.get('qtoHeaderPackageLookupDialogService');
													var packageList = qtoPackageLookupService.getList();
													var itemPackage = _.find(packageList, {Id: selectedDataItem.PackageFk});
													if(!itemPackage){
														qtoPackageLookupService.clear();
													}

													selectedDataItem.PrcStructureFk = args.selectedItem.PrcStructureFk;
													selectedDataItem.PrcHeaderFk = args.selectedItem.PrcHeaderFk;
													selectedDataItem.ContractCode = args.selectedItem.Code;
													selectedDataItem.PrcCopyModeFk = args.selectedItem.PrcCopyModeFk;
													selectedDataItem.ClerkFk = args.selectedItem.ClerkPrcFk ?  args.selectedItem.ClerkPrcFk :selectedDataItem.ClerkFk;
													$http.get(globals.webApiBaseUrl + 'procurement/contract/masterrestriction/list?mainItemId='+ args.selectedItem.Id).then(function(response){
														if(response && response.data){
															selectedDataItem.BoqWicCatFks = _.map(response.data, 'BoqWicCatFk');
														}
													});

													$http.get(globals.webApiBaseUrl + 'procurement/common/boq/list?prcHeaderFk=' + selectedDataItem.PrcHeaderFk + '&exchangeRate=1').then(function(response){
														if(response && response.data){
															selectedDataItem.PrcBoqsReference = _.map(response.data, 'BoqRootItem.Reference');
														}
													});
												}
											}
										}
									],
									dialogOptions: {
										alerts: [{
											theme: 'info',
											message: $translate.instant('sales.common.onlyOrderedContractsStatusInfo',
												{statuslist: $translate.instant('sales.common.orderedContractsStatusDescription') })
										}]
									}
								}
							}
						}
					},
					{
						attribute: 'OrdHeaderFk', // sales contract
						config: {
							'rid': 'OrdHeaderFk',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.OrdHeaderFk',
							'model': 'OrdHeaderFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'qto-header-sales-contract-lookup-dialog',
								'descriptionMember': 'DescriptionInfo.Description',
								'lookupOptions': {
									'filterKey': 'qto-main-header-sales-contract-filter',
									'showClearButton': true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												var selectedDataItem = args.entity;
												if (args.selectedItem !== null) {
													selectedDataItem.BusinessPartnerFk = args.selectedItem.BusinesspartnerFk;
													selectedDataItem.PackageFk = args.selectedItem.PackageFk;
													selectedDataItem.PrcStructureFk = args.selectedItem.PrcStructureFk;
													selectedDataItem.ContractCode = args.selectedItem.Code;
													// selectedDataItem.PrjBoqFk = null;
													selectedDataItem.ClerkFk = args.selectedItem.ClerkFk ? args.selectedItem.ClerkFk :selectedDataItem.ClerkFk;
												}
											}
										}
									],
									dialogOptions: {
										alerts: [{
											theme: 'info',
											message: $translate.instant('sales.common.onlyOrderedContractsStatusInfo',
												{statuslist: $translate.instant('sales.common.orderedContractsStatusDescription') })
										}]
									}
								}
							}
							// 'required':'true'
						}
					},
					{
						attribute: 'PackageFk',
						config: {
							'rid': 'PackageFk',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.Package',
							'model': 'PackageFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'qto-header-package-lookup-dialog',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'filterKey': 'qto-main-header-package-filter',
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												var selectedDataItem = args.entity;
												if (args.selectedItem !== null) {
													if(selectedDataItem.ConHeaderFk){  // if have package contract
														if(!selectedDataItem.ClerkFk){
															selectedDataItem.ClerkFk = args.selectedItem.ClerkPrcFk;
														}
													}else{
														if(args.selectedItem.ClerkPrcFk){
															selectedDataItem.ClerkFk = args.selectedItem.ClerkPrcFk;
														}
													}
												}
											}
										}
									]
								}
							},
							'required':'true'
						}
					},
					{
						attribute: 'QtoTargetType',
						config:QtoTargetTypeRow
					},
					{
						attribute: 'QtoTypeFk',
						config: {
							'rid': 'QtoTypeFk',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.qtoTypeFk',
							'model': 'QtoTypeFk',
							'type': 'directive',
							'directive': 'qto-type-combobox',
							'options': {
								'filterKey': 'qto-main-create-header-qto-type-filter',
								'displayMember': 'DescriptionInfo.Description',
								'events': [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let itemSelected = args.selectedItem;
											if (itemSelected) {
												let previousItemIsCrb = args.previousItem.BasRubricCategoryFk === qtoRubricCategory.CrbRubricCategory;
												let selectedItemIsCrb =  itemSelected.BasRubricCategoryFk === qtoRubricCategory.CrbRubricCategory;
												itemSelected.isReSetPrcAndPrjBoq = false;
												if(previousItemIsCrb !== selectedItemIsCrb){
													if(prcBoqLookupService){
														prcBoqLookupService.selectItem(null);
													}
													if(prjBoqLookupService){
														prjBoqLookupService.selectItem(null);
													}
													itemSelected.isReSetPrcAndPrjBoq = true;
												}

												service.onSelectedQtoTypeChanged.fire(itemSelected);
												args.entity.BasRubricCategoryFk = itemSelected.BasRubricCategoryFk;
												args.entity.BasGoniometerTypeFk = itemSelected.BasGoniometerTypeFk;
											}
										}
									}
								]
							},
							'required':'true'
						}
					},
					{
						attribute: 'BasRubricCategoryFk',
						config: {
							'rid': 'BasRubricCategoryFk',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.BasRubricCategoryFk',
							'model': 'BasRubricCategoryFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							'required':'true'
						}
					},
					{
						attribute: 'Code',
						config: {
							'rid': 'Code',
							'gid': 'baseGroup',
							'label$tr$': 'cloud.common.entityCode',
							'model': 'Code',
							'type': 'code',
							'readonly': 'true',
							'required':'true'
						}
					},
					{
						attribute: 'DescriptionInfo',
						config: {
							'rid': 'DescriptionInfo',
							'gid': 'baseGroup',
							'label$tr$': 'cloud.common.entityDescription',
							'model': 'DescriptionInfo',
							'type': 'translation'
						}
					},
					{
						attribute: 'Package2HeaderFK',
						config: {
							'rid': 'Package2HeaderFK',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.Package2Header',
							'model': 'Package2HeaderFK',
							'type': 'directive',
							'directive': 'procurement-package-package2-header-combobox',
							'options': {
								filterKey: 'qto-main-package2Header-filter',
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											var selectedItem = args.selectedItem;
											args.entity.PrcHeaderFkOriginal = selectedItem.PrcHeaderFk;
										}
									}
								]
							},
							'required':'true'
						}
					},
					{
						attribute: 'PrcBoqFk',
						config: {
							'rid': 'PrcBoqFk',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.PrcBoq',
							'model': 'PrcBoqFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'procurement-common-prc-boq-extended-Lookup',
								'descriptionMember': 'BriefInfo.Translated',
								'lookupOptions': {
									'filterKey': 'qto-main-create-header-boq-filter',
									'events': [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												var selectedItem = args.selectedItem;
												args.entity.BoqHeaderFk = selectedItem ? selectedItem.BoqHeaderFk : null;

												// if target type is pes and the prc contract is not null ,take BoqItemPrjBoqFk
												if (args.entity.QtoTargetType === 1 && args.entity.ConHeaderFk) {
													args.entity.BoqHeaderFk = selectedItem ? selectedItem.BoqItemPrjBoqFk : null;
												}
											}
										},
										{
											name: 'onInitialized',
											handler: function (e, args) {
												service.setPrcBoqLookup(args.lookup);
											}
										}
									],
								}
							},
							'required':'true'
						}
					},
					{
						attribute: 'PrjBoqFk',
						config: {
							'rid': 'PrjBoqFk',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.PrcBoq',
							'model': 'PrjBoqFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'qto-main-project-boq-lookup',
								'descriptionMember': 'BriefInfo.Translated',
								'lookupOptions': {
									'filterKey': 'qto-main-create-header-project-boq-filter',
									'events': [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												var selectedItem = args.selectedItem;
												args.entity.BoqHeaderFk = selectedItem ? selectedItem.BoqHeaderFk : null;
											}
										},
										{
											name: 'onInitialized',
											handler: function (e, args) {
												service.setPrjBoqLookup(args.lookup);
											}
										}
									],
									'showClearButton': true
								}
							},
							'required':'true'
						}
					},
					{
						attribute: 'IsIQ',
						config: {
							'rid': 'IsIQ',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.isIq',
							'model': 'IsIQ',
							'type': 'check',
							'required':'false'

						}
					},
					{
						attribute: 'IsBQ',
						config: {
							'rid': 'IsBQ',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.isBq',
							'model': 'IsBQ',
							'type': 'check',
							'required':'false'
						}
					},{
						attribute: 'IsAQ',
						config: {
							'rid': 'IsAQ',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.isAq',
							'model': 'IsAQ',
							'type': 'check',
							'required':'false'
						}
					},
					{
						attribute: 'IsWQ',
						config: {
							'rid': 'IsWQ',
							'gid': 'baseGroup',
							'label$tr$': 'qto.main.isWq',
							'model': 'IsWQ',
							'type': 'check',
							'required':'false'
						}
					}];

				return options;

			};

			var formConfiguration = {}, domains;
			var self = this, layoutService, uiStandardService, validationService, attributes = [], dataItem = {}, detailConfig, newRow, sortOrder = 0;

			self.checkIsMandatoryProperty = function (prop) {
				if (!domains[prop].mandatory) {
					return false;
				}
				if (prop === 'Version' || prop === 'InsertedAt' || prop === 'InsertedBy' || prop === 'IsLive') {
					return false;
				}

				if (domains[prop].domain === 'boolean') {
					return false;
				}

				return !(!layoutService.overloadsMandatory || layoutService.overloadsMandatory.indexOf(prop) === -1);
			};

			self.addValidation = function (row) {
				var syncName = 'validate' + row.model;
				var asyncName = 'asyncValidate' + row.model;

				if(row.model === 'OrdHeaderFk'){
					return;
				}

				if (validationService[syncName]) {
					row.validator = validationService[syncName];
				}

				if (validationService[asyncName]) {
					row.asyncValidator = validationService[asyncName];
				}
			};

			self.getFormConfiguration = function (options) {
				formConfiguration = {
					fid: options.fid,
					version: '0.2.4',
					showGrouping: false,
					change: 'change',
					groups: [{
						gid: 'baseGroup',
						attributes: []
					}],
					rows: []
				};

				uiStandardService = options.uiStandardService;
				if (angular.isString(uiStandardService)) {
					uiStandardService = $injector.get(uiStandardService);
				}

				detailConfig = uiStandardService.getStandardConfigForDetailView();

				if (angular.isString(options.validationService)) {
					validationService = $injector.get(options.validationService);
				}

				if (detailConfig.addValidationAutomatically && validationService) {
					_.forEach(detailConfig.rows, function (row) {
						self.addValidation(row);
					});

					if (options.rows) {
						_.forEach(options.rows, function (row) {
							self.addValidation(row.config);
						});
					}
				}

				if (!options.attributes) {
					if (!options.typeName || !options.moduleSubModule || !options.layoutService) {
						return;
					}

					domains = platformSchemaService.getSchemaFromCache({
						typeName: options.typeName,
						moduleSubModule: options.moduleSubModule
					}).properties;

					attributes = [];
					layoutService = options.layoutService;
					if (angular.isString(layoutService)) {
						layoutService = $injector.get(layoutService);
					}

					for (var prop in domains) {
						// eslint-disable-next-line no-prototype-builtins
						if (domains.hasOwnProperty(prop) && self.checkIsMandatoryProperty(prop)) {
							attributes.push(prop);
						}
					}
					angular.forEach(layoutService.groups, function (group) {
						angular.forEach(group.attributes, function (attribute) {
							angular.forEach(attributes, function (property) {
								if (property.toLowerCase() === attribute) {
									formConfiguration.groups[0].attributes.push(attribute);
									self.initRows(property,null,options);
								}
							});
						});
					});
				} else {
					attributes = options.attributes;
					for (var attr in attributes) {
						// eslint-disable-next-line no-prototype-builtins
						if (attributes.hasOwnProperty(attr)) {
							if (attributes[attr].isDisableShow) {
								self.setDateItemAttribute(attr);
							}
							else {
								formConfiguration.groups[0].attributes.push(attr.toLowerCase());
								self.initRows(attr, options.rows,options);
							}
						}
					}
				}

				if (options.readOnlyProcessor) {
					options.readOnlyProcessor.processItem(dataItem);
				}

				return formConfiguration;
			};

			self.addRow = function (row) {
				sortOrder++;
				newRow = angular.copy(row);
				newRow.gid = formConfiguration.groups[0].gid;
				newRow.sortOrder = sortOrder;

				var rids =_.map(formConfiguration.rows,'rid');
				if(rids.indexOf(newRow.rid)<0){
					formConfiguration.rows.push(newRow);
				}
			};

			self.initRows = function (attribute, rows,options) {
				self.setDateItemAttribute(attribute);
				var hasAdded = false;

				if (attribute.toLowerCase() === 'QtoTargetType'.toLowerCase()) {
					angular.forEach(rows, function (row) {
						if (row.attribute && row.config && row.attribute.toLowerCase() === attribute.toLowerCase()) {
							self.addRow(row.config);
						}
					});
					hasAdded = true;
					return;
				}

				var rids ={};
				angular.forEach(detailConfig.rows, function (row) {
					if(row.rid === 'conheaderfk' && row.rid === attribute.toLowerCase()) {
						var conheaderfk =   _.find(options.rows,function(r){
							if(r.attribute.toLowerCase() === 'conheaderfk'){
								return r;
							}
						});

						if(conheaderfk)
						{
							rids =_.map(formConfiguration.rows,'rid');
							if(rids.indexOf(conheaderfk.attribute)<0){
								self.addRow(conheaderfk.config);
								hasAdded = true;
							}
						}

					}else if(row.rid === 'ordheaderfk' && row.rid === attribute.toLowerCase()){
						var ordheaderfk =   _.find(options.rows,function(r){
							if(r.attribute.toLowerCase() === 'ordheaderfk'){
								return r;
							}
						});

						if(ordheaderfk)
						{
							rids =_.map(formConfiguration.rows,'rid');
							if(rids.indexOf(ordheaderfk.attribute)<0){
								self.addRow(ordheaderfk.config);
								hasAdded = true;
							}
						}
					}else if(row.rid === attribute.toLowerCase()) {
						self.addRow(row);
						hasAdded = true;
					}

				});

				if (!hasAdded && rows) {
					angular.forEach(rows, function (row) {
						if (row.attribute && row.config && row.attribute.toLowerCase() === attribute.toLowerCase()) {
							self.addRow(row.config);
						}
					});
				}
			};

			self.setDateItemAttribute = function (attribute) {
				if (!domains) {
					if (defaultValues && defaultValues[attribute]) {
						dataItem[attribute] = defaultValues[attribute];
						if (attribute === 'QtoTypeFk'){
							dataItem.BasRubricCategoryFk = defaultValues.BasRubricCategoryFk;
							dataItem.BasGoniometerTypeFk = defaultValues.BasGoniometerTypeFk;
						}
					} else {
						dataItem[attribute] = null;
					}
					return;
				}

				switch (domains[attribute].domain) {
					case 'numeric':
					case 'integer':
					case 'lookup':
						dataItem[attribute] = 0;
						break;
					case 'string':
					case 'translation':
						dataItem[attribute] = '';
						break;
					default :
						dataItem[attribute] = null;
						break;
				}

				if (defaultValues && defaultValues[attribute]) {
					dataItem[attribute] = defaultValues[attribute];
				}
			};

			self.getCreateDialogConfig = function (options) {
				return {
					title: $translate.instant(options.title),
					dataItem: dataItem,
					formConfiguration: self.getFormConfiguration(options),
					handleOK: function handleOK(result) {
						var creationData = result.data;
						// creationData.PrcBoqFk = creationData.PrjBoqFk;
						var canCreate = true;

						for (var attr in attributes) {
							// eslint-disable-next-line no-prototype-builtins
							if (attributes.hasOwnProperty(attr)) {
								if (creationData.QtoTargetType === 1 || creationData.QtoTargetType === 3) {
									if (attr === 'PrjBoqFk') {
										continue;
									}
								} else {
									if (attr === 'PackageFk' || attr === 'Package2HeaderFK' || attr === 'PrcBoqFk') {
										continue;
									}
								}


								if (!creationData[attr] && attributes[attr].mandatory) {
									canCreate = false;
									break;
								}
							}
						}

						if (containerData && canCreate) {
							if(creationData.__rt$data){
								delete creationData.__rt$data;
							}
							containerData.doCallHTTPCreate(creationData, containerData, service.onCreateSucceeded);
						}
					}
				};
			};

			service.onCreateSucceeded = function onCreateSucceededInList(newItem, data,creationData) {

				newItem.BusinessPartnerFk = creationData.BusinessPartnerFk;
				newItem.PrcStructureFk = creationData.PrcStructureFk;
				if(dialogConfig.dataItem){
					dialogConfig.dataItem.ContractCode = newItem.ContractCode;
				}

				return data.handleOnCreateSucceeded(newItem, data);
			};

			self.showCreateDialog = function showCreateDialog() {
				function calcDialogWidth() {
					if (dialogConfig.width) {
						return dialogConfig.width;
					}
				}

				var promise = $injector.get('qtoMainHeaderDataService').update();
				if (promise) {
					promise.then(function () {
						platformModalService.showDialog({
							scope: (dialogConfig.scope) ? dialogConfig.scope.$new(true) : null,
							templateUrl: globals.appBaseUrl + 'qto.main/partials/qto-main-create-dialog-template.html',
							backdrop: false,
							width: calcDialogWidth()

						}).then(function (result) {
							if (result.ok) {
								dialogConfig.handleOK(result);
							} else {
								if (dialogConfig.handleCancel) {
									dialogConfig.handleCancel(result);
								}
							}
						});
					});
				}
			};

			var validateResult;
			self.handlerError = function (isExistQtoHeader2Boq) {
				for (var attr in attributes) {
					// eslint-disable-next-line no-prototype-builtins
					if (attributes.hasOwnProperty(attr)) {
						if (attr === 'DescriptionInfo' || attr === 'ConHeaderFk' || attr === 'OrdHeaderFk') {
							continue;
						}// description is optional
						if (attributes[attr].required) {
							var errParam = attributes[attr].errorParam ? {fieldName: attributes[attr].errorParam} : null;
							validateResult = platformDataValidationService.isMandatory(dataItem[attr], attr, errParam);
							if(attr === 'PrcBoqFk' && dataItem.ConHeaderFk && (dataItem.PrcCopyModeFk === 2 || dataItem.PrcCopyModeFk === 3) && dataItem.PrcBoqFk === -1 &&
								(!dataItem.NewBoqs || (dataItem.NewBoqs && dataItem.NewBoqs.length <= 0))){
								if(dataItem.PrcCopyModeFk === 2) {
									validateResult = platformDataValidationService.createErrorObject('qto.main.selectPackageBoq', attr);
								}
								else if(dataItem.PrcCopyModeFk === 3){
									validateResult = platformDataValidationService.createErrorObject('qto.main.selectWicBoq', attr);
								}
								runtimeDataService.applyValidationResult(validateResult, dataItem, attr);
							}
							else {
								if(isExistQtoHeader2Boq && validateResult.valid && (attr === 'PrjBoqFk' || attr === 'PrcBoqFk')){
									validateResult = platformDataValidationService.createErrorObject('qto.main.existWqAqQtoByBoq', attr);
								}

								runtimeDataService.applyValidationResult(validateResult, dataItem, attr);

							}
						}
					}
				}
			};

			service.handlerError = self.handlerError;

			service.checkIsCodeExist = function (item) {
				$http.get(globals.webApiBaseUrl + 'qto/main/header/iscodeexist?code=' + item.Code)
					.then(function (data) {
						var result = {
							apply: true,
							valid: false,
							error: ''
						};
						if(data && data.data){
							result.valid = true;
						}else{
							result.error = $translate.instant('cloud.common.uniqueValueErrorMessage');
						}

						runtimeDataService.applyValidationResult(validateResult, item, 'Code');
					});
			};


			service.setDefaultQtoPurposeTypeId = function setDefaultQtoPurposeTypeId(value) {
				defaultQtoPurposeTypeId = value;
			};

			service.getDefaultQtoPurposeTypeId = function getDefaultQtoPurposeTypeId() {
				return defaultQtoPurposeTypeId;
			};

			service.showDialog = function showDialog(value, projectIdParam) {
				defaultValues = {
					ProjectFk: 0,
					ClerkFk: 0,
					QtoTargetType: defaultQtoPurposeTypeId,
					IsGenerated : isGenerated,
					QtoTypeFk: defaultQtoTypeId,
					BasRubricCategoryFk: defaultBasRubricCategoryFk,
					BasGoniometerTypeFk: defaultBasGoniometerTypeFk
				};

				defaultProject = null;

				var filterRequest = cloudDesktopSidebarService.filterRequest, projectId = null;
				if (filterRequest.projectContextId !== null) {
					projectId = filterRequest.projectContextId;
				}
				if(!projectId && projectIdParam) {
					projectId = projectIdParam;
				}

				if (projectId !== null) {
					defaultValues = {
						ProjectFk: projectId,
						QtoTargetType: defaultQtoPurposeTypeId,
						IsGenerated : isGenerated,
						QtoTypeFk: defaultQtoTypeId,
						BasRubricCategoryFk: defaultBasRubricCategoryFk,
						BasGoniometerTypeFk: defaultBasGoniometerTypeFk
					};
				}

				// var context = platformContextService.getContext(),
				var userId = _.get(platformUserInfoService.getCurrentUserInfo(), 'UserId', -1);

				var setDefaultValuesOfClerkFk = function () {
					if (projectId) {
						return service.getProjectById(projectId).then(function (project) {
							defaultValues.ClerkFk = project && project.IsLive ? project.ClerkFk : 0;
						});
					}
					else {
						return basicsClerkUtilitiesService.getClerkByUserId(userId).then(function (clerk) {
							defaultValues.ClerkFk = clerk && clerk.IsLive ? clerk.Id : 0;
						});
					}
				};

				setDefaultValuesOfClerkFk().then(function () {
					containerData = value;
					var createDialogOptions = service.getOptions();
					sortOrder = 0;
					defaultValues = createDialogOptions.defaultValues ? createDialogOptions.defaultValues : null;
					dialogConfig = self.getCreateDialogConfig(createDialogOptions);
					platformTranslateService.translateFormConfig(dialogConfig.formConfiguration);

					self.showCreateDialog();
					// self.handlerError();
				});
			};

			// get the project
			service.getProjectById = function getProjectById(projectId) {
				var deferred = $q.defer();
				var postData = {
					ProjectContextId: projectId
				};
				var projectsInCache = basicsLookupdataLookupDescriptorService.getData('ProjectOfBPContract');
				if (projectsInCache && _.size(projectsInCache) > 0) {
					var matchProject = _.find(projectsInCache, {Id: projectId});
					defaultProject = matchProject;
					if(defaultProject){
						deferred.resolve(matchProject);
					}
				}

				if(!defaultProject){
					$http.post(globals.webApiBaseUrl + 'project/main/GetProjectOfBPContract', postData)
						.then(function (data) {
							var project = _.find(_.get(data, 'data.dtos'), {Id: projectId});
							defaultProject = project;
							deferred.resolve(project);
						});
				}

				return deferred.promise;
			};

			service.getDialogTitle = function getDialogTitle() {
				return dialogConfig.title;
			};

			Object.defineProperties(service, {
				'dialogTitle': {
					get: function () {
						return dialogConfig ? dialogConfig.title : '';
					}, enumerable: true
				}
			});

			service.getDataItem = function getDataItem() {
				if(dialogConfig && dialogConfig.dataItem){
					return dialogConfig.dataItem;
				}else{
					return null;
				}
			};

			service.setNewBoqs = function setNewBoqs(boqItem){
				dialogConfig.dataItem.PrcBoqFk = -1;
				dialogConfig.dataItem.NewBoqs = boqItem;
			};

			service.clearDataItem = function(){
				if(dialogConfig.dataItem) {
					dialogConfig.dataItem.NewBoqs = [];
					dialogConfig.dataItem.BoqSource = 0;
					dialogConfig.dataItem.ContractCode = null;
					dialogConfig.dataItem = null;
				}
			};

			service.setBoqSource = function(boqSource){
				dialogConfig.dataItem.BoqSource = boqSource;
			};

			service.onSelectedQtoTargetTypeChanged = new Platform.Messenger();

			service.onSelectedQtoTypeChanged = new Platform.Messenger();

			service.getFormConfiguration = function getFormConfiguration() {
				return dialogConfig.formConfiguration;
			};

			service.updateReadOnly = function (item, model, value) {
				runtimeDataService.readonly(item, [
					{field: model, readonly: value}
				]);
			};

			service.getCurrentProject = function (entity) {
				let projects = basicsLookupdataLookupDescriptorService.getData('ProjectOfBPContract');
				let currentProject = null;
				if(projects){
					currentProject = _.find(projects, function (item) {
						return item.Id === entity.ProjectFk;
					});
				} else if(defaultProject){
					currentProject = defaultProject;
				}

				if(!currentProject){
					currentProject = defaultProject;
				}

				return currentProject;
			};

			service.setPrcBoqLookup = function (prcBoqLookup) {
				prcBoqLookupService = prcBoqLookup;
			};

			service.setPrjBoqLookup = function (prjBoqLookup) {
				prjBoqLookupService = prjBoqLookup;
			};

			service.setQtoTypeAfterChangeProject = function (item, project) {
				if(item.BasRubricCategoryFk === qtoRubricCategory.CrbRubricCategory  && project.ProjectModeFk !== qtoMainProjectModes.CRB){
					item.QtoTypeFk = defaultQtoTypeId;
					item.BasRubricCategoryFk = defaultBasRubricCategoryFk;
					item.BasGoniometerTypeFk = defaultBasGoniometerTypeFk;
				}
			};

			return service;
		}]);

})(angular);
