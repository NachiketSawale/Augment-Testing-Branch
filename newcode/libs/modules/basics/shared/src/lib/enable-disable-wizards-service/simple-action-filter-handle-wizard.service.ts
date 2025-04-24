import { Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService } from './simple-action-wizard.service';
import { IEntityModification, IEntitySelection } from '@libs/platform/data-access';
import { ISimpleActionFilterHandleOptions } from './model/interfaces/simple-action-filter-handle-options.interface';

@Injectable({
	providedIn: 'root'
})
export class BasicsSimpleActionFilterHandleWizardService< TEntity > extends BasicsSharedSimpleActionWizardService<TEntity> {

	private entityDataService: IEntitySelection<TEntity> & IEntityModification<TEntity> | null = null;
	private filterHandlerOptions: ISimpleActionFilterHandleOptions<TEntity> | null = null;

	public startWizard(option: ISimpleActionFilterHandleOptions<TEntity>, entityService: IEntitySelection<TEntity> & IEntityModification<TEntity>): void {
		this.entityDataService = entityService;
		this.filterHandlerOptions = option;

		this.startSimpleActionWizard(option.baseOptions);
	}

	protected override validate(filteredSelected: TEntity[]): boolean {
		const filterHandler = this.filterHandlerOptions;
		if(filterHandler === null || filterHandler.validate === undefined) {
			return true;
		}

		let noError = true;
		filteredSelected.forEach(item => {
			if(filterHandler.validate !== undefined && !filterHandler.validate(item)) {
				noError = false;
			}
		});

		return noError;
	}

	/**
	 * This function must be overwritten as well, when validate is overwritten. Provide a message clearly stating the
	 * issue, which had been found in the validation
	 * @protected
	 */
	protected override displayValidationError(): void {
		let errMsg = 'An unknown problem occurred';
		const filterHandler = this.filterHandlerOptions;
		if(filterHandler !== null && filterHandler.validationErrMessage) {
			errMsg = filterHandler.validationErrMessage;
		}

		this.dialogService.showInfoBox(errMsg,'info',true);
	}

	public override getSelection(): TEntity[]{
		return this.entityDataService === null ? [] : this.entityDataService.getSelection();
	}

	public override filterToActionNeeded(selected: TEntity[]): TEntity[] {
		const filterHandler = this.filterHandlerOptions;
		if(filterHandler === null) {
			return selected;
		}

		return filterHandler.filter(selected);
	}

	public override performAction(filtered: TEntity[]): void{
		const dataService = this.entityDataService;
		const filterHandler = this.filterHandlerOptions;

		if(dataService === null || filterHandler === null) {
			return;
		}

		filtered.forEach(item => {
			filterHandler.handle(item);
			dataService.setModified(item);
		});
	}


	public override postProcess(): void {
		//ToDo: Check, if something is needed here
	}
}