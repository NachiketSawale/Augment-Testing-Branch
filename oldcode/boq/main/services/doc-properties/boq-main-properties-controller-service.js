/**
 * Created by joshi on 07.08.2014.
 */
(function() {
	/* global _, globals */
	'use strict';
	const moduleName = 'boq.main';

	/**
	 @ngdoc controller
	 * @name boqMainDocPropertiesController
	 * @function
	 *
	 * @description
	 * Controller for the Document Properties view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).value('boqMainDocPropertiesController',
		function ($scope, $modalInstance, $injector) {

			// Injections
			var $translate = $injector.get('$translate');
			// var $timeout = $injector.get('$translate');
			// var $modalInstance = $injector.get('$modalInstance');
			var boqMainPropertiesConfigService = $injector.get('boqMainPropertiesConfigService');
			var boqMainTranslationService = $injector.get('boqMainTranslationService');
			var boqMainDocPropertiesService = $injector.get('boqMainDocPropertiesService');
			var boqDocPropertiesControllerConfig = $injector.get('boqDocPropertiesControllerConfig');
			var boqMainPropertiesDialogService = $injector.get('boqMainPropertiesDialogService');
			var platformModalService = $injector.get('platformModalService');
			var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
			var boqMainCatalogAssignDetailsService = $injector.get('boqMainCatalogAssignDetailsService');
			var boqMainCatalogAssignTypeService = $injector.get('boqMainCatalogAssignTypeService');
			var boqMainCatalogAssignmentUIConfigService = $injector.get('boqMainCatalogAssignmentUIConfigService');
			var $q = $injector.get('$q');
			var $http = $injector.get('$http');
			var boqMainCopyOptionsProviderService = $injector.get('boqMainCopyOptionsProviderService');
			var boqMainRoundingConfigDialogService = $injector.get('boqMainRoundingConfigDialogService');
			var boqMainRoundingConfigDataService = $injector.get('boqMainRoundingConfigDataService');
			var currentDialogMode = boqMainPropertiesDialogService.getDialogMode();
			var basicsLookupdataLookupDefinitionService = $injector.get('basicsLookupdataLookupDefinitionService');
			var basicsLookupdataLookupFilterService = $injector.get('basicsLookupdataLookupFilterService');
			var boqMainCatalogAssignCostgroupLookupService = $injector.get('boqMainCatalogAssignCostgroupLookupService');
			var boqMainStandardTypes = $injector.get('boqMainStandardTypes');
			var boqMainCommonService = $injector.get('boqMainCommonService');
			var boqMainOenBoqStructureService = $injector.get('boqMainOenBoqStructureService');
			var platformGridAPI = $injector.get('platformGridAPI');
			var boqLineTypeLookupDataService = $injector.get('boqLineTypeLookupDataService');

			basicsLookupdataLookupDefinitionService.load([
				'boqMainCatalogAssignCatalogCombobox',
				'boqMainCatalogAssignCostgroupCombobox'
			]);
			if (boqMainCatalogAssignDetailsService) {
				boqMainCatalogAssignDetailsService.setDialogMode(currentDialogMode);
				if (boqDocPropertiesControllerConfig) {
					boqMainCatalogAssignDetailsService.setProjectFilter(boqDocPropertiesControllerConfig.isProjectFilter);
					boqMainCatalogAssignDetailsService.setProjectId(boqDocPropertiesControllerConfig.projectId);
				}
			}
			var isCurrentBoqMainServiceReadOnly = angular.isDefined(boqDocPropertiesControllerConfig) &&
				(boqDocPropertiesControllerConfig !== null) &&
				angular.isDefined(boqDocPropertiesControllerConfig.currentBoqMainService) &&
				(boqDocPropertiesControllerConfig.currentBoqMainService !== null) &&
				boqDocPropertiesControllerConfig.currentBoqMainService.getReadOnly();

			var hasNewBoqTypeBeenSet = false;

			$scope.updateDocProperties = {};
			$scope.currentItem = {};

			$scope.systemPropertiesOnly = angular.isDefined(boqDocPropertiesControllerConfig) && (boqDocPropertiesControllerConfig !== null) ? (boqDocPropertiesControllerConfig.boqTypeFk !== null) && (boqDocPropertiesControllerConfig.boqStructureFk !== null) : false;

			// customizing module only
			$scope.catalogSystemOnly = angular.isDefined(boqDocPropertiesControllerConfig) && (boqDocPropertiesControllerConfig !== null) ? boqDocPropertiesControllerConfig.currentBoqMainService === null : false;

			// Make sure the renumberMode is set correctly, i.e. here it is not active
			boqMainDocPropertiesService.setRenumberMode(false);

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant('cloud.common.documentProperties'),
				editCopyOptionsButtonText: $translate.instant('boq.main.copyOptions'),
				editRoundingConfigButtonText: $translate.instant('boq.main.roundingConfig'),

				ok: function (result) {

					// First check if the modified document properties are valid
					var errorList = [];
					platformGridAPI.grids.commitAllEdits();

					// Save currentBoqMainService here to avoid loosing reference to it when resetConfigValues is called when closing this dialog on pressing OK button.
					var savedCurrentBoqMainService = boqDocPropertiesControllerConfig.currentBoqMainService;
					var askForSavePromise = $q.when(true);
					if (currentDialogMode === 'default' && !boqMainDocPropertiesService.checkDocumentProperties(errorList)) {

						// Construct error message out of returned errorList
						var errorMessage = '';

						angular.forEach(errorList, function (errorEntry) {
							errorMessage += errorEntry + '<br>';
						});

						// Now we try to show an error dialog
						var errorModalOptions = {
							headerTextKey: 'boq.main.BoqStructureInvalid',
							bodyText: errorMessage,
							showOkButton: true,
							iconClass: 'ico-error'
						};

						platformModalService.showDialog(errorModalOptions);
					} else {

						if (!boqMainDocPropertiesService.getEditVal() && !hasNewBoqTypeBeenSet && boqMainDocPropertiesService.getSelectedBoqHeader() > 0) {
							// We're now also allowed to change some settings of default boq porperties.
							// For we may not change the default properties itself we solve this problem by
							// generating new specific boq properties and attach them to the currently loaded
							// boq header.

							// Look if there are modifications
							if (boqMainDocPropertiesService.hasModifications()) {

								// Ask user if he wants to create specific boq properties when doing the following save.
								askForSavePromise = platformModalService.showYesNoDialog('boq.main.createSpecificBoqProperties', 'boq.main.navDocumentProperties', 'yes').then(function (modalResult) {
									if (modalResult.yes) {
										boqMainDocPropertiesService.setSpecificStrFlag(true);
										boqMainDocPropertiesService.getSelectedDocProp().BoqTypeId = null;
										boqMainDocPropertiesService.setEditVal(true, true);
										return true;
									}

									return false;
								});
							}
						}

						askForSavePromise.then(function (doSave) {
							if (doSave) {

								let roundingConfigDataItem = boqMainRoundingConfigDataService.getCurrentItem();
								if(_.isObject(roundingConfigDataItem) && _.isEmpty(roundingConfigDataItem)) {
									let isEditRoundingConfigType = roundingConfigDataItem.isEditRoundingConfigType;
									let isCustomize = (boqMainDocPropertiesService.getSelectedBoqHeader() <= 0);
									if(_.isObject($scope.currentItem)) {
										$scope.currentItem.BoqRoundingConfig = (!isCustomize && isEditRoundingConfigType) ? roundingConfigDataItem.BoqRoundingConfig : null;
									}
								}

								boqMainDocPropertiesService.saveDocumentProperties().then(function (savedProperties) {
									if (angular.isDefined(savedProperties) && savedProperties !== null) {
										// Use previously saved currentBoqMainService in this promise handler to reload the structure for the current boq header
										if (savedCurrentBoqMainService) {
											savedCurrentBoqMainService.reloadStructureForCurrentHeader();
											savedCurrentBoqMainService.setSelectedHeaderFk(savedCurrentBoqMainService.getSelectedBoqHeader(), true);
											boqLineTypeLookupDataService.clearCache();
										}
									}
								});
							}
						});

						$modalInstance.close(result);
					}
				},

				cancel: function () {

					// Before closing the dialog via cancel we usually would revert all changes done to the underlying selected properties.
					// We can also achieve this by doing a load of the unchanged properties from the server when the dialog is opened next.
					// This is currently done when initializing this controller.
					// The only problem with this approach currently is that the boq type has to be set to a proper value explicitly, because it
					// can be set to null and if so the combo box for displaying the boq type will be displayed as readonly, although it should be changeable.
					if (angular.isDefined(boqMainDocPropertiesService.getSelectedDocProp()) && (boqMainDocPropertiesService.getSelectedDocProp() !== null)) {
						boqMainDocPropertiesService.getSelectedDocProp().BoqTypeId = boqMainDocPropertiesService.getPreviouslyLoadedBoqTypeId();
					}

					$modalInstance.dismiss('cancel');
				},

				editCopyOptions: function() {
					boqMainCopyOptionsProviderService.startByBoqStructure(null, boqMainDocPropertiesService.getStructure(), false); // no restrictions for the 3 paramaters 'isProcurementBoq','isCrbBoq','isOenBoq'
				},

				hideCopyOptionsButton: function() {
					return (boqMainDocPropertiesService.getSelectedBoqHeader() > 0) || (currentDialogMode === 'boqcatalog'); // show the button in the customize module only for in standard boq structure container there is a separate toolbar button for the copy options
				},

				editRoundingConfig: function() {
					let isCustomize = (boqMainDocPropertiesService.getSelectedBoqHeader() <= 0);
					boqMainRoundingConfigDialogService.startByBoqStructure(boqMainDocPropertiesService.getStructure(), isCustomize, 'boqProperties'); // no restrictions for the  2 paramaters 'isProcurementBoq' and 'isCrbBoq'
				},

				hideRoundingConfigButton: function() {
					return currentDialogMode === 'boqcatalog';
				}

			};

			$scope.disableOk = false;

			$scope.disableCopyOptionsButton = function() {
				return boqMainDocPropertiesService.isStructureAlreadyInUse();
			};

			$scope.disableRoundingConfigButton = function() {
				return false;
			};

			$scope.validateModel = function () {
				return true;
			};

			$scope.currentItem = boqMainDocPropertiesService.getSelectedDocProp();

			function reactOnChangeOfBoqCatAssignType(boqCatAssignTypeId) {
				boqMainCatalogAssignDetailsService.clearData();
				boqMainCatalogAssignTypeService.loadCatAssignByTypeId(boqCatAssignTypeId).then(function (response) {
					if (response && response.data) {
						boqMainDocPropertiesService.setUpdBoqCatAssignConf(response.data);
						// fire an event to load the catalog assign details
						var boqCatalogAssignFk = response.data.Id;
						$scope.currentItem.boqCatalogAssignDesc = response.data && response.data.DescriptionInfo ? response.data.DescriptionInfo.Description : $scope.currentItem.boqCatalogAssignDesc;

						// default
						var catalogDetailsReadOnly = (currentDialogMode !== 'boqcatalog');
						boqMainCatalogAssignDetailsService.setPropertiesReadOnly(catalogDetailsReadOnly);
						boqMainCatalogAssignDetailsService.getCatalogAssignDetails(boqCatalogAssignFk, boqCatAssignTypeId, catalogDetailsReadOnly);

						boqMainDocPropertiesService.setModifiedDocProperties($scope.currentItem);
					}
					else {
						boqMainDocPropertiesService.setUpdBoqCatAssignConf(null);
					}

					boqMainCatalogAssignDetailsService.editCatalogChanged.fire();
				});
			}

			$scope.change = function change(item, model) {
				var platformDialogService = $injector.get('platformDialogService');
				hasNewBoqTypeBeenSet = false;
				var urbNames = ['NameUrb1','NameUrb2', 'NameUrb3','NameUrb4','NameUrb5','NameUrb5','NameUrb6'];

				if (model === 'BoqTypeId') {
					var typFk = item.BoqTypeId;
					var strFk = boqMainDocPropertiesService.getBoqStructureFkByType(typFk);
					var deferredOkEnabled = $q.defer();

					// Disable the ok button until the structure is loaded
					$scope.disableOk = true;

					if (boqMainDocPropertiesService.getSelectedBoqHeader() === -1) {
						boqMainPropertiesDialogService.isBoqStructureInUse(strFk).then(function (result) {
							// Result holds a boolean indicating if the given boq structure information is already in use by a boq, i.e. that a boq is already built upon
							// the structure information.
							$scope.error.show = result.data;
							boqMainDocPropertiesService.setBoqStructureIsAlreadyInUse(result);
							boqMainDocPropertiesService.getPropertiesById(typFk, strFk, false).then(function () {
								deferredOkEnabled.resolve();
							}); // isModified flag is set to false, because changing the boq type in this mode is not a modification.
						},
						function () {
							console.log('boqMainDocPropertiesController -> $scope.change: call determining if structure is already in use failed!');
						});
					} else {
						boqMainDocPropertiesService.getPropertiesById(typFk, strFk, true).then(function () {
							let loadedPropertiesAreSpecific = !boqMainCommonService.isCrbBoqType($scope.currentItem) && !boqMainCommonService.isOenBoqType($scope.currentItem);
							boqMainDocPropertiesService.setSpecificStrFlag(true);
							boqMainDocPropertiesService.setEditVal(loadedPropertiesAreSpecific, true);
							catalogFormConfigUpdated();
							deferredOkEnabled.resolve();
						});
					}

					deferredOkEnabled.promise.then(function () {
						$scope.disableOk = false;
						hasNewBoqTypeBeenSet = true;
					});
				}
				else if (model === 'IsChecked') {
					if (boqMainCommonService.isCrbBoqType($scope.currentItem) || boqMainCommonService.isOenBoqType($scope.currentItem)) {
						$scope.currentItem.IsChecked = false;
						platformDialogService.showInfoBox(boqMainCommonService.isCrbBoqType($scope.currentItem) ? 'boq.main.crbBoqTypeIsReadonly' : 'boq.main.oenBoqTypeIsReadonly');
					}
					else {
						boqMainDocPropertiesService.doesBaseBoqHaveMultipleVersionBoqs().then(function (thereAreMultipleVersionBoqs) {
							if (!thereAreMultipleVersionBoqs) {
								boqMainDocPropertiesService.setBoqStructureIsAlreadyInUse(false); // Marking this structure as editable leads to the creation of a new strucure that cannot be in use
								boqMainDocPropertiesService.setSpecificStrFlag(true);
								boqMainDocPropertiesService.getSelectedDocProp().BoqTypeId = null;
								boqMainDocPropertiesService.setEditVal(true);

								boqMainDocPropertiesService.setModifiedDocProperties($scope.currentItem);

								catalogFormConfigUpdated();
							} else {
								$scope.currentItem.IsChecked = false;
							}
						});
					}
				} else if (model === 'LeadingZeros') {
					boqMainDocPropertiesService.doesBaseBoqHaveMultipleVersionBoqs().then(function (thereAreMultipleVersionBoqs) {
						if (thereAreMultipleVersionBoqs) {
							$scope.currentItem.LeadingZeros = false;
						} else {
							boqMainDocPropertiesService.setModifiedDocProperties($scope.currentItem);
						}
					});
				} else if (model === 'editBoqCatalogConfigType') {
					// create a new updBoqCatAssignConf if there is no
					var newupdBoqCatAssignConf = boqMainDocPropertiesService.getUpdBoqCatAssignConf();
					if (!newupdBoqCatAssignConf && !newupdBoqCatAssignConf.Id) {
						newupdBoqCatAssignConf = {Id: 0, Version: 0, DescriptionInfo: {}};
						boqMainDocPropertiesService.setUpdBoqCatAssignConf(newupdBoqCatAssignConf);
					}

					if (item.editBoqCatalogConfigType) {
						newupdBoqCatAssignConf = {Id: 0, Version: 0, DescriptionInfo: {}};
						boqMainDocPropertiesService.setUpdBoqCatAssignConf(newupdBoqCatAssignConf);

						boqMainCatalogAssignDetailsService.setPropertiesReadOnly(false);
						boqMainCatalogAssignDetailsService.editCatalogChanged.fire();
					} else {
						reactOnChangeOfBoqCatAssignType(item.boqCatAssignTypeId);
						// catalogFormConfigUpdated();
					}
					boqMainDocPropertiesService.setModifiedDocProperties($scope.currentItem);
				} else if (model === 'boqCatAssignTypeId') {
					reactOnChangeOfBoqCatAssignType(item.boqCatAssignTypeId);
				}
				else if (model === 'BoqStandardFk') {
					boqMainDocPropertiesService.getSelectedDocProp().OenBoqStructureId = undefined;

					if(item.BoqStandardFk === boqMainStandardTypes.gaeb) {
						// When switching to GAEB standard make sure the "EnforceStructure" flag is set
						item.EnforceStructure = true;
					}
					else if(item.BoqStandardFk === boqMainStandardTypes.free) {
						// When switching to Free standard make sure the "EnforceStructure" flag is unchecked
						item.EnforceStructure = false;
					}

					// Ensures that a BOQ of the Swiss CRB standard has exactly 1 'BOQ_STRUCTURE'
					if (boqMainCommonService.isCrbBoqType(item)) {
						if (boqMainDocPropertiesService.getSelectedBoqHeader() === -1) // customize module
						{
							// In the customize module a new 'BOQ_TYPE' can be created but it cannot be edited and always has the same reference to the only 'BOQ_STRUCTURE'.
							$http.get(globals.webApiBaseUrl + 'boq/main/crb/boqstructure').then(function (response) {
								var crbBoqStructure = response.data;
								boqMainDocPropertiesService.getStructureDetails(crbBoqStructure.Id).then(function (response) {
									var crbBoqStructureDetails = response.data;
									boqMainDocPropertiesService.setSelectedDocProperties(crbBoqStructure, crbBoqStructureDetails);
									boqMainDocPropertiesService.setEditVal(false, true);
									catalogFormConfigUpdated();
								});
							});
						}
						else // BOQ module
						{
							// A 'BOQ_HEADER' only can be assigned to another 'BOQ_STRUCTURE' indirectly by assigning to another 'BOQ_TYPE'.
							// A consequence is that a CRB BOQ can not have a specialized costgroup configuration on BOQ level (BOQ_STRUCTURE.BOQ_CAT_ASSIGN_CONFTYPE_FK/BOQ_CAT_ASSIGN_FK==null)
							platformDialogService.showInfoBox('boq.main.crbBoqTypeIsReadonly');
							item.BoqStandardFk = boqMainStandardTypes.gaeb;
							boqMainDocPropertiesService.setEditVal(true);
						}
					}
					else if (boqMainCommonService.isOenBoqType(item)) {
						if (boqMainDocPropertiesService.getSelectedBoqHeader() === -1) { // customize module
							let oenBoqStructure = boqMainOenBoqStructureService.getList()[0];
							boqMainDocPropertiesService.setSelectedDocProperties(oenBoqStructure, oenBoqStructure.BoqStructureDetailEntities);
							boqMainDocPropertiesService.setEditVal(false, true);
							catalogFormConfigUpdated();
							$scope.currentItem.OenBoqStructureId = oenBoqStructure.Id;
						}
						else { // BOQ module
							// A 'BOQ_HEADER' only can be assigned to another 'BOQ_STRUCTURE' indirectly by assigning to another 'BOQ_TYPE'.
							// A consequence is that a OENORM BOQ can not have a specialized costgroup configuration on BOQ level (BOQ_STRUCTURE.BOQ_CAT_ASSIGN_CONFTYPE_FK/BOQ_CAT_ASSIGN_FK==null)
							platformDialogService.showInfoBox('boq.main.oenBoqTypeIsReadonly');
							item.BoqStandardFk = boqMainStandardTypes.gaeb;
							boqMainDocPropertiesService.setEditVal(true);
						}
					}
					else {
						if (boqMainDocPropertiesService.getSelectedBoqHeader() === -1) { // customize module
							boqMainDocPropertiesService.setEditVal(false, true);
							catalogFormConfigUpdated();
						}
						else if (boqMainDocPropertiesService.isStructureAlreadyInUse() && item.OriginBoqStandardFk===boqMainStandardTypes.free && item.BoqStandardFk!==boqMainStandardTypes.gaeb) {
							platformDialogService.showInfoBox('boq.main.freeBoqOnlyCanBeSwitchedToGaeb');
							item.BoqStandardFk = boqMainStandardTypes.free;
						}
						else {
							// For the BoqStandard has been changed set the current properties as modified
							boqMainDocPropertiesService.setModifiedDocProperties($scope.currentItem);
						}
						formConfigUpdated();
					}
				}
				else if (model === 'OenBoqStructureId') {
					let oenBoqStructure = _.clone(_.find(boqMainOenBoqStructureService.getList(), {'Id':item.OenBoqStructureId}));
					boqMainDocPropertiesService.setSelectedDocProperties(oenBoqStructure, oenBoqStructure.BoqStructureDetailEntities);
					boqMainDocPropertiesService.setEditVal(false, true);
					catalogFormConfigUpdated();
					$scope.currentItem.OenBoqStructureId = oenBoqStructure.Id; // Must be reset because it gets lost
				}
				else {
					if (urbNames.includes(model)) {
						formConfigUpdated();
						boqMainDocPropertiesService.setModifiedDocProperties($scope.currentItem);
					}
					if(model === 'EnforceStructure') {
						if(item.BoqStandardFk === boqMainStandardTypes.gaeb && item.EnforceStructure === false) {
							var modalOptions = {
								headerTextKey: $translate.instant('boq.main.warning'),
								bodyTextKey: $translate.instant('boq.main.gaebEnforceStructure'),
								showOkButton: true,
								showCancelButton: true,
								iconClass: 'ico-warning'
							};
							return platformModalService.showDialog(modalOptions).then(function (result){
								if(result.ok) {
									formConfigUpdated();
									boqMainDocPropertiesService.setModifiedDocProperties($scope.currentItem);
								}
							}).catch(function(reason) {
								if (reason === 'cancel') {
									$scope.currentItem.EnforceStructure = true;
									boqMainDocPropertiesService.setModifiedDocProperties($scope.currentItem);
								}
							});
						}
					}
				}
			};

			$scope.formOptions = {
				configure: boqMainPropertiesConfigService.getFormConfig($scope.systemPropertiesOnly, $scope.catalogSystemOnly),
				validationMethod: $scope.validateModel
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions
			};

			function updateStructure() {
				$scope.currentItem = boqMainDocPropertiesService.getSelectedDocProp();
				$scope.currentItem.BoqTypeDescription = angular.isDefined(boqDocPropertiesControllerConfig) && (boqDocPropertiesControllerConfig !== null) && boqDocPropertiesControllerConfig.selectedBoqType ? boqDocPropertiesControllerConfig.selectedBoqType.DescriptionInfo.Translated : {};
			}

			function getRidFromConfigureRows() {
				if (boqMainCatalogAssignmentUIConfigService) {
					var configRows = angular.copy(boqMainCatalogAssignmentUIConfigService.getFormConfig().rows);
					return _.map(configRows, 'rid');
				}
			}

			function catalogFormConfigUpdated() {
				var fields = [];
				var readOnly = boqMainDocPropertiesService.arePropertiesReadOnly()/* || (currentDialogMode === 'boqcatalog') */;

				var docProp = boqMainDocPropertiesService.getSelectedDocProp();
				var configRows = angular.copy($scope.formOptions.configure.rows);
				configRows = _.filter(configRows, function (item) {
					return _.includes(getRidFromConfigureRows(), item.rid);
				});

				angular.forEach(configRows, function (row) {
					var readonly = readOnly;
					var isBoqCatalogEditType = readonly && docProp && docProp.editBoqCatalogConfigType; // Find out if current Catalog Assign Type is EditType

					if (currentDialogMode === 'boqcatalog') {
						readonly = false;
					}
					else if (boqMainCommonService.isCrbBoqType($scope.currentItem) || boqMainCommonService.isOenBoqType($scope.currentItem)) {
						readonly = true;
					}
					else {
						if (readOnly) {
							readonly = true;
						} else {
							// the boq catalog assign type has another option
							if (row.rid === 'boqCatalogAssignType') {
								// specific case in customizing module
								readonly = false;
								if ($scope.currentItem.editBoqCatalogConfigType) {
									readonly = true;
								}
							} else if (row.rid === 'editBoqCatalogConfigType') {
								readonly = isBoqCatalogEditType;
							} else if (row.rid === 'boqCatalogAssignDesc') {
								readonly = !$scope.currentItem.editBoqCatalogConfigType;
								if ($scope.catalogSystemOnly && currentDialogMode !== 'boqcatalog') {
									readonly = true;
								}
							}
							else if (row.rid === 'boqCatalogAssignDetails') {
								readonly = !isBoqCatalogEditType;
							}
						}
					}
					fields.push({field: row.model, readonly: readonly}); // rowStatus
				});
				platformRuntimeDataService.readonly(docProp, fields);
			}

			function updateCatalogOptions() {
				updateStructure();
				catalogFormConfigUpdated();
			}

			function catalogDetailsModified() {
				boqMainDocPropertiesService.setModifiedDocProperties($scope.currentItem);
			}

			boqMainDocPropertiesService.updatedStructure.register(updateStructure);
			boqMainCatalogAssignDetailsService.editCatalogChanged.register(updateCatalogOptions);
			boqMainCatalogAssignDetailsService.catalogDetailsModified.register(catalogDetailsModified);

			function formConfigUpdated(versionBoqsDetermined, makeBoqTypeEditable) {
				var fields = [];
				var isAllReadonly = boqMainDocPropertiesService.arePropertiesReadOnly();
				var fieldsAlwaysEditableWhenSpecific = ['NameUrb1',
					'NameUrb2',
					'NameUrb3',
					'NameUrb4',
					'NameUrb5',
					'NameUrb6',
					'NameUserdefined1',
					'NameUserdefined2',
					'NameUserdefined3',
					'NameUserdefined4',
					'NameUserdefined5',
					'CalcFromUrb',
					'LeadingZeros']; // Holds fields that are always editable when structure is specific (i.e. not default).

				var configRows = angular.copy($scope.formOptions.configure.rows);
				configRows = _.filter(configRows, function (item) {
					return !_.includes(getRidFromConfigureRows(), item.rid);
				});

				angular.forEach(configRows, function (row) {
					var isFieldReadonly = isAllReadonly;

					if (isCurrentBoqMainServiceReadOnly) {
						isFieldReadonly = true; // if there is a currentBoqMainService that is set readonly we may not change the document properties either
					}
					else if (!boqMainCommonService.isGaebBoqType($scope.currentItem) && !['type','editConfig','str','standard','oenMask'].includes(row.rid)) {
						isFieldReadonly = true;
					}
					else {
						if (row.rid === 'type') {

							if (!boqMainDocPropertiesService.getSelectedDocProp()) {
								isFieldReadonly = true;
							}
							else {
								if (boqMainDocPropertiesService.getSelectedBoqHeader() === -1) {
									// If there is no boq header we're editing the system properties.
									// In this case the boq type combo should be readonly, because leaving it editable could
									// make the user believe he can edit and save(!!) multiple properties which is not the case.
									// Only the last selected and modified properties are saved when leaving the dialog via the ok button.
									isFieldReadonly = true;
								} else {
									// The type combo box has a special role. It's readonly if there are children or if there are version boqs.
									isFieldReadonly = boqMainDocPropertiesService.doesBoqRootItemHaveChildren() || versionBoqsDetermined;
									isFieldReadonly = isFieldReadonly ? isFieldReadonly && !makeBoqTypeEditable : isFieldReadonly
								}
							}
						}
						else if (row.rid === 'editConfig') {
							if (boqMainDocPropertiesService.getSelectedDocProp().IsChecked) {
								// Here we have a specific structure and we cannot change this state anymore
								// -> make the checkbox readonly
								isFieldReadonly = true;
							} else {
								if (boqMainDocPropertiesService.getSelectedBoqHeader() > 0) {
									// Here we have a system structure that can be transformed into a specific structure if we have not boq items already created based on it.
									isFieldReadonly = false;
								}
							}
						}
						else if (row.rid === 'standard') {
							if (boqMainDocPropertiesService.getSelectedDocProp().OriginBoqStandardFk===boqMainStandardTypes.free && boqMainDocPropertiesService.getSelectedDocProp().IsChecked) {
								isFieldReadonly = false;
							}
						}
						else if (row.rid === 'oenMask') {
							isFieldReadonly |= !boqMainCommonService.isOenBoqType($scope.currentItem); // editable in customize module in an OENORM BOQ
						}
						else if (row.rid === 'skippedHierarchies') {
							// Generally this setting should always be editable, only in case editing already used system properties it should be set readonly
							isFieldReadonly = false;

							if ((boqMainDocPropertiesService.getSelectedBoqHeader() === -1 && boqMainDocPropertiesService.isStructureAlreadyInUse()) ||
								(boqMainDocPropertiesService.getSelectedBoqHeader() > 0 && (!boqMainDocPropertiesService.getSelectedDocProp().IsChecked || (boqMainDocPropertiesService.isStructureAlreadyInUse() && boqMainDocPropertiesService.getSelectedDocProp().SkippedHierarchiesAllowed)))) {
								isFieldReadonly = true;
							}
						}
						else if (boqMainDocPropertiesService.getSelectedDocProp().IsChecked) {
							if (row.rid === 'enfrcStr') {
								// 'Enforce structure' is a little bit special.
								// We make it readonly if the boq structure is already in use and was created with a free structure
								isFieldReadonly = (boqMainDocPropertiesService.isStructureAlreadyInUse() && !boqMainDocPropertiesService.getSelectedDocProp().EnforceStructure);
							}
							else {
								isFieldReadonly = boqMainDocPropertiesService.isStructureAlreadyInUse();
							}
						}

						// Make some rows always editable when being a specific structure regardless of existing boq items in the related boq
						if (boqMainDocPropertiesService.getEditVal() && fieldsAlwaysEditableWhenSpecific.indexOf(row.model) >= 0) {
							isFieldReadonly = false;

							var urbs = [boqMainDocPropertiesService.getSelectedDocProp().NameUrb1,
								boqMainDocPropertiesService.getSelectedDocProp().NameUrb2,
								boqMainDocPropertiesService.getSelectedDocProp().NameUrb3,
								boqMainDocPropertiesService.getSelectedDocProp().NameUrb4,
								boqMainDocPropertiesService.getSelectedDocProp().NameUrb5,
								boqMainDocPropertiesService.getSelectedDocProp().NameUrb6
							];

							if( urbs.every(function (u){return u === null || u === '';}) && row.model === 'CalcFromUrb'){
								isFieldReadonly = true;
								boqMainDocPropertiesService.getSelectedDocProp().CalcFromUrb = false;
							}
						}
					}

					fields.push({'field': row.model, 'readonly': isFieldReadonly}); // rowStatus
				});

				platformRuntimeDataService.readonly(boqMainDocPropertiesService.getSelectedDocProp(), fields);

				boqMainDocPropertiesService.structureDetailsChanged.fire();
				if (boqMainCommonService.isFreeBoqType($scope.currentItem)) {
					boqMainDocPropertiesService.getSelectedDocProp().EnforceStructure          = false;
					boqMainDocPropertiesService.getSelectedDocProp().LeadingZeros              = false;
					boqMainDocPropertiesService.getSelectedDocProp().SkippedHierarchiesAllowed = false;
				}
			}

			boqMainDocPropertiesService.editStructureChanged.register(formConfigUpdated);

			// translate form labels
			boqMainTranslationService.loadTranslations();
			boqMainTranslationService.translateFormContainerOptions($scope.formContainerOptions);

			$scope.error = {
				show: false,
				messageCol: 1,
				message: 'Some properties cannot be edited due to boqs already being built based on the current settings.',
				iconCol: 1,
				type: 1
			};

			// load data from server api
			if (angular.isDefined(boqDocPropertiesControllerConfig.currentBoqMainService) && boqDocPropertiesControllerConfig.currentBoqMainService !== null) {

				boqMainDocPropertiesService.load(boqDocPropertiesControllerConfig.currentBoqMainService);
				boqMainDocPropertiesService.setBoqStructureIsAlreadyInUse(boqDocPropertiesControllerConfig.structureIsAlreadyInUse);
			} else if ($scope.systemPropertiesOnly) {
				if (currentDialogMode === 'default') {
					boqMainDocPropertiesService.loadSystemProperties(boqDocPropertiesControllerConfig.boqTypeFk, boqDocPropertiesControllerConfig.boqStructureFk, boqDocPropertiesControllerConfig.structureIsAlreadyInUse);

					if (boqDocPropertiesControllerConfig.structureIsAlreadyInUse) {
						$scope.error.show = true;
					}
				}
			}
			if ($scope.catalogSystemOnly && currentDialogMode === 'boqcatalog') {
				// load boq catalog assign data
				boqMainDocPropertiesService.getCatalogAssignById(boqDocPropertiesControllerConfig.catConfTypeId, boqDocPropertiesControllerConfig.boqCatalogAssignFk, false);
			}

			function resetConfigValues() {
				boqDocPropertiesControllerConfig.catConfTypeId = null;
				boqDocPropertiesControllerConfig.boqCatalogAssignFk = null;
				boqDocPropertiesControllerConfig.currentBoqMainService = null;
			}

			var filters = [
				{
					key: 'boqTypeFilter',
					serverSide: false,
					fn: function boqTypeFilter(dataItem/* , dataContext */) {
						if (!_.isObject(dataItem) || !_.isNumber(boqDocPropertiesControllerConfig.mdcLineItemContextFk)) {
							return true;
						}

						// In the config for this lookup the customIntProperty was rooted to the 'MDC_LINEITEMCONTEXT_FK'.
						return dataItem.MdcLineitemcontextFk === boqDocPropertiesControllerConfig.mdcLineItemContextFk;
					}
				},
				{
					key: 'boqCatalogAssignType',
					serverSide: false,
					fn: function boqCatalogAssignType(dataItem) {
						if (!_.isObject(dataItem) || !_.isNumber(boqDocPropertiesControllerConfig.mdcLineItemContextFk)) {
							return true;
						}

						return dataItem.LineitemcontextFk === boqDocPropertiesControllerConfig.mdcLineItemContextFk;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			$scope.$on('$destroy', function () {
				boqMainDocPropertiesService.updatedStructure.unregister(updateStructure);
				boqMainDocPropertiesService.editStructureChanged.unregister(formConfigUpdated);
				boqMainCatalogAssignDetailsService.editCatalogChanged.unregister(updateCatalogOptions);
				boqMainCatalogAssignDetailsService.catalogDetailsModified.unregister(catalogDetailsModified);
				boqMainPropertiesDialogService.setDialogMode('default');
				resetConfigValues();
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
				boqMainCatalogAssignCostgroupLookupService.setLineItemContextId(null); // Reset lookup
			});
		})

		.value('boqDocPropertiesControllerConfig', {
			currentBoqMainService: null,
			boqTypeFk: null,
			boqStructureFk: null,
			structureIsAlreadyInUse: null,
			baseBoqRootItemHasChildren: null,
			catConfTypeId: null,
			boqCatalogAssignFk: null,
			isProjectFilter: true,
			mdcLineItemContextFk: null
		});
})();
