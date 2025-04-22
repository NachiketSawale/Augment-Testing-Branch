import { MultistepDialog } from '../classes/multistep-dialog.class';
import { StaticProvider, Type } from '@angular/core';

/**
 *  extends the multistepDialog to support more advanced features.
 */
export class MultistepDialogAdvanced<T extends object> extends MultistepDialog<T> {
	public showTabs?: boolean = false;

	/**
	 * the percentage of the stepper width
	 */
	public mainContentWidthPercent?: number = 100;

	/**
	 * place custom component at the top
	 */
	public sectionTop?: ICustomSectionOptions;
	/**
	 * place custom component at the left
	 */
	public sectionLeft?: ICustomSectionOptions;
	/**
	 * place custom component at the right
	 */
	public sectionRight?: ICustomSectionOptions;
	/**
	 * place custom component at the bottom
	 */
	public sectionBottom?: ICustomSectionOptions;
}

export interface ICustomSectionOptions {
	component: Type<unknown>;
	providers?: StaticProvider[];
	visible: boolean;
}
