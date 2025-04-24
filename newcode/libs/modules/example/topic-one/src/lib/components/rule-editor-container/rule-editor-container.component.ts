/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { ExpressionGroup } from '@libs/ui/common';
import { IDdStateConfig } from '@libs/ui/common';

@Component({
	selector: 'example-topic-one-rule-editor-container',
	templateUrl: './rule-editor-container.component.html',
	styleUrls: ['./rule-editor-container.component.css'],
})
export class RuleEditorContainerComponent extends ContainerBaseComponent {

	/**
	 * The root expression group
	 */
	public editedRule = new ExpressionGroup();

	public ddStateConfig: IDdStateConfig;

	public constructor() {
		super();
		this.ddStateConfig = {
			focusTableName: '',
			moduleName: 'project.main'
		};

		// this.ddStateConfig = {
		// 	focusTableName: '',
		// 	moduleName: 'cloud.translation'
		// };

		// this.ddStateConfig = {
		// 	focusTableName: 'MDL_OBJECT',
		// 	moduleName: ''
		// };
	}
}
