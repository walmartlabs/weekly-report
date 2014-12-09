var _ = require("lodash");
var $ = require("jquery");

$(function () {
  var expandResponse = function () {
    // Now expand first incomplete form
    var form = $(".form-body").first().parent();

    form.find(".form-header").click();
    $("html, body").scrollTop(0);
  };

  // Expand form and collapse all others
  $(".form-header").on("click", function () {
    var thisBody = $(this).next();

    $(".form-body").not(thisBody).removeClass("is-expanded");
    thisBody.toggleClass("is-expanded");
  });

  // On page load expand first unfinished response
  expandResponse();

  // Add blank text inputs when there are none
  $(".updating-list-item").bind("keyup", function () {
    var self = $(this);
    var ul = $(this).closest("ul");
    // Search and clear blanks

    var empties = ul.find("input:text").filter(function () {
      return this.value === "";
    });

    var clone = self.parent().clone(true);
    clone.children("input").val("");

    // If current is empty delete all others
    if (self.value === "") {
      empties.not(self).remove();
    // If no empties make one
    } else if (empties.length === 0) {
      clone.children("input").val("");
      ul.append(clone);
    // If more than one empty delete them
    } else if (empties.length > 1) {
      empties.not(self).remove();
      ul.append(clone);
    }

  });

  // Handle form submits
  $("form").submit(function (event) {
    var self = $(this);
    var data = $(this).serializeArray();

    // Remove empty entries in arrays
    data = _.chain(data)
      .reject(function (entry) {
        return _.isEmpty(entry.value);
      })
      .groupBy("name")
      .mapValues(function (value, key) {
        if (key === "accomplishments" || key === "blockers") {
          return _.map(value, function (entry) {
            return entry.value;
          });
        }

        return value[0].value;
      })
      .value();

    $.post("/responses", data)
      // Remove from DOM and show DONE message
      .done(function () {
        self.find(".status").addClass("is-done")
          .parent().addClass("is-done");
        self.find(".form-body").remove();

        // Expand next response
        expandResponse();
      })
      // Display error message
      .fail(function () {
        self.find(".submit-error").addClass("show");
      });

    event.preventDefault();
  });
});
