import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, IEntityList,
	ServiceRole
} from '@libs/platform/data-access';
import { IIdentificationData } from '@libs/platform/common';


import { PhaseRequirementTemplateEntity } from '../model/phase-requirement-template-entity.class';
import { PhaseTemplateEntity } from '../model/phase-template-entity.class';
import { PhaseTemplateEntityComplete } from '../model/phase-template-entity-complete.class';
import {
	ProductionplanningProcessconfigurationPhaseTemplateDataService
} from './productionplanning-processconfiguration-phase-template-data.service';
import { Injectable } from '@angular/core';


import { PpsPhaseRequirementTemplateReadonlyProcessor } from './phase-requirement-template.processor';

@Injectable({
	providedIn: 'root'
})
export class PpsPhaseRequirementTemplateDateService extends DataServiceFlatLeaf<PhaseRequirementTemplateEntity,
	PhaseTemplateEntity, PhaseTemplateEntityComplete> {

	private parentService: ProductionplanningProcessconfigurationPhaseTemplateDataService;

	public constructor(parentService: ProductionplanningProcessconfigurationPhaseTemplateDataService) {
		const options: IDataServiceOptions<PhaseRequirementTemplateEntity> = {
			apiUrl: 'productionplanning/processconfiguration/phasereqtemplate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId: ident.pKey1 };
				}
			},
			createInfo: {
				prepareParam: (ident: IIdentificationData) => {
					const selection = parentService.getSelection()[0];
					return { id: selection.Id };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<PhaseRequirementTemplateEntity,
				PhaseTemplateEntity, PhaseTemplateEntityComplete>>{
					role: ServiceRole.Leaf,
					itemName: 'PhaseReqTemplate',
					parent: parentService
				}
		};

		super(options);
		this.parentService = parentService;

		this.processor.addProcessor([
			new PpsPhaseRequirementTemplateReadonlyProcessor(this)
		]);
	}

	private transferModification2Complete(complete: PhaseTemplateEntityComplete, modified: PhaseRequirementTemplateEntity[], deleted: PhaseRequirementTemplateEntity[]) {
		if (modified && modified.length > 0) {
			complete.PhaseReqTemplateToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			complete.PhaseReqTemplateToDelete = deleted;
		}
	}

	private takeOverUpdatedFromComplete(complete: PhaseTemplateEntityComplete, entityList: IEntityList<PhaseRequirementTemplateEntity>) {
		if (complete && complete.PhaseReqTemplateToSave && complete.PhaseReqTemplateToSave.length > 0) {
			entityList.updateEntities(complete.PhaseReqTemplateToSave);
		}
	}


}