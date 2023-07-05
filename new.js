function generateListingHTML(listing) {
    const { Name, Age, "Mobile No": mobile, "Email ID": email, Salary, Occupation } = listing;
    return `
      <tr class="record">
        <td></td>
        <td>${Name}</td>
        <td>${Age}</td>
        <td>${mobile}</td>
        <td>${email}</td>
        <td>${Salary}</td>
        <td>${Occupation}</td>
        <td>
          <button type="button" class="btn edit-button" data-toggle="modal" data-target="#editModal" data-id="${mobile}" data-name="${Name}" data-age="${Age}" data-email="${email}" data-salary="${Salary}" data-occupation="${Occupation}">
            Edit
          </button>
        </td>
        <td>
          <button class="btn btn-danger delete-button" onclick="handleDelete('${Name}', '${Age}', '${mobile}', '${email}', '${Salary}', '${Occupation}')">
            Delete
          </button>
        </td>
      </tr>`;}
function generateTableHTML(data) {
    const tableHTML = `
      <table id="data-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Age</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Occupation</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(generateListingHTML).join('')}
        </tbody>
      </table>`;
  
    return tableHTML;}
    const ListOfItems = async () => {
        try {
          const response = await fetch("https://prod-09.westus.logic.azure.com:443/workflows/63a4cba45ebe4669a60686011c165c14/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=okxxcu6UHpmEQGDxuRcSnHf4ibqFMyD10gLrCMw62rs");
          const myJson = await response.json();
      
          if (myJson.payload && Array.isArray(myJson.payload)) {
            const tableHTML = generateTableHTML(myJson.payload);
            document.getElementById("data").innerHTML = tableHTML;
          } else {
            console.error("Invalid payload data in the response.");
          }
        } catch (error) {
          console.error(error);
        }
      };
      
      function handleDataSubmit() {
        document.getElementById("loadingIndicator").style.display = "block";
        const name = $("#name").val();
        const age = $("#age").val();
        const mobile = $("#mobile").val();
        const email = $("#email").val();
        const salary = $("#salary").val();
        const occupation = $("#occupation").val();
      
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
      
        const raw = JSON.stringify({
          name,
          age,
          mobile,
          email,
          salary,
          occupation,
        });
      
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
      
        fetch("https://prod-30.westus.logic.azure.com:443/workflows/a3257552e2bc40629fb68ec2bcb66ce7/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QTemPOpSr0uFQ7moRGuCsepWOZoy1QKyYBXxfe3Ap90", requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not OK");
            }
            return response.json();
          })
          .then((result) => {
            if (result.status === 200) {
              document.getElementById("data").innerHTML = "";
            }
      
            // Hide the loading indicator after the operation is complete
            document.getElementById("loadingIndicator").style.display = "none";
      
            // Close the modal and reset the form
            $("#myModal").modal("hide");
            $("#myForm")[0].reset();
      
            ListOfItems();
          })
          .catch((error) => {
            // Display an error message to the user
            console.log("Error:", error);
            alert("An error occurred. Please try again later.");
      
            // Hide the loading indicator in case of an error
            document.getElementById("loadingIndicator").style.display = "none";
          });}

          function handleDelete(name, age, mobile, email, salary, occupation) {
            // Open the delete modal
            $("#deleteModal").modal("show");
          
            // Handle the confirm delete action
            $("#confirmDeleteButton").click(function() {
              // Show the loading indicator
              $("#loadingIndicator").show();
          
              let data = {
                name,
                age,
                mobile,
                email,
                salary,
                occupation
              };
          
              let requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
              };
          
              fetch("https://prod-106.westus.logic.azure.com:443/workflows/d90538b78ab642fe94ed960e62e0595c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ps1EdF9auNHNgqDeHaGhTBFlFNH5JcKPtHTWDlVk8UQ", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  if (result.status === 200) {
                    // Delete succeeded, update the table
                    document.getElementById("data").innerHTML = "";
                    ListOfItems();
                  } else {
                    alert("Error deleting the record.");
                  }
                })
                .catch((error) => console.log("error", error))
                .finally(() => {
                  // Hide the loading indicator and close the delete modal
                  $("#loadingIndicator").hide();
                  $("#deleteModal").modal("hide");
                });
            });
          }
          
          ListOfItems();          
          
          function handleDataUpdate(name, age, mobile, email, salary, occupation) {
            document.getElementById("loadingIndicator").style.display = "block";
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
          
            let raw = JSON.stringify({
              name,
              age,
              mobile,
              email,
              salary,
              occupation
            });
          
            let requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };
          
            fetch("https://prod-50.westus.logic.azure.com:443/workflows/f932d7c0173f4fd5bf19e7b1049c3f55/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NW0ViogQYJyLS94k1R3MO3BoFx4WkyRtwEIFi7DKztc", requestOptions)
              .then((response) => response.json())
              .then((result) => {
                if (result.status === 200) {
                  document.getElementById("data").innerHTML = "";
                 // Hide the loading indicator and close the delete modal
                    $("#loadingIndicator").hide();
                  ListOfItems();
                } else {
                  alert("Failed to update data");
                }
              })
              .catch((error) => console.log("error", error));
          }
          
          var mobileno;
          
          // Edit Button click event listener
          $(document).on("click", ".edit-button", function() {
            mobileno = $(this).data("id");
            var name = $(this).data("name");
            var age = $(this).data("age");
            var email = $(this).data("email");
            var salary = $(this).data("salary");
            var occupation = $(this).data("occupation");
          
            // Prefill the form inputs
            $("#editName").val(name);
            $("#editAge").val(age);
            $("#editEmail").val(email);
            $("#editSalary").val(salary);
            $("#editOccupation").val(occupation);
          
            // Attach input event listener to the form fields
            $("#editAge, #editSalary, #editEmail").on("input", validateInput);
          
            function validateInput() {
              let field = $(this);
              let value = field.val();
              let id = field.attr("id");
              let warning = $("#" + id + "Warning");
          
              if (id === "editAge" && isNaN(value)) {
                field.addClass("is-invalid");
                warning.text("Please enter a valid number for age.").show();
              } else if (id === "editSalary" && isNaN(value)) {
                field.addClass("is-invalid");
                warning.text("Please enter a valid number for salary.").show();
              } else if (id === "editEmail") {
                let emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                if (!emailPattern.test(value)) {
                  field.addClass("is-invalid");
                  warning.text("Please enter a valid email address.").show();
                } else {
                  field.removeClass("is-invalid");
                  warning.hide();
                }
              } else {
                field.removeClass("is-invalid");
                warning.hide();
              }
            }
          
            // Show the modal
            $("#editModal").modal("show");
          
            $("#editForm").submit(function(event) {
              event.preventDefault();
          
              var name = $("#editName").val();
              var age = $("#editAge").val();
              var email = $("#editEmail").val();
              var salary = $("#editSalary").val();
              var occupation = $("#editOccupation").val();
              var mobile = mobileno.toString();
          
              // Perform update using the API endpoint
              handleDataUpdate(name, age, mobile, email, salary, occupation);
              // Close the modal and reset the form
              $("#editModal").modal("hide");
              $("#editForm")[0].reset();
            });
          });
          $(document).ready(function() {
            // Open the form when the button is clicked
            $("#openFormButton").click(function() {
              $("#myModal").modal('show');
            });
          
            // Function to reset the form
            function resetForm() {
              $("#myForm")[0].reset();
              $(".invalid-feedback").hide(); // Hide all error messages
            }
          
            // Attach input event listeners to the form fields
            $("#age, #salary, #mobile, #email").on("input", validateInput);
          
            function validateInput() {
              let field = $(this);
              let value = field.val();
              let id = field.attr("id");
              let warning = $("#" + id + "Warning");
          
              if (id === "age" && isNaN(value)) {
                field.addClass("is-invalid");
                warning.text("Please enter a valid number for age.").show();
              } else if (id === "salary" && isNaN(value)) {
                field.addClass("is-invalid");
                warning.text("Please enter a valid number for salary.").show();
              } else if (id === "mobile") {
                let isValid = /^\d{10}$/.test(value) && /^[6-9]/.test(value);
                if (!isValid) {
                  if (/^\d{10}$/.test(value)) {
                    warning.text("Please enter an Indian mobile number (Begins with 6, 7, 8, or 9).").show();
                  } else {
                    warning.text("Please enter a 10-digit mobile number.").show();
                  }
                  field.addClass("is-invalid");
                } else {
                  field.removeClass("is-invalid");
                  warning.hide();
                }
              } else if (id === "email") {
                let emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                if (!emailPattern.test(value)) {
                  field.addClass("is-invalid");
                  warning.text("Please enter a valid email address.").show();
                } else {
                  field.removeClass("is-invalid");
                  warning.hide();
                }
              } else {
                field.removeClass("is-invalid");
                warning.hide();
              }
            }
          
            $("#myForm").submit(function(event) {
              event.preventDefault(); // Prevent form submission
          
              // Get form values
              var name = $("#name").val();
              var age = $("#age").val();
              var mobile = $("#mobile").val();
              var email = $("#email").val();
              var salary = $("#salary").val();
              var occupation = $("#occupation").val();
          
              // Process the form data (e.g., send it to the server)
              handleDataSubmit();
              // Close the form
              $("#myModal").modal('hide');
              resetForm();
            });
          
            // Handle form reset
            $("#myModal").on("hidden.bs.modal", resetForm);
          });
                        
          
      
  
