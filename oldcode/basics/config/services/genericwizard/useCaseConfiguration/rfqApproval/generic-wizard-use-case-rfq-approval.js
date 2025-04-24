(function (angular) {
	'use strict';
	angular.module('basics.config').factory('genericWizardUseCaseRfQApprovalWizard', genericWizardUseCaseRfQApprovalWizard);
	genericWizardUseCaseRfQApprovalWizard.$inject = ['_', 'platformDialogService', '$translate', '$injector'];

	function genericWizardUseCaseRfQApprovalWizard(_, platformDialogService, $translate, $injector) {

		function checkForComment(btn) {
			const genericWizardService = $injector.get('genericWizardService');
			const config = genericWizardService.providerData.ApprovalConfigurationForUser;
			// Approve
			if (btn.value === true) {
				return config.NeedComment4Approve;
			}
			// reject
			else if (btn.value === false) {
				return config.NeedComment4Reject;
			}
		}

		function finalizeRfq(btn) {
			const headerText$tr$ = btn.title;
			// disable the button
			btn.disabled = true;
			const bodyText$tr$ = btn.question;
			const modalOptions = {
				headerText$tr$: bodyText$tr$,
				bodyText$tr$: 'cloud.desktop.contractApproval.reason',
				maxLength: 255,
				type: 'text'
			};

			if (checkForComment(btn)) {
				modalOptions.pattern = '^.{2,255}$';
			}

			// if(procurementConfig requires comment)
			platformDialogService.showInputDialog(modalOptions).then(function (result) {
				if (result.ok) {
					// load the clone from cache
					const $http = $injector.get('$http');
					const genericWizardService = $injector.get('genericWizardService');
					$http({
						url: globals.webApiBaseUrl + 'basics/workflow/approver/addApprovalResult',
						method: 'POST',
						data: {
							ActionInstanceFk: genericWizardService.config.actionInstance.Id,
							InstanceFk: genericWizardService.config.actionInstance.WorkflowInstanceId,
							EvaluationLevel: genericWizardService.providerData.ApprovalConfigurationForUser.EvaluationLevel,
							ApproverConfigFk: genericWizardService.providerData.ApprovalConfigurationForUser.Id,
							UseCaseUuid: genericWizardService.config.Id,
							MainEntityId: genericWizardService.getStartEntityId(),
							ApproverResult: {
								Comment: result.value ? result.value.text : null,
								IsApproved: btn.value,
								ClerkRoleFk: genericWizardService.providerData.ApprovalConfigurationForUser.ClerkRoleFk
							}
						}
					}).then(function (res) {
						platformDialogService.showMsgBox(btn.successMsg, headerText$tr$, 'info').then(function (result) {
							if (result.ok) {
								$injector.get('$rootScope').$emit('wz-finish', res.data);
							}
						});
					});
				}
			});

		}

		function rejectToLevel(btn){
			let genericWizardService = $injector.get('genericWizardService');
			let currentEvaluationLevel = genericWizardService.providerData.ApprovalConfigurationForUser.EvaluationLevel;
			// Getting only previous levels
			genericWizardService.providerData.RejectionConfigurationForUser = genericWizardService.providerData.RejectionConfigurationForUser.filter(level => level.EvaluationLevel < currentEvaluationLevel);
			let headerText$tr$ = btn.title;
			let rejectionConfig = {
				modalHeaderText : $translate.instant(btn.question),
				currentEvaluationLevel: currentEvaluationLevel,
				clerkRoleFk: genericWizardService.providerData.ApprovalConfigurationForUser.ClerkRoleFk,
				evaluationLevels: genericWizardService.providerData.RejectionConfigurationForUser
			};
			openReturnToSenderPopup(rejectionConfig).then((rejectionDetails) => {
				if(rejectionDetails){
					let data = {
						WorkflowInstaceFk: genericWizardService.config.actionInstance.WorkflowInstanceId,
						ActionInstanceFk: genericWizardService.config.actionInstance.Id,
						MainEntityId: genericWizardService.getStartEntityId(),
						CurrentEvaluationLevel: genericWizardService.providerData.ApprovalConfigurationForUser.EvaluationLevel,
						SelectedRejectionLevel: rejectionDetails.rejectionLevel,
						ApproverConfigFk:genericWizardService.providerData.ApprovalConfigurationForUser.Id,
						ApproverResult: {
							Comment: rejectionDetails.comment,
							IsApproved: btn.value,
							ClerkRoleFk: genericWizardService.providerData.ApprovalConfigurationForUser.ClerkRoleFk
						},
						RejectionLevelClerkConfig : {
							Clerks : rejectionDetails.clerks
						}
					};

					let $http = $injector.get('$http');
					$http({
						url: globals.webApiBaseUrl + 'basics/workflow/approver/RejectToPreviousLevel',
						data,
						method: 'POST'
					}).then(function (res) {
						platformDialogService.showMsgBox($translate.instant(btn.successMsg, {rejectedLevel: rejectionDetails.rejectionLevel}), headerText$tr$, 'info').then(function (result) {
							if (result.ok) {
								$injector.get('$rootScope').$emit('wz-finish', res.data);
							}
						});
					});
				}
			});
		}

		function openReturnToSenderPopup(rejectionConfig){
			let modalOptions = {
				templateUrl: 'basics.workflow/contractRejectionDialog.html',
				backdrop: false,
				width: '285px',
				headerText: rejectionConfig.modalHeaderText,
				controller: ['$scope', '$modalInstance', function basicsWorkflowContractRejectionController($scope, $modalInstance) {
					$scope.modalOptions = modalOptions;
					$scope.currentEvaluationLevel = rejectionConfig.currentEvaluationLevel;
					$scope.rejectionComment = '';
					$scope.isModalDialog = true;
					$scope.selectedClerksDuplicate = [];

					let evaluationLevelsItems = [];
					evaluationLevelsItems = angular.copy(rejectionConfig.evaluationLevels);
					$scope.evaluationLevels = {
						displayMember: 'EvaluationLevel',
						valueMember: 'EvaluationLevel',
						items: evaluationLevelsItems
					};
					$scope.selectedEvalutionLevel = rejectionConfig.evaluationLevels[rejectionConfig.evaluationLevels.length-1].EvaluationLevel;

					prepareClerkCollection(evaluationLevelsItems);
					$scope.clerks = {
						displayMember: 'ClerkRoleDescription',
						valueMember: 'ClerkId',
						items: evaluationLevelsItems.filter(level=>level.EvaluationLevel === $scope.selectedEvalutionLevel)[0].Clerks
					};
					$scope.selectedClerks = [evaluationLevelsItems.filter(level=>level.EvaluationLevel === $scope.selectedEvalutionLevel)[0].Clerks[0].ClerkId];

					$scope.evalutationDropdownChange = function (rejectionLevel) {
						let clerkItems = evaluationLevelsItems.filter(level => level.EvaluationLevel === rejectionLevel)[0].Clerks;
						$scope.clerks = {
							displayMember: 'ClerkRoleDescription',
							valueMember: 'ClerkId',
							items: clerkItems
						};
						$scope.selectedClerks = [evaluationLevelsItems.filter(level=>level.EvaluationLevel === rejectionLevel)[0].Clerks[0].ClerkId];
						$scope.selectedEvalutionLevel = rejectionLevel;
					};

					$scope.onChange = function onChange(selectedClerks) {
						if(selectedClerks!==undefined){
							let evaluationLevel = $scope.selectedEvalutionLevel;
							let clerksForLevel = evaluationLevelsItems.filter(level => level.EvaluationLevel === parseInt(evaluationLevel))[0].Clerks;


							// Checking if all is selected, if all is selected getting all the clerks for the evaluation level.
							let allClerkSelected = false;
							let allClerkForSelectedLevel = clerksForLevel.filter(clerk => clerk.ClerkRoleFk === 0)[0];
							if (allClerkForSelectedLevel !== undefined) {
								allClerkSelected = selectedClerks.items.includes(allClerkForSelectedLevel.ClerkId);
							}

							if (allClerkSelected) {
								$scope.selectedClerksDuplicate = clerksForLevel.filter(clerk => clerk.ClerkRoleFk !== 0);
							}
							else {
								$scope.selectedClerksDuplicate = clerksForLevel.filter(clerk => selectedClerks.items.includes(clerk.ClerkId));
							}
						}
					};

					$scope.reject = function (rejectionLevel, rejectionComment) {
						let rejectionDetails = {
							comment: rejectionComment,
							rejectionLevel: rejectionLevel,
							clerks: $scope.selectedClerksDuplicate
						};
						$modalInstance.close(rejectionDetails);
					};

					$scope.onCancel = function onCancel() {
						$modalInstance.close({
							data: {
								result: false
							}
						});
					};
				}]
			};
			return platformDialogService.showDialog(modalOptions);
		}

		function prepareClerkCollection(evaluationLevelsItems) {
			evaluationLevelsItems.forEach(evaluationLevelItem => {
				if (evaluationLevelItem.Clerks.length > 1) {
					evaluationLevelItem.Clerks.splice(0, 0, {
						ClerkRoleFk: 0,
						Clerk: 0,
						ClerkRoleDescription: 'All'
					});
				}

				evaluationLevelItem.Clerks.forEach((clerk, index) => {
					clerk.ClerkId = evaluationLevelItem.EvaluationLevel + '' + index;
				});
			});
			return evaluationLevelsItems;
		}
		return {
			Id: '24e44994a160476f87aa1af3f936f547',
			entityGuid: '91018790AFF14968B7D63B6150D1C46A',
			name: 'Rfq Approval Wizard',
			name$tr: function () {
				return $translate.instant('cloud.desktop.rfqApproval.rfqApprovalWizardTitleName');
			},
			readonly: false,
			startEntity: 'RfqHeaderId',
			keepConfigData: false,
			serviceInfos: {
				mainEntityServiceName: 'procurementRfqMainService',
				businessPartnerServiceName: 'procurementRfqBusinessPartnerService',
				boqServiceName: 'procurementRfqSendRfqBoqService',
				servicePrefix: 'procurementRfqBidder'
			},
			configProviders: [
				{
					dataUrl: 'procurement/package/publicapi/list?source=procurement.rfq',
					useGet: true,
					params: {
						forergnFk: 'RfqHeaderId'
					},
					configName: 'prcInfo'
				},
				{
					dataUrl: 'basics/workflow/getCurrentClerk',
					configName: 'startingClerk'
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
					dtoAccess: 'Main'
				},
				{
					dataUrl: 'basics/workflow/approver/approvalPossible',
					configName: 'approvalPossible'
				},
				{
					dataUrl: 'basics/workflow/approverConfig/getApprovalConfigurationsForUser',
					configName: 'ApprovalConfigurationForUser',
					validationFn: function (config) {
						if (_.isEmpty(config)) {
							platformDialogService.showErrorBox('cloud.desktop.contractApproval.approvalConfigNotFoundErrorText', 'cloud.desktop.contractApproval.approvalConfigNotFoundError');
							throw Error('No suiteable approval config found for your current Role');
						}
					}
				},
				{
					dataUrl: 'basics/workflow/approverConfig/getPreviousApproverLevels',
					configName: 'RejectionConfigurationForUser'
				}
			],
			wizardButtons: [{
				fn: function (btn) {
					finalizeRfq(btn);
				},
				title: 'cloud.desktop.rfqApproval.approve',
				question: 'cloud.desktop.rfqApproval.sureApprove',
				successMsg: 'cloud.desktop.rfqApproval.approveSuccess',
				value: true,
				isDisabled: function () {
					const genericWizardService = $injector.get('genericWizardService');
					return genericWizardService.config.approvalPossible === false;
				}
			},
			{
				fn: function (btn) {
					finalizeRfq(btn);
				},
				title: 'cloud.desktop.rfqApproval.reject',
				question: 'cloud.desktop.rfqApproval.sureReject',
				successMsg: 'cloud.desktop.rfqApproval.rejectSuccess',
				value: false,
				isDisabled: function () {
					const genericWizardService = $injector.get('genericWizardService');
					return genericWizardService.config.approvalPossible === false;
				}
			}, {
				fn: function (btn) {
					rejectToLevel(btn);
				},
				title: 'cloud.desktop.rfqApproval.rejectToLevel',
				question: 'cloud.desktop.rfqApproval.sureRejectToLevel',
				successMsg: 'cloud.desktop.rfqApproval.rejectToLevelSuccess',
				value: false,
				isDisabled: function () {
					let genericWizardService = $injector.get('genericWizardService');
					if (genericWizardService.providerData.ApprovalConfigurationForUser !== undefined)
						return !genericWizardService.providerData.ApprovalConfigurationForUser.AllowReject2Level || genericWizardService.providerData.ApprovalConfigurationForUser.EvaluationLevel === genericWizardService.providerData.RejectionConfigurationForUser[0].EvaluationLevel;
					return true;
				}
			}],
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
							uuid: 'b239479113c24b49a0e19fff093e58cf',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/businesspartner/GetBusinessPartnersByRfQHeaderId',
							params: {
								// generate a Http Post Param named: Value with the value of Id from
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
								module: 'businesspartner.main'
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
							// documents for sending rfq
							uuid: '7016ed0f76da4be19b63c516d75891f6',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'procurement/rfq/wizard/getdocumentsforsendrfqbyrfqheaderid',
							params: {
								rfqHeaderId: 'Id'
							},
							isDocumentContainer: true,
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
								reqHeaderId: 'prcInfo.Requisition[0].Targetfk'
							},
							isDocumentContainer: true,
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
							// Rfq Approval Container
							uuid: '861e8aef7aa24b4584a4f68448569b9a',
							dependentContainer: '037C70C17687481A88C726B1D1F82459',
							dataUrl: 'basics/workflow/approver/getEntityApprovers',
							params: {
								entityId: 'Id',
								entityGUID: 'entityGuid'
							},
							parentService: 'procurementRfqMainService'
						}
					]
				}
			}
		};
	}
})(angular);
