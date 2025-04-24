/**
 * Created by Frank on 08.09.2015.
 */
(function (angular) {

	'use strict';
	/**
	 * @ngdoc self
	 * @name platformDataValidationService
	 * @function
	 *
	 * @description
	 * The platformDataValidationService provides common validation functions required by different modules
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('platform').service('platformTranslationUtilitiesService', PlatformTranslationUtilitiesService);

	PlatformTranslationUtilitiesService.$inject = ['_', 'globals', 'platformTranslateService', '$injector'];

	function PlatformTranslationUtilitiesService(_, globals, platformTranslateService, $injector) {
		var self = this;
		var cloudCommonModule = 'cloud.common';

		this.loadModuleTranslation = function loadModuleTranslation(data) {
			if (_.isNil(data.translate)) {
				data.translate = platformTranslateService.instant(data.toTranslate);
			}
		};

		this.reloadModuleTranslation = function reloadModuleTranslation(data) {
			data.translate = null;

			self.loadModuleTranslation(data);

			if (!_.isNil(data.updateCallback)) {
				data.updateCallback();
			}
		};

		this.registerModules = function registerModules(data) {
			// register a module - translation table will be reloaded if module isn't available yet
			return platformTranslateService.registerModule(data.allUsedModules, true)
				.then(function () {
					// if translation is already available, call loadTranslation directly
					self.reloadModuleTranslation(data);
				});
		};

		this.addTranslationServiceInterface = function addTranslationServiceInterface(service, data) {
			service.getTranslationInformation = function (key) {
				var info = data.words[key];

				if (angular.isUndefined(info) || info === null) {
					// Remove prefix from key that's supposed to be separated by a dot and check again.
					key = key.substring(key.indexOf('.') + 1);
					info = data.words[key];
				}

				return info;
			};

			service.getTranslate = function () {
				return data.translate;
			};

			service.registerUpdates = function (callback) {
				data.updateCallback = callback;
				platformTranslateService.translationChanged.register(service.loadTranslations);
			};

			service.unregisterUpdates = function () {
				data.updateCallback = null;
				platformTranslateService.translationChanged.unregister(service.loadTranslations);
			};
		};

		this.addMissingModules = function addMissingModules(modules, words) {
			var usedMod = '';
			var filter = {};
			_.forEach(modules, function (mod) {
				filter[mod] = true;
			});
			_.forEach(words, function (word) {
				usedMod = word.location;
				if (!filter[usedMod]) {
					filter[usedMod] = true;
					modules.push(usedMod);
				}
			});
		};

		this.initializeTranslation = function initializeTranslation(modules, words) {
			var result = {};
			_.forEach(modules, function (mod) {
				result[mod] = [];
			});

			for (var text in words) {
				if (words.hasOwnProperty(text)) {
					var code = words[text].identifier;
					var addTo = words[text].location;

					if(_.isNil(result[addTo])) {
						result[addTo] = [];
					}
					result[addTo].push(code);
				}
			}

			_.forEach(modules, function (mod) {
				result[mod] = _.uniq(result[mod]);
			});

			return result;
		};

		this.addCloudCommonBasicWords = function addCloudCommonBasicWords(words, basicGroup) {
			basicGroup = basicGroup || 'baseGroup';

			words[basicGroup] = {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'};
			words.Code = {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'};
			words.Description = {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'};
			words.DescriptionInfo = {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'};
			words.Remark = {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'};
			words.Comment = {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'};
			if (!words.Quantity) {
				words.Quantity = {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity'};
			}
			words.UoMFk = {location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM'};
			words.Sorting = {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'};
			words.IsDefault = {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'};
			words.IsLive = {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Is Active'};
		};

		this.addHistoryTranslation = function addHistoryTranslation(words, historyGroup) {
			historyGroup = historyGroup || 'entityHistory';

			words[historyGroup] = {location: cloudCommonModule, identifier: 'entityHistory', initial: 'History'};
			words.InsertedAt = {location: cloudCommonModule, identifier: 'entityInsertedAt', initial: 'Inserted At'};
			words.InsertedBy = {location: cloudCommonModule, identifier: 'entityInsertedBy', initial: 'Inserted By'};
			words.UpdatedAt = {location: cloudCommonModule, identifier: 'entityUpdatedAt', initial: 'Updated At'};
			words.UpdatedBy = {location: cloudCommonModule, identifier: 'entityUpdatedBy', initial: 'Updated By'};
			words.Inserted = {location: cloudCommonModule, identifier: 'entityInserted', initial: 'Inserted'};
			words.Updated = {location: cloudCommonModule, identifier: 'entityUpdated', initial: 'Updated'};
			words.Version = {location: cloudCommonModule, identifier: 'entityVersion', initial: 'Version'};
		};

		this.addMultipleTranslations = function addMultipleTranslations(settings) {
			var interFix = settings.interFix || '';
			_.times(settings.count, function (j) {
				var index = j + 1;
				var createdName = settings.preFix + interFix + index;
				settings.words[createdName] = {location: settings.where, identifier: settings.ident, param: {index: '' + index}, initial: settings.default + ' ' + index};

				if (j === 8) {
					interFix = '';
				}
			});
		};

		this.addUserDefinedTextTranslation = function addUserDefinedTextTranslation(words, count, preFix, interFix, userGroup) {
			preFix = preFix || 'UserDefinedText';
			interFix = interFix || '';
			userGroup = userGroup || 'userDefTextGroup';

			words[userGroup] = {location: cloudCommonModule, identifier: 'UserdefTexts', initial: 'Userdefined Texts'};

			/* jshint -W106 */ // For me there is no cyclomatic complexity
			for (var j = 1; j <= count; ++j) {
				var createdName = preFix + interFix + j;
				words[createdName] = {location: cloudCommonModule, identifier: 'entityUserDefText', param: {p_0: '' + j}, initial: 'Text ' + j};

				if (j === 9) {
					interFix = '';
				}
			}
		};

		this.addUserDefinedIntegerTranslation = function addUserDefinedIntegerTranslation(words, count, preFix, interFix, userGroup) {
			preFix = preFix || 'UserDefinedInt';
			interFix = interFix || '';
			userGroup = userGroup || 'userDefIntegerGroup';

			words[userGroup] = {location: cloudCommonModule, identifier: 'UserdefInts', initial: 'Userdefined Integer'};

			/* jshint -W106 */ // For me there is no cyclomatic complexity
			for (var j = 1; j <= count; ++j) {
				var createdName = preFix + interFix + j;
				words[createdName] = {location: cloudCommonModule, identifier: 'entityUserDefInt', param: {p_0: '' + j}, initial: 'Int ' + j};

				if (j === 9) {
					interFix = '';
				}
			}
		};

		this.addUserDefinedNumberTranslation = function addUserDefinedNumberTranslation(words, count, preFix, interFix, userGroup) {
			preFix = preFix || 'UserDefinedNumber';
			interFix = interFix || '';
			userGroup = userGroup || 'userDefNumberGroup';

			words[userGroup] = {location: cloudCommonModule, identifier: 'UserdefNumbers', initial: 'Userdefined Numbers'};

			/* jshint -W106 */ // For me there is no cyclomatic complexity
			for (var j = 1; j <= count; ++j) {
				var createdName = preFix + interFix + j;
				words[createdName] = {location: cloudCommonModule, identifier: 'entityUserDefNumber', param: {p_0: '' + j}, initial: 'Number ' + j};

				if (j === 9) {
					interFix = '';
				}
			}
		};

		this.addUserDefinedDateTranslation = function addUserDefinedDateTranslation(words, count, preFix, interFix, userGroup) {
			preFix = preFix || 'UserDefinedDate';
			interFix = interFix || '';
			userGroup = userGroup || 'userDefDateGroup';

			words[userGroup] = {location: cloudCommonModule, identifier: 'UserdefDates', initial: 'Userdefined Dates'};

			/* jshint -W106 */ // For me there is no cyclomatic complexity
			for (var j = 1; j <= count; ++j) {
				var createdName = preFix + interFix + j;
				words[createdName] = {location: cloudCommonModule, identifier: 'entityUserDefDate', param: {p_0: '' + j}, initial: 'Number ' + j};

				if (j === 9) {
					interFix = '';
				}
			}
		};

		this.addUserDefinedBoolTranslation = function addUserDefinedBoolTranslation(words, count, preFix, interFix, userGroup) {
			preFix = preFix || 'UserDefinedBool';
			interFix = interFix || '';
			userGroup = userGroup || 'userDefBoolGroup';

			words[userGroup] = {location: cloudCommonModule, identifier: 'UserdefBools', initial: 'Userdefined Dates'};

			/* jshint -W106 */ // For me there is no cyclomatic complexity
			for (var j = 1; j <= count; ++j) {
				var createdName = preFix + interFix + j;
				words[createdName] = {location: cloudCommonModule, identifier: 'entityUserDefBool', param: {p_0: '' + j}, initial: 'Number ' + j};

				if (j === 9) {
					interFix = '';
				}
			}
		};

		this.addClerkContainerTranslations = function addClerkContainerTranslations(words) {
			var basicsClerkModule = 'basics.clerk';

			words.clerkListTitle = {location: basicsClerkModule, identifier: 'listClerkTitle', initial: 'Clerks'};
			words.clerkDetailTitle = {location: basicsClerkModule, identifier: 'detailClerkTitle', initial: 'Details Clerk'};
			words.ClerkRoleFk = {location: basicsClerkModule, identifier: 'entityRole', initial: 'Role'};
			words.ClerkFk = {location: basicsClerkModule, identifier: 'entityClerk', initial: 'Clerk'};
			words.ValidFrom = {location: basicsClerkModule, identifier: 'entityValidFrom', initial: 'Valid From'};
			words.ValidTo = {location: basicsClerkModule, identifier: 'entityValidTo', initial: 'Valid To'};
		};

		this.addTeleComTranslation = function addTeleComTranslation(words) {
			words.TelephoneNumberFk = {location: cloudCommonModule, identifier: 'telephoneNumber', initial: 'Phone Nr.'};
			words.TelephoneTelefaxFk = {location: cloudCommonModule, identifier: 'fax', initial: 'Telefax'};
			words.TelephoneMobilFk = {location: cloudCommonModule, identifier: 'mobile', initial: 'Mobile-Nr'};
			words.Email = {location: cloudCommonModule, identifier: 'email', initial: 'Email'};
			words.AddressFk = {location: cloudCommonModule, identifier: 'address', initial: 'Address'};
			words.TelephonePrivatFk = {location: cloudCommonModule, identifier: 'telephonePrivat', initial: 'Privat Telephone-Nr'};
			words.TelephonePrivatMobilFk = {location: cloudCommonModule, identifier: 'privatMobil', initial: 'Telephone Privat Telephone-Nr'};
			words.PrivatEmail = {location: cloudCommonModule, identifier: 'privatEmail', initial: 'Privat E-Mail'};
			words.Internet = {location: cloudCommonModule, identifier: 'internet', initial: 'Internet'};
		};

		this.addModelAndSimulationTranslation = function addModelAndSimulationTranslation(words, includeModel) {
			if (includeModel) {
				words.objectInfosTitle = {location: 'model.main', identifier: 'objectInfoList', initial: 'Object Informations'};
				words.objectInfoDetails = {location: 'model.main', identifier: 'objectInfoDetails', initial: 'Object Information Details'};
			}
			words.hoopsTitle = {location: 'model.viewer', identifier: 'hoops.title', initial: 'Viewer'};
			words.cockpitTitle = {location: 'model.simulation', identifier: 'cockpitTitle', initial: 'Cockpit'};
			words.niceModelNamePattern = {location: 'model.project', identifier: 'niceModelNamePattern', initial: '{{code}} ({{description}})'};
		};

		this.addProjectStockWords = function addProjectStockWords(words) {
			words.StockFk = {location: 'project.stock', identifier: 'entityStock', initial: ''};
			words.StockLocationFk = {location: 'project.stock', identifier: 'entityStockLocation', initial: ''};
		};

		this.addRequisitionAndReservationWords = function addRequisitionAndReservationWords(words) {
			words.ReservationFk = {location: 'resource.reservation', identifier: 'entityReservation', initial: ''};
			words.RequisitionFk = {location: 'resource.requisition', identifier: 'entityRequisition', initial: ''};
		};

		function getExistingSubModules(mainModules, subModules) {
			let subModulesList = [];
			if (_.isArray(mainModules)) {
				_.forEach(globals.modules, function (subModule) {
					_.forEach(mainModules, function (module) {
						if (_.startsWith(subModule, module) && _.findIndex(subModules, function (basModule) {
							return subModule === basModule.InternalName;
						}) !== -1) {
							subModulesList.push(subModule);
						}
					});
				});
			} else {
				_.forEach(globals.modules, function (subModule) {
					if (_.startsWith(subModule, mainModules) && _.findIndex(subModules, function (basModule) {
						return subModule === basModule.InternalName;
					}) !== -1) {
						subModulesList.push(subModule);
					}
				});
			}
			return subModulesList;
		}

		this.getAllSubmodules = function getAllSubmodules(mainModules) {
			let basicsDependentDataModuleLookupService = $injector.get('basicsDependentDataModuleLookupService');
			let subModules = basicsDependentDataModuleLookupService.getList();

			if (_.isNil(subModules) || subModules && subModules.length === 0) {
				return [];
			} else {
				return getExistingSubModules(mainModules, subModules);
			}
		};

		this.loadTranslationsOfMainModules = function (mainModules) {
			let basicsDependentDataModuleLookupService = $injector.get('basicsDependentDataModuleLookupService');
			return basicsDependentDataModuleLookupService.loadData().then(function() {
				let modules = self.getAllSubmodules(mainModules);
				return platformTranslateService.registerModule(modules, true);
			});
		};
	}
})(angular);
