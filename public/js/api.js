'use strict';



// Sign up new user
function postSignup(usr) {
  fetch('/api/users', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(usr)
  })
  .then(response => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  })
  .then(data => {
    console.log(data);
    const msg = {
      title: data.firstName,
      message: `You are successfully registered.  Please log in to proceed`,
      color: 'green'
    }
    $('#js-signup').addClass('hidden');
    $('#js-login').removeClass('hidden');
    renderMessage(msg);
  })
  .catch(err=> {
    console.error(err);
    renderError(err);
  });
}

// Login and get JWT 
function postLogin(usr) {
  fetch('/api/auth/login', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(usr)    
  })
  .then(response => {
    // console.log(1, response);
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  })
  .then(data => {
    // console.log(data.authToken);
    localStorage.setItem('authToken', data.authToken);
    $('#js-login').addClass('hidden');
    
    window.location.href = '../userlist.html';
    // renderLogStatus();
    // getResumeByUser(usr.username);
  })
  .catch(err => {
    console.error(err);
    renderError(err);
  });
}

// Refresh token (logged user)
function postRefresh() {
  const authToken = localStorage.getItem('authToken');
  // console.log(1, authToken);
  fetch('/api/auth/refresh', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    method: 'POST',
  })
  .then(response => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  })
  .then(data => {
    console.log(data.authToken);
  })
  .catch(err => {
    console.error(err);
    renderError(err);
  });
}

// Post a resume (logged user)
function postResume(resume) {
  const authToken = localStorage.getItem('authToken');
  console.log(1, authToken);
  fetch('/resumes', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    method: 'POST',
    body: JSON.stringify(resume)
  })
  .then(response => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  })
  .then(data => {
    console.log(data);
    const msg = {
      title: "Thank you!",
      message: `Your resume is succefully submitted.`,
      color: 'green'
    }
    window.location.href = `../detail.html?id=${data._id}`;
    // renderMessage(msg);
    // $('form#js-new-submit').trigger('reset');
    moveResumeById(data._id);
  })
  .catch(err => {
    console.error(err);
    renderError(err);
  });
}

// Modify a resume (owner access)
function putResume(resume, id) {
  const authToken = localStorage.getItem('authToken');
  fetch('/resumes/' + id, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    method: 'PUT',
    body: JSON.stringify(resume)
  })
  .then(response => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  })
  .then(data => {
    console.log(data);
    const msg = {
      title: "Thank you!",
      message: `Your resume is successfully updated.`,
      color: 'green'
    }
    // renderMessage(msg);
    $('form').trigger('reset');
    console.log(1, 'here');
    moveResumeById(data._id);
  })
  .catch(err => {
    console.error(err);
    renderError(err);
  });
}

// returns array of all resumes (all access)
function getResumes() {
    fetch('/resumes')
      .then(response => {
        // console.log("get /resumes", response);
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then(data => {
        //  console.log(1, data);
        renderList(data, 'all');
      })
      .catch(err => {
        console.error(err);
        renderError(err);
      });
}

/* parameter: username */
function getResumeByUser(username) {
const authToken = localStorage.getItem('authToken');
fetch('/resumes/user/' + username, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      method: 'GET'
    })
    .then(response => {
      // console.log("get /resumes", response);
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(data => {
      //  console.log(1, data);
      renderList(data, 'user');
    })
    .catch(err => {
      console.error(err);
      renderError(err);
    });
}

// Get a resume by resume id (all access)
function getResume(id) {
  const authToken = localStorage.getItem('authToken');
  return new Promise(resolve => {
    fetch('/resumes/' + id, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      method: 'GET'
    })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(data => {
      return resolve(data);
    })
    .catch(err => {
      console.error(err);
      renderError(err);
    });
  });
}

// Delete resume (owner access)
function deleteResume(id){
  const authToken = localStorage.getItem('authToken');
  fetch('/resumes/' + id, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      console.log("Deleted");
      renderMessage({ title: 'Success', message: 'Your resume is successfully deleted.'});
      handleConfirm()
      .then(resolve => renderPrevList());
      return;
    }
    throw new Error(response.statusText);
    
  })
  .catch(err => {
    console.error(err);
    renderError(err);
  });
}

// Change the status (Only admin)
function putStatus(id, status) {
  const authToken = localStorage.getItem('authToken');
  fetch('/resumes/status/' + id, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    method: 'PUT',
    body: JSON.stringify({status})
  })
  .then(response => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  })
  .then(data => {
    renderMessage({ title: 'Success', message: `Application status is set to ${status}.`});
    console.log(data);
  })
  .catch(err => {
    console.error(err);
    renderError(err);
  });
}

