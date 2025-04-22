/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';
import { PrcPackageCompleteEntity } from '../entities/package-complete-entity.class';
import { IPrcPackageEntity } from '@libs/scheduling/interfaces';
/**
 * Procurement package Form Data Entity Info
 */
export const PROCUREMENT_PACKAGE_FORM_DATA_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IPrcPackageEntity, PrcPackageCompleteEntity>({
	rubric: Rubric.Package,
	permissionUuid: 'D68A18244FB9427FAF41B721371CA02D',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},

	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementPackageHeaderDataService);
	},
});