(function ($, drupalSettings, Drupal) {
  Drupal.behaviors.foia_ui_validation = {
    attach: function attach() {
      jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
      });

      /**
       * Custom validation methods
       */
      jQuery.validator.addMethod("lessThanEqualSum", function(value, element, params) {
        var sum = 0;
        params.forEach(function(param) {
          sum += Number($(param).val());
        });
        return this.optional(element) || value <= sum;
      }, "Must equal less than equal a sum of other fields.");

      /**
       * Form validation call
       */
      $('#node-annual-foia-report-data-form').validate({

        // Display aggregate field validation popup message.
        invalidHandler: function(event, validator) {
          var errors = validator.numberOfInvalids();
          if (errors) {
            var message = errors == 1 ? '1 field is invalid and has been highlighted.' : '' + errors + ' fields are invalid and have been highlighted.';
            alert(message);
          }
        },

        // Highlight vertical tabs that contain invalid fields
        highlight: function(element, errorClass, validClass) {
          $(element).addClass(errorClass).removeClass(validClass);
          var containerPaneID = $(element).parents("details.vertical-tabs__pane").last().attr('id');
          var parentVerticalTabMenuItem = $(element).parents(".vertical-tabs").last().children('.vertical-tabs__menu').find('a[href="#' + containerPaneID + '"]').parent();
          if(parentVerticalTabMenuItem.attr('data-invalid')) {
            if(parentVerticalTabMenuItemDataInvalid.indexOf($(element).attr('id')) === -1) {
              parentVerticalTabMenuItemDataInvalid = parentVerticalTabMenuItem.attr('data-invalid') + ',' + $(element).attr('id');
            }
          }
          else {
            parentVerticalTabMenuItemDataInvalid = $(element).attr('id');
          }
          parentVerticalTabMenuItem.attr('data-invalid', parentVerticalTabMenuItemDataInvalid);
          parentVerticalTabMenuItem.addClass('has-validation-error');
        },

        // Remove highlighting from vertical tabs when field validation passes
        unhighlight: function(element, errorClass, validClass) {
          $(element).removeClass(errorClass).addClass(validClass);
          var containerPaneID = $(element).parents("details.vertical-tabs__pane").last().attr('id');
          var parentVerticalTabMenuItem = $(element).parents(".vertical-tabs").last().children('.vertical-tabs__menu').find('a[href="#' + containerPaneID + '"]').parent();
          parentVerticalTabMenuItemDataInvalid = parentVerticalTabMenuItem.attr('data-invalid');
          if( parentVerticalTabMenuItemDataInvalid && parentVerticalTabMenuItemDataInvalid.indexOf($(element).attr('id')) > -1) {
            var dataInvalidArr = parentVerticalTabMenuItem.attr('data-invalid').split(',');
            var index = dataInvalidArr.indexOf($(element).attr('id'));
            if (index > -1) {
              dataInvalidArr.splice(index, 1);
            }
            var dataInvalid = dataInvalidArr.join();
            parentVerticalTabMenuItem.attr('data-invalid', dataInvalid);
            parentVerticalTabMenuItem.removeClass('has-validation-error');
          }
        },

        rules: {
          // V.B.(1) Agency Overall Number of Full Denials Based on Exemptions
          "field_foia_requests_vb1[0][subform][field_full_denials_ex][0][value]": {
            lessThanEqualSum: [
              "#edit-field-overall-vb3-ex-1-0-value",
              "#edit-field-overall-vb3-ex-2-0-value",
              "#edit-field-overall-vb3-ex-3-0-value",
              "#edit-field-overall-vb3-ex-4-0-value",
              "#edit-field-overall-vb3-ex-5-0-value",
              "#edit-field-overall-vb3-ex-6-0-value",
              "#edit-field-overall-vb3-ex-7-a-0-value",
              "#edit-field-overall-vb3-ex-7-b-0-value",
              "#edit-field-overall-vb3-ex-7-c-0-value",
              "#edit-field-overall-vb3-ex-7-d-0-value",
              "#edit-field-overall-vb3-ex-7-e-0-value",
              "#edit-field-overall-vb3-ex-7-f-0-value",
              "#edit-field-overall-vb3-ex-8-0-value",
              "#edit-field-overall-vb3-ex-9-0-value"
            ]
          },
          // V.B.(1) Agency Overall Other*
          "field_overall_vb1_oth[0][value]": {
            equalTo: "#edit-field-overall-vb2-total-0-value"
          },
          // VI.A. Agency Overall Number of Appeals Processed in Fiscal Year
          "field_overall_via_app_proc_yr[0][value]": {
            equalTo: "#edit-field-overall-vib-total-0-value"
          }
        },

        messages: {
          "field_foia_requests_vb1[0][subform][field_full_denials_ex][0][value]": {
            lessThanEqualSum: "This field should be no more than the sum of the fields overall_vb3_ex_1 through overall_vb3_ex_9."
          },
          // V.B.(1) Agency Overall Other*
          "field_overall_vb1_oth[0][value]": {
            equalTo: "Must match V.B.(2) Agency Overall Total"
          },
          // VI.A. Agency Overall Number of Appeals Processed in Fiscal Year
          "field_overall_via_app_proc_yr[0][value]": {
            equalTo: "Must match VI.B. Agency Overall Total"
          }
        }
      });

      // Disable Submit button until Validate button is clicked.
      $('input#edit-submit').prop('disabled', true);
      $('input#edit-validate-button').on('click', function(event) {
        $('#node-annual-foia-report-data-form').valid();
        $('input#edit-submit').prop('disabled', false);
        event.preventDefault();
      });

      /**
       * Validation rules
       */

      // V.A. FOIA Requests V. A.
      $( "#edit-field-foia-requests-va-0-subform-field-req-processed-yr-0-value").rules( "add", {
        required: true,
        equalTo: "#edit-field-foia-requests-vb1-0-subform-field-total-0-value",
        messages: {
          equalTo: "Must match corresponding agency V.B.(1) Total"
        }
      });

      // V.A. Agency Overall Number of Requests Processed in Fiscal Year
      $( "#edit-field-overall-req-processed-yr-0-value").rules( "add", {
        required: true,
        equalTo: "#edit-field-overall-vb1-total-0-value",
        messages: {
          equalTo: "Must match V.B.(1) Agency Overall Total"
        }
      });
    }
  };

})(jQuery, drupalSettings, Drupal);
