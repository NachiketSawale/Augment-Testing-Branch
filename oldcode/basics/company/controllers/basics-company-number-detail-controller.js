(function(angular) {

  'use strict';
  angular.module('basics.company').controller('basicsCompanyNumberDetailController', ['$scope', 'basicsCompanyNumberService', 'platformDetailControllerService', 'basicCompanyNumberValidationService', 'basicsCompanyNumberUIStandardServiceForForm', 'basicsCompanyTranslationService', 'platformRuntimeDataService', 'BasicsCommonDateProcessor',

    function($scope, basicsCompanyNumberService, platformDetailControllerService, basicCompanyNumberValidationService, basicsCompanyNumberUIStandardServiceForForm, basicsUnitTranslationService, platformRuntimeDataService, BasicsCommonDateProcessor) {

      platformDetailControllerService.initDetailController($scope, basicsCompanyNumberService, basicCompanyNumberValidationService, basicsCompanyNumberUIStandardServiceForForm, basicsUnitTranslationService);

      $scope.reloadNumberSequenceData = function reloadNumberSequenceData(numberEntity, id) {
        var sequenceId = id ? id : numberEntity ? numberEntity.NumberSequenceFk : null;
        var numberSequenceIsReadonly = false;
        $scope.currentItem = numberEntity;
        if (sequenceId === null || sequenceId === undefined) {
          return;
        }
        basicsCompanyNumberService.getSequenceById(sequenceId).then(function reloadNumberSequenceData(result) {
          var sequence = result.data;
          new BasicsCommonDateProcessor(['PeriodDate']).processItem(sequence);
          $scope.currentItem = $scope.currentItem ? $scope.currentItem : {};
          $scope.currentItem.IncrementValue = sequence.IncrementValue;
          $scope.currentItem.LastValue = sequence.LastValue;
          $scope.currentItem.StartValue = sequence.StartValue;
          $scope.currentItem.EndValue = sequence.EndValue;
          $scope.currentItem.PeriodDate = sequence.PeriodDate;
        });
      };

      var changeHandler = function(e, entity) {
        $scope.reloadNumberSequenceData(entity);
      };

      basicsCompanyNumberService.registerSelectionChanged(changeHandler);

      $scope.$on('$$destroy', function() {
        basicsCompanyNumberService.unregisterSelectionChanged(changeHandler);
      });
    }
  ]);
})(angular);