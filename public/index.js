'use strict';

const resumeEndpoint = 'http://localhost:8080/resumes/'




function logIn() {
  console.log('test');
  fetch(resumeEndpoint)
    .then(response => {
      return response.json();

    })
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.error(err);
    });

}

$(_=> {
  logIn();  // Upon submitting an image
});
