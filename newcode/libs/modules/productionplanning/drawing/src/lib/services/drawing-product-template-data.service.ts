import { isNull } from 'lodash';
import { Injectable } from '@angular/core';

import {
	EngDrawingComplete,
	IEngDrawingEntity,
} from '../model/models';
import { DrawingDataService } from './drawing-data.service';

import {
	IPpsProductTemplateEntityGenerated,
	PpsSharedProductTemplateDataService, PpsProductTemplateComplete, IPpsProductEntityGenerated
} from '@libs/productionplanning/shared';


@Injectable({
	providedIn: 'root'
})
export class DrawingProductTemplateDataService extends PpsSharedProductTemplateDataService<IPpsProductTemplateEntityGenerated, PpsProductTemplateComplete, IEngDrawingEntity, EngDrawingComplete> {

	private static cacheMap: Map<string, DrawingProductTemplateDataService> = new Map();

	public static getInstance(uuid: string, parentService: DrawingDataService): DrawingProductTemplateDataService {
		let instance = this.cacheMap.get(uuid);
		if (!instance) {
			instance = new DrawingProductTemplateDataService(parentService);
			this.cacheMap.set(uuid, instance);
		}
		return instance;
	}

	public constructor(parentService: DrawingDataService) {
		super(parentService,
			{
				parentFilter: 'engDrawingId',
				endRead: 'listbyengdrawing',
				usePostForRead: false,
				uiServiceKey: 'forDrawing',
			});
	}

	public override createUpdateEntity(modified: IPpsProductTemplateEntityGenerated | null): PpsProductTemplateComplete {
		const productTemplateComplete = new PpsProductTemplateComplete();
		if (modified !== null) {
			productTemplateComplete.MainItemId = modified.Id;
			productTemplateComplete.ProductDescriptions = [modified];
		}
		return productTemplateComplete;
	}

	public override registerNodeModificationsToParentUpdate(complete: EngDrawingComplete, modified: PpsProductTemplateComplete[], deleted: IPpsProductTemplateEntityGenerated[]): void {
		if (modified && modified.some(() => true)) {
			complete.ProductDescriptionToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			complete.ProductDescriptionToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: EngDrawingComplete): IPpsProductTemplateEntityGenerated[] {
		if (complete && !isNull(complete.ProductDescriptionToSave)) {
			return complete.ProductDescriptionToSave[0].ProductDescriptions ?? [];
		}
		return [];
	}

	protected override onLoadSucceeded(loaded: object): IPpsProductTemplateEntityGenerated[] {
		if (loaded) {
			return loaded as IPpsProductEntityGenerated[];
		}
		return [];
	}

	public override isParentFn(parentKey: IEngDrawingEntity, entity: IPpsProductTemplateEntityGenerated): boolean {
		return entity.EngDrawingFk === parentKey.Id;
	}

}
