import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState({
    todo: [
      "presentatie afronden zonder te stotteren",
      "mensen hebben een keer gelachen tijdens de presentatie",
    ],
    doing: ["presentatie geven", "doen alsof je niet zenuwachtig bent"],
    done: [
      "AI presentatie voorbereiden",
      "een beetje humor verwerkt in presentatie",
    ],
  });

  const [newTask, setNewTask] = useState("");

  const onDragOver = (ev) => {
    ev.preventDefault();
  };

  /**
   * Verwerkt het neerzetten van een taak in een categorie.
   * Wanneer een taak wordt losgelaten over een categorie, wordt deze functie getriggerd.
   * Deze functie haalt de ID van de gesleepte taak op, identificeert de oorspronkelijke categorie
   * vanwaar de taak werd gesleept, verwijdert de taak uit die categorie en voegt het toe aan
   * de categorie waar het werd neergezet.
   *
   * @param {React.DragEvent} ev - Het drag event object.
   * @param {string} cat - De categorie waar de taak wordt neergezet ('todo', 'doing', 'done').
   */
  const onDrop = (ev, cat) => {
    // Voorkomt de standaard HTML drag-and-drop acties vanuit de browser
    ev.preventDefault();

    // Haalt de data op die werd meegegeven met het drag event (de ID van de taak)
    let id = ev.dataTransfer.getData("text");

    // Maakt een diepe kopie van de huidige staat van taken om wijzigingen te kunnen doorvoeren
    let tasksCopy = JSON.parse(JSON.stringify(tasks));

    // Splits de ID om de oorspronkelijke categorie en de index van de taak te krijgen
    let fromCat = id.split("-")[0];
    let taskIndex = parseInt(id.split("-")[1], 10);

    // Haalt de gesleepte taak uit de oorspronkelijke array
    let task = tasksCopy[fromCat][taskIndex];

    // Verwijdert de taak uit de oorspronkelijke categorie
    tasksCopy[fromCat].splice(taskIndex, 1);

    // Voegt de taak toe aan de nieuwe categorie
    tasksCopy[cat].push(task);

    // Update de staat van de taken in de applicatie
    setTasks(tasksCopy);
  };

  const onDragStart = (ev, fromCat, index) => {
    const element = document.getElementById(`task-${fromCat}-${index}`);
    const clone = element.cloneNode(true);

    // Stel de stijl in voor de kloon om doorzichtigheid te verwijderen
    clone.style.opacity = "1";
    clone.style.position = "absolute";
    clone.style.top = "-1000px"; // Positioneer de kloon buiten het scherm

    document.body.appendChild(clone);

    // Stel de kloon in als het sleepbeeld
    ev.dataTransfer.setDragImage(clone, 0, 0);

    // Zorg ervoor dat de kloon uit het DOM wordt verwijderd na het slepen
    setTimeout(() => {
      document.body.removeChild(clone);
    }, 0);

    ev.dataTransfer.setData("text", `${fromCat}-${index}`);
  };

  const addTask = () => {
    if (newTask) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        todo: [...prevTasks.todo, newTask],
      }));
      setNewTask("");
    }
  };

  return (
    <div className="app">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? addTask() : null)}
        placeholder="Voeg een nieuwe taak toe..."
      />
      <button onClick={addTask}>Taak Toevoegen</button>

      <div className="kanban">
        <div
          className="kanban-column todo"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, "todo")}
        >
          <h2>Te Doen</h2>
          {tasks.todo.map((task, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => onDragStart(e, "todo", index)}
              className="task"
            >
              {task}
            </div>
          ))}
        </div>
        <div
          className="kanban-column doing"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, "doing")}
        >
          <h2>Bezig</h2>
          {tasks.doing.map((task, index) => (
            <div
              key={index}
              id={`task-${"todo"}-${index}`} // Dit zorgt voor een unieke ID voor elk taakelement
              draggable
              onDragStart={(e) => onDragStart(e, "todo", index)}
              className="task"
            >
              {task}
            </div>
          ))}
        </div>
        <div
          className="kanban-column done"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, "done")}
        >
          <h2>Gedaan</h2>
          {tasks.done.map((task, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => onDragStart(e, "done", index)}
              className="task"
            >
              {task}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
