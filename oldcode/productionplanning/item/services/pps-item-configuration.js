/**
 * Created by anl on 5/3/2017.
 */


(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemReadonlyUserDefinedIconService', ['platformStatusIconService',
		function (platformStatusIconService) {
			var service = {};

			var icons = platformStatusIconService.getItems();

			service.select = function (item) {
				if (item) {
					var icon = _.find(icons, {'id': item.UserDefinedIcon});
					if (icon) {
						return icon.res;
					}
				}
			};

			service.getIcons = function () {
				return icons;
			};

			service.isCss = function () {
				return true;
			};

			return service;
		}]);

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});
		return gridColumns;
	}

	//item Layout
	angular.module(moduleName).factory('productionplanningItemLayoutConfig', ['$translate',
		function ($translate) {
			var service = {};

			function getProjectExtendedConfig(id, name, nameTr, width, disMember) {
				var conifg = {
					afterId: 'projectfk',
					id: id,
					field: 'ProjectFk',
					name: name,
					name$tr$: nameTr,
					formatter: 'lookup',
					formatterOptions: {
						displayMember: disMember,
						lookupType: 'project',
						version: 3
					},
					width: width,
					sortable: true
				};
				conifg.formatterOptions.displayMember = disMember;
				return conifg;
			}

			var projectZipCodeConfig = getProjectExtendedConfig('projectzipcode',
				'*Project Address Post Code',
				'productionplanning.common.projectZipCode',
				80,
				'AddressEntity.ZipCode');

			var projectCityConfig = getProjectExtendedConfig('projectcity',
				'*Project Address City',
				'productionplanning.common.projectCity',
				80,
				'AddressEntity.City');

			var projectAddressConfig = getProjectExtendedConfig('projectaddress',
				'*Project Address Street',
				'productionplanning.common.projectAddress',
				140,
				'AddressEntity.AddressLine');

			var projectName2Config = getProjectExtendedConfig('projectName2',
				'*Project Name2',
				'cloud.common.entityProjectName2',
				200,
				'ProjectName2');

			function getProjectExtendedDetailConfig(rid, nameTr, disMember) {
				var conifg = {
					afterId: '',
					lookupDisplayColumn: true,
					gid: 'contactsGroup',
					rid: rid,
					model: 'ProjectFk',
					label: $translate.instant(nameTr),
					label$tr$: nameTr,
					type: 'directive',
					directive: 'basics-lookup-data-project-project-dialog',
					options: {
						displayMember: disMember,
						version: 3
					}
				};
				return conifg;
			}

			var projectCityDetailConfig = getProjectExtendedDetailConfig('projectcity', 'productionplanning.common.projectCity', 'AddressEntity.City');
			var projectZipCodeDetailConfig = getProjectExtendedDetailConfig('projectzipcode', 'productionplanning.common.projectZipCode', 'AddressEntity.ZipCode');
			var projectAddressDetailConfig = getProjectExtendedDetailConfig('projectaddress', 'productionplanning.common.projectAddress', 'AddressEntity.AddressLine');
			var projectName2DetailConfig = getProjectExtendedDetailConfig('projectname2', 'cloud.common.entityProjectName2', 'ProjectName2');

			service.addition = {
				grid: extendGrouping([{
					afterId: 'clerktecfk',
					id: 'clerkDesc',
					field: 'ClerkTecFk',
					name: 'Clerk Description',
					name$tr$: 'basics.clerk.clerkdesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Clerk',
						displayMember: 'Description',
						width: 140,
						vesion: 3
					}
				}, {
					afterId: 'sitefk',
					id: 'siteDesc',
					field: 'SiteFk',
					name: 'Site Description',
					name$tr$: 'basics.site.entityDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'SiteNew',
						displayMember: 'DescriptionInfo.Description',
						width: 140,
						version: 3
					}
				}, {
					afterId: 'ppsheaderfk',
					id: 'ppsheaderDesc',
					field: 'PPSHeaderFk',
					name: 'PPS Header Description',
					name$tr$: 'productionplanning.common.event.headerDes',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PpsHeader',
						displayMember: 'DescriptionInfo.Translated'
					}
				}, {
					id: 'ReadonlyUserDefinedIcon',
					field: 'UserDefinedIcon',
					name: '*Read-Only User Defined Icon',
					name$tr$: 'productionplanning.item.readOnlyUserDefinedIcon',
					readonly: true,
					formatter: 'image',
					formatterOptions: {
						imageSelector: 'ppsItemReadonlyUserDefinedIconService'
					}
				}, {
					afterId: 'ppsitemstatusfk',
					id: 'BackgroundColor',
					field: 'Backgroundcolor',
					name: '*Color',
					name$tr$: 'productionplanning.item.statusBackgroundColor',
					readonly: true,
					formatter: 'color'
				},
					projectCityConfig,
					projectZipCodeConfig,
					projectAddressConfig,
					projectName2Config,
					{
						afterId: 'prjlocationfk',
						id: 'branchpath',
						field: 'PrjLocationFk',
						name: '*Location Full Description',
						name$tr$: 'productionplanning.common.branchPath',
						formatter: 'select',
						formatterOptions: {
							serviceName: 'productionplanningCommonLocationInfoService',
							valueMember: 'Id',
							displayMember: 'BranchPath'
						},
						readonly: true
					}, {
						id: 'productsCount',
						gid: 'products',
						field: 'ProductsCount',
						name: '*Products Count',
						name$tr$: 'productionplanning.item.products.productsCount',
						sortable: true,
						editor: null,
						formatter: 'integer'
					}, {
						afterId: 'productsCount',
						id: 'productsWeightSum',
						gid: 'products',
						field: 'ProductsWeightSum',
						name: '*Products Weight Sum',
						name$tr$: 'productionplanning.item.products.productsWeightSum',
						sortable: true,
						editor: null,
						formatter: 'convert',
						weightsourceuomfactor:1
					}, {
						afterId: 'productsWeightSum',
						id: 'productsAreaSum',
						gid: 'products',
						field: 'ProductsAreaSum',
						name: '*Products Area Sum',
						name$tr$: 'productionplanning.item.products.productsAreaSum',
						sortable: true,
						editor: null,
						formatter: 'convert',
						areasourceuomfactor:1
					}, {
						afterId: 'productsAreaSum',
						id: 'productsVolumeSum',
						gid: 'products',
						field: 'ProductsVolumeSum',
						name: '*Products Volume Sum',
						name$tr$: 'productionplanning.item.products.productsVolumeSum',
						sortable: true,
						editor: null,
						formatter: 'decimal'
					}, {
						afterId: 'productsVolumeSum',
						id: 'productsBillingQtySum',
						gid: 'products',
						field: 'ProductsBillingQtySum',
						name: '*Products Billing Quantity Sum',
						name$tr$: 'productionplanning.item.products.productsBillingQtySum',
						sortable: true,
						editor: null,
						formatter: 'decimal'
					}, {
						afterId: 'productsBillingQtySum',
						id: 'productsPlanQtySum',
						gid: 'products',
						field: 'ProductsPlanQtySum',
						name: '*Products Planning Quantity Sum',
						name$tr$: 'productionplanning.item.products.productsPlanQtySum',
						sortable: true,
						editor: null,
						formatter: 'decimal'
					}
				]),
				detail: [{
					gid: 'baseGroup',
					rid: 'readOnlyUserDefinedIcon',
					model: 'UserDefinedIcon',
					label: $translate.instant('productionplanning.item.readOnlyUserDefinedIcon'),
					label$tr$: 'productionplanning.item.readOnlyUserDefinedIcon',
					readonly: true,
					type: 'imageselect',
					sortOrder: 99,
					options: {
						serviceName: 'platformStatusIconService'
					}
				}, {
					gid: 'baseGroup',
					rid: 'BackgroundColor',
					model: 'Backgroundcolor',
					label: '*Color',
					label$tr$: 'productionplanning.item.statusBackgroundColor',
					readonly: true,
					type: 'color'
				},
					projectCityDetailConfig,
					projectZipCodeDetailConfig,
					projectAddressDetailConfig,
					projectName2DetailConfig,
					{
						gid: 'itemproduction',
						rid: 'branchpath',
						model: 'PrjLocationFk',
						label: $translate.instant('productionplanning.common.branchPath'),
						type: 'select',
						options: {
							serviceName: 'productionplanningCommonLocationInfoService',
							valueMember: 'Id',
							displayMember: 'BranchPath'
						},
						readonly: true
					}, {
						gid: 'products',
						rid: 'productsCount',
						model: 'ProductsCount',
						label: '*Products Count',
						label$tr$: 'productionplanning.item.products.productsCount',
						type: 'integer',
						readonly: true
					}, {
						gid: 'products',
						rid: 'productsWeightSum',
						model: 'ProductsWeightSum',
						label: '*Products Weight Sum',
						label$tr$: 'productionplanning.item.products.productsWeightSum',
						type: 'decimal',
						readonly: true
					}, {
						gid: 'products',
						rid: 'productsAreaSum',
						model: 'ProductsAreaSum',
						label: '*Products Area Sum',
						label$tr$: 'productionplanning.item.products.productsAreaSum',
						type: 'decimal',
						readonly: true
					}, {
						gid: 'products',
						rid: 'productsVolumeSum',
						model: 'ProductsVolumeSum',
						label: '*Products Volume Sum',
						label$tr$: 'productionplanning.item.products.productsVolumeSum',
						type: 'decimal',
						readonly: true
					}
				]
			};

			return service;
		}]);

	angular.module(moduleName).factory('productionplanningItemLayout', PPSItemLayout);
	PPSItemLayout.$inject = ['$injector', 'basicsLookupdataConfigGenerator', 'platformLayoutHelperService',
		'ppsCommonCustomColumnsServiceFactory', 'productionplanningCommonLayoutHelperService', 'productionplanningItemDataService',
		'productionplanningCommonCreateDialogConfigService',
		'platformRuntimeDataService'];
	function PPSItemLayout($injector, basicsLookupdataConfigGenerator, platformLayoutHelperService,
						   customColumnsServiceFactory, ppCommonLayoutHelperService, productionplanningItemDataService,
						   createDialogConfigService,
						   platformRuntimeDataService) {

		var projectConfig = platformLayoutHelperService.provideProjectLookupOverload();
		projectConfig = _.merge(projectConfig, {readonly: true});

		var prodDescDialog = function (injector, entity, settings) {
			let createOptions = productDescCreateOptions;
			createOptions.creationData.PKey3 = entity.MdcMaterialFk;
			createOptions.creationData.PKey1 = entity.EngDrawingDefFk;
			var domains = createOptions.uiStandardService.getDtoScheme();
			_.each(createOptions.fields, function (field) {
				if (Object.prototype.hasOwnProperty.call(domains, field)) {
					createOptions.attributes[field] = domains[field];
				}
			});
			let newProductTemplate = {};
			createOptions.attributes.MdcProductDescriptionFk.mandatory = true;
			return createDialogConfigService.showDialog(createOptions).then(function (result) {
				if (result.ok) {
					newProductTemplate = $injector.get('productionplanningProductTemplateCreateService').updateData;
					entity.ProductDescriptionCode = newProductTemplate.Code;
					entity.ProductDescriptionFk = newProductTemplate.Id;
					entity.EngDrawingDefFk = entity.EngDrawingDefFk? entity.EngDrawingDefFk : newProductTemplate.EngDrawingFk;
					return newProductTemplate;
				}
			}).finally(() => {
				updateProductDescriptionCodeColumn();
				updateProductTempateLookup(newProductTemplate);
				acyncValidateProductTemplateCode(newProductTemplate);
			});

			function acyncValidateProductTemplateCode(productTemplate) {
				if (productTemplate && productTemplate.EngDrawingFk !== null) {
					const validationService = $injector.get('productionplanningItemValidationService');
					validationService.asyncValidateNewProductTemplateCode(entity, entity.ProductDescriptionCode, 'ProductDescriptionCode',
					  productTemplate);
				}
			}

			function updateProductTempateLookup(productTemplate){
				const lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
				lookupDescriptorService.addData('PPSProductDescription', [productTemplate]);
				lookupDescriptorService.addData('PPSProductDescriptionTiny', [{
					Code : productTemplate.Code,
					DescriptionInfo: productTemplate.DescriptionInfo,
					EngDrawingFk: productTemplate.EngDrawingFk,
					Id: productTemplate.Id,
					PpsFormulaVersionFk: productTemplate.PpsFormulaVersionFk
				}]);
			}

			function updateProductDescriptionCodeColumn(){
				let readonlyFields = [];
				readonlyFields.push({field: 'ProductDescriptionCode', readonly: _.isNil(entity.ProductDescriptionFk)});
				platformRuntimeDataService.readonly(entity, readonlyFields);
			}
		};

		var productDescCreateOptions = $injector.get('productionplanningProducttemplateProductDescriptionCreateOption');

		var config = {
			'fid': 'productionplanning.item.ppsItemLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'change': 'onPropertyChange',
			'groups': [
				{
					gid: 'stateInfoGroup',
					attributes: [ 'isupstreamdefined', 'istransportplanned','ppsitemstatusfk']
				},
				{
					gid: 'baseGroup',
					attributes: ['code', 'descriptioninfo', 'reference', 'projectfk', 'ppsheaderfk', 'ordheaderfk', 'clerktecfk',
						'engdrawingdeffk', 'engdrawingstatusfk', 'islive', 'lgmjobfk', 'businesspartnerfk', 'businesspartnerorderfk',
						'itemtypefk', 'userdefinedicon', 'comment', 'userflag1', 'userflag2']
				},
				{
					gid: 'itemproduction',
					attributes: ['sitefk', 'materialgroupfk', 'mdcmaterialfk', 'quantity', 'uomfk', 'openquantity', 'assignedquantity', 'prjlocationfk', 'productionorder', 'productdescriptionfk', 'productdescriptioncode']
				},
				{
					gid: 'products',
					attributes: []
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'contactsGroup',
					attributes: []
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				'isupstreamdefined':{
					readonly: true,
					grid: {
						formatter: 'image',
						formatterOptions: {
							imageSelector: 'ppsItemUpstreamStateIconService',
							tooltip: true
						}
					},
					detail: {
						type: 'imageselect',
						options: {
							useLocalIcons: true,
							items: $injector.get('ppsItemUpstreamStateIconService').getIcons()
						}
					}
				},
				'istransportplanned':{
					readonly: true
				},
				'ppsheaderfk': {
					readonly: true,
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-Header-Dialog-Lookup',//'productionplanning-Common-Header-Lookup',
							lookupOptions: {
								events: [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.ProjectFk = args.selectedItem.PrjProjectFk;
									}
								}]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PpsHeader',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-Header-Dialog-Lookup',//'productionplanning-Common-Header-Lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								events: [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.ProjectFk = args.selectedItem.PrjProjectFk;
									}
								}]
							}
						}
					}
				},
				'ordheaderfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'salesCommonContractLookupDataService',
					moduleQualifier: 'salesCommonContractLookupDataService',
					desMember: 'Code',
					additionalColumns: true,
					addGridColumns: [{
						id: 'ordHeaderDescription',
						field: 'DescriptionInfo.Translated',
						name: 'Order Header Description',
						width: 200,
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}],
					filter: function (item) {
						return item && item.ProjectFk ? item.ProjectFk : -1;
					},
					navigator: {
						moduleName: 'sales.contract'
					},
					readonly: true
				}),
				'ppsitemstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsitemstatus', null, {
					showIcon: true,
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					customIntegerProperty1: 'BACKGROUNDCOLOR',
					field: 'RubricCategoryFk',
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'Backgroundcolor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}),
				'engdrawingstatusfk':basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.engineeringdrawingstatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'DrawingStatusBackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}),
				'clerktecfk': {
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'cloud-clerk-clerk-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Clerk',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showClearButton: true},
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description'
						}
					}
				},
				'sitefk': {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'pps-item-factory-sitefk-filter',
								processDataKey: 'IsFactory'
							},
							directive: 'basics-site-site-x-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showclearButton: true,
								version: 3,
								filterKey: 'pps-item-factory-sitefk-filter',
								processDataKey: 'IsFactory'
							},
							lookupDirective: 'basics-site-site-x-lookup',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				'materialgroupfk': {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								additionalColumns: true,
								addGridColumns: [{
									id: 'Description',
									field: 'DescriptionInfo.Translated',
									width: 150,
									name: 'Description',
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								filterKey: 'pps-material-group-filter',
								showClearButton: true
							},
							lookupDirective: 'basics-material-material-group-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialGroup',
							displayMember: 'Code'
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								filterKey: 'pps-material-group-filter',
								showClearButton: true
							},
							lookupDirective: 'basics-material-material-group-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				},
				'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					showClearButton: true
				}),
				'prjlocationfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectLocationLookupDataService',
					cacheEnable: true,
					additionalColumns: true,
					filter: function (item) {
						if (typeof (item) === 'undefined') {
							// bulk editor
							return productionplanningItemDataService.getProjectIdForBulkEditor();
						}
						return item && item.ProjectFk ? item.ProjectFk : -1;
					},
					showClearButton: true,
					events:[{
						name: 'onSelectedItemChanged',
						handler: function(e, args){
							// bulk editor
							if(!args.entity) {
								const selectedItems = productionplanningItemDataService.getSelectedEntities();
								selectedItems.forEach(item => {
									productionplanningItemDataService.setPrjLocation(item, args.selectedItem);
								})
							} else {
								productionplanningItemDataService.setPrjLocation(args.entity, args.selectedItem);
							}

						}
					}]
				}),
				'quantity': {
					disallowNegative: true
				},
				'openquantity': {
					readonly: true
				},
				'assignedquantity': {
					readonly: true
				},
				lgmjobfk: ppCommonLayoutHelperService.provideJobExtensionLookupOverload({projectFk: 'ProjectFk'}),
				/*lgmjobfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				 dataServiceName: 'logisticJobLookupByProjectDataService',
				 cacheEnable: true,
				 additionalColumns: false,
				 filter: function (entity) {
				 return entity.ProjectFk;
				 }
				 })*/
				businesspartnerfk: (function () {
					var settings = platformLayoutHelperService.provideBusinessPartnerLookupOverload();
					settings.readonly = true;
					return settings;
				})(),
				businesspartnerorderfk: (function () {
					var settings = platformLayoutHelperService.provideBusinessPartnerLookupOverload();
					settings.readonly = true;
					return settings;
				})(),
				'mdcmaterialfk': ppCommonLayoutHelperService.provideMaterialLookupOverload([{
					name: 'onSelectedItemChanged',
					handler: function (e, args) {
						args.entity.MaterialBlobsFk = (_.isNil(args.selectedItem)) ? null: args.selectedItem.BasBlobsFk;
						productionplanningItemDataService.fireMaterialFkChanged(args.entity);
					}
				}]),
				'engdrawingdeffk': {
					navigator: {
						moduleName: 'productionplanning.drawing'
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-drawing-dialog-lookup',
							lookupOptions: {
								displayMember: 'Code',
								showClearButton: true,
								showAddButton: true,
								createOptions: $injector.get('ppsItemDrawingCreateOption'),
								defaultFilter: {projectId: 'ProjectFk'}
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							lookupType: 'EngDrawing',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-drawing-dialog-lookup',
							descriptionMember: 'Description',
							showClearButton: true,
							lookupOptions: {
								showAddButton: true,
								createOptions: $injector.get('ppsItemDrawingCreateOption'),
								defaultFilter: {projectId: 'ProjectFk'}
							}
						},
					}
				},

				'itemtypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsitemtype', null, {
					showIcon: true
				}),
				'projectfk': projectConfig,
				'userdefinedicon': {
					grid: {
						lookupField: 'UserDefinedIcon',
						formatter: 'imageselect',
						editor: 'imageselect',
						formatterOptions: {
							serviceName: 'platformStatusIconService'
						}
					},
					detail: {
						model: 'UserDefinedIcon',
						type: 'imageselect',
						editorOptions: {
							serviceName: 'platformStatusIconService'
						}
					}
				},
				productdescriptionfk: {
					navigator: {
						moduleName: 'productionplanning.producttemplate'
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PPSProductDescription',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'ProductDescriptionFk',
							directive: 'pps-product-description-complex-lookup',
							displayMember: 'Code',
							lookupOptions: {
								displayMember: 'Code',
								showEditButton: false,
								showAddButton: true,
								createOptions: productDescCreateOptions,
								openAddDialogFn: prodDescDialog
							}
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'pps-product-description-complex-lookup',
						options: {
							lookupDirective: 'pps-product-description-complex-lookup',
							descriptionMember: 'Description',
							showEditButton: false,
							showAddButton: true,
							createOptions: productDescCreateOptions,
							openAddDialogFn: prodDescDialog
						},
					}
				}
			}
		};

		var customColumnService = customColumnsServiceFactory.getService(moduleName);
		customColumnService.setEventTypeConfig(config, 'productionplanning.common.item.event');
		customColumnService.setClerkRoleConfig(config);

		return config;
	}

})(angular);