define(["require", "jquery", "knockout", "pubsub"], function (require, $, ko, pubsub) {
  function AddTripFormModel() {
    var _this = this;
    _this.showForm = ko.observable(false);
    _this.name = ko.observable("");
    _this.description = ko.observable("");

    // subscribe to the search channel
    pubsub.subscribe("showAddTripForm", function () {
      _this.showForm(true);
    });

    _this.OnAddTrip = function () {
      pubsub.publish("showAddTripForm");
    };

    _this.OnSubmitForm = function (d, t) {
//
//      var formData = new FormData($(t)[0]);
      //Grab the form data
      var form = $(t.target).parents("form").first()[0];
      var nf = new FormData(form);
//      nf.append("test", "hassan");

      $.ajax({
        url: window.location.origin + "/addTrip",
        type: 'POST',
        data: nf,
        async: false,
        success: function (data) {
          alert(data);
        },
        cache: false,
        contentType: false,
        processData: false
      });

      return false;

    };

    _this.onCancel = function () {
      _this.showForm(false);
      pubsub.publish("hideAddTripForm");

    }
  }

  return new AddTripFormModel();
});