/**
 * Created by reimer on 13.08.2015.
 */

(function (angular) {

	/* global globals */
	'use strict';

	var moduleName = 'basics.import';

	/**
     * @ngdoc service
     * @name
	  * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('basicsImportProfileService', ['$q', '$http', '$translate', '$injector', 'platformDialogService', 'permissions', 'platformPermissionService',

		function ($q, $http, $translate, $injector, platformDialogService, permissions, platformPermissionService) {

			var service = {};

			var _moduleName = null;
			var _data = [];               // cached profile list
			var _selectedId = -1;         // currently selected profile
			var _profileInDb = [];
			var _fieldsAlwaysUseDefault = [];
			// object represents the new profile item in the combobox
			var _newProfile = {
				id: 0,
				ProfileName: 'New Profile',
				File2Import: '',
				ImportFormat: 3,  // excel
				ExcelSheetName: '',
				ImportType: 1,//this property use material import
				ImportDescriptor: {}
			};

			var _defaultProfile = {};

			//var _customSettings = {};

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.setImportOptions = function (importOptions) {
				_moduleName = importOptions.ModuleName;
				// #140838 configure the fields not shown in UI, always get value from frontend default profile not server profile.
				_fieldsAlwaysUseDefault = importOptions.FieldsAlwaysUseDefault;
				_defaultProfile = angular.copy(_newProfile);
				angular.extend(_defaultProfile, importOptions);
				// field array needs unique id for using with grid!
				angular.forEach(_defaultProfile.ImportDescriptor.Fields, function (field, key) {
					field.Id = key;
				});
			};

			service.seletedItemChanged = new Platform.Messenger();

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.setSelectedId = function (id) {

				if (_selectedId !== id) {
					_selectedId = id;
					service.seletedItemChanged.fire();
				}

			};

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.getSelectedItem = function () {
				if (_selectedId === -1) {
					return null;
				}
				else {
					// _data[_selectedId].ImportDescriptor.CustomSettings = service.getCustomSettings();
					return _data[_selectedId];
				}
			};

			// service.setCustomSettings = function(customEntity) {
			// 	_customSettings = customEntity;
			// };
			//
			// service.getCustomSettings = function() {
			// 	return _customSettings;
			// };

			// region save

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.save = function (profile) {

				// return service.saveAs(profile, profile.ProfileName, profile.ProfileAccessLevel);
				return saveProfile(profile);
			};

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.saveAs = function (profile, newName, newProfileAccessLevel) {

				var newProfile = {};
				angular.copy(profile, newProfile);
				newProfile.id = 0;
				newProfile.ProfileName = newName;
				newProfile.ProfileAccessLevel = newProfileAccessLevel;
				return saveProfile(newProfile);

			};

			var saveProfile = function (profile) {

				// validate profile name
				if (!profile.ProfileName || profile.ProfileName.length === 0) {
					throw new Error('Name must not be empty!');
				}

				if (profile.ProfileName === _data[0].ProfileName) {
					throw new Error('Name not valid!');
				}

				// ensure uniqe name for new profiles
				var lookupProfile = _.find(_data, function (item) {
					return item.ProfileName === profile.ProfileName && item.id !== profile.id;
				});
				if (lookupProfile) {
					throw new Error('Profile name already exists!');
				}

				return ($http.post(globals.webApiBaseUrl + 'basics/import/profile/saveas', profile)
					.then(function () {
						if (service.isNewProfile(profile)) {
							profile.id = _data.length;
							_data.push(profile);
						}
						else  // update data list
						{
							for (var i = 0, len = _data.length; i < len; i++) {
								if (_data[i].id === profile.id) {
									_data[i] = profile;
									return;
								}
							}
						}
						service.setSelectedId(profile.id);
					})
				);
			};

			service.showSaveProfileAsDialog = function (profile) {
				const modalOptions = {
					headerText: $translate.instant('basics.import.header.saveImportDefinition'),
					areaLabelText: $translate.instant('basics.common.dialog.saveProfile.labelAccessLevel'),
					nameLabelText: $translate.instant('basics.common.dialog.saveProfile.labelProfileName'),
					bodyText: $translate.instant('basics.common.dialog.saveProfile.placeholderProfileName'),
					areaSystem: service.hasSystemPermission(permissions.create),    // todo: user.hasPermisson ? true : false
					value: {selectedArea: {}, textProfileName: ''}  // object that will be returned
				};

				platformDialogService.showSaveProfileAsDialog(modalOptions).then(
					function (result) {
						//var selectedItem = service.getSelectedItem();
						service.saveAs(profile, result.value.textProfileName, result.value.selectedArea.description);
					}
				);
			};

			service.hasSystemPermission = function (permission) {
				return platformPermissionService.has('9eaa7843becc49f1af5b4b11e8fa09ee', permission);
			};
			service.loadPermissions = function () {
				var accessRightDescriptors = ['9eaa7843becc49f1af5b4b11e8fa09ee'];
				return platformPermissionService.loadPermissions(accessRightDescriptors);
			};

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.deleteSelectedItem = function () {

				var profile = service.getSelectedItem();
				if (profile === null || service.isNewProfile(profile)) {
					return;
				}

				$http.post(globals.webApiBaseUrl + 'basics/import/profile/delete', profile)
					.then(function () {
						for (var i = 0, len = _data.length; i < len; i++) {
							if (_data[i].ProfileName === profile.ProfileName) {
								_data.splice(i, 1);
								break;
							}
						}
						service.setSelectedId(0);  // new Profile
					});
			};

			// endregion

			// region items handling

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.loadData = function () {

				return ($http.get(globals.webApiBaseUrl + 'basics/import/profile/list?moduleName=' + _moduleName)
					.then(function (response) {
						_profileInDb = response.data;
						_data = [];
						_defaultProfile.ModuleName = _moduleName;
						_data.push(angular.copy(_defaultProfile));   // add "new importdefinition" item
						for (var i = 0, len = response.data.length; i < len; i++) {
							var defaultImportType=_defaultProfile.ImportType;
							var newProfile = angular.copy(_defaultProfile);
							var newProfileFields=angular.copy(newProfile.ImportDescriptor);
							// merge values from loaded profile
							//angular.extend(newProfile, response.data[i]); // angular.extend does remove props. when only exists on soure?
							if (_fieldsAlwaysUseDefault && _fieldsAlwaysUseDefault.length) {
								var newFields = _.keyBy(newProfile.ImportDescriptor.Fields, 'PropertyName');
								var resFields = _.keyBy(response.data[i].ImportDescriptor.Fields, 'PropertyName');
								_.mergeWith(newFields, resFields, function (objValue, srcValue, key) {
									if (_.includes(_fieldsAlwaysUseDefault, key)) {
										return objValue;
									}
								});
								response.data[i].ImportDescriptor.Fields = _.values(newFields);
							}
							_.merge(newProfile, response.data[i]);

							//solve array merge will lost fields
							if(defaultImportType===response.data[i].ImportType) {
								var profileFields = response.data[i].ImportDescriptor;
								if (newProfileFields && profileFields) {
									newProfile.ImportDescriptor = _.mergeWith(newProfileFields, profileFields, function (objValue, srcValue) {
										if (_.isArray(objValue) && (_.some(objValue, 'PropertyName') || _.some(srcValue, 'PropertyName'))) {
											var org = _.keyBy(objValue, 'PropertyName');
											var src = _.keyBy(srcValue, 'PropertyName');
											return _.values(_.merge(org, src));
										}
									});
								}
							}
							else{
								newProfile.ImportDescriptor=response.data[i].ImportDescriptor;
							}

							if (newProfile.ImportDescriptor) {
								newProfile.ImportDescriptor.MainId = _defaultProfile.ImportDescriptor.MainId;
								newProfile.ImportDescriptor.SubMainId = _defaultProfile.ImportDescriptor.SubMainId;
							}

							newProfile.id = i + 1;
							_data.push(newProfile);
						}

						service.setSelectedId(0);  // default: select new object item
					})
				);
			};

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.getList = function () {
				return _data;
			};

			// sets all profiles to the same filename
			service.setFileInfo = function (fileInfo) {

				for (var i = 0, len = _data.length; i < len; i++) {
					_data[i].File2Import = fileInfo.name;
					_data[i].FileSize = fileInfo.size;
				}
			};

			// endregion

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.getItemByProfileName = function (value) {

				if (!_data || _data.length === 0) {
					return null;
				}

				var item = _data[0]; // default: new record
				for (var i = 0; i < _data.length; i++) {
					if (_data[i].ProfileName === value) {
						item = _data[i];
						break;
					}
				}
				return item;
			};

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.isNewProfile = function (profile) {
				return profile.id === 0;
			};

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.canDeleteSelectedItem = function () {
				var profile = service.getSelectedItem();
				var isSystemProfile =  profile&&'System' === profile.ProfileAccessLevel;
				var result = profile !== null && !service.isNewProfile(profile);
				if (isSystemProfile) {
					return result && service.hasSystemPermission(permissions.delete);
				}
				return result;
			};

			// region combo box lookup

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.getListForLookup = function () {

				var result = [];
				for (var i = 0; i < _data.length; i++) {
					result.push({
						id: _data[i].id,
						description: _data[i].ProfileName,
						importType: _data[i].ImportType,
						ProfileAccessLevel: _data[i].ProfileAccessLevel
					});
				}
				return result;
			};

			//service.getLookupItemByKey = function (id) {
			//
			//	var result = null;
			//
			//	var list = service.getListForLookup();
			//	for (var i = 0; i < list.length; i++) {
			//		if (list[i].id === id) {
			//			result = list[i];
			//			break;
			//		}
			//	}
			//	return result;
			//}

			/**
             * @ngdoc
             * @name
             * @function
             *
             * @description
             *
             */
			service.getLookupItemByDescription = function (description) {

				var result = null;

				var list = service.getListForLookup();
				for (var i = 0; i < list.length; i++) {
					if (list[i].description === description) {
						result = list[i];
						break;
					}
				}
				return result;
			};

			// endregion

			service.getDbProfileByName = function getDbProfileByName(profileName) {
				if (_profileInDb.length === 0) {
					return null;
				}
				return _.find(_profileInDb, function (item) {
					return item.ProfileName === profileName;
				});
			};

			return service;

		}]);
})(angular);

