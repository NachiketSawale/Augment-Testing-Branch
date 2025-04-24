(function (angular) {
	'use strict';
	angular.module('basics.config').factory('genericWizardUseCaseRfQBidderWizard', genericWizardUseCaseRfQBidderWizard);
	genericWizardUseCaseRfQBidderWizard.$inject = ['$http', '_', 'platformDialogService', '$translate', '$injector', '$rootScope', 'genericWizardRfqBidderContextService', 'genericWizardErrorService', 'genericWizardInstanceInfoObjectService', 'platformRuntimeDataService', '$log', '$q'];

	function genericWizardUseCaseRfQBidderWizard($http, _, platformDialogService, $translate, $injector, $rootScope, genericWizardRfqBidderContextService, genericWizardErrorService, genericWizardInstanceInfoObjectService, platformRuntimeDataService, $log, $q) {

		var config = {
			Id: '61ed6ca1069d47a28707d8ce8e868167',
			name: 'Rfq Bidder Wizard',
			name$tr: function () {
				return $translate.instant('cloud.desktop.rfqBidder.rfqBidderWizardTitleName');
			},
			readonly: false,
			startEntity: 'RfqHeaderId',
			keepConfigData: false,
			propertyNameToRecycleList: ['exportPrcFilePath', 'prcItemExcelPath', 'ReqList', 'reqHeadersList', 'BoqListComplete', 'requiredRequisitions'], // don't use yet
			propertyNameToFileList: ['exportPrcFilePath', 'prcItemExcelPath'], // don't use yet
			serviceInfos: {
				mainEntityServiceName: 'procurementRfqMainService',
				businessPartnerServiceName: 'procurementRfqBusinessPartnerService',
				boqServiceName: 'procurementRfqSendRfqBoqService',
				servicePrefix: 'procurementRfqBidder'
			},
			configProviders: [
				{
					dataUrl: 'procurement/common/wizard/getPrcInfoForGenericWizard?source=procurement.rfq',
					useGet: true,
					params: {
						startEntityId: 'RfqHeaderId'
					},
					configName: 'prcInfo'
				},
				{
					dataUrl: 'basics/workflow/getCurrentClerk',
					configName: 'startingClerk',
					validationFn: function (clerk) {
						if (_.isEmpty(clerk)) {
							platformDialogService.showErrorBox('cloud.desktop.rfqBidder.startingClerkNotFoundErrorText', 'cloud.desktop.rfqBidder.startingClerkNotFoundError');
							throw Error('No clerk was found.');
						}
					}
				},
				{
					useGet: true,
					dataUrl: 'procurement/rfq/businesspartner/GetBusinessPartnersByRfQHeaderId',
					params: {
						MainEntityId: 'RfQHeaderId',
						// get communication channel from action instance
						communicationChannel: 'communicationChannel'
					},
					configName: 'businessPartnerList',
					dtoAccess: 'Main',
					validationFn: function (businessPartnerList) {
						const genWizService = $injector.get('genericWizardService');
						genWizService.config.hasReqVariantAssigned = false;
						if (!_.isEmpty(businessPartnerList)) {
							genWizService.config.hasReqVariantAssigned = _.some(businessPartnerList, {HasReqVariantAssigned: true});
						}
						var communicationChannel = genWizService.config.communicationChannel;
						if (_.isEmpty(businessPartnerList)) {
							switch (communicationChannel) {
								case 2:
									platformDialogService.showErrorBox('cloud.desktop.rfqBidder.businessPartnerNotFoundErrorText', 'cloud.desktop.rfqBidder.businessPartnerNotFoundError');
									throw Error('No business partner with communication channel Email was found for the selected rfq.');
								case 5:
									platformDialogService.showErrorBox('cloud.desktop.rfqBidder.businessPartnerNotFoundPortalErrorText', 'cloud.desktop.rfqBidder.businessPartnerNotFoundError');
									throw Error('No business partner with communication channel Portal was found for the selected rfq.');
								default:
									platformDialogService.showErrorBox('cloud.desktop.rfqBidder.businessPartnerNotFoundDefaultErrorText', 'cloud.desktop.rfqBidder.businessPartnerNotFoundError');
									throw Error('You are using a communication channel, that is not supported by this wizard.');
							}
						}
					}
				},
				{
					dataUrl: 'basics/config/genwizard/namingparameter/list',
					params: {
						SuperEntityId: 'Instance.Id'
					},
					configName: 'namingParameter'
				}, /*{
					dataUrl: 'procurement/rfq/header/GetById', //TODO: optimize with Irfqheaderentity?
					useGet: true,
					params: {
						Id: 'RfqHeaderId'
					},
					configName: 'rfq'
				},*/
				{
					dataUrl: 'project/main/getByRfqId',
					useGet: true,
					params: {
						rfqId: 'RfqHeaderId'
					},
					configName: 'project'
				}
			],
			wizardButtons: [
				{
					fn: async function (btn) {
						btn.disabled = true;

						try {
							// settings validation
							genericWizardErrorService.removeAllMessages();
							_.forEach(config.moduleDependencies['procurement.rfq'].containerList, function (container) {
								if (_.isFunction(container.validFn)) {
									const messageList = container.validFn(container.uuid, true);
									genericWizardErrorService.addMessageList(messageList);
								}
							});
						} catch (e) {
							btn.disabled = false;
							platformDialogService.showErrorBox('cloud.desktop.rfqBidder.settingsValidationErrorText', 'cloud.desktop.rfqBidder.settingsValidationError');
							$log.error('Settings Validation Error: ' + e);
						}

						if (!_.isEmpty(genericWizardErrorService.getAllErrorMessages())) {
							btn.disabled = false;
							return;
						}

						const genWizService = $injector.get('genericWizardService');
						const procurementRfqBusinessPartnerService = genWizService.getDataServiceByName(config.serviceInfos.businessPartnerServiceName);

						const contextObj = await genericWizardRfqBidderContextService.getContext(true);

						const generateSafeLink = contextObj.GenerateSafeLink;
						const isLetterForSafeLink = contextObj.SelectedBodyLetterParameters.some(function (param) {
							return _.toLower(param.Name) === 'link' || _.toLower(param.ParameterName) === 'link';
						});
						const communicationChannel = contextObj.CommunicationChannel;
						const safeLinkFailed = communicationChannel === 2 && (generateSafeLink === true && isLetterForSafeLink === false || generateSafeLink === false && isLetterForSafeLink === true);

						if (!safeLinkFailed) {
							// recipients
							let selectedBidders = _.filter(procurementRfqBusinessPartnerService.getList(), {IsIncluded: true});
							let emailAddresses = _.filter(_.map(selectedBidders, bidder => bidder.lookup.BranchEmail), item => !!item);

							// cc branch
							let BranchCC = _.filter(procurementRfqBusinessPartnerService.getList(), {BranchCC: true});
							let ccEmailAddresses = _.filter(_.map(BranchCC, bidder => bidder.lookup.BranchEmail), item => !!item);

							const transmissionService = genWizService.getDataServiceByName('genericWizardBusinessPartnerTransmissionService');
							transmissionService.resetErrorList();

							let promises = [];
							// generate cover
							if (contextObj.SelectedBodyLetter && contextObj.SelectedBodyLetterParameters) {
								let generateRequest = {
									ReportId: contextObj.SelectedBodyLetter,
									GenerateType: 1
								};
								generateRequest.Parameters = _.map(contextObj.SelectedBodyLetterParameters, function (item) {
									return {
										Key: item.Name,
										Value: {
											Name: item.Name,
											ParamValue: _.isNull(item.ParamValue) ? null : angular.toJson(item.ParamValue),
											ParamValueType: item.ParamValueType
										}
									};
								});
								promises.push(getGeneratePromise(generateRequest));
							}

							// generate the report email
							if (contextObj.ReportList && contextObj.ReportList.length > 0) {
								_.forEach(contextObj.ReportList, report => {
									if (report) {
										let generateRequest = {
											ReportId: report.Id,
											GenerateType: 1
										};
										report.Parameters = generateRequest.Parameters = _.map(_.concat(contextObj.SelectedBodyLetterParameters, report.Parameters), function (item) {
											return {
												Key: item.Name,
												Value: {
													Name: item.Name,
													ParamValue: _.isNull(item.ParamValue) ? null : angular.toJson(item.ParamValue),
													ParamValueType: item.ParamValueType
												}
											};
										});
										promises.push(getGeneratePromise(generateRequest));
									}
								});
							}

							// add attachments
							generateAndSaveDraft(promises, emailAddresses, contextObj.Subject, contextObj.fileList, ccEmailAddresses);
						} else {
							btn.disabled = false;
						}
					},
					title: 'procurement.rfq.rfqBidderWizard.saveToDraft',
					successMsg: 'procurement.rfq.rfqBidderWizard.saveToDraftSuccess',
					value: false,
					isDisabled: function (btn) {
						const genWizService = $injector.get('genericWizardService');
						let noBiddersSelected = true;
						try {
							const useCaseContainerConfig = _.find(config.moduleDependencies['procurement.rfq'].containerList, {uuid: '2dd4dc4f50844b22b55f5815f83fed2e'});
							const rfqBusinessPartnerService = genWizService.getDataServiceByName(config.serviceInfos.businessPartnerServiceName, useCaseContainerConfig);
							noBiddersSelected = _.isEmpty(_.filter(rfqBusinessPartnerService.getList(), {IsIncluded: true}));
						} catch (e) {
							return true;
						}

						const outlookMainService = $injector.get('cloudDesktopOutlookMainService');
						let isShowOutlook = outlookMainService.getIsShowOutlookSync();
						let isOutlookLogout = false;
						if (isShowOutlook) {
							let profile = outlookMainService.getProfileSync();
							isOutlookLogout = !profile;
						}

						return btn.disabled || noBiddersSelected || isOutlookLogout;
					},
					isHidden: function () {
						const outlookMainService = $injector.get('cloudDesktopOutlookMainService');
						return !outlookMainService.getIsShowOutlookSync();
					}
				},
				{
					fn: async function (btn) {
						btn.disabled = true;

						try {
							// settings validation
							genericWizardErrorService.removeAllMessages();
							_.forEach(config.moduleDependencies['procurement.rfq'].containerList, function (container) {
								if (_.isFunction(container.validFn)) {
									const messageList = container.validFn(container.uuid, true);
									genericWizardErrorService.addMessageList(messageList);
								}
							});
						} catch (e) {
							btn.disabled = false;
							platformDialogService.showErrorBox('cloud.desktop.rfqBidder.settingsValidationErrorText', 'cloud.desktop.rfqBidder.settingsValidationError');
							$log.error('Settings Validation Error: ' + e);
						}

						if (!_.isEmpty(genericWizardErrorService.getAllErrorMessages())) {
							btn.disabled = false;
							return;
						}

						// trigger tab
						$rootScope.$emit('config:genericWizardSend');

						const genWizService = $injector.get('genericWizardService');
						const procurementRfqBusinessPartnerService = genWizService.getDataServiceByName(config.serviceInfos.businessPartnerServiceName);

						const contextObj = await genericWizardRfqBidderContextService.getContext(true);

						const generateSafeLink = contextObj.GenerateSafeLink;
						const isLetterForSafeLink = contextObj.SelectedBodyLetterParameters.some(function (param) {
							return _.toLower(param.Name) === 'link' || _.toLower(param.ParameterName) === 'link';
						});
						const communicationChannel = contextObj.CommunicationChannel;
						const safeLinkFailed = communicationChannel === 2 && (generateSafeLink === true && isLetterForSafeLink === false || generateSafeLink === false && isLetterForSafeLink === true);

						if (!safeLinkFailed) {
							const transmissionService = genWizService.getDataServiceByName('genericWizardBusinessPartnerTransmissionService');
							transmissionService.resetErrorList();
							let includedBidderList = _.filter(procurementRfqBusinessPartnerService.getList(), {IsIncluded: true});
							let bidderListForReqInfo = {};
							_.forEach(includedBidderList, function (bidder) {
								bidderListForReqInfo[bidder.BusinessPartnerFk] = bidder.HasReqVariantAssigned;
							});
							$http({
								method: 'POST',
								url: globals.webApiBaseUrl + 'procurement/rfq/wizard/getRfqReqInfoForRfqBidderWizard',
								data: {
									RfqId: Number(contextObj.startEntityId),
									BusinessPartnerIdList: bidderListForReqInfo,
									HasReqVariantAssignedInPage: contextObj.HasReqVariantAssignedInPage
								}
							}).then(function (response) {
								genWizService.config.biddersReqInfoList = response.data;
								startWorkflow(includedBidderList, transmissionService, contextObj, response.data);
							});
							registerOnBeforeUnload(); // maybe in then function?
						} else {
							btn.disabled = false;
						}

						function startWorkflow(includedBidderList, transmissionService, contextObject, bidderReqInfoList) {
							if (!_.isEmpty(includedBidderList)) {
								const includedBidder = includedBidderList[0];
								includedBidder.SendStatus = -1;

								const bidderContext = angular.toJson(genericWizardRfqBidderContextService.createBidderContext(contextObject, includedBidder, bidderReqInfoList));
								const workflowInstanceService = $injector.get('basicsWorkflowInstanceService');

								workflowInstanceService.startWorkflow(genWizService.config.followTemplateId, genWizService.getStartEntityId(), bidderContext).then(function (response) {
									const responseJsonContext = !_.isEmpty(response) && _.isString(response.Context) ? JSON.parse(response.Context) : null;
									let wizardInstanceId;
									let errorList;
									let isError;
									if (responseJsonContext) {
										wizardInstanceId = responseJsonContext.wizardInstanceId;
										errorList = responseJsonContext.errorList;
										isError = !_.isEmpty(errorList);
									}

									try {
										const infoObject = genericWizardInstanceInfoObjectService.getInfoObjectByWizardInstanceId(wizardInstanceId);
										if (!infoObject) {
											if (!_.isEmpty(response)) {
												const status = response.Status;
												if (status && (status === 5 || status === 3) || isError) {
													btn.disabled = false;
												}
												includedBidder.SendStatus = isError ? 1 : status;
												if (isError) {
													transmissionService.setErrorList(errorList);
													return;
												}
											} else {
												if (btn && includedBidder) {
													btn.disabled = false;
													includedBidder.SendStatus = 1;
												}
											}
											/*if (!genWizService.config.hasReqVariantAssigned) {
												genericWizardRfqBidderContextService.recycleContextVariables(contextObject, responseJsonContext, config.propertyNameToRecycleList, config.propertyNameToFileList);
											}*/
											startWorkflow(_.tail(includedBidderList), transmissionService, contextObject, bidderReqInfoList);
										} else {
											if (!_.isEmpty(response)) {
												const pendingJsonContextList = infoObject.pendingJsonContextList;
												if (_.isArray(pendingJsonContextList) && !_.isEmpty(pendingJsonContextList)) {
													const finalContextList = [];
													_.forEach(pendingJsonContextList, function (jsonContext) {
														/*if (!genWizService.config.hasReqVariantAssigned) {
															genericWizardRfqBidderContextService.recycleContextVariables(jsonContext, responseJsonContext, config.propertyNameToRecycleList, config.propertyNameToFileList);
														}*/
														finalContextList.push(angular.toJson(jsonContext));
													});
													workflowInstanceService.startWorkflowDifferentContext(infoObject.followTemplateId, infoObject.startEntityId, finalContextList);
												}
											}
										}
									} catch (e) {
										platformDialogService.showErrorBox('cloud.desktop.rfqBidder.sendWorkflowErrorText', 'cloud.desktop.rfqBidder.sendWorkflowError');
										$log.error('Send Email Error: ' + e);
									} finally {
										genericWizardInstanceInfoObjectService.removeInfoObjectByWizardInstanceId(wizardInstanceId);
									}
								});
							}
						}
					},
					title: 'procurement.rfq.rfqBidderWizard.send',
					question: 'procurement.rfq.rfqBidderWizard.sureSend',
					successMsg: 'procurement.rfq.rfqBidderWizard.sendSuccess',
					value: false,
					isDisabled: function (btn) {
						const genWizService = $injector.get('genericWizardService');
						let noBiddersSelected = true;
						try {
							const useCaseContainerConfig = _.find(config.moduleDependencies['procurement.rfq'].containerList, {uuid: '2dd4dc4f50844b22b55f5815f83fed2e'});
							const rfqBusinessPartnerService = genWizService.getDataServiceByName(config.serviceInfos.businessPartnerServiceName, useCaseContainerConfig);
							noBiddersSelected = _.isEmpty(_.filter(rfqBusinessPartnerService.getList(), {IsIncluded: true}));
						} catch (e) {
							return true;
						}

						return btn.disabled || noBiddersSelected;
					}
				}],
			onDestroyFunction: async function () {
				const genWizService = $injector.get('genericWizardService');
				const infoObject = await getInfoObjectForCloseFunctions();
				if (infoObject) {
					genericWizardInstanceInfoObjectService.setInfoObject(genWizService.config.actionInstance.workflowInstanceId, infoObject);
				}
				genericWizardRfqBidderContextService.clearGeneratedReportList();
			},
			moduleDependencies: {
				'procurement.rfq': {
					containerList: [
						{
							// rfq list
							uuid: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/header/GetById',
							isStartEntity: true,
							info: {displayMember: 'Code'}
						},
						{
							// bidder
							uuid: '2dd4dc4f50844b22b55f5815f83fed2e',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/businesspartner/GetBusinessPartnersByRfQHeaderId',
							params: {
								// generate an Http Post Param named: Value with the value of Id from
								// the dependentContainer(037C70C17687481A88C726B1D1F82459) Containers selected item (RfQ Header Id)
								MainEntityId: 'Id',
								// get communication channel from wizard config
								communicationChannel: 'communicationChannel'
							},
							dtoAccess: 'Main',
							inheritFunctions: ['updateContactHasPortalUser', 'businessPartnerFkChanged.fire'],
							info: {
								displayMember: 'lookup.BusinessPartnerName1',
								lookupData: [
									{
										name: 'BusinessPartner',
										fk: 'BusinessPartnerFk'
									},
									{
										name: 'Subsidiary',
										fk: 'SubsidiaryFk',
										// will be snacked out of Subsidiary
										propertyPath: 'Email',
										// property name that will be set at lookup object
										lookupPropertyName: 'BranchEmail'
									}
								],
								module: 'businesspartner.main',
								filterFn: function (list) {
									return _.filter(list, function (item) {
										return item.IsIncluded;
									});
								}
							},
							selectionContainer: {includeAll: true},
							validFn: function (uuid) {
								const genWizService = $injector.get('genericWizardService');
								const procurementRfqBusinessPartnerService = genWizService.getDataServiceByName(config.serviceInfos.businessPartnerServiceName);
								var message;
								var messageList = [];

								// no business partner selected, business partner without email
								var includedBusinessPartnerList = _.filter(procurementRfqBusinessPartnerService.getList(), {IsIncluded: true});
								if (_.isEmpty(includedBusinessPartnerList)) {
									message = {
										id: 'noBusinessPartnerSelected',
										text: $translate.instant('procurement.rfq.rfqBidderWizard.noBusinessPartnerSelectedErrorText'),
										containerUuidList: [uuid],
										isWarning: false
									};
									messageList.push(message);
								}

								// business partner in portal mode with no portal user selected
								if (genWizService.config.communicationChannel === 5) {
									var bidderWithoutPortalUser = _.some(includedBusinessPartnerList, function (bidder) {
										return bidder.ContactHasPortalUser === false;
									});

									if (bidderWithoutPortalUser) {
										message = {
											id: 'bidderWithoutPortalUser',
											text: $translate.instant('procurement.rfq.rfqBidderWizard.bidderWithoutPortalUserWarningText'),
											containerUuidList: [uuid],
											isWarning: true
										};
										messageList.push(message);
									}
								}

								return messageList;
							}
						},
						{
							// settings
							uuid: 'e907d30b10274a1fb760f76b113c3b0d',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/rfqbiddersetting/get',
							validFn: function (uuid, isFromButton) {
								const genWizService = $injector.get('genericWizardService');
								const procurementRfqBidderSettingService = genWizService.getDataServiceByName('procurementRfqBidderSettingService');
								var message;
								var messageList = [];

								// send from me without own email
								var startingClerk = genWizService.config.startingClerk;
								var bidderSettings = procurementRfqBidderSettingService.getList()[0];

								if (!startingClerk.Email && bidderSettings.SendFromMe) {
									message = {
										id: 'noClerkEmail',
										text: $translate.instant('procurement.rfq.rfqBidderWizard.noClerkEmailErrorText'),
										containerUuidList: [uuid],
										isWarning: false
									};
									messageList.push(message);
								}

								// generate safe link and cover letter without link parameter
								messageList.push(...validateSafeLinkSettings([uuid, '7ba78cfb8fd242ec8eb4190a8ba3559f']));

								if (!isFromButton) {
									validateSendWithOwnMailAddress(bidderSettings);
								}

								return messageList;
							}
						},
						{
							// reports
							uuid: '42ede45a94ce421f822305090bbd0915',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/wizard/GetReportsByRfQHeaderId?type=2',
							params: {
								RfQHeaderId: 'Id',
							},
							info: {
								displayMember: 'Name.Description',
								filterFn: function (list) {
									return _.filter(list, function (item) {
										if (!item.IsCoverLetter) {
											return item.IsIncluded;
										}
										return false;
									});
								}
							},
							hide: function (wizardConfig) {
								return wizardConfig.communicationChannel === 5;
							}
						},
						{
							// Project Document
							uuid: 'fc2ce31089fa456587193a13bcab3a43',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/wizard/getprojectdocumentsforsendrfqbyrfqheaderid',
							params: {
								rfqHeaderId: 'Id'
							},
							isDocumentContainer: true,
							selectionContainer: {},
							info: {
								displayMember: ['DocumentOriginalFileName', 'OriginFileName', 'Description', 'DocumentDescription', 'Id'],
								filterFn: function (list) {
									return _.filter(list, function (item) {
										return item.IsIncluded;
									});
								}
							},
							hide: function (wizardConfig) {
								return wizardConfig.communicationChannel === 5;
							}
						},
						{
							// data format
							uuid: '9d4498f32ca046ecb961fba5bac6436d',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/wizard/getdataformatsbyrfqheaderid',
							params: {
								rfqHeaderId: 'Id'
							},
							selectionContainer: {},
							info: {
								displayMember: 'DataFormat',
								filterFn: function (list) {
									return _.filter(list, function (item) {
										return item.IsIncluded;
									});
								}
							},
							hide: function (wizardConfig) {
								return wizardConfig.communicationChannel === 5;
							}
						},
						{
							// documents for sending rfq
							uuid: '7016ed0f76da4be19b63c516d75891f6',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/wizard/getdocumentsforsendrfqbyrfqheaderid',
							params: {
								rfqHeaderId: 'Id'
							},
							isDocumentContainer: true,
							selectionContainer: {},
							info: {
								displayMember: ['DocumentOriginalFileName', 'OriginFileName', 'Description', 'DocumentDescription', 'Id'],
								filterFn: function (list) {
									return _.filter(list, function (item) {
										return item.IsIncluded;
									});
								}
							},
							hide: function (wizardConfig) {
								return wizardConfig.communicationChannel === 5;
							}
						},
						{
							// clerk documents for sending rfq
							uuid: '1e7537f6803c4bebb821634bb17cb068',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/wizard/getclerkdocumentsforsendrfqbyrfqheaderid',
							params: {
								rfqHeaderId: 'Id'
							},
							isDocumentContainer: true,
							selectionContainer: {},
							info: {
								displayMember: ['DocumentOriginalFileName', 'OriginFileName', 'Description', 'DocumentDescription', 'Id'],
								filterFn: function (list) {
									return _.filter(list, function (item) {
										return item.IsIncluded;
									});
								}
							},
							hide: function (wizardConfig) {
								return wizardConfig.communicationChannel === 5;
							}
						},
						{
							// procurement structure documents
							uuid: '851d650c916a42778042f7730e48198a',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/wizard/getStructureDocumentsForSendRfq',
							params: {
								rfqHeaderId: 'Id',
								reqHeaderId: 'prcInfo.Requisition[0].Id'
							},
							isDocumentContainer: true,
							selectionContainer: {},
							info: {
								displayMember: ['DocumentOriginalFileName', 'OriginFileName', 'Description', 'DocumentDescription', 'Id'],
								filterFn: function (list) {
									return _.filter(list, function (item) {
										return item.IsIncluded;
									});
								}
							},
							hide: function (wizardConfig) {
								return wizardConfig.communicationChannel === 5;
							}
						},
						{
							// prc boq list
							uuid: 'c31cc0077055459d8000a6ebbf523cb6',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/wizard/getsendrfqboqsbyrfqheaderid',
							params: {
								rfqHeaderId: 'Id',
								hasReqVariantAssigned: 'hasReqVariantAssigned'
							},
							selectionContainer: {},
							info: {
								displayMember: 'BoqRootItem.Reference',
								filterFn: function (list) {
									return _.filter(list, function (item) {
										return item.IsIncluded;
									});
								}
							},
							hide: function (wizardConfig) {
								return wizardConfig.communicationChannel === 5 || wizardConfig.hasReqVariantAssigned;
							}
						},
						{
							// transmission
							uuid: 'b6a85fec74a2402fb3bc16f108c9c0b3',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
						},
						{
							// cover letter/e-mail body
							uuid: '7ba78cfb8fd242ec8eb4190a8ba3559f',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/wizard/GetReportsByRfQHeaderId?type=1',
							params: {
								RfQHeaderId: 'Id',
							},
							info: {
								displayMember: 'Name.Description',
								filterFn: function (list) {
									return _.filter(list, function (item) {
										if (item.IsCoverLetter) {
											return item.IsIncluded;
										}
										return false;
									});
								}
							},
							validFn: function (uuid) {
								// generate safe link and cover letter without link parameter
								return validateSafeLinkSettings([uuid, 'e907d30b10274a1fb760f76b113c3b0d']);
							}
						},
						{
							// sender
							uuid: '44e5b148b85845c5bb13e35f7c97c5c6',
							internalName: 'procurement.rfq',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
						}
					]
				}
			}
		};

		function validateSafeLinkSettings(uuidList) {
			const genWizService = $injector.get('genericWizardService');
			const procurementRfqBidderCoverLetterService = genWizService.getDataServiceByName('procurementRfqBidderCoverLetterService');
			var selectedBodyLetter = _.find(procurementRfqBidderCoverLetterService.getList(), {IsIncluded: true}) || _.find(procurementRfqBidderCoverLetterService.getList(), {IsDefault: true}) || procurementRfqBidderCoverLetterService.getList()[0];
			var messageList = [];

			if (genWizService.config.communicationChannel === 2 && selectedBodyLetter) {
				const procurementRfqBidderSettingService = genWizService.getDataServiceByName('procurementRfqBidderSettingService');
				var bidderSettings = procurementRfqBidderSettingService.getList()[0];
				var message;

				var selectedBodyLetterParameters = selectedBodyLetter.ReportParameterEntities || [...(selectedBodyLetter.parameters || []), ...(selectedBodyLetter.hiddenParameters || [])]; //check ?? (es 11)
				var isLetterForSafeLink = selectedBodyLetterParameters.some(function (param) {
					return _.toLower(param.Name) === 'link' || _.toLower(param.ParameterName) === 'link';
				});
				var safeLinkSettingsValid = bidderSettings.GenerateSafeLink === true && isLetterForSafeLink === true || bidderSettings.GenerateSafeLink === false && isLetterForSafeLink === false;
				if (!safeLinkSettingsValid) {
					message = {
						id: 'wrongCoverLetterForGenerateSafeLinkSettings',
						text: $translate.instant('procurement.rfq.rfqBidderWizard.wrongCoverLetterForGenerateSafeLinkSettingsErrorText'),
						containerUuidList: uuidList,
						isWarning: false
					};
					messageList.push(message);
				}
			}
			return messageList;
		}

		// get infoObject for pending business partners
		function getInfoObjectForCloseFunctions() {
			const genWizService = $injector.get('genericWizardService');
			const procurementRfqBusinessPartnerService = genWizService.getDataServiceByName(config.serviceInfos.businessPartnerServiceName);

			const bidderListComplete = procurementRfqBusinessPartnerService.getList();
			const isSendMailStarted = _.some(bidderListComplete, function (bp) {
				return !_.isNil(bp.SendStatus);
			});

			if (!isSendMailStarted) {
				return $q.when();
			}

			const pendingBidderList = _.filter(bidderListComplete, function (bp) {
				return bp.IsIncluded && _.isNil(bp.SendStatus);
			});

			if (_.isEmpty(pendingBidderList)) {
				return $q.when();
			}

			const pendingJsonContextList = [];
			return genericWizardRfqBidderContextService.getContext(true).then(function (contextObj) {
				_.forEach(pendingBidderList, function (bidder) {
					pendingJsonContextList.push(genericWizardRfqBidderContextService.createBidderContext(contextObj, bidder, genWizService.config.biddersReqInfoList));
				});

				return {
					pendingJsonContextList: pendingJsonContextList,
					followTemplateId: genWizService.config.followTemplateId,
					startEntityId: genWizService.getStartEntityId()
				};
			});
		}

		function registerOnBeforeUnload() {
			$rootScope.$on('platform:onBeforeUnload', async function () {
				const infoObject = await getInfoObjectForCloseFunctions();
				if (infoObject) {
					const workflowInstanceService = $injector.get('basicsWorkflowInstanceService');
					const pendingContextList = [];
					_.forEach(infoObject.pendingJsonContextList, function (pendingJsonContext) {
						pendingContextList.push(angular.toJson(pendingJsonContext));
					});
					workflowInstanceService.startWorkflowDifferentContext(infoObject.followTemplateId, infoObject.startEntityId, pendingContextList);
				}
			});
		}

		function validateSendWithOwnMailAddress(wizardSettings) {
			let senderService = $injector.get('procurementRfqEmailSenderService');
			const emailTypes = senderService.emailTypes;
			let SendWithOwnMailAddress = wizardSettings.SendWithOwnMailAddress;
			let senderList = _.sortBy(senderService.getSenderList(), 'Id');
			if (SendWithOwnMailAddress) {
				let startingClerkEmail = _.filter(senderList, item => item.Id === emailTypes.currentUserClerkEmail || item.Id === emailTypes.currentUserEmail);
				senderService.onSendWithOwnMailAddressMessager.fire(SendWithOwnMailAddress, startingClerkEmail);
			} else {
				let selectedEmail = senderService.getDefaultEmail(senderList, SendWithOwnMailAddress);
				senderService.onSendWithOwnMailAddressMessager.fire(SendWithOwnMailAddress, senderList, selectedEmail);
			}
		}

		function getGeneratePromise(generateRequest) {
			return $http.post(globals.webApiBaseUrl + 'basics/common/outlook/generateReport', generateRequest);
		}

		function generateAndSaveDraft(promises, emailAddresses, subject, attachments, ccEmailAddresses) {
			let toRecipients = _.map(emailAddresses, item => {
				return {
					emailAddress: {
						address: item
					}
				};
			});
			let ccRecipients = _.map(ccEmailAddresses, item => {
				return {
					emailAddress: {
						address: item
					}
				};
			});

			let content = '';
			$q.all(promises).then(responses => {
				_.forEach(responses, response => {
					if (response.data.Success) {
						content += response.data.Message;
					}
				});
				let message = {
					id: '',
					subject: subject,
					body: {
						contentType: 'html',
						content: content
					},
					toRecipients: toRecipients,
					ccRecipients: ccRecipients,
					attachments: []
				};

				saveDraft(message).then(result => {
					if (result && result.isDraft) {
						if (attachments.length > 0) {
							getFileStates(attachments).then(function (response) {
								let data = response.data ? response.data : response;
								let uploadAttachments = _.map(data, item => {
									return {
										'@odata.type': '#microsoft.graph.fileAttachment',
										docId: item.FileArchiveDocId,
										isServerFile: true,
										name: item.FileName
									};
								});
								saveAttachments(result.id, uploadAttachments).then(res => {
									platformDialogService.showMsgBox('procurement.rfq.rfqBidderWizard.saveToDraftSuccess', 'procurement.rfq.rfqBidderWizard.saveToDraft', 'info');
								});
							});
						} else {
							platformDialogService.showMsgBox('procurement.rfq.rfqBidderWizard.saveToDraftSuccess', 'procurement.rfq.rfqBidderWizard.saveToDraft', 'info');
						}
					}
				});
			});
		}

		function saveDraft(message) {
			const outlookMainService = $injector.get('cloudDesktopOutlookMainService');
			return outlookMainService.graphClient.api('/me/messages').post(message);
		}

		function saveAttachments(messageId, attachments) {
			const outlookMainService = $injector.get('cloudDesktopOutlookMainService');
			const outlookAttachmentService = $injector.get('cloudDesktopOutlookAttachmentService');
			const tobeSaved = attachments.filter(m => _.isUndefined(m.id));
			const clientLargeFiles = tobeSaved.filter(a => a.isClientLargeFile).map(attach => attach.file);
			const serverFiles = tobeSaved.filter(a => a.isServerFile).map(attach => {
				if (attach.generateRequest) {
					return {
						GenerateRequest: attach.generateRequest,
						DocName: attach.name
					};
				}
				return {
					DocId: attach.docId,
					DocName: attach.name
				};
			});
			const clientSmallFiles = tobeSaved.filter(function (attach) {
				return !attach.isClientLargeFile && !attach.isServerFile;
			});
			let uploadAsync = [];
			if (serverFiles.length) {
				uploadAsync.push(
					outlookAttachmentService.uploadServerFile(outlookMainService.msalClient, messageId, serverFiles).then(result => {
						return result.Success ? Promise.resolve(result) : Promise.reject(result.Message);
					})
				);
			}
			if (clientLargeFiles.length || clientSmallFiles.length) {
				const clientQueue = [];
				if (clientSmallFiles.length) {
					clientQueue.push(() => outlookAttachmentService.uploadClientSmallFile(outlookMainService.graphClient, messageId, clientSmallFiles));
				}
				if (clientLargeFiles.length) {
					clientQueue.push(() => outlookAttachmentService.uploadClientLargeFile(outlookMainService.graphClient, messageId, clientLargeFiles));
				}
				const clientUpload = clientQueue.reduce(function (chain, currFn) {
					return chain.then(currFn);
				}, Promise.resolve());
				uploadAsync.push(clientUpload);
			}

			return Promise.all(uploadAsync).then(() => {
				return messageId;
			}).catch(reason => {
				console.error(reason);
			});
		}

		function getFileStates(attachments) {
			return $http.post(globals.webApiBaseUrl + 'basics/common/document/getmodeljobstates', attachments);
		}

		return config;
	}
})(angular);
