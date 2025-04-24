/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IInitializationContext} from '@libs/platform/common';
import {ProjectMaterialUpdatePriceWizardService} from '../../services/wizard/project-material-update-price-wizard.service';

export class ProjectMaterialWizard{
    public updateMaterialPrice(context: IInitializationContext){
        const service = context.injector.get(ProjectMaterialUpdatePriceWizardService);
        service.showUpdatePriceDialog();
    }
}