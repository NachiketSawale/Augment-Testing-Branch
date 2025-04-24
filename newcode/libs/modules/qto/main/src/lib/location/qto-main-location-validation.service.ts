/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {IProjectLocationEntity} from '@libs/project/interfaces';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {QtoMainLocationDataService} from './qto-main-location-data.service';
import * as math from 'mathjs';
import {forEach} from 'lodash';
import * as _ from 'lodash';
import {BigNumber} from 'mathjs';
@Injectable({
    providedIn: 'root'
})
export class QtoMainLocationValidationService extends BaseValidationService<IProjectLocationEntity>{

    protected readonly validationUtils = inject(BasicsSharedDataValidationService);

    public constructor(protected dataService: QtoMainLocationDataService) {
        super();
        dataService.dataValidationService = this;
    }

    protected generateValidationFunctions(): IValidationFunctions<IProjectLocationEntity> {
        return {
            validateCode: this.validateCode,
            validateSorting: this.validateSorting,
            validateQuantity: this.validateQuantity,
            validateQuantityPercent: this.validateQuantityPercent,

            updateAfterDelete: this.updateAfterDelete,
            updateAfterCreate: this.updateAfterCreate
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectLocationEntity> {
        return this.dataService;
    }
    /**
     * Validation codes cannot be empty and are unique
     * @protected
     */
    public validateCode(info: ValidationInfo<IProjectLocationEntity>): ValidationResult {
        const itemList = this.dataService.getList();
        return this.validationUtils.isUniqueAndMandatory(info, itemList);

    }
    /**
     * Validation Sorting cannot be empty and are unique
     * @protected
     */
    public validateSorting(info: ValidationInfo<IProjectLocationEntity>): ValidationResult {
        const entity = info.entity;
        const result = this.validationUtils.isMandatory(info);
        if (result.valid) {
            entity.Quantity = info.value as number;
        }
        return result;
    }
    public validateQuantity (info: ValidationInfo<IProjectLocationEntity>): ValidationResult {
        const entity = info.entity;
        const result = this.validationUtils.isMandatory(info);
        if (entity && entity.Quantity && entity.Quantity > 0.01) {
            const bigValue = math.bignumber(entity.Quantity);
            const actQuantity:BigNumber  = math.bignumber('' + entity.Quantity);
            const quantityDelta: number = math.subtract(bigValue, actQuantity).toNumber();
            const oldPercentage: BigNumber = math.bignumber('' + entity.QuantityPercent);
            let temp = 0.00;
            const rootLocs = this.dataService.getList();

            forEach(rootLocs,function (rootLoc) {
                if(rootLoc && rootLoc.Quantity){
                    temp += rootLoc.Quantity;
                }
            });
            const totalActQuantity = math.bignumber(temp);

            const newPercentage = math.multiply(math.divide(bigValue, math.add(totalActQuantity, quantityDelta)), math.bignumber(100.00));// Determine my part of new entire quantity

            entity.QuantityPercent = math.number(newPercentage as number);

            this.adjustChildren(entity, (math.divide(newPercentage, oldPercentage)) as number, this.dataService, quantityDelta);
            this.adjustParentAndSiblings(entity, oldPercentage.toNumber(), newPercentage as number, this.dataService, quantityDelta??0);
        }
        return result;
    }
    public adjustChildren(entity: IProjectLocationEntity, factor: number, locationService: QtoMainLocationDataService, quantityDelta:number = 0){
        const server = this.adjustChildren;
        forEach(entity.Locations,function (loc) {
            if(!quantityDelta) {
                loc.Quantity = (math.number(math.multiply(math.bignumber(''+loc.Quantity), factor)as number)) as number;
            }
            loc.QuantityPercent = (math.number(math.multiply(math.bignumber(''+loc.QuantityPercent), factor)as number)) as number;
            locationService.setModified(loc);

            server(loc, factor, locationService, quantityDelta);
        });
    }
    public adjustParentAndSiblings(entity: IProjectLocationEntity, oldPercentage: number, newPercentage: number, locationService : QtoMainLocationDataService, quantityDelta:number = 0){
        const adjustChildren = this.adjustChildren;
        const adjustParentAndSiblings = this.adjustParentAndSiblings;
        const numberX: number =math.bignumber(100.00).toNumber();
        const factor = math.divide( numberX - newPercentage, numberX - oldPercentage);
        if (entity.LocationParentFk && entity.LocationParentFk > 0) {
            const locationList = locationService.getList();
            const parentLoc = _.find(locationList, { Id: entity.LocationParentFk });
            if (parentLoc) {

                // First adjust siblings
                const oldParentPercentage: number = math.bignumber('' + parentLoc.QuantityPercent).toNumber();
                let sumOfNewQuantity: number = math.bignumber('' + entity.Quantity).toNumber();
                let sumOfNewPercentage = newPercentage;

                _.forEach(parentLoc.Locations, function (loc) {
                    if (loc.Id !== entity.Id) {
                        const bignumber: number = math.bignumber('' + loc.QuantityPercent).toNumber();
                        if (!quantityDelta) {
                            loc.Quantity = (math.number(math.multiply(bignumber, factor))) as number;
                        }
                        loc.QuantityPercent = (math.number(math.multiply(bignumber, factor))) as number;
                        adjustChildren(loc, factor, locationService, quantityDelta);

                        //locationService.markItemAsModified(loc);

                        sumOfNewPercentage = math.add(sumOfNewPercentage, loc.QuantityPercent);
                        sumOfNewQuantity = math.add(sumOfNewQuantity, loc.Quantity?? 0);
                    }
                });

                // Adjust parent itself
                if (quantityDelta) {
                    parentLoc.Quantity = math.number(math.add(math.bignumber('' + parentLoc.Quantity), quantityDelta)as number);
                } else {
                    parentLoc.Quantity = math.number(sumOfNewQuantity);
                }
                parentLoc.QuantityPercent = math.number(sumOfNewPercentage);
                //locationService.markItemAsModified(parentLoc);

                adjustParentAndSiblings(parentLoc, oldParentPercentage, sumOfNewPercentage, locationService, quantityDelta);
            }
        } else {
            const siblingLocations = locationService.getList();

            _.forEach(siblingLocations, function (loc) {
                if (loc.Id !== entity.Id) {
                    const bignumber: number = math.bignumber('' + loc.Quantity).toNumber();
                    if (!quantityDelta) {
                        loc.Quantity = (math.number(math.multiply(bignumber, factor))) as number;
                    }
                    loc.QuantityPercent = (math.number(math.multiply(bignumber, factor))) as number;
                    adjustChildren(loc, factor, locationService, quantityDelta??0);
                    //locationService.markItemAsModified(loc);
                }
            });
        }
    }
    public validateQuantityPercent(info: ValidationInfo<IProjectLocationEntity>): ValidationResult {

        const entity = info.entity;
        const result = this.validationUtils.isMandatory(info);
        if(entity && entity.QuantityPercent && entity.QuantityPercent > 0.01 && entity.QuantityPercent < 100.00) {
            //result = true;

            const oldPercentage: BigNumber  = math.bignumber(''+entity.QuantityPercent);
            const newPercentage: BigNumber  = math.bignumber(entity.QuantityPercent);
            const bigNumber:number = math.bignumber(''+entity.Quantity).toNumber();
            const divdeNumber: number = math.divide(newPercentage, oldPercentage)as number;
            entity.Quantity = math.number(math.multiply(bigNumber, divdeNumber));

            this.adjustChildren(entity, math.divide(newPercentage, oldPercentage)as number, this.dataService);
            this.adjustParentAndSiblings(entity, oldPercentage.toNumber(), newPercentage.toNumber(), this.dataService);
        }

        return result;
    }
    public updateOtherLocationByEntityQuantity(entity : IProjectLocationEntity, service : QtoMainLocationDataService, entityChange: number){
        const server = this.adjustChildren;
        if(entity.LocationParentFk && entity.LocationParentFk > 0) {
            const parent = this.dataService.getSelectedEntity();
            if(parent && parent.Quantity != null){
                let newParentQuantity = parent.Quantity + entityChange;
                if(newParentQuantity < 0.01) {
                    newParentQuantity = 1.0;
                }
            }
            //this.validateQuantity(parent, newParentQuantity);
        } else {
            const siblingLocations = service.getList();
            let totalQuantityOfOther = 0.0;

            _.forEach(siblingLocations, function(loc) {
                if(loc && loc.Quantity && loc.Id !== entity.Id) {
                    totalQuantityOfOther += loc.Quantity;
                }
            });

            const changedTotalQuantity = totalQuantityOfOther + entityChange;
            const factor = math.divide(math.bignumber(changedTotalQuantity), math.bignumber(totalQuantityOfOther));

            _.forEach(siblingLocations, function(loc) {
                const  bignumber:number = math.bignumber(''+loc.QuantityPercent).toNumber();
                if(loc.Id !== entity.Id) {
                    loc.QuantityPercent = (math.number(math.multiply(bignumber, factor)as number)) as number;
                    server(loc, factor as number, service, entityChange);
                }
            });
        }
    }
    public updateAfterCreate(info: ValidationInfo<IProjectLocationEntity>): ValidationResult {
        const entity = info.entity;
        const result = this.validationUtils.isMandatory(info);
        this.updateOtherLocationByEntityQuantity(entity, this.dataService, entity.Quantity??0);
        return result;
    }
    public updateAfterDelete(info: ValidationInfo<IProjectLocationEntity>): ValidationResult {
        const entity = info.entity;
        const result = this.validationUtils.isMandatory(info);
        this.updateOtherLocationByEntityQuantity(entity, this.dataService, entity.Quantity??0);
        return result;
    }
}