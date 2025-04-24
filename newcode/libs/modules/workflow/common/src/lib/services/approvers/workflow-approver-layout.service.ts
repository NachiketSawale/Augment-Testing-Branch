/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedClerkLookupService, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration, ILayoutGroup } from '@libs/ui/common';
import { IWorkflowApprover } from '@libs/workflow/interfaces';


/**
 * Base Layout service for Workflow Approver
 */
@Injectable({
	providedIn: 'root',
})
export class WorkflowyApproverLayoutService {

	/**
	 * A common layout function used for "Approver" and "Contract Approvers" container.
	 * @param IsGenericApprover : When true, the layout group for Approver container shall be used.
	 * @returns 
	 */
	public async generateLayout(IsGenericApprover: boolean): Promise<ILayoutConfiguration<IWorkflowApprover>> {
		return {
			groups: IsGenericApprover ? this.getApproverGroup() : this.getContractApproverGroup(),
			overloads: {
				Id: { label: { key: 'cloud.common.entityId' }, visible: true, readonly: true, sortable: true },
				IsApproved: {
					label: { key: 'cloud.common.entityApprovers.isApproved' },
					visible: true,
					readonly: true,
					sortable: true,

				},
				Comment: {
					label: { key: 'cloud.common.entityApprovers.comment' },
					visible: true,
					readonly: true,
					sortable: true
				},
				EvaluationLevel: {
					label: { key: 'cloud.common.entityApprovers.evaluationLevel' },
					visible: true,
					readonly: true,
					sortable: true
				},
				EvaluatedOn: {
					label: { key: 'cloud.common.entityApprovers.evaluatedOn' },
					readonly: true
				},
				DueDate: {
					label: { key: 'cloud.common.entityApprovers.dueDate' },
					visible: true,
					readonly: true,
					sortable: true
				},
				ClerkRole: {
					label: { key: 'cloud.common.entityApprovers.clerkRole' },
					visible: true,
					readonly: true,
					sortable: true
				},
				Clerk: {
					label: { key: 'cloud.common.entityApprovers.clerk' },
					visible: true,
					readonly: true,
					sortable: true
				},
				ClerkFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService
					})
				},
				ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true)

			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					ClerkFk: { key: 'entityClerk' },
					ClerkRoleFk: { key: 'entityClerkRole' },
				})
			},
		};
	}

	private getContractApproverGroup(): ILayoutGroup<IWorkflowApprover>[] {
		return [{
			gid: 'default-group',
			attributes: ['Id', 'IsApproved', 'Comment', 'EvaluationLevel', 'EvaluatedOn', 'DueDate', 'ClerkRole', 'Clerk']
		}];
	}

	private getApproverGroup(): ILayoutGroup<IWorkflowApprover>[] {
		return [{
			gid: 'default-group',
			attributes: ['IsApproved', 'ClerkRoleFk', 'ClerkFk', 'DueDate', 'EvaluatedOn', 'EvaluationLevel', 'Comment']
		}];
	}
}
