import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import { FormworkTypeEntity } from '../model/entities/formwork-type-entity.class';

@Injectable({
    providedIn: 'root'
})
export class FormworkTypeFormBehavior implements IEntityContainerBehavior<IFormContainerLink<FormworkTypeEntity>, FormworkTypeEntity> {
    public onCreate() {
    }
}