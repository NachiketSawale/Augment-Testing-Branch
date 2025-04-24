/*
 * Copyright(c) RIB Software GmbH
 */
import {Component, inject} from '@angular/core';
import {UpdateMaterialPriceWizardService} from '../../../service/wizards/update-material-price-wizard.service';
import {BasicsMaterialUpdatePriceWizardOption} from '../../../model/enums/update-material-price-wizard-option.enum';
import {BasicsMaterialMaterialCatalogDataService} from '../../../material-catalog/basics-material-material-catalog-data.service';
import {BasicsMaterialRecordDataService} from '../../../material/basics-material-record-data.service';
import {IUpdatePriceDataComplete} from '../../../model/entities/basics-material-update-price-entity.interface';
import {getMultiStepDialogDataToken} from '@libs/ui/common';

@Component({
  selector: 'basics-material-update-material-price-step1',
  templateUrl: './update-material-price-step1.component.html',
  styleUrl: './update-material-price-step1.component.scss'
})
export class UpdateMaterialPriceStep1Component {
  private readonly updateMaterialPriceWizardService = inject(UpdateMaterialPriceWizardService);
  private readonly currentCatalog = inject(BasicsMaterialMaterialCatalogDataService).getSelectedEntity();
  private readonly materialDateService = inject(BasicsMaterialRecordDataService);
  private readonly selectedMaterials = this.materialDateService.getSelection();
  private readonly materialList = this.materialDateService.getList();
  private readonly dialogData = inject(getMultiStepDialogDataToken<IUpdatePriceDataComplete>());
  protected selectedOption: number = BasicsMaterialUpdatePriceWizardOption.HighlightedMaterial;
  protected isNotFromSameCatalog: boolean = false;
  protected catalogIsInternet: boolean = false;
  protected scopeOptions = [
    {
      value: BasicsMaterialUpdatePriceWizardOption.HighlightedMaterial,
      label: 'basics.material.updatePriceWizard.highlightedMaterial',
      isActive: this.selectedMaterials.length > 0
    },
    {
      value: BasicsMaterialUpdatePriceWizardOption.MaterialResultSet,
      label: 'basics.material.updatePriceWizard.materialResultSet',
      isActive: this.materialList.length > 0
    },
    {
      value: BasicsMaterialUpdatePriceWizardOption.HighlightedMaterialCatalog,
      label: 'basics.material.updatePriceWizard.highlightedCatalog',
      isActive: !!this.currentCatalog
    }
  ];

  public constructor() {
    this.selectedOption = this.dialogData.dataItem.basicOption;
    this.changeScopeOption();
  }

  public changeScopeOption() {
    this.dialogData.dataItem.basicOption = this.selectedOption;
    if (this.selectedOption === BasicsMaterialUpdatePriceWizardOption.HighlightedMaterial || this.selectedOption === BasicsMaterialUpdatePriceWizardOption.MaterialResultSet) {
      this.isNotFromSameCatalog = !this.updateMaterialPriceWizardService.IsMaterialsInSameCatalog(this.selectedOption);
      if (!this.isNotFromSameCatalog) {
        this.catalogIsInternet = this.updateMaterialPriceWizardService.checkIfInternetCatalog(this.selectedOption);
      }
    } else if (this.selectedOption === BasicsMaterialUpdatePriceWizardOption.HighlightedMaterialCatalog && this.currentCatalog) {
      this.isNotFromSameCatalog = false;
      this.catalogIsInternet = this.currentCatalog.IsInternetCatalog;
    }
  }

  /* todo next button require control by form
  public nextBtnDisabled() {
    return this.catalogIsInternet || this.isNotFromSameCatalog;
  }
  */

}
