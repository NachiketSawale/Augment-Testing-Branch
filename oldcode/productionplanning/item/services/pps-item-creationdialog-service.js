/**
 * Created by zov on 7/18/2019.
 */
(function () {
	'use strict';
	/*global angular, _, moment*/

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemCreationDialogService', ppsItemCreationDialogService);
	ppsItemCreationDialogService.$inject = ['platformModuleStateService',
		'basicsLookupdataLookupDescriptorService', '$injector',
		'$http', 'platformDataValidationService',
		'platformTranslateService', '$q',
		'platformRuntimeDataService', 'basicsLookupdataConfigGenerator',
		'$translate', 'platformDataServiceValidationErrorHandlerExtension',
		'platformObjectHelper',
		'platformDataServiceModificationTrackingExtension'];
	function ppsItemCreationDialogService(platformModuleStateService,
		basicsLookupdataLookupDescriptorService, $injector,
		$http, platformDataValidationService,
		platformTranslateService, $q,
		platformRuntimeDataService, basicsLookupdataConfigGenerator,
		$translate, platformDataServiceValidationErrorHandlerExtension,
		platformObjectHelper,
		platformDataServiceModificationTrackingExtension) {
		var service = {};
		var serviceContainer, createItemFormCfg, rubricCatId;
		var statusLookupFilterkey = 'pps-item-status-on-ribriccat-filter';
		var alerts = [];
		var toCreatingChild = false,
			hasInitValidations = false,
			isSimpleModel = false,
			isOKHandling = false,
			codeIsGenerated = false,
			generatedCode = '';

		let scope = {};

		function hasValidationError(entity) {
			var promises = [];
			if (!hasInitValidations) {
				hasInitValidations = true;
				promises.push(validateNewItem(entity));
			}

			return $q.all(promises).then(function () {
				var modState = platformModuleStateService.state(serviceContainer.service.getModule());
				return !entity.eventsEndDate || modState.validation.issues.some(function (err) {
					return err.entity.Id === entity.Id;
				});
			});
		}

		function clearItemModifications() {
			if(isSimpleModel){
				return;
			}
			let updateData = platformDataServiceModificationTrackingExtension.getModifications(serviceContainer.service);
			platformDataServiceModificationTrackingExtension.clearTranslationChangesInRoot(updateData, serviceContainer.data, serviceContainer.service);
			platformDataServiceModificationTrackingExtension.clearModificationsInRoot(serviceContainer.service);
		}

		function handleOnCreateItemSucceeded(responseData, data, creationData) {
			basicsLookupdataLookupDescriptorService.attachData(responseData);
			return serviceContainer.data.onCreateSucceeded(responseData.Main[0], data, creationData);
		}

		service.init = function (srvContainer, isCreatingChild, isSimpleMod, $scope) {
			scope = $scope;
			serviceContainer = srvContainer;
			rubricCatId = undefined;
			alerts.length = 0;
			toCreatingChild = isCreatingChild;
			isSimpleModel = isSimpleMod;
			hasInitValidations = false;
			isOKHandling = false;
		};

		function setRowsReadonly(entity) {
			var fileds = ['MaterialGroupFk', 'MdcMaterialFk', 'PPSHeaderFk'].map(function (f) {
				return {
					field: f,
					readonly: !entity.LgmJobFk
				};
			});
			fileds.push({
				field: 'SiteFk',
				readonly: !(entity.MaterialGroupFk || entity.MdcMaterialFk)
			});
			fileds.push({
				field: 'Code',
				readonly: codeIsGenerated
			});
			fileds.push({
				field: 'ProductDescriptionFk',
				readonly: !entity.MdcMaterialFk
			});
			platformRuntimeDataService.readonly(entity, fileds);
		}

		service.getAlerts = function () {
			return alerts;
		};

		service.filterStatus = function (item) {
			return rubricCatId !== null && rubricCatId !== undefined && item.BasRubricCategoryFk === rubricCatId;
		};

		service.handleOK = function (dataItem) {
			isOKHandling = true;
			if(generatedCode !== '') {
				dataItem.Code = generatedCode;
			}
			setBusy(true);
			return hasValidationError(dataItem).then(function (hasError) {
				if (!hasError) {
					return serviceContainer.data.doCallHTTPCreate(dataItem, serviceContainer.data, isSimpleModel ? null : handleOnCreateItemSucceeded).then(function (response) {
						var newEntity = response.Main ? response.Main[0] : response;
						clearItemModifications();
						if (dataItem.splitAfterCreation) {
							return $injector.get('productionplanningItemWizardService').doSplitItem(true, newEntity).then(function () {
								return newEntity;
							});
						} else {
							return $q.when(newEntity);
						}
					}, function () {
						return false;
					});
				}

				return $q.when(false);
			}).finally(function () {
				isOKHandling = false;
				setBusy(false);
			});
		};

		service.removeValidationError = function removeValidationError(entity) {
			platformDataValidationService.removeDeletedEntityFromErrorList(entity, serviceContainer.service);
		};

		service.isDisabled = function (button, newItem) {
			if (button === 'ok') {
				var disable = false;
				if (newItem) {
					disable = isOKHandling || !newItem.Code || !newItem.ClerkTecFk || !newItem.LgmJobFk || !newItem.Quantity
						|| !newItem.SiteFk || !newItem.PPSItemStatusFk || !newItem.eventsEndDate;
				}
				return disable;
			} else {
				return false;
			}
		};

		service.getStatusLookupFilterKey = function () {
			return statusLookupFilterkey;
		};

		service.getFromCfg4CreateItem = function getFromCfg4CreateItem() {
			if (!createItemFormCfg) {
				createItemFormCfg = {
					fid: 'productionplanning.item.createItemModal',
					version: '1.0.0',
					showGrouping: false,
					addValidationAutomatically: true,
					groups: [
						{
							gid: 'baseGroup'
						}
					],
					rows: (function () {
						// add basic row
						var toShow = ['lgmjobfk', 'ppsheaderfk', 'materialgroupfk', 'mdcmaterialfk', 'code', 'descriptioninfo', 'clerktecfk',  'sitefk', 'quantity', 'uomfk', 'productdescriptionfk'];
						var uiSrv = $injector.get('productionplanningItemUIStandardService');
						var allRows = uiSrv.getStandardConfigForDetailView().rows;
						var result = [];
						var itemValidationService = $injector.get('productionplanningItemValidationService');
						toShow.forEach(function (rid) {
							var row = _.find(allRows, {rid: rid});
							if (row) {
								var r = _.clone(row);
								r.gid = 'baseGroup';
								result.push(r);
								r.sortOrder = result.length;

								delete r.navigator; //delete navigator

								// add validator
								var colField = r.model.replace(/\./g, '$');
								var syncName = 'validate' + colField;
								var asyncName = 'asyncValidate' + colField;
								if (itemValidationService[syncName]) {
									r.validator = itemValidationService[syncName];
								}
								if (itemValidationService[asyncName]) {
									r.asyncValidator = itemValidationService[asyncName];
								}

								// set ppsHeader and status not readonly
								if (r.rid === 'ppsheaderfk') {
									r.readonly = false;
								}
							}
						});

						// set row change event
						var r = _.find(result, {rid: 'lgmjobfk'});
						r.change = appendRowChangedHandler(r.change, setRowsReadonly);
						r.change = appendRowChangedHandler(r.change, handleJobChanged);
						r = _.find(result, {rid: 'materialgroupfk'});
						r.change = appendRowChangedHandler(r.change, handleMaterialGrpChanged);

						r = _.find(result, {rid: 'mdcmaterialfk'});
						r.change = appendRowChangedHandler(r.change, handleMaterialGrpChanged);

						// // add PpsItemStatusFk row
						// result.push(basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
						//     'basics.customize.ppsitemstatus', undefined, {
						//         gid: 'baseGroup',
						//         rid: 'ppsitemstatusfk',
						//         model: 'PPSItemStatusFk',
						//         sortOrder: result.length + 1,
						//         label: 'ItemStatus',
						//         label$tr$: 'productionplanning.item.itemStausFk',
						//         required: true
						//     }, false, {
						//         showIcon: true,
						//         customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
						//         filterKey: statusLookupFilterkey,
						//         required: true
						//     }
						// ));

						// add "End Date" row
						result = result.concat({
							gid: 'baseGroup',
							rid: 'eventsenddate',
							model: 'eventsEndDate',
							type: 'dateutc',
							label: 'Events End Date',
							label$tr$: 'productionplanning.item.eventsEndDate',
							sortOrder: result.length + 1,
							required: true
						}, {
							gid: 'baseGroup',
							rid: 'splitaftercreation',
							model: 'splitAfterCreation',
							type: 'boolean',
							label: 'Split After Creation',
							label$tr$: 'productionplanning.item.splitAfterCreation',
							sortOrder: result.length + 2
						});

						return result;
					})()
				};
				platformTranslateService.translateFormConfig(createItemFormCfg);
			}

			return createItemFormCfg;
		};

		function appendRowChangedHandler(orgHandler, appendHandler) {
			return function () {
				if (orgHandler) {
					orgHandler.apply(service, arguments);
				}
				appendHandler.apply(service, arguments);
			};
		}

		function handleJobChanged(entity) {
			entity.PPSHeaderFk = 0;
			platformRuntimeDataService.readonly(entity, {field: 'PPSHeaderFk', readonly: toCreatingChild});
			setBusy(true);
			return $http.post(globals.webApiBaseUrl + 'productionplanning/item/getheaderforlgmjob', {
				lgmJobId: entity.LgmJobFk
			}).then(function (response) {
				if (response.data.HeaderID && response.data.HeaderID > 0) {
					entity.PPSHeaderFk = response.data.HeaderID;
					if (response.data.ProjectID && response.data.ProjectID > 0) {
						entity.ProjectFk = response.data.ProjectID;
					}
				} else {
					alerts.push({
						title: $translate.instant('productionplanning.item.creation.alertTitle'),
						message: $translate.instant('productionplanning.item.creation.noHeaderForSelectedJob'),
						css: 'alert-info'
					});
				}
			}).finally(function () {
				setBusy(false);
			});
		}

		function handleMaterialGrpChanged(entity) {
			rubricCatId = undefined; // reset rubric category
			entity.PPSItemStatusFk = 0; // reset status
			entity.SiteFk = 0;
			platformRuntimeDataService.readonly(entity, {field: 'SiteFk', readonly: true});
			setBusy(true);
			return $http.post(globals.webApiBaseUrl + 'productionplanning/item/getsequencecfginfo', {
				ppsHeaderId: entity.PPSHeaderFk,
				materialGroupId: entity.MaterialGroupFk,
				materialId: entity.MdcMaterialFk,
				code: !_.isNil(entity.Code) && entity.Code !== '' && codeIsGenerated === false ? entity.Code : '',
				ppsItemFk: !_.isNil(entity.PPSItemFk) && entity.PPSItemFk !== 0 ? entity.PPSItemFk : 0
			}).then(function (response) {
				if (response.data.Code && (entity.Code === '' || _.isNil(entity.Code) || (generatedCode !== ''))) {
					entity.Code = platformTranslateService.instant('cloud.common.isGenerated').cloud.common.isGenerated;
					codeIsGenerated = true;
					generatedCode = response.data.Code;
				} else {
					if(codeIsGenerated === true){
						entity.Code = '';
					}
					codeIsGenerated = false;
					generatedCode = '';
				}
				if (!entity.SiteFk) {
					entity.SiteFk = response.data.SiteId;
				}
				entity.PPSItemStatusFk = response.data.StatusId;
				if(entity.UpstreamItem && entity.OriginEndDate){
					var date = angular.copy(entity.OriginEndDate);
					entity.eventsEndDate = moment.utc(date.subtract(response.data.Offset, 'seconds').toDate());
				}
				rubricCatId = response.data.RubricCategoryId;
				entity.UomFk = response.data.MaterialUoMFk;
				if (entity.Quantity !== response.data.MaterialMinQuantity && response.data.MaterialMinQuantity > 0) {
					entity.Quantity = response.data.MaterialMinQuantity;
				}
				setRowsReadonly(entity); // make site editable

				// handle alerts
				alerts.length = 0;
				if (_.isNil(rubricCatId)) {
					alerts.push({
						title: $translate.instant('productionplanning.item.creation.alertTitle'),
						message: $translate.instant('productionplanning.item.creation.noMappedSeqConfig'),
						css: 'alert-info'
					});
				} else if (!response.data.CandidacyStatus || response.data.CandidacyStatus.length === 0) {
					alerts.push({
						title: $translate.instant('productionplanning.item.creation.alertTitle'),
						message: $translate.instant('productionplanning.item.creation.noStatus'),
						css: 'alert-info'
					});
				}
				if (!entity.PPSItemStatusFk) {
					alerts.push({
						title: $translate.instant('productionplanning.item.creation.alertTitle'),
						message: $translate.instant('productionplanning.item.creation.noDefaultStatusWithRubCat'),
						css: 'alert-info'
					});
				}
			}).finally(function () {
				setBusy(false);
			});
		}

		service.getNewPpsItem = function (creationData, itemInitializer) {
			setBusy(true);
			var entity = null;
			codeIsGenerated = false;
			generatedCode = '';
			return $http.post(globals.webApiBaseUrl + 'productionplanning/item/create', creationData).then(function (response) {
				entity = response.data;
				if(!entity.eventsEndDate) {
					entity.eventsEndDate = moment.utc(moment().format('YYYY-MM-DD'));
				}
				var defer = $q.defer();
				if(angular.isFunction(itemInitializer)) {
					var init = itemInitializer(entity);
					if(platformObjectHelper.isPromise(init)) {
						init.then(function () {
							defer.resolve(entity);
						});
					} else {
						defer.resolve(entity);
					}
				} else {
					defer.resolve(entity);
				}
				return defer.promise;
			}).then(function (entity) {
				setRowsReadonly(entity);
				return entity;
			}).finally(function () {
				if (entity && (entity.MaterialGroupFk || entity.PPSHeaderFk)) {
					if(entity.MaterialGroupFk) {
						var orgSiteId = entity.SiteFk;
						handleMaterialGrpChanged(entity).then(function () {
							if(orgSiteId) {
								entity.SiteFk = orgSiteId;
							}
						});
					}
					if(entity.PPSHeaderFk) {
						var orgHeaderFk = entity.PPSHeaderFk;
						handleJobChanged(entity).then(function () {
							if(orgHeaderFk) {
								entity.PPSHeaderFk = orgHeaderFk;
							}
						});
					}
				}
				else {
					setBusy(false);
				}
			});
		};

		service.setBusyCallback = null;
		function setBusy(isBusy) {
			if (service.setBusyCallback) {
				service.setBusyCallback(isBusy);
			}
		}

		function validateNewItem(entity) {
			serviceContainer.data.newEntityValidator.validate(entity, serviceContainer.service);
			var modState = platformModuleStateService.state(serviceContainer.service.getModule());
			return platformDataServiceValidationErrorHandlerExtension.waitForAsyncValidation(modState);
		}

		return service;
	}
})();
