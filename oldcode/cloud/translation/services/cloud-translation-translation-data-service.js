/**
 * Created by baf on 2016-05-04
 */
(function () {
	'use strict';
	const cloudTlsModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name basicsConfigGenWizardStepScriptDataService
	 * @function
	 *
	 * @description
	 * basicsConfigGenWizardStepScriptDataService is a data service for managing scripts applied in steps of generic wizards
	 */
	cloudTlsModule.factory('cloudTranslationTranslationDataService', ['cloudTranslationResourceDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonReadOnlyProcessor', 'platformDataServiceMandatoryFieldsValidatorFactory', 'platformTranslateService', 'cloudTranslationTranslationFieldValidationService', 'globals', '_',

		function (cloudTranslationResourceDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, readOnlyProcessor, mandatoryFieldsValidator, platformTranslateService, cloudTranslationTranslationFieldValidationService, globals, _) {

			const rOnlyProcessor = readOnlyProcessor.createReadOnlyProcessor({
				readOnlyFields: [],
				typeName: 'TranslationDto',
				moduleSubModule: 'Cloud.Translation'
			});

			const translationDataServiceOptions = {
				flatLeafItem: {
					module: cloudTlsModule,
					serviceName: 'basicsConfigGenWizardStepScriptDataService',
					entityNameTranslationID: 'basics.config.entityTranslation',
					httpCreate: {
						route: globals.webApiBaseUrl + 'cloud/translation/translation/',
						endCreate: 'createTranslation'
					},
					httpRead: {
						usePostForRead: true,
						route: globals.webApiBaseUrl + 'cloud/translation/translation/',
						endRead: 'listTranslation'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'TranslationDto',
						moduleSubModule: 'Cloud.Translation'
					}), cloudTranslationTranslationFieldValidationService.getIsChangedProcessor()],
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {
							itemName: 'Translations',
							parentService: cloudTranslationResourceDataService
						}
					},
					modification: {multi: true},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.SuperEntityId = cloudTranslationResourceDataService.getSelected().Id;
							}
						}
					}
				}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(translationDataServiceOptions);

			serviceContainer.data.newEntityValidator = mandatoryFieldsValidator.createValidator('cloudTranslationTranslationValidationService', 'LanguageFk');

			function checkForParent() {
				const selected = cloudTranslationResourceDataService.getSelected();
				return selected && selected.ResourceFk !== null;
			}

			serviceContainer.data.initReadData = function initTranslationReadData(readData) {
				let superId = cloudTranslationResourceDataService.getSelected().Id;
				if (checkForParent()) {
					superId = cloudTranslationResourceDataService.getSelected().ResourceFk;
				}

				readData.SuperEntityId = superId;
			};

			serviceContainer.service.registerListLoaded(function () {
				// when current parent, a resource, has an fk to another resource, translations from the fk are shown, but readonly
				if (checkForParent()) {
					_.each(serviceContainer.service.getList(), function (translationItem) {
						rOnlyProcessor.setRowReadOnly(translationItem, true);
					});
				}
			});

			serviceContainer.service.canCreate = function canCreate() {
				const mainItem = cloudTranslationResourceDataService.getSelected();

				if (mainItem) {
					return !mainItem.ResourceFk;
				}

				return false;
			};

			serviceContainer.service.canDelete = function () {
				const mainItem = cloudTranslationResourceDataService.getSelected();

				if (mainItem) {
					const selected = serviceContainer.service.getSelected();

					return mainItem.ResourceFk ? false : !!selected;
				}

				return false;
			};

			return serviceContainer.service;
		}
	]);
})();