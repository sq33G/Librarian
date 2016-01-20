var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', ['ngRoute']);

Librarian.app

.factory("Item", function itemFactory() {
    return function Item() {
        this.ID = 0;
        this.MediaType = { value: 1, text: "Book" },
        this.Authors = [];
        this.Deleted = false;
        this.Reference = false;
        this.Restricted = false;
        this.Subjects = [];
        this.Location = { value: 91, text: 'New' };
        this.TimesCheckedOut = 0;
        this.CopiesCount = 0;
        this.EditionsCount = 0;
        this.Editions = [];
    };
})

.service("itemService", function ItemService($filter, $http, librarian) {
    var that = this;

    that.itemsUrl = $(".url-container.retrieve-model").val();
    that.singleItemUrl = $(".url-container.retrieve-single").val();

    that.addUrl = $(".url-container.create").val();
    that.deleteUrl = $(".url-container.delete").val();
    that.updateUrl = $(".url-container.update").val();

    that.pageSize = 200;

    var items = [];

    that.getItems = function ($scope) {
        if ($scope.gettingOrDone) return; //don't load while already loading
        $scope.gettingOrDone = true;
        $scope.items = $filter('filter')($scope.items, function (item) { return !item.$$specialFetch; });

        $http.post(that.itemsUrl,
            {
                pageSize: that.pageSize,
                pageNum: $scope.page++,
                filter: $scope.filter
            }).then(function (results) {
                $scope.items = $scope.items.concat(results.data.items);
                items = $scope.items;

                if (that.pageSize == results.data.items.length)
                    $scope.gettingOrDone = false;
                else
                    $scope.loadedAll = true;
            });

    };

    that.getItemByID = function (id, callback) {
        var itemsFound = $filter('filter')(items, '{ ID: ' + id + ' }', true);

        if (itemsFound.length == 1)
            callback(itemsFound[0]);

        $http.post(that.singleItemUrl, { id: id })
            .then(function (found) {
                items.push(angular.extend(found.data, { $$specialFetch: true }));
                callback(found.data);
            })
    };

    that.addItem = function (item, $scope) {
        $scope.items.push(angular.extend(item, { $$specialFetch: true }));
        $scope.$emit('items:modifiedOrFiltered');
    };

    that.modifyItem = function (item, $scope) {
        $scope.$emit('items:modifiedOrFiltered');
    };

    that.removeItem = function (itemID, $scope) {
        $scope.items = $filter('filter')($scope.items, '{ ID: !' + itemID + '}');
        $scope.$emit("items:modifiedOrFiltered")
    };
})

.config(function ($routeProvider) {
    var indexContentUrl = $(".url-container.index").val();
    var detailsUrl = $(".url-container.details").val();
    var createUrl = $(".url-container.create-view").val();
    var editUrl = $(".url-container.edit").val();

    $routeProvider
    .when('/Detail/:itemID', {
        templateUrl: detailsUrl,
        controller: 'itemDetailCtrl',
        controllerAs: 'ctrl'
    })
    .when('/Create', {
        templateUrl: createUrl,
        controller: 'itemCreateCtrl',
        controllerAs: 'ctrl'
    })
    .when('/Edit/:itemID', {
        templateUrl: editUrl,
        controller: 'itemEditCtrl',
        controllerAs: 'ctrl'
    })
    .when('/Delete/:itemID', {
        templateUrl: detailsUrl,
        controller: 'itemDeleteCtrl',
        controllerAs: 'ctrl'
    })
    .when('/', {
        templateUrl: indexContentUrl,
        controller: 'itemIndexCtrl',
        controllerAs: 'controller'
    })
    .otherwise({
        redirectTo: '/'
    });
})

.controller("itemCtrl", function ItemCtrl() {
})

.controller("itemIndexCtrl", function ItemIndexCtrl(itemService, $http, $scope) {
    var that = this;

    $scope.filter = '';
    $scope.items = [];
    $scope.page = 0;

    $scope.getMoreItems = function () {
        itemService.getItems($scope);
    };

    //initial set
    $scope.getMoreItems();

    $scope.filterItems = function (value, index, array) {
        return true; //server side filtering on

        //client-side filtering 
        //$scope.$emit("items:modifiedOrFiltered");
        //if (!$scope.filter || $scope.filter == '') return true;
        //var expected = $scope.filter.toLowerCase();
        //return value.Title.toLowerCase().indexOf(expected) !== -1 ||
        //       value.AuthorsDesc.toLowerCase().indexOf(expected) !== -1 ||
        //       value.Location.Text.toLowerCase().indexOf(expected) !== -1 ||
        //       value.CallNum.toLowerCase().indexOf(expected) !== -1;
    };

    $scope.sentFilter = '';
    $scope.setFilter = function () {
        if ($scope.sentFilter == $scope.filter)
            return;

        $scope.items = [];
        $scope.page = 0;
        $scope.loadedAll = $scope.gettingOrDone = false;
        itemService.getItems($scope);
        $scope.sentFilter = $scope.filter;
    };
})

