import { Injectable } from '@angular/core';

import { EngTaskComplete, IEngTaskEntity } from '../model/models';

import { IPpsProductEntityGenerated, IPpsProductTemplateEntityGenerated, PpsProductTemplateComplete, PpsSharedProductTemplateDataService } from '@libs/productionplanning/shared';
import { EngineeringTaskDataService } from './engineering-task-data.service';
import { UiCommonDialogService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class EngineeringProductTemplateDataService extends PpsSharedProductTemplateDataService<IPpsProductTemplateEntityGenerated, PpsProductTemplateComplete, IEngTaskEntity, EngTaskComplete> {
	public constructor(
		parentService: EngineeringTaskDataService,
		private readonly dialogService: UiCommonDialogService,
	) {
		super(parentService, {
			parentFilter: 'engTaskId',
			endRead: 'listbyengtask',
			usePostForRead: false,
		});
	}

	public async reload() {
		return this.load({ id: 0, pKey1: this.parentService.getSelection()[0].Id });
	}

	public override canCreate(): boolean {
		return !!this.parentService.getSelectedEntity()?.EngDrawingFk;
	}

	public override canDelete(): boolean {
		return this.parentService.getSelection().length > 0;
	}

	public override createUpdateEntity(modified: IPpsProductTemplateEntityGenerated | null): PpsProductTemplateComplete {
		const productTemplateComplete = new PpsProductTemplateComplete();
		if (modified !== null) {
			productTemplateComplete.MainItemId = modified.Id;
			productTemplateComplete.ProductDescriptions = [modified];
		}
		return productTemplateComplete;
	}

	public override registerNodeModificationsToParentUpdate(complete: EngTaskComplete, modified: PpsProductTemplateComplete[], deleted: IPpsProductTemplateEntityGenerated[]): void {
		if (modified && modified.some(() => true)) {
			complete.ProductDescriptionToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			complete.ProductDescriptionToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: EngTaskComplete): IPpsProductTemplateEntityGenerated[] {
		if (complete && !!complete.ProductDescriptionToSave) {
			return complete!.ProductDescriptionToSave[0]!.ProductDescriptions ?? [];
		}
		return [];
	}

	protected override onLoadSucceeded(loaded: object): IPpsProductTemplateEntityGenerated[] {
		if (loaded) {
			return loaded as IPpsProductEntityGenerated[];
		}
		return [];
	}

	public override isParentFn(parentKey: IEngTaskEntity, entity: IPpsProductTemplateEntityGenerated): boolean {
		return entity.EngTaskFk === parentKey.Id;
	}
}
