import { IMenuList, MenuListContent } from '@libs/ui/common';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemSelectionStatementHelperService {
	/***
	 * refresh tool bra items for simpler,enhanced,expert filter
	 * @param menuList
	 */
	public refreshToolBar(menuList: IMenuList) {
		const items = menuList as MenuListContent;
		if (items && items.items) {
			menuList.deleteItems(['create', 'delete', 'searchAll', 'searchColumn']);
		}
	}
}
