
import { Injectable } from '@angular/core';
import {
	BoqAddIndexToBoqStructureWizardService,
	BoqCrbSiaExportWizardService,
	BoqCrbSiaImportWizardService,
	BoqExcelExportWizardService,
	BoqExcelImportWizardService,
	BoqExportGaebWizardService,
	BoqExportOenOnlvWizardService,
	BoqImportGaebWizardService,
	BoqImportOenOnlvWizardService,
	BoqRenumberBoqWizardService,
	BoqRenumberFreeBoqWizardService,
	BoqUpdateWizardService
} from '@libs/boq/main';
import { IInitializationContext } from '@libs/platform/common';
import { ProcurementContractBoqItemDataService } from '../services/procurement-contract-boq-item-data.service';

@Injectable({providedIn: 'root'})
export class ProcurementContractBoqUpdateWizardService extends BoqUpdateWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractBoqExcelImportWizardService extends BoqExcelImportWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractBoqExcelExportWizardService extends BoqExcelExportWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractGaebImportWizardService extends BoqImportGaebWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractGaebExportWizardService extends BoqExportGaebWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractRenumberFreeBoqWizardService extends BoqRenumberFreeBoqWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractRenumberBoqWizardService extends BoqRenumberBoqWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractCrbSiaImportWizardService extends BoqCrbSiaImportWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractCrbSiaExportWizardService extends BoqCrbSiaExportWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractImportOenOnlvWizardService extends BoqImportOenOnlvWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractExportOenOnlvWizardService extends BoqExportOenOnlvWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export class ProcurementContractAddIndexToBoqStructureWizardService extends BoqAddIndexToBoqStructureWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(ProcurementContractBoqItemDataService));
	}
}