(function (angular) {
	'use strict';

	function cloudDesktopSearchFormSaveInformation($templateCache, cloudDesktopSidebarService, cloudDesktopSidebarSearchFormService, $timeout, platformCreateUuid, customTranslateService) {
		return {
			restrict: 'A',
			template: $templateCache.get('sidebar-search-form-wizard-step3'),
			scope: {
				entity: '='
			},
			compile: function () {

				return {
					pre: function (scope, elem) {
						scope.loading = false; // for wait-overlay

						scope.accesLevel = scope.entity.edit ? scope.entity.filterDef.accessLevel : 'u';

						if (!scope.entity.searchFormDefinitionInfo) {
							// initialize object
							scope.entity.searchFormDefinitionInfo = {
								id: scope.entity.edit ? scope.entity.filterDef.id : platformCreateUuid(),
								basedId: scope.entity.filterDef.name, // wird nicht als string gespeichert. ToDo!!!
								name: scope.entity.edit ? scope.entity.filterDef.name : '',
								description: scope.entity.filterDef.description ? scope.entity.filterDef.description : {show: true, text: ''},
								accessLevel: _.findIndex(scope.entity.step3.locationSelectOption.items, {'id': scope.accesLevel}) < 0 ? scope.entity.step3.locationSelectOption.items[0].id : scope.accesLevel,
								shortName: scope.entity.edit ? scope.entity.filterDef.shortname : '',
								moduleName: scope.entity.edit ? scope.entity.filterDef.moduleName : cloudDesktopSidebarService.filterRequest.moduleName
							};
						}

						/*
						 example usecase:
						 available item: Project In Stuttgart
						 --> User taps Project in Stuttgart --> check all sec: exist name in the available-list -> yes -> select this item.
						 But: Next user would like enter Project in Stuttgart and sorround -> problem: the new ID is not exist anymore. Has taken the id from Project in Stuttgart.
						 Because of that: save new id. If needed use take this id back. --> Important for Translation-Object
						 */

						/*
						standars: user --> no Id used
						switch to role or system -> Id needed
						 */
						var saveFirstId;
						if (!scope.entity.edit) {
							setId(scope.entity.searchFormDefinitionInfo.id);
						}

						function setId(id) {
							saveFirstId = id;
						}

						function getId() {
							return saveFirstId;
						}

						function getNewId() {
							var newId;
							if (!getId()) {
								newId = platformCreateUuid();
								setId(newId);
							}
							return getId();
						}

						function checkCountOfAvailablesItems() {
							scope.countOfAvailablesItems = _.filter(scope.availableItems, {'accessLevel': scope.entity.searchFormDefinitionInfo.accessLevel}).length;
						}

						/*
						check the count aof availables Items for search-form.
						count < 1 --> show text like a placeholder
					  */
						scope.accessLevelChanged = function () {
							scope.loading = true;
							checkCountOfAvailablesItems();
							$timeout(function () {
								scope.loading = false;
							}, 0);

							nextStepAllowed();

							checkItemsId();
						};

						function setNewIdForSearchformDefinitionInfo(newId) {
							scope.entity.searchFormDefinitionInfo.id = newId;
							scope.nameCtrlOptions.id = newId;
							scope.descCtrlOptions.id = newId;
						}

						// Name is required field. Is empty -> dont go to next step
						function nextStepAllowed() {
							scope.$parent.$parent.$parent.currentStep.disallowNext = isNameNullOrEmpty(scope.entity.searchFormDefinitionInfo.name);
						}

						function isNameNullOrEmpty(key) {
							return _.isNull(key) || _.isEmpty(key) ? true : false;
						}

						function duplicatetranslationid(newId) {
							customTranslateService.duplicateTranslationId(cloudDesktopSidebarSearchFormService.getSectionName(), scope.entity.searchFormDefinitionInfo.id, newId).then(function () {
								setNewIdForSearchformDefinitionInfo(newId);

								// customTranslateService.saveTranslation(customTranslateService.createTranslationKey(scope.nameCtrlOptions), scope.entity.searchFormDefinitionInfo.name);
							});
						}

						function checkIsAvailable() {
							return _.find(scope.availableItems, {'name': scope.entity.searchFormDefinitionInfo.name, 'accessLevel': scope.entity.searchFormDefinitionInfo.accessLevel});
						}

						function checkItemsId() {
							// check after access-level change, if exist the name in the available-items. yes -> take id and set in object searchFormDefinitionInfo.
							var checkAccessLevelWithName = checkIsAvailable();

							if (checkAccessLevelWithName) {
								setIdForObjectSearchFormDefinitionInfo(checkAccessLevelWithName);
							} else {

								var searchFormDefinitionInfoID = getId() ? getId() : getNewId();

								if (scope.entity.searchFormDefinitionInfo.accessLevel === 'u') {
									/*
									usecase: switch from accesslevel from system to user --> dont get the id from system-item, get new id
								 */
									scope.entity.searchFormDefinitionInfo.id = searchFormDefinitionInfoID;
								} else {
									var currentSearchFormItem = _.find(scope.availableItems, {'id': scope.entity.searchFormDefinitionInfo.id});

									if (currentSearchFormItem && currentSearchFormItem.accessLevel !== 'u') {
										/*
											it should be duplicated if the current item is a role or system a copy. If you do not use a duplicated, then no translations are taken
										 */
										duplicatetranslationid(searchFormDefinitionInfoID);
									} else {
										// create new tokn for the tranlsationcontrol.
										setNewIdForSearchformDefinitionInfo(searchFormDefinitionInfoID);
									}
								}
							}
						}

						function setIdForObjectSearchFormDefinitionInfo(selectedItem) {
							scope.entity.searchFormDefinitionInfo.id = selectedItem.id;
							scope.entity.searchFormDefinitionInfo.name = selectedItem.name;

							scope.descCtrlOptions.id = selectedItem.id;
							scope.nameCtrlOptions.id = selectedItem.id;

							scope.entity.searchFormDefinitionInfo.description = selectedItem.description;
						}

						// list items via Location-Id
						scope.startsWithAccessLevel = function (item) {
							return item.accessLevel === scope.entity.searchFormDefinitionInfo.accessLevel;
						};

						scope.selectAvailableForm = function (item) {
							setIdForObjectSearchFormDefinitionInfo(item);
						};

						cloudDesktopSidebarSearchFormService.loadAllSearchFormFilter(scope.entity.searchFormDefinitionInfo.moduleName).then(function (result) {
							// fill available items. The user can choose whether to save new or select an existing item to save.
							scope.availableItems = result;

							checkCountOfAvailablesItems();
						});

						scope.nameCtrlOptions = {
							onInitiated: function (info) {
								/*
									take old value, if:
									1.) Searchform - edit: szenario: in Accesslevel system and in user exists same name. And you choose name from user-accesslevel then change in system- accesslevel
									2.) Enhanced - create: szenario: Acceslevel user and name/description have contents. Then switch to System: set values for system accesslevel
									3.) scope.entity.searchFormDefinitionInfo.name: is not null or empty
									4.) Enhanced - create: new criterion, change accesslevel to system: name is empty -> dont use setValue()
								 */
								if (!checkIsAvailable() && !isNameNullOrEmpty(scope.entity.searchFormDefinitionInfo.name) && !info.value) {
									customTranslateService.control.setValue(customTranslateService.createTranslationKey(scope.nameCtrlOptions), scope.entity.searchFormDefinitionInfo.name);
								}
							},
							onTranslationChanged: function (info) {
								scope.entity.searchFormDefinitionInfo.name = info.newValue;

								if ((!isNameNullOrEmpty(scope.entity.searchFormDefinitionInfo.name) && info.oldValue !== info.newValue) || (info.newValue && info.newValue !== '')) {
									var checkAccessLevelWithName = checkIsAvailable();

									if (checkAccessLevelWithName) {
										setIdForObjectSearchFormDefinitionInfo(checkAccessLevelWithName);
									} else {
										if (_.find(scope.availableItems, {'id': scope.entity.searchFormDefinitionInfo.id}) && !getId()) {
											// usecase: select an item. And write a new name.
											duplicatetranslationid(getNewId());
										} else {
											if (getId()) {
												setNewIdForSearchformDefinitionInfo(getId());
											}

											// name is saved now! Normally control saved automaticly. Not in wizard.
											// customTranslateService.saveTranslation(customTranslateService.createTranslationKey(scope.nameCtrlOptions), scope.entity.searchFormDefinitionInfo.name);
										}
									}
								}
							},
							section: cloudDesktopSidebarSearchFormService.getSectionName(),
							name: 'name',
							id: scope.entity.searchFormDefinitionInfo.id,
							watchId: true
						};

						scope.descCtrlOptions = {
							onInitiated: function (info) {
								if (!checkIsAvailable() && !isNameNullOrEmpty(scope.entity.searchFormDefinitionInfo.description.text) && !info.value) {
									/*
										UseCase 1: Create wizard -> default User accesslevel -> write a description, switch then to accesslevel system --> description field is empty. Therefore setValue
									 */
									customTranslateService.control.setValue(customTranslateService.createTranslationKey(scope.descCtrlOptions), scope.entity.searchFormDefinitionInfo.description.text);
								}
							},
							onTranslationChanged: function (info) {
								scope.entity.searchFormDefinitionInfo.description.text = info.newValue;
							},
							inputDomain: 'comment',
							section: cloudDesktopSidebarSearchFormService.getSectionName(),
							name: 'description',
							id: scope.entity.searchFormDefinitionInfo.id,
							watchId: true
						};

						scope.$watch('entity.searchFormDefinitionInfo.name', function () {
							nextStepAllowed();
							if (scope.entity.searchFormDefinitionInfo.accessLevel === 'u' && !isNameNullOrEmpty(scope.entity.searchFormDefinitionInfo.name)) {
								checkItemsId();
							}
						});
					}
				};
			}
		};
	}

	cloudDesktopSearchFormSaveInformation.$inject = ['$templateCache', 'cloudDesktopSidebarService', 'cloudDesktopSidebarSearchFormService', '$timeout', 'platformCreateUuid', 'platformCustomTranslateService'];

	angular.module('cloud.desktop').directive('cloudDesktopSearchFormSaveInformation', cloudDesktopSearchFormSaveInformation);
})(angular);