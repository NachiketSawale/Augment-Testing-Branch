import { IWizardStepGrid } from '../interfaces/wizard-step.interface';
import { StepType } from '../enums/step-type.enum';
import { IGridConfiguration } from '../../../../grid';
import { IWizardButton } from '../interfaces/step-button.interface';
import { Translatable } from '@libs/platform/common';
import { isString } from 'lodash';

/**
 * class of grid step
 *
 * @group Dialogs
 */
export class GridStep<T extends object> implements IWizardStepGrid<T> {
	/**
	 * Init a step with a grid config
	 * @param id step id
	 * @param title step title
	 * @param gridConfiguration configuration of the grid
	 * @param modelName bind the model via property name of the main model
	 */
	public constructor(id: string, title: Translatable, gridConfiguration: IGridConfiguration<T>, modelName: string);

	/**
	 * Init a step with a grid config
	 * @param id step id
	 * @param title step title
	 * @param gridConfiguration configuration of the grid
	 * @param model bind the model to an object directly
	 */
	public constructor(id: string, title: Translatable, gridConfiguration: IGridConfiguration<T>, model: T[]);

	public constructor(id: string, title: Translatable, gridConfiguration: IGridConfiguration<T>, model: string | T[]) {
		this.id = id;
		this.title = title;
		this.gridConfiguration = gridConfiguration;
		this.requireSelection = true;
		this.suppressFilter = false;
		this.autoRefresh = true;
		if (isString(model)) {
			this.modelName = model;
			this.model = Object.create(null);
		} else {
			this.model = model;
		}
	}

	public topButtons?: IWizardButton<T>[];
	public topDescription?: Translatable;
	public bottomDescription?: Translatable;

	/**
	 * Back button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public disallowBack?: boolean | (() => boolean);
	/**
	 * Next button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public disallowNext?: boolean | (() => boolean);
	/**
	 * Finish button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public canFinish?: boolean | (() => boolean);
	/**
	 * Cancel button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public disallowCancel?: boolean | (() => boolean);
	public id: string;
	public loadingMessage?: Translatable;
	public readonly stepType = StepType.Grid;
	public title: Translatable;
	public gridConfiguration: IGridConfiguration<T>;
	public requireSelection: boolean;
	public suppressFilter: boolean;
	public modelName?: string;
	public model: T[];
	public selectionChanged?: (items: T[]) => void;

	public refreshGrid() {
		this.gridConfiguration = {
			...this.gridConfiguration,
			columns: [...(this.gridConfiguration.columns || [])], // update columns
			items: [...(this.gridConfiguration.items || [])], // update items
		};
	}

	public copy(): GridStep<T> {
		const step = new GridStep('', '', {}, []);
		return Object.assign(step, this);
	}

	public readonly autoRefresh?: boolean;
}
