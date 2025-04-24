/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatNode, IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { PhaseTemplateEntity } from '../model/phase-template-entity.class';
import { PhaseTemplateEntityComplete } from '../model/phase-template-entity-complete.class';
import { ProcessTemplateEntity } from '../model/process-template-entity.class';
import { ProcessTemplateEntityComplete } from '../model/process-template-entity-complete.class';
import { ProductionplanningProcessconfigurationProcessTemplateDataService } from './productionplanning-processconfiguration-process-template-data.service';

import { PpsPhaseTemplateReadonlyProcessor } from './phase-template.processor';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningProcessconfigurationPhaseTemplateDataService extends DataServiceFlatNode<PhaseTemplateEntity, PhaseTemplateEntityComplete, ProcessTemplateEntity, ProcessTemplateEntityComplete> {

	public constructor(processtemplateDataService: ProductionplanningProcessconfigurationProcessTemplateDataService) {
		const options: IDataServiceOptions<PhaseTemplateEntity> = {
			apiUrl: 'productionplanning/processconfiguration/phasetemplate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyprocesstemplate',
				usePost: false,
				prepareParam: ident => {
					return { processTemplateId: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<PhaseTemplateEntity, ProcessTemplateEntity, ProcessTemplateEntityComplete>>{
				role: ServiceRole.Node,
				itemName: 'PhaseTemplate',
				parent: processtemplateDataService
			}
		};

		super(options);

		this.processor.addProcessor([
			new PpsPhaseTemplateReadonlyProcessor(this)
		]);
	}

	public override createUpdateEntity(modified: PhaseTemplateEntity | null): PhaseTemplateEntityComplete {
		const complete = new PhaseTemplateEntityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PhaseTemplates = [modified];
			complete.PhaseTemplate = modified; // in server side, property PhaseTemplate of PhaseTemplateCompleteDto is used for updating
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PhaseTemplateEntityComplete): PhaseTemplateEntity[] {
		if (complete.PhaseTemplates === null) {
			complete.PhaseTemplates = [];
		}

		return complete.PhaseTemplates;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: ProcessTemplateEntityComplete, modified: PhaseTemplateEntityComplete[], deleted: PhaseTemplateEntity[]) {
		if (modified && modified.length > 0) {
			complete.PhaseTemplateToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			complete.PhaseTemplateToDelete = deleted;
		}
	}

	public override isParentFn(parentKey: ProcessTemplateEntity, entity: PhaseTemplateEntity): boolean {
		return entity.ProcessTemplateFk === parentKey.Id;
	}

	public override getSavedEntitiesFromUpdate(complete: ProcessTemplateEntityComplete): PhaseTemplateEntity[] {
		return (complete && complete.PhaseTemplateToSave)
			? complete.PhaseTemplateToSave.map(e => e.PhaseTemplate!)
			: [];
	}

}