/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsEntityWithProcessFk, IPpsEventParentEntity, IPpsProductEntityGenerated } from '@libs/productionplanning/shared';

export interface IPpsProductEntity extends IPpsProductEntityGenerated, IPpsEntityWithProcessFk, IPpsEventParentEntity {}
