/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken, Translatable } from '@libs/platform/common';
import { IMaterialEntity } from '../entities/material/material-entity.interface';
import { ColumnDef, IFormConfig, ILayoutConfiguration } from '@libs/ui/common';

/**
 * Basics scope validation service interface, reused by prc item scope container
 */
export interface IBasicsMaterialLayoutService {
	generateLayout(customLayoutConfig: ILayoutConfiguration<IMaterialEntity>): Promise<ILayoutConfiguration<IMaterialEntity>>;

	generateGridConfig(customLayoutConfig: ILayoutConfiguration<IMaterialEntity>): Promise<ColumnDef<IMaterialEntity>[]>;

	generateFormConfig(customLayoutConfig: ILayoutConfiguration<IMaterialEntity>): Promise<IFormConfig<IMaterialEntity>>;

	getCommonLabel(): { [key: string]: Translatable };
}

export const BASICS_MATERIAL_LAYOUT_SERVICE_FACTORY = new LazyInjectionToken<IBasicsMaterialLayoutService>('basics-material-layout-service');
