document.body.innerHTML = "";

let columns = ["To Do", "In Progress", "Done"];
let columnContainers = {};
let taskCounts = { "To Do": 0, "In Progress": 0, Done: 0 };
columns.forEach((col) => {
  let columnContainer = document.createElement("div");
  columnContainer.id = col.replace(" ", "").toLowerCase();
  columnContainer.style.margin = "10px";
  columnContainer.style.padding = "10px";
  columnContainer.style.width = "30%";
  columnContainer.style.backgroundColor = "#f0f0f0";
  columnContainer.style.border = "1px solid #ccc";
  columnContainer.style.borderRadius = "8px";
  columnContainer.style.display = "inline-block";
  columnContainer.style.verticalAlign = "top";

  let columnTitle = document.createElement("h2");
  columnTitle.innerText = col;
  columnContainer.appendChild(columnTitle);

  columnContainers[col] = columnContainer;
  document.body.appendChild(columnContainer);
});

let chartContainer = document.createElement("div");
chartContainer.style.width = "1000px";
chartContainer.style.height = "500px";
chartContainer.style.margin = "20px auto";
let canvas = document.createElement("canvas");
canvas.id = "taskChart";
chartContainer.appendChild(canvas);
document.body.appendChild(chartContainer);

let taskChart = new Chart(canvas, {
  type: "line",
  data: {
    labels: columns,
    datasets: [
      {
        label: "Количество задач",
        data: [0, 0, 0],
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "#007bff",
        pointBorderColor: "#fff",
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Статистика задач (Line Chart)" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#333",
          font: { size: 14 },
        },
      },
      x: {
        ticks: {
          color: "#333",
          font: { size: 14 },
        },
      },
    },
  },
});

const updateChart = () => {
  taskChart.data.datasets[0].data = Object.values(taskCounts);
  taskChart.update();
};

const createEventDiv = (taskText, taskDate, column) => {
  let eventDiv = document.createElement("div");

  eventDiv.style.padding = "10px";
  eventDiv.style.marginTop = "10px";
  eventDiv.style.borderRadius = "5px";
  eventDiv.style.color = "white";
  eventDiv.draggable = true;

  if (column === "To Do") {
    eventDiv.style.backgroundColor = "#778899";
  } else if (column === "In Progress") {
    eventDiv.style.backgroundColor = "#00BFFF";
  } else if (column === "Done") {
    eventDiv.style.backgroundColor = "#32CD32";
  }

  let eventText = document.createElement("p");
  eventText.innerHTML = `Задача: ${taskText}`;
  eventDiv.appendChild(eventText);
  let eventDate = document.createElement("p");
  eventDate.innerHTML = `Дата: ${taskDate}`;
  eventDiv.appendChild(eventDate);
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = "X";
  deleteButton.style.marginTop = "10px";
  deleteButton.style.padding = "5px 10px";
  deleteButton.style.fontSize = "14px";
  deleteButton.style.backgroundColor = "#dc3545";
  deleteButton.style.color = "white";
  deleteButton.style.border = "none";
  deleteButton.style.borderRadius = "5px";
  deleteButton.style.cursor = "pointer";
  deleteButton.style.position = "relative";
  deleteButton.style.bottom = "90px";
  deleteButton.style.left = "400px";
  deleteButton.addEventListener("click", () => {
    taskCounts[column]--;
    updateChart();
    eventDiv.remove();
    saveTasksToLocalStorage();
  });
  eventDiv.appendChild(deleteButton);
  columnContainers[column].appendChild(eventDiv);
  taskCounts[column]++;
  updateChart();
};

let popUp = document.createElement("div");
let popUpContent = document.createElement("div");
popUp.style.display = "none";
popUp.style.justifyContent = "center";
popUp.style.alignItems = "center";
popUp.appendChild(popUpContent);
popUpContent.style.display = "flex";
popUpContent.style.flexDirection = "column";
popUpContent.style.alignItems = "center";
popUp.style.backgroundColor = "#B0C4DE";
popUp.style.position = "fixed";
popUp.style.borderRadius = "20px";
popUp.style.left = "50%";
popUp.style.top = "50%";
popUp.style.transform = "translate(-50%, -50%)";
popUp.style.padding = "20px";
popUp.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
document.body.style.minHeight = "100vh";

let close = document.createElement("button");
close.id = "closePopUp";
close.innerHTML = "×";
popUpContent.appendChild(close);
close.style.position = "absolute";
close.style.top = "5px";
close.style.right = "10px";
close.style.fontSize = "18px";
close.style.color = "#fff";
close.style.backgroundColor = "transparent";
close.style.border = "none";
close.style.cursor = "pointer";
close.style.transition = "color 0.3s ease";

