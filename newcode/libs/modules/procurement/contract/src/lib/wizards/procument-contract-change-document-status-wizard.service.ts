import {inject, Injectable} from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { ICommonWizard,ProcurementCommonChangeDocumentStatusWizardService} from '@libs/procurement/common';
import { ProcurementContractDocumentDataService } from '../services/procurement-contract-document-data.service';

@Injectable({
    providedIn: 'root'
})

export class ProcurementContractChangeDocumentStatusWizardService extends ProcurementCommonChangeDocumentStatusWizardService implements ICommonWizard {
   
    protected override dataService = inject(ProcurementContractDocumentDataService); 
     
    public async execute(context: IInitializationContext): Promise<void> {
		await this.startChangeStatusWizard();
	}
    
}


