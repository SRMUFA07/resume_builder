function addFieldset(containerId, entryClass) {
    const container = document.getElementById(containerId);
    const entry = document.querySelector(`.${entryClass}`).cloneNode(true);
    container.appendChild(entry);
}

function removeFieldset(containerId) {
    const container = document.getElementById(containerId);
    if (container.children.length > 1) {
        container.lastElementChild.remove();
    }
}

function validateImageSize(input) {
    const file = input.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
        alert("Файл слишком большой. Выберите файл размером до 2 МБ.");
        input.value = ""; // Сбросить значение
    }
}

function formatDate(dateString) {
    if (!dateString) return "наст. время";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "long"
    }).format(date);
}

function formatBirthDate(dateString) {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }).format(date);
}

function sortByDateDescending(entries, startDateSelector) {
    return entries.sort((a, b) => {
        const dateAElement = a.querySelector(startDateSelector);
        const dateBElement = b.querySelector(startDateSelector);

        const startDateA = dateAElement ? new Date(dateAElement.value) : null;
        const startDateB = dateBElement ? new Date(dateBElement.value) : null;

        if (!startDateA && !startDateB) return 0;
        if (!startDateA) return 1;
        if (!startDateB) return -1;

        return startDateB - startDateA;
    });
}

const resumeData = {};
function generateResume() {
    resumeData.resumeTitle = document.getElementById("resumeTitle").value.trim();
    resumeData.fullName = document.getElementById("fullName").value.trim();

    const fullName = resumeData.fullName;
    const birthDate = document.getElementById("birthDate").value;
    const city = document.getElementById("city").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const aboutYou = document.getElementById("aboutYou").value;
    const photoInput = document.getElementById("photoUpload");
    const interestsInputs = document.querySelectorAll("#interestsList input");
    const languagesInputs = document.querySelectorAll(".language-entry");
    const experienceEntries = Array.from(document.querySelectorAll(".experience-entry"));
    const educationEntries = Array.from(document.querySelectorAll(".education-entry"));
    const courseEntries = Array.from(document.querySelectorAll(".course-entry"));

    // Проверяем наличие данных перед сортировкой
    const sortedExperience = experienceEntries.length
        ? sortByDateDescending(experienceEntries, 'input[name="jobStartDate"]')
        : [];
    const sortedEducation = educationEntries.length
        ? sortByDateDescending(educationEntries, 'input[name="eduStartDate"]')
        : [];
    const sortedCourses = courseEntries.length
        ? sortByDateDescending(courseEntries, 'input[name="courseStartDate"]')
        : [];

    if (!fullName) {
        alert('Пожалуйста, заполните поле "ФИО".');
        return;
    }

    const sidebarContent = `
        <div class="photo">
            <img src="" alt="Фото">
        </div>
        <p class="font-15-9">Личные данные</p>
        <div class="create-line"></div>
        <p class="font-13-3"><strong>ФИО</strong></p>
        <p class="font-12-5">${fullName || "Не указано"}</p>
        <p class="font-13-3"><strong>Дата рождения</strong></p>
        <p class="font-12-5">${formatBirthDate(birthDate)}</p>
        <p class="font-13-3"><strong>Город</strong></p>
        <p class="font-12-5">${city || "Не указан"}</p>
        <p class="font-13-3"><strong>Телефон</strong></p>
        <p class="font-12-5">${phone || "Не указан"}</p>
        <p class="font-13-3"><strong>Email</strong></p>
        <p class="font-12-5">${email || "Не указан"}</p>
        ${
            interestsInputs.length > 0 && Array.from(interestsInputs).some(input => input.value.trim()) 
            ? `
            <p class="font-15-9">Интересы</p>
            <div class="create-line"></div>
            <ul class="font-13-3">
                ${Array.from(interestsInputs)
                    .map(input => `<li>${input.value || "Не указано"}</li>`)
                    .join("")}
            </ul>
            ` : ""
        }
        ${
            languagesInputs.length > 0 &&
            Array.from(languagesInputs).some(entry =>
                entry.querySelector('input[name="language"]').value.trim() &&
                entry.querySelector('input[name="level"]').value.trim()
            )
            ? `
            <p class="font-15-9">Языки</p>
            <div class="create-line"></div>
            <ul class="font-13-3">
                ${Array.from(languagesInputs)
                    .filter(entry =>
                        entry.querySelector('input[name="language"]').value.trim() &&
                        entry.querySelector('input[name="level"]').value.trim()
                    )
                    .map(entry => `
                        <li style="display: flex; justify-content: space-between;">
                            <span>${entry.querySelector('input[name="language"]').value}</span>
                            <span class="font-12-5">${entry.querySelector('input[name="level"]').value}</span>
                        </li>
                    `)
                    .join("")}
            </ul>
            ` : ""
        }
    `;

    const mainContent = `
        <h1>${fullName || "Не указано"}</h1>
        ${aboutYou.trim() ? `<div class="create-line-gray"></div><p class="font-12-5">${aboutYou}</p>` : ""}
        ${
            experienceEntries.length > 0 &&
            experienceEntries.some(entry => entry.querySelector('input[name="jobTitle"]').value.trim())
            ? `
            <h3>Опыт работы</h3>
            <div class="create-line-gray"></div>
            <ul>
                ${sortByDateDescending(experienceEntries, "jobStartDate")
                    .filter(entry => entry.querySelector('input[name="jobTitle"]').value.trim())
                    .map(entry => `
                    <li>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="font-13-3">${entry.querySelector('input[name="jobTitle"]').value}</span>
                            <span class="font-12-5">${formatDate(entry.querySelector('input[name="jobStartDate"]').value)} — ${formatDate(entry.querySelector('input[name="jobFinishDate"]').value)}</span>
                        </div>
                        ${
                            entry.querySelector('input[name="company"]').value.trim() ||
                            entry.querySelector('textarea[name="jobDescription"]').value.trim()
                            ? `
                            <p class="font-13-5">${entry.querySelector('input[name="company"]').value || ""}</p>
                            <p class="font-12-5">${entry.querySelector('textarea[name="jobDescription"]').value || ""}</p>
                            ` : ""
                        }
                    </li>
                    `)
                    .join("")}
            </ul>
            ` : ""
        }
        ${
            educationEntries.length > 0 &&
            educationEntries.some(entry => entry.querySelector('input[name="educationLevel"]').value.trim())
            ? `
            <h3>Образование и квалификация</h3>
            <div class="create-line-gray"></div>
            <ul>
                ${sortByDateDescending(educationEntries, "eduStartDate")
                    .filter(entry => entry.querySelector('input[name="educationLevel"]').value.trim())
                    .map(entry => `
                    <li>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="font-13-3">${entry.querySelector('input[name="educationLevel"]').value}</span>
                            <span class="font-12-5">${formatDate(entry.querySelector('input[name="eduStartDate"]').value)} — ${formatDate(entry.querySelector('input[name="eduFinishDate"]').value)}</span>
                        </div>
                        <p class="font-13-5">${entry.querySelector('input[name="institution"]').value || ""}</p>
                        <p class="font-12-5">${entry.querySelector('input[name="specialization"]').value || ""}</p>
                    </li>
                    `)
                    .join("")}
            </ul>
            ` : ""
        }
        ${
            courseEntries.length > 0 &&
            courseEntries.some(entry => entry.querySelector('input[name="courseName"]').value.trim())
            ? `
            <h3>Курсы</h3>
            <div class="create-line-gray"></div>
            <ul>
                ${sortByDateDescending(courseEntries, "courseStartDate")
                    .filter(entry => entry.querySelector('input[name="courseName"]').value.trim())
                    .map(entry => `
                    <li>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="font-13-3">${entry.querySelector('input[name="courseName"]').value}</span>
                            <span class="font-12-5">${formatDate(entry.querySelector('input[name="courseStartDate"]').value)} — ${formatDate(entry.querySelector('input[name="courseFinishDate"]').value)}</span>
                        </div>
                        <p class="font-13-5">${entry.querySelector('input[name="courseProvider"]').value || ""}</p>
                    </li>
                    `)
                    .join("")}
            </ul>
            ` : ""
        }
    `;

    document.getElementById("resume").innerHTML = `
        <div class="resume-container">
            <div class="sidebar">${sidebarContent}</div>
            <div class="main-content">${mainContent}</div>
        </div>
    `;

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
        document.querySelector(".photo img").src = e.target.result;
        };
        reader.readAsDataURL(photoInput.files[0]);
    }

    document.getElementById("form-container").style.display = "none";
    document.getElementById("resume-container").style.display = "block";
}

