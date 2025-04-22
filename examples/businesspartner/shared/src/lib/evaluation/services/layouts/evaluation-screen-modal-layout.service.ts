/*
 * Copyright(c) RIB Software GmbH
*/

import {inject, Injectable} from '@angular/core';
import {createLookup, FieldType, ILookupContext, ILookupEvent, LookupSimpleEntity} from '@libs/ui/common';
import {BasicsSharedClerkLookupService, BasicsSharedEvaluationStatusLookupService} from '@libs/basics/shared';
import {
	BusinesspartnerSharedEvaluationSchemaMotiveLookupService
} from '../../../lookup-services/businesspartner-evaluation-schema-motive-lookup.service';
import {BusinesspartnerSharedSubsidiaryLookupService} from '../../../lookup-services/subsidiary-lookup.service';

import {
	BusinesspartnerSharedContactLookupService
} from '../../../lookup-services/businesspartner-contact-lookup.service';
import {
	BusinesspartnerSharedEvaluationSchemaLookupService
} from '../../../lookup-services/businesspartner-evaluation-schema-lookup.service';
import {
	IQuoteHeaderLookUpEntity,
	ProcurementShareContractLookupService,
	ProcurementShareInvoiceLookupService,
	ProcurementShareQuoteLookupService
} from '@libs/procurement/shared';
import {BusinessPartnerLookupService} from '../../../lookup-services/businesspartner-lookup.service';
import {EvaluationDetailService} from '../evaluation-detail.service';
import {EvaluationCommonService} from '../evaluation-common.service';
import {Contact1ForEvaluationFilterService} from '../filter/contact1-for-evaluation-filter.service';
import {Contact2ForEvaluationFilterService} from '../filter/contact2-for-evaluation-filter.service';
import { ProjectSharedProjectLookupProviderService } from '@libs/project/shared';
import { EvaluationSchemaChangedType, IEvaluationEntity, IEvaluationGroupCreateParam, ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EvaluationScreenModalLayoutService {
	private readonly cloudCommonModule = 'cloud.common';
	private readonly basicsCustomizeModule = 'basics.customize';
	private readonly businesspartnerMainModuleName = 'businesspartner.main';

	private readonly evaluationDetailService = inject(EvaluationDetailService);
	private readonly commService = inject(EvaluationCommonService);
	private readonly projectLookupProvider = inject(ProjectSharedProjectLookupProviderService);

	public constructor() {
	}

	public getFormGroup() {
		return [
			{
				groupId: 'basicData',
				header: {
					key: 'procurement.package.entityGroup',
					text: 'Basic Data',
				},
				open: true,
			},
			{
				groupId: 'businessPartnerData',
				header: {
					key: this.cloudCommonModule + '.entityBusinessPartner',
					text: 'Business Partner',
				},
				open: true,
			},
			{
				groupId: 'responsibleData',
				header: {
					key: this.cloudCommonModule + '.entityResponsible',
					text: 'Responsible',
				},
				open: true,
			},
			{
				groupId: 'references',
				header: {
					key: this.businesspartnerMainModuleName + '.screenEvaluatoinReferencesGroupTitle',
					text: 'References',
				},
				open: true,
			},
			{
				groupId: 'userDefined',
				header: {
					key: this.businesspartnerMainModuleName + '.groupUserDefined',
					text: 'User Defined Fields',
				},
				open: true,
			},
			{
				groupId: 'entityHistory',
				header: {
					key: this.cloudCommonModule + '.entityHistory',
					text: 'History',
				},
				open: true,
			},
			{
				groupId: 'evaluationSchema',
				header: {
					key: this.businesspartnerMainModuleName + '.screenEvaluatoinGroupDataContainerTitle',
					text: 'Evaluation Schema',
				},
				open: true,
			},
			{
				groupId: 'evaluationItems',
				header: {
					key: this.businesspartnerMainModuleName + '.screenEvaluatoinItemDataContainerTitle',
					text: 'Evaluation Items',
				},
				open: true,
			},
			{
				groupId: 'evaluationDocument',
				header: {
					key: this.businesspartnerMainModuleName + '.screenEvaluatoinDocumentDataContainerTitle',
					text: 'Evaluation Document',
				},
				open: true,
			},
		];
	}

	public getFormRows() {
		return [
			...this.getBasicDataGroup(),

			...this.getBPGroup(),

			...this.getResponsibleGroup(),

			...this.getReferenceGroup(),

			...this.getUserDefinedGroup(),

			...this.getHistoryGroup(),
		];
	}

	private getBasicDataGroup() {
		return [
			//Basic Data Group
			{
				groupId: 'basicData',
				id: 'evalStatusFk',
				label: {
					key: this.basicsCustomizeModule + '.evaluationstatus',
					text: 'Evaluation Status',
				},
				model: 'EvalStatusFk',
				type: FieldType.Lookup,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedEvaluationStatusLookupService,
					displayMember: 'DescriptionInfo.Translated',
					// serverSideFilter:
				}),
			},
			{
				groupId: 'basicData',
				id: 'evaluationschemafk',
				label: {
					key: this.businesspartnerMainModuleName + '.entityEvaluationSchemaFk',
					text: 'Evaluation Schema',
				},
				readonly: false,
				model: 'EvaluationSchemaFk',
				type: FieldType.Lookup,
				required: true,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedEvaluationSchemaLookupService,
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e: ILookupEvent<LookupSimpleEntity, IEvaluationEntity>) => {
								const evaluationEntity = this.evaluationDetailService.currentSelectItem;

								if (this.evaluationDetailService.createOptions) {
									const evaluationSchemaEntity = e.context.entity! ;
									const param: IEvaluationGroupCreateParam = {
										EvaluationId: evaluationEntity!.Id,
										EvaluationSchemaId: evaluationSchemaEntity.EvaluationSchemaFk,
										MainItemId: evaluationEntity!.Id,
										changedType: EvaluationSchemaChangedType.create
									};
									this.commService.onEvaluationSchemaChanged.emit(param);
									// this.commService.evaluationSchemaChanged.emit(param);
								}else if (this.evaluationDetailService.updateOptions) {
									this.commService.onEvaluationSchemaChanged.emit({
										changedType: EvaluationSchemaChangedType.view,
										MainItemId: evaluationEntity!.Id
									});

									// this.commService.evaluationSchemaChanged.emit({
									// 	changedType: EvaluationSchemaChangedType.view,
									// 	MainItemId: evaluationEntity!.Id
									// });
								}
							}
						}
					]
				}),
			},
			{
				groupId: 'basicData',
				id: 'evaluationdate',
				label: {
					key: this.businesspartnerMainModuleName + '.entityEvaluationDate',
					text: 'Evaluation Date',
				},
				model: 'EvaluationDate',
				type: FieldType.Date,
				readonly: false,
				required: true
			},
			{
				groupId: 'basicData',
				id: 'evaluationmotivefk',
				label: {
					key: this.businesspartnerMainModuleName + '.entityEvaluationMotiveFk',
					text: 'Evaluation Motive',
				},
				readonly: false,
				model: 'EvaluationMotiveFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedEvaluationSchemaMotiveLookupService,
				}),
				required: true
			},
			{
				groupId: 'basicData',
				id: 'code',
				label: {
					key: this.cloudCommonModule + '.entityCode',
					text: 'Code',
				},
				readonly: false,
				model: 'Code',
				type: FieldType.Code,
				required: true
			},
			{
				groupId: 'basicData',
				id: 'description',
				label: {
					key: this.cloudCommonModule + '.entityDescription',
					text: 'Description',
				},
				readonly: false,
				model: 'Description',
				type: FieldType.Translation,
			},
			{
				//TODO hzh with icon
				groupId: 'basicData',
				id: 'points',
				label: {
					key: this.businesspartnerMainModuleName + '.entityPoints',
					text: 'Result',
				},
				readonly: false,
				model: 'Points',
				type: FieldType.Percent,
			},
			{
				groupId: 'basicData',
				id: 'validfrom',
				label: {
					key: this.businesspartnerMainModuleName + '.entityValidFrom',
					text: 'Valid From',
				},
				model: 'ValidFrom',
				type: FieldType.Date,
				readonly: false,
			},
			{
				groupId: 'basicData',
				id: 'validto',
				label: {
					key: this.businesspartnerMainModuleName + '.entityValidTo',
					text: 'Valid To',
				},
				model: 'ValidTo',
				type: FieldType.Date,
				readonly: false,
			},
		];
	}

	private getBPGroup() {
		return [
			//Business Partner Group
			{
				groupId: 'businessPartnerData',
				id: 'businesspartnerfk',
				label: {
					key: this.cloudCommonModule + '.entityBusinessPartner',
					text: 'Business Partner',
				},
				model: 'BusinessPartnerFk',
				type: FieldType.Lookup,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService,
					displayMember: 'BusinessPartnerName1',
				}),
				required: true
			},
			{
				groupId: 'businessPartnerData',
				id: 'subsidiaryfk',
				label: {
					key: this.cloudCommonModule + '.entitySubsidiary',
					text: 'Subsidiary',
				},
				model: 'SubsidiaryFk',
				type: FieldType.Lookup,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
					showClearButton: true,
					serverSideFilter: {
						key: 'contact-subsidiary-filter',
						execute(context: ILookupContext<ISubsidiaryLookupEntity, IEvaluationEntity>) {
							return {
								BusinessPartnerFk: context.entity ? context.entity.BusinessPartnerFk : null,
							};
						},
					},
					disableDataCaching: true,
					inputSearchMembers: ['SubsidiaryDescription', 'Street', 'ZipCode', 'City', 'Iso2'],
				}),
			},
			{
				groupId: 'businessPartnerData',
				id: 'contact1fk',
				label: {
					key: this.businesspartnerMainModuleName + '.entityContact1',
					text: 'Contact 1',
				},
				model: 'Contact1Fk',
				type: FieldType.Lookup,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedContactLookupService,
					serverSideFilterToken: Contact1ForEvaluationFilterService
				}),
			},
			{
				groupId: 'businessPartnerData',
				id: 'contact2fk',
				label: {
					key: this.businesspartnerMainModuleName + '.entityContact2',
					text: 'Contact 2',
				},
				model: 'Contact2Fk',
				type: FieldType.Lookup,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedContactLookupService,
					serverSideFilterToken: Contact2ForEvaluationFilterService
				}),
			},
		];
	}

	private getResponsibleGroup() {
		return [
			//Responsible Group
			{
				groupId: 'responsibleData',
				id: 'clerkprcfk',
				label: {
					key: this.businesspartnerMainModuleName + '.entityClerkPrc',
					text: 'Procurement Clerk',
				},
				model: 'ClerkPrcFk',
				type: FieldType.Lookup,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
				}),
			},
			{
				groupId: 'responsibleData',
				id: 'clerkreqfk',
				label: {
					key: this.businesspartnerMainModuleName + '.entityClerkReq',
					text: 'Requisition Owner',
				},
				model: 'ClerkReqFk',
				type: FieldType.Lookup,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
				}),
			},
			{
				groupId: 'responsibleData',
				id: 'remark',
				label: {
					key: this.cloudCommonModule + '.entityRemark',
					text: 'Remarks',
				},
				model: 'Remark',
				type: FieldType.Comment,
				readonly: false,
			},
			{
				groupId: 'responsibleData',
				id: 'remark2',
				label: {
					key: this.businesspartnerMainModuleName + '.entityRemark2',
					text: 'Remarks2',
				},
				model: 'Remark2',
				type: FieldType.Comment,
				readonly: false,
			},
		];
	}

	private getReferenceGroup() {
		return [
			//References Group
			{
				groupId: 'references',
				id: 'projectfk',
				label: {
					key: this.cloudCommonModule + '.entityProject',
					text: 'Project',
				},
				model: 'ProjectFk',
				readonly: false,
				...this.projectLookupProvider.generateProjectLookup(),
			},
			{
				groupId: 'references',
				id: 'qtnheaderfk',
				label: {
					key: this.businesspartnerMainModuleName + '.entityQuotation',
					text: 'Quotation',
				},
				model: 'QtnHeaderFk',
				type: FieldType.Lookup,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareQuoteLookupService,
					showDescription: true,
					descriptionMember: 'Description',
					serverSideFilter: {
						key: 'businesspartner-main-evaluation-qtnheader-filter',
						execute(context: ILookupContext<IQuoteHeaderLookUpEntity, object>) {
							return {};
						},
					},
				}),
			},
			{
				groupId: 'references',
				id: 'conheaderfk',
				label: {
					key: this.businesspartnerMainModuleName + '.entityContract',
					text: 'Contract',
				},
				model: 'ConHeaderFk',
				type: FieldType.Lookup,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareContractLookupService,
					showDescription: true,
					descriptionMember: 'Description',
				}),
			},
			{
				groupId: 'references',
				id: 'invheaderfk',
				label: {
					key: this.businesspartnerMainModuleName + '.entityInvoice',
					text: 'Invoice',
				},
				model: 'InvHeaderFk',
				type: FieldType.Lookup,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareInvoiceLookupService,
					showDescription: true,
					descriptionMember: 'Reference',
				}),
			},
		];
	}

	private getUserDefinedGroup() {
		return [
			//User-Defined Fields Group
			{
				groupId: 'userDefined',
				id: 'userDefined1',
				label: {
					key: this.cloudCommonModule + '.entityUserDefined',
					text: 'User Defined 1',
					params: {p_0: '1'},
				},
				model: 'UserDefined1',
				type: FieldType.Comment,
				readonly: false,
			},
			{
				groupId: 'userDefined',
				id: 'userDefined2',
				label: {
					key: this.cloudCommonModule + '.entityUserDefined',
					text: 'User Defined 2',
					params: {p_0: '2'},
				},
				model: 'UserDefined2',
				type: FieldType.Comment,
				readonly: false,
			},
			{
				groupId: 'userDefined',
				id: 'userDefined3',
				label: {
					key: this.cloudCommonModule + '.entityUserDefined',
					text: 'User Defined 3',
					params: {p_0: '3'},
				},
				model: 'UserDefined3',
				type: FieldType.Comment,
				readonly: false,
			},
			{
				groupId: 'userDefined',
				id: 'userDefined4',
				label: {
					key: this.cloudCommonModule + '.entityUserDefined',
					text: 'User Defined 4',
					params: {p_0: '4'},
				},
				model: 'UserDefined4',
				type: FieldType.Comment,
				readonly: true,
			},
			{
				groupId: 'userDefined',
				id: 'userDefined5',
				label: {
					key: this.cloudCommonModule + '.entityUserDefined',
					text: 'User Defined 5',
					params: {p_0: '5'},
				},
				model: 'UserDefined5',
				type: FieldType.Comment,
				readonly: true,
			},
		];
	}

	private getHistoryGroup() {
		return [
			//History Group
			{
				groupId: 'entityHistory',
				id: 'insertedAt',
				model: 'InsertedAt',
				label: {
					key: 'cloud.common.entityInserted',
					text: 'Inserted',
				},
				type: FieldType.Remark,
				sortable: true,
				visible: true,
				width: 100,
				readonly: true,
			},
			{
				groupId: 'entityHistory',
				id: 'updatedAt',
				model: 'UpdatedAt',
				label: {
					key: 'cloud.common.entityUpdated',
					text: 'Updated',
				},
				type: FieldType.Remark,
				sortable: true,
				visible: true,
				readonly: true,
			},
		];
	}
}
