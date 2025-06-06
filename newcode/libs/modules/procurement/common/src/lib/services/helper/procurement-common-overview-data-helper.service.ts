/*
 * Copyright(c) RIB Software GmbH
 */

export class ProcurementCommonOverviewDataHelperService {
	public getContractOverviewContainerList() {
		const contractUuid = 'e5b91a61dbdd4276b3d92ddc84470162';
		return [
			{
				id: 1,
				Uuid: contractUuid,
				ParentUuid: '',
				Container: 'contractContainer',
				Level: 0,
				Title: 'procurement.contract.contractGridTitle',
			},
			{
				id: 2,
				Uuid: 'def60cc8fa044fe08ff72b773af9d7ef',
				ParentUuid: contractUuid,
				Container: 'prcItemContainer',
				Title: 'procurement.common.item.prcItemContainerGridTitle',
				Level: 1,
			},
			{
				id: 3,
				Uuid: '5055ba9ce9c14f78b445a97d74bc8b90',
				ParentUuid: contractUuid,
				Container: 'prcCertificateContainer',
				Title: 'procurement.common.certificate.certificatesContainerGridTitle',
				Level: 1,
			},
			{
				id: 4,
				Uuid: 'e146e86368bf41ff9682b989a9df3291',
				ParentUuid: contractUuid,
				Container: 'prcMileStoneContainer',
				Title: 'procurement.common.milestone.milestoneContainerGridTitle',
				Level: 1,
			},
			{
				id: 5,
				Uuid: '2a7e35d3fddc41a0abb141dc2d868ebd',
				ParentUuid: contractUuid,
				Container: 'prcSubContractorContainer',
				Title: 'procurement.common.subcontractor.subcontractorContainerGridTitle',
				Level: 1,
			},
			{
				id: 6,
				Uuid: 'ec2420d04c8d458490c29edbd9b9cafc',
				ParentUuid: contractUuid,
				Container: 'prcDocumentContainer',
				Title: 'procurement.common.document.prcDocumentContainerGridTitle',
				Level: 1,
			},
			{
				id: 7,
				Uuid: '54dc0ae6c79e44548ad5c84edd339db4',
				ParentUuid: contractUuid,
				Container: 'prcGeneralContainer',
				Title: 'procurement.common.general.generalsContainerGridTitle',
				Level: 1,
			},
			{
				id: 8,
				Uuid: 'a56a75cbe90545ecbfafa5de3f437f10',
				Container: 'prcBoqContainer',
				ParentUuid: contractUuid,
				Title: 'boq.main.procurementBoqList',
				Level: 1,
			},
			{
				id: 9,
				Uuid: 'd2b5525ef2ee49e4b820de6004dfb8c4',
				Container: 'characteristic',
				ParentUuid: contractUuid,
				Title: 'cloud.common.ContainerCharacteristicDefaultTitle',
				Level: 1,
			},
			{
				id: 10,
				Uuid: '4eaa47c530984b87853c6f2e4e4fc67e',
				Container: 'documentProject',
				ParentUuid: contractUuid,
				Title: 'cloud.common.documentsProject',
				Level: 1,
			},
			{
				id: 11,
				Uuid: 'af859543498e499fb082581ff7da6201',
				Container: 'prcHeaderTextContainer',
				ParentUuid: contractUuid,
				Title: 'procurement.common.headerText.prcHeaderTextContainerTitle',
				Level: 1,
			},
			{
				id: 12,
				Uuid: '9f5d33b39555424ba877447f2bfd1269',
				Container: 'billingSchemaContainer',
				ParentUuid: contractUuid,
				Title: 'basics.commonbillingschema.billingSchemaGridTitle',
				Level: 1,
			},
			{
				id: 13,
				Uuid: '06e6c5040b5640ebbd18b99d77717014',
				Container: 'advanceContainer',
				ParentUuid: contractUuid,
				Title: 'procurement.contract.advanceGridTitle',
				Level: 1,
			},
			{
				id: 14,
				Uuid: '96ad9514b39e48a697354249640402cd',
				Container: 'warrantyContainer',
				ParentUuid: contractUuid,
				Title: 'procurement.common.warranty.warrantyContainerGridTitle',
				Level: 1,
			},
		];
	}

