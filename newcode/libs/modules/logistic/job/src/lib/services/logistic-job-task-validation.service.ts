/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions/*, ValidationInfo, ValidationResult */} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IJobTaskEntity } from '@libs/logistic/interfaces';
import { LogisticJobTaskDataService } from './logistic-job-task-data.service';
/*import { ServiceLocator } from '@libs/platform/common';
import { find } from 'rxjs';*/


/**
 * Logistic job task validation service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobTaskValidationService extends BaseValidationService<IJobTaskEntity> {


	private dataService = inject(LogisticJobTaskDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<IJobTaskEntity> {
		return {
			//JobTaskTypeFk:this.validateAdditionalJobTaskTypeFk,
			//ArticleFk:this.validateAdditionalArticleFk,
			//ContractHeaderFk:this.validateContractHeaderFk,
			//InvHeaderFk:this.validateInvHeaderFk,
			//JobCardAreaFk:this.validateJobCardAreaFk
		};
	}

	/*private validateAdditionalJobTaskTypeFk (info: ValidationInfo<IJobTaskEntity>): ValidationResult {
		//TODO:this.dataService.typeChanged(null, value);
	    return ;
	}*/

	/*private validateAdditionalArticleFk (info: ValidationInfo<IJobTaskEntity>): ValidationResult{
		//TODO:this.dataService.articleChanged(entity, value);
	   	return;
	}*/


	//TODO: BasicsLookupdataLookupDescriptorService
/*	private validateContractHeaderFk (info: ValidationInfo<IJobTaskEntity>): ValidationResult{
		if(info.entity){
			const basicsLookupData = ServiceLocator.injector.get(BasicsLookupdataLookupDescriptorService);
			const role =  basicsLookupData.getItemById({ ConHeaderView : info.value as number}).BusinessPartnerFk;
			info.entity.BusinessPartnerFk = role !== null ? role : info.entity.BusinessPartnerFk;
		}
		return info;
	}*/


	//TODO: BasicsLookupdataLookupDescriptorService
		/*private validateInvHeaderFk (info: ValidationInfo<IJobTaskEntity>): ValidationResult{
			if(info.entity.JobTaskTypeFk === 2){
				const basicsLookupData = ServiceLocator.injector.get(BasicsLookupdataLookupDescriptorService);
				const role =  basicsLookupData.getItemById({ InvHeaderChained : info.value as number});
				info.entity.BusinessPartnerFk = role.BusinessPartnerFk !== null ? role.BusinessPartnerFk : role.BusinessPartnerFk;
				info.entity.ContractHeaderFk = role.ConHeaderFk !== null ? role.ConHeaderFk : role.ContractHeaderFk;
			}
			return info;
		}*/

//TODO: BasicsLookupdataLookupDescriptorService
/*
	private validateJobCardAreaFk (info: ValidationInfo<IJobTaskEntity>): ValidationResult{
		const service = ServiceLocator.injector.get(BasicsLookupdataLookupDescriptorService);
		const jobCardAreaLookup = service.getData({
			lookupModuleQualifier: 'basics.customize.jobcardarea',
			displayMember: 'Description',
			valueMember: 'Id'
		});
		const defaultEntity = find(jobCardAreaLookup, {return service.entity.isDefault});
		info.entity.JobCardAreaFk = defaultEntity.Id;
	}
*/
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IJobTaskEntity> {
		return this.dataService;
	}
}