import { Injectable } from '@angular/core';
import { BoqLineType } from '../../model/boq-main-boq-constants';
import { IOenBoqItemEntity } from '../../model/entities/oen-boq-item-entity.interface';

@Injectable({providedIn: 'root'})
export class OenDataService {
	/** Builds ItemInfo. */
	public buildItemInfo(boqItem: IOenBoqItemEntity): string {
		const oenLabels = [];

		if (boqItem.BoqLineTypeFk === BoqLineType.Position) {
			oenLabels.push(boqItem.IsUnsharedPosition ? 'U' : 'F');
		}

		return oenLabels.join();
	}
}
