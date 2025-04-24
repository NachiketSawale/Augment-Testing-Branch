/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { UiCommonModule } from '@libs/ui/common';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { BasicsMeetingSpecificationDataService } from '../../services/Basics-meeting-specification-data.service';
@Component({
	standalone: true,
	imports: [UiCommonModule],
	template: '<ui-common-style-editor2 [textareaEditable] = "textareaEditable"></ui-common-style-editor2>',
})
export class BasicsMeetingSpecificationComponent<T extends object> extends EntityContainerBaseComponent<T> {
	protected textareaEditable: boolean = true;
	private dataService = inject(this.injectionTokens.dataServiceToken) as unknown as BasicsMeetingSpecificationDataService;
	public constructor() {
		super();
		this.dataService.currentMinutesChanged.subscribe((data) => {
			const content = data?.Content;
			if (content) {
				this.setText(content);
			}
		});
	}
	public async ngOnInit() {
		this.textareaEditable = this.dataService.isItemEditAble();
		const currentSpecification = await this.dataService.getCurrentSpecification();
		if (currentSpecification && currentSpecification.Content) {
			this.setText(currentSpecification.Content);
		}
	}
	public setText(value: string) {
		const elem = document.getElementById('wysiwyg-textarea');
		if (elem) {
			elem.innerHTML = value;
		}
	}
}
/// todo update function is not ready. ui-common-style-editor2 is not working well
