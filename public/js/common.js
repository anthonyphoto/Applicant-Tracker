'use strict';
 
/* Planning to move this global variable to database, 
so admin user can manage the list going forward */
const SKILL_LIST = ["HTML5", "CSS3", "Javascript", "jQuery", "C", "C++", "Java", "Redux", "Angular.js", "React.js", "Vue.js", "Express", "Node.js", "Python","Ruby", "C#.net", "MongoDB", "PostgreSQL", "Oracle", "MySQL", "Git", "Docker", "Mocha", "Chai", "Travis CI", "Perl"];

// retirm user info: username, firstName, lastName, admin, recruiter
function getAuthInfo(){
  const token = localStorage.getItem('authToken');
  if (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const obj = JSON.parse(window.atob(base64));
    return obj.user;   
  }
}

/* get page parameter */
function getUrlParams() {
    const url = window.location.href;
    return url.split(/=/)[1];
}

/* custom date format e.g. [ "Feb 09, 2019", "8:09 PM"] */
function customDate(dt){
  const dateOp = {month: 'short', day: '2-digit', year: 'numeric'};
  const timeOp = { hour: '2-digit', minute: '2-digit'};
  return [ dt.toLocaleString('en-US', dateOp), dt.toLocaleString('en-US', timeOp) ];
}

function handleLoginLink() {
  // $('#js-login-link, #js-login-link2').on('click', renderLoginPage);
  $('#js-top-link').on('click', '#js-login-link', renderLoginPage);
  $('#js-signup').on('click', '#js-login-link2', renderLoginPage);
}

function handleSignupLink() {
  $('#js-signup-link').on('click', function(event) {
    event.preventDefault();
    console.log('test');
    $('#js-login').addClass('hidden');
    $('#js-signup').removeClass('hidden');
    $(window).scrollTop(0); 
  });
}

function handleConfirm() {
  return new Promise(resolve => {
    $('#js-btn').on('click', '#js-btn-ok', function(){
      $('#js-popup-bg, #js-popup').addClass('hidden');
      
      const focus = $('#js-err-title').attr('value');
      if (focus) {
        $('#js-err-title').attr('value', '');
        $(`#${focus}`).focus();
      }
      resolve();
    });
  });
}



function handleCancel() {
  return new Promise(resolve => {
    $('#js-btn').on('click', '#js-btn-cancel', function(){
      $('#js-popup-bg, #js-popup').addClass('hidden');
      resolve();
    });
  });
}

function handleSignup() {
  $('#js-signup').on('submit', 'form', function(event) {
    event.preventDefault();
    const username = $(this).find('#username-s').val();
    const firstName = $(this).find('#fname-s').val();
    const lastName = $(this).find('#lname-s').val();
    const password = $(this).find('#password').val();
    const password2 = $(this).find('#password2').val();
    const usr = { username, firstName, lastName, password };

    if (password !== password2){
      const msg = { 
        title: "Error",
        message: "Two passwords must match. Please enter again.",
        color: "red",
        focus: "password"
      }
      console.error(msg);
      renderMessage(msg);
      return;
    }
    postSignup(usr);
  });
}

function handleLogin() {
  $('#js-login').on('submit', 'form', function(event) {
    event.preventDefault();
    const username = $(this).find('#username-l').val();
    const password = $(this).find('#password-l').val();

    const usr = { username, password };
    postLogin(usr);  
  });
}

function handleLogoutLink() {
  $('#js-top-link').on('click', '#js-logout-link', function(event) {
    event.preventDefault();
    clearSections();
    localStorage.removeItem('authToken');
    renderLogStatus();
    $('#js-list').removeClass('hidden');
    // $(window).scrollTop(0); 
    window.location.href = '../index.html';
  });
}

function handleResumeSubmitLink(){
  $('#js-main').on('click', 'button', function(event) {  
    event.preventDefault();

    if (!getAuthInfo()) {
      renderLoginPage();
      return;
    }
    /* reset the form */
    window.location.href = '../post.html';
    // initPostHtml();
    // renderPostResumePage();
  });
}

function parseCompany(target) {
  // get the number of companies + 1
  let compId = 1;
  while($(`#js-company${compId}`).length) {
    compId++;
  }

  // console.log(1, compId);
  const experience = [];
  for (let i = 0; i < compId; i++) {
    const company = $(target).find(`#company${i}`).val();
    const location = $(target).find(`#loc${i}`).val();
    const title = $(target).find(`#title${i}`).val();
    const desc = $(target).find(`#desc${i}`).val();
    const startYM = $(target).find(`#start${i}`).val();
    const endYM = $(target).find(`#end${i}`).val();
    /* Error handling */
    if (company) {
      // console.log("valid", company);
      let error, focus;
      if (!location) {
        error = `Location is missing in ${company}`;
        focus = `loc${i}`;
      }
      if (!title) {
        error = `Title is missing in ${company}`;
        focus = `title${i}`;
      }
      if (!desc) {
        error = `Description is missing in ${company}`;
        focus = `desc${i}`;
      }
      if (!endYM) {
        error = `End date is missing in ${company}`;
        focus = `end${i}`;
      }
      if (!startYM) {
        error = `Start date is missing in ${company}`;
        focus = `start${i}`;
      }
      if (startYM > endYM) {
        error = `Start data is later than End date</br>in ${company}`;
        focus = `start${i}`;
      }
      if (error) {
        const msg = { title: "Error", message: error, color: "red", focus };
        // debugger;
        return msg;
      }
    experience.push({ company, location, title, desc, startYM, endYM });
    }
  }
  console.log(experience);
  // Reorder companies by end date 
  experience.sort((x, y)=> {
    const first = x.endYM.split(/-/).reduce((a, b)=> a + b);
    const second = y.endYM.split(/-/).reduce((a, b)=> a + b);
    return second - first;
  });
  return experience;
}

