/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMdcAllowanceCompanyService
	 * @function
	 *
	 * @description
	 * basicsCostCodesMainService is the data service for mdcAllowance company related functionality.
	 */
	angular.module(moduleName).factory('estimateMdcAllowanceCompanyService',
		['_',
			'$http',
			'$injector',
			'$translate',
			'platformDataServiceFactory',
			'ServiceDataProcessArraysExtension',
			'basicsCompanyImageProcessor',
			'estimateMdcAllowanceCompanyProcessor',
			'cloudCommonGridService',
			function (_,
				$http,
				$injector,
				$translate,
				platformDataServiceFactory,
				ServiceDataProcessArraysExtension,
				basicsCompanyImageProcessor,
				estimateMdcAllowanceCompanyProcessor,
				cloudCommonGridService) {

				let mdcContextId = -1;
				let mdcAllowanceFk = -1;
				let isReadOnlyContainer = false;
				let isLoadData = false;
				let mdcAllowanceCompanies = [];
				let deleteMdcAllowanceCompanyFks = [];
				let addMdcAllowanceCompanyFks = [];

				let serviceOptions = {
					hierarchicalRootItem: {
						module: angular.module(moduleName),
						serviceName: 'estimateMdcAllowanceCompanyService',
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/mdcAllowanceCompany/', // adapt to web API controller
							endRead: 'tree',
							usePostForRead: true,
							initReadData: function (readData) {
								readData.MdcAllowanceFk = service.getMdcAllowanceFk();
								readData.MdcContextId = service.getMdcContextId();
								return readData;
							}
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor,estimateMdcAllowanceCompanyProcessor],
						presenter: {
							tree: {
								parentProp: 'CompanyFk',
								childProp: 'Companies',
								incorporateDataRead: function (readData, data) {
									let companies = [];
									cloudCommonGridService.flatten(readData, companies, 'Companies');
									mdcAllowanceCompanies = _.filter(companies, function (item) {
										return  item.IsChecked;
									});
									return serviceContainer.data.handleReadSucceeded(readData, data);
								}
							}
						},
						entityRole: {
							root: {
								itemName: 'MdcAllowanceCompanies',
								moduleName: 'estimate.main'
							}
						},
						modification: {
							multi: {}
						},
						actions:{
							delete:false,
							create:false
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				let service = serviceContainer.service;

				service.fieldChangeCallBack = function fieldChangeCallBack(arg) {
					let item = arg.item;
					handleUpdate(item);
					_.forEach(item.Companies, function (company) {
						setStateRecursive(company, item.IsChecked);
					});
					service.gridRefresh();
				};

				function setStateRecursive(item, newState) {
					item.IsChecked = newState;
					handleUpdate(item);
					_.forEach(item.Companies, function (company) {
						setStateRecursive(company, newState);
					});
				}
				function handleUpdate(item) {
					if(item.IsChecked){
						let mdcAllowanceCompany = _.find(mdcAllowanceCompanies, function (company) {
							return item.Id === company.Id;
						});

						deleteMdcAllowanceCompanyFks = _.filter(deleteMdcAllowanceCompanyFks, function (companyFk) {
							return companyFk !== item.Id;
						});

						if(!mdcAllowanceCompany){
							let addMdcAllowanceCompanyFk = _.find(addMdcAllowanceCompanyFks, function (companyFk) {
								return companyFk === item.Id;
							});

							if(!addMdcAllowanceCompanyFk){
								if(_.isUndefined(addMdcAllowanceCompanyFks)){
									addMdcAllowanceCompanyFks = [];
								}
								addMdcAllowanceCompanyFks.push(item.Id);
							}
						}
					}else {
						let mdcAllowanceCompany = _.find(mdcAllowanceCompanies, function (company) {
							return item.Id === company.Id;
						});

						addMdcAllowanceCompanyFks = _.find(addMdcAllowanceCompanyFks, function (companyFk) {
							return companyFk !== item.Id;
						});

						if(mdcAllowanceCompany){
							let deleteMdcAllowanceCompanyFk = _.find(deleteMdcAllowanceCompanyFks, function (companyFk) {
								return companyFk === item.Id;
							});

							if(!deleteMdcAllowanceCompanyFk){
								if(_.isUndefined(deleteMdcAllowanceCompanyFks)){
									deleteMdcAllowanceCompanyFks = [];
								}
								deleteMdcAllowanceCompanyFks.push(item.Id);
							}
						}
					}
				}

				service.showHeaderAfterSelectionChanged = null;
				let baseSetSelected = service.setSelected;
				service.setSelected = function setSelected(entity) {
					if(entity){
						serviceContainer.data.doClearModifications(entity,serviceContainer.data);
					}
					baseSetSelected(entity);
				};

				service.setMdcContextId = function setMdcContextId(id) {
					mdcContextId = id;
				};

				service.getMdcContextId = function getMdcContextId() {
					return mdcContextId;
				};

				service.setMdcAllowanceFk = function (id) {
					mdcAllowanceFk = id;
				};

				service.getMdcAllowanceFk = function () {
					return mdcAllowanceFk;
				};

				service.setIsReadOnlyContainer = function setIsReadOnlyContainer(flag) {
					isReadOnlyContainer = flag;
				};

				service.getIsReadOnlyContainer = function getIsReadOnlyContainer() {
					return isReadOnlyContainer;
				};

				service.setIsLoadData = function setIsLoadData(flag) {
					isLoadData = flag;
				};

				service.getIsLoadData = function getIsLoadData() {
					return isLoadData;
				};

				service.clearData = function clearData() {
					service.setList([]);
					serviceContainer.data.itemTree = [];
					deleteMdcAllowanceCompanyFks = [];
					addMdcAllowanceCompanyFks = [];
					mdcAllowanceCompanies = [];
				};

				service.getMdcAllowanceCompanyFkToSave = function getMdcAllowanceCompanyFksToSave() {
					return addMdcAllowanceCompanyFks;
				};

				service.getMdcAllowanceCompanyFkToDelete = function getMdcAllowanceCompanyFksToDelete() {
					return deleteMdcAllowanceCompanyFks;
				};

				service.clearGridData = function () {
					service.setList([]);
					serviceContainer.data.itemTree = [];
					serviceContainer.data.listLoaded.fire();
				};

				return service;
			}
		]);
})(angular);
