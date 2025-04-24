(function (angular) {

	'use strict';
	var module = 'project.main';
	angular.module(module).service('projectMainMapService', ['globals', '_', 'platformUtilService', 'projectMainService', 'platformMultiAddressService', '$q', '$http',
		function (globals, _, platformUtilService, projectMainService, multiAddressService, $q, $http) {
			var self = this;

			function getProjectAddressMap(projectList, bpList) {
				if (!_.isEmpty(projectList)) {
					let valuesArray = [];
					var projectAddressMap = new Map();
					_.each(projectList, function (prj) {
						if(projectAddressMap){
							valuesArray = Array.from(projectAddressMap.values());
						}
						if (!_.isNil(prj.AddressFk)) {
							projectAddressMap.set(prj.Id, prj.AddressFk);
						}
						else if(!_.isNil(prj.BusinessPartnerFk)){
							let businessPartner = _.find(bpList, function (bp){
								return prj.BusinessPartnerFk === bp.Id;
							});
							if(businessPartner && businessPartner.SubsidiaryDescriptor && !valuesArray.includes(businessPartner.SubsidiaryDescriptor.AddressFk)){
								projectAddressMap.set(prj.Id, businessPartner.SubsidiaryDescriptor.AddressFk);
							}
						}
					});
					return projectAddressMap;
				}
			}

			function createFormatter() {
				const lineSep = '<br>';
				function getLine(infoObject, field) {
					const value = _.get(infoObject, field);
					return value ? (value + lineSep) : '';
				}

				return function (infoObject) {
					let formattedString = getLine(infoObject, 'ProjectNo');
					formattedString += getLine(infoObject, 'ProjectName');
					formattedString += getLine(infoObject, 'ProjectName2');
					formattedString += getLine(infoObject, 'BusinessPartnerName1');
					if(!_.isEmpty(infoObject.AddressEntity)){
						formattedString += getLine(infoObject, 'AddressEntity.Address');
					}
					else{
						formattedString += getLine(infoObject, 'SubsidiaryDescriptor.AddressDto.AddressLine');
					}
					formattedString += getLine(infoObject, 'SubsidiaryDescriptor.TelephoneNumber1Dto.Telephone');
					return platformUtilService.getSanitized(formattedString);  // fixed xss attack
				};
			}

			function createMapInfo(projectAddressMap, addresses, businessPartners) {
				let mapInfoObjectlist = [];
				projectAddressMap.forEach(function (AddressFk, projektId) {
					var project = projectMainService.getItemById(projektId);
					var infoObject = {};
					var address = _.find(addresses, function (adr) {
						return adr.id === AddressFk;
					});
					var businessPartner = _.find(businessPartners, function (bp) {
						return _.isNil(project.AddressFk) && project.BusinessPartnerFk === bp.Id;
					});
					infoObject = angular.extend(infoObject, address, businessPartner, project);
					infoObject.formatter = createFormatter();
					mapInfoObjectlist.push(infoObject);
				});
				return mapInfoObjectlist;
			}

			function getAddressesIds(projectAddressMap) {
				if (projectAddressMap && projectAddressMap.size) {
					var ids = [];
					projectAddressMap.forEach(function (AddressFk) {
						ids.push(AddressFk);
					});
					return ids;
				}
			}

			function getAddresses(map, businessPartnerList){
				if (map) {
					let addressIds = getAddressesIds(map);
					// clear
					multiAddressService.setAddressEntities([], module);
					if (!_.isEmpty(addressIds)) {
						$http.post(globals.webApiBaseUrl + 'basics/common/address/getaddressesbyid', addressIds).then(function (result) {
							multiAddressService.setAddressEntities(createMapInfo(map, result.data, businessPartnerList), module);
						});
					}
				}
			}

			function setAddresses() {
				let map = new Map();
				let businessPartnerIdList = [];
				var projectList = projectMainService.getList();
				if (!_.isEmpty(projectList)) {
					_.each(projectList, function (prj){
						if (!_.isNil(prj.BusinessPartnerFk)) {
							businessPartnerIdList.push(prj.BusinessPartnerFk);
						}
					});
					if (!_.isEmpty(businessPartnerIdList)) {
						$http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/listbp', {
							'filter': '',
							'Pattern': null,
							'PageSize': 100,
							'PageNumber': 0,
							'UseCurrentClient': null,
							'IncludeNonActiveItems': true,
							'ProjectContextId': null,
							//'ExecutionHints': false,
							'PKeys': businessPartnerIdList
						}).then(function (result) {
							map = getProjectAddressMap(projectList, result.data.Main);
							getAddresses(map, result.data.Main);
						});
					}
					else{
						map = getProjectAddressMap(projectList);
						getAddresses(map);
					}
				}
			}

			self.setAddresses = setAddresses;

			projectMainService.registerListLoaded(setAddresses);
		}
	]);
})(angular);