.controller("itemDetailCtrl", function ItemDetailCtrl(itemService, $location, $scope, $filter, $routeParams) {
    var that = this;

    $scope.nullDate = new Date(1, 1, 1);

    $scope.primaryAction = 'Edit';
    itemService.getItemByID($routeParams.itemID, function (found) {
        $scope.item = found;
    });

    that.actionItem = function () {
        $location.path('/Edit/' + $routeParams.itemID);
    };

    that.close = function () {
        $location.path('/');
    };
})

.controller("itemDeleteCtrl", function ItemDeleteCtrl(itemService, $location, $scope, $filter, $routeParams) {
    var that = this;

    $scope.primaryAction = 'Delete';
    itemService.getItemByID($routeParams.itemID, function (found) {
        $scope.item = found;
    });

    that.actionItem = function () {
        var id = $routeParams.itemID;
        $http.post(itemService.deleteUrl,
                   { id: id })
             .then(function (deletedID) {
                 itemService.removeItem(deletedID.data);
                 that.close();
             })
    };

    that.close = function () {
        $location.path('/');
    };

})

.factory("ItemBaseCtrl", function (authorService, lookupService, ValidatingForm, librarian, $filter, $http) {
    return function ItemBaseCtrl($scope, formFinder, formDesc, formName, save) {
        var that = new ValidatingForm();

        that.form = formFinder;

        $scope.formDesc = formDesc;
        $scope.formName = formName;

        lookupService.init("Subject", "#subjectList");
        $scope.subjects = lookupService.lookup["Subject"];
        lookupService.init("Location", "#locationList");
        $scope.locations = lookupService.lookup["Location"];
        $scope.authors = authorService.lookup;

        $("#title").select();

        that.textForSubject = function (subj) {
            return subj.Text;
        };

        that.textForAuthor = function (author) {
            return ((author.FirstName && author.FirstName != "") ? author.FirstName + " " : "") +
                   author.LastName +
                   ((author.Suffix && author.Suffix != "") ? " " + author.Suffix : "");
        }

        that.addNewSubject = function () {
            lookupService.selectedMemberToUpdate = null;
            lookupService.selectedListToUpdate = $scope.item.Subjects;
            lookupService.displayAddLookup("Subject");
        };

        that.addNewAuthor = function () {
            authorService.displayAddAuthor($scope.item);
        };

        that.addNewLocation = function () {
            lookupService.selectedListToUpdate = null;
            lookupService.selectedMemberToUpdate = { item: $scope.item, member: 'Location' };
            lookupService.displayAddLookup("Location");
        }

        that.addSubject = function (subj) {
            if ($filter('filter')($scope.item.Subjects, { Value: subj.id }).length > 0)
                return;

            $scope.$apply(function () { $scope.item.Subjects.push({ Text: subj.name, Value: subj.id }); });
        };

        that.addAuthor = function (author) {
            if ($filter('filter')($scope.item.Authors, { ID: author.id }).length > 0)
                return;

            $http.post(authorService.getUrl, { id: author.id })
                 .then(function (fullAuthor) {
                     $scope.item.Authors.push(fullAuthor.data);
                 });
        };

        that.editSubject = function (subj) { lookupService.displayEditLookup("Subject", subj); };

        that.editAuthor = function (author) { authorService.displayEditAuthor(author); };

        that.removeSubject = function (subj) { librarian.removeByID($scope.item.Subjects, subj.Value, 'Value'); };

        that.removeAuthor = function (author) { librarian.removeByID($scope.item.Authors, author.ID); };

        that.save = function () {
            if (that.isValid())
                save();
        };

        return that;
    };
})

.controller("itemCreateCtrl", function ItemCreateCtrl(ItemBaseCtrl, $scope, itemService, $location, Item) {
    $scope.item = new Item();

    return new ItemBaseCtrl($scope,
                            function () { return $scope.itemCreateForm; },
                            "Add New Item",
                            "itemCreateForm",
                            function () {
                                $http.post(itemService.addUrl,
                                           $scope.item)
                                .then(function (addedItem) {
                                    itemService.addItem(addedItem);
                                    $location.path('/Detail/' + addedItem.ID);
                                });
                            });
})

.controller("itemEditCtrl", function ItemEditCtrl(ItemBaseCtrl, $scope, itemService, $location, $routeParams, lookupService) {
    var original;
    itemService.getItemByID($routeParams.itemID, function (found) {
        original = found;
        $scope.item = angular.copy(found);
        lookupService.selectedListToUpdate = $scope.item.Subjects;
    });

    return new ItemBaseCtrl($scope,
                            function () { return $scope.itemEditForm; },
                            "Edit Item",
                            "itemEditForm",
                            function () {
                                $http.post(itemService.updateUrl,
                                           $scope.item)
                                     .then(function (updatedItem) {
                                         angular.copy(updatedItem.data, original);
                                         $location.path('/Detail/' + $routeParams.itemID)
                                     });
                            });
});
