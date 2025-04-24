/**
 * Created by joshi on 07.08.2014.
 */
(function () {
	/* global globals, Platform */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boq.main.service:boqMainDocPropertiesService
	 * @function
	 *
	 * @description
	 * boqMainDocPropertiesService is the data service for  Document Properties functions.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module('boq.main').factory('boqMainDocPropertiesService', ['$q', '$http', '$log', 'platformDialogService', 'boqMainBoqTypeService', 'boqMainBoqLineTypeService', 'boqMainStructureDetailDataType', 'boqMainStructureDetailsTypeService', 'boqMainCommonService', '$translate', 'boqMainLineTypes', 'boqMainCatalogAssignDetailsService', '$injector', '_', 'boqDocPropertiesControllerConfig',
		function ($q, $http, $log, platformDialogService, boqMainBoqTypeService, boqMainBoqLineTypeService, boqMainStructureDetailDataType, boqMainStructureDetailsTypeService, boqMainCommonService, $translate, boqMainLineTypes, boqMainCatalogAssignDetailsService, $injector, _, boqDocPropertiesControllerConfig) {

			var service = {};
			var selectedBoqHeaderFk = -1;
			var hBoqTypeFk = -1;
			var boqTypeFk = -1;
			var boqCatAssignConfTypeId = -1;
			var boqRoundingConfigId = -1;
			var modifiedDocProperties = {};
			var currentStructure = {};
			var modifiedBoqHeaderId = 0;
			var isDefaultStr = true;
			var isDefaultCatAssign = true;
			var modifiedStructureDetails = [];
			var boqTypeList = [];
			var boqLineType = [];
			var strDetailData = [];
			var deleteStrDetail = [];
			var currentStrDetail = {};
			var previousTypeFk = 0;
			var newBoqMask = '';
			var boqRootItem = {};
			var isNewStrCreated = false;
			var boqStructureIsAlreadyInUse = false;
			var boqMainServiceIsReadOnly = false;
			var updBoqCatAssignConf = {};
			var renumberMode = false;
			var currentProjectId = -1;
			var versionBoqsDetermined = false;
			var doesHaveMultipleVersionBoqs = false;
			var makeBoqTypeEditable = false;

			var flag = false;
			service.cancelCount = 0;
			service.editStructureChanged = new Platform.Messenger();
			service.updatedStructure = new Platform.Messenger();
			service.structureDetailsChanged = new Platform.Messenger();
			service.selectedStrDetailChanged = new Platform.Messenger();
			service.setAllowedDiscount = new Platform.Messenger();
			service.boqPropertiesSaved = new Platform.Messenger();

			var selectedDocProperties = {};

			var getBoqStructure = function (id) {
				return $http.get(globals.webApiBaseUrl + 'boq/main/type/getboqstructure?boqStructureId=' + id);
			};
			var createDefaultBoqStructure = function () {
				return $http.get(globals.webApiBaseUrl + 'boq/main/type/createdefaultboqstructure');
			};
			service.getStructureDetails = function getStructureDetails(id) {
				return $http.get(globals.webApiBaseUrl + 'boq/main/type/getboqstructuredetails?boqStructureId=' + id);
			};
			var getBoqHeader = function (id) {
				return $http.get(globals.webApiBaseUrl + 'boq/main/header/getboqheader?boqHeaderId=' + id);
			};
			var createItem = function () {
				return $http.get(globals.webApiBaseUrl + 'boq/main/type/createstructuredetail');
			};
			var getBoqRoundingConfig = function (id) {
				return $http.get(globals.webApiBaseUrl + 'boq/main/type/getboqroundingconfigbyid?id=' + id);
			};
			boqMainBoqLineTypeService.loadData().then(function () {
				boqLineType = boqMainBoqLineTypeService.getList();
			});

			var setFlag = function setFlag(val, isModified) {
				service.setEditVal(val, isModified);
			};
			var setBoqMask = function(strDetails) {
				if (boqMainCommonService.isFreeBoqType(currentStructure) || !currentStructure.EnforceStructure) {
					newBoqMask = '';
				}
				else if (strDetails && strDetails.length > 0) {
					newBoqMask = '';
					var position = '';
					var index = '';
					angular.forEach(strDetails, function (strItem) {
						// position?
						if (strItem.BoqLineTypeFk === 0) {
							for (var i = 0; i < strItem.LengthReference; i++) {
								position = 'P' + position;
							}
						}
						// index?
						if (strItem.BoqLineTypeFk === 10) {
							for (var j = 0; j < strItem.LengthReference; j++) {
								index = 'I' + index;
							}
						}
					});
					angular.forEach(strDetails, function (strItem) {
						// level 1-10?
						if (strItem.BoqLineTypeFk > 0 && strItem.BoqLineTypeFk < 10) {
							for (var i = 0; i < strItem.LengthReference; i++) {
								newBoqMask = newBoqMask + strItem.BoqLineTypeFk;
							}
						}
					});
					newBoqMask = newBoqMask + position + index;
				}
			};

			var getBoqMask = function (strDetails) {
				setBoqMask(strDetails);
				return newBoqMask;
			};

			// function to get structure and structure details
			service.getPropertiesById = function (typeFk, boqStructureFk, isModified) {
				boqTypeFk = typeFk;

				selectedDocProperties.BoqTypeId = typeFk;

				service.resetModifiedProperties();
				if (boqStructureFk === 0) {
					// This is the special case when a boq type was created without having a corresponding boq structure
					// What do we do ?
					// -> We create a default
					return createDefaultBoqStructure().then(function (response) {
						currentStructure = response.data;
						isNewStrCreated = true; // Signal we have a new boq structure created.
						service.setSelectedDocProperties(currentStructure, []);
						selectedDocProperties.StructureDetails = currentStructure.BoqStructureDetailEntities;
						selectedDocProperties.BoqRoundingConfig = currentStructure.BoqRoundingConfig;
						strDetailData = currentStructure.BoqStructureDetailEntities;
						selectedDocProperties.Boqmask = getBoqMask(response.data);
						selectedDocProperties.OenBoqStructureId   = currentStructure.Id;
						selectedDocProperties.OriginBoqStandardFk = currentStructure.BoqStandardFk;
						setFlag(flag, isModified);
						service.updatedStructure.fire();
						service.editStructureChanged.fire(versionBoqsDetermined, makeBoqTypeEditable);
					});
				} else {
					// Do the normal load
					return getBoqStructure(boqStructureFk).then(function (response) {
						currentStructure = response.data;
						service.setSelectedDocProperties(currentStructure, []);
						let isCrbOrOenorm = boqMainCommonService.isCrbBoqType(currentStructure) || boqMainCommonService.isOenBoqType(currentStructure);
						selectedDocProperties.OenBoqStructureId   = currentStructure.Id;
						selectedDocProperties.OriginBoqStandardFk = currentStructure.BoqStandardFk;
						flag = flag && !isCrbOrOenorm;
						setFlag(flag, isModified);

						var loadStructureDetail = service.getStructureDetails(boqStructureFk).then(function (response) {
							selectedDocProperties.StructureDetails = response.data;
							selectedDocProperties.Boqmask = getBoqMask(response.data);
							strDetailData = response.data;
						});

						boqCatAssignConfTypeId = currentStructure.BoqCatAssignConfTypeFk;
						var loadCatalogAssignments = service.getCatalogAssignById(currentStructure.BoqCatAssignConfTypeFk, currentStructure.BoqCatAssignFk);

						boqRoundingConfigId = currentStructure.BoqRoundingConfigFk;
						var loadBoqRoundingConfig = getBoqRoundingConfig(boqRoundingConfigId).then(function (response) {
							selectedDocProperties.BoqRoundingConfig = response.data;
						});

						return $q.all([loadStructureDetail, loadCatalogAssignments, loadBoqRoundingConfig]).then(function() {
							service.updatedStructure.fire();
							service.editStructureChanged.fire(versionBoqsDetermined, makeBoqTypeEditable);
						});
					});
				}

			};
			var setBoqCatalogConfigProperties = function setBoqCatalogConfigProperties(catConfTypeId, boqCatalogAssignFk, readonly) {
				selectedDocProperties.boqCatAssignConfTypeId = catConfTypeId;
				selectedDocProperties.boqCatAssignTypeId = catConfTypeId;   // todo: same as boqCatAssignConfTypeId?
				selectedDocProperties.editBoqCatalogConfigType = angular.isDefined(readonly) ? !readonly : (!catConfTypeId && !!boqCatalogAssignFk);
				selectedDocProperties.boqCatalogAssignDesc = (updBoqCatAssignConf && updBoqCatAssignConf.DescriptionInfo) ? updBoqCatAssignConf.DescriptionInfo.Description : '';

				boqMainCatalogAssignDetailsService.setPropertiesReadOnly(!selectedDocProperties.editBoqCatalogConfigType);
				// fire boq catalog config loaded event and copy properties into currentItem
				boqMainCatalogAssignDetailsService.editCatalogChanged.fire();
			};

			service.getCatalogAssignById = function getCatalogAssignById(catConfTypeId, boqCatalogAssignFk, readonly) {
				boqCatAssignConfTypeId = catConfTypeId;
				if ((boqCatalogAssignFk && boqCatalogAssignFk > 0) || boqCatalogAssignFk === 0) {
					return boqMainCatalogAssignDetailsService.getCatalogAssignDetails(boqCatalogAssignFk, catConfTypeId, readonly).then(function (responsedata) {
						selectedDocProperties.CatalogAssignDetails = responsedata.catAssignDetailList;
						// catAssignConf
						updBoqCatAssignConf = responsedata.catAssignConf;
						if (boqCatalogAssignFk === 0) {
							updBoqCatAssignConf.Version = 0;
						}
						setBoqCatalogConfigProperties(catConfTypeId, boqCatalogAssignFk, readonly);
					});
				} else {
					selectedDocProperties.CatalogAssignDetails = null;
					updBoqCatAssignConf = null;
					boqMainCatalogAssignDetailsService.clearData();
					setBoqCatalogConfigProperties(catConfTypeId, boqCatalogAssignFk, readonly);
				}

				$q.when(null);
			};

			var initPropForm = function () {
				return boqMainBoqTypeService.loadData(true).then(function () {
					boqTypeList = boqMainBoqTypeService.getBoqType();
					isDefaultStr = selectedBoqHeaderFk <= 0;
					return getBoqHeader(selectedBoqHeaderFk).then(function (response) {
						hBoqTypeFk = response.data.BoqTypeFk;
						var hBoqStructureFk = response.data.BoqStructureFk;
						boqTypeFk = hBoqTypeFk;
						previousTypeFk = hBoqTypeFk;
						flag = angular.isUndefined(hBoqTypeFk) || (hBoqTypeFk === null) || (hBoqTypeFk === 0);
						selectedDocProperties.IsChecked = flag;
						isNewStrCreated = false;
						deleteStrDetail = [];

						return service.getPropertiesById(hBoqTypeFk, hBoqStructureFk, false);
					});
				});
			};

			service.setPreviousTypeId = function (id) {
				previousTypeFk = id;
			};

			service.getPreviousFk = function () {
				return previousTypeFk;
			};

			service.resetModifiedProperties = function resetModifiedProperties() {
				modifiedDocProperties = {};
				modifiedBoqHeaderId = 0;
				modifiedStructureDetails = [];
				deleteStrDetail = [];
				isDefaultCatAssign = true;
			};

			service.hasModifications = function hasModifications() {
				return !_.isEmpty(modifiedDocProperties) || !_.isEmpty(modifiedStructureDetails) || modifiedBoqHeaderId > 0;
			};

			service.getSelectedBoqHeader = function getSelectedBoqHeader() {
				return selectedBoqHeaderFk;
			};

			service.saveDocumentProperties = function () {

				var defer = $q.defer();

				var deleteBoqCatAssignDetails = boqMainCatalogAssignDetailsService.getItemsToDelete();
				var boqCatAssignDetails = boqMainCatalogAssignDetailsService.getList();

				var currentMode = 'default';
				currentMode = boqMainCatalogAssignDetailsService.getDialogMode();
				var postData = {};

				if (modifiedDocProperties && modifiedStructureDetails && modifiedBoqHeaderId && currentMode === 'default') {
					let modBoqHeaderId =  _.isNumber(modifiedBoqHeaderId) ? modifiedBoqHeaderId : -1;
					let isDefCatAssign = _.isBoolean(isDefaultCatAssign) ? isDefaultCatAssign : false;

					postData = {
						'boqTypeId': _.isNumber(boqTypeFk) ? boqTypeFk : 0,
						'isDefaultStructure': _.isBoolean(isDefaultStr) ? isDefaultStr : false,
						'boqHeaderId':  modBoqHeaderId,
						'boqStructureDetails': modifiedStructureDetails,
						'updBoqStructure': _.isEmpty(modifiedDocProperties) ? null : modifiedDocProperties, // Now it's also possible to save structure details without modified document porperties
						'deleteStrDetails': deleteStrDetail,
						'boqCatAssignConfTypeId': _.isNumber(boqCatAssignConfTypeId) ? boqCatAssignConfTypeId : -1,
						'isDefaultCatAssign': isDefCatAssign,
						'updBoqCatAssignConf': updBoqCatAssignConf,
						'boqCatAssignDetails': modBoqHeaderId >= 0 ? boqCatAssignDetails : [],
						'deleteBoqCatAssignDetails': deleteBoqCatAssignDetails,
						'projectId': _.isNumber(currentProjectId) ? currentProjectId : -1
					};

					$http.post(globals.webApiBaseUrl + 'boq/main/type/updateboqstructuredef', postData).then(function (response) {
						var updatedDocProperties = [];
						var updatedStructureDetails = [];

						if (response.data && response.data.errorMessage) {
							platformDialogService.showDialog({iconClass:'info', headerText$tr$:'cloud.common.infoBoxHeader', bodyText:response.data.errorMessage });
						}

						// the version property will have changed according to a successful update.
						if (response.data.updBoqStructure && response.data.boqStructureDetails && response.data.boqHeaderId) {

							updatedDocProperties = response.data.updBoqStructure;
							updatedStructureDetails = response.data.boqStructureDetails;
							currentStructure = response.data.updBoqStructure;
						}
						service.setSelectedDocProperties(updatedDocProperties, updatedStructureDetails);
						previousTypeFk = response.data.boqTypeId;
						service.boqPropertiesSaved.fire(null, response.data);
						service.resetModifiedProperties();

						defer.resolve(selectedDocProperties); // Deliver saved data to reolved promise
					}, function () {
						defer.reject(); // An error has occured
					});
				} else if (currentMode === 'boqcatalog') {
					postData = {
						'boqCatAssignConfTypeId': boqCatAssignConfTypeId,
						'isDefaultCatAssign': isDefaultCatAssign,
						'updBoqCatAssignConf': updBoqCatAssignConf,
						'boqCatAssignDetails': boqCatAssignDetails,
						'deleteBoqCatAssignDetails': deleteBoqCatAssignDetails
					};
					$http.post(globals.webApiBaseUrl + 'boq/main/type/updateboqstructuredef', postData).then(function (response) {
						service.boqPropertiesSaved.fire(null, response.data);
						service.resetModifiedProperties();
						defer.resolve(selectedDocProperties); // Deliver saved data to reolved promise
					}, function () {
						defer.reject(); // An error has occured
					});
				} else {
					defer.resolve(null); // No data delivered to resolve, because nothing has been saved.
				}

				return defer.promise;
			};

			service.setModifiedDocProperties = function (prop) {
				if (prop.editBoqCatalogConfigType) {
					isDefaultCatAssign = false;
					if (updBoqCatAssignConf && updBoqCatAssignConf.DescriptionInfo) {
						updBoqCatAssignConf.DescriptionInfo.Description = prop.boqCatalogAssignDesc;
						updBoqCatAssignConf.DescriptionInfo.Translated = prop.boqCatalogAssignDesc;
						updBoqCatAssignConf.DescriptionInfo.Modified = true;
					}
				}
				else {
					// Adjust isDefaultCatAssign accordingly
					isDefaultCatAssign = typeof prop.boqCatAssignTypeId === 'number' && prop.boqCatAssignTypeId >= 0;
				}

				boqCatAssignConfTypeId = prop.boqCatAssignTypeId;

				if (prop.IsChecked) {
					isDefaultStr = false;
					modifiedDocProperties = prop;
					modifiedStructureDetails = prop.StructureDetails;
					modifiedDocProperties.Boqmask = getBoqMask(modifiedStructureDetails);
					modifiedBoqHeaderId = selectedBoqHeaderFk;
					if (isNewStrCreated) {
						modifiedDocProperties.Version = 0;

						// If we create a new boq structure definition we ignore the already marked as deleted structure details.
						deleteStrDetail = [];
					}
				} else if (selectedBoqHeaderFk === -1) {
					// Here we handle the case of editing the system boq properties.
					isDefaultStr = true;
					modifiedDocProperties = prop;
					modifiedStructureDetails = prop.StructureDetails;
					modifiedDocProperties.Boqmask = getBoqMask(modifiedStructureDetails);
					modifiedBoqHeaderId = selectedBoqHeaderFk;
					if (isNewStrCreated) {
						modifiedDocProperties.Version = 0;

						// If we create a new boq structure definition we ignore the already marked as deleted structure details.
						deleteStrDetail = [];
					}
				} else {
					// The following check helps to determine that another boq type has been selected, that is different from the boq type that had been selected the last time the dialog has been opened.
					// If this is the case this is a change in the underlying document properties and is marked as a modification that's to be saved.
					if (previousTypeFk !== prop.BoqTypeId) {
						isDefaultStr = true;
						modifiedBoqHeaderId = selectedBoqHeaderFk;
						modifiedDocProperties = prop;
						modifiedStructureDetails = [];
						deleteStrDetail = [];
						flag = false;
					}
				}
			};

			service.isDefaultStructure = function isDefaultStructure() {
				return isDefaultStr;
			};

			service.setSelectedDocProperties = function setSelectedDocProperties(docProp, strDetails) {
				selectedDocProperties = docProp;
				selectedDocProperties.BoqTypeId = boqTypeFk;

				// setBoqCatalogConfigProperties(catConfTypeId, boqCatalogAssignFk);

				if (strDetails.length > 0) {
					selectedDocProperties.StructureDetails = strDetails;
					strDetailData = strDetails;
					$log.log(strDetailData + 'strDetailData' + strDetails + 'strDetails');
					selectedDocProperties.Boqmask = getBoqMask(strDetails);
				}
			};

			service.setAllowdDiscount = function (prop) {
				service.setAllowedDiscount.fire(prop.IsChecked, prop.DiscountAllowed);
				service.setModifiedDocProperties(prop);
			};

			var errorHandler = function (reason) {
				$log.log(reason.data.Message + '\n\n' + reason.data.MessageDetail + '\n');
				$log.warn(reason);
			};

			service.arePropertiesReadOnly = function arePropertiesReadOnly(forStructureDetails, additionalInfo) {
				// The following check means:
				// - if the underlying boq has children the boq structure information should not be changeable
				// - if we have an emtpy boq (HasChildren = false) the readOnly state is determined by the 'Edit structure' checkbox
				var readOnly = false;

				if (angular.isUndefined(selectedDocProperties) || selectedDocProperties === null) {
					return true;
				}
				else if (forStructureDetails && !boqMainCommonService.isGaebBoqType(selectedDocProperties)) {
					return true;
				}
				else {
					if (selectedBoqHeaderFk === -1) {
						// In this case we're editing system properties and have no link to a underlying boq header
						readOnly = service.isStructureAlreadyInUse(); // This is only possible if the structure is not already in use
					} else {
						if (forStructureDetails) {
							readOnly = !selectedDocProperties.IsChecked || doesHaveMultipleVersionBoqs;
						} else {
							readOnly = service.isStructureAlreadyInUse() ? true : !selectedDocProperties.IsChecked;
						}
					}
				}

				if(_.isObject(additionalInfo)) {
					additionalInfo.doesHaveMultipleVersionBoqs = doesHaveMultipleVersionBoqs;
				}

				return boqMainServiceIsReadOnly || readOnly;
			};

			service.getSelectedDocProp = function () {
				return selectedDocProperties;
			};

			service.isBoqMainServiceReadOnly = function isBoqMainServiceReadOnly() {
				return boqMainServiceIsReadOnly;
			};

			service.setEditVal = function (val, isModified) {
				selectedDocProperties.IsChecked = val;

				service.structureDetailsChanged.fire();
				service.updatedStructure.fire();
				service.editStructureChanged.fire(versionBoqsDetermined, makeBoqTypeEditable);
				service.selectedStrDetailChanged.fire(val, selectedDocProperties.DiscountAllowed);
				if (isModified) {
					service.setModifiedDocProperties(selectedDocProperties);
				}
			};

			service.getEditVal = function () {
				return selectedDocProperties.IsChecked;
			};

			service.setCurrentStrDetail = function (item) {
				if (currentStrDetail !== item && angular.isDefined(item)) {
					currentStrDetail = item;
				}
			};

			service.setStrDetailsAsModified = function (arg) {
				var items = arg.grid.getData().getItems();
				if (items && items.length > 0) {
					selectedDocProperties.StructureDetails = items;
					modifiedStructureDetails = items;
				}
				selectedDocProperties.Boqmask = getBoqMask(modifiedStructureDetails);
				service.structureDetailsChanged.fire();
				service.updatedStructure.fire();
				service.selectedStrDetailChanged.fire();
			};

			service.setStrDetailAsModified = function (structureDetail) {
				if (!_.isObject(_.find(modifiedStructureDetails, {Id: structureDetail.Id}))) {
					modifiedStructureDetails.push(structureDetail);
					modifiedBoqHeaderId = selectedBoqHeaderFk;
				}
			};

			var isValidId = function (newId) {
				var cnt = 0;
				if (strDetailData.length > 0) {
					angular.forEach(strDetailData, function (item) {
						if (newId === item.Id) {
							cnt++;
						}
					});
				}
				return cnt === 0;
			};
			var getNewItemId = function () {
				var newId = -1; // This is just a dummy id. The correct id will be generated on server side when doing the update.
				if (strDetailData.length >= 0) {
					for (var i = 0; i < strDetailData.length + 1; i++) {
						if (isValidId(newId)) {
							return newId;
						} else {
							newId--;
						}
					}
				}
			};

			var getNewItem = function () {
				var copyItem;
				if (strDetailData.length > 0) {
					var index = strDetailData.indexOf(_.find(strDetailData, {BoqLineTypeFk: 0}));
					copyItem = angular.copy(strDetailData[(index > 0) ? index - 1 : index]);
					if (_.isObject(copyItem.DescriptionInfo)) {
						// Reset part of DescriptionInfo to avoid overwriting values of original DescriptionInfo coming from former structure detail item that served as template
						copyItem.DescriptionInfo.DescriptionTr = null;
						copyItem.DescriptionInfo.VersionTr = 0;
						copyItem.DescriptionInfo.Modified = !_.isEmpty(copyItem.DescriptionInfo.Description) || !_.isEmpty(copyItem.DescriptionInfo.Translated);

					}
					copyItem.Id = getNewItemId();
					copyItem.Version = 0;
					copyItem.BoqLineTypeFk = copyItem.BoqLineTypeFk + 1;
				} else {
					createItem().then(function (response) {
						copyItem = response.data;
						copyItem.BoqLineTypeFk = 0;
					}, errorHandler);
				}
				return copyItem;
			};

			service.createItem = function () {
				if (selectedDocProperties.IsChecked || isDefaultStr) {
					var newItem = getNewItem();
					selectedDocProperties.StructureDetails.push(newItem);
					strDetailData = selectedDocProperties.StructureDetails;
					selectedDocProperties.Boqmask = getBoqMask(strDetailData);
					service.setCurrentStrDetail(strDetailData[strDetailData.length - 1]);
					service.structureDetailsChanged.fire();
					service.selectedStrDetailChanged.fire();
					service.setModifiedDocProperties(selectedDocProperties);
				}
			};

			service.deleteStrDetails = function () {
				if (selectedDocProperties.IsChecked || isDefaultStr) {
					if (angular.isUndefined(currentStrDetail) || angular.isUndefined(currentStrDetail.Id)) {
						return; // no selection -> nothing happens
					}
					// not index or position
					if (currentStrDetail.BoqLineTypeFk !== 0 && currentStrDetail.BoqLineTypeFk !== 10) {
						if (currentStrDetail.Version !== 0) {
							deleteStrDetail.push(currentStrDetail);
						}
						var index = selectedDocProperties.StructureDetails.indexOf(currentStrDetail);
						selectedDocProperties.StructureDetails.splice(index, 1);

						var strDetails = selectedDocProperties.StructureDetails;
						currentStrDetail = strDetails[index === (strDetails.length - 2) ? index - 1 : index];
						strDetailData = selectedDocProperties.StructureDetails; // TODO: necessary?
						selectedDocProperties.Boqmask = getBoqMask(strDetailData);
						service.structureDetailsChanged.fire();
						service.updatedStructure.fire();
						service.selectedStrDetailChanged.fire();

						service.setModifiedDocProperties(selectedDocProperties);
					}
				}
			};

			service.strDetailEditorFormatter = function (row, cell, value) {
				if (value !== null) {
					var lineType = _.find(boqLineType, {Id: value});
					if (angular.isObject(lineType)) {
						return lineType.DescriptionInfo.Translated;
					}
				}
				return '';
			};

			service.strDetailDataTypeFormatter = function (row, cell, value) {
				if (value !== null) {
					var dataType = _.find(boqMainStructureDetailsTypeService.getTypes(), {Id: value});
					if (angular.isObject(dataType)) {
						return dataType.Description;
					}
				}
				return '';
			};

			// assign boq line type as per requirement
			service.setBoqLineType = function setBoqLineType(itemList) {
				if (boqMainCommonService.isOenBoqType(currentStructure)) {
					return itemList; // In an OENORM BOQ the 'BoqLineTypeFk' (here manipulated) of the 1st level group is not always 1.
				}

				var level = 0;
				var position = _.find(itemList, {BoqLineTypeFk: 0});
				var index = _.find(itemList, {BoqLineTypeFk: 10});

				if (angular.isDefined(position)) {
					itemList.splice(itemList.indexOf(position), 1);
				}
				if (angular.isDefined(index)) {
					itemList.splice(itemList.indexOf(index), 1);
				}

				angular.forEach(itemList, function (data) {
					if (data.BoqLineTypeFk !== 0 || data.BoqLineTypeFk !== 10) {
						level++;
						if (level < 10 && level !== 0) {
							data.BoqLineTypeFk = level;
						} else {
							var index = itemList.indexOf(data);
							itemList.splice(index, 1);
						}
					}
				});

				if (angular.isDefined(position)) {
					itemList.push(position);
					if (angular.isDefined(index)) {
						itemList.push(index);
					}
					selectedDocProperties.Boqmask = getBoqMask(itemList);
					strDetailData = itemList;
					if (angular.isDefined(service.getCurrentStrDetail()) && angular.isDefined(service.getCurrentStrDetail().Id)) {
						service.setCurrentStrDetail(_.find(itemList, {Id: service.getCurrentStrDetail().Id}));
					} else {
						service.setCurrentStrDetail(strDetailData[0]);
					}
				}
				return itemList;
			};

			service.getCurrentStrDetail = function () {
				return currentStrDetail;
			};

			service.getStructure = function () {
				return currentStructure;
			};

			service.getStructureDetail = function () {
				return strDetailData;
			};

			service.updateAllowedDiscountDetail = function (data) {
				strDetailData = data;
			};

			service.setSpecificStrFlag = function setSpecificStrFlag(flag) {
				isNewStrCreated = flag;
			};

			service.load = function load(boqMainService) {
				selectedBoqHeaderFk = boqMainService.getSelectedBoqHeader();
				boqRootItem = boqMainService.getRootBoqItem();
				boqMainServiceIsReadOnly = boqMainService.getReadOnly();
				currentProjectId = boqMainService.getSelectedProjectId();
				versionBoqsDetermined = false;
				doesHaveMultipleVersionBoqs = false;
				makeBoqTypeEditable = false;
				return service.doesBaseBoqHaveMultipleVersionBoqs(true).then(function (hasMultipleVersionBoqs) {
					return hasMultipleVersionBoqs;
				}).then(initPropForm());
			};

			service.loadSystemProperties = function loadSystemProperties(typeFk, structureFk, structureIsAlreadyInUse) {

				// This function is used to load the system boq document properties,
				// i.e. those properties that are not related to a boq header and are only reachable via the boq type table entries.
				return boqMainBoqTypeService.loadData(true).then(function () { // The flag true forces the load although a boq type list may already be loaded -> important to keep the list in sync to the list when creating new boq types.
					boqTypeList = boqMainBoqTypeService.getBoqType();
					boqTypeFk = typeFk;
					previousTypeFk = typeFk;
					flag = false;
					isNewStrCreated = false;
					isDefaultStr = true; // Inidicates that we load the system properties, also named as default properties.
					deleteStrDetail = [];
					boqRootItem = {}; // Indicating we're editing system properties
					selectedBoqHeaderFk = -1;
					boqStructureIsAlreadyInUse = structureIsAlreadyInUse;
					boqMainServiceIsReadOnly = false;
					versionBoqsDetermined = false;
					doesHaveMultipleVersionBoqs = false;
					currentProjectId = -1;
					makeBoqTypeEditable = false;

					return service.getPropertiesById(boqTypeFk, structureFk, false);
				});
			};

			service.getBoqStructureFkByType = function getBoqStructureFkByType(boqTypeId) {
				return (boqTypeId > 0) ? _.find(boqTypeList, {Id: boqTypeId}).BoqStructureFk : null;
			};

			service.getPreviouslyLoadedBoqTypeId = function getPreviouslyLoadedBoqTypeId() {
				return boqTypeFk;
			};

			service.isStructureAlreadyInUse = function isStructureAlreadyInUse() {

				if (boqStructureIsAlreadyInUse) {
					return true;
				}

				return service.doesBoqRootItemHaveChildren();
			};

			service.doesBoqRootItemHaveChildren = function doesBopRootItemHaveChildren() {

				if (angular.isUndefined(boqRootItem) || boqRootItem === null) {
					return false;
				}

				// We determine the 'parenthood' by the following check
				return Object.prototype.hasOwnProperty.call(boqRootItem, 'BoqItems') && angular.isDefined(boqRootItem.BoqItems) && _.isArray(boqRootItem.BoqItems) && boqRootItem.BoqItems.length > 0;
			};

			service.setBoqStructureIsAlreadyInUse = function setBoqStructureIsAlreadyInUse(structureIsAlreadyInUse) {
				boqStructureIsAlreadyInUse = structureIsAlreadyInUse;
			};

			/* jshint -W074 */ // I cannot really see a cyclomatic complexity in the following function
			service.checkDocumentProperties = function checkDocumentProperties(errorList) {
				// Currently we only check the structure details.
				var structureDetail = null;
				var checkPassed = true;
				var detailIsOk = true;
				var errorListIsThere = _.isArray(errorList);
				var maxReference = -1; // Will hold the maximum value of a reference on a specific structure detail level

				if (angular.isUndefined(selectedDocProperties) && (selectedDocProperties === null)) {
					return false;
				}

				// First we check if there is at least one structure detail
				if (!_.isArray(selectedDocProperties.StructureDetails) || selectedDocProperties.StructureDetails.length <= 0) {
					if (errorListIsThere) {
						errorList.push($translate.instant('boq.main.BoqStructureNoDetails'));
					}
					return false;
				}

				// Now we look in detail at the structure details
				var positionDetailExists = false;
				var errorForDetailLine = null;
				var startValueNumber = -1;
				var stepIncrementNumber = -1;
				var detailValuesDiscrepant = false;
				for (var i = 0; i < selectedDocProperties.StructureDetails.length; i++) {
					structureDetail = selectedDocProperties.StructureDetails[i];

					if (angular.isDefined(structureDetail) && (structureDetail !== null)) {

						// Currently we ignore detail lines of boqLineType index
						if (structureDetail.BoqLineTypeFk === boqMainLineTypes.index) {
							continue;
						}

						// Add index to error string
						errorForDetailLine = $translate.instant('boq.main.BoqStructureDetailLineInvalid');
						errorForDetailLine = errorForDetailLine.replace(/%i/g, (i + 1).toString()) + ':';
						detailIsOk = true;
						detailValuesDiscrepant = false;

						if (!_.isBoolean(structureDetail.DiscountAllowed)) {
							errorForDetailLine += ' ' + $translate.instant('boq.main.DiscountAllowed');
							detailIsOk = false;
						}

						if (!_.isNumber(structureDetail.LengthReference) || structureDetail.LengthReference <= 0) {
							errorForDetailLine = (detailIsOk) ? errorForDetailLine : errorForDetailLine + ',';
							errorForDetailLine += ' ' + $translate.instant('boq.main.LengthReference');
							detailIsOk = false;
						} else {
							// Determine maximum reference number on this detail level
							maxReference = Math.pow(10, structureDetail.LengthReference) - 1;
						}

						if (!_.isString(structureDetail.StartValue) || _.isEmpty(structureDetail.StartValue)) {
							errorForDetailLine = (detailIsOk) ? errorForDetailLine : errorForDetailLine + ',';
							errorForDetailLine += ' ' + $translate.instant('boq.main.StartValue');
							detailIsOk = false;
						} else {
							// Check if the StartValue is smaller than the maxReference so creating a reference number is possible
							startValueNumber = parseInt(structureDetail.StartValue, 10);
							if (startValueNumber > maxReference) {
								// With this StartValue we cannot create a reference number
								errorForDetailLine = (detailIsOk) ? errorForDetailLine : errorForDetailLine + ',';
								errorForDetailLine += ' ' + $translate.instant('boq.main.BoqStructureDetailValuesDiscrepant');
								detailIsOk = false;
								detailValuesDiscrepant = true;
							}
						}

						if (!_.isNumber(structureDetail.Stepincrement) || structureDetail.Stepincrement < 1) {
							errorForDetailLine = (detailIsOk) ? errorForDetailLine : errorForDetailLine + ',';
							errorForDetailLine += ' ' + $translate.instant('boq.main.Stepincrement');
							detailIsOk = false;
						} else {
							// Check if the Stepincrement is smaller than the maxReference so creating a reference number is possible
							stepIncrementNumber = parseInt(structureDetail.Stepincrement, 10);
							if (stepIncrementNumber > maxReference && !detailValuesDiscrepant) {
								// With this Stepincrement we cannot create a reference number
								errorForDetailLine = (detailIsOk) ? errorForDetailLine : errorForDetailLine + ',';
								errorForDetailLine += ' ' + $translate.instant('boq.main.BoqStructureDetailValuesDiscrepant');
								detailIsOk = false;
								detailValuesDiscrepant = true;
							}
						}

						if (angular.isUndefined(structureDetail.DataType) || (structureDetail.DataType === null) || ((structureDetail.DataType !== boqMainStructureDetailDataType.numeric) && (structureDetail.DataType !== boqMainStructureDetailDataType.alphanumeric))) {
							errorForDetailLine = (detailIsOk) ? errorForDetailLine : errorForDetailLine + ',';
							errorForDetailLine += ' ' + $translate.instant('boq.main.DataType');
							detailIsOk = false;
						}

						if (angular.isDefined(structureDetail.BoqLineTypeFk) && (structureDetail.BoqLineTypeFk !== null) && structureDetail.BoqLineTypeFk === boqMainLineTypes.position) {
							positionDetailExists = true;
						}

						// Add error string to error list
						if (!detailIsOk && errorListIsThere) {
							checkPassed = false;
							errorList.push(errorForDetailLine);
						}
					}
				}

				if (!positionDetailExists) {
					checkPassed = false;
					if (errorListIsThere) {
						errorList.push($translate.instant('boq.main.BoqStructurePositionLineMissing'));
					}
				}

				return checkPassed;
			};

			service.getBoqStructure = function (id) {
				return getBoqStructure(id);
			};

			service.setUpdBoqCatAssignConf = function setUpdBoqCatAssignConf(catAssignConf) {
				updBoqCatAssignConf = catAssignConf;
			};

			service.getUpdBoqCatAssignConf = function getUpdBoqCatAssignConf() {
				return updBoqCatAssignConf;
			};

			service.setRenumberMode = function setRenumberMode(isInRenumberMode) {
				renumberMode = isInRenumberMode;
			};

			service.getRenumberMode = function getRenumberMode() {
				return renumberMode;
			};

			service.getBoqTypeList = function getBoqTypeList() {
				return boqTypeList;
			};

			service.getCurrentLineItemContext = function getCurrentLineItemContext() {
				let lineItemContextFk = null;
				let activeBoqType = _.find(boqTypeList, {Id: boqTypeFk});

				if(_.isObject(activeBoqType)) {
					lineItemContextFk = activeBoqType.LineitemcontextFk;
				}

				if(!_.isNumber(lineItemContextFk) && _.isObject(boqRootItem)){
					lineItemContextFk = boqRootItem.LineItemContextWhenLoading; // Get the line item context from the currently loaded boq
				}

				return lineItemContextFk;
			};

			service.doesBaseBoqHaveMultipleVersionBoqs = function doesBaseBoqHaveMultipleVersionBoqs(supressUserMessage) {
				var baseBoqHeaderId = 0;
				var baseItemId = 0;
				var baseBoqItemIds = [];
				var platformModalService = $injector.get('platformModalService');
				var versionBoqReferencesPromise = $q.when({});
				var askUserDeferred = $q.defer();

				if (_.isObject(boqRootItem)) {
					baseBoqHeaderId = boqRootItem.BoqItemPrjBoqFk !== null ? boqRootItem.BoqItemPrjBoqFk : boqRootItem.BoqHeaderFk;
					baseItemId = boqRootItem.BoqItemPrjItemFk !== null ? boqRootItem.BoqItemPrjItemFk : boqRootItem.Id;
					baseBoqItemIds = [];
					baseBoqItemIds.push(baseItemId);

					if (baseBoqHeaderId > 0 && baseBoqItemIds.length > 0) {
						if (!versionBoqsDetermined) {
							versionBoqReferencesPromise = $http.post(globals.webApiBaseUrl + 'boq/main/getversionboqreferencesofgivenbaseboqitems?baseboqheaderid=' + baseBoqHeaderId + '&determineVersionBoqTypes=true', baseBoqItemIds).then(function (response) {
								return _.isObject(response) ? response.data : null;
							});
						}
					}

					versionBoqReferencesPromise.then(function (versionBoqReferences) {

						if (_.isObject(versionBoqReferences) && !_.isEmpty(versionBoqReferences)) {
							let myVersionBoqReferences = versionBoqReferences[baseItemId.toString()];

							let boqMainBoqTypes = $injector.get('boqMainBoqTypes');
							let onlyOneRequisitionVersionBoq = false;
							if (_.isArray(myVersionBoqReferences) && myVersionBoqReferences.length === 1) {

								// In case only one version boq is given the following check determines if:
								// - this version boq is a requisition boq (-> Item3 is the boqType) and
								// - this version boq is NOT readonly due to the status of its main entity (-> Item4 carries this readonly state)
								let item = myVersionBoqReferences[0];
								onlyOneRequisitionVersionBoq = item.Item3 === boqMainBoqTypes.requisition && (_.isBoolean(item.Item4) && !item.Item4);
								makeBoqTypeEditable = (item.Item3 === boqMainBoqTypes.bill && (_.isBoolean(item.Item4) && !item.Item4)) && !service.doesBoqRootItemHaveChildren() && !boqDocPropertiesControllerConfig.baseBoqRootItemHasChildren;
							}
							doesHaveMultipleVersionBoqs = _.isArray(myVersionBoqReferences) ? (myVersionBoqReferences.length > 1 || (myVersionBoqReferences.length === 1 && !onlyOneRequisitionVersionBoq)) : false;
							versionBoqsDetermined = true;
						} else if (versionBoqReferences === null) {
							doesHaveMultipleVersionBoqs = false;
							versionBoqsDetermined = true;
						}

						if (!doesHaveMultipleVersionBoqs) {
							askUserDeferred.resolve(false);
						} else {
							if (supressUserMessage) {
								askUserDeferred.resolve(true);
							} else {
								platformModalService.showMsgBox('boq.main.errorBoqStructureChangeMultipleVersionBoqs', 'boq.main.errorBoqStructureChangeMultipleVersionBoqsTitle', 'ico-info').then(function () {
									askUserDeferred.resolve(true);
								});
							}
						}
					});
				} else {
					return $q.when(false);
				}

				return askUserDeferred.promise;
			};

			return service;
		}
	]);
})();
