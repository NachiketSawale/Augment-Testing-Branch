/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ Platform */
	'use strict';
	let moduleName = 'project.material';
	let projectMaterialModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMaterialMainService
	 * @function
	 *
	 * @description
	 * projectMaterialMainService is the data service for all project Material related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMaterialModule.factory('projectMaterialMainService', ['$http', '$q', '$log', '$injector','platformGridAPI', 'PlatformMessenger','projectMainService', 'platformDataServiceFactory', 'cloudCommonGridService', 'hourfactorReadonlyProcessor','platformRuntimeDataService','projectCommonFilterButtonService','projectCommonJobService',

		function ($http, $q, $log, $injector,platformGridAPI, PlatformMessenger,projectMainService, platformDataServiceFactory, cloudCommonGridService, hourfactorReadonlyProcessor,platformRuntimeDataService,projectCommonFilterButtonService,projectCommonJobService) {

			let prjMaterialerviceInfo = {
				flatNodeItem: {
					module: projectMaterialModule,
					serviceName: 'projectMaterialMainService',
					entityNameTranslationID: 'project.main.material',
					httpRead: {
						route: globals.webApiBaseUrl + 'project/material/',
						endRead: 'listMaterialByFilter',
						usePostForRead: true,
						initReadData: function (readData) {
							let selectedItem = projectMainService.getSelected ();
							if (selectedItem && selectedItem.Id > 0) {
								readData.ProjectId = selectedItem.Id;
							}
							readData.jobIds = _.uniqBy (jobIds);
							readData.InitFilterMenuFlag =  initFilterMenuFlag && !isManuallyFilter;
						}
					},
					actions: {delete: false},
					dataProcessor: [hourfactorReadonlyProcessor],
					entityRole: {
						node: {
							itemName: 'PrjMaterial',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					},
					entitySelection: {},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selectedItem = projectMainService.getSelected ();
								if (selectedItem && selectedItem.Id > 0) {
									creationData.projectId = selectedItem.Id;
								}
							},
							incorporateDataRead: incorporateDataRead
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete (prjMaterialerviceInfo);

			let service = serviceContainer.service;

			service.onToolsUpdated = new PlatformMessenger ();
			service.hightLightNGetJob = new PlatformMessenger ();

			let calculateModule = null;
			let showFilterBtn = false;
			let jobIds = [];
			let initFilterMenuFlag = true;
			let isManuallyFilter = false;
			let showUpdateRelatedAssemblyPrompt = true;
			let updateRelatedAssembly = false;

			service.setIsManuallyFilter = function setIsManuallyFilter(value){
				isManuallyFilter = value;
			};

			service.setInitFilterMenuFlag = function setInitFilterMenuFlag(value){
				initFilterMenuFlag = value;
			};

			service.getInitFilterMenuFlag = function getInitFilterMenuFlag(){
				return initFilterMenuFlag;
			};

			service.setReadOnly = setReadOnly;

			function setReadOnly(material) {
				let versionEstHeaderJobIds = projectCommonFilterButtonService.getJobFksOfVersionEstHeader ();
				_.forEach (material, function (item) {

					let readOnly = versionEstHeaderJobIds.includes (item.LgmJobFk) || projectCommonJobService.isJobReadOnly(item.LgmJobFk);
					item.readOnlyByJob = readOnly;

					let fields = [];
					_.forOwn (item, function (value, key) {
						let field = {field: key, readonly: readOnly};
						fields.push (field);
					});
					platformRuntimeDataService.readonly (item, fields);
				});
			};

			function incorporateDataRead(response, data) {
				let readItems = response.dtos;
				let basMaterial = {};
				angular.forEach (readItems, function (item) {
					basMaterial = cloudCommonGridService.addPrefixToKeys (item.BasMaterial, 'BasMaterial');
					angular.extend (item, basMaterial);
				});

				$injector.get('projectCommonFilterButtonService').initFilterMenu(service,response.highlightJobIds).then(function(){
					return projectCommonJobService.prepareData().then(function () {
						setReadOnly(readItems);
					});
				});
				return serviceContainer.data.handleReadSucceeded (readItems, data);
			}

			let costCalc = function costCalc(selectedItem, model) {
				selectedItem.Cost = selectedItem.ListPrice * (100 - selectedItem.Discount) / 100 + (selectedItem.Charges) + (selectedItem.PriceExtra);

				let materialPortionMainService = $injector.get ('projectMaterialPortionMainService');
				let materialPortionEstimatePrice = materialPortionMainService.getEstimatePrice ();
				let materialPortionDayWorkRate = materialPortionMainService.getDayWorkRate ();

				if (calculateModule === 'estimate') {
					materialPortionMainService = $injector.get ('estimateMainMaterialPortionService');
					materialPortionEstimatePrice = materialPortionMainService.getEstimatePrice ();
					materialPortionDayWorkRate = materialPortionMainService.getDayWorkRate ();
				}

				if (model === 'IsEstimatePrice') {
					selectedItem.EstimatePrice = selectedItem.Cost;
					selectedItem.EstimatePrice = selectedItem.EstimatePrice + materialPortionEstimatePrice;
				} else if (model === 'IsDayWorkRate') {
					selectedItem.DayWorkRate = selectedItem.Cost;
					selectedItem.DayWorkRate = selectedItem.DayWorkRate + materialPortionDayWorkRate;
				} else {
					// Estimate price  is always set to COST whenever COST changes
					selectedItem.EstimatePrice = selectedItem.Cost;
					selectedItem.DayWorkRate = selectedItem.Cost;

					selectedItem.EstimatePrice = selectedItem.EstimatePrice + materialPortionEstimatePrice;
					selectedItem.DayWorkRate = selectedItem.DayWorkRate + materialPortionDayWorkRate;
				}

				service.markItemAsModified (selectedItem);

				service.gridRefresh ();

				// service.rowRefresh(selectedItem);
			};
			service.recalculateCost = function recalculateCost(item, value, model) {
				let selectedItem = service.getSelected ();
				costCalc (selectedItem, model);
			};

			service.calculateCost = function calculateCost(item, model) {
				costCalc (item, model);
			};

			/**
			 * reload price condition items
			 * @param prcItem
			 * @param priceConditionFk
			 */
			service.reloadPriceCondition = function reloadPriceCondition(prcItem, priceConditionFk) {
				$injector.get ('priceConditionService').reload (prcItem, priceConditionFk);
			};

			service.setCalculateModule = function setCalculateModule(value) {
				calculateModule = value;
			};

			service.getCalculateModule = function getCalculateModule() {
				return calculateModule;
			};

			service.setShowFilterBtn = function setShowFilterBtn(value) {
				showFilterBtn = value;
			};

			service.getShowFilterBtn = function getShowFilterBtn() {
				return showFilterBtn;
			};

			service.priceConditionSelectionChanged = new Platform.Messenger ();


			service.setSelectedJobsIds = function setSelectedJobsIds(ids) {
				jobIds = _.filter (ids, function (d) {
					return d;
				});
			};

			service.clear = function clear() {
				jobIds = null;
				showFilterBtn = false;
			};

			service.updateEstimatePrice = function(){
				if(showUpdateRelatedAssemblyPrompt){
					let platformModalService = $injector.get('platformModalService');
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'project.material/templates/project-material-update-estimate-price-related-assembly-dialog.html',
						controller: 'projectMaterialUpdateEstimatePriceRelatedAssemblyDialogController',
						width: '640px'
					}).then(function (result) {
						updateRelatedAssembly = result && result.update;
					});
				}
			}

			service.disableUpdatePrompt = function(){
				showUpdateRelatedAssemblyPrompt = false;
			}

			service.provideUpdateData = function provideUpdateData(updateData){
				if(updateData && updateData.PrjMaterialToSave && updateData.PrjMaterialToSave.length > 0){
					_.forEach(updateData.PrjMaterialToSave, function(mateiralToSave){
						mateiralToSave.UpdateRelatedAssembly = updateRelatedAssembly;
					});
				}

				return updateData;
			}

			return service;

		}]);
})(angular);
