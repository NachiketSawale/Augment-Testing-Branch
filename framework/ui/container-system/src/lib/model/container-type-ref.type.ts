/*
 * Copyright(c) RIB Software GmbH
 */

import { Type } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { ContainerBaseComponent } from '../components/container-base/container-base.component';

/**
 * A type reference for eagerly or lazily loaded container types.
 */
export type ContainerTypeRef = Type<ContainerBaseComponent> | ((context: IInitializationContext) => Promise<Type<ContainerBaseComponent>>);
