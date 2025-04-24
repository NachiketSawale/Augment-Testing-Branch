(function (angular) {
	'use strict';
	angular.module('basics.config').factory('genericWizardUseCaseContractConfirm', genericWizardUseCaseContractConfirm);
	genericWizardUseCaseContractConfirm.$inject = ['_', 'platformDialogService', '$q', '$injector', '$translate', '$rootScope', 'genericWizardErrorService', 'genericWizardContractConfirmContextService', 'platformRuntimeDataService', 'genericWizardInstanceInfoObjectService', '$log'];

	function genericWizardUseCaseContractConfirm(_, platformDialogService, $q, $injector, $translate, $rootScope, genericWizardErrorService, genericWizardContractConfirmContextService, platformRuntimeDataService, genericWizardInstanceInfoObjectService, $log) {

		var config = {
			Id: '5dc8d95272b7445b89004c729c71d7df',
			name: 'Contract Confirm Wizard',
			name$tr: function (config) {
				return config.reject ? $translate.instant('cloud.desktop.contractApproval.contractRejectWizardTitleName') : $translate.instant('cloud.desktop.contractApproval.contractConfirmWizardTitleName');
			},
			readonly: false,
			startEntity: 'ConHeaderId',
			propertyNameToRecycleList: ['exportPrcFilePath', 'prcItemExcelPath', 'ReqList', 'reqHeadersList', 'BoqListComplete', 'requiredRequisitions'],
			propertyNameToFileList: ['exportPrcFilePath', 'prcItemExcelPath'],
			serviceInfos: {
				mainEntityServiceName: 'procurementContractHeaderDataService',
				businessPartnerServiceName: 'businesspartnerMainHeaderDataService',
				boqServiceName: 'procurementContractBoqDataService',
				servicePrefix: 'procurementContractConfirm'
			},
			configProviders: [
				{
					dataUrl: 'procurement/common/wizard/getPrcInfoForGenericWizard?source=procurement.contract',
					useGet: true,
					params: {
						startEntityId: 'ConHeaderId'
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
				/*{
					dataUrl: 'procurement/package/publicapi/list?source=procurement.contract',
					useGet: true,
					params: {
						forergnFk: 'ConHeaderId'
					},
					configName: 'prcInfo'
				},*/
				{
					dataUrl: 'basics/config/genwizard/namingparameter/list',
					params: {
						SuperEntityId: 'Instance.Id'
					},
					configName: 'namingParameter'
				},
				/*{
					dataUrl: 'procurement/contract/header/getitembyId',
					useGet: true,
					params: {
						id: 'ConHeaderId'
					},
					configName: 'contract'
				},*/
				{
					dataUrl: 'project/main/getByContractId',
					useGet: true,
					params: {
						conId: 'ConHeaderId'
					},
					configName: 'project'
				},
				{
					dataUrl: 'procurement/quote/header/getQuotesByRfqHeaderId',
					useGet: true,
					callOrder: 2,
					params: {
						rfqHeaderId: 'prcInfo.Rfq[0].Id'
					},
					configName: 'quotes'
				}
			],
			wizardButtons: [
				{
					fn: async function (btn) {
						btn.disabled = true;

						try {
							// settings validation
							genericWizardErrorService.removeAllMessages();
							const containerList = _.concat(config.moduleDependencies['procurement.rfq'].containerList, config.moduleDependencies['procurement.contract'].containerList);
							_.forEach(containerList, function (container) {
								if (_.isFunction(container.validFn)) {
									const messageList = container.validFn(container.uuid);
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
						const businessPartnerMainHeaderDataService = genWizService.getDataServiceByName(config.serviceInfos.businessPartnerServiceName);

						const contextObj = await genericWizardContractConfirmContextService.getContext(true);

						const generateSafeLink = contextObj.GenerateSafeLink;
						const isLetterForSafeLink = contextObj.SelectedBodyLetterParameters.some(function (param) {
							return _.toLower(param.Name) === 'link' || _.toLower(param.ParameterName) === 'link';
						});
						const safeLinkFailed = generateSafeLink === true && isLetterForSafeLink === false || generateSafeLink === false && isLetterForSafeLink === true;

						if (!safeLinkFailed) {
							const transmissionService = genWizService.getDataServiceByName('genericWizardBusinessPartnerTransmissionService');
							transmissionService.resetErrorList();
							let includedBusinessPartnerList = _.filter(businessPartnerMainHeaderDataService.getList(), {IsIncluded: true});
							startWorkflow(includedBusinessPartnerList, transmissionService, contextObj);
							registerOnBeforeUnload();
						} else {
							btn.disabled = false;
						}

						function startWorkflow(includedBusinessPartnerList, transmissionService, contextObject) {
							if (!_.isEmpty(includedBusinessPartnerList)) {
								const includedBusinessPartner = includedBusinessPartnerList[0];
								includedBusinessPartner.SendStatus = -1;

								const businessPartnerContext = angular.toJson(genericWizardContractConfirmContextService.createBidderContext(contextObject, includedBusinessPartner));
								const workflowInstanceService = $injector.get('basicsWorkflowInstanceService');

								workflowInstanceService.startWorkflow(genWizService.config.followTemplateId, genWizService.getStartEntityId(), businessPartnerContext).then(function (response) {

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
												includedBusinessPartner.SendStatus = isError ? 1 : status;
												if (isError) {
													transmissionService.setErrorList(errorList);
													return;
												}
											} else {
												if (btn && includedBusinessPartner) {
													btn.disabled = false;
													includedBusinessPartner.SendStatus = 1;
												}
											}
											startWorkflow(_.tail(includedBusinessPartnerList), transmissionService, contextObject);
										} else {
											if (!_.isEmpty(response)) {
												const pendingJsonContextList = infoObject.pendingJsonContextList;
												if (_.isArray(pendingJsonContextList) && !_.isEmpty(pendingJsonContextList)) {
													const finalContextList = [];
													_.forEach(pendingJsonContextList, function (jsonContext) {
														finalContextList.push(angular.toJson(jsonContext));
													});
													workflowInstanceService.startWorkflowDifferentContext(infoObject.followTemplateId, infoObject.startEntityId, finalContextList);
												}
											}
										}
									} catch (e) {
										platformDialogService.showErrorBox('cloud.desktop.rfqBidder.sendWorkflowErrorText', 'cloud.desktop.contractApproval.sendWorkflowError');
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
							const useCaseContainerConfig = _.find(config.moduleDependencies['procurement.contract'].containerList, {uuid: '931850b088e64590a395b0eb21e5f4dc'});
							const businesspartnerMainHeaderDataService = genWizService.getDataServiceByName(config.serviceInfos.businessPartnerServiceName, useCaseContainerConfig);
							noBiddersSelected = _.isEmpty(_.filter(businesspartnerMainHeaderDataService.getList(), {IsIncluded: true}));
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
				genericWizardContractConfirmContextService.clearGeneratedReportList();
			},
			moduleDependencies: {
				'procurement.contract': {
					containerList: [
						// contract list
						{
							uuid: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/header/get',
							isStartEntity: true,
							info: {displayMember: 'Code'}
						},
						// contract detail
						{
							uuid: 'B3B0FDF482AE4973A4B6BBEA754876C3',
							dataUrl: 'procurement/contract/header/get',
							isStartEntity: true,
							info: {displayMember: 'Code'}
						},
						// business partner
						{
							uuid: '931850b088e64590a395b0eb21e5f4dc',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'businesspartner/main/businesspartner/GetBusinessPartnersByContractHeaderId',
							params: {
								contractId: 'Id',
								'Reject': 'reject',
								'RfqHeaderId': 'prcInfo.Rfq[0].Id'
							},
							dtoAccess: 'Main',
							selectionContainer: {includeAll: true},
							info: {
								displayMember: 'BusinessPartnerName1',
								filterFn: function (list) {
									return _.filter(list, function (item) {
										return item.IsIncluded;
									});
								},
								lookupData: [
									{
										name: 'Subsidiary',
										fk: 'SubsidiaryFk',
										// will be snacked out of Subsidiary
										propertyPath: 'Email',
										// property name that will be set at lookup object
										lookupPropertyName: 'BranchEmail'
									}
								]
							},
							validFn: function (uuid) {
								const genWizService = $injector.get('genericWizardService');
								const businessPartnerMainHeaderDataService = genWizService.getDataServiceByName(config.serviceInfos.businessPartnerServiceName);
								var message;
								var messageList = [];

								// no business partner selected, business partner without email
								var includedBusinessPartnerList = _.filter(businessPartnerMainHeaderDataService.getList(), {IsIncluded: true});
								if (_.isEmpty(includedBusinessPartnerList)) {
									message = {
										id: 'noBusinessPartnerSelected',
										text: $translate.instant('procurement.rfq.rfqBidderWizard.noBusinessPartnerSelectedErrorText'),
										containerUuidList: [uuid],
										isWarning: false
									};
									messageList.push(message);
								}

								return messageList;
							}
						},
						// cover letter/e-mail body
						{
							uuid: '55bc306e62014bb6aa03336eb58d8c51',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/wizard/GetReportsByConHeaderId?reportType=1',
							params: {
								ConHeaderId: 'Id',
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
						// reports
						{
							uuid: '8777043964bd45caab4f58af28a6a0b7',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/wizard/GetReportsByConHeaderId?reportType=2',
							params: {
								ConHeaderId: 'Id',
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
							}
						},
						// Project Document
						{
							uuid: '9fe6a21dfcca4747b817480e059db4d0',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/wizard/getprojectdocumentsforcontractconfirmwizard',
							params: {
								ConHeaderId: 'Id'
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
							}
						},
						// Contract Document
						{
							uuid: '3473623dccd04ef7ad14a2cf18e74eb5',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/wizard/getcontractdocumentsforcontractconfirmwizard',
							params: {
								ConHeaderId: 'Id'
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
							}
						},
						// prc boq list
						{
							uuid: 'A56A75CBE90545ECBFAFA5DE3F437F10',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/common/boq/list',
							useGet: true,
							params: {
								prcHeaderFk: 'PrcHeaderFk'
							},
							selectionContainer: {},
							info: {
								displayMember: 'BoqRootItem.Reference',
								filterFn: function (list) {
									return _.filter(list, function (item) {
										return item.IsIncluded;
									});
								}
							}
						}
					]
				},
				'procurement.rfq': {
					containerList: [
						// settings
						{
							uuid: 'e907d30b10274a1fb760f76b113c3b0d',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/rfq/rfqbiddersetting/get',
							validFn: function (uuid) {
								const genWizService = $injector.get('genericWizardService');
								const procurementRfqBidderSettingService = genWizService.getDataServiceByName('procurementRfqBidderSettingService');
								var message;
								var messageList = [];

								// send from me without own email
								var startingClerk = genWizService.config.startingClerk;
								var wizardSettings = procurementRfqBidderSettingService.getList()[0];

								if (!startingClerk.Email && wizardSettings.SendFromMe) {
									message = {
										id: 'noClerkEmail',
										text: $translate.instant('procurement.rfq.rfqBidderWizard.noClerkEmailErrorText'),
										containerUuidList: [uuid],
										isWarning: false
									};
									messageList.push(message);
								}

								// generate safe link and cover letter without link parameter
								messageList.push(...validateSafeLinkSettings([uuid, '55bc306e62014bb6aa03336eb58d8c51']));

								return messageList;
							}
						},
						// data format
						{
							uuid: '9d4498f32ca046ecb961fba5bac6436d',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/wizard/getdataformatsbyconheaderid',
							params: {
								conHeaderId: 'Id'
							},
							selectionContainer: {},
							info: {
								displayMember: 'DataFormat',
								filterFn: function (list) {
									return _.filter(list, function (item) {
										return item.IsIncluded;
									});
								}
							}
						},
						{
							// clerk documents
							uuid: '1e7537f6803c4bebb821634bb17cb068',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/wizard/getclerkdocumentsforcontractconfirmwizard',
							params: {
								ConHeaderId: 'Id'
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
							}
						},
						{
							// procurement structure documents
							uuid: '851d650c916a42778042f7730e48198a',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/wizard/getprcstructuredocumentsforcontractconfirmwizard',
							params: {
								ConHeaderId: 'Id',
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
							}
						},
						// transmission
						{
							uuid: 'b6a85fec74a2402fb3bc16f108c9c0b3',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
						},
						// sender
						{
							uuid: '44e5b148b85845c5bb13e35f7c97c5c6',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
						}
					]
				}
			}
		};

		function validateSafeLinkSettings(uuidList) {
			const genWizService = $injector.get('genericWizardService');
			const procurementContractConfirmCoverLetterService = genWizService.getDataServiceByName('procurementContractConfirmCoverLetterService');
			var selectedBodyLetter = _.find(procurementContractConfirmCoverLetterService.getList(), {IsIncluded: true}) || _.find(procurementContractConfirmCoverLetterService.getList(), {IsDefault: true}) || procurementContractConfirmCoverLetterService.getList()[0];
			var messageList = [];

			if (selectedBodyLetter) {
				const procurementRfqBidderSettingService = genWizService.getDataServiceByName('procurementRfqBidderSettingService');
				var wizardSettings = procurementRfqBidderSettingService.getList()[0];
				var message;

				var selectedBodyLetterParameters = selectedBodyLetter.ReportParameterEntities || [...(selectedBodyLetter.parameters || []), ...(selectedBodyLetter.hiddenParameters || [])]; //check ?? (es 11)
				var isLetterForSafeLink = selectedBodyLetterParameters.some(function (param) {
					return _.toLower(param.Name) === 'link' || _.toLower(param.ParameterName) === 'link';
				});
				var safeLinkSettingsValid = wizardSettings.GenerateSafeLink === true && isLetterForSafeLink === true || wizardSettings.GenerateSafeLink === false && isLetterForSafeLink === false;
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
			const businesspartnerMainHeaderDataService = genWizService.getDataServiceByName(config.serviceInfos.businessPartnerServiceName);

			const bidderListComplete = businesspartnerMainHeaderDataService.getList();
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
			return genericWizardContractConfirmContextService.getContext(true).then(function (contextObj) {
				_.forEach(pendingBidderList, function (bidder) {
					pendingJsonContextList.push(genericWizardContractConfirmContextService.createBidderContext(contextObj, bidder));
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

		return config;
	}
})(angular);
