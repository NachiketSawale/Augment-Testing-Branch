/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IPrcConfig2ConApprovalEntity } from '../../model/entities/prc-config-2-con-approval-entity.interface';

/**
 * ProcurementConfiguration 2Contract Approvals layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsPrcConfigConfiguration2ConApprovalLayoutService {
	private lookupFactory = inject(UiCommonLookupDataFactoryService);

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IPrcConfig2ConApprovalEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['ClerkRoleFk', 'ReferneceDateType', 'Period', 'Amount', 'IsMail', 'IsCommentReject', 'IsCommentApproved', 'EvaluationLevel'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.common.', {
					ClerkRoleFk: {
						key: 'entityClerkRole',
						text: 'Clerk Role',
					},
				}),
				...prefixAllTranslationKeys('basics.procurementconfiguration.', {
					ReferneceDateType: {
						key: 'entityReferneceDateType',
						text: 'Reference Date Type',
					},
					Period: {
						key: 'entityPeriod',
						text: 'Period',
					},
					Amount: {
						key: 'entityAmount',
						text: 'Amount',
					},
					IsMail: {
						key: 'entityIsMail',
						text: 'Is Mail',
					},
					IsCommentReject: {
						key: 'entityIsCommentReject',
						text: 'Is Comment Reject',
					},
					IsCommentApproved: {
						key: 'entityIsCommentApproved',
						text: 'Is Comment Approved',
					},
					EvaluationLevel: {
						key: 'entityEvaluationLevel',
						text: 'Evaluation Level',
					},
				}),
			},
			overloads: {
				ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(false),
				ReferneceDateType: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: this.lookupFactory.fromSimpleItemClass(
							[
								{
									id: 1,
									desc: {
										key: 'basics.procurementconfiguration.dateEffective',
									},
								},
								{
									id: 2,
									desc: {
										key: 'basics.procurementconfiguration.dateReported',
									},
								},
								{
									id: 3,
									desc: {
										key: 'basics.procurementconfiguration.insertedAt',
									},
								},
							],
							{
								uuid: '',
								valueMember: 'id',
								displayMember: 'desc',
								translateDisplayMember: true,
							},
						),
					}),
				},
				Period: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: this.lookupFactory.fromSimpleItemClass(
							[
								{
									id: 1,
									desc: {
										key: 'basics.procurementconfiguration.approval',
									},
								},
								{
									id: 2,
									desc: {
										key: 'basics.procurementconfiguration.proving',
									},
								},
							],
							{
								uuid: '',
								valueMember: 'id',
								displayMember: 'desc',
								translateDisplayMember: true,
							},
						),
					}),
				},
			},
		};
	}
}
