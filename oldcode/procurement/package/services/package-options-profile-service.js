/**
 * Created by alm on 8/18/2022.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('packageOptionsProfileService', packageOptionsProfileService);

	packageOptionsProfileService.$inject = ['_', '$http', '$translate', 'globals', 'PlatformMessenger'];

	function packageOptionsProfileService(_, $http, $translate, globals, PlatformMessenger) {

		let service = {};
		let data = [];
		const newProfileName = $translate.instant('basics.common.dialog.saveProfile.newProfileName');
		const defaultType = 'material';
		let defaultProfile = {
			material: {
				Id: 0,
				ProfileName: newProfileName,
				ProfileAccessLevel: null,
				PropertyConfig: null,
				type: defaultType
			},
			boq: {
				Id: 0,
				ProfileName: newProfileName,
				ProfileAccessLevel: null,
				PropertyConfig: null,
				Type: 'boq'
			}
		};
		service.defaultType = defaultType;
		service.setSelectedItemDesc = setSelectedItemDesc;
		service.setSelectedItem = setSelectedItem;
		service.getDescription = getDescription;
		service.reset = reset;
		service.selectItemChanged = new PlatformMessenger();
		let selectedItemDesc = null;
		let selectedItem = null;
		service.load = function (type) {
			let endPoint = 'procurement/package/option/getprofile';
			if (!type) {
				type = defaultType;
			}
			endPoint = endPoint + '?type=' + type;
			return $http.get(globals.webApiBaseUrl + endPoint)
				.then(function (response) {
					let profileInDb = response.data;
					data = [];
					selectedItemDesc = null;
					selectedItem = null;
					data.push(angular.copy(defaultProfile[type]));
					let i = 0, len = profileInDb.length;
					let defaultShowProfile = null;
					for (; i < len; ++i) {
						let profile = angular.copy(defaultProfile[type]);
						profile.ProfileName = profileInDb[i].ProfileName;
						profile.ProfileAccessLevel = profileInDb[i].ProfileAccessLevel;
						profile.PropertyConfig = profileInDb[i].PropertyConfig;
						profile.Id = i + 1;
						profile.Type = type;
						if (profileInDb[i].IsDefault) {
							defaultShowProfile = profile;
						}
						data.push(profile);
					}
					let showProfile = defaultShowProfile ? defaultShowProfile : data[0];
					service.setDefaultProfile(showProfile);
					setSelectedItem(showProfile);
				});

		};

		service.getLookupItemByDescription = function (description) {
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

		service.delete = function (select, profileParentDataView) {
			let i = 0, len = data.length;
			for (; i < len; ++i) {
				if (data[i].ProfileName === select.ProfileName && data[i].ProfileAccessLevel === select.ProfileAccessLevel) {
					data.splice(i, 1);
					break;
				}
			}
			if (select.ProfileName === defaultProfile.ProfileName) {
				service.setDefaultProfile(initProfile);
			}
			if (select.ProfileName === selectedItem.ProfileName) {
				setSelectedItemDesc(defaultProfile.ProfileName);
				setSelectedItem(defaultProfile);
			}

			profileParentDataView.dataCache.isLoaded = false;
			profileParentDataView.loadData();
		};

		service.default = function (select) {
			let i = 0, len = data.length;
			for (; i < len; ++i) {
				if (data[i].ProfileAccessLevel === select.ProfileAccessLevel && data[i].ProfileName === select.ProfileName) {
					setSelectedItem(data[i]);
					setSelectedItemDesc(data[i].ProfileName);
					service.setDefaultProfile(data[i]);

					break;
				}
			}
		};

		service.setDefaultProfile = function (profile) {
			if (!profile) {
				return;
			}
			if (profile.Type) {
				defaultProfile[profile.Type] = profile;
			} else {
				defaultProfile[defaultType] = profile;
			}
		};

		service.getListForLookup = function () {
			let result = [];
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				if(!_.some(result,['Id',item.Id])) {
					let profileLookup = {
						Id: item.Id,
						ProfileName: item.ProfileName,
						ProfileAccessLevel: item.ProfileAccessLevel,
						Description: getDescription(item),
						PropertyConfig: item.PropertyConfig
					};
					result.push(profileLookup);
				}
			}
			return result;
		};

		service.getSelectedItem = function () {
			if (selectedItem && data.length > 0) {
				return _.find(data, {'Id': selectedItem.Id});
			} else {
				return null;
			}
		};

		function getDescription(profile) {
			if (!profile) {
				return null;
			}
			return profile.ProfileName + (profile.ProfileAccessLevel ? '(' + profile.ProfileAccessLevel + ')' : '');
		}

		function setSelectedItemDesc(description) {
			if (selectedItemDesc !== description) {
				selectedItemDesc = description;
				service.selectItemChanged.fire();
			}
		}

		function setSelectedItem(select) {
			if ((selectedItem && selectedItem.Id !== select.Id) || (!selectedItem && select)) {
				selectedItem = select;
				service.selectItemChanged.fire();
			}
		}

		service.updateList = function (profile) {
			if (data) {
				let findProfile = _.find(data, function (item) {
					return item.ProfileName === profile.ProfileName && item.ProfileAccessLevel === profile.ProfileAccessLevel;
				});

				if (findProfile) {
					profile.Id = findProfile.Id;
					data.splice(findProfile.Id, 1);
				} else {
					let maxId = _.maxBy(data, 'Id').Id;
					profile.Id = maxId + 1;
				}

				data.push(profile);
				data = _.sortBy(data, 'Id');
				return profile;
			}
		};

		service.saveProfile = function (param) {
			return $http.post(globals.webApiBaseUrl + 'procurement/package/option/saveprofile', param);
		};

		service.getProfile = function (type) {
			let endPoint = 'procurement/package/option/getprofile';
			if (type) {
				endPoint = endPoint + '?type=' + type;
			}
			return $http.get(globals.webApiBaseUrl + endPoint);
		};

		service.setDefault = function (param) {
			param.IsDefault = true;
			return $http.post(globals.webApiBaseUrl + 'procurement/package/option/setdefault', param);
		};

		service.deleteProfile = function (param) {
			return $http.post(globals.webApiBaseUrl + 'procurement/package/option/deleteProfile', param);
		};

		function reset() {
			data = [];
			selectedItemDesc = null;
			selectedItem = null;
		}

		return service;

	}
})(angular);