function returnToForm() {
    window.location.href = 'index.html';
}

function saveResume() {
    const resumeContent = document.getElementById("resume").innerHTML;
    const resumeTitle = resumeData.resumeTitle;
    const fullName = resumeData.fullName;
    
    let fileName = "Резюме_";
    if (resumeTitle)
        fileName += `${resumeTitle}`
    else
        fileName += `${fullName}`;
    
    // Удаляем неподходящие символы
    fileName = fileName.replace(/[ ]/g, "_");
    fileName += ".html";

    const htmlContent = `<!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Резюме</title>
            <link rel="stylesheet" href="style.css"> 
            <style>
                .resume-container {
                    width: 900px;
                    max-width: 1200px;
                    margin: 20px auto;
                    padding-right: 20px;
                    background: #F8F8F8;
                    box-shadow: 0 4px 12px 10px rgba(0, 0, 0, 0.1);
                }

                .sidebar {
                    width: 20%;
                    min-width: 224px;
                    background: #6495ed;
                    color: #F8F8F8;
                    padding: 20px;
                }

                .main-content {
                    width: 70%; /* Поменял на 70% для главного контента */
                    padding: 20px;
                }

                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #F8F8F8;
                }

                #form-container {
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    background: #F8F8F8;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                #resume-container {
                    width: 900px;
                    max-width: 1200px;
                    margin: 20px auto;
                    padding: 20px;
                    background: #F8F8F8;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                fieldset {
                    border: 1px solid #ccc;
                    padding: 20px;
                    margin: 20px;
                }

                legend {
                    font-weight: bold;
                }

                input {
                    margin-bottom:5px;
                    margin-top: 5px;
                    margin-right: 5px;
                    margin-left: 0%;
                }

                button {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    padding: 5px 10px;
                    background: #6495ed;
                    color: #F8F8F8;
                    border: none;
                    cursor: pointer;
                }

                button:hover {
                    background: #286090;
                }

                .resume-container {
                    display: flex;
                }

                .sidebar {
                    width: 20%;
                    min-width: 224px;
                    background: #6495ed;
                    color: #F8F8F8;
                    padding: 20px;
                }

                .sidebar img {
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    display: block;
                    background-color: #F8F8F8;
                }

                .main-content {
                    width: 80%;
                    padding: 20px;
                }

                li {
                    list-style-type: none;
                    margin-top: 0;
                    margin-bottom: 20px;
                    padding: 0;
                    font-weight: bold;
                }

                ul {
                    list-style-type: none;
                    margin-top: 0;
                    padding: 0;
                    font-weight: bold;
                }

                .create-line {
                    width: 224px;
                    border-top: 1px solid #fff;
                    padding-bottom: 10px;
                    padding-top: 10px;
                }

                .create-line-gray {
                    width: 612px;
                    border-top: 1px solid #d3d3d3;
                    padding-bottom: 10px;
                    padding-top: 10px;
                }


                .font-12-5 {
                    font-size: 12.5px;
                    margin-top: 0;
                    padding: 0;
                    font-weight: 400;
                }

                .font-13-3 {
                    font-size: 13.3px;
                    font-weight: bold;
                    margin-top: 0;
                    margin-bottom: 0;
                    padding: 0;
                }

                .font-15-9 {
                    font-size: 15.9px;
                    font-weight: bold;
                    margin-top: 30px;
                }

                textarea {
                    resize: none;
                    width: 100%;
                    height: 100px;
                }

                .font-13-5 {
                    font-style: italic;
                    font-size: 13.5px;
                    font-weight: 400;
                    padding-top: 0;
                    margin-top: 0;
                }

                h3 {
                    margin-top: 35px;
                }

                h1 {
                    margin-top: 0;
                }

            </style>
        </head>
        <body>
            ${resumeContent}
        </body>
        </html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const fileURL = URL.createObjectURL(blob); // Создаём URL для файла

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = fileName;
    link.click();

    // Сохраняем URL для последующего использования
    const newResume = {
        id: Date.now(),
        title: fileName,
        content: resumeContent,
        fileURL: fileURL // Сохраняем URL файла
    };

    const resumes = JSON.parse(localStorage.getItem("resumes")) || [];
    resumes.push(newResume);
    localStorage.setItem("resumes", JSON.stringify(resumes));

    alert("Резюме сохранено!");
    document.location = 'all.html';
}
