/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityRuntimeData } from '@libs/platform/data-access';

export interface IScopedConfigDialogFormDataSetting<T extends object> {
	/**
	 * Form control values.
	 */
	entity: Partial<T>;

	/**
	 * Form control runtime data(e.g: readonly, validation...)
	 */
	runTimeData: EntityRuntimeData<T>;
}