	public getPackageOverviewContainerList() {
		return [
			{ id: 1, Title: 'procurement.package.pacHeaderGridTitle', Uuid: '1D58A4DA633A485981776456695E3241', ParentUuid: '', Level: 0 },
			{ id: 2, Title: 'cloud.common.event.eventGridTitle', Uuid: '07946CB829634366B34547B3C5987B23', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
			{ id: 3, Title: 'procurement.package.pacakge2header.Grid', Uuid: 'FC591E48F5E740AD84068D97747A31AD', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
			{ id: 4, Title: 'procurement.common.document.prcDocumentContainerGridTitle', Uuid: '3899AD6A9FCE4B75981A350D4F5C1F6B', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
			{ id: 5, Title: 'procurement.common.item.prcItemContainerGridTitle', Uuid: 'FB938008027F45A5804B58354026EF1C', ParentUuid: 'FC591E48F5E740AD84068D97747A31AD', Level: 1 },
			{ id: 6, Title: 'procurement.package.itemAssignment.itemAssignmentGrid', Uuid: '49892c71ffee4da096cecfd6834a29b9', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
			{ id: 7, Title: 'boq.main.procurementBoqList', Uuid: 'D25A80A90961449EB38A0B54A34B6BBF', ParentUuid: 'FC591E48F5E740AD84068D97747A31AD', Level: 1 },
			{ id: 8, Title: 'procurement.common.paymentSchedule.paymentScheduleContainerGridTitle', Uuid: '3F5E1709104C407EA503562029609DFD', ParentUuid: 'FC591E48F5E740AD84068D97747A31AD', Level: 1 },
			{ id: 9, Title: 'procurement.common.suggestedBidder.suggestedBidderContainerGridTitle', Uuid: 'd581746fd5c34c28bc0d62eb0e724837', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
			{ id: 10, Title: 'basics.common.cashFlowForecastGridTitle', Uuid: 'ED80D937DC834BA18F916505C7E6CD6D', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
			{ id: 11, Title: 'procurement.common.general.generalsContainerGridTitle', Uuid: '49DEF9119F124A4B98AB3FF47D9130F3', ParentUuid: 'FC591E48F5E740AD84068D97747A31AD', Level: 1 },
			{ id: 12, Title: 'procurement.common.milestone.milestoneContainerGridTitle', Uuid: 'D58E6439ACB14016B269896987C1DFF1', ParentUuid: 'FC591E48F5E740AD84068D97747A31AD', Level: 1 },
			{ id: 13, Title: 'procurement.common.certificate.certificatesContainerGridTitle', Uuid: '6B32AE890E4A4317BF1C422E9A492F30', ParentUuid: 'FC591E48F5E740AD84068D97747A31AD', Level: 1 },
			{ id: 14, Title: 'procurement.common.warranty.warrantyContainerGridTitle', Uuid: 'a2525a0d73a546fa9990b56cccc0ebb5', ParentUuid: 'FC591E48F5E740AD84068D97747A31AD', Level: 1 },
			{ id: 15, Title: 'procurement.common.subcontractor.subcontractorContainerGridTitle', Uuid: 'bc860c5260774379a8509355f4048f31', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
			{ id: 16, Title: 'procurement.package.estimateHeaderGridControllerTitle', Uuid: '2682301EE1AD4B4AB523DF2361A9FB3F', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
			{ id: 17, Title: 'procurement.package.estimateLineItemGridContainerTitle', Uuid: '067BE143D76D4AD080660EF147349F1D', ParentUuid: '2682301EE1AD4B4AB523DF2361A9FB3F', Level: 1 },
			{ id: 18, Title: 'procurement.package.estimateResourceGridContainerTitle', Uuid: '691DF3BC90574BE182ED007600A15D44', ParentUuid: '2682301EE1AD4B4AB523DF2361A9FB3F', Level: 1 },
			{ id: 19, Title: 'cloud.common.documentsProject', Uuid: '4EAA47C530984B87853C6F2E4E4FC67E', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
			{ id: 20, Title: 'cloud.common.ContainerCharacteristicDefaultTitle', Uuid: '5a8146afeee2404780c8a65e537f6f30', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
			{ id: 21, Title: 'procurement.common.headerText.prcHeaderTextContainerTitle', Uuid: '864613B03ABF4F7BBF7D35FEC6E7DF0D', ParentUuid: '1D58A4DA633A485981776456695E3241', Level: 1 },
		];
	}

	public getRequisitionOverviewContainerList() {
		const requisitionUuid = '509f8b1f81ea475fbebf168935641489';
		return [
			{
				id: 1,
				Uuid: requisitionUuid,
				ParentUuid: '',
				Container: 'requisitionContainer',
				Level: 0,
				Title: 'procurement.requisition.headerGrid.reqheaderGridTitle',
			},
			{
				id: 2,
				Uuid: '5d58a4a9633a485986776456695e1241',
				ParentUuid: requisitionUuid,
				Container: 'itemsContainer',
				Level: 1,
				Title: 'procurement.common.item.prcItemContainerGridTitle',
			},
			{
				id: 3,
				Uuid: '4006012996104d98a9a6bc11d4b0bea4',
				ParentUuid: requisitionUuid,
				Container: 'documentContainer',
				Level: 1,
				Title: 'procurement.common.document.prcDocumentContainerGridTitle',
			},
			{
				id: 4,
				Uuid: '7c83fc5cea7a4c8396d47877ae72b4b4',
				ParentUuid: requisitionUuid,
				Container: 'milestoneContainer',
				Level: 1,
				Title: 'procurement.common.milestone.milestoneContainerGridTitle',
			},
			{
				id: 5,
				Uuid: 'b5431f508a644c73ae29cc90b8e6073b',
				ParentUuid: requisitionUuid,
				Container: 'subcontractorContainer',
				Level: 1,
				Title: 'procurement.common.subcontractor.subcontractorContainerGridTitle',
			},
			{
				id: 6,
				Uuid: 'd3873514781444dc9f62255ca041e394',
				ParentUuid: requisitionUuid,
				Container: 'generalContainer',
				Level: 1,
				Title: 'procurement.common.general.generalsContainerGridTitle',
			},
			{
				id: 7,
				Uuid: 'd3873514781444dc9f62255ca041e394',
				ParentUuid: requisitionUuid,
				Container: 'generalContainer',
				Level: 1,
				Title: 'procurement.common.general.generalsContainerGridTitle',
			},
			{
				id: 8,
				Uuid: '58f71f3079c9450d9723fc7194e433c2',
				ParentUuid: requisitionUuid,
				Container: 'boqsContainer',
				Level: 1,
				Title: 'boq.main.boqStructure',
			},
			{
				id: 9,
				Uuid: '4eaa47c530984b87853c6f2e4e4fc67e',
				ParentUuid: requisitionUuid,
				Container: 'documentContainer',
				Level: 1,
				Title: 'cloud.common.documentsProject',
			},
			{
				id: 10,
				Uuid: 'df5c94984af84ff49c7310eac5e25fff',
				ParentUuid: requisitionUuid,
				Container: 'suggestedBidderContainer',
				Level: 1,
				Title: 'procurement.common.suggestedBidder.suggestedBidderContainerGridTitle',
			},
			{
				id: 11,
				Uuid: 'ae65ccbf11c64125ad436d6b16ed22a2',
				ParentUuid: requisitionUuid,
				Container: 'warrantyContainer',
				Level: 1,
				Title: 'procurement.common.warranty.warrantyContainerGridTitle',
			},
			{
				id: 12,
				Uuid: 'b3f1b7a59f40437f878f680a1bd4f8e7',
				ParentUuid: requisitionUuid,
				Container: 'characteristicContainer',
				Level: 1,
				Title: 'cloud.common.ContainerCharacteristicDefaultTitle',
			},
			{
				id: 13,
				Uuid: 'c8611fe10fbd4999868bce45ef09a057',
				ParentUuid: requisitionUuid,
				Container: 'headerTextContainer',
				Level: 1,
				Title: 'procurement.common.headerText.prcHeaderTextContainerTitle',
			},
		];
	}

	public getQuoteOverviewContainerList() {
		const quoteUuid = '338048ac80f748b3817ed1faea7c8aa5';
		return [
			{
				id: 1,
				Uuid: quoteUuid,
				ParentUuid: '',
				Container: 'quoteContainer',
				Level: 0,
				Title: 'procurement.quote.quoteContainerGridTitle',
			},
			{
				id: 2,
				Uuid: '274da208b3da47988366d48f38707de1',
				ParentUuid: quoteUuid,
				Container: 'prcItemContainer',
				Title: 'procurement.common.item.prcItemContainerGridTitle',
				Level: 1,
			},
			{
				id: 3,
				Uuid: '2c28d44a8d1442d1a7f44ace864eccc9',
				ParentUuid: quoteUuid,
				Container: 'certificatesContainer',
				Title: 'procurement.common.certificate.certificatesContainerGridTitle',
				Level: 1,
			},
			{
				id: 4,
				Uuid: 'a21042925bf44ae59fa2d849bbec3818',
				ParentUuid: quoteUuid,
				Container: 'milestoneContainer',
				Title: 'procurement.common.milestone.milestoneContainerGridTitle',
				Level: 1,
			},
			{
				id: 5,
				Uuid: 'e2a1cccda07d48e68f2b0fc4208e61ee',
				ParentUuid: quoteUuid,
				Container: 'generalContainer',
				Title: 'procurement.common.general.generalsContainerGridTitle',
				Level: 1,
			},
			{
				id: 6,
				Uuid: '26e2ed9b49a14fb3bc4dc989177bc937',
				ParentUuid: quoteUuid,
				Container: 'quotePrcDocumentContainer',
				Title: 'procurement.common.document.prcDocumentContainerGridTitle',
				Level: 1,
			},
			{
				id: 7,
				Uuid: '38526f78c929405d8d73e237331ef8ae',
				ParentUuid: quoteUuid,
				Container: 'prcHeaderTextContainer',
				Title: 'procurement.common.headerText.prcHeaderTextContainerTitle',
				Level: 1,
			},
			{
				id: 8,
				Uuid: '3aa545f7aa6b40498908ebf41abb78d8',
				ParentUuid: quoteUuid,
				Container: 'prcBoqContainer',
				Title: 'boq.main.procurementBoqList',
				Level: 1,
			},
			{
				id: 9,
				Uuid: '7214523301dc419081942479f0f30cfc',
				ParentUuid: quoteUuid,
				Container: 'characteristic',
				Title: 'cloud.common.ContainerCharacteristicDefaultTitle',
				Level: 1,
			},
			{
				id: 10,
				Uuid: '4eaa47c530984b87853c6f2e4e4fc67e',
				ParentUuid: quoteUuid,
				Container: 'documentProject',
				Title: 'cloud.common.documentsProject',
				Level: 1,
			},
			{
				id: 11,
				Uuid: '5627df6ded4242e48ae56e5163320a53',
				ParentUuid: quoteUuid,
				Container: 'billingSchema',
				Title: 'procurement.quote.billingSchemaContainer',
				Level: 1,
			},
			{
				id: 12,
				Uuid: '367c0031930d45d9a84cd866326702bc',
				ParentUuid: quoteUuid,
				Container: 'bpEvaluation',
				Title: 'basics.common.evaluation.quoteEvaluation',
				Level: 1,
			}
		];
	}
}
