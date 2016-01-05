var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.service("authorService", function AuthorService() {
    var that = this;

    that.lookup = angular.fromJson($("#authorList").val());

    that.createUrl = $(".url-container.create-author-view").val();
    that.addUrl = $(".url-container.create-author").val();
    that.editUrl = $(".url-container.edit-author").val();
    that.updateUrl = $(".url-container.update-author").val();

    that.createContent = $("#createAuthorPopupContainer .modal");
    that.editContent = $("#editAuthorPopupContainer .modal");

    that.createContent.add(that.editContent).on("shown.bs.modal", function () {
        $(this).find("#firstName").select();
    });

    var modalByUrl = {};
    modalByUrl[that.createUrl] = that.createContent;
    modalByUrl[that.editUrl] = that.editContent;

    that.setDefaultButton = function (url) {
        var defaultButton = modalByUrl[url].find("button.btn-primary");
        modalByUrl[url].find("input").keypress(function (eventArgs) {
            if (eventArgs.which == 13)
                defaultButton.click();
            if (eventArgs.which == 27)
                modalByUrl[url].modal('hide');
        });
    };

    that.authorData = {
        newAuthor: new Author(),
        currAuthor: {}
    };

    that.createAuthor = function (item) {
        that.createContent.modal();
        that.itemToUpdate = item;
        that.authorData.newAuthor = new Author();
    }

    that.displayEditAuthor = function (author) {
        if (author)
            that.authorData.currAuthor = author;
        //otherwise use currently set currAuthor

        that.editContent.modal();
    };
})

.controller("authorCreateCtrl", function AuthorCreateCtrl($scope, $http, authorService, validationService) {
    var that = this;
    that.form = function () { return $scope.createForm; };

    that.authorData = authorService.authorData;
    that.createAuthorUrl = authorService.createUrl;

    $scope.$on('$includeContentLoaded', function (eventArgs, src) {
        authorService.setDefaultButton(src);
    });

    that.invalidFieldClass = function (field) {
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        return validationService.invalidIconClass(that.form(), field);
    };

    that.addAuthor = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $http.post(authorService.addUrl,
                   that.authorData.newAuthor)
             .then(function (addedAuthor) {
                 addedAuthor.RowState = 'Added';
                 authorService.itemToUpdate.Authors.push(addedAuthor);
                 authorService.lookup.push({
                     name: (addedAuthor.FirstName == "" ? "" : addedAuthor.FirstName + " ") + addedAuthor.LastName + (addedAuthor.Suffix == "" ? "" : " " + addedAuthor.Suffix),
                     id: addedAuthor.ID
                 });
                 authorService.createContent.modal('hide');
                 that.form().$setPristine(); //not submitted for next use
             });
    };
})

.controller("authorEditCtrl", function AuthorEditCtrl(authorService, $http, $scope, validationService) {
    var that = this;
    that.form = function () { return $scope.editForm; };

    that.editAuthorUrl = authorService.editUrl;
    that.authorData = {};

    authorService.editContent.on("show.bs.modal", function () {
        that.authorData.currAuthor = angular.copy(authorService.authorData.currAuthor);
    });

    that.invalidFieldClass = function (field) {
        if (!field) return '';
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        if (!field) return '';
        return validationService.invalidIconClass(that.form(), field);
    };

    that.updateAuthor = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $http.post(authorService.updateUrl,
                   that.authorData.currAuthor)
             .then(function (updatedAuthor) {
                 angular.copy(updatedAuthor.data, authorService.authorData.currAuthor);
                 authorService.editContent.modal('hide');
                 that.form().$setPristine(); //not submitted for next use
                 authorService.displayAuthor();
             });
    };
});

function Author() {
    this.ID = 0;
    this.FirstName = "";
    this.LastName = "";
    this.Suffix = "";
    this.RowState = 0;
}
