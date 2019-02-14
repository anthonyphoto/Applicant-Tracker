'use strict';

/* hide all open sections */
function clearSections(){
    $('#js-list, #js-login, #js-signup, #js-post, #js-detail, #js-admin-form').addClass('hidden');
}

function renderLoginPage(event){
    if (event) event.preventDefault();
    // clearSections();
    $('#js-signup').addClass('hidden');
    $('#js-login').removeClass('hidden');

    // $(window).scrollTop( $("#js-rpt").offset().top ); /* Page scroll to result page */
    $(window).scrollTop(0); 
}

function renderMessage(msg){
    $('#js-popup-bg, #js-popup').removeClass('hidden');
    $('#js-err-title').removeClass('red green');  // color reset
    $('#js-err-title').html(msg.title);
    $('#js-err-message').html(msg.message);
    $('#js-btn').html(`<button id='js-btn-ok' class="button btn-ok">O K</button>`);
    if (msg.color) {
      $('#js-err-title').addClass(msg.color);
    }  
    if (msg.focus) {  // focus on the error element
        $('#js-err-title').attr('value', msg.focus);
    }
    if (msg.cancel) {   //add a cancel button
        $('#js-btn').append(`&nbsp;&nbsp;&nbsp;&nbsp;<button id='js-btn-cancel' class="button btn-ok">Cancel</button>`);
    }
}
  
function renderError(err){
    const msg = {
      title: "Error",
      message: err,
      color: "red"
    }
    renderMessage(msg);
}

function renderLogStatus(){
    const usr = getAuthInfo();
    if (usr) {
      const firstName = getAuthInfo().firstName;
      if (firstName) {
        $('#js-top-link').empty().append(`<a id='js-logout-link' href="">Sign Out</a>`);
        $('#js-name-main').html(`Hi, ${firstName}!</br>`);
        $('#js-main button').html('Post Your Resume');
      }
    }else {
      $('#js-top-link').empty().append(`<a id='js-login-link' href="">Sign In</a>`);
      $('#js-name-main').empty();
      $('#js-main button').html('Start Here');
    }
}

/* 2nd parameter: filter: 'all', 'user' */
function renderList(resumes, filter = 'all') {
    const usr = getAuthInfo();

    clearSections();
    $('#js-list').removeClass('hidden').attr('value', filter);  // filter setting - to remember the prev page
    // const listTitle = (filter === 'user')? 'My Resume List': 'All Applicants List'; 
    // $('#js-list-title').html(listTitle);

    if (filter ==='user') {
        $('#js-list-title').html(`${usr.firstName}'s Resume List`);
        $('#js-list a').attr('id', 'js-all-list-link').html('Go to All List >');
        $('#js-demo-note').addClass('hidden');
        // history.pushState({}, "a", "user-list");

    } else {
        $('#js-list-title').html('All Applicants List');
        $('#js-demo-note').removeClass('hidden');
        // history.pushState({}, "b", "all-list");

        if (usr) {
            $('#js-list a').attr('id', 'js-user-list-link').html('Go to Your List >');
        } else {
            $('#js-list a').empty();
        }
    }

    $('#js-ul').empty().append(`<li class='li_main'>
            <div class='w2 li_title'>&nbsp;&nbsp;&nbsp;&nbsp; Date</div>
            <div class='w2 li_title'>Name</div>
            <div class='w3 li_title'>Title</div>
            <div class='w1a li_title'>Reporter</div>
            <div class='w1 li_title'>Status</div>
            <div class='w1a li_title'> </div>
        </li>`);

    for (let i = 0; i < resumes.length; i++) {
        const id = resumes[i]._id;
        const created = customDate(new Date(resumes[i].created))[0];

        const name = resumes[i].firstName + ' ' + resumes[i].lastName;
        const title = resumes[i].title;
        const username = resumes[i].submitter.username;
        const admin = resumes[i].submitter.admin;
        const recruiter = resumes[i].submitter.recruiter;
        const status = resumes[i].status;
        let userRole = "";
        if (recruiter) userRole = `<span class='green b'> (recruiter)</span>`;
        if (admin) userRole = `<span class='red b'> (administrator)</span>`;

        $('#js-ul').append(`
        <li class='li_main'>
            <div class='w2'><div><img src='./img/circle-check.svg' alt='checked'></div>
            &nbsp; ${created}</div>
            <div class='w2'>${name}</div>
            <div class='w3'>${title}</div>
            <div class='w1a'>${username}${userRole}</div>
            <div class='w1'>${status}</div>
            <div class='w1a'><a id='${id}' class='thin' href>View Detail ></a></div>
        </li>`);
    }    
}

