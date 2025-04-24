/*
 * Copyright(c) RIB Software GmbH
 */

import { ITransportPackageEntity } from './transport-package-entity.interface';

export interface IPackageWithDstWaypointEntityGenerated {
    /**
     * Package
     */
    Package?: ITransportPackageEntity | null;
}