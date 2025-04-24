/*
 * Copyright(c) RIB Software GmbH
 */

import {IQtoDetailSimpleInterface} from './qto-detail-simple.interface';

/**
 * qto detail infor: GetListByQtoHeaderId
 */
export interface IQtoDetailListInfoInterface {
    QtoLinesLength: number;
    HasEmtpyQtos: boolean;
    TimeStr: string;
    QtoDetailEntityList: IQtoDetailSimpleInterface[];
}