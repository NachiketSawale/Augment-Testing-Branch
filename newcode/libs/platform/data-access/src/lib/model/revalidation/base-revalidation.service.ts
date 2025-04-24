/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IValidationFunctions } from '../validation/validation-functions.interface';
import { Validator } from '../validation/validator.type';
import { ValidationResult } from '../validation/validation-result.class';
import { CollectionHelper, Dictionary, IEntityIdentification, PropertyType } from '@libs/platform/common';
import _, { isNil } from 'lodash';
import { BaseValidationService } from '../validation/base-validation.service';
import { IEntityRuntimeDataRegistry } from '../data-service/interface/entity-runtime-data-registry.interface';
import { IEntityList } from '../data-service/interface/entity-list.interface';
import { ValidationInfo } from '../validation/validation-info.class';
import { IEntityModification } from '../data-service/interface/entity-modification.interface';
import { IRevalidationFunctions } from './revalidation-functions.interface';
import { IRevalidator } from './revalidators.interface';
import { RevalidationInfo } from './revalidation-info.class';
import { Revalidator } from './revalidator.type';
import { Revalidators } from './revalidators.type';

class RevalidateSpecificationHelper<T extends object & IEntityIdentification> {
	public constructor(private specification: IRevalidationFunctions<T>, protected validationService: BaseValidationService<T>) {}
	public getEntityRevalidators(){
		return Object.entries(this.specification).map(([field,revals]) => [field, this.getRevalidators2(revals)] as [keyof T, IRevalidator<T>[]]);
	}
	public getEntityRevalidatorsFlat(){
		return Object.entries(this.specification).flatMap(([field,revals]) => this.getRevalidators2(revals).map(rev => [field, rev] as [keyof T, IRevalidator<T>]));
	}
	public getFieldRevalidators2(field: keyof T){
		return this.getEntityRevalidatorsFlat().filter(([f, rev]) => this.isDependingOnField(field,rev));
	}
	public getFieldRevalidators(field: keyof T){
		return _.groupBy(this.getFieldRevalidators2(field), ([f, rev]) => f);
	}
	public getFieldsToRevalidate(field: keyof T){
		return this.getFieldRevalidators2(field).map(([field, rev]) => field);
	}
	public getRevalidators(field: keyof T){
		return this.getRevalidators2(this.specification[field as string]);
	}
	public getRevalidators2(revalidators:  (() => Revalidators<T>) | Revalidators<T> | undefined){
		const tempRevalidators = typeof revalidators === 'function' ? revalidators() : revalidators;
		let resultRevalidators : IRevalidator<T>[];
		if(tempRevalidators instanceof Array){
			resultRevalidators = tempRevalidators;
		} else if(!isNil(tempRevalidators)) {
			resultRevalidators = [tempRevalidators];
		} else {
			resultRevalidators = [];
		}
		resultRevalidators.forEach(rev =>  rev.validator = !isNil(rev.validator) ? rev.validator.bind(this.validationService) : rev.validator);
		return resultRevalidators;
	}
	public getRevalidateOnlySameEntity(revalidator: IRevalidator<T>){
		return !isNil(revalidator.revalidateOnlySameEntity) ? revalidator.revalidateOnlySameEntity : false;
	}
	public getDependsOn(revalidator: IRevalidator<T>){
		return !isNil(revalidator.dependsOn) ? revalidator.dependsOn : [];
	}
	public getRevalOnlyIfHasError(revalidator: IRevalidator<T>){
		return !isNil(revalidator.revalidateOnlyIfHasError) ? revalidator.revalidateOnlyIfHasError : false;
	}
	public isRevalidateOnlySameEntity(lastChangedModel: keyof T) {
		return !this.getEntityRevalidatorsFlat().
			some(([field, reVal]) => this.getDependsOn(reVal).includes(lastChangedModel) && !this.getRevalidateOnlySameEntity(reVal));
	}
	public isRevalidateOnlyIfHasError(field: keyof T, lastChangedField: keyof T) {
		return this.getFieldRevalidators2(lastChangedField).every(([f, reVal]) => f === field && this.getRevalOnlyIfHasError(reVal));
	}
	public isDependingOnField(field: keyof T, rev : IRevalidator<T>){
		return !isNil(rev.dependsOn) ? rev.dependsOn.includes(field) : false;
	}
}
class ErrorTrackerCache<T extends object & IEntityIdentification> {
	private errorableEntities= new Map<number, Dictionary<keyof  T, boolean>>();
	public constructor() {
		this.errorableEntities =  new Map<number, Dictionary<keyof  T, boolean>>();
	}

