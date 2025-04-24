(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceMasterContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('resourceMasterContainerInformationService', ResourceMasterContainerInformationService);

	ResourceMasterContainerInformationService.$inject = ['$injector', 'platformLayoutHelperService', 'resourceCommonLayoutHelperService',
		'resourceMasterConstantValues', 'basicsLookupdataConfigGenerator','resourceCommonDragDropService'];

	function ResourceMasterContainerInformationService($injector, platformLayoutHelperService, resourceCommonLayoutHelperService,
		resourceMasterConstantValues, basicsLookupdataConfigGenerator, resourceCommonDragDropService) {
		var self = this;
		var guids = resourceMasterConstantValues.uuid.container;

		var lookupInfo = {};
		lookupInfo[resourceMasterConstantValues.type.plant] = {
			column: 'PlantFk',
			lookup: {
				directive: 'resource-equipment-plant-lookup-dialog-new',
				options: {
					descriptionMember: 'DescriptionInfo.Translated',
					showClearButton: true,
					displayMember: 'Code',
					version: 3,
					lookupType: 'equipmentPlant'
				}
			},
			dynamicBeforeValidationFn: function(newValue, oldValue, dataItem, entity){
				if (dataItem) {
					entity.EquipmentContextFk = dataItem.EquipmentContextFk;
				}
				entity.TimesheetContextFk = null;
			}
		};
		var configObj = basicsLookupdataConfigGenerator.getDataServiceDefaultSpec({
			dataServiceName: 'timekeepingEmployeeLookupDataService'});

		lookupInfo[resourceMasterConstantValues.type.employee] = {
			column: 'EmployeeFk',
			lookup: {
				directive: 'basics-lookup-data-by-custom-data-service',
				options: {
					descriptionMember: 'DescriptionInfo.Translated',
					lookupType: configObj.moduleQualifier,
					dataServiceName: configObj.dataServiceName,
					valueMember: configObj.valMember,
					displayMember: configObj.dispMember,
					lookupModuleQualifier: configObj.moduleQualifier,
					enableCache: false,
					disableDataCaching: true,
					showClearButton: true,
					columns: configObj.columns,
					isClientSearch: true,
					isTextEditable: configObj.isTextEditable || false,
					uuid: configObj.uuid
				}
			},
			dynamicBeforeValidationFn: function(newValue, oldValue, dataItem, entity){
				if (dataItem) {
					entity.TimesheetContextFk = dataItem.TimesheetContextFk;
				}
				entity.EquipmentContextFk = null;
			}
			// lookup: platformLayoutHelperService.providePlantLookupOverload()
		};

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case guids.resourceList: //ResourceListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceServiceInfo());
					config.listConfig = { initCalled: false, columns: [], dragDropService: resourceCommonDragDropService, type: 'resource.master' };
					break;
				case guids.resourceDetail: //ResourceDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceServiceInfo());
					break;
				case guids.poolList: //ResourceMasterPoolListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPoolServiceInfo());
					break;
				case guids.poolDetail: //ResourceMasterPoolDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPoolServiceInfo());
					break;
				case guids.requiredSkillList: // resourceMasterRequiredSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getRequiredSkillServiceInfo(), self.getRequiredSkillLayout);
					break;
				case guids.requiredSkillDetail: // resourceMasterRequiredSkillDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getRequiredSkillServiceInfo(), self.getRequiredSkillLayout);
					break;
				case guids.providedSkillList: // resourceMasterProvidedSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getProvidedSkillServiceInfo(), self.getProvidedSkillLayout);
					break;
				case guids.providedSkillDetail: // resourceMasterProvidedSkillDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getProvidedSkillServiceInfo(), self.getProvidedSkillLayout);
					break;
				case guids.resourcePartList: // resourceMasterProvidedSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourcePartServiceInfo(), self.getResourcePartLayout);
					break;
				case guids.resourcePartDetail: // resourceMasterProvidedSkillDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourcePartServiceInfo(), self.getResourcePartLayout);
					break;
				case guids.providedSkillDocumentList: // resourceMasterProvidedSkillDocumentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getProvidedSkillDocumentServiceInfo(), self.getProvidedSkillDocumentLayout);
					break;
				case guids.providedSkillDocumentDetail: // resourceMasterProvidedSkillDocumentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getProvidedSkillDocumentServiceInfo(), self.getProvidedSkillDocumentLayout);
					break;
				case guids.masterDataContextList: // resourceMasterDataContextListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getMasterDataContextServiceInfo(), self.getMasterDataContextLayout);
					break;
				case guids.masterDataContextDetails: // resourceMasterDataContextDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getMasterDataContextServiceInfo(), self.getMasterDataContextLayout);
					break;
			}

			return config;
		};

		this.getResourceServiceInfo = function getResourceServiceInfo() {
			return {
				standardConfigurationService: 'resourceMasterLayoutService',
				dataServiceName: 'resourceMasterMainService',
				validationServiceName: 'resourceMasterValidationService'
			};
		};

		this.getPoolServiceInfo = function getPoolServiceInfo() {
			return {
				standardConfigurationService: 'resourceMasterPoolUIStandardService',
				dataServiceName: 'resourceMasterPoolDataService',
				validationServiceName: 'resourceMasterPoolValidationService'
			};
		};

		this.getRequiredSkillServiceInfo = function getRequiredSkillServiceInfo() {
			return {
				standardConfigurationService: 'resourceMasterRequiredSkillLayoutService',
				dataServiceName: 'resourceMasterRequiredSkillDataService',
				validationServiceName: 'resourceMasterRequiredSkillValidationService'
			};
		};

		this.getRequiredSkillLayout = function getRequiredSkillLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.master.requiredSkill',
				['skillfk', 'commenttext']);

			res.overloads = platformLayoutHelperService.getOverloads(['skillfk'], self);
			res.overloads['skillfk'] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceCommonSkillLookupDataService',
				filter: function (item) {
					let selectedRes = $injector.get('resourceMasterMainService').getItemById(item.ResourceFk);
					let resTypeFk;
					resTypeFk = selectedRes.TypeFk;
					return resTypeFk;
				}
			});
			res.addAdditionalColumns = true;

			return res;
		};

		this.getProvidedSkillServiceInfo = function getProvidedSkillServiceInfo() {
			return {
				standardConfigurationService: 'resourceMasterProvidedSkillLayoutService',
				dataServiceName: 'resourceMasterProvidedSkillDataService',
				validationServiceName: 'resourceMasterProvidedSkillValidationService'
			};
		};

		this.getProvidedSkillLayout = function getProvidedSkillLayout() {
			var res = platformLayoutHelperService.getFourGroupsBaseLayout('1.0.0', 'resource.master.providedSkill',
				['skillfk', 'validto', 'commenttext', 'refreshdate'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, 'userDefDateGroup', 'userdefineddate', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(5, 'userDefNumberGroup', 'userdefinednumber', '0')
			);

			res.overloads = {};
			res.overloads['skillfk'] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceCommonSkillLookupDataService',
				filter: function (item) {
					let selectedRes = $injector.get('resourceMasterMainService').getItemById(item.ResourceFk);
					let resTypeFk;
					resTypeFk = selectedRes.TypeFk;
					return resTypeFk;
				}
			});
			res.addAdditionalColumns = true;

			return res;
		};

		this.getProvidedSkillDocumentServiceInfo = function getProvidedSkillDocumentServiceInfo() {
			return {
				standardConfigurationService: 'resourceMasterProvidedSkillDocumentLayoutService',
				dataServiceName: 'resourceMasterProvidedSkillDocumentDataService',
				validationServiceName: ''
			};
		};

		this.getProvidedSkillDocumentLayout = function getProvidedSkillDocumentLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.master.providedSkillDocument',
				['description', 'provskilldoctypefk', 'documenttypefk', 'date', 'barcode', 'originfilename']);

			res.overloads = platformLayoutHelperService.getOverloads(['provskilldoctypefk', 'documenttypefk', 'originfilename'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getResourcePartServiceInfo = function getResourcePartServiceInfo() {
			return {
				standardConfigurationService: 'resourceMasterResourcePartLayoutService',
				dataServiceName: 'resourceMasterResourcePartDataService',
				validationServiceName: 'resourceMasterResourcePartValidationService'
			};
		};

		this.getResourcePartLayout = function getResourcePartLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.master.resourcePart',
				['resourceparttypefk', 'descriptioninfo', 'ismainpart', 'partfk', 'price', 'currencyfk', 'commenttext']);

			res.overloads = platformLayoutHelperService.getOverloads(['resourceparttypefk', 'partfk', 'currencyfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getMasterDataContextServiceInfo = function getMasterDataContextServiceInfo() {
			return {
				standardConfigurationService: 'resourceMasterDataContextLayoutService',
				dataServiceName: 'resourceMasterDataContextDataService',
				validationServiceName: 'resourceMasterDataContextValidationService'
			};
		};

		this.getMasterDataContextLayout = function getMasterDataContextLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.master.masterDataContext',
				['costcodefk','currencyfk','rate']);

			res.overloads = platformLayoutHelperService.getOverloads(['costcodefk', 'currencyfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		function getCostCodeOverload(isNullable) {
			return {
				grid: {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CostCode',
						displayMember: 'Code'
					},
					editor: 'lookup',
					editorOptions: {
						lookupField: 'CostCodeFk',
						directive: 'basics-cost-codes-lookup',
						lookupOptions: {
							filterKey: null,
							showClearButton: isNullable,
							addGridColumns: [
								{
									id: 'Description',
									field: 'DescriptionInfo',
									name: 'Description',
									formatter: 'translation',
									width: 100,
									name$tr$: 'cloud.common.entityDescription'
								}
							],
							additionalColumns: true
						}
					}
				},
				detail: {
					type: 'directive',
						directive: 'basics-cost-codes-lookup',
						options: {
						showClearButton: true,
						displayMember: 'DescriptionInfo.Translated'
					}
				}
			};
		}

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch(overload) {
				// case 'skillfk': ovl = resourceCommonLayoutHelperService.provideResourceSkillOverload(); break;
				case 'resourceparttypefk': ovl = resourceCommonLayoutHelperService.provideResourcePartTypeOverload(); break;
				case 'costcodefk': ovl = getCostCodeOverload(true); break;
				case 'currencyfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsCurrencyLookupDataService'}); break;
				case 'partfk': ovl = {
					detail: {
						type: 'directive',
						directive: 'dynamic-grid-and-form-lookup',
						options: {
							isTextEditable: false,
							dependantField: 'ResourcePartTypeFk',
							lookupInfo: lookupInfo,
							grid: false,
							dynamicLookupMode: true,
							showClearButton: true
						}
					},
					grid: {
						editor: 'directive',
						editorOptions: {
							directive: 'dynamic-grid-and-form-lookup',
							dependantField: 'ResourcePartTypeFk',
							lookupInfo: lookupInfo,
							isTextEditable: false,
							dynamicLookupMode: true,
							grid: true
						},
/*
						formatter: 'code',
						formatterOptions: {
							field: 'ArticleCode'
						}
*/
						formatter: 'dynamic',
						domain: function (item, column, flag) {
							var info = lookupInfo[item.ResourcePartTypeFk];
							if (info) {
								var prop = info.lookup.options;
								column.formatterOptions = {
									lookupType: prop.lookupType,
									displayMember: prop.displayMember,
									dataServiceName: prop.dataServiceName
								};
								if (prop.version) {
									column.formatterOptions.version = prop.version;// for new lookup master api, the value of version should be greater than 2
								}
							}
							else {
								column.formatterOptions = null;
							}

							return flag ? 'directive' : 'lookup';
						}
					}
				}; break;
				case 'documenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype');
					break;
				case 'provskilldoctypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourceprovidedskilldocumenttype', null, {
						field: 'ResourceContextFk'
					});
					break;
				case 'originfilename':
					ovl = { readonly: true };
					break;
			}

			return ovl;
		};
	}
})(angular);
