/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/* global globals, _ */
	const moduleName = 'awp.main';

	angular.module(moduleName).factory('awpMainServicePackagesDataService',
		['$http', 'platformDataServiceFactory', 'controllingProjectcontrolsProjectMainListDataService', 'awpMainServicePackagesImageService','servicePackageItemType',
			'basicsLookupdataLookupDescriptorService', 'platformModalService',
			function ($http, platformDataServiceFactory, parentService, awpMainServicePackagesImageService, packageItemType,
				basicsLookupdataLookupDescriptorService, platformModalService) {
				let serviceContainer = platformDataServiceFactory.createNewComplete({
					hierarchicalNodeItem: {
						module: moduleName,
						serviceName: 'awpMainServicePackagesDataService',
						entityNameTranslationID: 'awp.main.servicePackages',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'awp/main/servicepackage/',
							usePostForRead: true
						},
						entityRole: {
							node: {
								codeField: 'Reference',
								descField: 'BriefInfo',
								itemName: 'ServicePackages',
								parentService: parentService,
								moduleName: 'awp.main.servicePackages'
							}
						},
						presenter: {
							tree: {
								parentProp: 'ParentFk', childProp: 'Children'
							}
						},
						dataProcessor: [awpMainServicePackagesImageService],
						translation: {
							uid: 'awpMainServicePackagesDataService',
							title: 'awp.main.servicePackages',
							columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'}]
						},
						entitySelection: {supportsMultiSelection: false}
					}
				});

				let service = serviceContainer.service;

				service.createItem = function (){
					let selected = service.getSelected();
					let type = !selected ? packageItemType.Package : selected.TypeFk
					createNewItem(type);
				}

				service.createChildItem = function (){
					let selected = service.getSelected();
					if(!selected){return;}
					let type = selected.TypeFk === packageItemType.Package ? packageItemType.SubPackage : selected.TypeFk === packageItemType.SubPackage ? packageItemType.BoqHeader : null;
					if(!type){return;}

					createNewItem(type);
				}

				service.deleteSelection = function (){
					console.log('deleteSelection')
				}

				function createNewItem(itemType){
					switch (itemType){
						case packageItemType.Package:
							createNewPackage();
							break;
						case packageItemType.SubPackage:
							createNewSubPackage();
							break;
						case packageItemType.BoqHeader:
							createBoqHeader()
							break;
					}
				}

				function createNewPackage(){
					let project = parentService.getSelected()
					if(!project){
						return;
					}

					$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/showassetmasterinprocurement').then(function (response) {
						platformModalService.showDialog({
							defaults: {
								ProjectFk: project.Id || null,
								IsCreateByPackage: true
							},
							templateUrl: globals.appBaseUrl + 'procurement.package/partials/create-prc-package-project.html',
							backdrop: false,
							packageCreationShowAssetMaster: response.data
						}).then(function (res) {
							if (res) {
								let params = {};
								params.PrjProjectFk = res.ProjectFk;
								params.ConfigurationFk = res.ConfigurationFk;
								params.Description = res.Description;
								params.StructureFk = res.StructureFk === -1 ? null : res.StructureFk;
								params.ClerkPrcFk = res.ClerkPrcFk;
								params.ClerkReqFk = res.ClerkReqFk;
								params.AssetMasterFk = res.AssetMasterFk;
								params.Code = res.Code;
								params.IsAutoSave = true;

								$http.post(globals.webApiBaseUrl +'procurement/package/package/create/createpackage', params).then(function (newPackage){
									if(newPackage && newPackage.data){
										let item = newPackage.data;
										item.TypeFk = packageItemType.Package;
										item.Reference = item.Code;
										item.MainItemId = item.Id;
										appedNewData(item);
										if(item.Package2HeaderComplete){
											let subPackage = item.Package2HeaderComplete.Package2Header;
											subPackage.Reference = 'Sub Package';
											subPackage.TypeFk = packageItemType.SubPackage;
											subPackage.ParentFk = subPackage.PrcPackageFk;
											subPackage.MainItemId = subPackage.Id;
											appedNewData(subPackage, item);
											let boq = item.Package2HeaderComplete.PrcBoqExtended
											if(boq && boq.BoqRootItem){
												let boqHeader = boq.BoqRootItem;
												boqHeader.TypeFk = packageItemType.BoqHeader;
												boqHeader.ParentFk = subPackage.MainItemId;
												boqHeader.MainItemId = boqHeader.BoqHeaderFk;
												appedNewData(boqHeader, subPackage);
											}
										}
									}
								});
							}
						});
					});
				}

				function createNewSubPackage(){
					let project = parentService.getSelected(),
						parentItem = service.getSelected();
					if(!project || !parentItem){
						return;
					}

					if(parentItem.TypeFk === packageItemType.SubPackage){
						parentItem = _.find(service.getList(), {MainItemId: parentItem.ParentFk});
						if(!parentItem){
							return;
						}
					}

					let structure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: parentItem.StructureFk});
					if (angular.isDefined(structure)) {
						if (structure.TaxCodeFk) {
							parentItem.TaxCodeFk = structure.TaxCodeFk;
						}
					}

					let createData = {
						StructureFk: parentItem.StructureFk,
						ConfigurationFk: parentItem.ConfigurationFk,
						MdcTaxCodeFk: parentItem.TaxCodeFk,
						ProjectFk: project.Id,
						MainItemId: parentItem.MainItemId
					}
					$http.post(globals.webApiBaseUrl +'procurement/package/prcpackage2header/createdata', createData).then(function (newSubPackage){
						if(newSubPackage && newSubPackage.data && newSubPackage.data.Package2Header){
							let subPackage = newSubPackage.data.Package2Header;
							subPackage.Reference = 'Sub Package';
							subPackage.TypeFk = packageItemType.SubPackage;
							subPackage.ParentFk = subPackage.PrcPackageFk;
							subPackage.MainItemId = subPackage.Id;
							appedNewData(subPackage, parentItem);
						}
					});
				}

				function createBoqHeader(){
					let project = parentService.getSelected(),
						parentItem = service.getSelected();
					if(!project || !parentItem || parentItem.TypeFk !== packageItemType.SubPackage){
						return;
					}

					$http.get(globals.webApiBaseUrl + 'procurement/package/package/getprcboqdefault?packageFk=' + parentItem.ParentFk)
						.then(function (res) {
							if(res && res.data) {
								let options = {
									inReq: false,
									prcBoqDefaultValue: res.data,
									enableUseBaseBoq: true,
									enableUseWicBoq: false,
									enableNewBoq: !!res.data,
									boqSource: 1
								};

								let defaultOptions = {
									PrcHeaderFk: parentItem.PrcHeaderFk,
									PackageFk: parentItem.PackageFk,
									BasCurrencyFk: options && options.prcBoqDefaultValue ? options.prcBoqDefaultValue.BasCurrencyFk : null,
									Reference: options && options.prcBoqDefaultValue ? options.prcBoqDefaultValue.ReferenceNo : '',
									OutlineDescription: options && options.prcBoqDefaultValue ? options.prcBoqDefaultValue.OutlineDescription : null,
									CurrentlyLoadedItemsCallbackFn: service.getList,
									PrcCopyModeFk: parentItem.PrcCopyModeFk,
									headerId: parentItem.Id,
									ConReqHasWicBoq: false,
									BoqWicCatFk: null,
									BoqWicCatBoqFk: null,
									WicBoqReference: null
								};
								angular.extend(defaultOptions, options);

							}
						});
				}

				function appedNewData(newItem, parent){
					if (serviceContainer.data.onCreateSucceeded) {
						serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data, {parent: parent});
					}
				}

				return service;
			}
		]);
})();