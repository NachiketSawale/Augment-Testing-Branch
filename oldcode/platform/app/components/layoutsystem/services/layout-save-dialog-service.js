(() => {
	'use strict';

	angular.module('platform').factory('platformLayoutSaveDialogService', platformLayoutSaveDialogService);

	platformLayoutSaveDialogService.$inject = ['mainViewService', 'platformCustomTranslateService', 'platformTranslateService', '$q'];


	function platformLayoutSaveDialogService(mainViewService, platformCustomTranslateService, platformTranslateService, $q) {
		let sectionName = 'views';
		let defaultTranslationID = setDefaultTranslationID();

		function getDefaultTranslationID() {
			if(!defaultTranslationID) {
				defaultTranslationID = setDefaultTranslationID();
			}
			return defaultTranslationID;
		}

		function setDefaultTranslationID() {
			let id = 111222333444;
			const currentView = mainViewService.getCurrentView();
			if (currentView) {
				id = `${id}${currentView.BasModuletabFk}`;
				id = parseInt(id);
			}
			return id;
		}

		function registerViewsCustomTranslation() {
			platformTranslateService.registerCustomTranslation('views');
		}


		function translateViewsObject(tabs) {
			platformTranslateService.translateObject(tabs, ['Description'], {recursive: true});
		}

		function setIDForCustomTranslation(viewnameCtrlOptions, selections) {
			if(selections.selectedType.id !== 'u') {
				viewnameCtrlOptions.id = selections.inputView.Id;
			}
		}

		function deleteCustomTranslation(selectedTypeId, id) {
			if(selectedTypeId !== 'u') {
				platformCustomTranslateService.deleteTranslationsById('views', id);
			}
		}

		function setIdForDescriptionTranslation(viewnameCtrlOptions, selectedID) {
			viewnameCtrlOptions.id = selectedID;
		}

		function setNewIdForDescriptionTranslation(inputView, viewnameCtrlOptions) {
			inputView.Id = defaultTranslationID;
			viewnameCtrlOptions.id = defaultTranslationID;
		}

		function checkIsViewAvailable(displayedViews, Description) {
			return _.find(displayedViews, {'Description': Description});
		}

		function checkInputViewTranslation(selections) {
			if (!selections.inputView) {
				selections.inputView = {};
				return false;
			}

			if(!selections.inputView.DescriptionTr || (selections.inputView.DescriptionTr && selections.inputView.DescriptionTr !== -1)) {
				return false;
			}

			if (selections.inputView.Id && selections.inputView.Id !== defaultTranslationID) {
				return true;
			}

			return false;
		}

		function isSelectedTypeUser(selections) {
			if(!selections.Issystem && !selections.IsPortal && !selections.FrmAccessroleFk) {
				return true;
			}
			return false;
		}

		function createTranslationObjectsAfterImport(importViews) {
			//Only when all translations have been created, then leave the function
			const promises = [];

			if(importViews && importViews.length > 0) {
				angular.forEach(importViews, function(view) {
					if(view.layoutType !== 'User' && view.newId && view.translations) {
							let preTrans = view.translations;

							//dont overwrite view?
							if(view.increment) {
								for(let key in preTrans) {
				               if(preTrans[key] !== null) {
					               preTrans[key] = preTrans[key] + '_' + view.increment.toString();
				               }
				            }
							}

							let newTranslationkey = platformCustomTranslateService.createTranslationKey({section: sectionName, id: view.newId, name: 'Description'});

							//create new translation-object
							promises.push(platformCustomTranslateService.saveTranslations(newTranslationkey, preTrans).then(() => {
								platformTranslateService.reloadCustomTranslation(newTranslationkey);
							}));
						}
				});
			} else {
				promises.push($q.when(true));
			}

			return $q.all(promises);
		}

		function renameTranslationDescription(selections, viewnameCtrlOptionsID, newDescription) {
			if(selections.selectedType !== 'u' && viewnameCtrlOptionsID === selections.selectedView.Id) {
				platformCustomTranslateService.saveTranslation(selections.inputView.Description$tr$, newDescription);
			}
		}

		let service = {
			/**
			 * @ngdoc function
			 * @name getDefaultTranslationID
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description get an ID for the translation option. This ID applies to the newly created Translation object.
			 * After saving the view, this ID is replaced with the view ID.
			 * @return { string } Default translations-ID
			 */
			getDefaultTranslationID: getDefaultTranslationID,
			/**
			 * @ngdoc function
			 * @name checkInputViewTranslation
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description checked per VIEW-object whether a new custom translation is created or not.
			 * @param { Object } selections an Item from VIEW-Object(mainview-service)
			 * @return { boolean } true or false
			 */
			checkInputViewTranslation: checkInputViewTranslation,
			/**
			 * @ngdoc function
			 * @name checkIsViewAvailable
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description Check whether the description string exists in one of the VIEWs according to Type(User, System, Role..) or not.
			 * @param { Object } displayedViews filtered (user, role, system) views
			 * @param { String } Description translation-Object string
			 * @return { boolean } undefined or the found Object
			 */
			checkIsViewAvailable: checkIsViewAvailable,
			/**
			 * @ngdoc function
			 * @name setIdForDescriptionTranslation
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description set ID for Translation-Object via selected VIEW-Id.
			 * @param { Object } viewnameCtrlOptions Translation-Object option
			 * @param { Object } selections selected VIEW Object
			 */
			setIdForDescriptionTranslation: setIdForDescriptionTranslation,
			/**
			 * @ngdoc function
			 * @name setNewIdForDescriptionTranslation
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description set Default Translation-Object ID. That means: create new translation Object.
			 * @param { Object } inputView new VIEW-Object
			 * @param { Object } viewnameCtrlOptions Translation-Object option
			 */
			setNewIdForDescriptionTranslation: setNewIdForDescriptionTranslation,
			/**
			 * @ngdoc function
			 * @name setIDForCustomTranslation
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description After new Selection on UI, the translation-Object gets the ID of the selecting VIEW item.
			 * @param { Object } viewnameCtrlOptions Translation-Object option
			 * @param { Object } selections VIEW Object from selected item
			 */
			setIDForCustomTranslation: setIDForCustomTranslation,
			/**
			 * @ngdoc function
			 * @name deleteCustomTranslation
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description Deletes the translation that is defined by the translation key.
			 * @param { string } selectedTypeId Id for selected type (User, Role, System or Portal)
			 * @param { integer } selections ID of the translation-object to be deleted.
			 */
			deleteCustomTranslation: deleteCustomTranslation,
			/**
			 * @ngdoc function
			 * @name renameTranslationDescription
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description rename the description from translation-Object.
			 * @param { object } selections the current ID of the VIEW-Object
			 * @param { integer } viewnameCtrlOptionsID ID from Translation-Object
			 * @param { string } newDescription new description-string for translation-object.
			 */
			renameTranslationDescription: renameTranslationDescription,
			/**
			 * @ngdoc function
			 * @name isSelectedTypeUser
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description Is selected-item from type USER.
			 * @param { Object } selections VIEW Object from selected item
			 */
			isSelectedTypeUser: isSelectedTypeUser,
			/**
			 * @ngdoc function
			 * @name registerViewsCustomTranslation
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description registers custom translation to be loaded.
			 */
			registerViewsCustomTranslation: registerViewsCustomTranslation,
			/**
			 * @ngdoc function
			 * @name translateViewsObject
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description translate the translation-object
			 */
			translateViewsObject: translateViewsObject,
			/**
			 * @ngdoc function
			 * @name createTranslationObjectsAfterImport
			 * @function
			 * @methodOf platformLayoutSaveDialogService
			 * @description duplicate translations-object to new ID after importing.
			 * @param { Object } importViews VIEW Objects after import-view process
			 */
			createTranslationObjectsAfterImport: createTranslationObjectsAfterImport

		};

		return service;
	}
})();