const closePopUp = () => {
  popUp.style.display = "none";
};
close.addEventListener("click", closePopUp);

let taskInput = document.createElement("input");
taskInput.type = "text";
taskInput.id = "taskInput";
taskInput.placeholder = "Введите задачу";
taskInput.style.marginBottom = "20px";
taskInput.style.padding = "12px 15px";
taskInput.style.fontSize = "16px";
taskInput.style.border = "2px solid #ddd";
taskInput.style.borderRadius = "8px";
taskInput.style.outline = "none";
taskInput.style.transition = "border-color 0.3s ease, box-shadow 0.3s ease";
taskInput.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
popUpContent.appendChild(taskInput);

let calendar = document.createElement("input");
calendar.type = "date";
calendar.id = "calendar";
calendar.style.marginBottom = "10px";
popUpContent.appendChild(calendar);
calendar.style.backgroundColor = "#f0f0f0";
calendar.style.border = "1px solid #ccc";
calendar.style.borderRadius = "8px";
calendar.style.padding = "8px 12px";
calendar.style.fontSize = "14px";
calendar.style.width = "150px";
calendar.style.boxSizing = "border-box";
calendar.style.marginBottom = "10px";
popUpContent.appendChild(calendar);

let addTaskButton = document.createElement("button");
addTaskButton.innerHTML = "Добавить задачу";
addTaskButton.style.padding = "12px 20px";
addTaskButton.style.fontSize = "16px";
addTaskButton.style.backgroundColor = "#007bff";
addTaskButton.style.color = "#fff";
addTaskButton.style.border = "none";
addTaskButton.style.borderRadius = "8px";
addTaskButton.style.cursor = "pointer";
addTaskButton.style.transition = "background-color 0.3s, transform 0.2s";
popUpContent.appendChild(addTaskButton);

document.body.appendChild(popUp);

const openPopUp = () => {
  popUp.style.display = "flex";
};
let openPopUpButton = document.createElement("button");
openPopUpButton.innerHTML = "New task";
openPopUpButton.addEventListener("click", openPopUp);
openPopUpButton.style.padding = "12px 20px";
openPopUpButton.style.fontSize = "16px";
openPopUpButton.style.backgroundColor = "#007bff";
openPopUpButton.style.color = "#fff";
openPopUpButton.style.border = "none";
openPopUpButton.style.borderRadius = "8px";
openPopUpButton.style.cursor = "pointer";
openPopUpButton.style.marginBottom = "20px";
openPopUpButton.style.display = "block";
openPopUpButton.style.marginLeft = "auto";
openPopUpButton.style.marginRight = "auto";
document.body.appendChild(openPopUpButton);

addTaskButton.addEventListener("click", () => {
  let taskText = taskInput.value;
  let taskDate = calendar.value;

  if (taskText && taskDate) {
    createEventDiv(taskText, taskDate, "To Do");
    taskInput.value = "";
    calendar.value = "";
    closePopUp();
  } else {
    alert("Пожалуйста, заполните все поля.");
  }
  saveTasksToLocalStorage();
});

Object.keys(columnContainers).forEach((col) => {
  columnContainers[col].addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  columnContainers[col].addEventListener("drop", (e) => {
    e.preventDefault();
    let task = document.querySelector(".dragging");
    let oldColumn = task.parentNode.querySelector("h2").innerText;
    let newColumn = col;

    if (newColumn === "To Do") {
      task.style.backgroundColor = "#778899";
    } else if (newColumn === "In Progress") {
      task.style.backgroundColor = "#00BFFF";
    } else if (newColumn === "Done") {
      task.style.backgroundColor = "#32CD32";
    }

    taskCounts[oldColumn]--;
    taskCounts[newColumn]++;
    updateChart();

    columnContainers[newColumn].appendChild(task);
    saveTasksToLocalStorage();
  });
});

document.addEventListener("dragstart", (e) => {
  e.target.classList.add("dragging");
});

document.addEventListener("dragend", (e) => {
  e.target.classList.remove("dragging");
});

const saveTasksToLocalStorage = () => {
  const tasks = [];
  columns.forEach((col) => {
    const columnTasks = columnContainers[col].querySelectorAll("div");
    columnTasks.forEach((task) => {
      const text = task
        .querySelector("p:first-child")
        .innerText.replace("Задача: ", "");
      const date = task
        .querySelector("p:last-child")
        .innerText.replace("Дата: ", "");
      tasks.push({ text, date, column: col });
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
const loadTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(({ text, date, column }) => {
    createEventDiv(text, date, column);
  });
};
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);
