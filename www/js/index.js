document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

// Shared Default Data across all pages
const DEFAULT_PROFILE = {
    fullName: "John Ryan Uy",
    course: "BS Information Technology",
    yearLevel: "3rd Year",
    aboutMe: "I am currently a 3rd Year BSIT student at Xavier University Ateneo de Cagayan, planning on pursuing the field of Web Development. By exploring and tinkering around HTML, CSS, and JavaScript, I create projects that best fit my ideas.",
    skills: "HTML, CSS, Responsive Layout, Debugging, JavaScript, Python",
    facebook: "https://www.facebook.com/johnryan.uy.501/",
    github: "https://github.com/uy-johnryan",
    email: "johnryan.m.uy@gmail.com",
    profilePicture: "img/profile1.jpg"
};

const STORAGE_KEY = "student_profile_data";

function loadProfile() {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (storedData) {
        try {
            return {
                ...DEFAULT_PROFILE,
                ...JSON.parse(storedData)
            };
        } catch (e) {
            console.error("Error parsing profile data:", e);
            return { ...DEFAULT_PROFILE };
        }
    }

    return { ...DEFAULT_PROFILE };
}

function saveProfile(profileData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
}

document.addEventListener("DOMContentLoaded", () => {

    // 0. PROFILE PICTURE / CAMERA LOGIC
    const changePictureBtn = document.getElementById("change-picture-btn");
    const profilePicture = document.getElementById("profile-picture");
    const cameraError = document.getElementById("camera-error");

    if (changePictureBtn && profilePicture) {

        function renderProfilePicture() {
            const data = loadProfile();

            if (data.profilePicture) {
                profilePicture.src = data.profilePicture;
            } else {
                profilePicture.src = "img/profile1.jpg";
            }
        }

        function showCameraError(message) {
            if (cameraError) {
                cameraError.textContent = message;
                cameraError.classList.remove("hidden");
            }
        }

        function hideCameraError() {
            if (cameraError) {
                cameraError.textContent = "";
                cameraError.classList.add("hidden");
            }
        }

        changePictureBtn.addEventListener("click", () => {

            hideCameraError();

            // Make sure Cordova's camera API is available
            if (!navigator.camera) {
                showCameraError(
                    "Camera is unavailable. Please run the application on a Cordova device or emulator."
                );
                return;
            }

            navigator.camera.getPicture(
                function(imageData) {

                    // Camera successfully returned an image
                    const current = loadProfile();

                    // Save the captured image as a Base64 data URL
                    current.profilePicture = "data:image/jpeg;base64," + imageData;

                    saveProfile(current);

                    // Immediately display the new picture
                    profilePicture.src = current.profilePicture;

                    hideCameraError();
                },

                function(error) {

                    // Camera was cancelled
                    if (
                        error === "Camera cancelled." ||
                        error === "No Image Selected" ||
                        error === "Selection cancelled."
                    ) {
                        hideCameraError();
                        return;
                    }

                    // Other camera errors
                    console.error("Camera error:", error);

                    showCameraError(
                        "Unable to access the camera. Please check your device permissions."
                    );
                },

                {
                    quality: 70,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    encodingType: Camera.EncodingType.JPEG,
                    mediaType: Camera.MediaType.PICTURE,
                    targetWidth: 600,
                    targetHeight: 600,
                    correctOrientation: true,
                    saveToPhotoAlbum: false
                }
            );
        });

        // Load saved profile picture when the page opens
        renderProfilePicture();
    }

    // 1. HOMEPAGE LOGIC
    const openEditBtn = document.getElementById("open-edit-btn");
    if (openEditBtn) {
        const displayName = document.getElementById("display-name");
        const displayCourseYear = document.getElementById("display-course-year");
        const displayAbout = document.getElementById("display-about");
        const displaySkills = document.getElementById("display-skills");
        const displayFacebook = document.getElementById("display-facebook");
        const displayGithub = document.getElementById("display-github");
        const displayEmail = document.getElementById("display-email");

        const editModal = document.getElementById("edit-modal");
        const editForm = document.getElementById("edit-profile-form");
        const cancelBtn = document.getElementById("cancel-btn");
        const errorMsg = document.getElementById("error-msg");

        const editName = document.getElementById("edit-name");
        const editCourse = document.getElementById("edit-course");
        const editYear = document.getElementById("edit-year");

        function renderHomepage() {
            const data = loadProfile();
            if (displayName) displayName.textContent = data.fullName;
            if (displayCourseYear) displayCourseYear.textContent = `${data.course} - ${data.yearLevel}`;
            if (displayAbout) displayAbout.textContent = data.aboutMe;
            if (displaySkills) displaySkills.textContent = data.skills;

            if (displayFacebook) {
                displayFacebook.href = data.facebook;
                displayFacebook.textContent = data.facebook || "N/A";
            }
            if (displayGithub) {
                displayGithub.href = data.github;
                displayGithub.textContent = data.github || "N/A";
            }
            if (displayEmail) {
                displayEmail.href = `mailto:${data.email}`;
                displayEmail.textContent = data.email || "N/A";
            }
        }

        openEditBtn.addEventListener("click", () => {
            const data = loadProfile();
            editName.value = data.fullName;
            editCourse.value = data.course;
            editYear.value = data.yearLevel;

            errorMsg.classList.add("hidden");
            editModal.classList.remove("hidden");
        });

        cancelBtn.addEventListener("click", () => editModal.classList.add("hidden"));

        editForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameVal = editName.value.trim();
            const courseVal = editCourse.value.trim();
            const yearVal = editYear.value.trim();

            if (!nameVal || !courseVal || !yearVal) {
                errorMsg.textContent = "Please complete all required fields (Name, Course, Year Level).";
                errorMsg.classList.remove("hidden");
                return;
            }

            const current = loadProfile();
            current.fullName = nameVal;
            current.course = courseVal;
            current.yearLevel = yearVal;

            saveProfile(current);
            renderHomepage();
            editModal.classList.add("hidden");
        });

        renderHomepage();
    }

    // 2. ABOUT PAGE LOGIC
    const openEditAboutBtn = document.getElementById("open-edit-about-btn");
    if (openEditAboutBtn) {
        const displayAboutText = document.getElementById("display-about-text");
        const editAboutModal = document.getElementById("edit-about-modal");
        const editAboutForm = document.getElementById("edit-about-form");
        const editAboutInput = document.getElementById("edit-about-input");
        const cancelAboutBtn = document.getElementById("cancel-about-btn");
        const aboutErrorMsg = document.getElementById("about-error-msg");

        function renderAbout() {
            const data = loadProfile();
            if (displayAboutText) displayAboutText.textContent = data.aboutMe;
        }

        openEditAboutBtn.addEventListener("click", () => {
            const data = loadProfile();
            editAboutInput.value = data.aboutMe;
            aboutErrorMsg.classList.add("hidden");
            editAboutModal.classList.remove("hidden");
        });

        cancelAboutBtn.addEventListener("click", () => editAboutModal.classList.add("hidden"));

        editAboutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const aboutVal = editAboutInput.value.trim();

            if (!aboutVal) {
                aboutErrorMsg.textContent = "About Me description cannot be empty.";
                aboutErrorMsg.classList.remove("hidden");
                return;
            }

            const current = loadProfile();
            current.aboutMe = aboutVal;
            saveProfile(current);
            renderAbout();
            editAboutModal.classList.add("hidden");
        });

        renderAbout();
    }

    // 3. SKILLS PAGE LOGIC
    const openEditSkillsBtn = document.getElementById("open-edit-skills-btn");
    if (openEditSkillsBtn) {
        const displaySkillsList = document.getElementById("display-skills-list");
        const editSkillsModal = document.getElementById("edit-skills-modal");
        const editSkillsForm = document.getElementById("edit-skills-form");
        const editSkillsInput = document.getElementById("edit-skills-input");
        const cancelSkillsBtn = document.getElementById("cancel-skills-btn");
        const skillsErrorMsg = document.getElementById("skills-error-msg");

        function renderSkills() {
            const data = loadProfile();
            if (displaySkillsList) {
                displaySkillsList.innerHTML = "";
                const skillsArray = data.skills.split(",").map(s => s.trim()).filter(s => s.length > 0);
                skillsArray.forEach(skill => {
                    const li = document.createElement("li");
                    li.className = "tag";
                    li.textContent = skill;
                    displaySkillsList.appendChild(li);
                });
            }
        }

        openEditSkillsBtn.addEventListener("click", () => {
            const data = loadProfile();
            editSkillsInput.value = data.skills;
            skillsErrorMsg.classList.add("hidden");
            editSkillsModal.classList.remove("hidden");
        });

        cancelSkillsBtn.addEventListener("click", () => editSkillsModal.classList.add("hidden"));

        editSkillsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const skillsVal = editSkillsInput.value.trim();

            if (!skillsVal) {
                skillsErrorMsg.textContent = "Skills cannot be empty.";
                skillsErrorMsg.classList.remove("hidden");
                return;
            }

            const current = loadProfile();
            current.skills = skillsVal;
            saveProfile(current);
            renderSkills();
            editSkillsModal.classList.add("hidden");
        });

        renderSkills();
    }

    // 4. CONTACT PAGE LOGIC
    const openEditContactBtn = document.getElementById("open-edit-contact-btn");
    if (openEditContactBtn) {
        const contactFacebook = document.getElementById("contact-facebook");
        const contactGithub = document.getElementById("contact-github");
        const contactEmail = document.getElementById("contact-email");

        const editContactModal = document.getElementById("edit-contact-modal");
        const editContactForm = document.getElementById("edit-contact-form");
        const editFacebook = document.getElementById("edit-facebook");
        const editGithub = document.getElementById("edit-github");
        const editEmail = document.getElementById("edit-email");
        const cancelContactBtn = document.getElementById("cancel-contact-btn");
        const contactErrorMsg = document.getElementById("contact-error-msg");

        function renderContact() {
            const data = loadProfile();
            if (contactFacebook) {
                contactFacebook.href = data.facebook;
                contactFacebook.textContent = data.facebook || "N/A";
            }
            if (contactGithub) {
                contactGithub.href = data.github;
                contactGithub.textContent = data.github || "N/A";
            }
            if (contactEmail) {
                contactEmail.href = `mailto:${data.email}`;
                contactEmail.textContent = data.email || "N/A";
            }
        }

        openEditContactBtn.addEventListener("click", () => {
            const data = loadProfile();
            editFacebook.value = data.facebook;
            editGithub.value = data.github;
            editEmail.value = data.email;

            contactErrorMsg.classList.add("hidden");
            editContactModal.classList.remove("hidden");
        });

        cancelContactBtn.addEventListener("click", () => editContactModal.classList.add("hidden"));

        editContactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailVal = editEmail.value.trim();

            if (!emailVal) {
                contactErrorMsg.textContent = "Email Address is required.";
                contactErrorMsg.classList.remove("hidden");
                return;
            }

            const current = loadProfile();
            current.facebook = editFacebook.value.trim();
            current.github = editGithub.value.trim();
            current.email = emailVal;

            saveProfile(current);
            renderContact();
            editContactModal.classList.add("hidden");
        });

        renderContact();
    }
});