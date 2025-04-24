(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.contract';
	/**
	 * @ngdoc service
	 * @name procurementContractConfirmCoverLetterService.js
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 *  data service of contract confirm wizard cover letter container
	 */
	angular.module(moduleName).factory('procurementContractConfirmCoverLetterService', ['_', '$q', '$http', '$log', '$translate', '$injector', 'genericWizardReportService', 'genericWizardNamingParameterConstantService',
		function (_, $q, $http, $log, $translate, $injector, GenericWizardReportService, genericWizardNamingParameterConstantService) {

			function getPlaceholder() {
				const genericWizardService = $injector.get('genericWizardService');
				var entityId = genericWizardService.getStartEntityId();

				return {
					ConHeaderID: entityId,
					ConID: entityId
				};
			}

			var service = new GenericWizardReportService(moduleName, 'procurementContractConfirmCoverLetterService', getPlaceholder);

			service.wizardFunctions.setSubject = function setSubject() {
				let subject = service.wizardFunctions.getSubject();

				service.wizardFunctions.emailContext.subject = subject;
				service.wizardFunctions.emailContext.defaultSubject = subject;
			};

			service.wizardFunctions.getSubject = function getSubject(idObjectForNamingPatterns) {
				const genericWizardService = $injector.get('genericWizardService');
				let genWizConfig = genericWizardService.config;
				let foundSubjectNamingParam = _.find(genWizConfig.namingParameter, {NamingType: 1});
				let subjectPattern = foundSubjectNamingParam ? foundSubjectNamingParam.Pattern : null;
				let project = genWizConfig.project;
				let contract = genWizConfig.prcInfo.Contract[0];
				let subject = genericWizardNamingParameterConstantService.resolveNamingPattern(subjectPattern, idObjectForNamingPatterns);

				if (!subject) {
					if (project) {
						let subjectPropertyArray = [];
						let translatedContract = $translate.instant('cloud.desktop.moduleDisplayNameContract');
						subjectPropertyArray.push(project.ProjectName);
						subjectPropertyArray.push(project.ProjectNo);

						if (project.AddressEntity) {
							subjectPropertyArray.push(project.AddressEntity.City);
						}
						subjectPropertyArray.push(contract.Description);

						subject = translatedContract;

						_.remove(subjectPropertyArray, function (elem) {
							return !elem;
						});

						_.forEach(subjectPropertyArray, function (elem, index) {
							if (index === 0) {
								subject += ': ';
							}
							if (index > 0) {
								subject += ' - ';
							}
							subject += elem;
						});
					} else {
						subject = $translate.instant('cloud.desktop.moduleDisplayNameContract');

						if (contract.Description) {
							subject += ': ' + contract.Description;
						}
					}
				}
				return subject;
			};

			return service;
		}
	]);
})(angular);
