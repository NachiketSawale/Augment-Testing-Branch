/*
 * Copyright(c) RIB Software GmbH
 */
import {IProjectLocationEntity} from '@libs/project/interfaces';

export class QtoMainLocationComplete {
    public EntitiesCount:number = 1;
    public Goniometer : number = 1;
    public MainItemId : number = 0;
    public QtoHeaderId : number = 0;
    public NoDecimals : number = 0;
    public LocationsToSave : IProjectLocationEntity[] | null = [];
    public LocationsToDelete : IProjectLocationEntity[] | null = [];
}