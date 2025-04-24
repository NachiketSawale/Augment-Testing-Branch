/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Input, OnInit } from '@angular/core';
import { ExpressionGroup } from '../../model/data/expression-group.class';
import { Orientation } from '../../../model/orientation.enum';
import { IRuleConfiguration } from '../../model/representation/rule-configuration.interface';
import { RuleOperatorType } from '../../model/types/rule-operator-type.enum';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IDdStateConfig } from '../../model/representation/dd-state-config.interface';

/**
 * A component for viewing and editing expression trees.
 */
@Component({
	selector: 'ui-common-rule-editor',
	templateUrl: './rule-editor.component.html',
	styleUrls: ['./rule-editor.component.scss'],
})
export class RuleEditorComponent implements OnInit{

	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);

	/**
	 * Gets or sets the expression tree to edit in the component.
	 */
	@Input()
	public value?: ExpressionGroup;

	/**
	 * Gets or sets the orientation with which to display the rule editor.
	 */
	@Input()
	public orientation: Orientation = Orientation.Horizontal;

	/**
	 * ruleType
	 */
	@Input()
	public ruleType: RuleOperatorType = RuleOperatorType.CompareOperator;

	/**
	 * ddStateConfiguration
	 */
	@Input()
	public ddStateConfiguration!: IDdStateConfig;

	/**
	 * Returns a complete configuration object for the entire component and its subcomponents.
	 */
	public get configuration(): IRuleConfiguration {
		return {
			orientation: this.orientation,
			ruleType: this.ruleType,
			ddStateConfig: this.ddStateConfiguration
		};
	}

	/***
	 * on init handler
	 */
	public ngOnInit(): void {
		if(this.value) {
			this.value.setAsRootExpressionGroup();
		}
	}

	/***
	 * Performs an advanced search with the expression in rule editor
	 */
	public performSearch() {
		const searchFilter = this.value?.exportRootExpressionGroup();
		const payload = {
			filter: '',
			PageSize: 600,
			PageNumber: 0,
			UseCurrentClient: false,
			UseCurrentProfitCenter: null,
			IncludeNonActiveItems: true,
			ProjectContextId: null,
			PinningContext: [
				{
					token: 'estimate.main',
					id: {
						Id: 1007631
					},
					info: '2 - AAAAA'
				}
			],
			ExecutionHints: false,
			IsEnhancedFilter: true,
			EnhancedFilterDef:JSON.stringify(searchFilter),
			InterfaceVersion: '2.0'
		};
		this.http.post(this.configService.webApiBaseUrl + 'cloud/translation/resource/listfiltered', payload).subscribe(result => {
			console.log(result);
		});
	}
}
