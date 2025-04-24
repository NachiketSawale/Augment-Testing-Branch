/*
 * Copyright(c) RIB Software GmbH
 */
import {IMdcContrConfigHeaderEntity} from './mdc-contr-config-header-entity.interface';
import {MdcContrFormulaPropDefEntity} from './mdc-contr-formula-prop-def-entity.class';
import {IMdcContrColumnPropDefEntity} from './mdc-contr-column-prop-def-entity.interface';

export interface MdcContrConfigCompleteEntity {
    MdcContrConfigHeaderDto :IMdcContrConfigHeaderEntity[];
    MdcContrColumnPropDefs :IMdcContrColumnPropDefEntity[];
    MdcContrFormulaPropDefs:MdcContrFormulaPropDefEntity[];
}