function renderPrevList(){
window.location.href = `../index.html`;  
  window.history.back();
  // const usr = getAuthInfo();
  //   if ($('#js-list').attr('value') === 'user' && usr) {
  //         getResumeByUser(usr.username); 
  //   } else {
  //       getResumes();
  //   }
}

function getSkillDetailHtml(skills){
    if (!skills.length) return "";

    return skills.map(s => `<div class='skill-box flx'><img class='valign_m' src='./img/circle-check.svg' alt='checked'> <span class='valign_m w300'>${s}</span></div>`).reduce((a, b)=> a + b);
}

function getSchoolDetailHtml(education){
    if (!education.school) return "";

    let degMajor = "";
    const degree = education.degree;
    const major = education.major;

    if (!(degree || major)) degMajor = "";
    if (degree && major) degMajor = `${degree} in ${major}`;
    if (degree && !major) degMajor = degree;
    if (!degree && major) degMajor = 'Major in ' + major;

    return `<legend class='font_m section-border'>Education</legend>
        <div id='js-exp-detail'>
            <div class='blk'>
            <div class="company-div font_m blue">${education.school}</div>
        </div>
        <div class='blk'>
            <div class="al_right w300 pos_comploc">${education.location}</div>
        </div>
        <div class='clr'></div>
            <div class='blk'>
                <div class='inp-full'>
                    <div class='font_ms'>${degMajor}</div>
                </div>
            </div>
        <div class='clr'></div>
    </div>`;
}

function getCompanyDetailHtml(exp) {
    if (!exp.length) return "";
    
    let expHtml = "";
    for (let i = 0; i < exp.length; i++) {
        expHtml += `<div class='blk'>
            <div class="company-div font_m blue">${exp[i].company}</div>
        </div>
        <div class='blk'>
            <div class="al_right w300 pos_comploc">${exp[i].location}</div>
        </div>
        <div class='clr'></div>
        <div class='blk'>
            <div class='font_ms'>${exp[i].title}</div>
        </div>
        <div class='blk'>
            <div class='w300 al_right'>(${exp[i].startYM} - ${exp[i].endYM})</div>
        </div>
        <div class='clr'></div>
        <div class='blk'>
            <div class='inp-full line2'>
                <ul class='ls-s'>
                    <li> ${exp[i].desc}</li>
                </ul>
            </div>
        </div>
        <div class='clr'></div>`;
        // debugger;
    }
    return `<legend class='font_m section-border'>Professional Experience</legend>
    <div id='js-exp-detail'>
        ${expHtml}
    </div>`;
}

