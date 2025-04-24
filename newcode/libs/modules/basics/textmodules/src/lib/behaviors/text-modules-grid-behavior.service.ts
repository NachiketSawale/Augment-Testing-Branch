import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {ITextModuleEntity} from '../model/entities/textmodule-entity.interface';
import {BasicsTextModulesMainService} from '../services/text-modules-main-data.service';

@Injectable({
	providedIn: 'root'
})
export class TextModulesGridBehaviorService implements IEntityContainerBehavior<IGridContainerLink<ITextModuleEntity>, ITextModuleEntity> {
	private dataService: BasicsTextModulesMainService;

	public constructor() {
		this.dataService = inject(BasicsTextModulesMainService);
	}

	public onCreate(containerLink: IGridContainerLink<ITextModuleEntity>) {
	}
}
