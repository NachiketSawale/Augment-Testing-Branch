(function (angular) {
	'use strict';
	let mainModule = angular.module('basics.meeting');
	/**
	 * @ngdoc service
	 * @name basicsMeetingContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	mainModule.service('basicsMeetingContainerInformationService', BasicsMeetingContainerInformationService);

	BasicsMeetingContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsMeetingConstantValues', 'basicsLookupdataConfigGenerator', 'basicsCommonComplexFormatter', '$injector'];

	function BasicsMeetingContainerInformationService(platformLayoutHelperService, basicsMeetingConstantValues, basicsLookupdataConfigGenerator, basicsCommonComplexFormatter, $injector) {
		let self = this;
		let guids = basicsMeetingConstantValues.uuid.container;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case guids.meetingList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getBasicsMeetingServiceInfos(),
						self.getBasicsMeetingLayout);
					break;
				case guids.meetingDetail:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getBasicsMeetingServiceInfos(),
						self.getBasicsMeetingLayout);
					break;
				case guids.meetingAttendeeList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getBasicsMeetingAttendeeServiceInfos(),
						self.getBasicsMeetingLayout);
					break;
				case guids.meetingAttendeeDetail:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getBasicsMeetingAttendeeServiceInfos(),
						self.getBasicsMeetingLayout);
					break;
				case guids.meetingDocumentList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getBasicsMeetingDocumentServiceInfos(),
						self.getBasicsMeetingDocumentLayout);
					break;
				case guids.meetingDocumentDetail:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getBasicsMeetingDocumentServiceInfos(),
						self.getBasicsMeetingDocumentLayout);
					break;
			}

			return config;
		};

		this.getBasicsMeetingServiceInfos = function getBasicsMeetingServiceInfos() {
			let mainService = $injector.get('basicsMeetingMainService');
			let validateService = $injector.get('basicsMeetingValidationService');

			return {
				standardConfigurationService: 'basicsMeetingUIStandardService',
				dataServiceName: mainService,
				validationServiceName: validateService(mainService)
			};
		};

		this.getBasicsMeetingAttendeeServiceInfos = function getBasicsMeetingAttendeeServiceInfos() {
			let attendeeDataService = $injector.get('basicsMeetingAttendeeService');
			let validateService = $injector.get('basicsMeetingAttendeeValidationService');

			return {
				standardConfigurationService: 'basicsMeetingAttendeeUIStandardService',
				dataServiceName: attendeeDataService,
				validationServiceName: validateService(attendeeDataService)
			};
		};

		this.getBasicsMeetingDocumentServiceInfos = function getBasicsMeetingDocumentServiceInfos() {
			return {
				standardConfigurationService: 'basicsMeetingDocumentUIStandardService',
				dataServiceName: 'basicsMeetingDocumentService',
				validationServiceName: 'basicsMeetingDocumentValidationService'
			};
		};

		this.getBasicsMeetingLayout = function getBasicsMeetingLayout() {
			let res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'basics.meeting.meeting',
				['code', 'title', 'mtgstatusfk', 'mtgtypefk', 'ishighimportance', 'recurrence', 'datereceived', 'starttime', 'finishtime', 'location', 'clerkrspfk',
					'clerkownerfk', 'mtgurl', 'projectfk', 'rfqheaderfk', 'qtnheaderfk', 'prjinforequestfk', 'checklistfk', 'defectfk', 'bidheaderfk'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', ''));

			res.overloads = platformLayoutHelperService.getOverloads(['code','mtgstatusfk', 'mtgtypefk', 'clerkrspfk', 'clerkownerfk', 'rfqheaderfk', 'qtnheaderfk',
				'prjinforequestfk', 'checklistfk', 'defectfk', 'bidheaderfk'], self);
			res.overloads.projectfk = platformLayoutHelperService.provideProjectLookupOverload();

			res.addAdditionalColumns = true;
			return res;
		};

		this.getBasicsMeetingAttendeeLayout = function getBasicsMeetingAttendeeLayout() {
			let res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'basics.meeting.attendee',
				['attendeestatusfk', 'clerkfk', 'businesspartnerfk', 'subsidiaryfk', 'contactfk', 'isoptional', 'title', 'role', 'firstname', 'familyname', 'department', 'email', 'telephonenumberfk', 'telephonemobilfk'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', ''));

			res.overloads = platformLayoutHelperService.getOverloads(['attendeestatusfk', 'businesspartnerfk', 'clerkfk', 'subsidiaryfk', 'contactfk', 'telephonenumberfk', 'telephonemobilfk'], self);
			res.overloads.businesspartnerfk = platformLayoutHelperService.provideBusinessPartnerLookupOverload();

			res.addAdditionalColumns = true;
			return res;
		};

		this.getBasicsMeetingDocumentLayout = function getBasicsMeetingDocumentLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.meeting.document',
				['documenttypefk', 'description', 'documentdate', 'originfilename']);

			res.overloads = platformLayoutHelperService.getOverloads(['documenttypefk', 'originfilename'], self);
			return res;
		};

		/* jshint -W074 */ // this function's cyclomatic complexity is too high.
		this.getOverload = function getOverloads(overload) { // jshint ignore:line
			let ovl = null;

			switch (overload) {
				case 'originfilename':
					ovl = {
						readonly: true
					};
					break;
				case 'code':
					ovl = {
						'navigator': {
							moduleName: 'basics.meeting'
						}
					};
					break;
				case 'mtgstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.meetingstatus', null, {showIcon: true});
					break;
				case 'mtgtypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.meetingtype');
					break;
				case 'attendeestatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.meetingattendeestatus', null, {showIcon: true});
					break;
				case 'clerkfk':
					ovl = {
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Description'
							}
						}
					};
					break;
				case 'clerkrspfk':
					ovl = {
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Description'
							}
						}
					};
					break;
				case 'clerkownerfk':
					ovl = {
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Description'
							}
						}
					};
					break;
				case 'businesspartnerfk':
					ovl = {
						'navigator': {
							moduleName: 'businesspartner.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {
									'showClearButton': true
								}, 'directive': 'filter-business-partner-dialog-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'BusinessPartner', 'displayMember': 'BusinessPartnerName1',
								'navigator': {
									'moduleName': 'businesspartner.main'
								}
							},
							'grouping': false,
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'filter-business-partner-dialog-lookup',
							'options': {
								'showClearButton': true
							}
						}
					};
					break;
				case 'subsidiaryfk':
					ovl = {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									filterKey: 'meeting-attendee-subsidiary-filter',
									'showClearButton': true
								}, 'directive': 'business-partner-main-subsidiary-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
							'width': 120
						},
						'detail': {
							type: 'directive',
							directive: 'business-partner-main-subsidiary-lookup',
							options: {
								filterKey: 'meeting-attendee-subsidiary-filter',
								'showClearButton': true,
								'displayMember': 'AddressLine'
							}
						}
					};
					break;
				case 'contactfk':
					ovl = {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								'directive': 'business-partner-main-contact-dialog',
								'lookupOptions': {'filterKey': 'meeting-attendee-contact-filter', 'showClearButton': true}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'Contact', 'displayMember': 'FullName'},
							width: 100
						},
						'detail': {
							type: 'directive',
							directive: 'business-partner-main-contact-dialog',
							options: {
								filterKey: 'meeting-attendee-contact-filter', 'showClearButton': true
							}
						}
					};
					break;
				case 'rfqheaderfk':
					ovl = {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-rfq-header-dialog',
								lookupOptions: {
									filterKey: 'basics-meeting-rfqheaderfk-filter',
									showClearButton: true,
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RfqHeader',
								displayMember: 'Code'
							},
							width: 125
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'procurement-rfq-header-dialog',
								descriptionField: 'Description',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'basics-meeting-rfqheaderfk-filter',
									initValueField: 'HeaderForeignCode',
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'qtnheaderfk':
					ovl = {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-quote-header-lookup',
								lookupOptions: {
									filterKey: 'basics-meeting-quote-filter',
									showClearButton: true,
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'Code'
							},
							width: 120
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'procurement-quote-header-lookup',
								descriptionField: 'Description',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'basics-meeting-quote-filter',
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'checklistfk':
					ovl = {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'hsqe-checklist-header-lookup',
								lookupOptions: {
									filterKey: 'basics-meeting-checklist-filter',
									showClearButton: true,
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo.Description',
										name: 'Description',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CheckList',
								displayMember: 'Code'
							}
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'hsqe-checklist-header-lookup',
								descriptionMember: 'DescriptionInfo.Description',
								lookupOptions: {
									filterKey: 'basics-meeting-checklist-filter',
									showClearButton: true,
								}
							}
						}
					};
					break;
				case 'prjinforequestfk':
					ovl = {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'project-info-request-dialog',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'basics-meeting-project-info-request-filter',
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectInfoRequest',
								displayMember: 'Code'
							}
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'project-info-request-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'basics-meeting-project-info-request-filter'
								}
							}
						}
					};
					break;
				case 'defectfk':
					ovl = {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'defect-main-defect-lookup',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'basics-meeting-defect-filter',
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'referenceDefectLookup',
								displayMember: 'Code'
							},
							bulkSupport: false
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'defect-main-defect-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'basics-meeting-defect-filter'
								}
							}
						}
					};
					break;
				case 'bidheaderfk':
					ovl = {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'sales-bid-bid-dialog',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'basics-meeting-sales-filter',
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo.Translated',
										name: 'Description',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesBid',
								displayMember: 'Code'
							}
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-bid-bid-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'basics-meeting-sales-filter'
								}
							}
						}
					};
					break;
				case 'documenttypefk':
					ovl = {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-table-document-type-combobox',
							'options': {
								'eagerLoad': true
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-table-document-type-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'documentType',
								displayMember: 'Description'
							}
						}
					};
					break;
				case 'telephonenumberfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-common-telephone-dialog',
							model: 'TelephoneNumber',
							options: {
								titleField: 'cloud.common.TelephoneDialogPhoneNumber',
								foreignKey: 'TelephoneNumberFk',
								showClearButton: true
							}
						}, grid: {
							editor: 'lookup',
							field: 'TelephoneNumber',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumberFk',
									titleField: 'cloud.common.TelephoneDialogPhoneNumber'
								}
							},
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						}
					};
					break;
				case 'telephonemobilfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-common-telephone-dialog',
							model: 'TelephoneMobil',
							options: {
								titleField: 'cloud.common.mobile',
								foreignKey: 'TelephoneMobilFk',
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							field: 'TelephoneMobil',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneMobilFk',
									titleField: 'cloud.common.mobile'
								}
							},
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						}
					};
					break;
			}
			return ovl;
		};
	}
})(angular);
