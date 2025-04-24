(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.rfq';
	/**
	 * @ngdoc service
	 * @name procurementRfqBidderCoverLetterService.js
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 *  data service of rfq bidder wizard cover letter container
	 */
	angular.module(moduleName).factory('procurementRfqBidderCoverLetterService', ['_', '$q', '$http', '$log', '$translate', '$injector', 'genericWizardReportService', 'genericWizardNamingParameterConstantService',
		function (_, $q, $http, $log, $translate, $injector, GenericWizardReportService, genericWizardNamingParameterConstantService) {

		function getPlaceholder() {
			const genericWizardService = $injector.get('genericWizardService');
			var defaultBusinessPartnerId = genericWizardService.config.businessPartnerList[0].BusinessPartnerFk;
			var entityId = genericWizardService.getStartEntityId();

			return {
				RfqHeaderID: entityId,
				RfqID: entityId,
				Module_RfqID: entityId,
				RFQID: entityId,
				BidderID: defaultBusinessPartnerId,
				BusinessPartnerID: defaultBusinessPartnerId
			};
		}

		var service = new GenericWizardReportService(moduleName, 'procurementRfqBidderCoverLetterService', getPlaceholder);

		service.wizardFunctions.setSubject = function setSubject() {
			let subject = service.wizardFunctions.getSubject();

			service.wizardFunctions.emailContext.subject = subject;
			service.wizardFunctions.emailContext.defaultSubject = subject;
		};

		service.wizardFunctions.getSubject = function getSubject(idObjectForNamingPatterns/*, useDefault*/) {
			const genericWizardService = $injector.get('genericWizardService');
			let genWizConfig = genericWizardService.config;
			let foundSubjectNamingParam = _.find(genWizConfig.namingParameter, {NamingType: 1});
			let subjectPattern = foundSubjectNamingParam ? foundSubjectNamingParam.Pattern : null;
			let project = genWizConfig.project;
			let rfq = genWizConfig.prcInfo.Rfq[0];
			let subject = genericWizardNamingParameterConstantService.resolveNamingPattern(subjectPattern, idObjectForNamingPatterns/*, useDefault*/);

			if (!subject) {
				if (project) {
					let subjectPropertyArray = [];
					let translatedRfq = $translate.instant('cloud.desktop.moduleDisplayNameRfQ');
					subjectPropertyArray.push(project.ProjectName);
					subjectPropertyArray.push(project.ProjectNo);

					if (project.AddressEntity) {
						subjectPropertyArray.push(project.AddressEntity.City);
					}
					subjectPropertyArray.push(rfq.Description);

					subject = translatedRfq;

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
					subject = $translate.instant('cloud.desktop.moduleDisplayNameRfQ');

					if (rfq.Description) {
						subject += ': ' + rfq.Description;
					}
				}
			}
			return subject;
		};

		return service;
	}]);
})(angular);