	public addEntity(entity : T) {
		const errEntity = new Dictionary<keyof  T, boolean>();
		this.errorableEntities.set(entity.Id, errEntity);
		return [entity.Id, errEntity] as [number, Dictionary<keyof  T, boolean>];
	}
	public getEntity(entity : T) {
		const errEntity = this.errorableEntities.get(entity.Id);
		return [entity.Id, errEntity] as [number, Dictionary<keyof  T, boolean> | undefined];
	}

	public fieldAlreadyHasBeenValidatedAsError(entity: T, field: keyof T) {
		const errEntity = this.errorableEntities.get(entity.Id);
		if (!isNil(errEntity)) {
			if (errEntity.containsKey(field)) {
				return errEntity.get(field);
			}
		}
		return false;
	}

	public getErrorEntity(entity: T) {
		let errEntity = this.getEntity(entity);
		if (isNil(errEntity[1])) {
			errEntity = this.addEntity(entity);
		}
		return errEntity[1] as Dictionary<keyof  T, boolean>;
	}

	public applyResult(res: ValidationResult, entity: T, field: keyof T) {
		const errorEnt = this.getErrorEntity(entity);
		errorEnt.add(field,!res.valid);
	}
}
class Revalidation<T extends object & IEntityIdentification> {
	private errorTrackerCache : ErrorTrackerCache<T> = new ErrorTrackerCache<T>();
	public constructor(
		private specificationInfo: RevalidateSpecificationHelper<T>,
		private dataService: IEntityList<T> & IEntityRuntimeDataRegistry<T> & IEntityModification<T>,
	) {
		this.errorTrackerCache = new ErrorTrackerCache();
	}
	private resetErrorTrackerCache() {
		this.errorTrackerCache = new ErrorTrackerCache();
	}
	private revalidateEntity(entity : T, lastChangedInfo: ValidationInfo<T>, entities:T[]) {
		let hasBeenChanged = false;
		const returnPromises : Promise<ValidationResult>[] = [];
		for (const field of this.specificationInfo.getFieldsToRevalidate(lastChangedInfo.field as keyof T)) {
			const info = new RevalidationInfo(entity, entity[field] as PropertyType | undefined,field as string, entities);
			if (
				//!this.errorTrackerCache.fieldAlreadyHasBeenValidatedAsError(entity, field) &&
				this.isNotLastChangedCell(info, lastChangedInfo) &&
				this.needsToBeRevalidated(info, lastChangedInfo)
			) {
				//let orgEntity = this.isNotLastChangedEntity(entity, lastChangedEntity) ? entity : lastChangedEntity;
				returnPromises.push(this.revalidateField(info));
				hasBeenChanged = true;
			}
		}
		return Promise.all(returnPromises).then(results => hasBeenChanged);
	}
	private revalidateOtherFields(lastChangedInfo: ValidationInfo<T>, updatedList: T[]) {
		//let entities = updatedList ? updatedList : this.getUpdatedList(lastChangedEntity, lastChangedValue, lastChangedModel);//Todo: line can be deleted?
		const revalidationEntities = this.specificationInfo.isRevalidateOnlySameEntity(lastChangedInfo.field as keyof T) ?
			[this.getUpdatedEntity(lastChangedInfo)] :
			updatedList;
		const returnPromises : Promise<boolean>[] = [];
		revalidationEntities.forEach(reValEnt => {
			const promise = this.revalidateEntity(reValEnt, lastChangedInfo, updatedList).then(revalidated => {
				if (revalidated && this.isNotLastChangedEntity(reValEnt, lastChangedInfo.entity)) {
					//self.dataService.fireItemModified(revalidationEntity); Todo: is this need on new client
				}
				return revalidated;
			});
			returnPromises.push(promise);
		});
		return returnPromises;
	}
	private revalidateField(info: RevalidationInfo<T>) {
		const res = this.getValidationMethod(info.field as keyof T)(info);
		return this.applyValidationResult(res, info.entity, info.field as keyof T);
	}
	private getValidationMethod(field: keyof T){
		const fieldsRevalidators = this.specificationInfo.getRevalidators(field);
		return this.getValidationChain(fieldsRevalidators.map(r => r.validator));
	}
	//save development of functionality for the future
	// private executeModifiers(field: keyof T, lastChangedInfo: ValidationInfo<T>, entities: T[]) {
	// 	const modifiers = this.specificationInfo.
	// 		getFieldRevalidators2(field).
	// 		filter(([f,rev]) => !isNil(rev.modifier)).
	// 		map(([f, rev]) => ([f, rev.modifier] as [keyof T,Modifier<T>]));
	// 	const resultPromises: Promise<>[] = []
	//
	// 	for(const [f, modifier] of modifiers){
	// 		const result = modifier(RevalidationInfo.NewRevalidationInfo(lastChangedInfo, entities))
	// 		if(result instanceof Promise){
	// 			result.then(res => lastChangedInfo.entity[f] = res)
	// 		} else {
	// 			lastChangedInfo.entity[f] = result;
	// 		}
	//
	// 	}
	// 	return Promise.all(resultPromises).then(res => void );
	// }
	private applyValidationResult(result: Promise<ValidationResult>, orgEntity: T, field: keyof T) {
		return result.then(res => {
			this.dataService.setModified(orgEntity);
			//platformRuntimeDataService.applyValidationResult(res, orgEntity, model);
			this.errorTrackerCache.applyResult(res, orgEntity, field);
			return res;
		});
	}
	private getValidationChain(revalidators: (Revalidator<T> | Validator<T> | undefined)[]): (info: ValidationInfo<T>) => Promise<ValidationResult> {
		const revs =  revalidators.filter(r => !isNil(r)) as (Revalidator<T> | Validator<T>)[];
		return async (i: ValidationInfo<T>) => {
			const entities = this.dataService.getList();
			const info = RevalidationInfo.NewRevalidationInfo(i,entities);
			const asyncValResults = revs.map(async rev => rev(info));
			return Promise.all(asyncValResults).then(valRes => CollectionHelper.FindOrDefault(valRes,r=> !r.valid, new ValidationResult()));
		};
	}
	private isNotLastChangedEntity(entity: T, lastChangedEntity: T) {
		return entity.Id !== lastChangedEntity.Id;
	}
	private needsToBeRevalidated(info : ValidationInfo<T>, lastChangedInfo : ValidationInfo<T>) {
		return !this.specificationInfo.isRevalidateOnlyIfHasError(info.field as keyof T, lastChangedInfo.field as keyof T) ||
			this.dataService.getValidationErrors(info.entity).some(v => v.field == info.field);
	}
	private isNotLastChangedCell(info : ValidationInfo<T>, lastChangedInfo : ValidationInfo<T>) {
		return info.field !== lastChangedInfo.field || info.entity.Id !== lastChangedInfo.entity.Id;
	}
	public getGridRevalidationMethod(field: string) : (i: ValidationInfo<T>) => Promise<ValidationResult>{
		return async (i: ValidationInfo<T>) => {
			this.resetErrorTrackerCache();
			const updatedList = this.getUpdatedList(i);
			const returnPromises: [Promise<ValidationResult>,Promise<boolean>[]] = [
				this.getValidationMethod(field as keyof T)(i),
				//this.executeModifiers(field as keyof T, i, updatedList);
				this.revalidateOtherFields(i, updatedList)
			];
			return Promise.all(returnPromises).then(function postGridRevalidation(res) {
				return res[0];
			}); // return res[0]: returning result of customGridValidationMethod
		};
	}
	private getUpdatedList(lastChangedInfo : ValidationInfo<T>) {
		const entities = this.dataService.getList().filter(entity => lastChangedInfo.entity.Id !== entity.Id);
		entities.push(this.getUpdatedEntity(lastChangedInfo));
		return entities;
	}
	private getUpdatedEntity(lastChangedInfo : ValidationInfo<T>) {
		const clonedLastChangedEntity : T = {...lastChangedInfo.entity};
		clonedLastChangedEntity[lastChangedInfo.field as unknown as keyof T] = lastChangedInfo.value as unknown as T[keyof T];
		return clonedLastChangedEntity;
	}
}


