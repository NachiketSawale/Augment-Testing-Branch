import {inject, Injectable} from '@angular/core';

import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {EventTemplateEntity} from '../model/entities/event-template-entity.class';
import {ProductionplanningEventconfigurationEventTemplateDataService} from '../services/event-template-data.service';


@Injectable({
		providedIn: 'root'
})
export class PpsEventTemplateGridBehavior implements IEntityContainerBehavior<IGridContainerLink<EventTemplateEntity>, EventTemplateEntity> {

		private dataService: ProductionplanningEventconfigurationEventTemplateDataService;
		

		public constructor() {
				this.dataService = inject(ProductionplanningEventconfigurationEventTemplateDataService);
		}

		public onCreate(containerLink: IGridContainerLink<EventTemplateEntity>) {}

}