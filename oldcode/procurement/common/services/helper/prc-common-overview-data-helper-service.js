(function (angular) {
	/* global globals, _,$ */
	'use strict';

	var modelName = 'procurement.common';
	angular.module(modelName).factory('procurementCommonOverviewDataHelperService', ['$http', '$q', '$injector', 'procurementContextService', 'platformTranslateService',
		'procurementModuleConstant', '$translate',
		function ($http, $q, $injector, procurementContextService, platformTranslateService, procurementModuleConstant, $translate) {
			var dataServiceContainerJsonRepository = {};
			var detailServiceContainerJsonRepository = null;

			var service = {};

			var packageKey = procurementModuleConstant.package.moduleName;
			var reqKey = procurementModuleConstant.requisition.moduleName;
			var contractKey = procurementModuleConstant.contract.moduleName;
			var quoteKey = procurementModuleConstant.quote.moduleName;
			var pesKey = procurementModuleConstant.pes.moduleName;
			var rfqKey = procurementModuleConstant.rfq.moduleName;
			var invoiceKey = procurementModuleConstant.invoice.moduleName;
			// eslint-disable-next-line no-unused-vars
			var inventoryKey = 'procurement.inventory';
			// eslint-disable-next-line no-unused-vars
			var defaultKey = 'default';
			var checkListKey = 'hsqe.checklist';
			var checkListTemplateKey = 'hsqe.checklisttemplate';
			var defectKey = 'defect.main';
			var prcStructureKey = 'basics.procurementstructure';

			service.getOverviewListByModuleName = function (moduleName) {
				var overViewList = {
					'procurement.inventory': service.getInventoryOverviewContainerList,
					'default': function () {
						return null;
					}
				};
				overViewList[packageKey] = service.getPackageOverviewContainerList;
				overViewList[reqKey] = service.getRequisitionOverviewContainerList;
				overViewList[contractKey] = service.getContractOverviewContainerList;
				overViewList[quoteKey] = service.getQuoteOverviewContainerList;
				overViewList[pesKey] = service.getPesOverviewContainerList;
				overViewList[rfqKey] = service.getRfqOverviewContainerList;
				overViewList[invoiceKey] = service.getInvoiceOverviewContainerList;
				overViewList[checkListKey] = service.getCheckListOverviewContainerList;
				overViewList[checkListTemplateKey] = service.getCheckListTemplateOverviewContainerList;
				overViewList[defectKey] = service.getDefectOverviewContainerList;
				overViewList[prcStructureKey] = service.getPrcStructureOverviewContainerList;

				return (overViewList[moduleName] || overViewList['default'])();
			};

			service.getOverviewContainerList = function () {
				var moduleName = procurementContextService.getModuleName();
				var level = service.getOverviewDisplayLevelByModuleName(moduleName);
				return service.getOverviewContainerListInLevel(level);
			};

			service.getOverviewDisplayLevelByModuleName = function (moduleName) {
				var overViewLevelList = {'default': 2};
				overViewLevelList[packageKey] = 1;
				overViewLevelList[reqKey] = 1;
				overViewLevelList[contractKey] = 1;
				overViewLevelList[quoteKey] = 1;
				overViewLevelList[pesKey] = 1;
				overViewLevelList[rfqKey] = 1;
				overViewLevelList[invoiceKey] = 1;
				overViewLevelList[checkListKey] = 1;
				overViewLevelList[checkListTemplateKey] = 2;
				overViewLevelList[defectKey] = 1;
				overViewLevelList[prcStructureKey] = 1;

				return overViewLevelList[moduleName];
			};

			function loadRelatedModulesTranslations() {
				platformTranslateService.registerModule(['basics.pricecondition', 'controlling.structure', 'boq.main']);
			}

			service.getContainerJSON = function getContainerJSON() {
				var moduleName = procurementContextService.getModuleName();
				loadRelatedModulesTranslations();
				return $http.get(globals.appBaseUrl + moduleName + '/content/json/module-containers.json').then(function (result) {
					if (result.data) {
						var includes = _.filter(result.data, function (includeDef) {
							return includeDef.include !== null && includeDef.include !== undefined;
						});

						if (!_.isNil(includes) && includes.length === 0) {
							return result.data;
						}

						var includeCalls = _.map(includes, function (includeDef) {
							return $http.get(globals.appBaseUrl + includeDef.include);
						});

						return $q.all(includeCalls)
							.then(function (responses) {
								return {
									data: _.concat(result.data, _.flatten(_.map(responses, function (r) {
										return r.data;
									})))
								};
							});
					}
				});
			};

			service.isDisableDependencyButton = function () {
				var leadingService = procurementContextService.getLeadingService();
				if (leadingService === null || leadingService === undefined || leadingService.getSelectedEntities === null || !_.isFunction(leadingService.getSelectedEntities)) {
					return true;
				}

				var entities = leadingService.getSelectedEntities();

				return _.isArray(entities) && entities.length > 1;


			};

			service.getMainItemInfo = function () {
				var leadingService = procurementContextService.getLeadingService();
				var moduleName = procurementContextService.getModuleName();
				var mainItemId = null;
				if (leadingService && leadingService.getSelected()) {
					mainItemId = leadingService.getSelected().Id;
				}

				var displayLevel = service.getOverviewDisplayLevelByModuleName(moduleName);
				var defaultSearchLevel = displayLevel + 1;

				return {
					mainItemId: mainItemId,
					moduleIdentifier: moduleName,
					searchLevel: defaultSearchLevel
				};
			};

			function getPrcItemScopeContainers(prcItemContainerUuid) {
				var prcItemScopeContainer = {
					Uuid: '1becbb65bdc0df7696b73b1800b5534f',
					ParentUuid: prcItemContainerUuid
				};
				var prcItemScopeDetailContainer = {
					Uuid: '38f5473d49816e82acfe96be709fb81e',
					ParentUuid: prcItemScopeContainer.Uuid
				};
				var prcItemScopeDetailPriceConditionContainer = {
					Uuid: 'a85ddb8363189b7eb48ad7e09b01885e',
					ParentUuid: prcItemScopeDetailContainer.Uuid
				};
				var prcItemScopeDetailBlobContainer = {
					Uuid: '5d8bb73681edf2dc2760b5f5895189c8',
					ParentUuid: prcItemScopeDetailContainer.Uuid
				};
				return [prcItemScopeContainer, prcItemScopeDetailContainer, prcItemScopeDetailPriceConditionContainer, prcItemScopeDetailBlobContainer];
			}

			service.getPackageOverviewContainerList = function () {
				var packageContainer = {
					Uuid: '1D58A4DA633A485981776456695E3241',
					ParentUuid: null,
					image: 'ico-accordion-root',
					Level: 0
				};
				var PackageTotalContainer = {
					Uuid: '35DBEB11E37B46869A4DECC4FD01F56E',
					ParentUuid: packageContainer.Uuid,
					// image:'ico-accordion-pos'
					Level: 2
				};

				var packageEventContainer = {
					Uuid: '07946CB829634366B34547B3C5987B23',
					ParentUuid: packageContainer.Uuid,
					Level: 1
				};

				var packageCashFlowForecastContainer = {
					Uuid: 'ED80D937DC834BA18F916505C7E6CD6D',
					ParentUuid: packageContainer.Uuid,
					Level: 1
				};

				var packageRemarkContainer = {
					Uuid: '1CV22AB7897R4B0F8196F4C5978EXA59',
					ParentUuid: packageContainer.Uuid,
					Level: 2
				};

				var package2HeaderContainer = {
					Uuid: 'FC591E48F5E740AD84068D97747A31AD',
					ParentUuid: packageContainer.Uuid,
					Level: 0
				};

				var prcGeneralsContainer = {
					Uuid: '49DEF9119F124A4B98AB3FF47D9130F3',
					ParentUuid: package2HeaderContainer.Uuid,
					Level: 1
				};

				var prcCertificatesContainer = {
					Uuid: '6B32AE890E4A4317BF1C422E9A492F30',
					ParentUuid: package2HeaderContainer.Uuid,
					Level: 1
				};

				var prcWarrantyContainer = {
					Uuid: 'a2525a0d73a546fa9990b56cccc0ebb5',
					ParentUuid: package2HeaderContainer.Uuid,
					Level: 1
				};

				var prcItemContainer = {
					Uuid: 'FB938008027F45A5804B58354026EF1C',
					ParentUuid: package2HeaderContainer.Uuid,
					Level: 1
				};

				var prcItemDeliveryScheduleContainer = {
					Uuid: '502EBB0D396C4E80BA8A76DA068EC9EE',
					ParentUuid: prcItemContainer.Uuid
				};

				var prcItemPriceConditionContainer = {
					Uuid: '68370C45D20F419DB3EBC8400428A984',
					ParentUuid: prcItemContainer.Uuid
				};

				var prcPaymentScheduleContainer = {
					Uuid: '3F5E1709104C407EA503562029609DFD',
					ParentUuid: package2HeaderContainer.Uuid,
					Level: 1
				};

				var prcMileStoneContainer = {
					Uuid: 'D58E6439ACB14016B269896987C1DFF1',
					ParentUuid: package2HeaderContainer.Uuid,
					Level: 1
				};

				var prcPackageDocumentContainer = {
					Uuid: '3899AD6A9FCE4B75981A350D4F5C1F6B',
					ParentUuid: packageContainer.Uuid,
					Level: 1
				};

				var prcPackageCommentContainer = {
					Uuid: '39ce5bd4dd6b43c0a18329031923d582',
					ParentUuid: packageContainer.Uuid,
					Level: 2
				};

				var prcBoqContainer = {
					Uuid: 'D25A80A90961449EB38A0B54A34B6BBF',
					ParentUuid: package2HeaderContainer.Uuid,
					Level: 1
				};

				var prcBoqItemContainer = {
					Uuid: '29633DBCE00E41C4B494F867D7699EA5',
					ParentUuid: prcBoqContainer.Uuid
				};

				var prcBoqItemSplitQuantityContainer = {
					Uuid: 'a5b3f7c09c4144678b6cbf33977da2c0',
					ParentUuid: prcBoqItemContainer.Uuid
				};

				var prcPackageEstimateHeaderContainer = {
					Uuid: '2682301EE1AD4B4AB523DF2361A9FB3F',
					ParentUuid: packageContainer.Uuid,
					Level: 1
				};

				var prcPackageEstimateLineItemContainer = {
					Uuid: '067BE143D76D4AD080660EF147349F1D',
					ParentUuid: prcPackageEstimateHeaderContainer.Uuid,
					Level: 1
				};

				var prcPackageEstimateResourceContainer = {
					Uuid: '691DF3BC90574BE182ED007600A15D44',
					ParentUuid: prcPackageEstimateHeaderContainer.Uuid,
					Level: 1
				};

				var prcPackageImportContainer = {
					Uuid: '8A276C0574F94690A6087D9F22A06519',
					ParentUuid: packageContainer.Uuid,
					Level: 2
				};

				var subContractorContainer = {
					Uuid: 'bc860c5260774379a8509355f4048f31',
					ParentUuid: packageContainer.Uuid,
					Level: 1
				};

				var projectDocumentContainer = {
					Uuid: '4EAA47C530984B87853C6F2E4E4FC67E',
					ParentUuid: packageContainer.Uuid,
					Level: 1
				};

				var projectDocumentRevisionContainer = {
					Uuid: '684F4CDC782B495E9E4BE8E4A303D693',
					ParentUuid: projectDocumentContainer.Uuid
				};

				var projectDocumentHistoryContainer = {
					Uuid: '39d0d1c6753b49029b3c953165f8ceb7',
					ParentUuid: projectDocumentContainer.Uuid
				};

				var boqItemSpecificationPlainContainer = {
					Uuid: '9C2BB494E2E34B498CCF7CE54FE942D7',
					ParentUuid: prcBoqItemContainer.Uuid
				};

				var boqPlainTextComplementContainer = {
					Uuid: '262cd8eb25fd49afaaaad6e4398285c2',
					ParentUuid: prcBoqItemContainer.Uuid
				};

				var boqSurchargedItemContainer = {
					Uuid: '6d2a92bd0650457b81e56b49c25cb8fd',
					ParentUuid: prcBoqItemContainer.Uuid
				};

				var clerkContainer = {
					Uuid: 'b6d298c07cf14196912cc4a9d2688189',
					ParentUuid: packageContainer.Uuid,
					Level: 2
				};

				var clerkAltContainer = {
					Uuid: '19fd49aeacaa4f28a58cfe63e2b596fa',
					ParentUuid: packageContainer.Uuid,
					Level: 2
				};

				var suggestedBidderContainer = {
					Uuid: 'd581746fd5c34c28bc0d62eb0e724837',
					ParentUuid: packageContainer.Uuid,
					Level: 1
				};

				var prcItemAssignmentContainer = {
					Uuid: '49892c71ffee4da096cecfd6834a29b9',
					ParentUuid: packageContainer.Uuid,
					Level: 1
				};

				var prcItemInfoBLContainer = {
					Uuid: '70ed545c2a96462fad76a11af539431a',
					ParentUuid: prcItemContainer.Uuid
				};

				var prcItemInfoBLSpecificationContainer = {
					Uuid: '74a65636ddd14e7db664436603eb48b4',
					ParentUuid: prcItemInfoBLContainer.Uuid
				};

				var userFormContainer = {
					Uuid: 'D68A18244FB9427FAF41B721371CA02D',
					ParentUuid: packageContainer.Uuid,
					Level: 2
				};

				var characteristicContainer = {
					Uuid: '5a8146afeee2404780c8a65e537f6f30',
					ParentUuid: packageContainer.Uuid
				};

				/* var crbPriceCondition = {
					Uuid :'30c80fb7cb324707ab0540f13296d242',
					ParentUuid:prcBoqContainer.Uuid
				}; */

				var priceConditionParamContainer = {
					Uuid: '2760a9094c9641548ee6efbab089cee4',
					ParentUuid: packageContainer.Uuid,
					Level: 2
				};

				var crbPlainTextContainer = {
					Uuid: 'dc9178196a4a464fb75356f5a2689d71',
					ParentUuid: prcBoqItemContainer.Uuid
				};

				var boqDocumentContainer = {
					Uuid: 'b5ffb201b81d413987f7c0b6634e6816',
					ParentUuid: prcBoqItemContainer.Uuid
				};

				var controllingStructureGrpSetContainer = {
					Uuid: 'C1A994B958264B50AD96AB3ADA257AF3',
					ParentUuid: prcItemContainer.Uuid
				};
				var prcItemTextContainer = {
					Uuid: 'A476CF6A63564EA1B67BD703F11B0B0F',
					ParentUuid: prcItemContainer.Uuid
				};

				var prcHeaderText = {
					Uuid: '864613B03ABF4F7BBF7D35FEC6E7DF0D',
					ParentUuid: packageContainer.Uuid
				};

				var containerList = [packageContainer, PackageTotalContainer, packageEventContainer, packageRemarkContainer, package2HeaderContainer, prcPackageDocumentContainer,
					prcItemContainer, prcItemAssignmentContainer, prcItemInfoBLContainer, prcItemInfoBLSpecificationContainer, prcItemDeliveryScheduleContainer, controllingStructureGrpSetContainer,
					prcBoqContainer, prcBoqItemContainer, boqItemSpecificationPlainContainer, boqPlainTextComplementContainer, boqSurchargedItemContainer, prcBoqItemSplitQuantityContainer,
					prcPaymentScheduleContainer, prcPackageCommentContainer, clerkContainer, clerkAltContainer, suggestedBidderContainer,
					packageCashFlowForecastContainer, prcItemPriceConditionContainer, prcGeneralsContainer, prcMileStoneContainer,
					prcCertificatesContainer, prcWarrantyContainer, prcPackageImportContainer, subContractorContainer,
					prcPackageEstimateHeaderContainer, prcPackageEstimateLineItemContainer, prcPackageEstimateResourceContainer,
					projectDocumentContainer, projectDocumentHistoryContainer, projectDocumentRevisionContainer, userFormContainer, characteristicContainer,
					priceConditionParamContainer, crbPlainTextContainer, boqDocumentContainer, prcItemTextContainer, prcHeaderText];
				return _.concat(containerList, getPrcItemScopeContainers(prcItemContainer.Uuid));
			};

			service.getOverviewContainerListInLevel = function (level) {
				var moduleName = procurementContextService.getModuleName();
				var containerList = service.getOverviewListByModuleName(moduleName);
				var rootContainer = containerList[0];
				rootContainer.Level = 0;

				service.setLevelForContainerList(containerList, rootContainer);

				return _.filter(containerList, function (container) {
					return container.Level <= level;
				});
			};

			service.setLevelForContainerList = function setLevelForContainerList(containerList, parentContainer) {
				var containers = _.filter(containerList, function (item) {
					return item.ParentUuid === parentContainer.Uuid;
				});

				_.map(containers, function (container) {
					container.Level = container.Level || (parentContainer.Level + 1);
					setLevelForContainerList(containerList, container);
				});
			};

			service.getRequisitionOverviewContainerList = function () {
				var requisitionHeaderContainer = {
					Uuid: '509F8B1F81EA475FBEBF168935641489',
					ParentUuid: null,
					Level: 0
				};

				var prcItemContainer = {
					Uuid: '5D58A4A9633A485986776456695E1241',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var reqTotalContainer = {
					Uuid: '985F496B39EB4CD08D9CD4F9F3C8D1E4',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 2
				};

				var deliveryScheduleContainer = {
					Uuid: 'A3F91320A8ED4A56BC711537A31F1A2A',
					ParentUuid: prcItemContainer.Uuid,
					Level: 2
				};

				var contactContainer = {
					Uuid: '5516761ED60C449E9F8FEF302C4595D3',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 2
				};

				var prcDocument = {
					Uuid: '4006012996104D98A9A6BC11D4B0BEA4',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var prcCertificateContainer = {
					Uuid: '3304C905EC9249DCA401CF64FF00A765',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var prcMileStoneContainer = {
					Uuid: '7C83FC5CEA7A4C8396D47877AE72B4B4',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var subcontractorContainer = {
					Uuid: 'B5431F508A644C73AE29CC90B8E6073B',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var generalsContainer = {
					Uuid: 'D3873514781444DC9F62255CA041E394',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var prcBoqContainer = {
					Uuid: '3AF545F7AA6B40498908EBF41ABB78D8',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var boqItemContainer = {
					Uuid: '58F71F3079C9450D9723FC7194E433C2',
					ParentUuid: prcBoqContainer.Uuid
				};

				var boqPriceConditionContainer = {
					Uuid: '9FC06C9F0FCB401499C7F737B290A4E3',
					ParentUuid: boqItemContainer.Uuid
				};

				var characteristicContainer = {
					Uuid: 'b3f1b7a59f40437f878f680a1bd4f8e7',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var userFormContainer = {
					Uuid: '9F8740ECF4FB46E9874633478F9F8585',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 2
				};

				var projectDocumentContainer = {
					Uuid: '4EAA47C530984B87853C6F2E4E4FC67E',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var documentRevisionContainer = {
					Uuid: '684F4CDC782B495E9E4BE8E4A303D693',
					ParentUuid: projectDocumentContainer.Uuid
				};

				var documentHistoryContainer = {
					Uuid: '39d0d1c6753b49029b3c953165f8ceb7',
					ParentUuid: projectDocumentContainer.Uuid
				};

				var suggestedBiddersContainer = {
					Uuid: 'df5c94984af84ff49c7310eac5e25fff',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var boqSurchargedItemContainer = {
					Uuid: '734030e3a8b742ea9f4d64f517e919e0',
					ParentUuid: boqItemContainer.Uuid
				};

				var boqItemSpecificationPlainContainer = {
					Uuid: 'dede627848f545b1ad27d57e80dc9a2c',
					ParentUuid: boqItemContainer.Uuid
				};

				var boqPlainTextComplementContainer = {
					Uuid: '88b9a8bb2111450b9fd724eee6b0f6a0',
					ParentUuid: boqItemContainer.Uuid
				};

				var crbPriceCondition = {
					Uuid: '4faaa941fc2944bdaf696f203c1ad505',
					ParentUuid: prcBoqContainer.Uuid
				};

				var priceConditionParamContainer = {
					Uuid: 'f35464032873425baea4dffd23e567dc',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 2
				};

				var crbPlainTextContainer = {
					Uuid: 'fcaf35dfcb5f4c1980150199386d54ba',
					ParentUuid: boqItemContainer.Uuid
				};

				var boqDocumentContainer = {
					Uuid: 'cf267308dd9d40de855d7b5874376ba7',
					ParentUuid: boqItemContainer.Uuid
				};

				var reqPackageEventContainer = {
					Uuid: 'CCCFBB09280A46E2B7707AC5C566AF61',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 2
				};

				var prcPaymentScheduleContainer = {
					Uuid: '423730D7024B4D8BABE269DDA3790B59',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 2
				};

				var prcItemPriceConditionContainer = {
					Uuid: '0CB794A5C72844F1B4CEE6400C4570E7',
					ParentUuid: prcItemContainer.Uuid
				};

				var prcWarrantyContainer = {
					Uuid: 'ae65ccbf11c64125ad436d6b16ed22a2',
					ParentUuid: requisitionHeaderContainer.Uuid,
					Level: 1
				};

				var prcBoqItemSplitQuantityContainer = {
					Uuid: '8c8257064e5b4db8bf624899fa5dbef2',
					ParentUuid: boqItemContainer.Uuid
				};

				var prcHeaderTextContainer = {
					Uuid: 'C8611FE10FBD4999868BCE45EF09A057',
					ParentUuid: requisitionHeaderContainer.Uuid
				};

				return [requisitionHeaderContainer, reqTotalContainer, deliveryScheduleContainer, contactContainer, prcItemContainer, prcDocument,
					prcCertificateContainer, prcMileStoneContainer, subcontractorContainer, generalsContainer,
					prcBoqContainer, boqItemContainer, boqSurchargedItemContainer, boqItemSpecificationPlainContainer, boqPlainTextComplementContainer, boqDocumentContainer,
					crbPriceCondition, crbPlainTextContainer, prcPaymentScheduleContainer, prcBoqItemSplitQuantityContainer,
					projectDocumentContainer, suggestedBiddersContainer, reqPackageEventContainer, prcWarrantyContainer, prcItemPriceConditionContainer,
					documentRevisionContainer, documentHistoryContainer, userFormContainer, characteristicContainer, boqPriceConditionContainer, priceConditionParamContainer, prcHeaderTextContainer];
			};

			service.getContractOverviewContainerList = function () {
				var contractHeaderContainer = {
					Uuid: 'E5B91A61DBDD4276B3D92DDC84470162',
					ParentUuid: null,
					Level: 0
				};

				var prcItemContainer = {
					Uuid: 'DEF60CC8FA044FE08FF72B773AF9D7EF',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 1
				};

				var prcItemDeliveryContainer = {
					Uuid: '3BC0EAFCAE734307B5CC0974405BA10F',
					ParentUuid: prcItemContainer.Uuid
				};

				var prcTotalContainer = {
					Uuid: 'B19C1F681EEE490EBB3AC023854DB68D',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var prcContactContainer = {
					Uuid: '9DE5ED967FA84B638446C8C50FDB867A',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var prcCertificateContainer = {
					Uuid: '5055BA9CE9C14F78B445A97D74BC8B90',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 1
				};

				var prcMileStoneContainer = {
					Uuid: 'E146E86368BF41FF9682B989A9DF3291',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 1
				};

				var prcPaymentScheduleContainer = {
					Uuid: '0613476F0A9A4A87BA62F830FFF99C7D',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var prcDocumentContainer = {
					Uuid: 'EC2420D04C8D458490C29EDBD9B9CAFC',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 1
				};

				var prcSubContractorContainer = {
					Uuid: '2A7E35D3FDDC41A0ABB141DC2D868EBD',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 1
				};

				var prcGeneralContainer = {
					Uuid: '54DC0AE6C79E44548AD5C84EDD339DB4',
					ParentUuid: contractHeaderContainer.Uuid
				};

				var prcBoqContainer = {
					Uuid: 'A56A75CBE90545ECBFAFA5DE3F437F10',
					ParentUuid: contractHeaderContainer.Uuid
				};

				var boqStructureContainer = {
					Uuid: 'DC5C6ADCDC2346E09ADADBF5508842DE',
					ParentUuid: prcBoqContainer.Uuid
				};

				var boqStructurePriceCondition = {
					Uuid: '698ED3B0BC7B4E8B8A43876FA38979C6',
					ParentUuid: boqStructureContainer.Uuid
				};

				var userForm = {
					Uuid: '13FD1F28813A4772A4CE9074FAEFCB0A',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var characteristic = {
					Uuid: 'd2b5525ef2ee49e4b820de6004dfb8c4',
					ParentUuid: contractHeaderContainer.Uuid
				};

				var actualCertificate = {
					Uuid: '0F6AE8F1F34545559C008FCA53BE2754',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var documentProject = {
					Uuid: '4EAA47C530984B87853C6F2E4E4FC67E',
					ParentUuid: contractHeaderContainer.Uuid
				};

				var documentProjectRevision = {
					Uuid: '684F4CDC782B495E9E4BE8E4A303D693',
					ParentUuid: documentProject.Uuid
				};

				var documentHistory = {
					Uuid: '39d0d1c6753b49029b3c953165f8ceb7',
					ParentUuid: documentProject.Uuid
				};

				var boqCopySourceContainer = {
					Uuid: '6e1299c6d9c844ac90daf517b7d7eab9',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var prcHeaderPlainTextContainer = {
					Uuid: 'AAC4FC428BB1456CBF580ECD442CD802',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var prcHeaderTextContainer = {
					Uuid: 'AF859543498E499FB082581FF7DA6201',
					ParentUuid: contractHeaderContainer.Uuid
				};

				var boqSpecificationPlain = {
					Uuid: 'C99BF924BBDD4AF982127D8F6F37213E',
					ParentUuid: boqStructureContainer.Uuid
				};

				var boqPlainTextComplement = {
					Uuid: '9eece434109b441e80f9168f67c99b7b',
					ParentUuid: boqStructureContainer.Uuid
				};

				var crbPlainTextComplement = {
					Uuid: '884f911425e549589852ecbd654054ea',
					ParentUuid: boqStructureContainer.Uuid
				};

				var boqDocumentContainer = {
					Uuid: '292c2db151564ccd9747e1ebc7ab5f5a',
					ParentUuid: boqStructureContainer.Uuid
				};

				var crbPriceCondition = {
					Uuid: '138b355681124e1fa3adb1f77bb339cc',
					ParentUuid: boqStructureContainer.Uuid
				};

				var boqSpecificationContainer = {
					Uuid: '51D11ADE0EAB47CC8AB1C5BACED1D5AF',
					ParentUuid: boqStructureContainer.Uuid
				};

				var boqHtmlTextComplementContainer = {
					Uuid: 'aa66c3adabfe412f8891cb0c6f173881',
					ParentUuid: boqStructureContainer.Uuid
				};

				var boqSurchargeContainer = {
					Uuid: 'de5b16e007494f3994b08bef14405deb',
					ParentUuid: boqStructureContainer.Uuid
				};

				var prcPackageEventContainer = {
					Uuid: '7879859FDBD94C1CA3462C7919B7BC6E',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};
				var callOffAgreementContainer = {
					Uuid: '16d4b43815ce46bfb37189ec58d973bb',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var mandatoryDeadLineContainer = {
					Uuid: 'bf1dc8854bd945928f5f890af558a5e5',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var splitQuantityContainer = {
					Uuid: '0da233bc77f3447db8a0e059b0df8cae',
					ParentUuid: boqStructureContainer.Uuid
				};

				var materialPriceConditionContainer = {
					Uuid: '7E92ACAC64E2497782D6DEC303940BB2',
					ParentUuid: prcItemContainer.Uuid
				};

				var contractClerkContainer = {
					Uuid: '8559f4ea73e746c7a1f7cb718917b125',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var billingSchemaContainer = {
					Uuid: '9f5d33b39555424ba877447f2bfd1269',
					ParentUuid: contractHeaderContainer.Uuid
				};
				// generic structure  // contract grouping

				var accountAssignment = {
					Uuid: '1C5E0A69E0A343EEB3E9F9E700F171EB',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var contractCrewContainer = {
					Uuid: '518782BB7E024921B68890D83332867A',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var masterRestrictionContainer = {
					Uuid: '5f355e34c4dc43a2a7e5dcda155afc92',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var prcItemInfoBlContainer = {
					Uuid: 'cca0f519d5b14830b052dc9053f5bc8f',
					ParentUuid: prcItemContainer.Uuid
				};

				var prcItemInfoBlSpecificationPlainContainer = {
					Uuid: '26e0dad94ac54e35a39e3b79ac22af4f',
					ParentUuid: prcItemInfoBlContainer.Uuid
				};

				var prcItemScopeContainer = {
					Uuid: '1becbb65bdc0df7696b73b1800b5534f',
					ParentUuid: prcItemContainer.Uuid
				};

				var prcItemScopeDetailContainer = {
					Uuid: '38f5473d49816e82acfe96be709fb81e',
					ParentUuid: prcItemScopeContainer.Uuid
				};

				var prcItemScopeDetailPriceConditionContainer = {
					Uuid: 'a85ddb8363189b7eb48ad7e09b01885e',
					ParentUuid: prcItemScopeDetailContainer.Uuid
				};

				var prcItemScopeDetailBlobContainer = {
					Uuid: '5d8bb73681edf2dc2760b5f5895189c8',
					ParentUuid: prcItemScopeDetailContainer.Uuid
				};

				var priceConditionParamContainer = {
					Uuid: '1ad2b47c38cb44d6bd75555e82d39e67',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				var structureGrpSetContainer = {
					Uuid: '4B2C873526CC4F8C8E8B652CFDA4F8FE',
					ParentUuid: prcItemContainer.Uuid
				};

				var advanceContainer = {
					Uuid: '06e6c5040b5640ebbd18b99d77717014',
					ParentUuid: contractHeaderContainer.Uuid
				};
				var postConHistory = {
					Uuid: '7255830deaab4be180657d0bceb05bdd',
					ParentUuid: documentProject.Uuid
				};
				var businessPartnerEvaluation = {
					Uuid: '9d67469eaff347a097267622cf076401',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};
				var warrantyContainer = {
					Uuid: '96ad9514b39e48a697354249640402cd',
					ParentUuid: contractHeaderContainer.Uuid
				};
				var callOffsChangeContainer = {
					Uuid: '1358a3d7ad534a86a38393d64de36486',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};
				var contractCommentContainer = {
					Uuid: '454c582d76004d37a9975728c9444bc1',
					ParentUuid: contractHeaderContainer.Uuid,
					Level: 2
				};

				return [contractHeaderContainer, prcItemContainer, prcTotalContainer, prcItemDeliveryContainer, prcContactContainer,
					prcCertificateContainer, prcMileStoneContainer,
					prcPaymentScheduleContainer, prcSubContractorContainer, prcDocumentContainer, prcGeneralContainer, prcBoqContainer, boqStructureContainer, boqStructurePriceCondition,
					userForm, characteristic, actualCertificate, documentProject, documentProjectRevision, documentHistory,
					boqCopySourceContainer, prcHeaderTextContainer, boqSpecificationPlain, boqPlainTextComplement, crbPlainTextComplement, boqDocumentContainer, crbPriceCondition,
					boqSpecificationContainer, boqHtmlTextComplementContainer, boqSurchargeContainer, prcPackageEventContainer, callOffAgreementContainer, mandatoryDeadLineContainer,
					splitQuantityContainer, materialPriceConditionContainer, contractClerkContainer, billingSchemaContainer, accountAssignment, contractCrewContainer,
					masterRestrictionContainer, prcItemInfoBlContainer, prcItemInfoBlSpecificationPlainContainer, priceConditionParamContainer, structureGrpSetContainer,
					advanceContainer, postConHistory, businessPartnerEvaluation, warrantyContainer, callOffsChangeContainer, contractCommentContainer,
					prcItemScopeContainer, prcItemScopeDetailContainer, prcItemScopeDetailPriceConditionContainer, prcItemScopeDetailBlobContainer, prcHeaderPlainTextContainer];
			};

			service.getQuoteOverviewContainerList = function () {
				var quoteHeaderContainer = {
					Uuid: '338048AC80F748B3817ED1FAEA7C8AA5',
					ParentUuid: null
				};
				var quoteRequisitionContainer = {
					Uuid: 'AB8B7CDBC7FE411C87F2D18E4E0DFFB9',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var prcItemContainer = {
					Uuid: '274DA208B3DA47988366D48F38707DE1',
					ParentUuid: quoteHeaderContainer.Uuid
				};
				var quoteTotalContainer = {
					Uuid: '4C1C7E4B63D64C43A95E701A7FFC530E',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var deliveryScheduleContainer = {
					Uuid: '5369B79F3A204FA5A7470AC88A6C2DA5',
					ParentUuid: prcItemContainer.Uuid
				};
				var contactContainer = {
					Uuid: '13E7F8A9CE0444489ED1FA96CB43C79D',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var certificatesContainer = {
					Uuid: '2C28D44A8D1442D1A7F44ACE864ECCC9',
					ParentUuid: quoteHeaderContainer.Uuid
				};
				var milestoneContainer = {
					Uuid: 'A21042925BF44AE59FA2D849BBEC3818',
					ParentUuid: quoteHeaderContainer.Uuid
				};
				var subcontractorContainer = {
					Uuid: '59B068FC4983400793F62179D3791158',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var generalContainer = {
					Uuid: 'E2A1CCCDA07D48E68F2B0FC4208E61EE',
					ParentUuid: quoteHeaderContainer.Uuid
				};
				var quotePrcDocumentContainer = {
					Uuid: '26E2ED9B49A14FB3BC4DC989177BC937',
					ParentUuid: quoteHeaderContainer.Uuid
				};
				var rfqPrcDocumentContainer = {
					Uuid: '38ef808fc2e1439cb90150815fba05fd',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var prcHeaderTextContainer = {
					Uuid: '38526F78C929405D8D73E237331EF8AE',
					ParentUuid: quoteHeaderContainer.Uuid
				};
				var prcHeaderPlainTextContainer = {
					Uuid: '6d24169a093c4a038bdcad715d9bb704',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var itemText = {
					Uuid: 'DFDB7875883540C5A5C4C8510625489F',
					ParentUuid: quoteRequisitionContainer.Uuid
				};
				var itemPlainText = {
					Uuid: 'edf1883e982f4188bfbb0a8fc48f0300',
					ParentUuid: quoteRequisitionContainer.Uuid
				};
				var prcBoqContainer = {
					Uuid: '3AA545F7AA6B40498908EBF41ABB78D8',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 1
				};
				var boqItemContainer = {
					Uuid: '58D71F3079C9450D9723FC7194E433C2',
					ParentUuid: prcBoqContainer.Uuid
				};
				var boqPriceCondition = {
					Uuid: '877D6DCD1AB94FA1BA78ADF9B13A8C59',
					ParentUuid: quoteRequisitionContainer.Uuid
				};
				var characteristic = {
					Uuid: '7214523301dc419081942479f0f30cfc',
					ParentUuid: quoteHeaderContainer.Uuid
				};
				var userFormContainer = {
					Uuid: 'ce03f819bcf64d2892c0b3867e310a87',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var documentProject = {
					Uuid: '4EAA47C530984B87853C6F2E4E4FC67E',
					ParentUuid: quoteHeaderContainer.Uuid
				};
				var documentProjectRevision = {
					Uuid: '684F4CDC782B495E9E4BE8E4A303D693',
					ParentUuid: documentProject.Uuid
				};
				var documentProjectHistory = {
					Uuid: '39d0d1c6753b49029b3c953165f8ceb7',
					ParentUuid: documentProject.Uuid
				};
				var boqSpecificationPlain = {
					Uuid: '04A9945E8DB6422191E65614ECA7A469',
					ParentUuid: prcBoqContainer.Uuid
				};
				var boqPlainTextComplement = {
					Uuid: '88b9a8bb2111450b9fd724eee6b0f6a0',
					ParentUuid: boqItemContainer.Uuid
				};
				var crbPlainTextComplementContainer = {
					Uuid: '61674e225dae475dab0516a9b70773b7',
					ParentUuid: boqItemContainer.Uuid
				};
				var boqDocument = {
					Uuid: 'c906fd6b634d4e21ab501773ac25eb82',
					ParentUuid: boqItemContainer.Uuid
				};
				var crbPriceCondition = {
					Uuid: '5baffeab2c244ddf92d3d3b36c42855b',
					ParentUuid: boqItemContainer.Uuid
				};
				var boqSpecification = {
					Uuid: 'C8DC6E155FE74A1992D316B36BE16BBB',
					ParentUuid: boqItemContainer.Uuid
				};
				var boqHtmlTextComplement = {
					Uuid: '874aa0deb4ba4a18afa9db75f40a975d',
					ParentUuid: boqItemContainer.Uuid
				};
				var boqSurcharge = {
					Uuid: 'ab68bb024f5d4b0784aebae8736a6489',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var quotePackageEvent = {
					Uuid: '5AE32129FFCF4552A5B0F65207BD0B30',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var boqSplitQuantity = {
					Uuid: '3f279d78678941a78332e7fb11aae801',
					ParentUuid: boqItemContainer.Uuid
				};
				var callOffAgreement = {
					Uuid: 'b955eabb69424568857f355e28cdb116',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var mandatoryDeadLine = {
					Uuid: '1ea54179aa43468d865f6f23577f69ae',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var actualCertificate = {
					Uuid: '0F6AE8F1F34545559C008FCA53BE2751',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var materialPriceCondition = {
					Uuid: '8B99F411368A46C18281A54713E58BDA',
					ParentUuid: prcItemContainer.Uuid
				};
				var billingSchema = {
					Uuid: '5627df6ded4242e48ae56e5163320a53',
					ParentUuid: quoteHeaderContainer.Uuid
				};
				var bpEvaluation = {
					Uuid: '367c0031930d45d9a84cd866326702bc',
					ParentUuid: quoteHeaderContainer.Uuid
				};
				var bpEvaluationStructure = {
					Uuid: '866a79face3443eeb3745549984b8f4a',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				// viewer containers
				var prcItemScopeContainers = getPrcItemScopeContainers(prcItemContainer.Uuid);
				var priceConditionParam = {
					Uuid: '215e6c078d7b45b2b1d6fa43c373058d',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var grpSetContainer = {
					Uuid: '48532BE84F85458ABC9559FD70C7C047',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};
				var warrantyContainer = {
					Uuid: '5dadbe5bf64b4f479360ef98306ffb3a',
					ParentUuid: quoteRequisitionContainer.Uuid,
					Level: 2
				};
				var prcQuoteCommentContainer = {
					Uuid: 'd02384f254c04a72b68af0ab6f30a28e',
					ParentUuid: quoteHeaderContainer.Uuid,
					Level: 2
				};

				var containerList = [quoteHeaderContainer, quoteRequisitionContainer, prcItemContainer, quoteTotalContainer, deliveryScheduleContainer, contactContainer, certificatesContainer,
					milestoneContainer, subcontractorContainer, generalContainer, quotePrcDocumentContainer, rfqPrcDocumentContainer, prcHeaderTextContainer, prcHeaderPlainTextContainer,
					prcBoqContainer, boqItemContainer, itemPlainText, itemText, boqPriceCondition, characteristic, userFormContainer, documentProject, documentProjectRevision,
					documentProjectHistory, boqHtmlTextComplement, boqSpecificationPlain, boqPlainTextComplement, crbPlainTextComplementContainer, crbPriceCondition, boqDocument, boqSpecification, boqSurcharge,
					quotePackageEvent, boqSplitQuantity, callOffAgreement, mandatoryDeadLine, actualCertificate, materialPriceCondition, billingSchema, bpEvaluation, bpEvaluationStructure,
					priceConditionParam, grpSetContainer, warrantyContainer, prcQuoteCommentContainer];
				return _.concat(containerList, prcItemScopeContainers);
			};

			service.getRfqOverviewContainerList = function () {
				var rfqHeaderContainer = {
					Uuid: '037C70C17687481A88C726B1D1F82459',
					ParentUuid: null
				};

				var prcRfqTotalContainer = {
					Uuid: 'E85EEB08B0C245E69EF03DD841B568CA',
					ParentUuid: rfqHeaderContainer.Uuid,
					Level: 2
				};

				var prcRfqBusinessPartnerContainer = {
					Uuid: 'A2F96B998A304EECADBC246514C4089A',
					ParentUuid: rfqHeaderContainer.Uuid
				};

				var prcRfqRequisitionContainer = {
					Uuid: '3DA6F959D8744A84BE2D78DAC89FFEEF',
					ParentUuid: rfqHeaderContainer.Uuid
				};

				var prcRfqCharacteristicContainer = {
					Uuid: 'DE7F382A4AD949F5BE04354B1D4323A4',
					ParentUuid: rfqHeaderContainer.Uuid,
					Level: 2
				};

				var userFormContainer = {
					Uuid: '64BFB8A2501645CF873BDC33EC0DB7DA',
					ParentUuid: rfqHeaderContainer.Uuid,
					Level: 2
				};

				var documentProjectContainer = {
					Uuid: '4EAA47C530984B87853C6F2E4E4FC67E',
					ParentUuid: rfqHeaderContainer.Uuid
				};

				var documentProjectRevisionContainer = {
					Uuid: '684F4CDC782B495E9E4BE8E4A303D693',
					ParentUuid: documentProjectContainer.Uuid
				};

				var documentProjectHistoryContainer = {
					Uuid: '39d0d1c6753b49029b3c953165f8ceb7',
					ParentUuid: documentProjectContainer.Uuid
				};

				var activityStream = {
					Uuid: '4aeacfe155754ccd9556b9dfcdf67ecf',
					ParentUuid: rfqHeaderContainer.Uuid,
					Level: 2
				};

				var eventContainer = {
					Uuid: 'A9920C855D49423ABE4F8EBA30ADBB7A',
					ParentUuid: rfqHeaderContainer.Uuid,
					Level: 2
				};

				var prcDocumentContainer = {
					Uuid: '522cf3266f4b49dd8fe4e6569a5845ae',
					ParentUuid: rfqHeaderContainer.Uuid,
					Level: 2
				};

				// model viwer containers

				var rfqHeaderTextPlainContainer = {
					Uuid: 'a56250d1729cc8620c8bd37ce1e538b4',
					ParentUuid: rfqHeaderContainer.Uuid,
					Level: 2
				};

				var rfqHeaderTextContainer = {
					Uuid: '70b733fa41445996bb780c34434d138c',
					ParentUuid: rfqHeaderContainer.Uuid
				};

				var rfqSendHistoryContainer = {
					Uuid: 'dbfa5ff5cbb34fe4a7feba67a5360e81',
					ParentUuid: rfqHeaderContainer.Uuid,
					Level: 2
				};

				var suggestedBidderContainer = {
					Uuid: '35f46630f52f45b4877f2028716186f2',
					ParentUuid: rfqHeaderContainer.Uuid,
					Level: 2
				};

				var rfqCommentContainer = {
					Uuid: '2254e4b546af4b01b60f7aea33005955',
					ParentUuid: rfqHeaderContainer.Uuid,
					Level: 2
				};

				return [rfqHeaderContainer, prcRfqTotalContainer, prcRfqBusinessPartnerContainer, prcRfqRequisitionContainer, prcRfqCharacteristicContainer, userFormContainer,
					documentProjectContainer, documentProjectRevisionContainer, documentProjectHistoryContainer, eventContainer, prcDocumentContainer,
					rfqSendHistoryContainer, suggestedBidderContainer, rfqCommentContainer, rfqHeaderTextContainer, rfqHeaderTextPlainContainer, activityStream];
			};

			service.getInvoiceOverviewContainerList = function () {
				var invoiceHeaderContainer = {
					Uuid: 'da419bc1b8ee4a2299cf1dde81cf1884',
					ParentUuid: null
				};

				var invoicePesContainer = {
					Uuid: 'AB72D4BED5BA408BBB77B429E8A462EF',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var invoiceOtherContainer = {
					Uuid: '4CF775EB68064CD5AD1F75E38AFFE41F',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var invoiceRejectionContainer = {
					Uuid: 'B5EA8B9CAE134B96A91FE364B4012121',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var invoiceContractContainer = {
					Uuid: '75F8704D0EEE480BA3DFD2528D99ADA1',
					ParentUuid: invoiceHeaderContainer.Uuid,
					Level: 1
				};

				var invoiceGeneralContainer = {
					Uuid: 'B6F91E1D615D4501A546E1E999FE6153',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var invoiceCommentContainer = {
					Uuid: '9752FD548EB240F98851C696E53CDE68',
					ParentUuid: invoiceHeaderContainer.Uuid,
					Level: 2
				};

				var invoiceHeader2HeaderContainer = {
					Uuid: '5F8DCFED83324BBEB9704576B94651FC',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var invoiceCertificateContainer = {
					Uuid: '11EC024D7DD3412BB53BEDA7741B6636',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var invoiceBillingSchemaContainer = {
					Uuid: '1EC2793FB7854C209EB128810298FA89',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var invoiceReconsilation2Container = {
					Uuid: '0E14D4C48DF94E85B816119C2F95F20B',
					ParentUuid: invoiceHeaderContainer.Uuid,
					Level: 2
				};

				var invoiceDocumentProjectContainer = {
					Uuid: '4EAA47C530984B87853C6F2E4E4FC67E',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var invoiceDocumentProjectRevisionContainer = {
					Uuid: '684F4CDC782B495E9E4BE8E4A303D693',
					ParentUuid: invoiceDocumentProjectContainer.Uuid
				};

				var invoiceDocumentProjectHistoryContainer = {
					Uuid: '39d0d1c6753b49029b3c953165f8ceb7',
					ParentUuid: invoiceDocumentProjectContainer.Uuid
				};

				var invoiceImportContainer = {
					Uuid: 'A453D1390DB54AD6A05D8518CCCD3A04',
					ParentUuid: invoiceHeaderContainer.Uuid,
					Level: 2
				};

				var invoiceWarningContainer = {
					Uuid: 'FC8E5673B0FC41FB972DEA9110C8F986',
					ParentUuid: invoiceHeaderContainer.Uuid,
					Level: 2
				};

				var invoiceCharacteristicContainer = {
					Uuid: '771d062f8d634ed6a33b897752fb7b16',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var invoicePaymentContainer = {
					Uuid: '94147A35CEBA4D4A87141E154C7EC326',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var invoiceEventContainer = {
					Uuid: '266FF910EAE74DF78496A1F0E0D08484',
					ParentUuid: invoiceHeaderContainer.Uuid,
					Level: 2
				};

				var invoiceValidationContainer = {
					Uuid: '842dd38c610d4501851750a6e14e2b19',
					ParentUuid: invoiceHeaderContainer.Uuid,
					Level: 2
				};

				var invoiceTransactionContainer = {
					Uuid: '40157baf6a2a4ab38bb434eb0af003c0',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				var userFormContainer = {
					Uuid: '2f475527c2854daeb00a286480b4fb77', // rubric id :28
					ParentUuid: invoiceHeaderContainer.Uuid,
					Level: 2
				};

				var invoiceActualCertificateContainer = {
					Uuid: '8AE614753E634735B87FCC3A8A033099',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				// generic structure

				var invoicePdfOverlayContainer = {
					Uuid: 'e47ce57cdbcf4ff9a84e1f0554abd07b',
					ParentUuid: invoiceHeaderContainer.Uuid,
					Level: 2
				};

				// model viewer containers

				var invoiceAccountAssignmentContainer = {
					Uuid: '94d42d2ad7474bd6b4ff95c437ece934',
					ParentUuid: invoiceHeaderContainer.Uuid
				};

				// structure group set controllingStructureGrpSetDTLListController
				// structure group set dtl controllingStructureGrpSetDTLListController
				// grpsetdltByTransaction
				// grpsetdltByRejection

				var invoicePostConHistoryContainer = {
					Uuid: '784f5f9b7b654c49b227bd468e3c16d5',
					ParentUuid: invoiceHeaderContainer.Uuid,
					Level: 2
				};

				return [invoiceHeaderContainer, invoicePesContainer, invoiceOtherContainer, invoiceRejectionContainer, invoiceContractContainer, invoiceGeneralContainer, userFormContainer,
					invoiceCommentContainer, invoiceHeader2HeaderContainer, invoiceCertificateContainer, invoiceBillingSchemaContainer, invoiceReconsilation2Container, invoiceDocumentProjectContainer,
					invoiceDocumentProjectRevisionContainer, invoiceDocumentProjectHistoryContainer, invoiceImportContainer, invoiceWarningContainer, invoiceCharacteristicContainer, invoicePaymentContainer,
					invoiceEventContainer, invoiceValidationContainer, invoiceTransactionContainer, invoiceActualCertificateContainer, invoicePdfOverlayContainer, invoiceAccountAssignmentContainer, invoicePostConHistoryContainer];
			};

			service.getPesOverviewContainerList = function () {
				var pesHeaderContainer = {
					Uuid: 'EBE726DBF2C5448F90B417BF2A30B4EB',
					ParentUuid: null
				};

				var pesItemContainer = {
					Uuid: 'EA88ECBB5ACA40DEA0DF3EF2182BBEB0',
					ParentUuid: pesHeaderContainer.Uuid
				};

				var pesBoqContainer = {
					Uuid: 'D12D2DA2967E4C4F808E757C5A3F91A5',
					ParentUuid: pesHeaderContainer.Uuid
				};

				var pesRemark = {
					Uuid: '325D0E1763B2417EBAA7647B30906FC8',
					ParentUuid: pesHeaderContainer.Uuid,
					Level: 2
				};

				var boqStructure = {
					Uuid: 'F52BE674B318460DA047748DF4F07BEC',
					ParentUuid: pesBoqContainer.Uuid
				};

				var pesBoqPriceCondition = {
					Uuid: '07812EAEE55C406CAD0F0E894B57A2B4',
					ParentUuid: boqStructure.Uuid
				};

				var documentProjectContainer = {
					Uuid: '4EAA47C530984B87853C6F2E4E4FC67E',
					ParentUuid: pesHeaderContainer.Uuid
				};

				var documentProjectRevisionContainer = {
					Uuid: '684F4CDC782B495E9E4BE8E4A303D693',
					ParentUuid: documentProjectContainer.Uuid
				};

				var documentProjectHistoryContainer = {
					Uuid: '39d0d1c6753b49029b3c953165f8ceb7',
					ParentUuid: documentProjectContainer.Uuid
				};

				var characteristic = {
					Uuid: '8e8faa3023ec4dc9854ca399401fd5ce',
					ParentUuid: pesHeaderContainer.Uuid
				};

				var boqSpecificationPlain = {
					Uuid: '9EFBA4D4F3AE4E34B6D9EB22C58731ED',
					ParentUuid: boqStructure.Uuid
				};

				var boqPlainTextComplement = {
					Uuid: 'f65f7b1d7ee5428d806e0f6447e5fe20',
					ParentUuid: boqStructure.Uuid
				};

				var crbPlainTextComplement = {
					Uuid: 'f274d5a3e05e49f1ac8142fbd4eeb0da',
					ParentUuid: boqStructure.Uuid
				};

				var boqDocument = {
					Uuid: '3576f31845824aafab2527aa4d77a159',
					ParentUuid: boqStructure.Uuid
				};

				var crbPriceCondition = {
					Uuid: '5aa38ab333a64fb8bc4f66e67fd8ae79',
					ParentUuid: boqStructure.Uuid
				};

				var boqSpecification = {
					Uuid: '7BE14CC03A834CF6BD700D185618D863',
					ParentUuid: boqStructure.Uuid
				};

				var boqHtmlTextComplement = {
					Uuid: '62c551aca6da42e38ea642ee7eec88f9',
					ParentUuid: boqStructure.Uuid
				};

				var boqSurcharge = {
					Uuid: 'dcbc940a91314f9e8377f7d34e117fd9',
					ParentUuid: boqStructure.Uuid
				};

				var pesEvent = {
					Uuid: '09D5678937F44572B382680019D9B535',
					ParentUuid: pesHeaderContainer.Uuid,
					Level: 2
				};

				var pesShipmentInfoContainer = {
					Uuid: '50235862FA2148B8A93AF36E77EE8BAC',
					ParentUuid: pesHeaderContainer.Uuid,
					Level: 2
				};

				var formData = {
					Uuid: '661feba708a946f485186e2b61a7338e',
					ParentUuid: pesHeaderContainer.Uuid,
					Level: 2
				};

				var pesAccrualContainer = {
					Uuid: '63921b6f7714486b95f044abe24a8765',
					ParentUuid: pesHeaderContainer.Uuid,
					Level: 2
				};

				var pesSelfBillingContainer = {
					Uuid: '94247a5009e24edcbb2e551096631424',
					ParentUuid: pesHeaderContainer.Uuid,
					Level: 2
				};

				var pesBillingSchemaContainer = {
					Uuid: '1874ebe007244248a77952dc2ebb3f4e',
					ParentUuid: pesHeaderContainer.Uuid
				};

				var materialPriceConditionContainer = {
					Uuid: 'fb2e7177d6c041d384f8b3009351840d',
					ParentUuid: pesItemContainer.Uuid,
					Level: 2
				};

				var deliveryScheduleContainer = {
					Uuid: '6FCB9C09FBF54D43A219CC277DB84695',
					ParentUuid: pesItemContainer.Uuid
				};

				var boqSplitQuantityContainer = {
					Uuid: '1eb8bd7842714c1dbb866716917ab0a0',
					ParentUuid: boqStructure.Uuid
				};

				var boqCopy = {
					Uuid: '3d83c3c3fa214e56ad341a2b9682da86',
					ParentUuid: boqStructure.Uuid
				};

				var progressReportContainer = {
					Uuid: 'e57d0f7c055c47b2aab36edd9da36455',
					ParentUuid: pesItemContainer.Uuid
				};

				var priceConditionParam = {
					Uuid: '5d7db60f107f416a9f99233d90a4ac81',
					ParentUuid: pesHeaderContainer.Uuid,
					Level: 2
				};

				var prcPostConHistoryContainer = {
					Uuid: 'f5838db1fd734cc1ae1de822424a4136',
					ParentUuid: documentProjectContainer.Uuid
				};

				var controllingStructureGroupSet = {
					Uuid: '27FA05A2AE2F437D94E10B657C64FA92',
					ParentUuid: pesItemContainer.Uuid
				};

				var pesComment = {
					Uuid: '245c6a1bd5234eab9b38cd25a4f76a55',
					ParentUuid: pesHeaderContainer.Uuid,
					Level: 2
				};

				return [pesHeaderContainer, pesItemContainer, pesBoqContainer, pesRemark, boqStructure, pesBoqPriceCondition,
					documentProjectContainer, documentProjectRevisionContainer, documentProjectHistoryContainer, characteristic,
					boqSpecificationPlain, boqPlainTextComplement, crbPlainTextComplement, boqDocument, crbPriceCondition,
					boqSpecification, boqHtmlTextComplement, boqSurcharge, pesEvent, formData, pesAccrualContainer, pesShipmentInfoContainer,
					pesSelfBillingContainer, pesBillingSchemaContainer, materialPriceConditionContainer, deliveryScheduleContainer,
					boqSplitQuantityContainer, boqCopy, progressReportContainer, priceConditionParam, prcPostConHistoryContainer,
					controllingStructureGroupSet, pesComment];
			};

			service.getInventoryOverviewContainerList = function () {
				return [];
			};

			service.getCheckListOverviewContainerList = function () {
				var checkListContainer = {
					Uuid: 'aeb09732a35a4e91a0e6d7a9d161092b',
					ParentUuid: null
				};
				var activityContainer = {
					Uuid: '89b8c86e8d53480ebc2551a33f010e94',
					ParentUuid: checkListContainer.Uuid
				};
				var formDataContainer = {
					Uuid: '2334381acd314b488be8c8828d7595b2',
					ParentUuid: checkListContainer.Uuid
				};
				var lacationContainer = {
					Uuid: '32330c1c8a1e493abf8b5182daa4d11f',
					ParentUuid: checkListContainer.Uuid
				};
				var mdlObjectContainer = {
					Uuid: '26110cbc14374f7895d1d7934efd0a63',
					ParentUuid: checkListContainer.Uuid
				};
				var commentContainer = {
					Uuid: '0436cff1e56443b3b0d73dbe4888152f',
					ParentUuid: checkListContainer.Uuid
				};
				var documentContainer = {
					Uuid: 'b87bb8f86135487d8fb332dedf43d183',
					ParentUuid: checkListContainer.Uuid
				};
				return [checkListContainer, activityContainer, formDataContainer, lacationContainer, mdlObjectContainer, commentContainer, documentContainer];
			};
			service.getCheckListTemplateOverviewContainerList = function () {
				var checkListTemplateContainer = {
					Uuid: '38c695e4561b426da29491a95c08f4b6',
					ParentUuid: null
				};
				var templateFormContainer = {
					Uuid: 'cc6d6d1dc805468491510463099d8809',
					ParentUuid: checkListTemplateContainer.Uuid
				};

				var containerList = service.getCheckListOverviewContainerList();
				_.forEach(containerList, function (item) {
					if (item.Uuid === 'aeb09732a35a4e91a0e6d7a9d161092b') {
						item.ParentUuid = checkListTemplateContainer.Uuid;
					} else {
						item.Level = 2;
					}
				});
				containerList.unshift(checkListTemplateContainer, templateFormContainer);
				return containerList;
			};
			service.getDefectOverviewContainerList = function () {
				var defectContainer = {
					Uuid: '01a52cc968494eacace7669fb996bc72',
					ParentUuid: null
				};
				var documentContainer = {
					Uuid: 'cf8fbeb95cf24fcf98730a4817241201',
					ParentUuid: defectContainer.Uuid
				};
				var commentContainer = {
					Uuid: 'E3C36EAC59C64402AF2FB2A7762BDD7B',
					ParentUuid: defectContainer.Uuid
				};
				var photoContainer = {
					Uuid: 'C81D6B2B37D44EA1A328A9CA245B6A1C',
					ParentUuid: defectContainer.Uuid
				};
				var annotationContainer = {
					Uuid: '26110cbc14374f7895d1d7934efd0a63',
					ParentUuid: defectContainer.Uuid
				};
				var questionContainer = {
					Uuid: 'b3270c0dfde64bd28fcc46692b0af582',
					ParentUuid: defectContainer.Uuid
				};
				var clerkContainer = {
					Uuid: '913B56330DAD4388BBAB12C54A5095BE',
					ParentUuid: defectContainer.Uuid
				};
				var formDataContainer = {
					Uuid: 'dae0941f05bd41f0a4cd2f0e6f280380',
					ParentUuid: defectContainer.Uuid
				};
				return [defectContainer, documentContainer, commentContainer, photoContainer, annotationContainer, questionContainer, clerkContainer, formDataContainer];
			};

			service.getPrcStructureOverviewContainerList = function () {
				let procurementStructureContainer = {
					Uuid: 'A59C90CF86D14ABE98DF9CB8601B22A0',
					ParentUuid: null
				};
				let constructionSystemProjectInstanceHeaderContainer = {
					Uuid: 'ACC544C6504A4A678DBE74D8F390EEA8',
					ParentUuid: procurementStructureContainer.Uuid,
				};
				let defectContainer = {
					Uuid: '01a52cc968494eacace7669fb996bc72',
					ParentUuid: procurementStructureContainer.Uuid
				};
				let salesBidContainer = {
					Uuid: '7001204d7fb04cf48d8771c8971cc1e5',
					ParentUuid: procurementStructureContainer.Uuid
				};
				let salesBillsContainer = {
					Uuid: '39608924dc884afea59fe04cb1434543',
					ParentUuid: procurementStructureContainer.Uuid
				};
				let salesWipsContainer = {
					Uuid: '689e0886de554af89aadd7e7c3b46f25',
					ParentUuid: procurementStructureContainer.Uuid
				};
				let salesContractContainer = {
					Uuid: '34d0a7ece4f34f2091f7ba6c622ff04d',
					ParentUuid: procurementStructureContainer.Uuid
				};
				let checkListContainer = {
					Uuid: 'aeb09732a35a4e91a0e6d7a9d161092b',
					ParentUuid: procurementStructureContainer.Uuid
				};
				let packageContainer = {
					Uuid:'1D58A4DA633A485981776456695E3241'	,
					ParentUuid: procurementStructureContainer.Uuid
				};
				let invoiceHeaderContainer = {
					Uuid: 'da419bc1b8ee4a2299cf1dde81cf1884',
					ParentUuid: procurementStructureContainer.Uuid
				};
				let pesHeaderContainer = {
					Uuid: 'EBE726DBF2C5448F90B417BF2A30B4EB',
					ParentUuid: procurementStructureContainer.Uuid
				};
				let costCodesContainer = {
					Uuid: 'CEEB3A8D7F3E41ABA9AA126C7A802F87',
					ParentUuid: procurementStructureContainer.Uuid
				};
				let documentProjectContainer = {
					Uuid: '4EAA47C530984B87853C6F2E4E4FC67E',
					ParentUuid: procurementStructureContainer.Uuid
				};
				let resourceTypeContainer = {
					Uuid: 'b881141e03c14ddfb1aa965c0cb9ea2c',
					ParentUuid: procurementStructureContainer.Uuid
				};

				return [
					procurementStructureContainer,
					constructionSystemProjectInstanceHeaderContainer,
					defectContainer,
					salesBidContainer,
					salesBillsContainer,
					salesWipsContainer,
					salesContractContainer,
					checkListContainer,
					packageContainer,
					invoiceHeaderContainer,
					pesHeaderContainer,
					costCodesContainer,
					documentProjectContainer,
					resourceTypeContainer
					];
			};

			function processUuid(itemUuid,containerJsons=null) {
				var result = {
					Description: itemUuid,
					UUIDTranslated: false
				};
				var name = getServiceName();
				var containerJson = dataServiceContainerJsonRepository[name];
				if($.isEmptyObject(dataServiceContainerJsonRepository)){
					containerJson = containerJsons;
				}
				if (containerJson) {
					if (detailServiceContainerJsonRepository !== null) {
						containerJson = containerJson.concat(detailServiceContainerJsonRepository);
					}
					var containerContent = _.filter(containerJson, {uuid: itemUuid});
					if (_.isArray(containerContent) && containerContent[0]) {
						result.Description = $translate.instant(containerContent[0].title) || containerContent[0].title;
					} else {
						result.Description = containerContent.title;
					}
					result.UUIDTranslated = true;
				} else {
					service.initContainerJson().then(function () {
						processUuid(itemUuid);
					});
				}
				return result;
			}

			service.processDataMakeTree = function processDataMakeTree(items,containerJson = null) {
				if (!items || !_.isArray(items)) {
					return;
				}
				_.forEach(items, function (item) {
					var uuidProcessResult = processUuid(item.Uuid,containerJson);
					item.Id = item.Uuid;
					item.Description = uuidProcessResult.Description;
					item.ParentFk = item.ParentUuid;
					item.Children = _.filter(items, {ParentUuid: item.Uuid});
					item.image = item.image || 'ico-accordion-grp'; // ico-accordion-root  ico-accordion-pos
					item.Sorting = item.Sorting || 1;
					item.UUIDTranslated = uuidProcessResult.UUIDTranslated;
				});
				return [items[0]];
			};

			service.processContainerData = function processContainerData(items) {
				var containerList = service.getOverviewContainerList();
				_.forEach(containerList, function (container) {
					var item = _.filter(items, {Uuid: container.Uuid});
					if (item && item[0]) {
						container.Count = item[0].Count || 0;
					}
				});
				return containerList;
			};

			service.processUuid = processUuid;

			function getServiceName() {
				var mainService = procurementContextService.getMainService();
				var leadingService = procurementContextService.getLeadingService();
				var serviceName = mainService.getItemName();
				if (leadingService) {
					serviceName = mainService.getItemName() + leadingService.getItemName();
				}
				return serviceName;
			}

			service.initContainerJson = function () {
				var name = getServiceName();
				var json = dataServiceContainerJsonRepository[name];
				if (json) {
					var defered = $q.defer();
					defered.resolve(json);
					return defered.promise;
				}
				appendDetailContainerJsonRepository();
				return service.getContainerJSON().then(function (result) {
					var data = result;
					if (result.data) {
						data = result.data;
					}
					if (data) {
						dataServiceContainerJsonRepository[name] = data;
						return data;
					}
				});
			};

			function appendDetailContainerJsonRepository() {
				var serviceName = getServiceName();
				if (serviceName === 'ChkListTemplatesChkListTemplates') {
					$http.get(globals.appBaseUrl + checkListKey + '/content/json/module-containers.json').then(function (result) {
						if (result.data) {
							detailServiceContainerJsonRepository = result.data;
						}
					});
				}
				if(procurementContextService.getModuleName()==='basics.procurementstructure'){
					detailServiceContainerJsonRepository = structureContainerJson();
				}
			}

			function structureContainerJson() {
				return [
					{
						uuid: 'A59C90CF86D14ABE98DF9CB8601B22A0',
						title: 'basics.procurementstructure.gridContainerTitle'
					},
					{
						title: 'basics.procurementstructure.constructionSystemMasterHeaderTitle',
						controller: 'constructionSystemMasterHeaderController',
						uuid: 'ACC544C6504A4A678DBE74D8F390EEA8',
					},
					{
						uuid: '01a52cc968494eacace7669fb996bc72',
						title: 'defect.main.defectGridTitle'
					},
					{
						uuid: '7001204d7fb04cf48d8771c8971cc1e5',
						title: 'basics.procurementstructure.containerTitleBids'
					},
					{
						uuid: '39608924dc884afea59fe04cb1434543',
						title: 'basics.procurementstructure.containerTitleBills'
					},
					{
						uuid: '689e0886de554af89aadd7e7c3b46f25',
						title: 'basics.procurementstructure.containerTitleWips'
					},
					{
						uuid: '34d0a7ece4f34f2091f7ba6c622ff04d',
						title: 'basics.procurementstructure.containerTitleContracts'
					},
					{
						uuid: 'aeb09732a35a4e91a0e6d7a9d161092b',
						title:'basics.procurementstructure.checklistHeader'
					},
					{
						uuid:'1D58A4DA633A485981776456695E3241'	,
						title:'procurement.package.pacHeaderGridTitle'
					},
					{
						uuid: 'da419bc1b8ee4a2299cf1dde81cf1884',
						title: 'procurement.invoice.title.header'
					},
					{
						uuid: 'EBE726DBF2C5448F90B417BF2A30B4EB',
						title: 'basics.procurementstructure.pesContainerTitle'
					},
					{
						uuid: 'CEEB3A8D7F3E41ABA9AA126C7A802F87',
						title: 'basics.procurementstructure.costCodesTitle'
					},
					{
						uuid: '4EAA47C530984B87853C6F2E4E4FC67E',
						title: 'basics.procurementstructure.documentProjectTitle'
					},
					{
						uuid: 'b881141e03c14ddfb1aa965c0cb9ea2c',
						title: 'basics.procurementstructure.resTypeTitle'
					}
				];
			}

			return service;
		}]);
})(angular);