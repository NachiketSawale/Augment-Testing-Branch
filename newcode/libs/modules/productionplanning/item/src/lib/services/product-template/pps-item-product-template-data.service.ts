import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, IEntityList, ServiceRole
} from '@libs/platform/data-access';

import {
	IPpsProductTemplateEntityGenerated,
	IPpsProductEntityGenerated
} from '@libs/productionplanning/shared';
import { PpsItemDataService } from '../pps-item-data.service';
import { IPPSItemEntity, PPSItemComplete } from '../../model/models';

@Injectable({
	providedIn: 'root'
})
export class PpsItemProductTemplateDataService extends DataServiceFlatLeaf<IPpsProductTemplateEntityGenerated, IPPSItemEntity, PPSItemComplete> {

	public constructor(private parentService: PpsItemDataService) {
		const options: IDataServiceOptions<IPpsProductTemplateEntityGenerated> = {
			apiUrl: 'productionplanning/producttemplate/productdescription',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsProductTemplateEntityGenerated, IPPSItemEntity, PPSItemComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ProductTemplate',
				parent: parentService
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};

		super(options);
		this.init();
	}

	private init() {
		this.listChanged$.subscribe(() => {
			this.listChanged();
		});
	}

	private listChanged() {
		const list = this.getList();
		if (list) {
			setTimeout(() => {
				this.selectFirst();
			}, 1000);
		}
	}

	protected override onLoadSucceeded(loaded: object): IPpsProductTemplateEntityGenerated[] {
		if (loaded) {
			return loaded as IPpsProductEntityGenerated[];
		}
		return [];
	}

	private transferModification2Complete(complete: PPSItemComplete, modified: IPpsProductTemplateEntityGenerated[], deleted: IPpsProductTemplateEntityGenerated[]) {
		if (modified && modified.length > 0) {
			complete.ProductTemplateToSave = modified;
		}
	}

	private takeOverUpdatedFromComplete(complete: PPSItemComplete, entityList: IEntityList<IPpsProductTemplateEntityGenerated>) {
		if (complete && complete.ProductTemplateToSave && complete.ProductTemplateToSave.length > 0) {
			entityList.updateEntities(complete.ProductTemplateToSave);
		}
	}

	public override isParentFn(parentKey: IPPSItemEntity, entity: IPpsProductTemplateEntityGenerated): boolean {
		return entity.Id === parentKey.ProductDescriptionFk;
	}

	protected override provideLoadPayload(): object {
		const parentSelected = this.getSelectedParent();
		if (parentSelected) {
			return { Id: parentSelected?.ProductDescriptionFk ?? -1 };
		} else {
			throw new Error('There should be a selected parent to load the corresponding product-template data');
		}
	}

}
