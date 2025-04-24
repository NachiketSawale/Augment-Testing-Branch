/*
 * Copyright(c) RIB Software GmbH
 */


import {
	inject,
	Injectable
} from '@angular/core';
import { IContainerUiAddOns } from '@libs/ui/container-system';
import {
	IEntityContainerBehavior,
	IEntityContainerLink
} from '@libs/ui/business-base';
import { IPropertyKeyTagEntity } from '../model/entities/property-key-tag-entity.interface';
import { ModelAdministrationPropertyKeyTagCategoryDataService } from '../services/property-key-tag-category-data.service';

@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyTagBehavior
	implements IEntityContainerBehavior<IEntityContainerLink<IPropertyKeyTagEntity>, IPropertyKeyTagEntity> {

	private readonly categoryDataSvc = inject(ModelAdministrationPropertyKeyTagCategoryDataService);

	public onCreate(containerLink: IEntityContainerLink<IPropertyKeyTagEntity>) {
		const sub = this.categoryDataSvc.selectionChanged$.subscribe(() => this.updateEmptyCategorySelectedOverlay(containerLink.uiAddOns));
		containerLink.registerSubscription(sub);

		this.updateEmptyCategorySelectedOverlay(containerLink.uiAddOns);
	}

	private shouldDisplayEmptyCategorySelectedWarning(): boolean {
		const selCategory = this.categoryDataSvc.getSelectedEntity();
		return Boolean(selCategory && selCategory.Id <= 0);
	}

	private updateEmptyCategorySelectedOverlay(uiAddOns: IContainerUiAddOns) {
		if (this.shouldDisplayEmptyCategorySelectedWarning()) {
			uiAddOns.whiteboard.showInfo({key: 'model.administration.propertyKeys.emptyCategory'});
		} else {
			uiAddOns.whiteboard.visible = false;
		}
	}
}
