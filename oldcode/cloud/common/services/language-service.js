/**
 * Created by Rolf Eisenhut on 08.08.2014
 */
/* global Platform:false */
/* global console:false */
(function () {
	/* global globals */
	'use strict';
	const moduleName = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name cloudCommonLanguageService
	 * @function
	 *
	 * @description
	 * uomService is the data service for all uom data functions.
	 */
	angular.module(moduleName).factory('cloudCommonLanguageService',
		['_', '$rootScope', '$http', '$q', '$timeout', 'platformContextService', '$translate',
			function (_, $rootScope, $http, $q, $timeout, platformContextService, $translate) {

				/**
				 * reloading base language info when user data language was changed
				 * @param event
				 */
				function onPlatformContextChanged(event) {
					// if (event === 'language') {
					// _.noop();
					// } else
					if (event === 'dataLanguageId') {
						// console.log('cloudCommonLanguageService re-loading LanguageBaseInfo...', event);
						loadLanguageBaseInfo();
					}
				}

				// register for event, we never deregister
				platformContextService.contextChanged.register(onPlatformContextChanged);

				let service = {};

				// onChangedHandler, will be called once if descriptor item will change from non-modified to modified.
				let onChangedHandler;

				// console.log('cloudCommonLanguageService started....');

				// region definition of java classes with constructor functions
				let DataLanguages = function DataLanguages(dataLanguagesDefaultUser) {
					this.defaultId = dataLanguagesDefaultUser.DatabaseLanguageId;
					this.userId = dataLanguagesDefaultUser.UserLanguageId;
				};
				DataLanguages.prototype.isDefaultLanguage = function (langId) {
					return this.defaultId === langId;
				};
				DataLanguages.prototype.isUserLanguage = function (langId) {
					return this.userId === langId;
				};
				DataLanguages.prototype.isDefaultAndUserLanguage = function (langId) {
					return this.defaultId === langId && this.userId === langId;
				};

				DataLanguages.prototype.getLanguageType = function (langId) {
					return this.isDefaultAndUserLanguage(langId) ? 'Default/User'
						: this.isUserLanguage(langId) ? 'User'
							: this.isDefaultLanguage(langId) ? 'Default' : '';
				};

				// ////////////////////////////////////////////////
				// / LanguageItem type
				// ////////////////////////////////////////////////
				let LanguageCol = function LanguageCol() {
					this.descriptionTr = null;
					this.languageId = null;
					this.reset();
				};
				LanguageCol.prototype.init = function (descriptortranslate) {
					this.descriptionTr = descriptortranslate.Id;
					this.languageId = descriptortranslate.BasLanguageFk;
					this.description = descriptortranslate.Description;
					this.version = descriptortranslate.Version;
					this.modified = false;
					// console.log('LanguageCol.prototype.init', this, descriptortranslate);
				};
				LanguageCol.prototype.initByDescriptorItem = function (descriptorItem) {
					this.descriptionTr = descriptorItem.DescriptionTr;
					this.languageId = 0;
					this.reset();
				};
				LanguageCol.prototype.reset = function () {
					this.description = '';
					this.version = 0;
					this.modified = false;
				};

				// ////////////////////////////////////////////////
				// / LanguageItem type
				// ////////////////////////////////////////////////
				let LanguageItem = function LanguageItem(item) {
					this.Id = item.Id;
					this.description = (item.DescriptionInfo)?item.DescriptionInfo.Description: item.Description;
					this.languageType = '';
				};

				// endregion
				Object.defineProperties(LanguageItem.prototype, {
					'displayColumn': {
						get: function () {
							return this.description + (this.languageType.length > 0 ? '*' : '');
						}, enumerable: true
						// set: function(){
						// console.log ('called');
						// }
					}
				});
				// private code
				let baseLoadingValid = false;     // indicates loading of service was valid
				let allLanguagesDtos = [];
				let dataLangs = [];
				let items;                        // holds all languages row displayed in grid
				let currentItem;
				let timeoutDefer = null;
				let myViewIdentifier;
				let loadLanguagePromise;
				let loadLanguageStarted = false;

				// currentDescriptorsInfo holds the descriptors and other info locally, for later autoSave of modified data
				let currentDescriptorsInfo;
				let currentHeaderInfo;
				// is true if there is the language Container attached to service....

				let dataDefUserLanguages = {};
				service.isContainerConnected = false;

				// define messengers here
				service.itemsLoaded = new Platform.Messenger();
				// service.selectedItemChanged = new Platform.Messenger();
				// service.itemChanged = new Platform.Messenger();
				service.onLanguageItemChanged = new Platform.Messenger();
				service.onPrepareForSave = new Platform.Messenger();
				service.itemsChanged = new Platform.Messenger();
				service.refreshGrid = new Platform.Messenger();
				let onBaseLanguageLoadingDone = new Platform.Messenger(); // local event handler

				/**
				 * this function clears the current language items.
				 */
				function resetLanguageItem() {
					myViewIdentifier = {id: ''};
					currentHeaderInfo = {};
					currentItem = {};
					currentDescriptorsInfo = {languageDescriptors: null, modified: false};
					items = [];
				}

				resetLanguageItem();

				// this methods returns all Languages Dto, used for comboboxes list
				service.getLanguageItems = function () {
					let deferred = $q.defer();
					if (baseLoadingValid) {
						deferred.resolve(allLanguagesDtos);
						return deferred.promise;
					} else {
						let promise = loadLanguageBaseInfo();
						promise.then(function () {
							// return allLanguagesDtos;
							deferred.resolve(allLanguagesDtos);
						});
						return deferred.promise;
					}
				};

				service.setCurrentItem = function (item) {
					if (item === undefined) {
						return;
					}
					currentItem = item;
				};

				service.setViewIdentifier = function (id) {
					myViewIdentifier.id = id;
				};

				service.getViewIdentifier = function () {
					return myViewIdentifier.id;
				};

				service.getCurrentItem = function () {
					return currentItem;
				};

				service.getItems = function () {
					return items;
				};

				/*
				function dumpItems() { // jshint ignore:line
					console.log('dumpItems() Start');
					// console.table(items);
					_.forEach(items, function (i) {
						console.log('dumpItems() LangCol0 ', i.LangCol0);
					});
				}
				*/

				// delayed execution of loading the data......
				function DoUpdate() {
					if (currentDescriptorsInfo && currentDescriptorsInfo.languageDescriptors) {
						loadTranslationsToAllDescriptors(currentDescriptorsInfo.languageDescriptors);
						timeoutDefer = null;
					}
				}

				service.loadTranslationsToAllDescriptors = DoUpdate;

				/**
				 *
				 * @param headerInfo
				 */
				service.publishColumnsChanged = function (headerInfo) {
					if (!headerInfo) {
						headerInfo = currentHeaderInfo;
					}
					if (!headerInfo) {
						return;
					}

					let xlatedHeader = [];
					_.forEach(headerInfo.columnHeaderNames, function (item) {
						xlatedHeader.push($translate.instant(item));
					});
					service.onLanguageItemChanged.fire(
						{
							containerInfoText: $translate.instant(headerInfo.containerInfoText),
							columnHeaderNames: xlatedHeader, // currentItemOptions.columnHeaderNames,
							maxLengthInfo: headerInfo.languageDescriptorsMaxLen,
							columnFields: headerInfo.columnFields,
							containerService: headerInfo.containerService,
							containerData: headerInfo.containerData
						});
				};

				/**
				 * This method initializes or refreshes the language translation view.
				 * If viewIdentifier is different from the last call, the view is initialized,
				 * otherwise just the trnalsation values are updated
				 * @method setLanguageItem
				 * @param {Object}   currentItemOptions   Options for the current language descriptor to be displayed
				 currentItemOptions{
            viewIdentifier:      {string},  unique identifier for the kind of dto item, i.e canbe a guid
            containerInfoText:   {string}   the info text to be displayed in header of the language container
            columnHeaderNames:   {array},   array of string, each string item is the header of the language array colummn
            languageDescriptors: {array},   array of descriptortype DescriptionTranslateTypeDto, each per column to be displayed
            languageDescriptorsMaxLen: {integer array optional},   array of maxLength value corresponding to the languageDescriptors array
            destLanguageDescriptors: {array},   array of destination descriptortype DescriptionTranslateTypeDto, each per column to be saved to
            autoSave:            {bool}     if true, save data to CurrentLanguageDescriptor
            onChanged:           {function}         will be called, as soon as an modification is done
            }
				 **/
				service.setLanguageItem = function (currentItemOptions) {
					if (!currentItemOptions) {
						throw new Error('setLanguageItem(): currentItemOptions must not be null');
					}
					if (!currentItemOptions.languageDescriptors) {
						throw new Error('setLanguageItem(): currentItemOptions.languageDescriptors must not be null');
					}

					service.prepareForSave(); // implicite call prepare for save

					if (currentItemOptions.autoSave) {
						// before we continue, first check if there are modifications form the previous object
						saveChangesToCurrentLanguageDescriptor();
					}

					if (currentDescriptorsInfo.modified && currentItemOptions.destLanguageDescriptors !== null) {
						attachOtherLanguageChanges(myViewIdentifier.id, currentItemOptions.destLanguageDescriptors);
					}

					// check if there is a change in the view occured
					if (currentItemOptions.viewIdentifier !== myViewIdentifier.id) {

						myViewIdentifier.id = currentItemOptions.viewIdentifier;

						onChangedHandler = currentItemOptions.onChanged; // attach on changed handler

						initDefaultLanguages(allLanguagesDtos, currentItemOptions.languageDescriptors.length);

						// extend each language row by translation item
						items.forEach(function (langItem) {
							// now create the new columns
							let colIndex = 0;
							currentItemOptions.languageDescriptors.forEach(function (theDescriptorItem) {
								if (theDescriptorItem) {
									let item = langItem['LangCol' + colIndex];
									item.initByDescriptorItem(theDescriptorItem);
									item.description = '';
									colIndex++;
								}
							});
						});
						// save header info for restoring grid container...
						currentHeaderInfo.columnHeaderNames = currentItemOptions.columnHeaderNames;
						currentHeaderInfo.containerInfoText = currentItemOptions.containerInfoText;
						currentHeaderInfo.languageDescriptorsMaxLen = currentItemOptions.languageDescriptorsMaxLen;
						currentHeaderInfo.columnFields = currentItemOptions.columnFields;
						currentHeaderInfo.containerService = currentItemOptions.containerService;
						currentHeaderInfo.containerData = currentItemOptions.containerData;
						service.publishColumnsChanged(currentHeaderInfo);
					}

					currentDescriptorsInfo.languageDescriptors = currentItemOptions.languageDescriptors;
					currentDescriptorsInfo.modified = false;

					// dumpItems();

					if (timeoutDefer !== null) {
						$timeout.cancel(timeoutDefer);
					}

					// only update when container is attached to view
					if (service.isContainerConnected) {
						timeoutDefer = $timeout(DoUpdate, 300);
						// dumpItems();
					}
				};

				function loadTranslationsToAllDescriptors(languageDescriptors) {
					let colIndex = 0;
					languageDescriptors.forEach(function (theDescriptorItem) {
						if (theDescriptorItem) {
							// load for each item the translations
							if (theDescriptorItem.DescriptionTr !== null) {
								loadTranslationValuesToColumn(colIndex, theDescriptorItem);
							} else {
								updateTranslationItem(colIndex, theDescriptorItem, null);
							}
							colIndex++;
						}
					});
				}

				/* This function saves all changes to the languageDescriptors.
				 *
				 * @method saveCurrentData
				 * @param saveOptions  {object}     Options for the current language descriptor to be displayed
				 saveOptions{
				 viewIdentifier:      {string},  unique identifier for the kind of dto item, i.e canbe a guid
				 languageDescriptors: {array},   array of descriptortype DescriptionTranslateTypeDto, each per column to be displayed
				 }
				 */
				service.saveCurrentData = function (saveOptions) {

					// handle wrong api parameters
					if (!saveOptions) {
						throw new Error('saveCurrentData(): saveOptions must not be null');
					}
					if (!saveOptions.languageDescriptors) {
						throw new Error('saveCurrentData(): saveOptions.languageDescriptors must not be null');
					}
					if (angular.isDefined(myViewIdentifier.id) && (saveOptions.viewIdentifier !== myViewIdentifier.id)) {
						// throw new Error('saveCurrentData(): saveOptions.viewIdentifier must not be different from current in view');
						// console.log('saveCurrentData(): saveOptions.viewIdentifier must not be different from current in view');
						return;
					}
					// console.log('before prepareForSave');
					// dumpItems();
					service.prepareForSave(); // implicit call prepare for save
					// console.log('after prepareForSave');
					// dumpItems();
					// check if there is a modification
					if (currentDescriptorsInfo.modified) {
						if (!saveOptions.languageDescriptors) {
							saveChangesToCurrentLanguageDescriptor();
						} else {
							attachOtherLanguageChanges(myViewIdentifier.id, saveOptions.languageDescriptors);
						}
					}
				};

				/* @method prepareForSave
				 this function tells the language controller via an event to save unsave data, if there is an open
				 cell editor in the grid
				 */
				service.prepareForSave = function () {
					service.onPrepareForSave.fire();
				};

				/* This method updated/merges the concurrency properties for each language descriptor
				 * and resets the modified flags.
				 * You must call this method after save the data to the backend server
				 *
				 * @method updateCurrentDataAfterSave
				 * @param saveOptions  {object}     Options for the current language descriptor to be displayed
				 *       saveOptions{
				 *        viewIdentifier:      {string},  unique identifier for the kind of dto item, i.e canbe a guid
				 *        languageDescriptors: {array},   array of descriptortype DescriptionTranslateTypeDto, each per column to be displayed
				 *       }
				 */
				service.updateCurrentDataAfterSave = function (saveOptions) {

					// handle wrong api parameters
					if (!saveOptions) {
						throw new Error('updateCurrentDataAfterSave(): saveOptions mustnot be null');
					}
					if (!saveOptions.languageDescriptors) {
						throw new Error('updateCurrentDataAfterSave(): saveOptions.languageDescriptors must not be null');
					}

					// remark: rei:  uncomment this check is evil... if the identifiers are different and this method will be call
					//               it must be checked why is the method call, and not just uncomment the code !!!!!
					// there will throw error when the user not update the last container's data, because of the current view can't be turn back
					//   >>> merge .... mustn't be called
					if (saveOptions.viewIdentifier !== myViewIdentifier.id) {
						// console.log ('updateCurrentDataAfterSave(): saveOptions.viewIdentifier must not be different from current in view');
						return;
					}

					// there are two ways to update translation, first just refresh all by reloading value or merge it with current values, without backend
					// round trip
					// loadTranslationsToAllDescriptors(saveOptions.languageDescriptors);
					mergeOtherLanguageChanges(myViewIdentifier.id, saveOptions.languageDescriptors);
				};

				/**
				 * attach the language changes to the current language descriptors
				 *  @method saveChangesToCurrentLanguageDescriptor
				 **/
				let saveChangesToCurrentLanguageDescriptor = function () { // jshint ignore: line
					// check if there is a modification
					if (currentDescriptorsInfo !== null && currentDescriptorsInfo.languageDescriptors !== null && currentDescriptorsInfo.modified) {
						attachOtherLanguageChanges(myViewIdentifier.id, currentDescriptorsInfo.languageDescriptors);
					}
				};

				function loadTranslationValuesToColumn(colIndex, theDescriptorItem) {

					if (theDescriptorItem.DescriptionTr !== null) {
						$http({
							method: 'GET',
							url: globals.webApiBaseUrl + 'cloud/common/gettranslation',
							params: {'id': theDescriptorItem.DescriptionTr}
						}).then(function (response) {
							updateTranslationItem(colIndex, theDescriptorItem, response.data);
						});

						/* template for using only one call when reading descriptors....
						 $http({
						 method: 'GET',
						 url: globals.webApiBaseUrl + 'cloud/common/gettranslations',
						 params: {'ids': [theDescriptorItem.DescriptionTr, theDescriptorItem.DescriptionTr, theDescriptorItem.DescriptionTr]}
						 //params: {'ids': JSON.stringify([theDescriptorItem.DescriptionTr])}
						 }).then(function (response) {
						 // var returned = response.data;
						 console.log ('cloud/common/gettranslations');
						 console.log (response.data);
						 });
						 */
					} else {
						updateTranslationItem(colIndex, theDescriptorItem, null);
					}
				}

				let updateTranslationItem = function (colIndex, theDescriptorItem, responseTranslations) { // jshint ignore: line

					if (items === undefined) {
						return;
					}

					if (responseTranslations === null) {
						// no translation available .... cleanup column values
						items.forEach(function (language) {
							if (language['LangCol' + colIndex]) { // clean
								language['LangCol' + colIndex].descriptionTr = theDescriptorItem.DescriptionTr;
								language['LangCol' + colIndex].description = '';
								language['LangCol' + colIndex].version = 0;
							} else {
								language['LangCol' + colIndex] = new LanguageCol();
								language['LangCol' + colIndex].initByDescriptorItem(theDescriptorItem);
							}
						});

					} else {
						items.forEach(function (language) {
							let found = false;
							if (language['LangCol' + colIndex] !== undefined) {
								responseTranslations.forEach(function (responseTranslation) {
									if (responseTranslation.BasLanguageFk === language.Id) {
										language['LangCol' + colIndex].init(responseTranslation);
										found = true;
									}
								});
								if (!found && language['LangCol' + colIndex] !== undefined) { // clean
									language['LangCol' + colIndex].initByDescriptorItem(theDescriptorItem);
								}
							} else {
								console.log('%info% updateTranslationItem()-1: language.LangCol' + colIndex + ' not defined ');
							}
						});
					}

					// now search default language row and take description from there as the language value
					items.forEach(function (language) {
						if (language['LangCol' + colIndex] !== undefined) {
							if (dataDefUserLanguages.isDefaultLanguage(language.Id)) {
								language['LangCol' + colIndex].description = theDescriptorItem.Description;
							}
						} else {
							console.log('%info% updateTranslationItem()-2: language.LangCol' + colIndex + ' not defined ');
						}
					});

					// overload previous changes saved in OtherLanguages array to the corresponding item
					if (theDescriptorItem.Modified && theDescriptorItem.OtherLanguages && theDescriptorItem.OtherLanguages.length > 0) {
						currentDescriptorsInfo.modified = true;
						theDescriptorItem.OtherLanguages.forEach(function (otherLangItem) {
							let languageItem = _.find(items, function (item) {
								return item.Id === otherLangItem.LanguageId;
							});
							if (languageItem) {
								let descriptorCol = languageItem['LangCol' + colIndex];
								descriptorCol.description = otherLangItem.Description;
								descriptorCol.version = otherLangItem.Version;
								descriptorCol.modified = true;
							}
						});
					}

					service.itemsChanged.fire();
				};

				// /////////////////////////////////////////////////////////////
				// find all changes of all translation columns and languages
				function resetDescriptorItems(theDescriptorItems) {
					// cleanup old one
					theDescriptorItems.forEach(function (theDescriptorItem) {
						theDescriptorItem.Modified = false;
						if (theDescriptorItem.OtherLanguages) {
							theDescriptorItem.OtherLanguages.length = 0;
						}
					});
				}

				// /////////////////////////////////////////////////////////////
				// find all changes of all translation columns and languages and
				// attach it to the descriptor item
				let attachOtherLanguageChanges = function (theIdentifier, theDescriptorItems) { // jshint ignore: line
					if (theDescriptorItems === undefined) {
						return;
					}
					if (theIdentifier !== myViewIdentifier.id) {
						console.error('attachOtherLanguageChanges():  Wrong View identifier, attach request from wrong service initiated');
						return;
					}

					resetDescriptorItems(theDescriptorItems);
					items.forEach(function (languageRow) {   // items >> all language from BAS_LANGUAGE
						let idx = 0;
						theDescriptorItems.forEach(function (theDescriptorItem) {
							let langColItem = languageRow['LangCol' + idx];
							if (langColItem.modified) {
								theDescriptorItem.Modified = true; // 11.Jun.2015@rei added

								// is languageRow = Default Database Language
								if (dataDefUserLanguages.isDefaultLanguage(languageRow.Id)) {
									theDescriptorItem.Description = langColItem.description;
									theDescriptorItem.DescriptionModified = true; // added 30.10.2015@rei, handles issue with mark description is not set with correct value.
								}
								// for all other language changes are placed into the OtherLanguages array
								else {
									let otherLang = {
										LanguageId: languageRow.Id,
										Description: langColItem.description,
										Version: langColItem.version
									};
									if (!theDescriptorItem.OtherLanguages) {
										theDescriptorItem.OtherLanguages = [];
									}
									theDescriptorItem.OtherLanguages.push(otherLang);
								}
							}
							idx++;
						});
					});
				};

				/*
				 *   @description    this method merges the changes coming from the backend via the OtherLanguage array in the descriptoritem
				 *
				 */
				function mergeOtherLanguageChanges(theIdentifier, theDescriptorItems) {
					if (theDescriptorItems === undefined) {
						return;
					}
					let forceRefresh = false;
					if (theIdentifier !== myViewIdentifier.id) {
						console.error('resetOtherLanguageChanges():  Wrong View identifier, reset request from wrong service initiated');
						return;
					}

					function processOtherLanguages(otherLangItem, descriptionIdx, descriptionItem) {
						items.forEach(function (languageRow) {
							const languageRowDescCol = languageRow['LangCol' + descriptionIdx];
							// console.log('processOtherLanguages>', languageRowDescCol);

							// is languageRow = Default Database Language
							if (dataDefUserLanguages.isDefaultLanguage(languageRow.Id)) {
								languageRowDescCol.modified = false;
								if (languageRowDescCol.description !== descriptionItem.Description) {
									languageRowDescCol.description = descriptionItem.Description;
									forceRefresh = true;
								}
							} else {
								if (otherLangItem.LanguageId === languageRow.Id) {
									languageRowDescCol.modified = false;
									languageRowDescCol.version = otherLangItem.Version;
									if (languageRowDescCol.description !== otherLangItem.Description) { // refresh description if it was updated from backend
										languageRowDescCol.description = otherLangItem.Description;
										forceRefresh = true;
									}
								}
								// in case of new Translation item have been created, the descriptorTr propert< has now a valid value
								if (languageRowDescCol.descriptionTr === null && descriptionItem.DescriptionTr !== null) {
									languageRowDescCol.descriptionTr = descriptionItem.DescriptionTr;
								}
							}
							// console.log('processOtherLanguages<', languageRowDescCol);
						});
					}

					// leave for loop here, because we need an index
					let defaultLanguageRow = _.find(items, {Id: dataDefUserLanguages.defaultId});

					for (let descIdx = 0; descIdx < theDescriptorItems.length; descIdx++) {  // jshint ignore: line
						let descItem = theDescriptorItems[descIdx];                            // jshint ignore: line

						if (_.isNil(descItem.OtherLanguages)) {
							// there is the change only default language changed by new descriptor of a not default language
							if (defaultLanguageRow) {
								defaultLanguageRow['LangCol' + descIdx].description = descItem.Description;
							}
							descItem.Modified = false; // if there is a change we  clean it up
							continue;
						}

						// save new update version or descriptor_tr values into languageitem
						descItem.OtherLanguages.forEach(function (otherLanguage/*,idx,origin*/) {
							processOtherLanguages(otherLanguage, descIdx, descItem);
						});

						// because value saved, we no longer keep modified value
						descItem.Modified = false;
						descItem.OtherLanguages.length = 0;
					}

					currentDescriptorsInfo.languageDescriptors = theDescriptorItems;
					currentDescriptorsInfo.modified = false;
					if (forceRefresh) {
						service.refreshGrid.fire();
					}
				}

				service.setItemModified = function (propertyName, item) {
					if (item !== null) {
						// this is a hack and should be changed, as soon grid and textinput can handle complex java objects
						// retrieve index from propertyName
						const index = propertyName.replace('LangCol', '').replace('.description', '');
						let theItem = _.find(items, {Id: item.Id});
						theItem['LangCol' + index].modified = true;

						// send modified only once....
						// if (!currentDescriptorsInfo.modified && _.isFunction(onChangedHandler)) {
						if (_.isFunction(onChangedHandler)) {
							attachOtherLanguageChanges(myViewIdentifier.id, currentDescriptorsInfo.languageDescriptors);
							onChangedHandler(currentDescriptorsInfo.languageDescriptors);
						}
						currentDescriptorsInfo.modified = true;  // notice it least one modification is there
					}
				};

				service.reload = function () {
					loadLanguageBaseInfo();
				};

				function initDefaultLanguages(response, dynColumnsCount) {
					items.length = 0;
					response.forEach(function (language) {
						// dataDefUserLanguages.isUserLanguage(item.Id)
						if (!dataDefUserLanguages.isUserLanguage(language.Id)) {
							// var newOne = createTranslateItem(language, -1, 0);
							let newOne = new LanguageItem(language);
							newOne.languageType = dataDefUserLanguages.getLanguageType(newOne.Id);
							for (let i = 0; i < dynColumnsCount; i++) {
								newOne['LangCol' + i] = new LanguageCol();
							}
							items.push(newOne);
						}
					});
				}

				/*
				 * @method loadLanguageBaseInfo
				 *
				 * loads the default/user language settings and the languages from bas_languages table
				 *
				 */
				function loadLanguageBaseInfo(onBaseLanguageLoadingDoneEventParam) {

					function loadDefUserLangDeferred() {
						if (dataLangs.length > 0) {
							return $q.when(dataLangs);
						} else {
							return $http(
								{
									method: 'GET',
									url: globals.webApiBaseUrl + 'cloud/common/getdatalanguageinfo'
								}).then((response) => {
								return response.data;
							});
						}
					}

					function allLanguagesDeferred() {
						if (allLanguagesDtos.length > 0) {
							return $q.when(allLanguagesDtos);
						} else {
							return $http(
								{
									method: 'GET',
									url: globals.webApiBaseUrl + 'cloud/common/getlanguages'
								}).then((response) => {
								return response.data;
							});
						}
					}

					if (loadLanguageStarted) {
						// console.log('loading loadLanguageBaseInfo already started');
						return loadLanguagePromise;
					}

					// console.log('loading loadLanguageBaseInfo started');
					loadLanguageStarted = true;
					// wait for all service calls to be finished
					loadLanguagePromise = $q.all([
						loadDefUserLangDeferred(), allLanguagesDeferred()
					]).then(
						function (responses) { // responses[0] is response from first call, and so on
							dataLangs = responses[0];
							allLanguagesDtos = responses[1];

							dataDefUserLanguages = new DataLanguages(dataLangs);
							baseLoadingValid = true;
							if (onBaseLanguageLoadingDoneEventParam) {
								onBaseLanguageLoadingDone.fire(null, onBaseLanguageLoadingDoneEventParam);
							}
							loadLanguageStarted = false;
						})
						.catch(function (error) {
							console.log('loadLanguageBaseInfo() failed see: ', error);
							loadLanguageStarted = false;
						});
					return loadLanguagePromise;
				}

				$rootScope.$on('$viewContentLoading', function (/* event, viewConfig */) {
					// console.log('language Service: $viewContentLoading container connected?: ', service.isContainerConnected);
					resetLanguageItem();
				});

				/**
				 * init language service
				 */
				service.init = function () {
					// console.log('language service init called....');
					return loadLanguageBaseInfo();
				};

				return service;
			}]);
})();
