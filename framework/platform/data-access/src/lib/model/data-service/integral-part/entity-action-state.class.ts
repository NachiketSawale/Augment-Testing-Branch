/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';
import { IEntityActionState } from '../interface/entity-action-state.interface';
import {IDataServiceOptions} from '../interface/options/data-service-options.interface';

export class EntityActionState<T extends object> implements IEntityActionState<T> {
	public constructor(public readonly supported: boolean,  public dynamicCreateSupported: boolean,private serviceOptions: IDataServiceOptions<T>,
					   private evalCanExecute: (entities: T[] | T | null) => boolean,
					   private prepareParam?: (parentInfo: IIdentificationData, serviceOptions: IDataServiceOptions<T>) => IIdentificationData) {
		this.dynamicCreateSupported = dynamicCreateSupported ?? false;
	}

	public canExecute(entities: T[] | T | null): boolean {
		return this.supported ? this.evalCanExecute(entities) : false;
	}

	public prepareParameter?(parentInfo: IIdentificationData): IIdentificationData {
		if (this.prepareParam) {
			return this.prepareParam(parentInfo, this.serviceOptions);
		}

		return parentInfo;
	}
}