function renderDetail(resume) {
    // console.log('render', resume);

    const id = resume._id;
    const loggedUser = getAuthInfo();
    clearSections();
    let phone = resume.phone;
    if (phone.length===10){
      phone = phone.slice(0,3) + '-' + phone.slice(3,6) + '-' + phone.slice(6,10);
    }
  
    $('#js-detail').removeClass('hidden').empty().html(`
    <div class='section-border mg0-all'></div>
        <div class='blk line15'>
            <span>${phone}</span></br>
            <span>${resume.location}</span>
        </div>
        <div class='blk line15 al_right'>
            <a class='thin' href='mailto:${resume.email}'>${resume.email}</a></br>
            <a class='thin' target='_blank' href='${resume.linkedIn}'>${resume.linkedIn}</a>
        </div>                    
        <div class='clr'></div>     
        <div class='blk line_sp'>
            <p class='font_l font_el b inp-full'>${resume.firstName} ${resume.lastName}</p>            
            <div class='font_m mg0'>${resume.title}</div>
            <div class='inp-full ls-s line2'>${resume.summary}
            </div>
        </div>
        <div class='clr'></div>
        <div class='blk'>
            <div id='js-skill-detail' class='inp-full line2'>
            ${getSkillDetailHtml(resume.skill)}
            </div>
        </div>
        <div class='clr'></div>
        ${getCompanyDetailHtml(resume.experience)}
        ${getSchoolDetailHtml(resume.education)}
        <div class='section-border'></div>
        <div class='blk line15 inp-full'>
            <span class='red'>REF#: ${id.slice(-5).toUpperCase()}</span></br>
            Submitted by: ${resume.submitter.username}</br>
            Created on: ${customDate(new Date(resume.created))[0]}</br>
            Last updated on : ${customDate(new Date(resume.updated))[0]}</br></br>
            <div class='inp-full'>
            <img src='../img/${resume.status}.png' alt='Status: ${resume.status}' class='img_w'>
            </div>
        </div>
            <div class='clr'></div>
            <div id='js-detail-btn'>
            <button type="submit" id="js-go-list" class="btn_black">Back to List</button>
        </div>
        <div class=line_sp>* Only admin or submitter can modify or delete the posts.</div>
        <div id='js-admin-form' class='hidden'></div>
        <p class="mg_top"></p> <!--exptra line space-->
    `);

    if (loggedUser){
        if (loggedUser.username === resume.submitter.username || loggedUser.admin) {
            $('#js-detail-btn').append(`<button type="submit" id="js-update" value='${id}' class="btn_black ind_l">Modify</button>
            <button type="submit" id="js-delete" value='${id}' class="btn_black ind_l">Delete</button>`);
        }
    }

    if(loggedUser.admin) {
        $('#js-admin-form').removeClass('hidden').html(`
        <div class='section-border'></div>
        <div class='blk line15 inp-full'>
            <p class='font_ms red'>Status Update (Admin only)</p>
            <form id='js-status-update' method='post'>
                <select id="status" required>
                <option value="Submitted">Submitted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="In Review">In Review</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
                </select>&nbsp; &nbsp; 
                <button id="js-btn-status" type="submit" value='${id}'> Update</button>
            </form>
        </div>
        `);
        $(`#js-status-update option[value = '${resume.status}']`).attr('selected', 'true');
    }
    $(window).scrollTop( $("main").offset().top );       
}

function renderPostResumePage(){
    clearSections();

    $('#js-post').removeClass('hidden');
    $('#js-post form').attr('id', 'js-new-submit');
    $('#js-skill').empty();

    
    $('#js-name-post').html(`${getAuthInfo().firstName},`);
    $('#js-msg-post').html(`Please submit your resume. We will proceed with your application process.`);
    
    $('#js-btn2').html(`<button id="js-btn-post" type="submit" class="button inp">Submit</button>`);
    
    for (let i = 0; i < SKILL_LIST.length; i++) {
        $('#js-skill').append(`<div class='skill-box'>
        <input type="checkbox" name="s${i}" id="s${i}" value="${SKILL_LIST[i]}"/>
        <label for="s${i}"> ${SKILL_LIST[i]}</label>
        </div>`);
    }
    $('#js-skill').append("<div class='clr'></div>");   // finish float sections

    $(window).scrollTop($("main").offset().top); 
}

function renderUpdatePage(resume){
    // console.log(resume);
    clearSections();  
    // $('form#js-update-submit').trigger('reset');
    $('#js-post').removeClass('hidden');    
    $('#js-post form').attr('id', 'js-update-submit');
    $('#js-skill').empty();
    $('#js-name-post').html(`${getAuthInfo().firstName},`);
    $('#js-msg-post').html(`You can update this resume by editing the form below.`);
    for (let i = 0; i < SKILL_LIST.length; i++) {
      $('#js-skill').append(`<div class='skill-box'>
      <input type="checkbox" name="s${i}" id="s${i}" value="${SKILL_LIST[i]}"/>
      <label for="s${i}"> ${SKILL_LIST[i]}</label>
      </div>`);
    }
    $('#js-skill').append("<div class='clr'></div>"); 
    /* Populate more company fields based on the previous input */
    $('#js-exp-sec').empty();
    for (let i = 0; i < resume.experience.length; i++) {
        renderMoreCompany();
    }
    $('#js-btn2').html(`<button id="js-btn-update" value="" type="submit" class="button inp">Update</button>`);

    /* Populate values from the previous submit */
    $('#fname').attr('value', resume.firstName);
    $('#lname').attr('value', resume.lastName);
    $('#email').attr('value', resume.email);
    $('#phone').attr('value', resume.phone);
    $('#linkedin').attr('value', resume.linkedIn);
    $('#loc').attr('value', resume.location);
    $(`#title option[value = '${resume.title}']`).attr('selected', 'true');
    $('#summary').html(resume.summary);
    $('#school').attr('value', resume.education.school);
    $('#locs').attr('value', resume.education.location);
    $('#major').attr('value', resume.education.major);
    $(`#degree option[value = '${resume.education.degree}'`).attr('selected', 'true');
    resume.skill.forEach(s => {
        $(`input[value = '${s}']`).attr('checked', true);
    });

    resume.experience.forEach((exp, compId)=> {
        // console.log(compId, exp);
        $(`#company${compId + 1}`).attr('value', exp.company);
        $(`#loc${compId + 1}`).attr('value', exp.location);
        $(`#title${compId + 1}`).attr('value', exp.title);
        $(`#desc${compId + 1}`).attr('value', exp.desc);
        $(`#start${compId + 1}`).attr('value', exp.startYM);
        $(`#end${compId + 1}`).attr('value', exp.endYM);
    });
    $(window).scrollTop($("main").offset().top); 
}

