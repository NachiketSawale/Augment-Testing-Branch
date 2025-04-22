import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IWizardStepGrid } from '../../model/interfaces/wizard-step.interface';
import { GridStep } from '../../model/classes/grid-step.class';

@Component({
	selector: 'ui-common-step-grid',
	templateUrl: './step-grid.component.html',
	styleUrls: ['./step-grid.component.scss'],
})
export class StepGridComponent<T extends object> {
	private _stepGrid: IWizardStepGrid<T> = new GridStep<T>('', '', {}, []);

	@Output()
	public selectionChanged: EventEmitter<T[]> = new EventEmitter();

	@Input()
	public set stepGrid(value: IWizardStepGrid<T>) {
		this._stepGrid = value;
		this._stepGrid.gridConfiguration = {
			...this._stepGrid.gridConfiguration,
			items: [...this._stepGrid.model] as T[],
			columns: [...(this._stepGrid.gridConfiguration.columns || [])],
		};
	}

	public get stepGrid() {
		return this._stepGrid;
	}

	@Input()
	public set items(value: T[]) {
		this._stepGrid.gridConfiguration = {
			...this._stepGrid.gridConfiguration,
			items: [...value],
		};
	}

	public onSelectionChanged(selectedItems: T[]) {
		if (this._stepGrid.selectionChanged) {
			this._stepGrid.selectionChanged(selectedItems);
		}
		this.selectionChanged.emit(selectedItems);
	}
}
