/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityActionState } from '../interface/entity-action-state.interface';
import { EntityCreate } from './entity-create.class';
import { IEntityDynamicCreateDialogService } from '../../data-service/interface/entity-dynamic-create-dialog-service.interface';
import { IEntityDataCreationContext } from '../../data-service/interface/entity-data-creation-context.interface';

/**
 * Class for handling entity creation, deciding between a fixed create dialog or a dynamic create dialog
 * based on provided conditions.
 * @typeParam T The type of the entity being created.
 */
export class EntityDataConfiguration<T extends object> {
	public constructor(
		protected actionState: IEntityActionState<T>,
		protected entityCreate: EntityCreate<T>,
		protected isCreateByFixDialogSupported: () => boolean,
		protected createByFixDialog: () => Promise<T>,
		protected onCreateSucceeded?: (created: object) => T,
	) {}

	public async createByConfiguration(context: IEntityDataCreationContext<T>, dialogService: IEntityDynamicCreateDialogService<T>): Promise<T | undefined> {
		if (this.isCreateByFixDialogSupported() && typeof this.onCreateSucceeded !== 'undefined') {
			const onSuccessFn = this.onCreateSucceeded;
			const onSuccess = (created: object) => onSuccessFn.call(this, created);
			const result = await this.createByFixDialog();
			if (result) {
				return this.entityCreate.createEnhanced(result, onSuccess);
			}
		} else if (this.supportsConfiguredCreate()) {
			const result = await dialogService.showCreateDialog(context);
			if (result) {
				return this.entityCreate.create(result);
			}
		}
		return Promise.resolve(undefined);
	}

	public supportsConfiguredCreate(): boolean {
		return this.actionState.dynamicCreateSupported;
	}
}
