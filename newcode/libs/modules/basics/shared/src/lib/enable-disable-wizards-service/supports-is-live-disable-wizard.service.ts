import { Injectable } from '@angular/core';
import { IBasicsSupportsIsLive } from '@libs/basics/interfaces';
import { IEntityModification, IEntitySelection } from '@libs/platform/data-access';
import { ISimpleActionOptions } from './model/interfaces/simple-action-options.interface';
import { BasicsSimpleActionFilterHandleWizardService } from './simple-action-filter-handle-wizard.service';
import { ISimpleActionFilterHandleOptions } from './model/interfaces/simple-action-filter-handle-options.interface';

@Injectable({
	providedIn: 'root'
})
export class BasicsSupportsIsLiveDisableWizardService< TEntity extends IBasicsSupportsIsLive > extends BasicsSimpleActionFilterHandleWizardService<TEntity> {
	public startDisableWizard(option: ISimpleActionOptions<TEntity>, entityService: IEntitySelection<TEntity> & IEntityModification<TEntity>): void {
		const enhancedOptions = < ISimpleActionFilterHandleOptions< TEntity > > {
			filter: function filterOutDisabled(selected: TEntity[]): TEntity[]{
				const filteredSelection: TEntity[] = [];

				// Filter out the selection needed
				selected.forEach(item => {
					if(item.IsLive){
						filteredSelection.push(item);
					}
				});

				return filteredSelection;
			},
			handle: function disableEntity(entity: TEntity): void {
				entity.IsLive = false;
			},
			baseOptions: option
		};

		this.startWizard(enhancedOptions, entityService);
	}
}