export abstract class BaseRevalidationService<T extends object & IEntityIdentification> extends BaseValidationService<T> {
	protected abstract generateRevalidationFunctions(): IRevalidationFunctions<T>;
	protected abstract getDataService() : IEntityList<T> & IEntityRuntimeDataRegistry<T> & IEntityModification<T>
	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<T>{
		return this.getDataService();
	}
	public generateValidationFunctions(): IValidationFunctions<T> {
		const specificationHelper = new RevalidateSpecificationHelper(this.generateRevalidationFunctions(),this);
		const revalidation = new Revalidation(specificationHelper,this.getDataService());
		const result: IValidationFunctions<T> = {};
		specificationHelper.getEntityRevalidators().forEach(([field, revalidators]) => {
			result[field as string] = revalidation.getGridRevalidationMethod(field as string);
		});
		return result;
	}
	protected mergeRevalidators(
		containersSuperValidators: IRevalidationFunctions<T> | null,
		fieldsSuperValidatorsSelector : (v : IRevalidationFunctions<T>) => (() => Revalidators<T>)| Revalidators<T> | undefined,
		ownValidators : Revalidators<T>
	) : Revalidators<T>{
		const fieldsSuperValidators = !isNil(containersSuperValidators) ?
			fieldsSuperValidatorsSelector(containersSuperValidators) :
			null;
			
		const resolvedSuperValidators = typeof fieldsSuperValidators === 'function' ? fieldsSuperValidators() : fieldsSuperValidators;
		return [...(resolvedSuperValidators ? CollectionHelper.AsArray(resolvedSuperValidators) : []), ...CollectionHelper.AsArray(ownValidators)] as Revalidators<T>;
	}
	protected chainFieldRevalidators(
		fieldRevalidators1: (() => Revalidators<T>) | Revalidators<T> | undefined | null,
		fieldRevalidators2: (() => Revalidators<T>) | Revalidators<T> | undefined | null,
		fieldRevalidators3?: (() => Revalidators<T>) | Revalidators<T> | null
	){
		const fR1 = typeof fieldRevalidators1 === 'function' ? fieldRevalidators1() : fieldRevalidators1;
		const fR2 = typeof fieldRevalidators2 === 'function' ? fieldRevalidators2() : fieldRevalidators2;
		const fR3 = typeof fieldRevalidators3 === 'function' ? fieldRevalidators3() : fieldRevalidators3;
		return [
			...this.asFieldRevalidators(fR1),
			...this.asFieldRevalidators(fR2),
			...this.asFieldRevalidators(fR3)
		];
	}
	protected chainRevalidators(
		revalidators1: IRevalidationFunctions<T> | null,
		revalidators2: IRevalidationFunctions<T> | null,
		revalidators3?: IRevalidationFunctions<T> | null
	) : IRevalidationFunctions<T>{
		const reval1 = !isNil(revalidators1)? revalidators1 : {};
		const reval2 = !isNil(revalidators2)? revalidators2 : {};
		const reval3 = !isNil(revalidators3)? revalidators3 : {};
		const fields1 = Object.keys(reval1);
		const fields2 = Object.keys(reval2);
		const fields3 = Object.keys(reval3);
		const fields = _.uniq([...fields1,...fields2,...fields3]);
		return Object.fromEntries(fields.map((f) => [f,this.chainFieldRevalidators(reval1[f],reval2[f],reval3[f])]));
	}
	protected asFieldRevalidator(validator: Validator<T> | IRevalidator<T>): IRevalidator<T>{
		return typeof validator === 'object' ? validator as IRevalidator<T> : {validator: validator as Validator<T>};
	}
	protected asFieldRevalidators(validators: Validator<T> | Validator<T>[] | Revalidators<T> | undefined | null): IRevalidator<T>[]{
		if(Array.isArray(validators)){
			return validators.map(val => this.asFieldRevalidator(val));
		} else if (!isNil(validators)){
			return [this.asFieldRevalidator(validators)];
		} else {
			return [];
		}
	}
	protected asRevalidators(validators: IValidationFunctions<T> | null): IRevalidationFunctions<T>{
		if(!isNil(validators)){
			return Object.
			fromEntries(
				Object.
				entries(validators).
				map(([key, validator]) => [key, this.asFieldRevalidators(validator)]));
		}
		return {};
	}
}