function renderMoreCompany(){
    // get the next company id
    let compId = 1;
    while($(`#js-company${compId}`).length) {
      compId++;
    }
  
    $('#js-exp-sec').append(`
    <div id='js-company${compId}'>
    <div class='company-div blue'>
    Company ${compId}
    </div>
    <div class='blk'>
      <label for="company${compId}">Name</label>
      <input value="" type="text" name="company${compId}" id="company${compId}" class="inp" placeholder="Company Name" />
    </div>
    <div class='blk'>
      <label for="loc${compId}">Location</label>
      <input value="" type="text" name="loc${compId}" id="loc${compId}" class="inp" placeholder="e.g. Philadelphia, PA" />
    </div>
    <div class='clr'></div>
    <div class='blk'>
      <label for="title${compId}">Title</label></br>
      <input value="" type="text" name="title${compId}" id="title${compId}" class="inp" placeholder="e.g. Software Engineer" />
    </div>
    <div class='blk'>
      <label for="desc${compId}">Description</label></br>
      <input value="" type="text" name="desc${compId}" id="desc${compId}" class="inp" placeholder="e.g. Developed web applications" />
    </div>
    <div class='clr'></div>
    <div class='blk'>
      <label for="start${compId}">Start Month</label></br>
      <input value="" type="month" name="start${compId}" id="start${compId}" class="inp" />
    </div>
    <div class='blk'>
      <label for="end${compId}">End Month</label></br>
      <input value="" type="month" name="end${compId}" id="end${compId}" class="inp" />
    </div>
    <div class='clr'></div></br>
  </div>`);
}

