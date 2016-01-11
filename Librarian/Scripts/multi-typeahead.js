var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.directive("multiTypeahead", function () {
    return {
        restrict: 'E',
        scope: {
            labelText: '@',
            addNewText: '@',
            height: '@',
            mtLookup: '=',
            mtSelectedList: '=',
            mtAddNew: '=',
            mtAdd: '=',
            mtEdit: '=',
            mtRemove: '=',
            mtTextFor: '='
        },
        template: 
            '<div class="col-sm-3 form-group">' +
                '<label class="control-label">{{ labelText }}</label>' +
                '<input class="form-control typeahead" type="text" autocomplete="off" />' +
            '</div>' +
            '<div class="col-sm-3">' +
                '<label class="control-label">&nbsp;</label>' +
                '<ul class="list-unstyled list-striped boxy list-actionable">' + // style=height: 74px;
                    '<li class="li-actionable" ng-repeat="item in mtSelectedList">' +
                        '<span class="li-content">{{ mtTextFor(item) }}</span>' +
                        '<span class="actions">' +
                            '<a href="" ng-click="mtEdit(item)"><i class="glyphicon glyphicon-pencil"></i></a>' +
                            '<a href="" ng-click="mtRemove(item)"><i class="glyphicon glyphicon-remove"></i></a>' +
                        '</span>' +
                    '</li>' +
                '</ul>' +
            '</div>',
        link: function mtlink($scope, $element) {
            $element.find(".typeahead").typeahead({
                source: $scope.mtLookup,
                addItem: { id: -1, name: $scope.addNewText },
                minLength: 2,
                updater: function (item) {
                    if (item.id == -1)
                        $scope.mtAddNew();
                    else
                        $scope.mtAdd(item);
                }
            });

            $element.find("ul").css("height", $scope.height);
        }

    };
});