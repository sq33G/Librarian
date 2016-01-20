var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.directive("singleTypeahead", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            addNewText: '@',
            stLookup: '=',
            stAddNew: '='
        },
        //
        //    '<input single-typeahead class="form-control* typeahead*" type="text" *autocomplete="off"* ng-model="item.location" />',
        link: function mtlink($scope, $element, $attr, ngModel) {
            $element.addClass("typeahead").attr("autocomplete","off");

            $element.find(".typeahead").typeahead({
                source: $scope.stLookup,
                addItem: { id: -1, name: $scope.addNewText },
                minLength: 2,
                updater: function (item, e) {
                    if (item.id == -1)
                        $scope.stAddNew();
                    else {
                        ngModel.$setViewValue(angular.copy(item), e);
                    }
                }
            });

            ngModel.$render = function () {
                $element.val(ngModel.$viewValue ? ngModel.$viewValue.name : '');
            };
        }

    };
});