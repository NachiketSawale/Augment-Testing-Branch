import {inject, Injectable} from '@angular/core';
import { PlatformTranslateService, Translatable } from '@libs/platform/common';

import { UiCommonMessageBoxService, IYesNoDialogOptions } from '@libs/ui/common';
import { ISimpleActionOptions } from './model/interfaces/simple-action-options.interface';

@Injectable({
	providedIn: 'root'
})
export abstract class BasicsSharedSimpleActionWizardService<TEntity> {

	protected readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private option : ISimpleActionOptions<TEntity> | null = null;

	/**
	 * Show action done dialog
	 */
	public showActionDoneDialog(bodyText: string): void {

		this.dialogService.showInfoBox(bodyText,'info',true);

	}

	public startSimpleActionWizard(option: ISimpleActionOptions<TEntity>): void {
		this.option = option;
		let bodyText = '';
		// Get selected Ids
		const selected = this.getSelection();
		// Check if it is multi-selected
		if(selected.length > 1){
			// Yes or No dialog to confirm selections
			const dialogHeader =  this.translateService.instant({key:this.option.headerText}).text;
			const questionMsg = this.translateService.instant({key:this.option.questionMsg}).text;
			const dialogBody = this.getMessageText(this.option, selected, questionMsg, 'sel');
			const options: IYesNoDialogOptions = {
				defaultButtonId: 'yes',
				id: 'enableDisable',
				dontShowAgain: true,
				showCancelButton: false,
				headerText: dialogHeader,
				bodyText: dialogBody
			};

			this.dialogService.showYesNoDialog(options)?.then((result) => {
				if(result?.closingButtonId === 'yes'){
					bodyText = this.changeSimpleProperty(selected);
					this.showActionDoneDialog(bodyText);
				}
			});

		} else if(selected.length == 1){
			bodyText = this.changeSimpleProperty( selected);
			this.showActionDoneDialog(bodyText);
		} else {
			bodyText = this.translateService.instant({key:'cloud.common.noCurrentSelection'}).text;
			this.showActionDoneDialog(bodyText);
		}

		this.postProcess();
	}

	private changeSimpleProperty(selected: TEntity[]): string{
		let bodyText = '';
		if(this.option){
			const filteredSelection = this.filterToActionNeeded(selected);
			if(filteredSelection.length > 0){
				if(this.validate(filteredSelection)) {
					this.performAction(filteredSelection);
					bodyText = this.getMessageText(this.option, filteredSelection, this.translateService.instant(this.option.doneMsg).text);
				} else {
					this.displayValidationError();
				}
			} else {
				bodyText += this.getMessageText(this.option, filteredSelection, this.translateService.instant(this.option.nothingToDoMsg).text, this.option.placeholder);
			}
		}

		return bodyText;
	}

	private getMessageText(option: ISimpleActionOptions<TEntity>, entities: TEntity[] | null, bodyText: string, placeholder?: Translatable): string{
		let msgText = bodyText;
		let collection = '';

		if(placeholder){
			if(entities){
				entities.forEach(e => {
					collection += collection.length > 0 ? ', ' + e[option.codeField] : e[option.codeField];
				});
				const param = '{{' + placeholder + '}}';
				msgText = bodyText.replace(param, collection);
			}
		}

		return msgText;
	}

	/**
	 * In case there are filter according the value to be set and validations according other pre-conditions use this functions
	 * When this function is overwritten, it may return true only if there is no entity not matching the pre-condition
	 * @param filteredSelected
	 * @protected
	 */
	protected validate(filteredSelected: TEntity[]): boolean {
		return true;
	}

	/**
	 * This function must be overwritten as well, when validate is overwritten. Provide a message clearly stating the
	 * issue, which had been found in the validation
	 * @protected
	 */
	protected displayValidationError(): void { }

	protected abstract getSelection(): TEntity[];

	protected abstract filterToActionNeeded(selected: TEntity[]): TEntity[];

	protected abstract performAction(filtered: TEntity[]): void;

	protected abstract postProcess(): void;

}