function initPostHtml(){
$('#js-post').html(`
    <p id='js-name-post' class='font_l ind_l'>Name,</p>
    <p id='js-msg-post' class='font_m ind_l'>message</p>
    <p class="line_sp"></p> <!--exptra line space-->
    <form id='ant-1' class="ind_l" method="post">
      <legend class='font_m blue section-border'>Personal Info</legend>
      <fieldset name="personalInfo">
        <div class='blk'>
          <label for="fname">First Name <span class='red-bold'>*</span></label>
          <input value="" type="text" name="fname" id="fname" class="inp" placeholder="" required />
        </div>
        <div class='blk'>
          <label for="lname">Last Name <span class='red-bold'>*</span></label>
          <input value="" type="text" name="lname" id="lname" class="inp" placeholder="" required />
        </div>
        <div class='clr'></div>
        <div class='blk'>
          <label for="email">Email <span class='red-bold'>*</span></label>
          <input value="" type="email" name="email" id="email"class="inp" placeholder="foo@bar.com" required />
        </div>
        <div class='blk'>
            <label for="phone">Phone <span class='red-bold'>*</span></label>
            <input value="" type="number" name="phone" id="phone" class="inp" placeholder="8885551234" required />
        </div>
        <div class='clr'></div>
        <div class='blk'>
          <label for="linkedin">LinkedIn</label>
          <input value="" type="url" name="linkedin" id="linkedin" class="inp" placeholder="https://www.linkedin.com/in/xyz" />
        </div>
        <div class='blk'>
            <label for="loc">Location <span class='red-bold'>*</span></label>
            <input value="" type="text" name="loc" id="loc" class="inp" placeholder="Philadelphia, PA" required />
        </div>
      </fieldset>
      <legend class='font_m  blue section-border'>Summary & Skills</legend>
      <fieldset name="skills">
        <label for="title">Title <span class='red-bold'>*</span></label>
        <select id="title" required>
          <option value="">--Please select a title--</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Web Developer">Web Developer</option>
          <option value="Fullstack Software Engineer">Fullstack Software Engineer</option>
          <option value="Front-end Developer">Front-end Developer</option>
          <option value="Back-end Developer">Back-end Developer</option>
          <option value="DevOps Engineer">DevOps Engineer</option>
          <option value="Data Scientist">Data Scientist</option>
          <option value="Embedded Software Engineer">Embedded Software Engineer</option>
          <option value="QA Engineer">QA Engineer</option>
        </select></br></br>
        <div class='clr'></div>
        <label for="summary">Summary <span class='red-bold'>*</span></label></br>
        <textarea name="summary" id="summary" class="inp-full" placeholder="Please describe your summary in a couple of sentences" rows="5" minlength='3' maxlength='1200' required ></textarea></br></br>
        <label for="skills">Tech Skills - Check all that apply</label>
        <div id='js-skill' class='inp-full line2'>
          <!-- skill list to be loaded here --> 
        </div>
      </fieldset>
      <legend class='font_m blue section-border'>Professional Experience</legend>
      <fieldset id='js-exp-sec' name="experience">
        <div id='js-company1'>
          <div class='company-div blue'>
            Company 1
          </div>
          <div class='blk'>
            <label for="company1">Name</label>
            <input value="" type="text" name="company1" id="company1" class="inp" placeholder="Company Name" />
          </div>
          <div class='blk'>
            <label for="loc1">Location</label>
            <input value="" type="text" name="loc1" id="loc1" class="inp" placeholder="e.g. Philadelphia, PA" />
          </div>
          <div class='clr'></div>
          <div class='blk'>
            <label for="title1">Title</label></br>
            <input value="" type="text" name="title1" id="title1" class="inp" placeholder="e.g. Software Engineer" />
          </div>
          <div class='blk'>
            <label for="desc1">Description</label></br>
            <input value="" type="text" name="desc1" id="desc1" class="inp" placeholder="e.g. Developed web applications" />
          </div>
          <div class='clr'></div>
          <div class='blk'>
            <label for="start1">Start Month</label></br>
            <input value="" type="month" name="start1" id="start1" class="inp" />
          </div>
          <div class='blk'>
            <label for="end1">End Month</label></br>
            <input value="" type="month" name="end1" id="end1" class="inp" />
          </div>
          <div class='clr'></div>
        </div></br>
      </fieldset>
      <a id='js-add-company' href>Add another company ></a>
      <legend class='font_m blue section-border'>Education</legend>
      <fieldset name="education">
        <div class='blk'>
          <label for="school">School</label>
          <input value="" type="text" name="school" id="school" class="inp" placeholder="e.g. University of Florida" />
        </div>
        <div class='blk'>
          <label for="locs">Location</label>
          <input value="" type="text" name="locs" id="locs" class="inp" placeholder="e.g. Gainesville, FL" />
        </div>
        <div class='clr'></div>
        <div class='blk'>
          <label for="major">Major</label>
          <input value="" type="text" name="major" id="major" class="inp" placeholder="e.g. Computer Engineering" />
        </div>
        <div class='blk'></br>
          <label for="degree">Degree</label>
          <select id="degree" >
            <option value="">--Please select a degree--</option>
            <option value="Bachelor Degree">Bachelor Degree</option>
            <option value="Master Degree">Master Degree</option>
            <option value="Doctorial Degree">Doctorial Degree</option>
            <option value="Associate Degree">Associate Degree</option>
            <option value="High School">High School</option>
            <!--<option value="No Formal Eduction">No Formal Education</option>-->
          </select></br></br>
        </div>
        <div class='clr'></div>
      </fieldset>

      <div id='js-btn2'>
        <button id="js-btn-post" type="submit" class="button inp">Submit</button>
      </div>
      <a id='js-post-cancel' href>Cancel and go back to List ></a>

    </form>
    <p class="line_sp"></p> <!--exptra line space-->`);
}