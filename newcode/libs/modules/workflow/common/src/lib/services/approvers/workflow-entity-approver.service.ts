/*
 * Copyright(c) RIB Software GmbH
 */

// import { Injectable } from '@angular/core';
import { CompleteIdentification } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IWorkflowApprover } from '@libs/workflow/interfaces';
import { IEntityApproversParam } from '../../models/interface/entity-approvers-param.interface';
/**
 * Service to provide approver list based on module name.
 */
export class WorkflowEntityApproverService<PE extends object, PC extends CompleteIdentification<PE>> extends DataServiceFlatLeaf<IWorkflowApprover, PE, PC> {

	public constructor(private entityOptions: IEntityApproversParam<PE>) {
		const apiUrl: string = 'basics/workflow/approver';

		// Two different endpoints and parameters based on current module.
		// If the current module is Workflow Wdministrator, then endpoint is "getEntityApproversForInstance" with "instanceId" as param.
		// and rest options otherwise.
		const { endPoint, itemName } = entityOptions.moduleName === 'Basics.Workflow' ?
			{ endPoint: 'getEntityApproversForInstance', itemName: 'EntityApproversForInstance' } :
			{ endPoint: 'getEntityApprovers', itemName: 'EntityApprovers' };
		const options: IDataServiceOptions<IWorkflowApprover> = {
			apiUrl: apiUrl,
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: endPoint,
				usePost: false,
				prepareParam: (identity) => {
					let param: {
						[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>
					};
					if (entityOptions.moduleName === 'Basics.Workflow') {
						param = {
							instanceId: identity.pKey1 ? identity.pKey1 : 1
						};
					} else {
						param = {
							entityId: identity.pKey1 ? identity.pKey1 : 1,
							entityGUID: entityOptions.entityGUID
						};
					}
					return param;
				},
			},
			entityActions: { createSupported: false, deleteSupported: false },
			roleInfo: <IDataServiceChildRoleOptions<IWorkflowApprover, PE, PC>>{
				role: ServiceRole.Leaf,
				itemName: itemName,
				parent: entityOptions.parentService
			}
		};

		super(options);

	}
}
