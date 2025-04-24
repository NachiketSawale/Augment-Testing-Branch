/**
 * Created by chi on 6/19/2018.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonUniqueFieldsProfileService', procurementPackageUniqueFieldsProfileService);

	procurementPackageUniqueFieldsProfileService.$inject = ['_', '$http', '$translate', 'globals', 'PlatformMessenger', 'platformModalService', 'platformPermissionService', 'permissions'];

	function procurementPackageUniqueFieldsProfileService(_, $http, $translate, globals, PlatformMessenger, platformModalService, platformPermissionService, permissions) {

		const serviceCache = {};

		return {
			getService: getService
		};

		function getService(identityName,title) {
			serviceCache['modalTitle'] = !_.isNil(title) ? $translate.instant(title) : $translate.instant('basics.common.uniqueFields.uniqueFielsDialogTitle');
			if (serviceCache[identityName]) {
				return serviceCache[identityName];
			} else {
				const newService = config(identityName);
				serviceCache[identityName] = newService;
				return newService;
			}
		}

		function config(identityName) {
			if (!identityName) {
				throw new Error('identityName is empty');
			}
			const service = {};
			const newProfileName = $translate.instant('basics.common.dialog.saveProfile.newProfileName');
			let data = [];
			let profileInDb = null;
			let defaultProfile = {
				Id: 0,
				IdentityName: identityName,
				ProfileName: newProfileName,
				ProfileAccessLevel: null,
				UniqueFields: []
			};
			let selectedItemDesc = null;
			let readonlyData = [];
			let mustSelectedData = [];
			let isBoq=false;

			service.load = load;
			service.save = save;
			service.saveAs = saveAs;
			service.delete = deleteProfile;
			service.getListForLookup = getListForLookup;
			service.getLookupItemByDescription = getLookupItemByDescription;
			service.selectItemChanged = new PlatformMessenger();
			service.setSelectedItemDesc = setSelectedItemDesc;
			service.getSelectedItem = getSelectedItem;
			service.updateItemList = updateItemList;
			service.canDeleteProfile = canDeleteProfile;
			service.isNewProfile = isNewProfile;
			service.showSaveProfileAsDialog = showSaveProfileAsDialog;
			service.updateFields = updateFields;
			service.reset = reset;
			service.getDescription = getDescription;
			service.getReadonlyData = getReadonlyData;
			service.setReadonlyData = setReadonlyData;
			service.getMustSelectedData = getMustSelectedData;
			service.setMustSelectedData = setMustSelectedData;
			service.updateDefaultFields = updateDefaultFields;
			service.hasSystemPermission = hasSystemPermission;
			service.setIsBoq=setIsBoq;
			service.getIsBoq=getIsBoq;
			service.getModalTitle = getModalTitle;
			return service;

			// ////////////////////////////
			function  setIsBoq(data) {
				isBoq=data;
			}
			function  getIsBoq() {
				return isBoq;
			}
			function load() {
				return $http.get(globals.webApiBaseUrl + 'basics/common/uniquefieldsprofile/get?identityName=' + identityName)
					.then(function (response) {
						profileInDb = response.data;
						data = [];
						data.push(angular.copy(defaultProfile));
						let i = 0, len = profileInDb.length;
						for (; i < len; ++i) {
							const profile = angular.copy(defaultProfile);
							profile.IdentityName = identityName;
							profile.ProfileName = profileInDb[i].ProfileName;
							profile.ProfileAccessLevel = profileInDb[i].ProfileAccessLevel;
							profile.Id = i + 1;
							const fieldsInDb = profileInDb[i].UniqueFields;
							const defaultFields = profile.UniqueFields;
							loopList(defaultFields, fieldsInDb);
							data.push(profile);
						}
						setSelectedItemDesc(newProfileName);
					});

				// ///////////////
				function loopList(defaultFields, fieldsInDb) {
					_.forEach(fieldsInDb, function (field) {
						const found = _.find(defaultFields, {model: field.model});
						if (found) {
							found.isSelect = field.isSelect;
							if (isBoq) {
								found.useAsBoQDescription = field.useAsBoQDescription;
							}

						}
					});
				}
			}

			function save(profile) {
				return saveAs(profile, profile.ProfileName, profile.ProfileAccessLevel);
			}

			function saveAs(profile, newName, newProfileAccessLevel) {
				validName(newName);

				let item = _.find(data, function (item) {
					return item.ProfileName === newName && item.ProfileAccessLevel === newProfileAccessLevel;
				});

				if (!item) {
					item = {};
					angular.copy(profile, item);
					item.ProfileName = newName;
					item.ProfileAccessLevel = newProfileAccessLevel;
				} else {
					item.UniqueFields = profile.UniqueFields;
				}

				return $http.post(globals.webApiBaseUrl + 'basics/common/uniquefieldsprofile/saveas', item)
					.then(function () {
						updateItemList(item);
						setSelectedItemDesc(getDescription(item));
					});
			}

			function deleteProfile() {
				const profile = getSelectedItem();
				if (!profile || isNewProfile(profile)) {
					return;
				}

				$http.post(globals.webApiBaseUrl + 'basics/common/uniquefieldsprofile/delete', profile)
					.then(function () {
						let i = 0, len = data.length;
						for (; i < len; ++i) {
							if (data[i].ProfileName === profile.ProfileName && data[i].ProfileAccessLevel === profile.ProfileAccessLevel) {
								data.splice(i, 1);
								break;
							}
						}
						setSelectedItemDesc(newProfileName);
					});
			}

			function getListForLookup() {

				const result = [];
				for (let i = 0; i < data.length; i++) {
					const item = data[i];
					const profileLookup = {
						id: item.Id,
						profileName: item.ProfileName,
						accessLevel: item.ProfileAccessLevel,
						description: getDescription(item)
					};
					result.push(profileLookup);
				}
				return result;
			}

			function getLookupItemByDescription(description) {

				let result = null;

				const list = getListForLookup();
				let i = 0, len = list.length;
				for (; i < len; i++) {
					if (list[i].description === description) {
						result = list[i];
						break;
					}
				}
				return result;
			}

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

			function getSelectedItem() {
				return _.find(data, function (item) {
					return getDescription(item) === selectedItemDesc;
				});
			}

			function validName(profileName) {
				if (!profileName || profileName.length === 0) {
					throw new Error('Name must not be empty!');
				}

				if (profileName === data[0].ProfileName) {
					throw new Error('Name not valid!');
				}
			}

			function updateItemList(item) {
				let i = 0, len = data.length;
				for (; i < len; ++i) {
					let dataItem = data[i];
					if (dataItem.ProfileName === item.ProfileName && dataItem.ProfileAccessLevel === item.ProfileAccessLevel) {
						dataItem = angular.copy(item);
						return;
					}
				}

				item.Id = data.length;
				data.push(item);
			}

			function isNewProfile(profile) {
				if (!profile) {
					return false;
				}
				return profile.ProfileName === defaultProfile.ProfileName;
			}

			function canDeleteProfile() {
				const profile = getSelectedItem();
				const result = (!(!profile || isNewProfile(profile)));
				const isSystemProfile = profile && 'System' === profile.ProfileAccessLevel;
				if (isSystemProfile) {
					return result && hasSystemPermission(permissions.delete);
				}
				return result;
			}

			function showSaveProfileAsDialog(profile) {
				const modalOptions = {
					headerText: $translate.instant('basics.common.dialog.saveProfile.saveUniqueFields'),
					areaLabelText: $translate.instant('basics.common.dialog.saveProfile.labelAccessLevel'),
					nameLabelText: $translate.instant('basics.common.dialog.saveProfile.labelProfileName'),
					bodyText: $translate.instant('basics.common.dialog.saveProfile.placeholderProfileName'),
					areaSystem: hasSystemPermission(permissions.create),    // todo: user.hasPermisson ? true : false
					value: {selectedArea: {}, textProfileName: ''}  // object that will be returned
				};

				platformModalService.showSaveProfileAsDialog(modalOptions).then(
					function (result) {
						if (!profile) {
							return;
						}

						saveAs(profile, result.value.textProfileName, result.value.selectedArea.description);
					}
				);
			}

			function hasSystemPermission(permission) {
				return platformPermissionService.has('9eaa7843becc49f1af5b4b11e8fa09ee', permission);
			}

			function updateFields(item, fields) {
				if (item) {
					item.UniqueFields = fields;
				}
			}

			function reset() {
				data = [];
				profileInDb = null;
				selectedItemDesc = null;
				defaultProfile = {
					Id: 0,
					IdentityName: identityName,
					ProfileName: newProfileName,
					ProfileAccessLevel: null,
					UniqueFields: []
				};
				serviceCache['modalTitle'] = null;
			}

			function getReadonlyData() {
				return angular.copy(readonlyData);
			}

			function setReadonlyData(readonly) {
				readonlyData = readonly;
			}

			function getMustSelectedData() {
				return angular.copy(mustSelectedData);
			}

			function setMustSelectedData(mustSelected) {
				mustSelectedData = mustSelected;
			}

			function updateDefaultFields(fields) {
				defaultProfile.UniqueFields = fields;
			}

			function getModalTitle(title) {
				return serviceCache[title];
			}
		}
	}
})(angular);
