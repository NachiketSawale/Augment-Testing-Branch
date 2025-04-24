/*
 * Copyright(c) RIB Software GmbH
 */

import {IDimensionGroupEntity} from './dimension-group-entity.interface';
import {IDimensionEntity} from './dimension-entity.interface';
import {IObjectTemplate} from './object-template.interface';

/**
 * Update dimension options
 */
export interface IDimensionUpdateOptions {
    nameModified?: boolean;
    propModified?: boolean;
}

/**
 * Dimension service interface
 */
export interface IDimensionService {
    /**
     * load dimension group entities
     * @param modelId
     */
    loadDimensionGroups(modelId: number): Promise<IDimensionGroupEntity[]>;
    /**
     * Load dimension entities
     * @param modelId
     * @param layoutId
     */
    loadDimensions(modelId: number, layoutId: string): Promise<IDimensionEntity[]>;
    /**
     * get dimension object template which is used when creating dimension
     */
    getObjectTemplate(): Promise<IObjectTemplate>;
    /**
     * new dimension entity
     * @param modelId
     */
    newEntity(modelId: number): IDimensionEntity;
    /**
     * create dimension entity
     * @param modelId
     * @param entity
     */
    createEntity(modelId: number, entity: IDimensionEntity): Promise<IDimensionEntity>;
    /**
     * create dimension entities
     * @param modelId
     * @param entities
     */
    createEntities(modelId: number, entities: IDimensionEntity[]): Promise<IDimensionEntity[]>;
    /**
     * delete dimension entity by dimension id
     * @param modelId
     * @param uuids
     */
    deleteEntityByUuids(modelId: number, uuids: string[]): Promise<boolean>;
    /**
     * delete dimension entity by model object id
     * @param modelId
     * @param modelObjectIds
     */
    deleteEntityByIds(modelId: number, modelObjectIds: number[]): Promise<boolean>
    /**
     * update dimension entity
     * @param modelId
     * @param entity
     * @param options
     */
    updateEntity(modelId: number, entity: IDimensionEntity, options?: IDimensionUpdateOptions): Promise<IDimensionEntity>;
    /**
     * update dimension entities
     * @param modelId
     * @param entities
     * @param options
     */
    updateEntities(modelId: number, entities: IDimensionEntity[], options?: IDimensionUpdateOptions): Promise<IDimensionEntity[]>;
}