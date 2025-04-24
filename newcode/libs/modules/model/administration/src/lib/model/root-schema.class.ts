/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityDomainType, IConcreteEntitySchemaProperty, IEntitySchema } from '@libs/platform/data-access';
import { IModelAdministrationRootEntity } from './entities/model-administration-root-entity.interface';

export class RootSchema implements IEntitySchema<IModelAdministrationRootEntity> {

	public get schema(): string {
		return 'model.administration.root';
	}

	public readonly properties: {[key in keyof IModelAdministrationRootEntity] : IConcreteEntitySchemaProperty} = {
		Id: {
			domain: EntityDomainType.Integer,
			mandatory: true
		}
	};
}
