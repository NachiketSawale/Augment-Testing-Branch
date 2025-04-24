import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICosAssemblyEntity } from '../model/entities/cos-assembly-entity.interface';
import { UiModuleNavigationHelperService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterAssemblyBehaviorService implements IEntityContainerBehavior<IGridContainerLink<ICosAssemblyEntity>, ICosAssemblyEntity> {
	private uiModuleNavigationHelperService: UiModuleNavigationHelperService = inject(UiModuleNavigationHelperService);
	public onCreate(containerLink: IGridContainerLink<ICosAssemblyEntity>) {
		this.uiModuleNavigationHelperService.remove(containerLink.uiAddOns.toolbar);
	}
}
