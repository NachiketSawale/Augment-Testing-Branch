/*
 * Copyright(c) RIB Software GmbH
 */

import { ContainerDefinition } from '@libs/ui/container-system';
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { ISelectionStatementOption, SELECTION_STATEMENT_OPTION_TOKEN } from '../../model/entities/selection-statement/option.interface';
import { CosCommonSelectionStatementComponent } from '../../components/selection-statement/main-filter/main-filter.component';
import { ISelectStatementEntity } from '../../model/entities/selection-statement/selection-statement-entity.interface';

export class SelectionStatementContainerFactory {
	public static create<PT extends ISelectStatementEntity>(options: ISelectionStatementOption<PT>) {
		return new ContainerDefinition({
			uuid: options.uuid,
			permission: options.permission ?? options.uuid,
			title: options.title ?? { key: 'constructionsystem.common.selectionStatementContainerTitle' },
			containerType: CosCommonSelectionStatementComponent<PT>,
			providers: [
				{ provide: new EntityContainerInjectionTokens<PT>().dataServiceToken, useExisting: options.parentServiceToken },
				{ provide: SELECTION_STATEMENT_OPTION_TOKEN, useValue: options },
			],
		});
	}
}
