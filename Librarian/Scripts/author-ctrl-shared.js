var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app
.factory("Author", function authorFactory() {
        return function Author() {
            this.ID = 0;
            this.FirstName = "";
            this.LastName = "";
            this.Suffix = "";
            this.RowState = 0;
        };
    })

.service("authorService", function AuthorService($http, $filter, $rootScope, dialogService, Author) {
    var that = this;

    that.lookup = angular.fromJson($("#authorList").val());

    that.getUrl = $(".url-container.get-author").val();
    that.addUrl = $(".url-container.create-author").val();
    that.updateUrl = $(".url-container.update-author").val();

    that.authorData = {
        newAuthor: new Author(),
        currAuthor: {}
    };

    var $addScope;
    that.registerAddItemScope = function ($scope) {
        $addScope = $scope;
    };

    that.displayAddAuthor = function (item) {
        dialogService.showDialog("#createAuthorPopupContainer");
        that.itemToUpdate = item;
        $addScope.$apply(function () {
            that.authorData.newAuthor = new Author();
        });
    }

    that.displayEditAuthor = function (author) {
        if (author)
            that.authorData.currAuthor = author;
        //otherwise use currently set currAuthor

        dialogService.showDialog("#editAuthorPopupContainer");
    };
})

.controller("authorCreateCtrl", function AuthorCreateCtrl($scope, $http, authorService, ValidatingForm) {
    var that = new ValidatingForm();

    that.authorData = authorService.authorData;

    authorService.registerAddItemScope($scope);

    that.addAuthor = function () {
        if (!that.isValid())
            return;

        $scope.notifyDialogSending();
        $http.post(authorService.addUrl,
                   that.authorData.newAuthor)
             .then(function (addedAuthor) {
                 $scope.notifyDialogSendComplete();
                 var newAuthor = addedAuthor.data;
                 newAuthor.RowState = 1; // 'Added';
                 authorService.itemToUpdate.Authors.push(newAuthor);
                 authorService.lookup.push({
                     name: (newAuthor.FirstName == "" ? "" : newAuthor.FirstName + " ") + newAuthor.LastName + (newAuthor.Suffix == "" ? "" : " " + newAuthor.Suffix),
                     id: newAuthor.ID
                 });
                 $scope.hideDialog();
                 that.form().$setPristine(); //not submitted for next use
             });
    };

    return that;
})

.controller("authorEditCtrl", function AuthorEditCtrl(authorService, $http, $scope, ValidatingForm) {
    var that = this;
    that.form = function () { return $scope.editForm; };

    that.editAuthorUrl = authorService.editUrl;
    that.authorData = {};

    that.dialogShown = function () {
        that.authorData.currAuthor = angular.copy(authorService.authorData.currAuthor);
    };

    that.updateAuthor = function () {
        if (!that.isValid())
            return;

        $http.post(authorService.updateUrl,
                   that.authorData.currAuthor)
             .then(function (updatedAuthor) {
                 angular.copy(updatedAuthor.data, authorService.authorData.currAuthor);
                 $scope.hideDialog();
                 that.form().$setPristine(); //not submitted for next use
             });
    };
});