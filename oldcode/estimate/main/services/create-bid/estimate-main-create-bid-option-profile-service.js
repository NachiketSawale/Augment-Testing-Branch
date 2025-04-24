/**
 * Created by alm on 8/14/2023.
 */
(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimeMainCraeteBidOptionProfileService', estimeMainCraeteBidOptionProfileService);

	estimeMainCraeteBidOptionProfileService.$inject = ['_', '$http', '$translate', 'globals', 'PlatformMessenger', 'basicsLookupdataSimpleLookupService'];

	function estimeMainCraeteBidOptionProfileService(_, $http, $translate, globals, PlatformMessenger, basicsLookupdataSimpleLookupService) {

		let service={};
		let data = [];
		let appId = 'f460545abd4e42fcbd1165b8e2e7d65e';
		let groupKey = 'estimate.main.createBidOption';
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
			return $http.get(globals.webApiBaseUrl + 'basics/common/option/getprofile?groupKey=' + param.GroupKey + '&appId=' + param.AppId);
		};

		service.saveProfile=function(param){
			return $http.post(globals.webApiBaseUrl + 'basics/common/option/saveprofile',param);
		};

		service.setDefaults=function(params){
			return $http.post(globals.webApiBaseUrl + 'basics/common/option/setdefaults',params);
		};

		service.deleteProfile=function(param){
			return $http.post(globals.webApiBaseUrl + 'basics/common/option/deleteProfile',param);
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
					PropertyConfig:item.PropertyConfig,
					PropertyObject: item.PropertyObject,
					FilterCategoryName: item.FilterCategoryName
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

		service.load=function(ignoreDefaultSetting, filterType){
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
						profile.PropertyObject = profileInDb[i].PropertyConfig ? JSON.parse(profileInDb[i].PropertyConfig) : {};
						profile.Id = i + 1;
						if (profileInDb[i].IsDefault) {
							if(filterType && profile.PropertyObject && profile.PropertyObject.ExtendModel && profile.PropertyObject.ExtendModel.FilterType === filterType) {
								defaultShowProfile = profile;
							}
						}
						if(profile.PropertyObject){
							profile.FilterCategoryName = service.getFilterCategoryName(profile.PropertyObject);
						}
						data.push(profile);
					}
					if(!ignoreDefaultSetting){
						let showProfile=defaultShowProfile?defaultShowProfile:data[0];
						service.setDefaultProfile(showProfile);
						return showProfile;
						// setSelectedItem(showProfile);
					}
					return null;
				});
		};

		function setSelectedItem(select, actionByManually){
			if ((selectedItem&&selectedItem.Id !== select.Id)||(!selectedItem&&select)) {
				selectedItem = select;
				service.selectItemChanged.fire(actionByManually);
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

		let filterCategories = [];
		service.getFilterCategories = function getFilterCategories() {
			filterCategories = [];
			let types = basicsLookupdataSimpleLookupService.getListSync({
				lookupModuleQualifier: 'basics.customize.bidtype'
			});

			_.forEach(types, function (item) {
				filterCategories.push({
					Id: item.Id,
					Description: $translate.instant('sales.bid.entityBidTypeFk') + ': ' + item.Description
				});
			});

			return filterCategories;
		};

		service.getFilterCategoryName = function (Property){

			if(!Property || !Property.ExtendModel || !Property.ExtendModel.FilterType){
				return $translate.instant('basics.common.dialog.saveProfile.noFilterCategory');
			}

			let category = _.find(service.getFilterCategories(), function (item) {
				return item.Id === Property.ExtendModel.FilterType-0;
			});

			if(category){
				return category.Description;
			}else{
				return $translate.instant('basics.common.dialog.saveProfile.noFilterCategory');
			}
		};

		return service;

	}
})(angular);
