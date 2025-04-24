import { inject } from '@angular/core';
import { IInitializationContext, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { IBoqWizardService } from '@libs/boq/interfaces';

export abstract class BoqWizardServiceBase implements IBoqWizardService {
	public abstract getUuid(): string;
	public abstract execute(context: IInitializationContext): Promise<void>;

	protected readonly http = inject(PlatformHttpService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);

	protected assertIsNotReadOnly(boqItemDataService: BoqItemDataServiceBase) {
		const message = this.translateService.instant('boq.main.boqInReadonlyStatus').text;
		return this.checkIsReadOnly(boqItemDataService).then(response => {
			if (response) {
				this.messageBoxService.showInfoBox(message, 'info', true);
				return false;
			}
			return true;
		});
	}

	private checkIsReadOnly(boqItemDataService: BoqItemDataServiceBase) {
		return (this.http.get<boolean>('boq/main/header/isreadonly?boqHeaderId=' + boqItemDataService.getSelectedBoqHeaderId())).then(
			success => {
				return success;
			}
		);
	}
}

