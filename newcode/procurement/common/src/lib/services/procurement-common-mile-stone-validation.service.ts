/*
 * Copyright(c) RIB Software GmbH
 */

import {IPrcMilestoneEntity} from '../model/entities/prc-milestone-entity.interface';
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import {ProcurementCommonMileStoneDataService} from './procurement-common-mile-stone-data.service';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {inject} from '@angular/core';
import {BasicsSharedMilestoneTypeLookupService} from '@libs/basics/shared';
import {firstValueFrom} from 'rxjs';
import {isNull, isUndefined} from 'lodash';

export class ProcurementCommonMileStoneValidationService<T extends IPrcMilestoneEntity,PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends  BaseValidationService<T>{
    private readonly  milestoneTypeLookupService = inject(BasicsSharedMilestoneTypeLookupService);
    protected constructor(protected dataService : ProcurementCommonMileStoneDataService<T, PT, PU>){
        super();
    }
    protected generateValidationFunctions(): IValidationFunctions<T> {
        return {
            PrcMilestonetypeFk:this.validatePrcMilestonetypeFk,
            Milestone: this.validateMilestone,
            CommentText: this.validateCommentText
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
        return this.dataService;
    }

    protected validatePrcMilestonetypeFk(info: ValidationInfo<T>){
        if (info.value === 0 || info.value === null) {
            return new ValidationResult('cloud.common.emptyOrNullValueErrorMessage');
        }
        const validateRes = this.validateIsUnique(info);
        return validateRes;
    }

    protected validateMilestone(info:ValidationInfo<T>){
        const validateRes = this.validateIsMandatory(info);
        if(validateRes.valid) {
            return this.isValidDate(info);
        }
        return validateRes;
    }

    public async isValidDate(info: ValidationInfo<T>) {
        const dataSource = this.dataService.getList();
        const sourceDate: number | null = info.entity.Milestone? new Date(info.entity.Milestone).getTime() : null;
        const milestoneTypes = await firstValueFrom(this.milestoneTypeLookupService.getList());
        const sourceMilestone = milestoneTypes.find(e => e.Id === info.entity.PrcMilestonetypeFk);
        if(!isUndefined(sourceMilestone)) {
            const curSortOrder = parseInt(sourceMilestone.Sorting.toString());
            for (let i = 0; i < dataSource.length; i++) {
                const targetMilestone = milestoneTypes.find(e => e.Id === dataSource[i].PrcMilestonetypeFk);
                if (!isUndefined(targetMilestone)) {
                    const targetSortOrder = parseInt(targetMilestone.Sorting.toString());
                    if (dataSource[i].Milestone === null) {
                        continue;
                    }
                    const milestone = dataSource[i].Milestone !== null && dataSource[i].Milestone !== undefined ? new Date(dataSource[i].Milestone as string).getTime() : null;
                    if (!isNull(milestone) && !isUndefined(milestone)) {
                        if (!isNull(sourceDate)) {
                            if (sourceDate < milestone && curSortOrder > targetSortOrder) {
                                return new ValidationResult('procurement.common.milestone.milestoneDateSmallError');
                            } else if (sourceDate > milestone && curSortOrder < targetSortOrder) {
                                return new ValidationResult('procurement.common.milestone.milestoneDateBigError');
                            }
                        }
                    }
                }
            }
        }
        return new ValidationResult();
    }

    protected validateCommentText(info:ValidationInfo<T>){
        return this.validateIsMandatory(info);
    }
}