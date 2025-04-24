/**
 * Created by baf on 05.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc service
	 * @name resourceProjectContainerInformationService
	 * @description provides information on container used in resource project module
	 */
	angular.module(moduleName).service('resourceProjectContainerInformationService', ResourceProjectContainerInformationService);

	ResourceProjectContainerInformationService.$inject = ['_', '$injector', 'platformLayoutHelperService',
		'basicsLookupdataConfigGenerator', 'resourceProjectConstantValues'];

	function ResourceProjectContainerInformationService(_, $injector, platformLayoutHelperService,
		basicsLookupdataConfigGenerator, resourceProjectConstantValues) {
		let dynamicConfigurations = {};
		let self = this;
		const guids = resourceProjectConstantValues.uuid.container;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;
			switch (guid) {
				case guids.projectList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceProjectServiceInfos(), self.getResourceProjectLayout);
					break;
				case guids.projectDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceProjectServiceInfos(), self.getResourceProjectLayout);
					break;
				case guids.estimateHeaderList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getEstimateHeaderServiceInfos(), self.getEstimateHeaderLayout);
					break;
				case guids.plantCostCodeList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantCostCodeServiceInfos(), self.getPlantCostCodeLayout);
					break;
				case guids.requisitionList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getRequisitionsServiceInfos(), self.getResourceProjectRequisitionsLayout);
					break;
				case guids.projectRequisitionList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getProjectRequisitionsServiceInfos(), self.getResourceProjectRequisitionsLayout);
					break;
				case guids.projectExecPlannerItemList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceProjectExecPlannerItemServiceInfos(), self.getExecPlannerItemLayout);
					break;
				case guids.projectExecPlannerItemDetail:
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceProjectExecPlannerItemServiceInfos(), self.getExecPlannerItemLayout);
					break;
				case guids.requisitionTimeslotList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getRequisitionTimeslotServiceInfos(), self.getRequisitionTimeslotLayout);
					break;
				case guids.requisitionTimeslotDetails:
					config = platformLayoutHelperService.getStandardGridConfig(self.getRequisitionTimeslotServiceInfos(), self.getRequisitionTimeslotLayout);
					break;

				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : null;
					break;
			}
			return config;
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNil(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		this.getResourceProjectServiceInfos = function getResourceProjectServiceInfos() {
			return {
				standardConfigurationService: 'resourceProjectLayoutService',
				dataServiceName: 'resourceProjectDataService',
				validationServiceName: 'resourceProjectValidationService'
			};
		};

		this.getResourceProjectLayout = function getResourceProjectLayout() {
			var res =  platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.project.project',
				['projectno', 'projectname', 'projectname2', 'currencyfk']);
			res.overloads = platformLayoutHelperService.getOverloads(['currencyfk'], self);

			return res;
		};

		this.getEstimateHeaderServiceInfos = function getEstimateHeaderServiceInfos() {
			return {
				standardConfigurationService: 'resourceProjectEstimateHeaderLayoutService',
				dataServiceName: 'resourceProjectEstimateHeaderDataService',
				validationServiceName: ''
			};
		};

		this.getPlantCostCodeServiceInfos = function getPlantCostCodeServiceInfos() {
			return {
				standardConfigurationService: 'resourceProjectPlantCostCodeLayoutService',
				dataServiceName: 'resourceProjectPlantCostCodeDataService',
				validationServiceName: ''
			};
		};

		this.getRequisitionsServiceInfos = function getRequisitionsServiceInfos() {
			return {
				standardConfigurationService: 'resourceProjectRequisitionsLayoutService',
				dataServiceName: 'resourceProjectPlantCostCodeRequisitionsDataService',
				validationServiceName: ''
			};
		};

		this.getProjectRequisitionsServiceInfos = function getProjectRequisitionsServiceInfos() {
			return {
				standardConfigurationService: 'resourceProjectRequisitionsLayoutService',
				dataServiceName: 'resourceProjectProjectRequisitionsDataService',
				validationServiceName: ''
			};
		};

		this.getResourceProjectExecPlannerItemServiceInfos = function getResourceProjectExecPlannerItemServiceInfos() {
			return {
				standardConfigurationService: 'resourceProjectExecPlannerItemLayoutService',
				dataServiceName: 'resourceProjectExePlannerItemDataService',
				validationServiceName: 'resourceProjectExecPlannerItemValidationService'
			};
		};

		this.getRequisitionTimeslotServiceInfos = function getRequisitionTimeslotServiceInfos() {
			return {
				standardConfigurationService: 'resourceProjectRequisitionTimeslotLayoutService',
				dataServiceName: 'resourceProjectRequisitionTimeslotDataService',
				validationServiceName: ''
			};
		};

		this.getEstimateHeaderLayout = function getEstimateHeaderLayout() {
			// This is a non standard implementation! Do not copy ...
			var layServ = $injector.get('estimateProjectUIConfigurationService');
			var layout = layServ.getEstimateProjectEstHeaderDetailLayout();

			var res =  platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.project.estimate',
				[]);

			_.forEach(layout.groups[0].attributes, function(att) {
				res.groups[0].attributes.push(att.split('.')[1]);
			});

			res.overloads = _.clone(layout.overloads.estheader);

			return res;
		};

		this.getPlantCostCodeLayout = function getPlantCostCodeLayout() {

			return platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory('1.0.0', 'resource.project.plantcostcode',
				[ 'costcode', 'costcodedescinfo','resourcedescinfo'],[]);
		};

		this.getResourceProjectRequisitionsLayout = function getResourceProjectRequisitionsLayout() {
			// This is a non standard implementation! Do not copy ...
			var requisitionService = $injector.get('resourceRequisitionUIStandardService');
			var layoutServForOverloads = requisitionService.getCreateMainLayout();
			var layout = requisitionService.getStandardConfigForDetailView();

			var res =  platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.project.requisitions',
				[]);

			_.each(layout.rows, function(att) {
				res.groups[0].attributes.push(att.rid);
			});
			res.overloads = layoutServForOverloads.overloads;

			return res;
		};

		this.getExecPlannerItemLayout = function getExecPlannerItemLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.project.executionplanneritem',
				['duedate', 'code', 'recordno', 'descriptioninfo', 'actionitemstatusfk', 'documentfk', 'plantcertificatefk', 'contractheaderfk', 'businesspartnerfk', 'transportstart', 'transportend',
				'deliverytimesfrom', 'deliverytimestill', 'clerkfk', 'clerkresponsiblefk', 'islive', 'isauthorized', 'isrequestdate', 'isrequesturl', 'isrequestprjdocument', 'isrequestplantcertificate',
				'isrequestbizpartner', 'isrequestprccontract', 'isrequestclerk', 'url']);

			res.overloads = platformLayoutHelperService.getOverloads(['actionitemstatusfk', 'documentfk', 'plantcertificatefk', 'contractheaderfk', 'businesspartnerfk', 'clerkfk', 'clerkresponsiblefk', 'url'], self);
			return res;
		};


		this.getRequisitionTimeslotLayout = function getRequisitionTimeslotLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.project.requisitiontimeslot',
				['description', 'timeslotnumber', 'initialstartdate', 'initialduration', 'initialenddate', 'actualstartdate', 'actualduration', 'actualenddate', 'timeslotupdatereasonfk']);

			res.overloads = platformLayoutHelperService.getOverloads(['timeslotupdatereasonfk'], self);
			return res;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;
			switch(overload) {
				case 'actionitemstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.logisticsactionitemstatus', null, {showIcon: true});
					break;
				case 'currencyfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideCurrencyLookupSpecification()); break;
				case 'documentfk': ovl = 	{
					grid: {
						editor: 'lookup',
							editorOptions: {
							directive: 'project-document-lookup-dialog',
								lookupOptions: {
								filterKey: 'document-project-filter',
								showClearButton: true,
							}
						},
						formatter: 'lookup',
							formatterOptions: {
							lookupType: 'ProjectDocument',
								displayMember: 'Description',
								version: 3
						}
					},
					detail: {
						type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
							lookupDirective: 'project-document-lookup-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
								    showClearButton: true,
									initValueField: 'Description',
									filterKey: 'document-project-filter',
							}
						}
					}
				}; break;
				case 'plantcertificatefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					    dataServiceName: 'resourceEquipmentPlantCertificateLookupDataService',
					    cacheEnable: true,
						showClearButton: true,
				});
					break;
				case 'contractheaderfk':
					ovl =  {
						grid: {
							navigator: {
								moduleName: 'procurement.contract'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'prc-con-header-dialog',
								lookupOptions: {
									addGridColumns: [
										{
											id: 'DateOrdered',
											field: 'DateOrdered',
											name: 'Date Ordered',
											name$tr$: 'cloud.common.entityDateOrdered',
											formatter: 'dateutc',
											readonly: true
										},
										{
											id: 'Description',
											field: 'Description',
											name: 'Description',
											name$tr$: 'cloud.common.entityDescription',
											formatter: 'description',
											readonly: true
										},
									],
									additionalColumns: true,
									filterKey: 'logistic-job-task-prc-con-header-filter',
									showClearButton: true,
									dialogOptions: {
										alerts: [{
											theme: 'info',
											message: 'Setting basis contract will overwrite quite a lot of related fields',
											message$tr$: 'procurement.common.contractHeaderUpdateInfo'
										}]
									}
								}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'conheaderview', 'displayMember': 'Code'},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'prc-con-header-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'prc-con-header-filter',
									dialogOptions: {
										alerts: [{
											theme: 'info',
											message: 'Setting basis contract will overwrite quite a lot of related fields',
											message$tr$: 'procurement.common.contractHeaderUpdateInfo'
										}]
									}
								}
							}
						}
					};
					break;
				case 'businesspartnerfk':
					ovl= {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'filter-business-partner-dialog-lookup',
								lookupOptions: {
									showClearButton: true,
									IsShowBranch: true,
									mainService: 'procurementRequisitionHeaderDataService',
									BusinessPartnerField: 'BusinesspartnerFk',
									SubsidiaryField: 'SubsidiaryFk',
									SupplierField: 'SupplierFk',
									PaymentTermFiField: 'BasPaymentTermFiFk',
									PaymentTermPaField: 'BasPaymentTermPaFk'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							},
							width: 130
						},
						detail: {
							type: 'directive',
							directive: 'filter-business-partner-dialog-lookup',
							options: {
								showClearButton: true,
								IsShowBranch: true,
								mainService: 'procurementRequisitionHeaderDataService',
								BusinessPartnerField: 'BusinesspartnerFk',
								SubsidiaryField: 'SubsidiaryFk',
								SupplierField: 'SupplierFk',
								paymentTermFiField: 'BasPaymentTermFiFk',
								paymentTermPaField: 'BasPaymentTermPaFk'
							}
						}
					}; break;
				case 'clerkfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload(true);
					break;
				case 'clerkresponsiblefk':
					ovl =platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'timeslotupdatereasonfk': ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.resourcetimeslotupdatereason');
			}

			return ovl;
		};
	}
})(angular);
