import { Component } from '@angular/core';
import { UiCommonModule} from '@libs/ui/common';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';

@Component({
	standalone: true,
	imports: [UiCommonModule],
	template: '<ui-common-style-editor2></ui-common-style-editor2>',
})
export class BoqBlobSpecificationComponent<T extends object> extends EntityContainerBaseComponent<T> {
	public constructor() {
		super();
	}
}
