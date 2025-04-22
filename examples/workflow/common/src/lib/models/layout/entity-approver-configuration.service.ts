/*
 * Copyright(c) RIB Software GmbH
 */

import { runInInjectionContext } from '@angular/core';
import { CompleteIdentification, IInitializationContext } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { IWorkflowApprover } from '@libs/workflow/interfaces';
import { IEntityApproverOptions } from '../interface/entity-approvers-param.interface';
import { IEntitySelection } from '@libs/platform/data-access';
import { WorkflowEntityApproverService } from '../../services/approvers/workflow-entity-approver.service';
import { WorkflowyApproverLayoutService } from '../../services/approvers/workflow-approver-layout.service';


export class EntityApproverConfigurationService {

	private static dataServiceProvider = new Map<string, IEntitySelection<IWorkflowApprover>>();

	/**
	 * This function will provide approver data service instance.
	 * @param config : container configuration properties.
	 * @param servContext
	 * @returns
	 */
	private static prepareDataService<PE extends object, PC extends CompleteIdentification<PE>>(
		config: IEntityApproverOptions<PE>,
		servContext: IInitializationContext,
	) {
		const uuid = config.containerUuid;
		let instance = EntityApproverConfigurationService.getDataService(uuid);
		if (!instance) {
			instance = runInInjectionContext(servContext.injector, () => new WorkflowEntityApproverService<PE, PC>({
				entityId: config.entityId,
				entityGUID: config.entityGUID,
				moduleName: config.moduleName,
				parentService: config.parentServiceContext(servContext)
			}));
			EntityApproverConfigurationService.dataServiceProvider.set(uuid, instance);
		}
		return instance as WorkflowEntityApproverService<PE, PC>;
	}

	/**
	 * This function provides the service based on container UUID.
	 * @param uuid
	 * @returns
	 */
	public static getDataService(uuid: string) {
		return EntityApproverConfigurationService.dataServiceProvider.get(uuid);
	}

	/**
	 * Creates an entity info object for approver container.
	 * @param options
	 * @returns
	 */
	public static prepareApproverEntity<PE extends object, PC extends CompleteIdentification<PE>>(options: IEntityApproverOptions<PE>): EntityInfo {
		return EntityInfo.create<IWorkflowApprover>({
			grid: {
				containerUuid: options.containerUuid,
				title: options.containerTitle,
			},
			dataService: (ctx) => {
				return EntityApproverConfigurationService.prepareDataService<PE, PC>(options, ctx);
			},
			dtoSchemeId: {
				moduleSubModule: 'Basics.Workflow',
				typeName: 'WorkflowApproversDto'
			},
			permissionUuid: options.containerUuid,
			layoutConfiguration: context => {
				return context.injector.get(WorkflowyApproverLayoutService).generateLayout(false);
			}
		});
	}
}
