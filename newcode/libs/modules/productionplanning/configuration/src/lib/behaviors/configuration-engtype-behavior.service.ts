/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IEngTypeEntity } from '../model/entities/eng-type-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ConfigurationEngtypeBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngTypeEntity>, IEngTypeEntity> {
	// private _originalNavBarRefresh: (info: IMenuItemEventInfo) => Promise<void> | void;
	//
	// public constructor(private _navBarService: ModuleNavBarService,
	//                    private _engTypeDataService: ConfigurationEngtypeDataService) {
	// }
	//
	// public onCreate(containerLink: IGridContainerLink<IEngTypeEntity>): void {
	// 	if (this._navBarService.getById(NavBarIdentifier.id.refresh)) {
	// 		if (this._navBarService.getById(NavBarIdentifier.id.refresh).fn) {
	// 			this._originalNavBarRefresh = this._navBarService.getById(NavBarIdentifier.id.refresh).fn;
	// 			this._navBarService.getById(NavBarIdentifier.id.refresh).fn = (info) => {
	// 				this._originalNavBarRefresh(info);
	// 				this._engTypeDataService.refreshAll();
	// 			};
	// 		}
	// 	}
	// }
	//
	// public onDestroy(containerLink: IGridContainerLink<IEngTypeEntity>): void {
	// 	if (this._originalNavBarRefresh) {
	// 		this._navBarService.getById(NavBarIdentifier.id.refresh).fn = this._originalNavBarRefresh;
	// 	}
	// }
}