function parseResumeForm(target) {
  const skill = [];
  const checkedList = $(target).find('#js-skill >> :checked');   
  // const tmpList = checkedList.map(a=>a.id);   // why not working??
  for (let i = 0; i < checkedList.length; i++) {
    skill.push($(`#js-skill >> #${checkedList[i].id}`).val()); 
  }
  
  const experience = parseCompany(target);

  const education = {
    school: $(target).find('#school').val(),
    location: $(target).find('#locs').val(),
    degree: $(target).find('#degree').val(),
    major: $(target).find('#major').val()
  }

  const resume = {
    firstName:  $(target).find('#fname').val(),
    lastName:   $(target).find('#lname').val(),
    email:      $(target).find('#email').val(),
    phone:      $(target).find('#phone').val(),
    linkedIn:   $(target).find('#linkedin').val(),
    location:   $(target).find('#loc').val(),
    title:      $(target).find('#title').val(),
    summary:    $(target).find('#summary').val(),
    skill,
    experience,
    education  
  }
  return resume;
}

function handleResumeSubmit(){
  $('#js-post').on('submit', '#js-new-submit', function(event){
    console.log('new posted');
    event.preventDefault();
    const resume = parseResumeForm(event.currentTarget);
    if (resume.experience.title) {
      console.error("Validation Error", resume.experience);
      renderMessage(resume.experience);
      return;
    }
    console.log(resume);
    postResume(resume);  
    // $('form#js-new-submit').trigger('reset');
  });
}

function handleAddCompany(){
  $('#js-post').on('click', '#js-add-company', function(event) {
    event.preventDefault();
    renderMoreCompany();
  });
}

function moveResumeById(id){
  getResume(id)
  .then(resume => {
    renderDetail(resume);
  });
}

function handleDetailLink(){
  $('ul#js-ul').on('click', 'a', function(event) {
    event.preventDefault();
    const id = $(this).attr('id');
    window.location.href = `../detail.html?id=${id}`;
    moveResumeById(id); 
  });
}

function handleBackToList(){
  $('#js-detail').on('click', '#js-go-list', function(event){
    event.preventDefault();
    window.location.href = '../index.html';
    // window.history.back();
    $(window).scrollTop( $("main").offset().top );  
//    renderPrevList();
  });
}

function handleDeleteClick(){
  $('#js-detail').on('click', '#js-delete', function(event){
    event.preventDefault();
    const id = $('#js-delete').attr('value');
    const msg = {
      title: 'Confirm',
      message: 'Are you sure to delete this item?',
      color: 'red',
      cancel: true
    }
    renderMessage(msg);

    handleConfirm()
      .then(_=>{
        deleteResume(id);      
      });

    handleCancel();
  });
}

function handleUpdateLinkClick(){
  $('#js-detail').on('click', '#js-update', function(event){
    event.preventDefault();
    const id = $('#js-update').attr('value');

    initPostHtml();
    $('#js-post').attr('value', id);  // store id in #js-post
    getResume(id)
     .then(resume => renderUpdatePage(resume));
  });
}

function handleUpdateSubmit(){
  $('#js-post').on('submit', '#js-update-submit', function(event){
    event.preventDefault();
    console.log('update requested');

    const resume = parseResumeForm(event.currentTarget);
    if (resume.experience.title) {
      console.error("Validation Error", resume.experience);
      renderMessage(resume.experience);
      return;
    }
    const id = $('#js-post').attr('value');
    console.log(resume);
    putResume(resume, id);  
  });
}

function handleAllListClick(){
  $('#js-list').on('click', '#js-all-list-link', function(event){
    event.preventDefault();
    window.location.href = '../index.html';
  });
}

function handleUserListClick(){
  $('#js-list').on('click', '#js-user-list-link', function(event){
    event.preventDefault();

      const usr = getAuthInfo();
    if (usr) {
        window.location.href = '../userlist.html';
    //   getResumeByUser(usr.username); // List resume list in landing page
    }
    else {
      renderError('Please log in first');
    }
  });
}

function handleStatusUpdate() {
  $('#js-detail').on('submit', 'form#js-status-update', function(event){
    event.preventDefault();
    const status = $(this).find('#status').val();
    const id = $('#js-btn-status').val();  
    putStatus(id, status);
  });
}  

function handlePostCancel() {
  $('#js-post').on('click', '#js-post-cancel', function(event){
    // debugger;
    event.preventDefault();
    renderPrevList();
    // console.log('cancel clicked');

  });
}

$(_=> {
  renderLogStatus();  // Show user's name if logged in
//  getResumes(); // List resume list in landing page
  handleDetailLink();  // Detect Detailed Resume link is clicked
  handleLoginLink();  // Detect Login link is clicked
  handleSignupLink();  // Detect Signup link is clicked
  handleSignup();
  handleLogin();
  handleConfirm();  // Detect message is confirmed
  handleLogoutLink();
  handleResumeSubmitLink(); // Detect Post Resume Link is clicked
  handleAddCompany(); // add more experience
  handleResumeSubmit();  // Upon resume submission
  handleBackToList();   // "Go back to List" link in Detail page
  handleDeleteClick();  // Upon delete request
  handleUpdateLinkClick();  // Upon Update link click
  handleUpdateSubmit(); 
  handleAllListClick();
  handleUserListClick();
  handleStatusUpdate(); // only admin can update this
  handlePostCancel();  // Upon Cancellation

});

