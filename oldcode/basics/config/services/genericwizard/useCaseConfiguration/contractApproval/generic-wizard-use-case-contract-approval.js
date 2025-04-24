(function (angular) {
	'use strict';

	/* global globals, _ */
	angular.module('basics.config').factory('genericWizardUseCaseContractApproval', genericWizardUseCaseContractApproval);
	genericWizardUseCaseContractApproval.$inject = ['platformDialogService', '$injector', '$translate'];

	function genericWizardUseCaseContractApproval(platformDialogService, $injector, $translate) {

		function checkForComment(btn) {
			var genericWizardService = $injector.get('genericWizardService');
			var config = genericWizardService.providerData.ApprovalConfigurationForUser;
			// Approve
			if (btn.value === true) {
				return config.NeedComment4Approve;
			}
			// reject
			else if (btn.value === false) {
				return config.NeedComment4Reject;
			}
		}

		function finalizeContract(btn) {
			var headerText$tr$ = btn.title;
			// disable the button
			btn.disabled = true;
			var bodyText$tr$ = btn.question;
			var modalOptions = {
				headerText$tr$: bodyText$tr$,
				bodyText$tr$: 'cloud.desktop.contractApproval.reason',
				maxLength: 255,
				type: 'text'
			};

			if (checkForComment(btn)) {
				modalOptions.pattern = '^.{2,255}$';
			}

			// if(procuremntConfig requires comment)
			platformDialogService.showInputDialog(modalOptions).then(function (result) {
				if (result.ok) {
					// load the clone from cache
					var $http = $injector.get('$http');
					var genericWizardService = $injector.get('genericWizardService');
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
			genericWizardService.providerData.ContractRejectionConfigurationForUser = genericWizardService.providerData.ContractRejectionConfigurationForUser.filter(level => level.EvaluationLevel < currentEvaluationLevel);
			let headerText$tr$ = btn.title;
			let rejectionConfig = {
				modalHeaderText : $translate.instant(btn.question),
				currentEvaluationLevel: currentEvaluationLevel,
				clerkRoleFk: genericWizardService.providerData.ApprovalConfigurationForUser.ClerkRoleFk,
				evaluationLevels: genericWizardService.providerData.ContractRejectionConfigurationForUser
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
			Id: '39ea275187ce4b38a262508e8de55e01',
			entityGuid: 'A853F0B9E5E840D1B5B1882323C1C8F7',
			name: 'Contract Approval Wizard',
			name$tr: function () {
				return $translate.instant('cloud.desktop.contractApproval.contractApprovalWizardTitleName');
			},
			readonly: true,
			startEntity: 'ConHeaderId',
			keepConfigData: false,
			configProviders: [
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
					dataUrl: 'procurement/contract/header/getProcurementConfig',
					configName: 'procurementConfig',
					params: {
						PKey1: 'ConHeaderId'
					},
				},
				{
					dataUrl:'basics/workflow/approverConfig/getPreviousApproverLevels',
					configName:'ContractRejectionConfigurationForUser'
				}
			],
			wizardButtons: [
				{
					fn: function (btn) {
						finalizeContract(btn);
					},
					title: 'cloud.desktop.contractApproval.approve',
					question: 'cloud.desktop.contractApproval.sureApprove',
					successMsg: 'cloud.desktop.contractApproval.approveSuccess',
					value: true,
					isDisabled: function () {
						var genericWizardService = $injector.get('genericWizardService');
						return genericWizardService.config.approvalPossible === false;
					}
				},
				{
					fn: function (btn) {
						finalizeContract(btn);
					},
					title: 'cloud.desktop.contractApproval.reject',
					question: 'cloud.desktop.contractApproval.sureReject',
					successMsg: 'cloud.desktop.contractApproval.rejectSuccess',
					value: false,
					isDisabled: function () {
						var genericWizardService = $injector.get('genericWizardService');
						return genericWizardService.config.approvalPossible === false;
					}
				},{
					fn: function(btn){
						rejectToLevel(btn);
					},
					title: 'cloud.desktop.contractApproval.rejectToLevel',
					question: 'cloud.desktop.contractApproval.sureRejectToLevel',
					successMsg: 'cloud.desktop.contractApproval.rejectToLevelSuccess',
					value: false,
					isDisabled: function(){
						let genericWizardService = $injector.get('genericWizardService');
						if(genericWizardService.providerData.ApprovalConfigurationForUser!==undefined)
							return !genericWizardService.providerData.ApprovalConfigurationForUser.AllowReject2Level || genericWizardService.providerData.ApprovalConfigurationForUser.EvaluationLevel===genericWizardService.providerData.ContractRejectionConfigurationForUser[0].EvaluationLevel;
						return true;
					}
				}],
			moduleDependencies: {
				'procurement.contract': {
					containerList: [
						{
							// contract list
							uuid: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/header/get',
							isStartEntity: true,
							info: {displayMember: 'Code'}
						},
						{
							// contract detail
							uuid: 'B3B0FDF482AE4973A4B6BBEA754876C3',
							dataUrl: 'procurement/contract/header/get',
							isStartEntity: true,
							info: {displayMember: 'Code'}
						},
						{
							// Procurement BoQs
							uuid: 'A56A75CBE90545ECBFAFA5DE3F437F10',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/common/boq/list?exchangeRate=1',
							params: {
								prcHeaderFk: 'PrcHeaderFk'
							},
							info: {displayMember: 'BoqRootItem.Reference'},
							hide: function (config) {
								return config.procurementConfig.IsService === false;
							}
						},
						{
							// Boq Structure
							uuid: 'DC5C6ADCDC2346E09ADADBF5508842DE',
							dependentContainer: 'A56A75CBE90545ECBFAFA5DE3F437F10',
							dataUrl: 'boq/main/getCompositeBoqItems?depth=99&exchangeRate=1',
							params: {
								headerid: 'BoqRootItem.BoqHeaderFk'
							},
							parentProp: 'BoqItemFk',
							childProp: 'BoqItems',
							dtoAccess: 'dtos',
							info: {displayMember: 'Reference'},
							hide: function (config) {
								return config.procurementConfig.IsService === false;
							}
						},
						{
							// Approval Container
							uuid: '22307f2249d04061986c26508e5f6b1a',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/headerapproval/listbyparent',
							usePost: true,
							params: {
								PKey1: 'Id'
							}
						},
						{
							// Generic Approval Container
							uuid: 'c6079d3605874e1691c1221c77e8421a',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'basics/workflow/approver/getEntityApprovers',
							params: {
								entityId: 'Id',
								entityGUID: 'entityGuid'
							},
							parentService: 'procurementContractHeaderDataService'
						},
						{
							// generals
							uuid: '54DC0AE6C79E44548AD5C84EDD339DB4',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/common/prcgenerals/list',
							dtoAccess: 'Main',
							params: {
								MainItemId: 'PrcHeaderFk',
								projectId: 'ProjectFk'
							}
						},
						{
							// certificate
							uuid: '5055BA9CE9C14F78B445A97D74BC8B90',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/common/prccertificate/list',
							dtoAccess: 'Main',
							params: {
								MainItemId: 'PrcHeaderFk',
								projectId: 'ProjectFk'
							}
						},
						{
							// actual certificate
							uuid: '0F6AE8F1F34545559C008FCA53BE2754',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'businesspartner/certificate/certificate/listtocontract',
							dtoAccess: 'dtos',
							params: {
								MainItemId: 'Id',
								subsidiaryId: 'SubsidiaryFk'
							}
						},
						{
							// documentsProject
							uuid: '4EAA47C530984B87853C6F2E4E4FC67E',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'documents/projectdocument/final/listDocuments',
							dtoAccess: 'dtos',
							params: {'ConHeaderFk': 'Id'},
							// will be included as pattern in the sidebar filterRequest
							filterRequest: true,
							isDocumentContainer: true,
							info: {displayMember: ['DocumentOriginalFileName', 'OriginFileName', 'Description', 'DocumentDescription', 'Id']}
						},
						{
							// documents
							uuid: 'ec2420d04c8d458490c29edbd9b9cafc',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/common/prcdocument/listbyparent',
							usePost: true,
							params: {
								PKey1: 'PrcHeaderFk', // MainItemId: 'PrcHeaderFk'
								projectId: 'ProjectFk'
							},
							isDocumentContainer: true,
							dtoAccess: 'Main',
							info: {displayMember: ['DocumentOriginalFileName', 'OriginFileName', 'Description', 'DocumentDescription', 'Id']}
						},
						{
							// totals
							uuid: 'b19c1f681eee490ebb3ac023854db68d',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/contract/total/list',
							params: {
								MainItemId: 'Id',
								ConfigurationFk: 'PrcHeaderEntity.ConfigurationFk'
							},
							dtoAccess: 'Main'
						},
						{
							uuid: '9f5d33b39555424ba877447f2bfd1269',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'basics/billingschema/common/list',
							params: {
								mainItemId: 'Id',
								qualifier: 'prcContractBillingschmemaQualifier'
							},
							dtoAccess: 'Main'
						},
						{
							// pinboad comments
							uuid: '54dbff34150c4db09300d900d521baf0',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							info: {displayMember: 'Comment.Comment'},
						},
						{
							uuid: 'DEF60CC8FA044FE08FF72B773AF9D7EF',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							dataUrl: 'procurement/common/prcitem/list',
							params: {
								MainItemId: 'PrcHeaderFk',
								projectId: 'ProjectFk'
							},
							dtoAccess: 'Main',
							hide: function (config) {
								// hide when contract is of type service, all steps containing this container will be hidden!
								return config.procurementConfig.IsMaterial === false;
							}
						}
					]
				},
				'procurement.pricecomparison': {
					containerList: [
						{
							// RfQ List
							uuid: '1ec440875e364e8684f0ad25f0d94510',
							dataUrl: 'procurement/rfq/header/GetByContract',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							params: {
								contractFk: 'Id'
							},
							info: {displayMember: 'Code'}
						},
						{
							uuid: 'deb620733c7e494b8f4d261c4aa01c6b',
							dataUrl: 'procurement/pricecomparison/quote2rfq/listbyrfqheader',
							usePost: true,
							dependentContainer: '1ec440875e364e8684f0ad25f0d94510',
							params: {
								Pkey1: 'Id'
							}
						}
					]
				},
				'businesspartner.main': {
					containerList: [
						{
							// bp list
							uuid: '75dcd826c28746bf9b8bbbf80a1168e8',
							dataUrl: 'businesspartner/main/businesspartner/getItem',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							params: {
								mainItemId: 'BusinessPartnerFk'
							},
							info: {displayMember: 'BusinessPartnerName1'},
							selectEvent: 'bpChanged'
						},
						{
							// procurementStructure
							uuid: '77964d3aa8fb47a6af4bbcb4e65cdafb',
							dependentContainer: '75dcd826c28746bf9b8bbbf80a1168e8',
							dataUrl: 'businesspartner/main/bp2prcstructure/tree',
							params: {
								mainItemId: 'Id'
							},
							parentProp: 'ParentPrcStructureFk',
							childProp: 'ChildItems',
						},
						{
							// bp detail
							uuid: '411D27CFBB0B4643A368B19FA95D1B40',
							dataUrl: 'businesspartner/main/businesspartner/getItem',
							dependentContainer: 'E5B91A61DBDD4276B3D92DDC84470162',
							params: {
								mainItemId: 'BusinessPartnerFk'
							},
							info: {displayMember: 'BusinessPartnerName1'}
						},
						{
							// bp rating chart
							uuid: 'B3A462AFC69040048F267A15244AADB8',
							dependentContainer: '75dcd826c28746bf9b8bbbf80a1168e8'
						},
						{
							// bp relation chart
							uuid: '11DD248F6DB045029BA634BAA501FAAD',
							dependentContainer: '75dcd826c28746bf9b8bbbf80a1168e8'
						}
					]
				}
			},
			prcContractBillingschmemaQualifier: 'procurement.contract.billingschmema'
		};
	}
})(angular);
