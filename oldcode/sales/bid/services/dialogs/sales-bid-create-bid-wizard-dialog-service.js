/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('salesBidCreateBidWizardDialogService',
		['_', 'globals', '$q', '$log', '$http', '$translate', 'salesBidService', 'salesBidBoqService', 'platformTranslateService', 'platformSidebarWizardCommonTasksService', 'platformModalFormConfigService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'salesBidCreateBidWizardStructureTypeService',
			function (_, globals, $q, $log, $http, $translate, salesBidService, salesBidBoqService, platformTranslateService, platformSidebarWizardCommonTasksService, platformModalFormConfigService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, salesBidCreateBidWizardStructureTypeService) {

				var service = {};

				function createDialog(modalCreateBidConfig) {
					platformTranslateService.translateFormConfig(modalCreateBidConfig.formConfiguration);
					return platformModalFormConfigService.showDialog(modalCreateBidConfig);
				}

				function createBidBoq(creationData) {

					var httpCreationRequest = '';
					var data = {};
					if(creationData.SelectedBidHeaderFk > 0 && creationData.StructureItemFk > 0){
						switch(creationData.StructureType) {
							case 1:  // Create bid boq based on project boq
								httpCreationRequest = globals.webApiBaseUrl + 'sales/bid/boq/createbasedonprojectboq';
								data.MainItemId = creationData.SelectedBidHeaderFk;
								data.ProjectBoqHeaderId = creationData.StructureItemFk;
								break;
							case 2: // Create bid boq based on estimate line items
								break;
							case 3: // Create bid boq based on scheduling activities
								break;
							case 4: // Create bid boq based on cost groups
								break;
						}

						// Do the creation post
						if(!_.isEmpty(httpCreationRequest) && !_.isEmpty(data)) {
							$http.post(httpCreationRequest, data).then(function(result){
								if(angular.isDefined(result) && (result !== null) && angular.isDefined(result.data) && (result.data !== null)) {
									// The new boq has been created
									// -> update the bid boq list
									var boqItemCompositeList = salesBidBoqService.getList();
									boqItemCompositeList.push(result.data);
									salesBidBoqService.goToLast(); // When the list is ordered we'll maybe have to change this
									salesBidBoqService.gridRefresh();
								}
							});
						}
					}
				}

				var salseBidStructureItemFilter = [{
					key: 'sales-bid-structure-item-filter',
					fn: function (item) {
						var salesBoqList = salesBidBoqService.getList();
						if(initDataItem.StructureType === 1) {
							return !_.find(salesBoqList, function(salesBoq) {
								return salesBoq.BoqRootItem.Reference === item.Code;
							});
						}
						else {
							// To be implemented yet
							$log.warn('sales-bid-structure-item-filter -> no filter for this strucuture type implemented yet!');
						}

						return false;
					}
				}];

				basicsLookupdataLookupFilterService.registerFilter(salseBidStructureItemFilter);

				// default item init values
				var initDataItem = {};

				service.resetToDefault = function () {

					// default item init values
					initDataItem = {
						SelectedBidHeaderFk: -1,
						StructureType: 1,
						StructureItemFk: 0,
						EstimateFk: 0,
						IsLeadingStructure: false
					};

					// Set the currently selected structure type id
					salesBidCreateBidWizardStructureTypeService.setStructureTypeId(1);
				};

				service.resetToDefault();

				service.init = function init(dataItem) {
					angular.extend(initDataItem, dataItem);
				};

				/**
					 * @ngdoc function
					 * @name showDialog
					 * @function
					 * @methodOf salesBidCreateBidWizardDialogService
					 * @description Shows a dialog containing various settings to trigger the creation of a bid
					 */
				service.showDialog = function showDialog(onCreateFn) {

					// Get the currently selected bid header
					var headerSelectedItem = salesBidService.getSelected();
					var message = $translate.instant('sales.bid.noBidHeaderSelected');

					if(!platformSidebarWizardCommonTasksService.assertSelection(headerSelectedItem, 'sales.bid.bidSelectionMissing', message)) {
						return;
					}

					// Set selected bid header to initDataItem
					initDataItem.SelectedBidHeaderFk = headerSelectedItem.Id;

					// Set the currently selected Project
					salesBidCreateBidWizardStructureTypeService.setProjectId(headerSelectedItem.ProjectFk);

					var modalCreateBidConfig = {
						title: $translate.instant('sales.bid.wizard.generateBid'),
						dataItem: initDataItem,
						formConfiguration: {

							fid: 'sales.bid.createBidWizardModal',
							version: '0.0.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: [
										'structuretype', 'structureitemfk', 'estimatefk', 'isleadingstructure'
									]
								}
							],
							rows: [

								// Structure Type
								{
									gid: 'baseGroup',
									rid: 'structuretype',
									label$tr$: 'sales.bid.wizard.structureType',
									model: 'StructureType',
									type: 'select',
									options: {
										displayMember: 'Description',
										valueMember: 'Id',
										inputDomain: 'description',
										select: 1,
										items: [ // Currently we only support one mode, i.e. copying from a project boq
											{Id: 1, Description: 'Project BoQ'}/* ,
												{Id: 2, Description: 'Project Estimate'},
												{Id: 3, Description: 'Project Schedule'},
												{Id: 4, Description: 'Project Cost Groups'} */
										]
									},
									visible: true,
									sortOrder: 1,
									change: function onPropertyChanged(item, property) {
										if (property && _.isString(property) && property === 'StructureType') {
											// Set the currently selected structure type id
											salesBidCreateBidWizardStructureTypeService.setStructureTypeId(item.StructureType);
											// Reset the structure item
											initDataItem.StructureItemFk = 0;
										}
									}
								},
								// Structure Item
								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
									dataServiceName: 'salesBidCreateBidWizardStructureTypeService',
									enableCache: true,
									filterKey: 'sales-bid-structure-item-filter'
								},
								{
									gid: 'baseGroup',
									rid: 'structureitemfk',
									label$tr$: 'sales.bid.wizard.structureItem',
									model: 'StructureItemFk',
									sortOrder: 2
								}
								)
							]
						},
						handleOK: function handleOK(result) {
							var newBid = result.data;
							var creationData = {
								SelectedBidHeaderFk: newBid.SelectedBidHeaderFk,
								StructureType: newBid.StructureType,
								StructureItemFk: newBid.StructureItemFk
							};

							if (_.isFunction(onCreateFn)) {
								onCreateFn(creationData);
							}
							else {
								createBidBoq(creationData);
							}
						}

					};

					return createDialog(modalCreateBidConfig);
				};

				return service;

			}]);
})();
