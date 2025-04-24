/*
 * Copyright(c) RIB Software GmbH
 */

import {RuleEditorContext} from './rule-editor-context.class';
import {EventEmitter, inject} from '@angular/core';
import {SubEntity} from './sub-entity.class';
import {ISubEntityInfo} from '../representation/sub-entity-info.interface';
import {clone, cloneDeep} from 'lodash';
import {AliasExpression} from './alias-expression.class';
import {forkJoin, Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {IParameterizedDbPath} from '../representation/parameterized-db-path.interface';
import {map} from 'rxjs/operators';
import {SchemaGraphNode} from './schema-graph-node.class';
import {IEntityField} from '../representation/entity-field.interface';
import {SchemaGraphProvider} from './schema-graph-provider.class';

/**
 * ContextProvider
 * Manages sub-entities created by a user within a schema graph based on the data dictionary
 */
export class ContextProvider {
    /**
     * context
     */
    public context: RuleEditorContext;

    /**
     * contextChanged event emitter
     */
    public contextChanged: EventEmitter<void>;

    private subEntities: SubEntity[] = [];
    private http = inject(HttpClient);
    private configService = inject(PlatformConfigurationService);

    /**
     * Default constructor
     */
    public constructor() {
        this.context = new RuleEditorContext();
        this.contextChanged = new EventEmitter<void>();
    }

    /**
     * addEntities
     * @param subEntities
     */
    public addEntities(subEntities: ISubEntityInfo[] | ISubEntityInfo) {
        const newEntities = [];
        if (Array.isArray(subEntities)) {
            subEntities.forEach((entity: ISubEntityInfo) => {
                newEntities.push(this.getSubEntity(entity));
            });
        } else {
            newEntities.push(this.getSubEntity(subEntities));
        }
        this.context.subEntities?.push(...newEntities);
        this.contextChanged.emit();
        return newEntities;
    }

    /**
     * removeEntities
     * @param idList
     */
    public removeEntities(idList: number[] | string | undefined) {
        let removedEntities: SubEntity[] = [];
        if (Array.isArray(idList)) {
            removedEntities = this.context.subEntities.filter(e => idList.includes(this.convertToIntId(e.id)));
            this.context.subEntities = this.context.subEntities.filter(e => !idList.includes(this.convertToIntId(e.id)));
        } else if (typeof idList === 'string') {
            const targetEntity = this.context.subEntities.find(e => e.id === idList);
            if (targetEntity) {
                this.context.subEntities.splice(this.context.subEntities.indexOf(targetEntity), 1);
                removedEntities = [targetEntity];
            }
        } else {
            this.context.subEntities = [];
        }

        this.contextChanged.emit();

        return removedEntities;
    }

    /**
     * retrieveEntities
     * @param idList
     */
    public retrieveEntities(idList: string[] | number[] | string | undefined) {
        if (idList === undefined) {
            return this.context.subEntities;
        }

        if (Array.isArray(idList)) {
            const stringIds = idList.map(id => this.convertToStringId(id));
            return this.context.subEntities.filter(e => stringIds.includes(e.id.toString()));
        } else {
            const subEntity = this.context.subEntities.find(e => e.id.toString() === idList);
            if (subEntity) {
                return [subEntity];
            }
            return [];
        }
    }

    /**
     * addAliasExpression
     * @param parentPath
     * @param pathSegment
     * @param parameters
     */
    public addAliasExpression(parentPath: string, pathSegment: string[], parameters: unknown[] /* todo: concrete type*/) {
        const newId = this.context.aliasExpressions.length;
        const newExpr = new AliasExpression(`@${newId}`, parentPath);
        newExpr.pathSegment = pathSegment;
        newExpr.parameters = parameters;
        newExpr.fullId = (parentPath === '' ? '' : (parentPath + '.')) + newExpr.id;
        this.context.aliasExpressions.push(newExpr);
        this.contextChanged.emit();
        return newExpr.fullId;
    }

    /**
     * retrieveAliasExpressions
     */
    public retrieveAliasExpressions() {
        return this.context.aliasExpressions;
    }

    /**
     * removeAliasExpressions
     */
    public removeAliasExpressions() {
        this.context.aliasExpressions = [];
        this.contextChanged.emit();
    }

    /**
     * normalizePath
     * @param id
     * @param passedEntities
     */
    public normalizePath(id: string, passedEntities: SubEntity[]) {
        const subEntityPathSegments = id.split('.').filter(segment => {
            return segment.includes('*');
        });

        const subEntities = passedEntities || this.retrieveEntities(subEntityPathSegments);
        subEntities.forEach(subEntity => {
            if (subEntity.path) {
                id = id.replace(subEntity.id.toString(), subEntity.path);
            }
        });
    }

    /**
     * getSubEntityLabel
     * @param index
     */
    public getSubEntityLabel(index: number): string {
        const subEntityId = this.convertToStringId(index);
        const subEntities = this.retrieveEntities(subEntityId);
        if (subEntities && subEntities.length > 0) {
            const subEntity = subEntities[0];
            if (subEntity) {
                return subEntity.name as string;
            }
        }
        return '';
    }

    /**
     * getAliasExpressionLabel
     * @param index
     */
    public getAliasExpressionLabel(index: number): Observable<string> {
        const expression = this.context.aliasExpressions[index];
        const postData: IParameterizedDbPath = {
            Path: expression.pathSegment ?? [],
            Parameters: expression.parameters ?? []
        };
        return this.http.post<string>(this.configService.webApiBaseUrl + 'basics/common/bulkexpr/schema/formatfield', postData);
    }

    /**
     * extractLabelsFromPath
     * @param id
     */
    public extractLabelsFromPath(id: string) {
        const subEntityPathSegments = id.split('.').filter(segment => segment.includes('*'));
        const subEntities = this.retrieveEntities(subEntityPathSegments);
        return subEntities.map(e => e.name as string).filter(e => e !== '');
    }

    /**
     * initializeSubEntities
     * @param graphProvider
     */
    public initializeSubEntities(graphProvider: SchemaGraphProvider) {
        const missingSubEntities = this.context.subEntities.filter(e => !e.node);
        const observables: Observable<void>[] = [];
        missingSubEntities.forEach(subEntity => {
            observables.push(this.createPathNodeAsync(subEntity, graphProvider, graphProvider.findLoadedNode(subEntity.path)));
        });
        return forkJoin(observables).pipe(map(() => {
            return true;
        }));
    }

    /**
     * initializeAliasExpressions
     * @param graphProvider
     * @param parentNode
     * @param field
     */
    public initializeAliasExpressions(graphProvider: SchemaGraphProvider, parentNode: SchemaGraphNode, field: IEntityField) {
        const aliasExpressionParentPath = (parentNode?.parent as SchemaGraphNode)?.id;
        const relevantAliasExpressions = this.context.aliasExpressions.filter(ae => ae.parentPath === aliasExpressionParentPath);
        const requests$: Observable<void>[] = [];
        relevantAliasExpressions.forEach(aliasInfo => {
            const newTreeNode = new SchemaGraphNode(aliasInfo.id, field.UiTypeId, field.TargetId, aliasInfo.label, parentNode, field.UiTypeId === 'lookup', field.IsForeignKey);
            newTreeNode.isVirtual = true;
            newTreeNode.mightHaveChildren = true;
            newTreeNode.onlyStructural = true;
            const aliasIndex = parseInt(aliasInfo.id.substring(1));
            requests$.push(this.getAliasExpressionLabel(aliasIndex).pipe(map((lbl: string) => {
                newTreeNode.name = lbl;
            })));
            parentNode.children?.push(newTreeNode);
        });
        if (requests$.length > 0) {
            forkJoin(requests$);
        }
        // todo: registerPromises()??
    }

    /**
     * addDynamicFieldsAsync
     * @param fields
     */
    public addDynamicFieldsAsync(fields: Record<string, (string | IEntityField)[]>) {
        let changePerformed = false;
        const requests: Observable<void>[] = [];
        Object.keys(fields).forEach((typeId: string) => {
            const typeFields = fields[typeId];
            const dynamicFields = this.getDynamicFieldsByType(typeId);

            typeFields.forEach(field => {
                if (typeof field === 'string') {
                    if (!dynamicFields.some(f => f.DdPath === field)) {
                        requests.push(this.http.get<IEntityField>(this.configService.webApiBaseUrl + 'basics/common/bulkexpr/schema/field', {params: new HttpParams().set('path', field)}).pipe(map((fieldInfo) => {
                            dynamicFields.push(fieldInfo);
                            changePerformed = true;
                        })));
                    }
                } else {
                    if (!dynamicFields.some(f => f.DdPath === field.DdPath)) {
                        dynamicFields.push(field);
                        changePerformed = true;
                    }
                }
            });
        });

        return forkJoin(requests).pipe(map(() => {
            return changePerformed;
        }));
    }

    /**
     * addDynamicFields
     * @param fields
     */
    public addDynamicFields(fields: Record<string, (string | IEntityField)[]>) {
        let changePerformed = false;
        Object.keys(fields).forEach((typeId: string) => {
            const typeFields = fields[typeId];
            const dynamicFields = this.getDynamicFieldsByType(typeId);

            typeFields.forEach(field => {
                if (typeof field === 'string') {
                    if (!dynamicFields.some(f => f.DdPath === field)) {
                        throw new Error('Unable to retrieve field info for ' + field + ' in synchronous mode.');
                    }
                } else {
                    if (!dynamicFields.some(f => f.DdPath === field.DdPath)) {
                        dynamicFields.push(field);
                        changePerformed = true;
                    }
                }
            });
        });

        return changePerformed;
    }

    /**
     * getDynamicFieldsByType
     * @param typeId
     */
    public getDynamicFieldsByType(typeId: string) {
        let dynamicFields = this.context.dynamicFields[typeId];
        if (!dynamicFields) {
            dynamicFields = [];
            this.context.dynamicFields[typeId] = dynamicFields;
        }
        return dynamicFields;
    }

    /**
     * getEditorManager
     */
    public getEditorManager() {
        return this.context.ruleEditorManager;
    }

    private getSubEntity(subEntityInfo: ISubEntityInfo) {
        const subEntityName = subEntityInfo.name;
        const subEntityPath = subEntityInfo.path || subEntityInfo.originalNode.id.toString();
        const subEntityId = this.assignId(subEntityInfo.id, this.subEntities);
        const subEntityNode = subEntityInfo.node || clone(subEntityInfo.originalNode);
        const subEntityDisplayName = subEntityInfo.displayName;
        return new SubEntity(subEntityName, subEntityPath, subEntityId, subEntityNode, subEntityDisplayName);
    }

    private assignId(id: number | string, subEntities: SubEntity[]) {
        if (!id) {
            let currentId = Math.max(...subEntities.map(e => this.convertToIntId(e.id.toString()))) || 0;
            currentId++;
            return this.convertId(currentId);
        } else if (subEntities.find(e => e.id === id)) {
            throw 'Id for pinned sub-entity is already allocated. Error at sub-entity initialization';
        } else {
            return typeof id === 'number' ? this.convertId(id) : id;
        }
    }

    private convertToIntId(id: number | string) {
        if (typeof id === 'number') {
            return id;
        } else {
            return parseInt(id.replace(/\D/g, ''));
        }
    }

    private convertToStringId(id: number | string) {
        if (typeof id === 'number') {
            return '*' + id; // todo adding star??
        } else {
            return '*' + parseInt(id.replace(/\D/g, ''));
        }
    }

    private convertId(id: number | string) {
        if (typeof id === 'number') {
            return '*' + id; // todo adding star??
        } else {
            return parseInt(id.replace(/\D/g, ''));
        }
    }

    private createPathNodeAsync(subEntity: SubEntity, graphProvider: SchemaGraphProvider, originalNode: SchemaGraphNode | null) {
        let subEntity$: Observable<SubEntity>;
        if (originalNode) {
            subEntity.node = cloneDeep(originalNode);
            subEntity$ = of(subEntity);
        } else {
            subEntity$ = this.http.get<IEntityField>(this.configService.webApiBaseUrl + 'basics/common/bulkexpr/schema/field', {params: new HttpParams().set('path', subEntity.path as string)}).pipe(map((field: IEntityField) => {
                subEntity.node = new SchemaGraphNode(subEntity.id as string, field.UiTypeId, field.TargetId, subEntity.name, null, field.UiTypeId === 'lookup', field.IsForeignKey);
                subEntity.node.isNullable = Boolean(field.IsNullable);
                subEntity.node.mightHaveChildren = typeof field.TargetId === 'number' && !field.TargetKind;
                subEntity.node.onlyStructural = false;
                subEntity.node.targetKind = field.TargetKind;

                return subEntity;
            }));
        }

        return subEntity$.pipe(map(subE => {
            subE.setNodeProperties();
            // const labelList: ILabelPath = {
            //     PathLabels: [subE.node.path, subE.node.name]
            // };
            //subE.displayName = graphProvider.formatDisplayName(labelList); // todo
        }));

    }
}