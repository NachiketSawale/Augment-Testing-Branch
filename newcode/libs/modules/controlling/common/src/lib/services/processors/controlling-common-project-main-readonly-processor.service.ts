
import {
    EntityReadonlyProcessorBase, ReadonlyFunctions
} from '@libs/basics/shared';
import {
    IControllingCommonProjectEntity
} from '../../model/entities/controlling-common-project-entity.interface';
import {ControllingCommonProjectComplete} from '../../model/controlling-common-project-main-complete.class';
import {ControllingCommonProjectDataService} from '../controlling-common-project-data.service';

/**
 * Procurement item entity readonly processor
 */
export class ControllingCommonProjectMainReadonlyProcessor<T extends IControllingCommonProjectEntity, U extends ControllingCommonProjectComplete> extends EntityReadonlyProcessorBase<T> {

    /**
     *The constructor
     */
    public constructor(protected dataService: ControllingCommonProjectDataService<T, U>) {
        super(dataService);
    }

    public generateReadonlyFunctions(): ReadonlyFunctions<T> {
        return {

        };
    }

}