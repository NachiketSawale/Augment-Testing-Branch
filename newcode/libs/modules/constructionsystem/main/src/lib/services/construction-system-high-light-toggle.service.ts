import { ConstructionSystemMainHighlightOption } from '../model/enums/cos-main-highlight-option.enum';
import { Injectable } from '@angular/core';
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemHighLightToggleService {
	public currentHighlight: ConstructionSystemMainHighlightOption = ConstructionSystemMainHighlightOption.MainObject;

	public setCurrentHighlight(highLight: ConstructionSystemMainHighlightOption) {
		this.currentHighlight = highLight;
	}

	public toggleHighlight(gridItemList: unknown, highlightObject: ConstructionSystemMainHighlightOption | null) {
		if (highlightObject) {
			this.setCurrentHighlight(highlightObject);
		}
		/// todo constructionSystemMainModelFilterService is not ready

		//     if (service.highlight.isAssignObject()) {
		//         service.setAssObjSelectionOnViewer(null, assArg, gridItemList);
		//     } else if (service.highlight.isMainObject()) {
		//         service.setMainSelectionOnViewer(null, mainArg, gridItemList);
		//     }else if (service.highlight.isObjectSet()) {
		//         service.setObjectSetSelectionOnViewer(gridItemList);
		//     } else if (service.highlight.isLineItemObject()) {
		//         service.setLineItemObjectSelectionOnViewer(null, lineitemArg, gridItemList);
		//     }else if (service.highlight.isLineItem()) {
		//         service.setLineItemSelectionOnViewer(gridItemList);
		//     }else {
		//         constructionSystemMainModelFilterService.emptySelection();
		//     }
		//     service.onBarToolHighlightStatusChanged.fire();
	}

	/**
	 * Check high light is assign object
	 */
	public isAssignObject() {
		return this.currentHighlight === ConstructionSystemMainHighlightOption.AssignObject;
	}
	/**
	 * Check high light is line item
	 */
	public isLineItem() {
		return this.currentHighlight === ConstructionSystemMainHighlightOption.LineItem;
	}
}
