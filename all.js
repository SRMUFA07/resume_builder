function loadResumes() {
    const resumes = JSON.parse(localStorage.getItem("resumes")) || [];
    const resumeItems = document.getElementById("resumeItems");
    resumeItems.innerHTML = ""; // Очищаем старый список
  
    resumes.forEach((resume, index) => {
      const listItem = document.createElement("li");
      listItem.className = "resume-item";
  
      listItem.innerHTML = `
        <input type="checkbox" class="resume-checkbox" data-id="${resume.id}">
        <span>${resume.title}</span>
        <button class="actions" title="Действия" onclick="toggleDropdown(${index})">...</button>
        <div class="dropdown" id="dropdown-${index}" style="display:none;">
          <ul>
            <li><a href="#" onclick="openResume(${resume.id})">Открыть</a></li>
            <li><a href="#" onclick="deleteResume(${resume.id})">Удалить</a></li>
          </ul>
        </div>
      `;
  
      resumeItems.appendChild(listItem);
    });

    // Назначаем обработчики событий на чекбоксы
    const checkboxes = document.querySelectorAll(".resume-checkbox");
    checkboxes.forEach((cb) => cb.addEventListener("change", updateDeleteButtonVisibility));

    // Обновляем видимость кнопки удаления
    updateDeleteButtonVisibility();
}

// Функция для обновления видимости кнопки удаления
function updateDeleteButtonVisibility() {
  const checkboxes = document.querySelectorAll(".resume-checkbox");
  const deleteButton = document.getElementById("deleteSelected");
  const selectedCheckboxes = Array.from(checkboxes).filter((cb) => cb.checked);

  deleteButton.style.display = selectedCheckboxes.length > 0 ? "block" : "none";
}

// Функция для отображения/скрытия выпадающего меню
function toggleDropdown(index) {
  const dropdown = document.getElementById(`dropdown-${index}`);
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

function deleteResume(id) {
  const resumes = JSON.parse(localStorage.getItem("resumes")) || [];
  const filteredResumes = resumes.filter((resume) => resume.id !== id);
  localStorage.setItem("resumes", JSON.stringify(filteredResumes));
  loadResumes(); // Обновляем список
}

function openResume(id) {
  const resumes = JSON.parse(localStorage.getItem("resumes")) || [];
  const resume = resumes.find((r) => r.id === id);
  if (resume && resume.fileURL) {
    // Перенаправление на сохранённый Blob URL
    window.open(resume.fileURL, '_blank');
  }
}

// Функция для удаления выбранных резюме
function deleteSelectedResumes() {
  const checkboxes = document.querySelectorAll(".resume-checkbox:checked");
  const resumes = JSON.parse(localStorage.getItem("resumes")) || [];
  const remainingResumes = resumes.filter(
    (resume) => !Array.from(checkboxes).some((cb) => cb.dataset.id == resume.id)
  );
  localStorage.setItem("resumes", JSON.stringify(remainingResumes));
  loadResumes(); // Обновляем список
}

// Загружаем резюме при загрузке страницы
window.onload = loadResumes;