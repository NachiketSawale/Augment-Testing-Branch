(function (angular) {
	'use strict';
	var mainModule = angular.module('resource.requisition');
	/**
	 * @ngdoc service
	 * @name resourceRequisitionContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	mainModule.service('resourceRequisitionContainerInformationService', ResourceRequisitionContainerInformationService);

	ResourceRequisitionContainerInformationService.$inject = [
		'$injector', 'platformLayoutHelperService', 'resourceCommonLayoutHelperService', 'resourceRequisitionConstantValues',
		'basicsLookupdataConfigGenerator', 'logisticCommonLayoutOverloadService', 'basicsLookupdataLookupFilterService',
		'basicsCompanyMainService', 'resourceMasterResourceFilterLookupDataService','resourceCommonDragDropService'];

	function ResourceRequisitionContainerInformationService(
		$injector, platformLayoutHelperService, resourceCommonLayoutHelperService, resourceRequisitionConstantValues,
		basicsLookupdataConfigGenerator, logisticCommonLayoutOverloadService, basicsLookupdataLookupFilterService,
		basicsCompanyMainService, resourceMasterResourceFilterLookupDataService, resourceCommonDragDropService) {
		var self = this;
		var containerUids = resourceRequisitionConstantValues.uuid.container;

		let initialised = false;
		basicsCompanyMainService.load().then(() => initialised = true);

		(function registerFilter() {
			var resourceRequisitionSiteFilter = [
				{
					serverSide: true,
					serverKey: 'resource-master-filter3',
					key: 'resource-master-filter3',
					fn: function (item) {
						return resourceMasterResourceFilterLookupDataService.getFilterParams(item);
					}
				},
				{
					key: 'project-stock-filter',
					fn: function filterStockByProject(prjStock, requisitionItem) {
						return prjStock.ProjectFk === requisitionItem.Projectfk;
					}
				},
				{
					key: 'resource-requisition-material-filter',
					serverSide: true,
					fn: function (entity, searchOptions) {
						if (entity) {
							searchOptions.MaterialTypeFilter = {
								IsForRM: true,
							};
						}
					}
				},
				{
					key: 'resource-requisition-company-filter',
					fn: function (item,entity) {
						let job = $injector.get('logisticJobDataService').getItemById(entity.JobFk);
						if (initialised === true) {
							let company = basicsCompanyMainService.getItemById(job.CompanyFk);
							return item.Code === company.Code;
						}
						else{
							return false;
						}
					}
				},
				{
					key: 'requisition-main-rubric-category-lookup-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function () {
						return { Rubric: 98 };//98 is rubric for Resource Requisition.
					}
				}

			];
			basicsLookupdataLookupFilterService.registerFilter(resourceRequisitionSiteFilter);
		})();

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case containerUids.requisitionList: // resourceRequisitionListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceRequisitionServiceInfos());
					config.listConfig = { initCalled: false, columns: [], dragDropService: resourceCommonDragDropService, type: 'resource.requisition' };	
					break;
				case containerUids.requisitionDetail: // resourceRequisitionDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceRequisitionServiceInfos());
					break;
				case containerUids.requiredSkillList: // resourceRequisitionRequiredSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceRequiredSkillServiceInfos(), self.getResourceRequiredSkillLayout);
					break;
				case containerUids.requiredSkillDetail: // resourceRequisitionRequiredSkillDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceRequiredSkillServiceInfos(), self.getResourceRequiredSkillLayout);
					break;
				case containerUids.requisitionDocumentList: // resourceRequisitionDocumentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceRequisitionDocumentServiceInfos(), self.getResourceRequisitionDocumentLayout);
					break;
				case containerUids.requisitionDocumentDetails: // resourceRequisitionDocumentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceRequisitionDocumentServiceInfos(), self.getResourceRequisitionDocumentLayout);
					break;

				case containerUids.requisitionItemList: // resourceRequisitionItemListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceRequisitionItemServiceInfos()); // self.getResourceRequisitionItemLayout);
					break;
				case containerUids.requisitionItemDetails: // resourceRequisitionItemDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceRequisitionItemServiceInfos());// self.getResourceRequisitionItemLayout);
					break;
				case containerUids.stockList: // resourceRequisitionStockListController
					config = self.getResourceRequisitionStockServiceInfos();
					config.layout = $injector.get('procurementStockStockTotalUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case containerUids.stockDetail: // resourceRequisitionStockDetialController
					config = self.getResourceRequisitionStockServiceInfos();
					config.layout = $injector.get('procurementStockStockTotalUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					break;
			}

			return config;
		};

		this.getResourceRequisitionStockServiceInfos = function getResourceRequisitionStockServiceInfos() {
			return {
				standardConfigurationService: $injector.get('procurementStockStockTotalUIStandardService'),
				dataServiceName: 'resourceRequisitionStockDataService'
				// eslint-disable-next-line no-tabs
				//	,validationServiceName: $injector.get('procurementStockValidationService')
			};
		};

		this.getResourceRequisitionServiceInfos = function getResourceRequisitionServiceInfos() {
			return {
				standardConfigurationService: 'resourceRequisitionLayoutService',
				dataServiceName: 'resourceRequisitionDataService',
				validationServiceName: 'resourceRequisitionValidationService'
			};
		};

		this.getResourceRequiredSkillServiceInfos = function getResourceRequiredSkillServiceInfos() {
			return {
				standardConfigurationService: 'resourceRequisitionRequiredSkillLayoutService',
				dataServiceName: 'resourceRequisitionRequiredSkillDataService',
				validationServiceName: 'resourceRequisitionRequiredSkillValidationService'
			};
		};

		this.getResourceRequiredSkillLayout = function getResourceRequiredSkillLayout() {
			var res = platformLayoutHelperService.getFourGroupsBaseLayout('1.0.0', 'resource.requisition.requiredSkill',
				['skillfk', 'commenttext'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, 'userDefDateGroup', 'userdefineddate', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(5, 'userDefNumberGroup', 'userdefinednumber', '0')
			);

			res.overloads = {};
			res.overloads['skillfk'] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceCommonSkillLookupDataService',
				filter: function (item) {
					let selectedReq = $injector.get('resourceRequisitionDataService').getItemById(item.RequisitionFk);
					let resTypeFk;
					resTypeFk = selectedReq.TypeFk;
					return resTypeFk;
				}
			});
			res.addAdditionalColumns = true;

			return res;
		};

		this.getResourceRequisitionDocumentServiceInfos = function getResourceRequisitionDocumentServiceInfos() {
			return {
				standardConfigurationService: 'resourceRequisitionDocumentLayoutService',
				dataServiceName: 'resourceRequisitionDocumentDataService',
				validationServiceName: ''
			};
		};

		this.getResourceRequisitionDocumentLayout = function getResourceRequisitionDocumentLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.requisition.document',
				['descriptioninfo', 'documenttypefk', 'date', 'barcode', 'originfilename', 'url']
			);

			res.overloads = platformLayoutHelperService.getOverloads(['documenttypefk', 'originfilename', 'url'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getResourceRequisitionItemServiceInfos = function getResourceRequisitionItemServiceInfos() {
			return {
				standardConfigurationService: 'resourceRequisitionItemLayoutService',
				dataServiceName: 'resourceRequisitionItemDataService',
				validationServiceName: 'resourceRequisitionItemValidationService'
			};
		};

		this.getResourceRequisitionItemLayout = function getResourceRequisitionItemLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'resource.requisition.item',
				['materialfk', 'description', 'reservationid', 'stockfk', 'quantity', 'uomfk', 'projectfk'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['materialfk', 'stockfk', 'uomfk', 'projectfk', 'reservationid'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch (overload) {
				case 'documenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype');
					break;
				case 'originfilename':
					ovl = {readonly: true};
					break;
				case 'projectfk':
					ovl = platformLayoutHelperService.provideProjectLookupReadOnlyOverload();
					break;

				case 'reservationid':
					ovl = {
						navigator: {
							moduleName: 'procurement.stock'
						},
						readonly: true
					};
					break;
				case 'materialfk':
					ovl =  platformLayoutHelperService.provideMaterialMultiselectOverload('resourceRequisitionItemDataService');
					break;
				case 'stockfk':
					ovl =  {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									lookupType: 'ProjectStockNew',
									showClearButton: true,
								},
								directive: 'project-stock-dialog-lookup',
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectStockNew',
								version: 3,
								displayMember: 'Description'
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'project-stock-dialog-lookup',
								descriptionMember: 'Description',
								displayMember: 'Code',
								showClearButton: true,
							}
						}
					};
					break;
				case'uomfk':
					// ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification());
					// ovl =basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					// dataServiceName: 'basicsUnitLookupDataService',
					// cacheEnable: true,
					// additionalColumns: false
					// });
					ovl = {
						detail: {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'options': {
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					};
					break;
				case 'url':
					ovl = {
						maxLength: 2000,
						grid: {
							editor: 'url',
							formatter: 'url',
							bulkSupport: false
						}
					};
					break;
			}

			return ovl;
		};
	}
})(angular);
