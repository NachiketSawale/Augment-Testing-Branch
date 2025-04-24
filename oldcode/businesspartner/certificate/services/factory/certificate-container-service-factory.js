/**
 * Created by wui on 5/20/2015.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.certificate';

	/* jshint -W072 */// this function has too many parameters.
	angular.module(moduleName).factory('businesspartnerCertificateCertificateContainerServiceFactory', [
		'businesspartnerCertificateCertificateDataServiceFactory', 'platformUIStandardConfigService', 'platformSchemaService',
		'platformUIStandardExtentService', 'businesspartnerCertificateCertificateValidationServiceFactory',
		'businesspartnerCertificateCertificateLayout', 'businesspartnerCertificateToBpLayout', 'businesspartnerCertificateToContractLayout', 'businesspartnerCertificateToQuoteLayout', 'businesspartnerCertificateToInvoiceLayout',
		'businesspartnerCertificateToSalesLayout', 'businesspartnerCertificateToProjectLayout',
		function (certificateDataServiceFactory, UIStandardConfigService, platformSchemaService, platformUIStandardExtentService,
			certificateValidationServiceFactory, mainCertificateLayout, certificateToBpLayout, certificateToContractLayout, certificateToQuoteLayout, certificateToInvoiceLayout,
			businesspartnerCertificateToSalesLayout, certificateToProjectLayout) {

			var containerServiceCache = {}, dataServiceCache = {};

			return {
				getContainerService: getContainerService,
				getDataService: getDataService
			};

			function getContainerService(moduleId, parentService, translationService) {
				if (!containerServiceCache[moduleId]) {
					containerServiceCache[moduleId] = createContainerService(moduleId, parentService, translationService);
				}
				return containerServiceCache[moduleId];
			}

			function getDataService(moduleId, parentService) {
				if (!dataServiceCache[moduleId]) {
					dataServiceCache[moduleId] = createDataService(moduleId, parentService);
				}
				return dataServiceCache[moduleId];
			}

			function createDataService(moduleId, parentService) {
				var serviceOptions;
				if (moduleId !== 'businesspartner.certificate' && moduleId !== 'businesspartner.main') {
					serviceOptions = {
						flatLeafItem: {
							entityRole: {
								leaf: {
									itemName: 'Certificate',
									parentService: parentService
								}
							}
						}
					};
				}
				if (moduleId === 'businesspartner.main') {
					serviceOptions = {
						flatNodeItem: {
							entityRole: {
								node: {
									itemName: 'Certificate',
									parentService: parentService
								}
							}
						}
					};
				}
				if (moduleId === 'procurement.contract') {
					serviceOptions = {
						flatLeafItem: {
							entityRole: {
								leaf: {
									itemName: 'Certificate',
									parentService: parentService
								}
							},
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endRead: 'listtocontract',
								initReadData: function initReadData(readData) {
									let selectedHeader = parentService.getSelected();
									if(selectedHeader) {
										readData.filter = '?mainItemId=' + selectedHeader.Id;
										if (selectedHeader.BusinessPartnerFk) {
											readData.filter += '&businessPartnerFk=' + selectedHeader.BusinessPartnerFk;
										}
										if (selectedHeader.BusinessPartner2Fk) {
											readData.filter += '&businessPartner2Fk=' + selectedHeader.BusinessPartner2Fk;
										}
									}else{
										readData.filter = '?mainItemId=-1';
									}
									return readData;
								}
							}
						}
					};
					const contractActualCertificateService = certificateDataServiceFactory.create(moduleId, serviceOptions);
					if (parentService.contractSubContractorChanged) {
						parentService.contractSubContractorChanged.register(contractActualCertificateService.loadSubItemList);
					}
					return contractActualCertificateService;
				}
				if (moduleId === 'sales.contract') {
					serviceOptions = {
						flatLeafItem: {
							entityRole: {
								leaf: {
									itemName: 'Certificate',
									parentService: parentService
								}
							},
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endRead: 'listtocontractsales',
								initReadData: function initReadData(readData) {
									let selectedHeader = parentService.getSelected();
									if (selectedHeader) {
										readData.filter = '?mainItemId=' + selectedHeader.Id;
										if (selectedHeader.BusinesspartnerFk) {
											readData.filter += '&businessPartnerFk=' + selectedHeader.BusinesspartnerFk;
										}
										if (selectedHeader.BusinesspartnerBilltoFk) {
											readData.filter += '&businessPartner2Fk=' + selectedHeader.BusinesspartnerBilltoFk;
										}
									} else {
										readData.filter = '?mainItemId=-1';
									}
									return readData;
								}
							}
						}
					};
					const contractActualCertificateService = certificateDataServiceFactory.create(moduleId, serviceOptions);
					if (parentService.contractSubContractorChanged) {
						parentService.contractSubContractorChanged.register(contractActualCertificateService.loadSubItemList);
					}
					return contractActualCertificateService;
				}
				return certificateDataServiceFactory.create(moduleId, serviceOptions);
			}

			function createContainerService(moduleId, parentService, translationService) {
				var containerService = {};

				// certificate layout
				switch (moduleId) {
					case 'businesspartner.certificate':
						containerService.layout = mainCertificateLayout;
						break;
					case 'businesspartner.main':
						containerService.layout = certificateToBpLayout;
						break;
					case 'project.main':
						containerService.layout = certificateToProjectLayout;
						break;
					case 'procurement.contract':
						containerService.layout = certificateToContractLayout;
						break;
					case 'procurement.quote':
						containerService.layout = certificateToQuoteLayout;
						break;
					case 'procurement.invoice':
						containerService.layout = certificateToInvoiceLayout;
						break;
					case 'sales.bid':
					case 'sales.billing':
					case 'sales.contract':
						containerService.layout = businesspartnerCertificateToSalesLayout;
						break;
				}
				// end

				// certificate ui standard service
				var domains = platformSchemaService.getSchemaFromCache({
					typeName: 'CertificateDto',
					moduleSubModule: 'BusinessPartner.Certificate'
				}).properties;
				containerService.ui = new UIStandardConfigService(containerService.layout, domains, translationService);

				// certificate data service
				containerService.data = getDataService(moduleId, parentService);

				platformUIStandardExtentService.extend(containerService.ui, containerService.layout.addition, domains);

				// certificate validation service
				containerService.validation = certificateValidationServiceFactory.create(containerService.data);

				return containerService;
			}
		}

	]);

})(angular);