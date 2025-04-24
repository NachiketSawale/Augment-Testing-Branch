import {Injectable} from '@angular/core';
import {DataServiceFlatRoot, IDataServiceOptions, ServiceRole} from '@libs/platform/data-access';
import {ITextModuleEntity} from '../model/entities/textmodule-entity.interface';
import {TextModuleCompleteEntity} from '../model/entities/textmodulecomplete-entity.class';

@Injectable({
	providedIn: 'root'
})
export class BasicsTextModulesMainService extends DataServiceFlatRoot<ITextModuleEntity, TextModuleCompleteEntity> {
	public currentTextModuleContextId? = null ;
	public constructor() {
		const options: IDataServiceOptions<ITextModuleEntity> = {
			apiUrl: 'basics/textmodules',
			readInfo: {
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: {
				itemName: 'TextModule',
				role: ServiceRole.Root
			},
			entityActions:{
				createSupported: true,
				deleteSupported: true
			}
		};
		super(options);
	}

	public override createUpdateEntity(modified: ITextModuleEntity | null): TextModuleCompleteEntity {
		const complete = new TextModuleCompleteEntity();
		if (null !== modified) {
			complete.MainItemId = modified.Id;
			complete.TextModule = modified;
			complete.RefTextModule = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: TextModuleCompleteEntity): ITextModuleEntity[] {
		if (!complete.TextModule){
			return [];
		}
		return [complete.TextModule];
	}
}
