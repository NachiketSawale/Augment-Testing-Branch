/**
 * Created by sus on 2015/3/20.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name procurementCommonMainService
	 * @function
	 *
	 * @description
	 * procurementCommonMainService is the data service for all common related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementCommonHelperService',
		['_', '$injector', '$http', '$translate', 'cloudDesktopSidebarService', 'basicsLookupdataLookupDataService', 'platformGridAPI',
			'procurementContextService', 'platformModuleNavigationService', 'platformModuleInfoService', 'platformObjectHelper',
			'platformDataServiceModificationTrackingExtension', 'platformContextService', '$window',
			function (_, $injector, $http, $translate, cloudDesktopSidebarService, basicsLookupdataLookupDataService, platformGridAPI,
				moduleContext, platformModuleNavigationService, platformModuleInfoService, platformObjectHelper,
				platformDataServiceModificationTrackingExtension, platformContextService, $window) {
				return {
					ModuleStatusHandler: ModuleStatusHandler,
					getNavigationToolbarButton: getNavigationToolbarButton,
					registerNavigation: registerNavigation,
					arrayToDictionary: arrayToDictionary,
					copyCertificatesFromOtherModule: copyCertificatesFromOtherModule,
					createIsPrcrtextTypeFkAndTextModuleTypeFkUniqueFunction: createIsPrcrtextTypeFkAndTextModuleTypeFkUniqueFunction,
					openInquiryWindow: openInquiryWindow,
					setHeaderTextContentNull: setHeaderTextContentNull,
					addAutoSaveHandlerFunctions: addAutoSaveHandlerFunctions
				};

				// get the module status handler, do update readOnly status when module context changed.
				function ModuleStatusHandler(options) {
					// eslint-disable-next-line no-unused-vars
					var self = this, gridId, fromRows = [], formConfiguration;
					var updateFormReadOnly = function () {
						var readOnly = moduleContext.getModuleReadOnly();
						if (readOnly) {
							angular.forEach(fromRows, function (row) {
								row.readonly = true;
							});
						}
					};

					var setGridReadonly = function setGridReadonly() {
						return false;
					};

					var setGridReadOnly = function setGridReadOnly(gridId) {
						unSetGridReadOnly(gridId);
						platformGridAPI.events.register(gridId, 'onBeforeEditCell', setGridReadonly);
					};

					var unSetGridReadOnly = function unSetGridReadOnly(gridId) { // jshint ignore:line
						platformGridAPI.events.unregister(gridId, 'onBeforeEditCell', setGridReadonly);
					};

					var contextValueChanged = function contextValueChanged(key) {
						if (key === moduleContext.moduleReadOnlyKey || key === moduleContext.moduleStatusKey || angular.isUndefined(key)) {
							var readOnly = moduleContext.isReadOnly;
							if (options && options.setReadOnly) {
								readOnly = options.setReadOnly(readOnly);
							}
							if (gridId) {
								if (readOnly) {
									setGridReadOnly(gridId);
								} else {
									unSetGridReadOnly(gridId);
								}
							}
						}
					};

					// update grid readonly status when moduleContext changed
					self.bindGridReadOnlyListener = function bindGridReadOnlyListener(gridid) {
						gridId = gridid;
						contextValueChanged();
					};

					// update form readonly status when moduleContext changed
					self.bindFormReadOnlyListener = function bindFormReadOnlyListener(formOptions) {
						if (formOptions.rows.length > 0) {
							fromRows = formOptions.rows;
							formConfiguration = formOptions;
							updateFormReadOnly();
						}
					};

					self.unbindGridReadOnlyListener = function unbindGridReadOnlyListener(gridId) {
						unSetGridReadOnly(gridId);
						moduleContext.moduleValueChanged.unregister(contextValueChanged);
					};

					moduleContext.moduleValueChanged.register(contextValueChanged);
				}

				function getNavigationToolbarButton(dataService, moduleName, registerService, triggerField) {
					return {
						id: 't-navigation',
						type: 'item',
						caption: $translate.instant('cloud.common.Navigator.goTo') + ' ' + platformModuleInfoService.getModuleDisplayNameById(moduleName),
						iconClass: 'tlb-icons ico-goto ' + _.uniqueId('_navigator'),
						fn: function runNavigation() {
							var entity = dataService.getSelected();
							if (angular.isString(registerService)) {
								$injector.get(registerService);
							}
							if (entity && Object.getOwnPropertyNames(entity).length) {
								platformModuleNavigationService.navigate({moduleName: moduleName, registerService: registerService}, entity, triggerField);
							}
						}
					};
				}

				// register Navigation
				function registerNavigation(httpReadRoute, navigation) {
					platformModuleNavigationService.registerNavigationEndpoint({
						moduleName: navigation.moduleName,
						hide: function (/* entity */) {
							return false;
						},
						navFunc: function (item, triggerField) {
							// TODO the filterSearchFromPKeys return a promise will be better
							//
							var data = navigation.getNavData ? navigation.getNavData(item, triggerField) : item;

							if (angular.isNumber(data)) {
								cloudDesktopSidebarService.filterSearchFromPKeys([data]);
							} else if (angular.isString(data)) {
								cloudDesktopSidebarService.filterSearchFromPattern(data);
							} else if (angular.isArray(data)) {
								cloudDesktopSidebarService.filterSearchFromPKeys(data);
							} else if (platformObjectHelper.isPromise(data)) {
								data.then(function (ids) {
									cloudDesktopSidebarService.filterSearchFromPKeys(ids);
								});
							} else {
								if (angular.isDefined(data.PrcPackageFk)) {
									$http.post(httpReadRoute + (navigation.endRead || 'navigation'), {'PrcPackageFk': data.PrcPackageFk}).then(function (response) {
										cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
									});
								}
							}
						}
					});
				}

				function arrayToDictionary(list, key, value) {
					var result = {};
					angular.forEach(list, function (item) {
						result[get(item, key)] = get(item, value);
					});
					return result;

					function get(obj, func) {
						if (angular.isFunction(func)) {
							return func(obj);
						}
						if (angular.isString(func)) {
							return platformObjectHelper.getValue(obj, func);
						}
						throw 'not get value !';
					}
				}

				// copy certificates from other modules such as 'Material' and 'Project'.
				function copyCertificatesFromOtherModule(options) {
					// dataService, parameter, url are required for this request.
					if (!options || !options.dataService || !options.parameter || !options.url) {
						return;
					}
					var url = options.url;
					var parameter = options.parameter;
					var service = options.dataService;
					var lists = service.getList();
					var idList = [];
					_.forEach(lists, function (item) {
						if (item.BpdCertificateTypeFk > 0) {
							idList.push(item.BpdCertificateTypeFk);
						}
					});
					// check if certificate module has been initialized by checking modification.
					// if [itemName] is null, then treat it as not initializing the certificate module and filter by source from DB.
					if (idList.length === 0) {
						var itemName = service.getItemName();
						var modification = platformDataServiceModificationTrackingExtension.getModifications(service);
						var itemToSave = itemName + 'ToSave';
						var itemToDelete = itemName + 'ToDelete';
						var subModule = options.subModule;
						var subModuleToSave = null;
						var subModuleToDelete = null;
						if (subModule) {
							subModuleToSave = subModule + 'ToSave';
							subModuleToDelete = subModule + 'ToDelete';
						}
						if (!modification || !findModificationForItemName(itemToSave, modification, subModuleToSave) || !findModificationForItemName(itemToDelete, modification, subModuleToDelete)) {
							idList = null;
						}
					}
					// BpdCertificateTypeIds is used to filter Certificates. Generally, BpdCertificateType is unique.
					parameter.BpdCertificateTypeIds = idList;
					$http.post(globals.webApiBaseUrl + url, parameter).then(function (response) {
						if (!_.isNil(response.data)) {
							var responseData = response.data;
							var newCerts = responseData.invCertificatesNew;
							if (newCerts !== null && newCerts.length > 0 && service.createCertificates) {
								service.createCertificates(newCerts);
							}
							// if some BpdCertificateTypes exist, some changes will happen to them.
							var existedCerts = responseData.existedCertificates;
							if (existedCerts !== null && existedCerts.length > 0) {
								_.forEach(existedCerts, function (cert) {
									// may some with some same BpdCtificateType delete but not save to DB yet , so filter and copy.
									var item = _.find(lists, {BpdCertificateTypeFk: cert.BpdCertificateTypeFk || cert.CertificateTypeFk});
									if (item) {
										doModifyItemAndMark(item, cert, false, service);
									}
								});
							}
						}
					});
				}

				// it is for 'copyCertificatesFromOtherModule'.
				function doModifyItemAndMark(item, cert, mark, service) {
					// change according to some conditions.
					if (cert.IsRequiredSub && !item.IsRequiredSub) {
						item.IsRequiredSubSub = cert.IsRequiredSub;
						mark = true;
					}
					if (cert.IsMandatorySub && !item.IsMandatorySubSub) {
						item.IsMandatorySubSub = cert.IsMandatorySub;
						mark = true;
					}
					if (cert.IsRequired && !item.IsRequired) {
						item.IsRequired = cert.IsRequired;
						mark = true;
					}
					if (cert.IsMandatory && !item.IsMandatory) {
						item.IsMandatory = cert.IsMandatory;
						mark = true;
					}
					if (!!cert.CommentText && !item.CommentText) {
						item.CommentText = cert.CommentText;
						mark = true;
					}
					if (mark) {
						service.markItemAsModified(item);
					}
				}

				//
				function findModificationForItemName(itemName, modification, subModuleItemName) {

					if (!modification) {
						return false;
					}
					// if itemName is the property of modification;
					if (!!itemName && !!Object.prototype.hasOwnProperty.call(modification,itemName)) {

						return true;
					}
					// else if itemName is the property of sub module. and now consider the level 1 nested sub module.
					if (!!subModuleItemName && !!modification[subModuleItemName]) {
						var subModuleToSave = modification[subModuleItemName];
						_.forEach(subModuleToSave, function (item) {
							if (_.isFunction(item.hasOwnProperty) && Object.prototype.hasOwnProperty.call(item,subModuleItemName)) {
								return true;
							}
						});
					}

					return false;
				}

				function createIsPrcrtextTypeFkAndTextModuleTypeFkUniqueFunction(platformDataValidationService,
					modelPrcTexttypeFk, modelTextModuleTypeFk) {
					return function isPrcrtextTypeFkAndTextModuleTypeFkUnique(list, id, newObj) {
						if (_.some(list, function (item) {
							if (item.Id === id) {
								return false;
							}
							let isSame = (item[modelPrcTexttypeFk] || null) === (newObj[modelPrcTexttypeFk] || null);
							return isSame && (item[modelTextModuleTypeFk] || null) === (newObj[modelTextModuleTypeFk] || null);
						})) {
							let errMsgObj = '[' + $translate.instant(moduleName + '.headerText.prcTextType') + ', ' + $translate.instant('basics.customize.textmoduletype') + ']';
							return platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage',
								{object: errMsgObj});
						}
						return {apply: true, valid: true};
					};
				}

				function openInquiryWindow(params, url) {
					let companyCode = platformContextService.signedInClientCode;
					let roleId = platformContextService.getContext().permissionRoleId;
					params = angular.extend({
						operation: 'inquiry',
						selection: 'multiple',
						confirm: 1,
						company: companyCode,
						roleId: roleId
					}, params);
					let defaultUrl = '#/api?navigate';
					let api = url ? url : defaultUrl;
					for (let key in params) {
						if (params[key] !== undefined && params[key] !== null) {
							api += '&' + key.toLowerCase() + '=' + encodeURIComponent(params[key]);
						}
					}

					api = $window.location.origin + globals.appBaseUrl + api;
					let win = $window.open(api);

					if (win) {
						win.focus();
					}
				}

				function setHeaderTextContentNull(headerBlobToSave){
					if (headerBlobToSave?.length > 0) {
						/* when header text is empty, the value of ContentString likes below and need to change ContentString to ''
							'<p style="font-size: 10pt; font-family: &quot;Courier New&quot;;"><br class="break"></p>', //package
							'<p style="font-size: 10pt; font-family: Arial;"><br class="break"></p>', //package, constract
							'<p style="font-size: 9.99997pt; font-family: Arial;"><br class="break"></p>' //req
						*/
						let regexp = /^<p style="font-size: [0-9.]+pt; font-family: \D+;"><br class="break"><[/]p>$/;

						_.forEach(headerBlobToSave, function (prcHeaderBlobToSave){
							let result = regexp.exec(prcHeaderBlobToSave.ContentString);
							if (result && result[0] === prcHeaderBlobToSave.ContentString){
								prcHeaderBlobToSave.ContentString = '';
							}
						});
					}

				}


				/**
				 * Adds auto-save handler functions to the service.
				 *
				 * @param {Object} service - The service object to which the functions will be added.
				 * @param {Object} serviceContainer - The container object that holds data and handler functions.
				 */

				function addAutoSaveHandlerFunctions(service, serviceContainer) {
					/**
					 * Reloads entities with unsaved changes.
					 *
					 * 1. Loads the data from the service.
					 * 2. If there are new entities, adds them to the container.
					 * 3. If no new entities and a selected item exists, finds and re-selects the item from the loaded data.
					 */
					service.reLoadWithUnSavedEntities = function () {
						service.setAutoSaveOption(false);
						const selectedItem = service.getSelected();

						const entities = service.getList();
						const newEntities = _.filter(entities, { Version: 0 });
						service.load().then(function (data) {
							if (newEntities.length > 0) {
								service.addUnSavedEntitiesToContainer(newEntities);
							} else if (selectedItem && selectedItem.Id) {
								const item = _.find(data, { Id: selectedItem.Id });
								if (item) {
									service.setSelected(item);
								}
							}
							service.setAutoSaveOption(true);
						});
					};

					/**
					  * Sets the auto-save option for the container.
					  *
					  * @param {boolean} isAutoSave - A boolean value indicating whether auto-save should be enabled or disabled.
					  */
					service.setAutoSaveOption = function (isAutoSave) {
						serviceContainer.data.supportUpdateOnSelectionChanging = isAutoSave;
					};

					/**
					  * Adds new entities to the container if they are not already present.
					  * For each new entity, it determines whether it is the last entity in the list.
					  * If it is the last entity, it calls the handleOnCreateSucceeded method to mark it as selected.
					  * Otherwise, it calls the handleCreateSucceededWithoutSelect method.
					  *
					  * @param {Array} newEntities - The list of new entities to be added to the container.
					  */
					service.addUnSavedEntitiesToContainer = function (newEntities) {
						const entities = service.getList();
						const unSavedEntities = newEntities.filter(entity => !entities.some(e => e.Id === entity.Id));

						unSavedEntities.forEach((newEntity, index) => {
							const isLastEntity = index === unSavedEntities.length - 1;
							const handler = isLastEntity ? serviceContainer.data.handleOnCreateSucceeded : serviceContainer.data.handleCreateSucceededWithoutSelect;
							handler(newEntity, serviceContainer.data);
						});
					};
				}


			}]);
	/**
	 * @ngdoc service
	 * @name procurementModuleName
	 * @function
	 *
	 * @description
	 * collection procurement all module name
	 */
	angular.module(moduleName).value('procurementModuleName', {
		pesModule: 'procurement.pes',
		contractModule: 'procurement.contract',
		requisitionModule: 'procurement.requisition',
		invoiceModule: 'procurement.invoice',
		quoteModule: 'procurement.quote',
		rfqModule: 'procurement.rfq',
		packageModule: 'procurement.package'
	});

})(angular);