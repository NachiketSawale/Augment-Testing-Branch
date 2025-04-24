import {Component, inject, OnInit} from '@angular/core';
import {CHAT_COLOR_CONFIG_SCOPR_OPTION} from '../../model/chart-color-config-scope-options.interface';
import {FieldType, IControlContext} from '@libs/ui/common';

@Component({
	selector: 'basics-shared-chart-color-config-dialog',
	templateUrl: './chart-color-config-dialog.component.html',
	styleUrl: './chart-color-config-dialog.component.scss',
})
export class BasicsSharedChartColorConfigDialogComponent implements OnInit{
	public scope = inject(CHAT_COLOR_CONFIG_SCOPR_OPTION);

	public controlContextTemplate: IControlContext = {
		fieldId: '',
		readonly: false,
		validationResults: [],
		entityContext: {totalCount: 0},
		value: undefined
	};

	public maxValueDataControlContext: IControlContext = {
		...this.controlContextTemplate,
		fieldId: 'maxValue'
	};

	public minValueDataControlContext: IControlContext = {
		...this.controlContextTemplate,
		fieldId: 'minValue'
	};

	public avgValueDateControlContext: IControlContext = {
		...this.controlContextTemplate,
		fieldId: 'avgValue'
	};

	public constructor() {
	}

	public ngOnInit(): void {
		this.maxValueDataControlContext.value = this.scope.maxValue;
		this.minValueDataControlContext.value = this.scope.minValue;
		this.avgValueDateControlContext.value = this.scope.avgValue;
	}

	protected readonly FieldType = FieldType;
}
