
(function () {
	/* global globals _ */
	'use strict';
	var moduleName = 'qto.main';
	var boqMainModule = angular.module (moduleName);

	boqMainModule.factory ('qtoMainPropertiesDialogService', ['$http','$injector','platformModalService', 'qtoMainDetailService','basicsLookupdataLookupFilterService','PlatformMessenger','qtoMainHeaderDataService','QtoType','$q',
		function ($http,$injector, platformModalService, qtoMainDetailService,basicsLookupdataLookupFilterService,PlatformMessenger,qtoMainHeaderDataService,qtoType,$q) {
			let service = {};

			angular.extend(service, {
				registerLookupFilter: registerLookupFilter,
				unregisterLookupFilter: unregisterLookupFilter,
				validationOkBtn: new PlatformMessenger(),
			});
			
			let lookupFilter = [
				{
					key: 'project-clerk-role-by-is-for-project-filter',
					fn: function (item) {
						return item.IsForProject;
					}
				},
				{
					key: 'basics-clerk-by-company-filter',
					serverSide: true,
					serverKey: 'basics-clerk-by-company-filter',
					fn: function (entity) {
						return {CompanyFk: entity.CompanyFk};
					}
				}
			];
			
			function registerLookupFilter() {
				basicsLookupdataLookupFilterService.registerFilter(lookupFilter);
			}
			
			function unregisterLookupFilter() {
				basicsLookupdataLookupFilterService.unregisterFilter(lookupFilter);
			}
			let boqStructure ={};
			service.getBoqStructure = function getBoqStructure(){
				let boqHeaderId = qtoMainHeaderDataService.getSelected().BoqHeaderFk;
				//The same data is requested only once
				if(boqStructure[boqHeaderId]){
					if(_.isObject(boqStructure[boqHeaderId]) && boqStructure[boqHeaderId].BoqStandardFk === qtoType.OnormQTO){
						service.isDisable = true;
					}else {
						service.isDisable = false;
					}
					return $q.when(boqStructure[boqHeaderId]);
				}else {
					let defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'boq/main/getstructure4boqheader?headerId=' + boqHeaderId + '&withDetails=' + true).then(function (response) {
						if (response && response.data) {
							boqStructure[boqHeaderId] = response.data;

							if(_.isObject(response.data) && response.data.BoqStandardFk === qtoType.OnormQTO){
								service.isDisable = true;
							}else {
								service.isDisable = false;
							}
							defer.resolve(boqStructure[boqHeaderId]);
						}else {
							defer.reject('No data');
						}
					}, function(error) {
						defer.reject(error);
					});
					return defer.promise;
				}
			};
			service.createQtoAddressRange = function createQtoAddressRange(newItem) {
				let param = {};
				param.qtoHeaderFk = newItem.qtoHeaderFk;
				param.QtoAddressRangeDialogDto = newItem.QtoAddressRangeDialogDto;
				param.QtoAddressRangeImportDto = newItem.QtoAddressRangeImportDto;
				
				let dialogDetailService = $injector.get('qtoAddressRangeDialogDetailDataService');
				let importDetailService = $injector.get('qtoAddressRangeImportDetailDataService');
				
				let qtoAddressRangeDetailDtos = dialogDetailService.getItemsToSave();
				let item2Save = importDetailService.getItemsToSave();
			
				qtoAddressRangeDetailDtos = qtoAddressRangeDetailDtos.concat(item2Save);
				param.QtoAddressRangeDetailDtos = qtoAddressRangeDetailDtos;
				
				let item2Delete = dialogDetailService.getItemsToDelete();
				item2Delete = item2Delete.concat(importDetailService.getItemsToDelete());
				
				param.QtoAddressRangeDetailDto2Delete = item2Delete;
				param.QtoConfigDto =newItem.QtoConfigDto;
				
				return $http.post(globals.webApiBaseUrl + 'qto/main/header/saveQtoDocProperties', param);
			};
			
			service.showDialog = function showDialog(qtoHeader) {
				let param = {
					qtoHeaderFk: qtoHeader.Id
				};
				service.getBoqStructure();
				$http.post(globals.webApiBaseUrl + 'qto/main/header/getqtoHeaderDocProperties', param).then(function (res) {
					let qtoConfigData = res.data.QtoConfig;
					let details = res.data.QtoAddressRangeDetails;
					
					if(qtoConfigData) {
						let dialogDetail = _.filter(details, {'QtoAddressRangeFk': qtoConfigData.QtoAddressRangeDialogFk});
						let importDetail = _.filter(details, {'QtoAddressRangeFk': qtoConfigData.QtoAddressRangeImportFk});
						
						$injector.get('qtoAddressRangeDialogDetailDataService').setDataList(dialogDetail);
						$injector.get('qtoAddressRangeImportDetailDataService').setDataList(importDetail);
					}
					
					let initDataItem ={
						hasQtoDetal: qtoHeader.hasQtoDetal,
						qtoHeaderFk:qtoHeader.Id
					};
					initDataItem.QtoConfigDto = qtoConfigData;
					initDataItem.QtoAddressRangeDialogDto = res.data.qtoAddRessRangeDialog;
					initDataItem.QtoAddressRangeImportDto = res.data.qtoAddRessRangeImport;
					initDataItem.QtoAddressRangeDetailDtos = details;
					
					platformModalService.showDialog({
						headerTextKey: 'cloud.common.navDocumentProperties',
						dataItem: initDataItem,
						templateUrl: globals.appBaseUrl + 'qto.main/templates/qto-properties-modal.html',
						windowClass: 'docPropertiesModalWindow',
						backdrop: false,
						resizeable: true,
						width: '1000px'
					}).then(function (result) {
						if (result.ok) {
							result.data.qtoHeaderFk= qtoHeader.Id;
							service.createQtoAddressRange(result.data).then(function (response) {
								qtoMainDetailService.setSheetAreaList(response.data.qtoAddressRange);
								$injector.get('qtoMainStructureDataService').load();
							});
						}
					});
				});
			};
			
			return service;
			
		}]);

})();
