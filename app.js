const futuristicColors = ["#00f18b", "#7DF9FF", "#8A2BE2", "#FF00FF", "#00FFAB", "#FF1493", "#9C27B0", "#03DAC6", "#18FFFF", "#00E5FF", "#B388FF"];
const hours = Array.from({ length: 17 }, (_, i) => i + 6);
let visibleHours = [...hours];
let tasks = [];
let editIndex = null;

function updateVisibleHours() {
  const width = window.innerWidth;
  if (width < 480) visibleHours = [6, 12, 18];
  else if (width < 768) visibleHours = hours.filter((_, i) => i % 4 === 0);
  else if (width < 1024) visibleHours = hours.filter((_, i) => i % 2 === 0);
  else visibleHours = [...hours];
  renderTimeline();
}

function renderTimeline() {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";
  const total = 17;
  hours.forEach((hour, index) => {
    const div = document.createElement("div");
    div.className = "hour-marker";
    div.style.left = `${(index / total) * 100}%`;
    div.style.width = `${100 / total}%`;
    if (visibleHours.includes(hour)) div.innerHTML = `${hour}:00`;
    timeline.appendChild(div);
  });
  tasks.forEach((task, idx) => {
    const bar = document.createElement("div");
    bar.className = "task-bar";
    bar.style.left = `${((task.start - 6) / total) * 100}%`;
    bar.style.width = `${((task.end - task.start) / total) * 100}%`;
    bar.style.backgroundColor = task.status === "Done" ? "#999" : task.color;
    bar.onclick = () => editTask(idx);
    timeline.appendChild(bar);
  });
}

function renderCards() {
  const container = document.getElementById("task-cards");
  container.innerHTML = "";
  tasks.forEach((task, idx) => {
    const card = document.createElement("div");
    card.className = "task-card";
    card.style.opacity = task.status === "Done" ? 1 : 0.5;
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem">
        <div style="width:0.75rem;height:0.75rem;background:${task.color};border-radius:0.125rem"></div>
        <div style="font-weight:bold">${task.name}</div>
      </div>
      <div>Status: ${task.status}</div>
      <div class="task-controls">
        <button onclick="editTask(${idx})" style="background:black;color:white">Edit</button>
        <button onclick="updateStatus(${idx}, 'Done')" style="background:black;color:white">Done</button>
        <button onclick="updateStatus(${idx}, 'Not Done')" style="background:black;color:white">Not Done</button>
        <button onclick="deleteTask(${idx})" style="background:black;color:white">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openModal() {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("task-name").value = "";
  document.getElementById("task-start").value = "";
  document.getElementById("task-end").value = "";
  document.getElementById("modal-title").innerText = "Add New Task";
  editIndex = null;
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function handleAddTask() {
  const name = document.getElementById("task-name").value;
  const start = document.getElementById("task-start").value;
  const end = document.getElementById("task-end").value;
  const startFloat = parseFloat(start.split(":" )[0]) + parseFloat(start.split(":" )[1]) / 60;
  const endFloat = parseFloat(end.split(":" )[0]) + parseFloat(end.split(":" )[1]) / 60;
  const color = futuristicColors[Math.floor(Math.random() * futuristicColors.length)];

  const task = { name, start: startFloat, end: endFloat, color, status: "Not Done" };
  if (editIndex !== null) tasks[editIndex] = task;
  else tasks.push(task);

  closeModal();
  renderTimeline();
  renderCards();
}

function editTask(index) {
  const task = tasks[index];
  const start = `${String(Math.floor(task.start)).padStart(2,'0')}:${String(Math.round((task.start % 1) * 60)).padStart(2,'0')}`;
  const end = `${String(Math.floor(task.end)).padStart(2,'0')}:${String(Math.round((task.end % 1) * 60)).padStart(2,'0')}`;
  document.getElementById("task-name").value = task.name;
  document.getElementById("task-start").value = start;
  document.getElementById("task-end").value = end;
  document.getElementById("modal-title").innerText = "Edit Task";
  editIndex = index;
  document.getElementById("modal").style.display = "flex";
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTimeline();
  renderCards();
}

function updateStatus(index, status) {
  tasks[index].status = status;
  renderTimeline();
  renderCards();
}

window.addEventListener("resize", updateVisibleHours);
window.addEventListener("DOMContentLoaded", () => {
  updateVisibleHours();
  renderCards();
});