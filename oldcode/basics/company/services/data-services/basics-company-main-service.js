/**
 * Created by henkel on 15.09.2014.
 */
(function () {
	'use strict';
	var companyModule = angular.module('basics.company');

	/**
	 * @ngdoc service
	 * @name basicsCompanyMainService
	 * @function
	 *
	 * @description
	 * basicsCompanyMainService is the data service for all company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection

	companyModule.factory('basicsCompanyMainService', ['_', 'globals', '$http', '$translate', 'platformDataServiceFactory', 'platformModalFormConfigService', 'ServiceDataProcessDatesExtension', 'ServiceDataProcessArraysExtension', 'basicsCompanyImageProcessor',
		'basicsCompanyMainModifyProcessor', 'basicsCompanySequenceTypeDataService', 'platformModuleNavigationService', 'basicsCompanyMainValidationProcessor', 'platformDataServiceSelectionExtension', 'basicsLookupdataLookupFilterService',
		'$injector', 'basicsCompanyCreationService',

		function (_, globals, $http, $translate, platformDataServiceFactory, platformModalFormConfigService, ServiceDataProcessDatesExtension, ServiceDataProcessArraysExtension, basicsCompanyImageProcessor, basicsCompanyMainModifyProcessor,
		          sequenceTypeDataService, naviService, basicsCompanyMainValidationProcessor, platformDataServiceSelectionExtension, basicsLookupdataLookupFilterService,
				  $injector, basicsCompanyCreationService) {

			var companyServiceOption = {
				hierarchicalRootItem: {
					module: companyModule,
					serviceName: 'basicsCompanyMainService',
					entityNameTranslationID: 'basics.company.entityCompany',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/company/',
						endRead: 'treefiltered',
						usePostForRead: true
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor, basicsCompanyMainModifyProcessor],
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						tree: {
							parentProp: 'CompanyFk', childProp: 'Companies'
						}
					},
					entityRole: {root: {descField: 'CompanyName', itemName: 'Companies', moduleName: 'cloud.desktop.moduleDisplayNameCompany',
						handleUpdateDone: function (updateData, response, data) {
							var utiliGroupServ = $injector.get('basicsCompanyUtilisableGroupService');
							utiliGroupServ.takeOverUtilisableParents(response,updateData.MainItemId);
							data.handleOnUpdateSucceeded(updateData, response, data, true);
						},


					},},
					sidebarSearch: {
						options: {
							moduleName: 'basics.company',
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: false
						}
					}
				}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(companyServiceOption);
			const service = serviceContainer.service;
			const data = serviceContainer.data;
			data.newEntityValidator = basicsCompanyMainValidationProcessor;

			service.canDelete = function canDelete() {
				var data = serviceContainer.data;
				var item = null;
				var res = (data.itemList.length > 0);
				if (res) {
					item = platformDataServiceSelectionExtension.getSelected(data);

					res = platformDataServiceSelectionExtension.isSelection(item);
				}

				if (res && item) {
					if (item.Version > 0) {
						res = false;
					}
				}

				return res;
			};

			service.getInternalData = function () {
				return data;
			}

			service.createItem = function createCompany(creationOptions) {
				var creationData = data.doPrepareCreate(data, creationOptions);

				return data.doUpdate(data).then(function (canCreate) {
					if (canCreate) {
						return basicsCompanyCreationService.createCompany(service, data);
					} else {
						return $q.reject('Cancelled by User');
					}
				});
			};

			service.createChildItem = function createChildCompany() {
				let creationData = data.doPrepareCreateChild(data);

				return data.doUpdate(data).then(function (canCreate) {
					if (canCreate) {
						return basicsCompanyCreationService.createChildCompany(service, data);
					}
					return $q.reject('Cancelled by User');
				});
			};

			service.createDeepCopy = function createDeepCopy() {
				let selectedCompany = service.getSelected();
				let myDialogOptions = {
					title: $translate.instant('basics.company.dialogCopyCompany'),
					dataItem: {
						Code: '',
						CompanyName: '',
						CompanyName2: '',
						CompanyName3: '',
						CompanyFk: selectedCompany.CompanyFk,
						AddressFk: null,
						WithChildren: false
					},
					formConfiguration: {
						fid: 'company.main.DescriptionInfoModal',
						version: '0.2.4',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: [ 'Code' ,'CompanyName','CompanyName2', 'CompanyName3', 'CompanyFk', 'AddressFk', 'WithChildren']
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'Code',
								model: 'Code',
								label: 'Code',
								label$tr$: 'cloud.common.entityCode',
								type: 'code',
								sortOrder: 1,
								required: true
							},
							{
								gid: 'baseGroup',
								rid: 'CompanyName',
								model: 'CompanyName',
								label: 'Company Name',
								label$tr$: 'cloud.common.entityCompanyName',
								type: 'description',
								sortOrder: 2
							},
							{
								gid: 'baseGroup',
								rid: 'CompanyName2',
								model: 'CompanyName2',
								label: 'Company Name 2',
								label$tr$: 'basics.company.entityCompanyName2',
								type: 'description',
								sortOrder: 3
							},
							{
								gid: 'baseGroup',
								rid: 'CompanyName3',
								model: 'CompanyName3',
								label: 'Company Name 3',
								label$tr$: 'basics.company.entityCompanyName3',
								type: 'description',
								sortOrder: 4
							},
							{
								gid: 'baseGroup',
								rid: 'company',
								model: 'CompanyFk',
								label: 'Company',
								label$tr$: 'cloud.common.entityCompany',
								type: 'directive',
								readonly: selectedCompany.CompanyTypeFk === 3, // Profitcenter may not change
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-company-company-lookup',
									displayMember: 'Code',
									descriptionMember: 'CompanyName'
								},
								sortOrder: 5
							},
							{
								gid: 'baseGroup',
								rid: 'address',
								model: 'AddressFk',
								label: 'Address',
								label$tr$: 'cloud.common.entityAddress',
								type: 'directive',
								directive: 'basics-common-address-dialog',
								options: {
									titleField: 'cloud.common.entityAddress',
									foreignKey: 'AddressFk',
									showClearButton: true
								},
								sortOrder: 6
							},
							{
								gid: 'baseGroup',
								rid: 'withchildren',
								model: 'WithChildren',
								label: 'With Children',
								label$tr$: 'basics.company.withchildren',
								type: 'boolean',
								sortOrder: 7
							}
						]
					},
					dialogOptions: {},
					handleOK: function handleOK(result) {
						let selectedCompany = service.getSelected();
						selectedCompany.Code = result.data.Code;
						selectedCompany.CompanyFk = result.data.CompanyFk;
						selectedCompany.CompanyName = result.data.CompanyName;
						selectedCompany.CompanyName2 = result.data.CompanyName2;
						selectedCompany.CompanyName3 = result.data.CompanyName3;
						selectedCompany.AddressFk = result.data.AddressFk;
						selectedCompany.WithChildren = result.data.WithChildren;

						let command = {
							Action: 4,
							WithChildren: result.data.WithChildren,
							Companies: [selectedCompany]
						};

						$http.post(globals.webApiBaseUrl + 'basics/company/execute', command)
							.then(function (response) {
									serviceContainer.data.handleOnCreateSucceeded(response.data.Company, serviceContainer.data);
								},
								function (/* error */) {
								});
					}
				};

				platformModalFormConfigService.showDialog(myDialogOptions);
			};

			//get select for address
			service.getSelectedAddress = function getSelectedAddress() {
				return service.getSelected();
			};

			//******************************************************************

			/**
			 * Example Implementation of a navigator for special purpose
			 */

			var PKeys = [];
			service.selectCompanyByCertificate = function selectCompanyByCertificate(certificateEntity) {

				var item = service.getItemById(certificateEntity.CompanyFk);
				if (!item) {
					serviceContainer.data.extendSearchFilter = extendSearchFilter;
					PKeys = [certificateEntity.CompanyFk];
					service.load().then(function () {
						item = service.getItemById(certificateEntity.CompanyFk);
						service.setSelected(item);
						delete serviceContainer.data.extendSearchFilter;
					});
				}
				service.setSelected(item);
			};

			naviService.registerNavigationEndpoint(
				{
					moduleName: 'basics.company-certificate',
					navFunc: service.selectCompanyByCertificate
				}
			);

			function extendSearchFilter(readData){
				readData.PKeys = PKeys;
			}
			//******************************************************************

			service.getBlobFk = function getBlobFk() {
				return service.getSelected().BlobsFk ? service.getSelected().BlobsFk : 0;
			};


			var seqCache = [{Description: 'continues sequence', Id: 0}, {Description: 'from reserve', Id: 1}];

			sequenceTypeDataService.setCache({lookupType: 'basicsCompanySequenceTypeDataService'}, seqCache);

			var comp = 1;
			var group = 2;
			var profitCentre = 3;

			var filters = [
				{
					key: 'basics-company-type-filter',
					fn: function (companyStatusItem, company) {
						var parentCompany = service.getItemById(company.CompanyFk);
						if ( parentCompany !== null && parentCompany !== undefined) {
							switch (parentCompany.CompanyTypeFk) {
								case comp:
									if(companyStatusItem.Id === comp){
										return false;
									}
									if(companyStatusItem.Id === group){
										return false;
									}
									if(companyStatusItem.Id === profitCentre){
										return true;
									}
									break;
								case group:
									if(companyStatusItem.Id === comp){
										return true;
									}
									if(companyStatusItem.Id === group){
										return true;
									}
									if(companyStatusItem.Id === profitCentre){
										return false;
									}
									break;
								case profitCentre:
									if(companyStatusItem.Id === comp){
										return false;
									}
									if(companyStatusItem.Id === group){
										return false;
									}
									if(companyStatusItem.Id === profitCentre){
										return true;
									}
									break;
							}
						} else {
							if(companyStatusItem.Id === comp){
								return true;
							}
							if(companyStatusItem.Id === group){
								return true;
							}
							if(companyStatusItem.Id === profitCentre){
								return false;
							}
						}
					}
				},
				{
					key: 'basics-company-rubric-category-by-rubric-filter',
					fn: function (rc, entity) {
						return rc.RubricFk === entity.RubricFk;//3 is rubric for project.
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			service.registerSelectionChanged(function(){
				var prjLookupService = $injector.get('basicsLookupDataProjectLookupDataService');
				var filterCompanies = [];
				var selectedCompany = service.getSelected();
				if(selectedCompany){
					prjLookupService.getFilterCompanies(selectedCompany, filterCompanies);
				}
				prjLookupService.setFilter(filterCompanies);
			});

			return service;
		}]);
})();
