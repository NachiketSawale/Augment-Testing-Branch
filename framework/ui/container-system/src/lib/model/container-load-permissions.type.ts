/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';

export type ContainerLoadPermissions = string | string[] | ((context: IInitializationContext) => string | string[] | Promise<string | string[]>);
