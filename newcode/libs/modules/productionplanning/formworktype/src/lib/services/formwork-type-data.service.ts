import { Injectable } from '@angular/core';
import {
    DataServiceFlatRoot,
    IDataServiceEndPointOptions,
    IDataServiceOptions,
    IDataServiceRoleOptions,
    ServiceRole
} from '@libs/platform/data-access';
import { FormworkTypeEntity } from '../model/entities/formwork-type-entity.class';
import { FormworkTypeEntityComplete } from '../model/entities/formwork-type-complete.class';

@Injectable({
	providedIn: 'root'
})
export class FormworkTypeDataService extends DataServiceFlatRoot<FormworkTypeEntity, FormworkTypeEntityComplete> {
    public constructor() {
		const options: IDataServiceOptions<FormworkTypeEntity> = {
			apiUrl: 'productionplanning/formworktype',
            createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create'
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
            updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceRoleOptions<FormworkTypeEntity>> {
				role: ServiceRole.Root,
				itemName: 'FormworkType'
			}
		};
		super(options);
	}

    public override createUpdateEntity(modified: FormworkTypeEntity | null): FormworkTypeEntityComplete {
		const complete = new FormworkTypeEntityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.FormworkType = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: FormworkTypeEntityComplete): FormworkTypeEntity[] {
		if (complete.FormworkType === null) {
			complete.FormworkType = [];
		}

		return complete.FormworkType;
	}
}