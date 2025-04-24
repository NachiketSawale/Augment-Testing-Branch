import { InjectionToken, ProviderToken } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { ISelectStatementEntity } from './selection-statement-entity.interface';
import { ICosSelectionStatementMainService } from '../../enums/selection-statement-main-service.interface';

export const SELECTION_STATEMENT_OPTION_TOKEN = new InjectionToken<ISelectionStatementOption<ISelectStatementEntity>>('selection-statement-option-token');

export interface ISelectionStatementOption<T extends ISelectStatementEntity> {
	limitModel?: boolean;
	showExecute?: boolean;
	executeFn?: () => void;
	selectionChangeFn?: () => void;
	getModelIdFn?: () => number | null | undefined;

	/**
	 * The unique ID of the selection statement container.
	 */
	readonly uuid: string;

	/**
	 * The permission UUID of the container. If none is specified, the UUID will be used.
	 */
	readonly permission?: string;

	/**
	 * The human-readable title of the selection statement container.
	 */
	readonly title?: Translatable;

	/**
	 * The injection token for the data service of the parent container.
	 */
	readonly parentServiceToken: ProviderToken<IEntitySelection<T>> & ProviderToken<ICosSelectionStatementMainService>;
}
