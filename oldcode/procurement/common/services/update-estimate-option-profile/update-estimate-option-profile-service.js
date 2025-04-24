/**
 * Created by alm on 8/18/2022.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('updateEstimeCommonOptionProfileService', updateEstimeCommonOptionProfileService);

	updateEstimeCommonOptionProfileService.$inject = ['_', '$http', '$translate', 'globals', 'PlatformMessenger'];

	function updateEstimeCommonOptionProfileService(_, $http, $translate, globals, PlatformMessenger) {

		let service={};
		let data = [];
		let appId = '4afb28a52e2c4a5785b4ee8f64e2825c';
		let groupKey = 'procurement.common.updateEstimateOption';
		const newProfileName = $translate.instant('basics.common.dialog.saveProfile.newProfileName');
		let defaultProfile = {
			Id: 0,
			ProfileName: newProfileName,
			ProfileAccessLevel: null,
			PropertyConfig:null
		};
		let initProfile = {
			Id: 0,
			ProfileName: newProfileName,
			ProfileAccessLevel: null,
			PropertyConfig:null
		};
		service.setSelectedItem = setSelectedItem;
		service.getDescription=getDescription;
		service.setSelectedItemDesc=setSelectedItemDesc;
		service.selectItemChanged = new PlatformMessenger();
		let selectedItemDesc = null;
		let selectedItem= null;

		service.getProfile=function(param){
			return $http.get(globals.webApiBaseUrl + 'procurement/common/option/getprofile?groupKey=' + param.GroupKey + '&appId=' + param.AppId);
		};

		service.saveProfile=function(param){
			return $http.post(globals.webApiBaseUrl + 'procurement/common/option/saveprofile',param);
		};

		service.setDefault=function(param){
			param.IsDefault=true;
			return $http.post(globals.webApiBaseUrl + 'procurement/common/option/setdefault',param);
		};

		service.deleteProfile=function(param){
			return $http.post(globals.webApiBaseUrl + 'procurement/common/option/deleteProfile',param);
		};

		service.getListForLookup=function() {
			let result = [];
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				let profileLookup = {
					Id: item.Id,
					ProfileName: item.ProfileName,
					ProfileAccessLevel: item.ProfileAccessLevel,
					Description: getDescription(item),
					PropertyConfig:item.PropertyConfig
				};
				result.push(profileLookup);
			}
			return result;
		};

		service.getLookupItemByDescription = function(description){
			let result = null;
			const list = service.getListForLookup();
			let i = 0, len = list.length;
			for (; i < len; i++) {
				if (list[i].Description === description) {
					result = list[i];
					break;
				}
			}
			return result;
		};

		service.load=function(){
			let requestParam = {
				GroupKey: groupKey,
				AppId: appId
			};
			return service.getProfile(requestParam)
				.then(function (response) {
					let profileInDb = response.data;
					data = [];
					selectedItemDesc= null;
					selectedItem= null;
					data.push(angular.copy(initProfile));
					let i = 0, len = profileInDb.length;
					let defaultShowProfile=null;
					for (; i < len; ++i) {
						let profile = angular.copy(defaultProfile);
						profile.ProfileName = profileInDb[i].ProfileName;
						profile.ProfileAccessLevel = profileInDb[i].ProfileAccessLevel;
						profile.PropertyConfig=profileInDb[i].PropertyConfig;
						profile.Id = i + 1;
						if(profileInDb[i].IsDefault){
							defaultShowProfile=profile;
						}
						data.push(profile);
					}
					let showProfile=defaultShowProfile?defaultShowProfile:data[0];
					service.setDefaultProfile(showProfile);
					setSelectedItem(showProfile);
				});
		};

		function setSelectedItem(select){
			if ((selectedItem&&selectedItem.Id !== select.Id)||(!selectedItem&&select)) {
				selectedItem = select;
				service.selectItemChanged.fire();
			}
		}

		service.getSelectedItem = function getSelectedItem() {
			if(selectedItem&&data.length>0) {
				let findItem= _.find(data, {'Id': selectedItem.Id});
				return findItem;
			}
			else{
				return null;
			}
		};

		function getDescription(profile) {
			if (!profile) {
				return null;
			}
			return profile.ProfileName + (profile.ProfileAccessLevel ? '(' + profile.ProfileAccessLevel + ')' : '');
		}

		service.updateList=function(profile){
			if(data) {
				let findProfile = _.find(data,function (item) {
					return item.ProfileName === profile.ProfileName && item.ProfileAccessLevel === profile.ProfileAccessLevel;
				});

				if(findProfile){
					profile.Id = findProfile.Id;
					data.splice(findProfile.Id, 1);
				}else {
					let maxId = _.maxBy(data, 'Id').Id;
					profile.Id = maxId + 1;
				}

				data.push(profile);
				data = _.sortBy(data, 'Id');
				return profile;
			}
		};

		function setSelectedItemDesc(description) {
			if (selectedItemDesc !== description) {
				selectedItemDesc = description;
			}
		}

		service.delete=function(select, profileParentDataView){
			let i = 0, len = data.length;
			for (; i < len; ++i) {
				if (data[i].ProfileName === select.ProfileName&&data[i].ProfileAccessLevel === select.ProfileAccessLevel){
					data.splice(i, 1);
					break;
				}
			}
			if(select.ProfileName === defaultProfile.ProfileName){
				service.setDefaultProfile(initProfile);
			}
			if(select.ProfileName === selectedItem.ProfileName){
				setSelectedItemDesc(defaultProfile.ProfileName);
				setSelectedItem(defaultProfile);
			}

			profileParentDataView.dataCache.isLoaded = false;
			profileParentDataView.loadData();
		};

		service.default=function(select){
			let i = 0, len = data.length;
			for (; i < len; ++i) {
				if (data[i].ProfileAccessLevel === select.ProfileAccessLevel&&data[i].ProfileName === select.ProfileName) {
					setSelectedItem(data[i]);
					setSelectedItemDesc(data[i].ProfileName);
					service.setDefaultProfile(data[i]);
					break;
				}
			}
		};

		service.getSaveGroupKey = function getSaveGroupKey() {
			return groupKey;
		};

		service.getSaveAppId = function getSaveAppId() {
			return appId;
		};

		service.setDefaultProfile = function (profile) {
			defaultProfile = profile;
		};

		return service;

	}
})(angular);
