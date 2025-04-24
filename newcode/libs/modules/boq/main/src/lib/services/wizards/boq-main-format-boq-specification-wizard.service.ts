import { Injectable } from '@angular/core';
import { BoqItemDataService, BoqItemDataServiceBase } from '../../services/boq-main-boq-item-data.service';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { IInitializationContext } from '@libs/platform/common';
import { BoqWizardUuidConstants } from '@libs/boq/interfaces';

@Injectable({providedIn: 'root'})
export abstract class FormatBoqSpecificationWizardService extends BoqWizardServiceBase {

	public getUuid(): string {
		return BoqWizardUuidConstants.FormatBoqSpecificationWizardUuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		// TODO-FWK: platformWysiwygEditorSettingsService from old client is not yet migrated to new client.
		this.messageBoxService.showInfoBox('TODO FWK: platformWysiwygEditorSettingsService pending from framework', 'info', true);
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainFormatBoqSpecificationWizardService extends FormatBoqSpecificationWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}